import { ReactNode } from "react";
import { FixedSizeListProps, ListChildComponentProps } from "react-window";
import { SelectAllCheckboxProps } from "./SelectAllCheckbox";
import { SelectRowProps } from "./SelectRowCheckbox";

export type Rows<T extends DatatableRow> = T[] | null;

export type SortDirection = "ASC" | "DESC";

export interface RowsState<T extends DatatableRow = DatatableRow> {
  rows: Rows<T>;
  filteredRows: Rows<T> | null;
  sorting: { sortBy?: string; sortDirection?: SortDirection };
  filter: RowFilter;
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
  filter?: RowFilter;
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

export type DatatableSupportedTypes = string | number | Date;

export type DatatableRow<
  T extends Record<string, DatatableSupportedTypes> = {}
> = T & {
  [key: string]: DatatableSupportedTypes;
  name: string;
};

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
  cellVal?: CellValDefault;
  getRowId?: GetRowId;
  selectedRows?: Set<ReturnType<GetRowId>>;
  toggleRowSelection?: (arg: SelectRowProps["toggleRowSelection"]) => void;
  toggleAllRowsSelection?: (
    arg: SelectAllCheckboxProps["toggleAllRowsSelection"]
  ) => void;
  // selectRowCellRenderer?: TableCellRenderer;
  // selectRowHeaderRenderer?: TableHeaderRenderer;
  minimumBatchSize?: number;
  storageId?: string;
  availableWidth?: number;
  setAvailableWidth?: ((availableWidth: number) => void) | null;
  maxWidth?: number;
  minWidth?: number;
}

export type GridCellComponentProps<
  T extends Record<string, DatatableSupportedTypes>
> = ListChildComponentProps<DatatableRow<T>[]> & {
  columns: DatatableColumn[];
};

type ChangeFilter = ({ name, value }: { name: string; value: unknown }) => void;

export type RowFilterFunction = ({
  name,
  changeFilter,
}: {
  name: string;
  changeFilter: ChangeFilter;
}) => ReactNode;

export type RowFilter = Record<string, RowFilterFunction | null>;

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
  rowFilter?: RowFilter;
  changeFilter: ChangeFilter;
  sorting?: RowsState["sorting"];
  disableSort?: boolean;
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
