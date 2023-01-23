import { ReactNode } from "react";
import { FixedSizeListProps, ListChildComponentProps } from "react-window";
import { SelectAllCheckboxProps } from "./SelectAllCheckbox";
import { SelectRowProps } from "./SelectRowCheckbox";

/** Nullable array of DatatableRow */
export type Rows<T extends DatatableRow = DatatableRow> = T[] | null;

export type SortDirection = "ASC" | "DESC";

export interface RowsState<T extends DatatableRow = DatatableRow> {
  rows: Rows<T>;
  filteredRows: Rows<T>;
  sorting: { sortBy?: string; sortDirection?: SortDirection };
  filter: Record<string, unknown>;
  serverMode: boolean;
  pageSize: number | undefined;
}

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
}) => Promise<{ rows: T[]; count: number }>;

// export type ColumnType = Omit<ColumnProps, "dataKey"> & {
//   name: string;
//   dataKey?: string;
// };

export interface DatatableColumn {
  name: string;
  dataKey?: string;
  width: number;
  flexGrow?: number;
  flexShrink?: number;
  cellRenderer?: (props: { cellData?: string }) => ReactNode;
}

export type DatatableSupportedTypes = unknown;

export type DatatableRow = Record<string | number, unknown>;

export interface DatatableProps<T extends DatatableRow = DatatableRow>
  extends Partial<Omit<FixedSizeListProps<T>, "rowHeight">> {
  title?: ReactNode;
  columns?: DatatableColumn[];
  rows?: T[];
  loadRows?: LoadRows<T>;
  pageSize?: number;
  minPageSize?: number;
  rowHeight?: number;
  noRowsRenderer?: () => JSX.Element;
  headerHeight?: number;
  onRowClick?: ({ rowData }: { rowData: T }) => void;
  loadAllUpTo?: number;
  rowSort?: Record<string, ((a: unknown, b: unknown) => number) | null>;
  rowSortServer?: string[];
  rowFilter?: RowFilter;
  rowFilterServer?: string[];
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
  downloadCsv?: boolean;
  downloadCsvFilename?: string;
  /** @see https://www.npmjs.com/package/@json2csv/transforms */
  downloadCsvTransforms?: ((
    row: unknown
  ) => Record<string | number, unknown>)[];
  cellVal?: CellValDefault;
  getRowId?: GetRowId;
  selectedRows?: Set<ReturnType<GetRowId>>;
  toggleRowSelection?: SelectRowProps["toggleRowSelection"];
  toggleAllRowsSelection?: SelectAllCheckboxProps["toggleAllRowsSelection"];
  // selectRowCellRenderer?: TableCellRenderer;
  // selectRowHeaderRenderer?: TableHeaderRenderer;
  minimumBatchSize?: number;
  storageId?: string;
}

export type GridCellComponentProps<T extends DatatableRow> =
  ListChildComponentProps<T[]> & {
    columns: DatatableColumn[];
  };

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

export type RowFilter = HeaderRowProps["rowFilter"];

export interface HeaderRowFilterProps {
  name: string;
  changeFilter: ChangeFilter;
}

export interface HeaderRowProps {
  columns: DatatableColumn[];
  visibleColumns: string[];
  tableWidth: number;
  showFilter?: boolean;
  selectedRows?: DatatableProps["selectedRows"];
  rows?: Rows;
  rowFilter?: Record<
    string,
    (({ name, changeFilter }: HeaderRowFilterProps) => ReactNode) | null
  >;
  changeFilter: ChangeFilter;
  sorting?: RowsState["sorting"];
  rowSort: DatatableProps["rowSort"];
  sort?: ({
    sortBy,
    sortDirection,
  }: {
    sortBy: string;
    sortDirection: SortDirection;
  }) => void;
  disableSort?: boolean;
  toggleAllRowsSelection: DatatableProps["toggleAllRowsSelection"];
  toggleRowSelection: DatatableProps["toggleRowSelection"];
}

export type CellRenderer = (props: {
  cellData?: string;
  rowIndex: number;
  columnIndex: number;
}) => ReactNode;

export type CellValDefault = <T extends DatatableRow = DatatableRow>(
  row: T,
  key: string
) => unknown;
