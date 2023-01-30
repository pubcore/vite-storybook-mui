import {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  ChangeEvent,
  ReactNode,
} from "react";
import {
  FixedSizeList,
  ListChildComponentProps,
  ListOnScrollProps,
} from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import { Pagination, CircularProgress, Paper, Box } from "@mui/material";
import { ActionBar } from "..";
import ColumnSelector from "./ColumnsSelector";
import { HeaderRow } from "./HeaderRow";
import { useTranslation } from "react-i18next";
import { debounce } from "lodash-es";
import initThroat from "throat";
import { useVisibleColumns } from "./useVisibleColumns";
import { useColumnsStorage } from "./useColumnsStorage";
import type {
  CellValDefault,
  DatatableProps,
  GetRowId,
  LoadRows,
  DatatableRow,
  RowsState,
  SortDirection,
  DatatableColumn,
} from "./DatatableTypes";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import React from "react";
import { Parser } from "@json2csv/plainjs";
import { saveAs } from "file-saver";
import { LoadingButton } from "@mui/lab";
import { RowRenderer } from "./RowRenderer";

const throat = initThroat(10);

const emptyArray: unknown[] = [];

/**
 * Infinitely scrolling and paginated table that is filterable, sortable and supports async and static data loading
 * @template T Datatable row type (object with string index signature and a `name` property)
 */
export function Datatable<T extends DatatableRow = DatatableRow>({
  title,
  //https://github.com/bvaughn/react-virtualized/blob/master/docs/Column.md
  columns,
  rows: rowsProp, //ignored, if loadRows is defined
  loadRows: loadRowsProp,
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
  downloadCsv = false,
  downloadCsvFilename = "table",
  downloadCsvTransforms,
  cellVal = cellValDefault,
  selectedRows,
  getRowId = getRowIdDefault,
  toggleRowSelection,
  toggleAllRowsSelection,
  minimumBatchSize = 30,
  storageId,
  ...rest
}: DatatableProps<T>) {
  const { t } = useTranslation();
  const [rowdata, setRowdata] = useState<RowsState<T>>({
    rows: null,
    sorting: {},
    filter: {},
    filteredRows: null,
    serverMode: true,
    pageSize: propPageSize,
  });
  const { rows, filter, sorting, serverMode } = rowdata;
  const filteredRows = useMemo(
    () =>
      serverMode
        ? null
        : rows
        ? rows.filter((row) =>
            rowFilterMatch ? rowFilterMatch({ row, filter, cellVal }) : true
          )
        : null,
    [cellVal, filter, rowFilterMatch, rows, serverMode]
  );
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
    Math.max(
      Math.round(
        (availableHeight - 2 * headerHeight + (showFilter ? 0 : headerHeight)) /
          rowHeight
      ),
      minPageSize
    );

  const minHeight = rowHeight * pageSize;

  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    columns?.map(({ name }) => name) ?? []
  );

  const [columnsSequence, setColumnsSequence] =
    useState<string[]>(selectedColumns);

  const [initialSequence, setInitialSequence] = useState<string[] | null>(null);

  const loadRows = useMemo<LoadRows<T>>(() => {
    //if "'loadRows' and 'rows' are undefined, default to empty array"
    return rowsProp
      ? ({ startIndex, stopIndex }: Parameters<LoadRows>[0]) =>
          Promise.resolve({
            rows: rowsProp.slice(startIndex, stopIndex + 1),
            count: rowsProp.length,
          })
      : loadRowsProp ?? (() => Promise.resolve({ rows: [], count: 0 }));
  }, [loadRowsProp, rowsProp]);

  const loadAll = useCallback(
    async (count: number) => {
      const batchCount = Math.ceil(count / maxResourceLimit);
      return (
        await Promise.all(
          new Array(batchCount).fill(null).map((_, index) =>
            throat(() =>
              loadRows({
                startIndex: index * maxResourceLimit,
                stopIndex: (index + 1) * maxResourceLimit - 1,
              })
            )
          )
        )
      ).reduce<T[]>((acc, { rows }) => acc.concat(rows), []);
    },
    [loadRows, maxResourceLimit]
  );

  //initial load first rows ...
  useEffect(() => {
    let mounted = true;

    async function load() {
      const firstPage = await loadRows({
        startIndex: 0,
        stopIndex: minimumBatchSize - 1,
      });

      let all: { rows: T[]; count: number } | undefined;
      if (
        rowsProp ||
        (firstPage.count <= loadAllUpTo && firstPage.count > pageSize)
      ) {
        all = {
          rows: await loadAll(firstPage.count),
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
  }, [loadRows, pageSize, loadAllUpTo, minimumBatchSize, rowsProp, loadAll]);

  const isRowLoaded = useCallback(
    (index: number) => Boolean((rows ?? [])[index]),
    [rows]
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

  const sortedRows = useMemo(() => {
    const { sortBy, sortDirection } = sorting;
    const compare = (key: string) => (a: T, b: T) =>
      rowSort?.[key]?.(cellVal(a, key), cellVal(b, key)) as number;
    return !filteredRows
      ? null
      : !sortBy
      ? filteredRows ?? rows ?? []
      : ((r) =>
          String(sortDirection).toUpperCase() === "DESC" ? r.reverse() : r)(
          (filteredRows ?? rows ?? []).slice().sort(compare(sortBy))
        );
  }, [cellVal, filteredRows, rowSort, rows, sorting]);

  const rowGetter = useCallback<({ index }: { index: number }) => T>(
    ({ index }) => (sortedRows || rows)?.[index] || ({} as T),
    [rows, sortedRows]
  );

  const handleRowsScroll = useCallback(
    ({ scrollOffset }: ListOnScrollProps) => {
      const startIndex = Math.floor(scrollOffset / rowHeight);
      const stopIndex = startIndex + pageSize;
      setPagination((s) => ({
        ...s,
        page: Math.ceil(stopIndex / pageSize),
        scrollToIndex: undefined,
      }));
    },
    [pageSize, rowHeight]
  );

  const listRef = useRef<FixedSizeList | null>(null);

  const handlePageChange = useCallback(
    (_e: ChangeEvent<unknown>, page: number) => {
      const scrollToIndex = (page - 1) * pageSize;
      setPagination((s) => ({ ...s, page, scrollToIndex }));
      listRef.current?.scrollToItem(scrollToIndex, "start");
    },
    [pageSize]
  );

  //request sorted and filtered data from server (serverMode == true)
  const request = useMemo(
    () =>
      debounce(async ({ filter, sorting }) => {
        if (!loadRowsProp) {
          return;
        }
        const { rows, count } = await loadRowsProp({
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
      }, 300),
    [loadRowsProp, pageSize]
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

      const compare = (key: string) => (a: T, b: T) =>
        rowSort?.[key]?.(cellVal(a, key), cellVal(b, key)) as number;

      setRowdata(({ rows, filter, serverMode, ...rest }) => {
        if (serverMode) {
          request({ filter, sorting: { sortBy, sortDirection } });
        }
        return {
          ...rest,
          rows,
          filter,
          serverMode,
          sorting: { sortBy, sortDirection },
        };
      });
    },
    [rowSort, serverMode, rowSortServer, request, cellVal]
  );

  useColumnsStorage({
    storageId,
    staticColumns: useMemo(
      () => columns?.map(({ name }) => name) ?? [],
      [columns]
    ),
    selectedColumns,
    columnsSequence,
    setSelectedColumns,
    setColumnsSequence,
  });

  const { visibleColumns } = useVisibleColumns({
    columns,
    columnsSequence,
    serverMode,
    rowSortServer,
    rowSort,
    selectedColumns,
  });

  const changeFilter = useCallback(
    async ({ name, value }: { name: string; value: unknown }) => {
      setRowdata(({ filter = {}, rows, serverMode, sorting, ...rest }) => {
        const newFilter = {
          ...filter,
          [name]: value === "" ? undefined : value,
        };
        if (serverMode) {
          request({ filter: newFilter, sorting });
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
        };
      });
    },
    [rowFilterMatch, request]
  );

  const finalColumns = (
    columns
      ? [{ name: "_select_row_checkbox", width: 42 }].concat(columns)
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
            disableSort: rowSort === undefined,
            rowFilter,
            changeFilter,
            columns,
            visibleColumns: visibleColumns.map((c) => c.name),
            tableWidth: fullTableWidth,
            toggleRowSelection,
            toggleAllRowsSelection,
            showFilter,
            sorting,
            sort,
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
      sort,
    ]
  );

  const listHeight = rowHeight * pageSize;
  const pageCount = Math.ceil(count / pageSize);

  const defaultSelected = columns?.map((c) => c.name);

  const resetSequence = useCallback(() => {
    if (defaultSelected && initialSequence) {
      setSelectedColumns(defaultSelected);
      setColumnsSequence([...new Set(defaultSelected.concat(initialSequence))]);
    }
  }, [defaultSelected, initialSequence]);

  const [isLoadingDownloadCsv, setIsLoadingDownloadCsv] = useState(false);
  const handleDownloadCsv = useCallback(async () => {
    try {
      setIsLoadingDownloadCsv(true);
      let rows: T[] = [];
      for (let i = 0; i < count; i++) {
        if (!isRowLoaded(i)) {
          rows = await loadAll(count);
          break;
        } else {
          rows.push(rowGetter({ index: i }));
        }
      }
      const parser = new Parser({
        delimiter: ";",
        transforms: downloadCsvTransforms,
      });
      const csv = parser.parse(rows);
      const BOM = "\uFEFF";
      var csvBlob = new Blob([BOM, csv], {
        type: "text/plain;charset=utf-8",
      });
      saveAs(csvBlob, `${downloadCsvFilename ?? "table"}.csv`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingDownloadCsv(false);
    }
  }, [
    count,
    downloadCsvFilename,
    downloadCsvTransforms,
    isRowLoaded,
    loadAll,
    rowGetter,
  ]);

  return (
    <Paper
      sx={{
        height: 1,
        display: "flex",
        flexDirection: "column",
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
            <>{React.isValidElement(title) ? title : null}</>
          )}
          <Box display="flex" gap={1}>
            {downloadCsv && count > 0 && (
              <LoadingButton
                onClick={handleDownloadCsv}
                variant="text"
                startIcon={<FileDownloadIcon />}
                loading={isLoadingDownloadCsv}
              >
                {t("download_csv")}
              </LoadingButton>
            )}
            {manageColumns && count > 0 && initialSequence && (
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
          </Box>
        </ActionBar>
      )}
      <div
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
                ref={containerRef}
                style={{
                  position: "relative",
                  width: fullTableWidth,
                  minWidth: "100%",
                }}
              >
                <InfiniteLoader
                  minimumBatchSize={minimumBatchSize}
                  threshold={40}
                  isItemLoaded={isRowLoaded}
                  loadMoreItems={loadMoreRows}
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
                          height: listHeight,
                          width: "100%",
                          style: {
                            minHeight,
                            overflowX: "hidden",
                            overflowY: "auto",
                          },
                          onItemsRendered,
                          onScroll: handleRowsScroll,
                          itemCount: count,
                          itemSize: rowHeight,
                          ...rest,
                        }}
                      >
                        {(props: ListChildComponentProps<T>) =>
                          RowRenderer<T>({
                            ...props,
                            rows,
                            rowHeight,
                            columns,
                            visibleColumns: visibleColumns.map((c) => c.name),
                            selectedRows,
                            toggleRowSelection,
                            toggleAllRowsSelection,
                            getRowId,
                            onRowClick,
                          })
                        }
                      </FixedSizeList>
                    );
                    return horizontalScroll ? (
                      <div style={{ width, overflowX: "scroll" }}>{table}</div>
                    ) : (
                      table
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

const noRowsRendererDefault = () => (
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

const cellValDefault: CellValDefault = (row, key) => row[key];

//Trivial row identity is the row object itself as default ...
const getRowIdDefault: GetRowId = ({ row }) => row;

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
    ) + (toggleRowSelection || toggleAllRowsSelection ? 42 : 0)
  );
}
