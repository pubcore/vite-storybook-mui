import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import {
  InfiniteLoader,
  Table,
  AutoSizer,
  Column,
  TableHeaderRenderer,
  SortDirectionType,
  IndexRange,
  TableCellRenderer,
} from "react-virtualized";
import "react-virtualized/styles.css";
import {
  Pagination,
  CircularProgress,
  Paper,
  useTheme,
  Box,
} from "@mui/material";
import { ActionBar } from "../";
import ColumnSelector from "./ColumnsSelector";
import ColumnHead from "./ColumnHead";
import SelectAllCheckbox from "./SelectAllCheckbox";
import type { SelectAllCheckboxProps } from "./SelectAllCheckbox";
import SelectRowCheckbox from "./SelectRowCheckbox";
import HeaderRow from "./HeaderRow";
import { useTranslation } from "react-i18next";
import { debounce } from "lodash-es";
import initThroat from "throat";
import { autoWidth } from "./autoWidth";
import { useVisibleColumns } from "./useVisibleColumns";
import { useColumnsStorage } from "./useColumnsStorage";
import type {
  CellValDefault,
  DatatableProps,
  GetRowId,
  LoadRows,
  Row,
  RowsState,
} from "./DatatableTypes";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import React from "react";
import { Parser } from "@json2csv/plainjs";
import { saveAs } from "file-saver";
import { LoadingButton } from "@mui/lab";

const throat = initThroat(10);

export default function Datatable({
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
  selectRowCellRenderer = selectRowCellRendererDefault,
  selectRowHeaderRenderer = selectRowHeaderRendererDefault,
  minimumBatchSize = 30,
  storageId,
  availableWidth = 1000,
  setAvailableWidth = null,
  maxWidth = 3000,
  minWidth = 1000,
  ...rest
}: DatatableProps) {
  const { t } = useTranslation();
  const [rowdata, setRowdata] = useState<RowsState>({
    rows: null,
    sorting: {},
    filter: {},
    serverMode: true,
    pageSize: propPageSize,
  });
  const { rows, filter, sorting, serverMode } = rowdata;
  const filteredRows = useMemo(
    () =>
      serverMode
        ? null
        : rows
        ? rows.filter((row) => rowFilterMatch?.({ row, filter, cellVal }))
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
  const containerRef = useCallback((node) => {
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

  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    columns?.map(({ name }) => name) ?? []
  );

  const [columnsSequence, setColumnsSequence] =
    useState<string[]>(selectedColumns);

  const [initialSequence, setInitialSequence] = useState<string[] | null>(null);

  const loadRows = useMemo<LoadRows>(() => {
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
    async (count) => {
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
      ).reduce<Row[]>((acc, { rows }) => acc.concat(rows), []);
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

      let all: { rows: Row[]; count: number } | undefined;
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
    ({ index }) => Boolean((rows ?? [])[index]),
    [rows]
  );

  //loadMoreRows is only called, if "isRowLoaded" is falsy for given row
  const loadMoreRows = useCallback(
    async ({ startIndex, stopIndex }) => {
      if (!loadRows) {
        throw TypeError("loadRows is falsy");
      }

      const { rows: newRows } = (await loadRows({
        startIndex,
        stopIndex,
        filter,
        sorting,
      })) as { rows: Row[] };

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
    const compare = (key: string) => (a: Row, b: Row) =>
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

  const rowGetter = useCallback(
    ({ index }) => (sortedRows || rows)?.[index] || {},
    [rows, sortedRows]
  );

  const handleRowsScroll = useCallback(
    (props) => {
      setPagination((s) => ({
        ...s,
        page: Math.ceil(props.stopIndex / pageSize),
        scrollToIndex: undefined,
      }));
      if (_onRowsRendered.current) {
        _onRowsRendered.current(props);
      }
    },
    [pageSize]
  );

  const handlePageChange = useCallback(
    (event, page) => {
      const scrollToIndex = (page - 1) * pageSize;
      return setPagination((s) => ({ ...s, page, scrollToIndex }));
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
    ({ sortBy, sortDirection }) => {
      if (serverMode ? !rowSortServer?.includes(sortBy) : !rowSort?.[sortBy]) {
        return;
      }

      const compare = (key: string) => (a: Row, b: Row) =>
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
    async ({ name, value }) => {
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

  const headerRowRenderer = useCallback(
    ({ className, style, columns: headColumns }) => {
      return (
        <HeaderRow
          {...{
            columns: headColumns,
            style,
            className,
            visibleColumns,
            showFilter,
            serverMode,
            selectedRows,
            rowFilter,
            rowFilterServer,
            changeFilter,
          }}
        />
      );
    },
    [
      rowFilter,
      serverMode,
      rowFilterServer,
      visibleColumns,
      selectedRows,
      showFilter,
      changeFilter,
    ]
  );

  const height = rowHeight * pageSize + headerHeight;
  const pageCount = Math.ceil(count / pageSize);
  const _onRowsRendered = useRef<(params: IndexRange) => void>();

  //increase available width, if possible
  useEffect(() => {
    if (!setAvailableWidth) return;

    const tableWidth = autoWidth({
      minWidth,
      maxWidth,
      visibleColumns,
    });

    tableWidth != availableWidth && setAvailableWidth(tableWidth);
  }, [availableWidth, setAvailableWidth, minWidth, maxWidth, visibleColumns]);

  // reset width if component is unmounted
  useEffect(() => {
    if (!setAvailableWidth) return;
    return () => setAvailableWidth(minWidth);
  }, [setAvailableWidth, minWidth]);

  const { palette } = useTheme();

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
      let rows: Row[] = [];
      for (let i = 0; i < count; i++) {
        if (!isRowLoaded({ index: i })) {
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
          </Box>
        </ActionBar>
      )}
      <div style={{ flexGrow: 1 }} ref={containerRef}>
        {rows && (
          <InfiniteLoader
            minimumBatchSize={minimumBatchSize}
            threshold={40}
            isRowLoaded={isRowLoaded}
            loadMoreRows={loadMoreRows}
            rowCount={count}
          >
            {({ onRowsRendered, registerChild }) => {
              _onRowsRendered.current = onRowsRendered;
              const columnsWidth =
                60 +
                visibleColumns.reduce((acc, { width }) => acc + width + 10, 0);
              return (
                <AutoSizer disableHeight>
                  {({ width }) => {
                    const horizontalScroll =
                      width > 0 && columnsWidth / width > 1.1 ? true : false;
                    const table = (
                      <Table
                        {...{
                          headerHeight,
                          height,
                          rowGetter,
                          rowHeight,
                          width: horizontalScroll ? columnsWidth : width,
                          noRowsRenderer,
                          headerRowRenderer,
                          onRowClick,
                          onRowsRendered: handleRowsScroll,
                          ref: registerChild,
                          rowCount: count,
                          scrollToIndex: pagination.scrollToIndex,
                          scrollToAlignment: "start",
                          sort: sort,
                          sortBy: sorting.sortBy,
                          sortDirection:
                            sorting.sortDirection as SortDirectionType,
                          ...rest,
                        }}
                      >
                        {(selectedRows
                          ? [
                              <Column
                                columnData={{
                                  selectedRows,
                                  toggleRowSelection,
                                  toggleAllRowsSelection,
                                  rowCount: count,
                                  rows,
                                  getRowId,
                                }}
                                key="_rowSelection"
                                cellRenderer={selectRowCellRenderer}
                                dataKey="_rowSelection"
                                width={40}
                                headerRenderer={selectRowHeaderRenderer}
                                disableSort={true}
                              />,
                            ]
                          : []
                        ).concat(
                          visibleColumns.map(
                            ({ name, dataKey, label, ...rest }) => (
                              <Column
                                key={name}
                                {...{
                                  dataKey: dataKey ?? name,
                                  label: label ?? t(name as "_"),
                                  headerRenderer: ColumnHead,
                                  ...rest,
                                }}
                              />
                            )
                          )
                        )}
                      </Table>
                    );
                    return horizontalScroll ? (
                      <div style={{ width, overflowX: "scroll" }}>{table}</div>
                    ) : (
                      table
                    );
                  }}
                </AutoSizer>
              );
            }}
          </InfiniteLoader>
        )}
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
const emptyFunc = () => {};
const selectRowCellRendererDefault: TableCellRenderer = ({
  columnData: { selectedRows, toggleRowSelection = emptyFunc, getRowId },
  rowIndex,
  rowData,
}) => {
  return (
    <SelectRowCheckbox
      {...{ rowIndex, rowData, toggleRowSelection, selectedRows, getRowId }}
    />
  );
};

const selectRowHeaderRendererDefault = (({
  columnData: { selectedRows, toggleAllRowsSelection, rows },
}: {
  columnData: Partial<SelectAllCheckboxProps>;
}) =>
  toggleAllRowsSelection &&
  rows &&
  selectedRows && (
    <SelectAllCheckbox {...{ selectedRows, toggleAllRowsSelection, rows }} />
  )) as TableHeaderRenderer;

//Trivial row identity is the row object itself as default ...
const getRowIdDefault: GetRowId = ({ row }) => row;
