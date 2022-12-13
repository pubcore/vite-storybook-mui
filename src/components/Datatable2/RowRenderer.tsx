import { Box } from "@mui/material";
import { noop } from "lodash-es";
import { ListChildComponentProps } from "react-window";
import {
  DatatableColumn,
  DatatableProps,
  DatatableRow,
  DatatableSupportedTypes,
  GetRowId,
  Rows,
} from "./DatatableTypes";
import { useRowRenderer } from "./useRowRenderer";

export function RowRenderer<
  T extends Record<string, DatatableSupportedTypes> & { name: string }
>({
  index: rowIndex,
  style,
  rows,
  filteredRows,
  columns,
  visibleColumns,
  selectedRows,
  toggleRowSelection,
  getRowId,
  onRowClick,
}: ListChildComponentProps<T> & {
  rows: DatatableRow<T>[];
  filteredRows: Rows<T> | null;
  columns: DatatableColumn[];
  visibleColumns: string[];
  selectedRows: DatatableProps["selectedRows"];
  toggleRowSelection: DatatableProps["toggleRowSelection"];
  getRowId: GetRowId;
  onRowClick: DatatableProps["onRowClick"];
}) {
  const row = filteredRows?.[rowIndex] ?? rows[rowIndex];

  const rowElements = useRowRenderer({
    row,
    rowIndex,
    columns,
    visibleColumns,
    selectedRows,
    toggleRowSelection,
    getRowId,
  });

  return row ? (
    <Box
      sx={{
        ...style,
        height: 30,
        borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
        ...(onRowClick ? { cursor: "pointer" } : {}),
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.08)",
        },
      }}
      onClick={onRowClick ?? noop}
    >
      {rowElements}
    </Box>
  ) : null;
}
