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
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import InfiniteLoader from "react-window-infinite-loader";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import initThroat from "throat";
import ActionBar from "../ActionBar";
import ColumnSelector from "./ColumnsSelector";
import {
  CellValDefault,
  DatatableProps,
  DatatableRow,
  DatatableSupportedTypes,
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
  selectedRows,
  // getRowId = getRowIdDefault,
  toggleRowSelection = noop,
  toggleAllRowsSelection = noop,
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

  const rowGetter = useCallback(
    ({ index }: { index: number }) => (filteredRows || rows)?.[index] || {},
    [rows, filteredRows]
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

  const handlePageChange = useCallback(
    (_e: ChangeEvent<unknown>, page: number) => {
      const scrollToIndex = (page - 1) * pageSize;
      listRef.current?.scrollToItem(scrollToIndex, "start");
      return setPagination((s) => ({ ...s, page, scrollToIndex }));
    },
    [pageSize]
  );

  const height = rowHeight * pageSize;
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
      setRowdata(({ filter, rows, serverMode, sorting, ...rest }) => {
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

  const sort = useCallback(
    ({
      sortBy,
      sortDirection,
    }: {
      sortBy: string;
      sortDirection: SortDirection;
    }) => {
      if (serverMode ? !rowSortServer?.includes(sortBy) : !rowSort?.[sortBy]) {
        return;
      }

      const compare =
        (key: string) => (a: DatatableRow<T>, b: DatatableRow<T>) =>
          rowSort?.[key]?.(cellVal(a, key), cellVal(b, key)) as number;

      setRowdata(({ rows, filteredRows, filter, serverMode, ...rest }) => {
        if (serverMode) {
          request({
            filter,
            sorting: { sortBy, sortDirection },
          });
        }

        return {
          ...rest,
          rows,
          filter,
          serverMode,
          filteredRows: serverMode
            ? null
            : ((r) => (sortDirection === "DESC" ? r.reverse() : r))(
                (filteredRows ?? rows ?? []).slice().sort(compare(sortBy))
              ),
          sorting: { sortBy, sortDirection },
        };
      });
    },
    [serverMode, rowSortServer, rowSort, cellVal, request]
  );

  const columnsWidth = visibleColumns.reduce(
    (acc, { width }) => acc + width,
    0
  );

  return (
    <Paper
      sx={{
        height: 1,
        display: "flex",
        flexDirection: "column",
        "& .ReactVirtualized__Table__row": {
          borderBottom: `1px solid ${palette.divider}`,
          ...(onRowClick ? { cursor: "pointer" } : {}),
        },
        "& .ReactVirtualized__Table__row:hover": {
          backgroundColor: palette.action.hover,
        },
        "& .ReactVirtualized__Table__headerRow": {
          textTransform: "none",
        },
        "& .ReactVirtualized__Table__sortableHeaderIcon": {
          width: "none",
          height: "none",
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
              <h3>{title}</h3> &nbsp;
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
      <div style={{ flexGrow: 1 }}>
        {rows &&
          (rows.length > 0 && columns ? (
            <>
              <AutoSizer disableHeight>
                {({ width }) => (
                  <>
                    <HeaderRow
                      {...{
                        columns,
                        visibleColumns: visibleColumns.map((c) => c.name),
                        changeFilter,
                        tableWidth: columnsWidth,
                        showFilter,
                        selectedRows,
                        toggleAllRowsSelection: () => undefined,
                        rows,
                        sorting,
                      }}
                    />
                    <InfiniteLoader
                      minimumBatchSize={minimumBatchSize}
                      threshold={40}
                      loadMoreItems={loadMoreRowsTest}
                      isItemLoaded={isRowLoaded}
                      itemCount={count}
                    >
                      {({ onItemsRendered, ref }) => {
                        const horizontalScroll =
                          width > 0 && columnsWidth / width > 1.1
                            ? true
                            : false;
                        const table = (
                          <FixedSizeList
                            {...{
                              ref: (instance) => {
                                ref(instance);
                                listRef.current = instance;
                              },
                              headerHeight,
                              height,
                              width: horizontalScroll ? columnsWidth : width,
                              onRowClick,
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
                              sort: sort,
                              sortBy: sorting.sortBy,
                              sortDirection:
                                sorting.sortDirection as SortDirection,
                              ...rest,
                            }}
                          >
                            {(props: ListChildComponentProps<T>) => {
                              return (
                                <RowRenderer<T>
                                  {...{
                                    ...props,
                                    rows,
                                    columns,
                                    visibleColumns: visibleColumns.map(
                                      (c) => c.name
                                    ),
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
                  </>
                )}
              </AutoSizer>
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

// const selectRowCellRendererDefault: TableCellRenderer = ({
//   columnData: { selectedRows, toggleRowSelection, getRowId },
//   rowIndex,
//   rowData,
// }) => (
//   <SelectRowCheckbox
//     {...{ rowIndex, rowData, toggleRowSelection, selectedRows, getRowId }}
//   />
// );

// const selectRowHeaderRendererDefault = (({
//   columnData: { selectedRows, toggleAllRowsSelection, rows },
// }: {
//   columnData: Partial<SelectAllCheckboxProps>;
// }) =>
//   toggleAllRowsSelection &&
//   rows &&
//   selectedRows && (
//     <SelectAllCheckbox {...{ selectedRows, toggleAllRowsSelection, rows }} />
//   )) as TableHeaderRenderer;

// //Trivial row identity is the row object itself as default ...
// const getRowIdDefault: GetRowId = ({ row }) => row;
