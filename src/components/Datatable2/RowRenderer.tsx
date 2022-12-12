import { ListChildComponentProps } from "react-window";
import {
  DatatableColumn,
  DatatableProps,
  DatatableRow,
  DatatableSupportedTypes,
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
}: ListChildComponentProps<T> & {
  rows: DatatableRow<T>[];
  filteredRows: Rows<T> | null;
  columns: DatatableColumn[];
  visibleColumns: string[];
}) {
  const row = filteredRows?.[rowIndex] ?? rows[rowIndex];

  const rowElements = useRowRenderer({
    row,
    rowIndex,
    columns,
    visibleColumns,
  });

  return row ? (
    <div
      style={{
        ...style,
        height: 30,
        borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
      }}
    >
      {rowElements}
    </div>
  ) : null;
}
