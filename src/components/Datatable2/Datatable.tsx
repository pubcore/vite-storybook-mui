import {
  Box,
  CircularProgress,
  Pagination,
  Paper,
  useTheme,
} from "@mui/material";
import {
  ChangeEvent,
  isValidElement,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import InfiniteLoader from "react-window-infinite-loader";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import initThroat from "throat";
import ActionBar from "../ActionBar";
import ColumnSelector from "./ColumnsSelector";
import {
  CellValDefault,
  DatatableColumn,
  DatatableProps,
  DatatableRow,
  DatatableSupportedTypes,
  GetRowId,
  LoadRows,
  RowFilter,
  RowsState,
  SortDirection,
} from "./DatatableTypes";
import { RowRenderer } from "./RowRenderer";
import { HeaderRow } from "./HeaderRow";
import { useVisibleColumns } from "./useVisibleColumns";
import { useColumnsStorage } from "./useColumnsStorage";
import { debounce, noop } from "lodash-es";

const throat = initThroat(10);
const emptyArray: unknown[] = [];

export function Datatable2<T extends DatatableRow>({
  title,
  columns,
  rows: propRows, //ignored, if loadRows is defined
  loadRows,
  pageSize: propPageSize,
  minPageSize = 3,
  headerHeight = 40,
  rowHeight = 30,
  noRowsRenderer = noRowsRendererDefault,
  loadAllUpTo = 100,
  rowSort,
  rowSortServer,
  rowFilter,
  rowFilterServer,
  rowFilterMatch,
  rowFilterHideUpTo = 10,
  onRowClick,
  maxResourceLimit = 100,
  manageColumns = true,
  cellVal = cellValDefault,
  getRowId = getRowIdDefault,
  selectedRows,
  toggleRowSelection,
  toggleAllRowsSelection,
  // selectRowCellRenderer = selectRowCellRendererDefault,
  // selectRowHeaderRenderer = selectRowHeaderRendererDefault,
  minimumBatchSize = 30,
  storageId,
  ...rest
}: DatatableProps<T>) {
  const { t } = useTranslation();
  const { palette } = useTheme();

  const [rowdata, setRowdata] = useState<RowsState<T>>({
    rows: null,
    filteredRows: null,
    sorting: {},
    filter: {},
    serverMode: true,
    pageSize: propPageSize,
  });
  const { rows, filteredRows, filter, sorting, serverMode } = rowdata;
  const count = (filteredRows || rows)?.length ?? 0;
  const [pagination, setPagination] = useState<{
    page: number;
    scrollToIndex?: number;
  }>({ page: 1 });
  const showFilter =
    (count > rowFilterHideUpTo || Object.keys(filter).length > 0) &&
    (!serverMode || (rowFilterServer && rowFilterServer.length > 0)) &&
    Boolean(rowFilter);
  const [availableHeight, setHeight] = useState(
    minPageSize * rowHeight + headerHeight
  );
  const containerRef = useCallback((node: HTMLDivElement) => {
    if (node) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);

  if (rowHeight == 0) {
    throw TypeError("rowHeight is zero");
  }

  const pageSize =
    propPageSize ??
    Math.max(Math.round((availableHeight - 2) / rowHeight), minPageSize);

  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    columns?.map(({ name }) => name) ?? []
  );

  const [columnsSequence, setColumnsSequence] =
    useState<string[]>(selectedColumns);

  const [initialSequence, setInitialSequence] = useState<string[] | null>(null);

  useEffect(() => {
    let mounted = true;
    if (!loadRows && !propRows) {
      console.warn("'loadRows' and 'rows' undefined, default to empty array");
      setRowdata((s) => ({ ...s, serverMode: false, rows: [] }));
      return;
    }

    const _loadRows = propRows
      ? ({ startIndex, stopIndex }: Parameters<LoadRows<T>>[0]) =>
          Promise.resolve({
            rows: propRows.slice(startIndex, stopIndex + 1),
            count: propRows.length,
          })
      : (loadRows as LoadRows<T>);

    async function load() {
      const firstPage = await _loadRows({
        startIndex: 0,
        stopIndex: minimumBatchSize - 1,
      });

      let all: { rows: T[]; count: number } | undefined;

      if (
        propRows ||
        (firstPage.count <= loadAllUpTo && firstPage.count > pageSize)
      ) {
        const batchCount = Math.ceil(firstPage.count / maxResourceLimit);
        all = {
          rows: (
            await Promise.all(
              new Array(batchCount).fill(null).map((_, index) =>
                throat(() =>
                  _loadRows({
                    startIndex: index * maxResourceLimit,
                    stopIndex: (index + 1) * maxResourceLimit - 1,
                  })
                )
              )
            )
          ).reduce(
            (acc, { rows }: { rows: T[] }) => acc.concat(rows),
            emptyArray as T[]
          ),
          count: firstPage.count,
        };
      } else if (firstPage.count <= pageSize) {
        all = firstPage;
      }

      const { rows, count } = all ?? firstPage;

      if (mounted) {
        setRowdata((s) => ({
          ...s,
          serverMode: !all,
          rows: [...rows, ...new Array(count - rows.length).fill(null)],
        }));
        rows?.[0] &&
          setColumnsSequence((sequence) => {
            const newSequence = [
              //use a Set to have distinct column-names
              ...new Set([
                ...sequence,
                //add all columns of first n rows (n == minimumBatchSize)
                ...Array(minimumBatchSize - 1)
                  .fill(null)
                  .reduce(
                    (acc, _, i) => acc.concat(Object.keys(rows[i] ?? {})),
                    []
                  ),
              ]),
            ];
            setInitialSequence(newSequence);
            return newSequence;
          });
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [
    loadAllUpTo,
    loadRows,
    maxResourceLimit,
    minimumBatchSize,
    pageSize,
    propRows,
  ]);

  const isRowLoaded = useCallback(
    (index: number) => Boolean((filteredRows ?? rows ?? [])[index]),
    [rows, filteredRows]
  );

  //loadMoreRows is only called, if "isRowLoaded" is falsy for given row
  const loadMoreRows = useCallback(
    async (startIndex: number, stopIndex: number) => {
      if (!loadRows) {
        throw TypeError("loadRows is falsy");
      }

      const { rows: newRows } = (await loadRows({
        startIndex,
        stopIndex,
        filter,
        sorting,
      })) as { rows: T[] };

      setRowdata(({ rows, ...rest }) =>
        rows
          ? {
              ...rest,
              rows: [
                ...rows.slice(0, startIndex),
                ...newRows,
                ...rows.slice(startIndex + newRows.length),
              ],
            }
          : { rows, ...rest }
      );
    },
    [loadRows, filter, sorting]
  );

  const loadMoreRowsTest = useCallback(
    async (startIndex: number, stopIndex: number) => {
      const time = Date.now();
      await loadMoreRows(startIndex, stopIndex);
    },
    [loadMoreRows]
  );

  // const _onRowsRendered = useRef<(...params: unknown[]) => void>();
  const handleRowsScroll = useCallback(
    (props: Record<"startIndex" | "stopIndex", number>) => {
      setPagination((s) => ({
        ...s,
        page: Math.ceil(props.stopIndex / pageSize),
        scrollToIndex: undefined,
      }));
      // if (_onRowsRendered.current) {
      //   _onRowsRendered.current(props);
      // }
    },
    [pageSize]
  );

  const listRef = useRef<FixedSizeList | null>(null);
  // const infiniteLoaderRef = useRef<InfiniteLoader | null>(null);

  const handlePageChange = useCallback(
    (_e: ChangeEvent<unknown>, page: number) => {
      const scrollToIndex = (page - 1) * pageSize;
      listRef.current?.scrollToItem(scrollToIndex, "start");
      return setPagination((s) => ({ ...s, page, scrollToIndex }));
    },
    [pageSize]
  );

  const minHeight = rowHeight * pageSize;
  const pageCount = Math.ceil(count / pageSize);

  const { visibleColumns } = useVisibleColumns({
    columns,
    columnsSequence,
    serverMode,
    rowSortServer,
    rowSort,
    selectedColumns,
  });

  const defaultSelected = columns?.map((c) => c.name);

  const resetSequence = useCallback(() => {
    if (defaultSelected && initialSequence) {
      setSelectedColumns(defaultSelected);
      setColumnsSequence([...new Set(defaultSelected.concat(initialSequence))]);
    }
  }, [defaultSelected, initialSequence]);

  useColumnsStorage({
    storageId,
    selectedColumns,
    columnsSequence,
    setSelectedColumns,
    setColumnsSequence,
  });

  //request sorted and filtered data from server (serverMode == true)
  const request = useMemo(
    () =>
      debounce(
        async ({
          filter,
          sorting,
        }: {
          filter?: RowFilter;
          sorting?: Record<string, unknown>;
        }) => {
          if (!loadRows) {
            return;
          }
          const { rows, count } = await loadRows({
            startIndex: 0,
            stopIndex: pageSize - 1,
            filter,
            sorting,
          });
          setRowdata((s) => ({
            ...s,
            rows: [...rows, ...new Array(count - rows.length).fill(null)],
          }));
          setPagination((s) => ({ ...s, page: 1, scrollToIndex: 0 }));
        },
        300
      ),
    [loadRows, pageSize]
  );

  const changeFilter = useCallback(
    async ({ name, value }: { name: string; value: unknown }) => {
      setRowdata(({ filter = {}, rows, serverMode, sorting, ...rest }) => {
        const newFilter = {
          ...filter,
          [name]: value === "" ? undefined : value,
        };
        if (serverMode) {
          request({ filter: newFilter as RowFilter, sorting });
        }
        if (!rowFilterMatch && !serverMode) {
          console.warn("'rowFilterMatch' is required for client-site filter");
        }
        return {
          ...rest,
          rows,
          sorting,
          serverMode,
          filter: newFilter,
          filteredRows: serverMode
            ? null
            : rows
            ? rows.filter((row) =>
                rowFilterMatch?.({ row, filter: newFilter, cellVal })
              )
            : null,
        };
      });
    },
    [rowFilterMatch, request, cellVal]
  );

  // without margins
  const columnsWidth = visibleColumns.reduce(
    (acc, { width }) => acc + width,
    0
  );

  const finalColumns = (
    columns
      ? [{ name: "_select_row_checkbox", width: 40 }].concat(columns)
      : emptyArray
  ) as DatatableColumn[];

  // with margins
  const fullTableWidth = columns
    ? getFullTableWidth({
        columns: finalColumns,
        visibleColumns: visibleColumns.map((vc) => vc.name),
        toggleAllRowsSelection,
        toggleRowSelection,
      })
    : 0;

  const headerRow = useMemo<ReactNode>(
    () =>
      columns ? (
        <HeaderRow
          {...{
            rows,
            selectedRows,
            rowSort,
            rowFilter,
            changeFilter,
            columns,
            visibleColumns: visibleColumns.map((c) => c.name),
            tableWidth: fullTableWidth,
            toggleRowSelection,
            toggleAllRowsSelection,
            showFilter,
            sorting,
          }}
        />
      ) : null,
    [
      changeFilter,
      columns,
      fullTableWidth,
      rowFilter,
      rowSort,
      rows,
      selectedRows,
      showFilter,
      sorting,
      toggleAllRowsSelection,
      toggleRowSelection,
      visibleColumns,
    ]
  );

  return (
    <Paper
      sx={{
        height: 1,
        display: "flex",
        flexDirection: "column",
        "& .datatable-row": {
          borderBottom: `1px solid ${palette.divider}`,
        },
      }}
    >
      {rows === null ? (
        <ActionBar elevation={1}>
          &nbsp;
          <CircularProgress color="secondary" />
          &nbsp;
        </ActionBar>
      ) : (
        <ActionBar elevation={1}>
          {typeof title == "string" ? (
            <>
              <h3>{title}</h3>
            </>
          ) : (
            <>{isValidElement(title) ? title : null}</>
          )}
          {manageColumns && count > 0 && (
            <ColumnSelector
              {...{
                columns,
                columnsSequence,
                setSequence: setColumnsSequence,
                resetSequence,
                selected: selectedColumns,
                setSelected: setSelectedColumns,
              }}
            />
          )}
        </ActionBar>
      )}
      <div
        className="datatable_inner_container"
        style={{
          width: "100%",
          overflowX: "auto",
          overflowY: "hidden",
          flexGrow: 1,
          display: "block",
        }}
      >
        {rows &&
          (rows.length > 0 && columns ? (
            <>
              {headerRow}
              <div
                className="infinite_loader_container"
                style={{
                  position: "relative",
                  width: fullTableWidth,
                  minWidth: "100%",
                }}
              >
                <InfiniteLoader
                  minimumBatchSize={minimumBatchSize}
                  threshold={40}
                  loadMoreItems={loadMoreRowsTest}
                  isItemLoaded={isRowLoaded}
                  itemCount={count}
                >
                  {({ onItemsRendered, ref }) => {
                    const width = fullTableWidth;
                    const horizontalScroll =
                      width > 0 && fullTableWidth / width > 1.1 ? true : false;
                    const table = (
                      <FixedSizeList
                        {...{
                          ref: (instance) => {
                            ref(instance);
                            listRef.current = instance;
                          },
                          height: window.innerHeight,
                          width: "100%",
                          style: {
                            minHeight,
                            overflowX: "hidden",
                            overflowY: "auto",
                          },
                          // width: horizontalScroll ? columnsWidth : width,
                          onItemsRendered: (props) => {
                            onItemsRendered(props);
                            handleRowsScroll({
                              startIndex: props.visibleStartIndex,
                              stopIndex: props.visibleStopIndex,
                            });
                          },
                          itemCount: count,
                          itemSize: rowHeight,
                          columnCount: visibleColumns.length,
                          sortBy: sorting.sortBy,
                          sortDirection: sorting.sortDirection as SortDirection,
                          ...rest,
                        }}
                      >
                        {(props: ListChildComponentProps<T>) => {
                          return (
                            <RowRenderer<T>
                              {...{
                                ...props,
                                filteredRows,
                                rows,
                                columns,
                                visibleColumns: visibleColumns.map(
                                  (c) => c.name
                                ),
                                selectedRows,
                                toggleRowSelection,
                                toggleAllRowsSelection,
                                getRowId,
                                onRowClick,
                              }}
                            />
                          );
                        }}
                      </FixedSizeList>
                    );
                    return (
                      <div ref={containerRef}>
                        {horizontalScroll ? (
                          <div style={{ width, overflowX: "scroll" }}>
                            {table}
                          </div>
                        ) : (
                          table
                        )}
                      </div>
                    );
                  }}
                </InfiniteLoader>
              </div>
            </>
          ) : (
            noRowsRenderer()
          ))}
      </div>
      <Box
        sx={{
          padding: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {t("total_count_of_rows", "Total count of rows: {{count}}", {
          count,
        })}
        <Pagination
          count={pageCount}
          page={pagination.page}
          onChange={handlePageChange}
        />
      </Box>
    </Paper>
  );
}

/** Returns the full width of all visible columns, including their margins */
function getFullTableWidth({
  columns,
  visibleColumns,
  toggleRowSelection,
  toggleAllRowsSelection,
}: {
  columns: DatatableColumn[];
  visibleColumns: string[];
  toggleRowSelection: DatatableProps["toggleRowSelection"];
  toggleAllRowsSelection: DatatableProps["toggleAllRowsSelection"];
}) {
  return (
    visibleColumns.reduce(
      (a, c, i) =>
        a +
        columns.find((col) => col.name === c)!.width +
        (i === 0 ? 2 : 1) * 10,
      0
    ) + (toggleRowSelection || toggleAllRowsSelection ? 40 : 0)
  );
}

function noRowsRendererDefault() {
  return (
    <Box
      sx={{
        height: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>{"∅"}</h1>
    </Box>
  );
}

const cellValDefault: CellValDefault = (
  row: DatatableRow<Record<string, DatatableSupportedTypes>>,
  key: string
) => row[key];

const getRowIdDefault: GetRowId = ({ row }) => row;
