import { styled, useTheme } from "@mui/material/styles";
import { noop } from "lodash-es";
import { CSSProperties } from "react";
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
  toggleAllRowsSelection,
  toggleRowSelection,
  getRowId,
  onRowClick,
}: ListChildComponentProps<T> & {
  rows: DatatableRow<T>[];
  filteredRows: Rows<T> | null;
  columns: DatatableColumn[];
  visibleColumns: string[];
  selectedRows: DatatableProps["selectedRows"];
  toggleAllRowsSelection: DatatableProps["toggleAllRowsSelection"];
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

  const RowComp = StyledRowComp({
    style: { ...style, cursor: onRowClick ? "pointer" : "initial" },
  });

  return row ? (
    <RowComp onClick={onRowClick ? () => onRowClick({ rowData: row }) : noop}>
      {rowElements}
    </RowComp>
  ) : null;
}

function StyledRowComp({ style }: { style: CSSProperties }) {
  const { palette } = useTheme();
  return styled("div")({
    display: "flex",
    alignItems: "center",
    height: 30,
    borderBottom: `1px solid ${palette.divider}`,
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.08)",
    },
    ...style,
  });
}
