import type { ReactNode } from "react";
import type {
  ColumnProps,
  TableProps,
  TableCellRenderer,
  TableHeaderRenderer,
  TableHeaderRowProps,
} from "react-virtualized";
import type { SortDirection } from "@mui/material";
import type { SelectRowProps } from "./SelectRowCheckbox";
import type { SelectAllCheckboxProps } from "./SelectAllCheckbox";

export type Row = Record<string, unknown>;
export type Rows = Row[] | null;
export interface RowsState {
  rows: Rows;
  filteredRows: Rows | null;
  sorting: { sortBy?: string; sortDirection?: SortDirection };
  filter: Record<string, unknown>;
  serverMode: boolean;
  pageSize: number | undefined;
}
export type GetRowId = ({ row }: { row: Row }) => Row | string | number;

export type LoadRows = ({
  startIndex,
  stopIndex,
  filter,
  sorting,
}: {
  startIndex: number;
  stopIndex: number;
  filter?: Record<string, unknown>;
  sorting?: Record<string, unknown>;
}) => Promise<{ rows: Row[]; count: number }>;

export type ColumnType = Omit<ColumnProps, "dataKey"> & {
  name: string;
  dataKey?: string;
};
export interface DatatableProps extends Omit<TableProps, "rowHeight"> {
  title?: ReactNode;
  columns?: ColumnType[];
  /**
   * To be used, if all rows exists in memory. If set, "loadRows" is ignored
   */
  rows?: Row[];
  /**
   * Callback to fetch rows during pagination. It is ignored if "rows" is given
   */
  loadRows?: LoadRows;
  pageSize?: number;
  /**
   * Minimum number or rows to show, including empty rows
   */
  minPageSize?: number;
  /**
   * A fixed row height is required to support pagination with infinit scroll
   */
  rowHeight?: number;
  noRowsRenderer?: () => JSX.Element;
  /**
   * If set, and total count of resource's items is not higher, all items
   * will be requested (in batches) in order to support client-site filter
   * and sort.
   */
  loadAllUpTo?: number;
  /**
   * The maximum number of items resource can serve by one request
   */
  maxResourceLimit?: number;
  rowSort?: Record<string, ((a: unknown, b: unknown) => number) | null>;
  /**
   * Name of Columns supporting server-side sorting
   */
  rowSortServer?: string[];
  rowFilter?: HeaderRowProps["rowFilter"];
  /**
   * Name of columns supporting serve-side filtering.
   */
  rowFilterServer?: string[];
  rowFilterMatch?: ({
    row,
    filter,
    cellVal,
  }: {
    row: Row;
    filter: Record<string, unknown>;
    cellVal: unknown;
  }) => boolean;
  rowFilterHideUpTo?: number;
  manageColumns?: boolean;
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
  toggleRowSelection?: (arg: SelectRowProps["toggleRowSelection"]) => void;
  toggleAllRowsSelection?: (
    arg: SelectAllCheckboxProps["toggleAllRowsSelection"]
  ) => void;
  selectRowCellRenderer?: TableCellRenderer;
  selectRowHeaderRenderer?: TableHeaderRenderer;
  minimumBatchSize?: number;
  storageId?: string;
  availableWidth?: number;
  setAvailableWidth?: ((availableWidth: number) => void) | null;
  maxWidth?: number;
  minWidth?: number;
}

export interface HeaderRowProps
  extends Omit<TableHeaderRowProps, "width" | "height" | "scrollbarWidth"> {
  visibleColumns: ColumnType[];
  showFilter?: boolean;
  selectedRows?: DatatableProps["selectedRows"];
  rowFilter?: Record<
    string,
    (({ name, changeFilter }: HeaderRowFilterProps) => ReactNode) | null
  >;
  changeFilter: ChangeFilter;
}

type ChangeFilter = ({ name, value }: { name: string; value: unknown }) => void;

export interface HeaderRowFilterProps {
  name: string;
  changeFilter: ChangeFilter;
}
export type CellValDefault = (row: Row, key: string) => unknown;
