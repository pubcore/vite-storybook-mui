import { ReactNode } from "react";
import type {
  ColumnProps,
  TableProps,
  TableCellRenderer,
  TableHeaderRenderer,
  TableHeaderRowProps,
} from "react-virtualized";
import type { SortDirection } from "@mui/material";
import { SelectRowProps } from "./SelectRowCheckbox";
import { SelectAllCheckboxProps } from "./SelectAllCheckbox";

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
  rows?: Row[];
  loadRows?: LoadRows;
  pageSize?: number;
  minPageSize?: number;
  rowHeight?: number;
  noRowsRenderer?: () => JSX.Element;
  loadAllUpTo?: number;
  rowSort?: Record<string, ((a: unknown, b: unknown) => number) | null>;
  rowSortServer?: string[];
  rowFilter?: HeaderRowProps["rowFilter"];
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
  maxResourceLimit?: number;
  manageColumns?: boolean;
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
}

export interface HeaderRowProps
  extends Omit<TableHeaderRowProps, "width" | "height" | "scrollbarWidth"> {
  visibleColumns: ColumnType[];
  showFilter?: boolean;
  selectedRows?: DatatableProps["selectedRows"];
  rowFilter?: Record<
    string,
    ({ name, changeFilter }: HeaderRowFilterProps) => ReactNode
  >;
  changeFilter: ChangeFilter;
}

type ChangeFilter = ({ name, value }: { name: string; value: unknown }) => void;

export interface HeaderRowFilterProps {
  name: string;
  changeFilter: ChangeFilter;
}
export type CellValDefault = (row: Row, key: string) => unknown;
