import {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  ChangeEvent,
  ReactNode,
  useContext,
} from "react";
import { Pagination, Box } from "@mui/material";
import ColumnSelector from "./ColumnsSelector";
import { HeaderRow } from "./HeaderRow";
import { useTranslation } from "react-i18next";
import { debounce } from "lodash-es";
import initThroat from "throat";
import { useColumnsStorage } from "./useColumnsStorage";
import type {
  DatatableProps,
  LoadRows,
  DatatableRow,
  RowsState,
  SortDirection,
  DatatableColumn,
  CellValDefault,
  GetRowId,
} from "./DatatableTypes";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Parser } from "@json2csv/plainjs";
import { saveAs } from "file-saver";
import { LoadingButton } from "@mui/lab";
import { Row } from "./Row";
import { ContainerContext } from "./ContainerContext";
import { TopBar } from "./TopBar";
import { ViewportList } from "react-viewport-list";
import { styled } from "@mui/system";
import { useLoadRows } from "./useLoadRows";

const throat = initThroat(10);

/**
 * Infinitely scrolling and paginated table that is filterable, sortable and supports async and static data loading
 * @template T Datatable row type
 */
export function Main({
  title,
  columns,
  rows: rowsProp,
  loadRows: loadRowsProp, //ignored, if rows is defined
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
}: DatatableProps) {
  const { t } = useTranslation();
  const [rowdata, setRowdata] = useState<RowsState>({
    sorting: {},
    filter: {},
    serverMode: false,
  });
  const { filter, sorting, serverMode } = rowdata;
  const rrows = useRef<DatatableRow[] | null>(null);

  const filteredRows = useMemo(
    () =>
      serverMode && loadRowsProp
        ? null
        : rrows.current
        ? rrows.current.filter((row) =>
            rowFilterMatch ? rowFilterMatch({ row, filter, cellVal }) : true
          )
        : null,
    [cellVal, filter, loadRowsProp, rowFilterMatch, serverMode]
  );

  const [pagination, setPagination] = useState<{
    page: number;
  }>({ page: 1 });

  const { pageSize: pageSizeContainer, bottomBarHeight } =
    useContext(ContainerContext);

  const sortedRows = useMemo(() => {
    const { sortBy, sortDirection } = sorting;
    const compare = (key: string) => (a: DatatableRow, b: DatatableRow) =>
      rowSort?.[key]?.(cellVal(a, key), cellVal(b, key)) as number;

    return !filteredRows
      ? null
      : !sortBy
      ? filteredRows ?? []
      : ((r) =>
          String(sortDirection).toUpperCase() === "DESC" ? r.reverse() : r)(
          (filteredRows ?? []).slice().sort(compare(sortBy))
        );
  }, [cellVal, filteredRows, rowSort, sorting]);

  const rows = sortedRows || rrows.current;
  const count = rows?.length ?? 0;

  const showFilter =
    (count > rowFilterHideUpTo || Object.keys(filter).length > 0) &&
    (!serverMode || (rowFilterServer && rowFilterServer.length > 0)) &&
    Boolean(rowFilter);

  const pageSize = useMemo(
    () => (showFilter ? pageSizeContainer : pageSizeContainer + 1),
    [pageSizeContainer, showFilter]
  );

  const [initialSequence, setInitialSequence] = useState<string[] | null>(null);

  const loadRows = useMemo<LoadRows>(() => {
    return rowsProp
      ? ({ startIndex, stopIndex }: Parameters<LoadRows>[0]) =>
          Promise.resolve({
            rows: rowsProp.slice(startIndex, stopIndex + 1),
            count: rowsProp.length,
          })
      : //if "'loadRows' and 'rows' are undefined, default to empty array"
        loadRowsProp ?? (() => Promise.resolve({ rows: [], count: 0 }));
  }, [loadRowsProp, rowsProp]);

  const loadAll = useCallback(
    async (count: number) => {
      const batchCount = Math.ceil(count / maxResourceLimit);
      const lastPageCount = count % maxResourceLimit;
      return (
        await Promise.all(
          new Array(batchCount).fill(null).map((_, index) =>
            throat(() =>
              loadRows({
                startIndex: index * maxResourceLimit,
                stopIndex: Math.min(
                  (index + 1) * maxResourceLimit - 1,
                  count - 1
                ),
                filter,
                sorting,
              })
            )
          )
        )
      ).reduce<NonNullable<typeof rows>>(
        (acc, result, index) =>
          result
            ? acc.concat(result.rows)
            : acc.concat(
                Array(
                  batchCount >= index + 1 ? lastPageCount : maxResourceLimit
                ).fill(null)
              ),
        []
      );
    },
    [filter, loadRows, maxResourceLimit, sorting]
  );

  //initial load first rows ...
  useEffect(() => {
    let mounted = true;
    async function load() {
      const firstPage = await loadRows({
        startIndex: 0,
        stopIndex: minimumBatchSize - 1,
        sorting,
        filter,
      }).then((result) => {
        return result;
      });

      let countWithoutFilter = 0;
      if (Object.entries(filter).length > 0) {
        await loadRows({
          startIndex: 0,
          stopIndex: 1,
        }).then((result) => {
          countWithoutFilter = result?.count ?? 0;
        });
      } else {
        countWithoutFilter = firstPage?.count ?? 0;
      }

      let all: { rows: DatatableRow[] | null; count: number } | undefined;

      if (!firstPage) {
        all = { rows: null, count: 0 };
      } else if (
        rowsProp ||
        (countWithoutFilter <= loadAllUpTo && countWithoutFilter > pageSize)
      ) {
        all = {
          rows: await loadAll(countWithoutFilter),
          count: countWithoutFilter,
        };
      } else if (countWithoutFilter <= pageSize) {
        all = firstPage;
      }

      const { rows, count } = all ?? firstPage!;

      if (mounted) {
        setRowdata((s) => ({
          ...s,
          serverMode: !all,
        }));
        rrows.current = rows && [
          ...rows,
          ...new Array(count - rows.length).fill(null),
        ];
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
    loadRows,
    pageSize,
    loadAllUpTo,
    minimumBatchSize,
    rowsProp,
    loadAll,
    sorting,
    filter,
  ]);

  const isRowLoaded = useCallback(
    (index: number) => Boolean((rows ?? [])[index]),
    [rows]
  );

  const overscan =
    //to ensure if pageSize is low, only one request happens (initially)
    3 * pageSize < minimumBatchSize
      ? minimumBatchSize - pageSize
      : 2 * minimumBatchSize - pageSize;

  useLoadRows({
    loadRows,
    rowState: rowdata,
    rowsRef: rrows,
    minimumBatchSize,
    pageSize,
    page: pagination.page,
    overscan,
  });

  const handleRowsScroll = useCallback(
    ([startIndex]: [number, number]) => {
      if (startIndex === 0) {
        setInitialIndexOfFirstRow(-1);
      }
      setPagination((s) =>
        s.page != Math.ceil((startIndex + 1) / pageSize)
          ? {
              ...s,
              page: Math.ceil((startIndex + 1) / pageSize),
            }
          : s
      );
    },
    [pageSize]
  );

  const rowGetter = useCallback<({ index }: { index: number }) => DatatableRow>(
    ({ index }) => (sortedRows || rows)?.[index] || ({} as DatatableRow),
    [rows, sortedRows]
  );

  const listRef = useRef<HTMLDivElement | null>(null);

  const handlePageChange = useCallback(
    (_e: ChangeEvent<unknown>, page: number) => {
      setInitialIndexOfFirstRow((page - 1) * pageSize);
      setPagination((s) => ({ ...s, page }));
    },
    [pageSize]
  );

  const changeSort = useCallback(
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
      setInitialIndexOfFirstRow(0);
      setPagination((s) => (s.page === 1 ? s : { ...s, page: 1 }));
      setRowdata(({ filter, serverMode, ...rest }) => {
        return {
          ...rest,
          filter,
          serverMode,
          sorting: { sortBy, sortDirection },
        };
      });
    },
    [serverMode, rowSortServer, rowSort]
  );

  const changeFilter = useCallback(
    async ({ name, value }: { name: string; value: unknown }) => {
      setInitialIndexOfFirstRow(0);
      setPagination((s) => (s.page === 1 ? s : { ...s, page: 1 }));
      setRowdata(({ filter = {}, serverMode, ...rest }) => {
        const newFilter = {
          ...filter,
          [name]: value === "" ? undefined : value,
        };
        if (!rowFilterMatch && !serverMode) {
          console.warn("'rowFilterMatch' is required for client-site filter");
        }
        return {
          ...rest,
          serverMode,
          filter: newFilter,
        };
      });
    },
    [rowFilterMatch]
  );

  const pageCount = Math.ceil(count / pageSize);
  const [isLoadingDownloadCsv, setIsLoadingDownloadCsv] = useState(false);
  const handleDownloadCsv = useCallback(async () => {
    try {
      setIsLoadingDownloadCsv(true);
      let rows: DatatableRow[] = [];
      console.log(count);
      for (let i = 0; i < count; i++) {
        if (isRowLoaded(i)) {
          rows.push(rowGetter({ index: i }));
        } else {
          rows = await loadAll(count);
          break;
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

  const defaultSelected = useMemo(() => columns?.map((c) => c.name), [columns]);

  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    columns?.map(({ name }) => name) ?? []
  );

  const [columnsSequence, setColumnsSequence] =
    useState<string[]>(selectedColumns);

  const resetSequence = useCallback(() => {
    if (defaultSelected && initialSequence) {
      setSelectedColumns(defaultSelected);
      setColumnsSequence([...new Set(defaultSelected.concat(initialSequence))]);
    }
  }, [defaultSelected, initialSequence]);

  const visibleColumns = useMemo(() => {
    const columnsMap = (columns ?? []).reduce(
      (acc, { name, ...rest }) => acc.set(name, rest),
      new Map()
    );

    return columnsSequence.reduce<DatatableColumn[]>(
      (acc, name) =>
        selectedColumns.includes(name)
          ? acc.concat({
              name,
              width: 150,
              cellRenderer: defaultCellRenderer,
              ...columnsMap.get(name),
            })
          : acc,
      []
    );
  }, [columns, columnsSequence, selectedColumns]);

  const visibleColumnNames = useMemo(
    () => visibleColumns.map((vc) => vc.name),
    [visibleColumns]
  );

  const columnsByName = useMemo(
    () =>
      (visibleColumns ?? []).reduce(
        (acc, col) => acc.set(col.name, col),
        new Map()
      ),
    [visibleColumns]
  );

  // with margins
  const fullTableWidth = useMemo(
    () =>
      visibleColumns.reduce(
        (acc, { width }, i) => acc + width + (i === 0 ? 2 : 1) * 10,
        0
      ) + (toggleRowSelection || toggleAllRowsSelection ? 42 : 0),
    [toggleAllRowsSelection, toggleRowSelection, visibleColumns]
  );

  const headerRow = useMemo<ReactNode>(
    () =>
      columnsByName.size > 0 ? (
        <HeaderRow
          {...{
            rows,
            selectedRows,
            rowSort,
            rowSortServer,
            disableSort: rowSort === undefined,
            rowFilter,
            rowFilterServer,
            changeFilter,
            columnsByName,
            visibleColumns: visibleColumnNames,
            tableWidth: fullTableWidth,
            toggleRowSelection,
            toggleAllRowsSelection,
            showFilter,
            sorting,
            sort: changeSort,
            serverMode,
          }}
        />
      ) : null,
    [
      columnsByName,
      rows,
      selectedRows,
      rowSort,
      rowSortServer,
      rowFilter,
      rowFilterServer,
      changeFilter,
      visibleColumnNames,
      fullTableWidth,
      toggleRowSelection,
      toggleAllRowsSelection,
      showFilter,
      sorting,
      changeSort,
      serverMode,
    ]
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

  const columnsSelector = useMemo(
    () =>
      manageColumns &&
      count > 0 &&
      initialSequence && (
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
      ),
    [
      columns,
      columnsSequence,
      count,
      initialSequence,
      manageColumns,
      resetSequence,
      selectedColumns,
    ]
  );

  const downloadCsvButton = useMemo(
    () =>
      downloadCsv &&
      count > 0 && (
        <LoadingButton
          onClick={handleDownloadCsv}
          variant="text"
          startIcon={<FileDownloadIcon />}
          loading={isLoadingDownloadCsv}
        >
          {t("download_csv")}
        </LoadingButton>
      ),
    [count, downloadCsv, handleDownloadCsv, isLoadingDownloadCsv, t]
  );
  const tools = useMemo(
    () => (
      <>
        {downloadCsvButton}
        {columnsSelector}
      </>
    ),
    [columnsSelector, downloadCsvButton]
  );

  const rowStyle = useMemo(() => ({ height: rowHeight }), [rowHeight]);
  const [initialIndexOfFirstRow, setInitialIndexOfFirstRow] = useState(0);

  //fill last page with rows, if applicable
  const items = useMemo(
    () =>
      ((residue) =>
        residue > 0
          ? (rows ?? [])?.concat(new Array(pageSize - residue).fill({}))
          : rows ?? [])(count % pageSize),
    [count, pageSize, rows]
  );

  return (
    <>
      <TopBar {...{ title, isLoading: !rows, tools }} />
      <Box width={1} overflow="auto" flexGrow={1}>
        {rows !== null && (!!rrows.current?.length || serverMode) && columns ? (
          <>
            {headerRow}
            <RowsContainer
              pageSize={pageSize}
              rowHeight={rowHeight}
              tableWidth={fullTableWidth}
              ref={listRef}
            >
              <ViewportList
                key={initialIndexOfFirstRow}
                itemMinSize={rowHeight}
                viewportRef={listRef}
                items={items}
                margin={0}
                overscan={overscan}
                scrollThreshold={5000}
                onViewportIndexesChange={handleRowsScroll}
                initialIndex={initialIndexOfFirstRow}
              >
                {(item, index) => {
                  return (
                    <Row
                      key={rowKey(item, index)}
                      {...{
                        index,
                        rows,
                        style: rowStyle,
                        columns,
                        visibleColumns: visibleColumnNames,
                        selectedRows,
                        toggleRowSelection,
                        toggleAllRowsSelection,
                        getRowId,
                        onRowClick,
                      }}
                    />
                  );
                }}
              </ViewportList>
            </RowsContainer>
          </>
        ) : (
          noRowsRenderer()
        )}
      </Box>
      <Box
        height={bottomBarHeight}
        padding={1}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
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
    </>
  );
}

const noRowsRendererDefault = () => (
  <Box
    height={1}
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
  >
    <h1>{"∅"}</h1>
  </Box>
);

const cellValDefault: CellValDefault = (row, key) => row[key];

//Trivial row identity is the row object itself as default ...
const getRowIdDefault: GetRowId = ({ row }) => row;

function defaultCellRenderer({ cellData }: { cellData: DatatableRow }) {
  try {
    if (typeof cellData === "undefined") return "";
    return typeof cellData === "object"
      ? JSON.stringify(cellData)
      : String(cellData);
  } catch (err) {
    console.warn(err);
    return String(cellData);
  }
}

const rowKey = (r: DatatableRow, index: number) =>
  typeof r === "object" || r === undefined ? index : String(r);

const RowsContainer = styled("div")<{
  tableWidth: number;
  pageSize: number;
  rowHeight: number;
  children: ReactNode;
}>(({ tableWidth, pageSize, rowHeight }) => ({
  position: "relative",
  width: tableWidth,
  minWidth: "100%",
  height: pageSize * rowHeight,
  overflowY: "auto",
}));
