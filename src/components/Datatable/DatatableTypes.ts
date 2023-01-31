import { ReactNode } from "react";
import { ListChildComponentProps } from "react-window";
import { SelectAllCheckboxProps } from "./SelectAllCheckbox";
import { SelectRowProps } from "./SelectRowCheckbox";

export type SortDirection = "ASC" | "DESC";

export type RowsState<T extends DatatableRow = DatatableRow> = {
  rows: T[] | null;
  sorting: { sortBy?: string; sortDirection?: SortDirection };
  filter: Record<string, unknown>;
  serverMode: boolean;
};

export type GetRowId = <T extends DatatableRow = DatatableRow>({
  row,
}: {
  row: T;
}) => T | string | number;

export type LoadRows<T extends DatatableRow = DatatableRow> = ({
  startIndex,
  stopIndex,
  filter,
  sorting,
}: {
  startIndex: number;
  stopIndex: number;
  filter?: Record<string, unknown>;
  sorting?: Record<string, unknown>;
}) => Promise<{ rows: T[]; count: number } | null>;

export type DatatableColumn = {
  name: string;
  dataKey?: string;
  label?: string;
  width: number;
  flexGrow?: number;
  flexShrink?: number;
  cellRenderer?: DatatableCellRenderer;
};

export type DatatableSupportedTypes = unknown;

export type DatatableRow = Record<string | number, unknown>;

export type DatatableProps<T extends DatatableRow = DatatableRow> = {
  title?: ReactNode;
  columns?: DatatableColumn[];
  rows?: T[];
  loadRows?: LoadRows<T>;
  pageSize?: number;
  minPageSize?: number;
  rowHeight?: number;
  noRowsRenderer?: () => ReactNode;
  headerHeight?: number;
  onRowClick?: ({ rowData }: { rowData: T }) => void;
  loadAllUpTo?: number;
  rowSort?: Partial<Record<keyof T, ((a: any, b: any) => number) | null>>;
  /**
   * To define which columns have support of server-side sort.
   * If "loadAllUpTo" threshold is exceeded, only this columns will be sortable.
   */
  rowSortServer?: (keyof T)[];
  rowFilter?: RowFilter<T>;
  /**
   * To define which columns have support of server-side filtering.
   * If "loadAllUpTo" threshold is exceeded, only this columns will show filter
   */
  rowFilterServer?: (keyof T)[];
  rowFilterMatch?: ({
    row,
    filter,
    cellVal,
  }: {
    row: T;
    filter: Record<string, unknown>;
    cellVal: unknown;
  }) => boolean;
  rowFilterHideUpTo?: number;
  maxResourceLimit?: number;
  manageColumns?: boolean;
  /**
   * Required to save state of "manageColumns" to local storage.
   */
  storageId?: string;
  downloadCsv?: boolean;
  downloadCsvFilename?: string;
  /**
   * @see https://www.npmjs.com/package/@json2csv/transforms
   */
  downloadCsvTransforms?: ((
    row: unknown
  ) => Record<string | number, unknown>)[];
  cellVal?: CellValDefault;
  getRowId?: GetRowId;
  selectedRows?: Set<ReturnType<GetRowId>>;
  toggleRowSelection?: SelectRowProps["toggleRowSelection"];
  toggleAllRowsSelection?: SelectAllCheckboxProps["toggleAllRowsSelection"];
  minimumBatchSize?: number;
};

export type GridCellComponentProps<T extends DatatableRow> =
  ListChildComponentProps<T[]>;

export type ChangeFilter = ({
  name,
  value,
}: {
  name: string;
  value: unknown;
}) => void;

export type RowFilterFunction = ({
  name,
  changeFilter,
}: {
  name: string;
  changeFilter: ChangeFilter;
}) => ReactNode;

export type RowFilter<T extends DatatableRow> = HeaderRowProps<T>["rowFilter"];

export type HeaderRowFilterProps = {
  name: string;
  changeFilter: ChangeFilter;
};

export type HeaderRowProps<T extends DatatableRow> = {
  columns: DatatableColumn[];
  visibleColumns: string[];
  tableWidth: number;
  showFilter?: boolean;
  selectedRows?: DatatableProps<T>["selectedRows"];
  rows?: T[] | null;
  rowFilter?: Record<
    string,
    (({ name, changeFilter }: HeaderRowFilterProps) => ReactNode) | null
  >;
  changeFilter: ChangeFilter;
  sorting?: RowsState<T>["sorting"];
  rowSort: DatatableProps<T>["rowSort"];
  sort?: ({
    sortBy,
    sortDirection,
  }: {
    sortBy: string;
    sortDirection: SortDirection;
  }) => void;
  disableSort?: boolean;
  toggleAllRowsSelection: DatatableProps<T>["toggleAllRowsSelection"];
  toggleRowSelection: DatatableProps<T>["toggleRowSelection"];
};

export type DatatableCellRenderer<T = any> = (props: {
  columnName: string;
  columnIndex: number;
  rowIndex: number;
  rowData: T;
  cellData?: any;
}) => ReactNode;

export type CellValDefault = <T extends DatatableRow = DatatableRow>(
  row: T,
  key: string
) => unknown;
