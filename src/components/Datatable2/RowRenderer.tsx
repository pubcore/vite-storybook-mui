import { ListChildComponentProps } from "react-window";
import {
  DatatableColumn,
  DatatableRow,
  DatatableSupportedTypes,
} from "./DatatableTypes";
import { useRowRenderer } from "./useRowRenderer";

export function RowRenderer<T extends Record<string, DatatableSupportedTypes>>({
  index: rowIndex,
  style,
  rows,
  columns,
  visibleColumns,
}: ListChildComponentProps<T> & {
  rows: DatatableRow<T>[];
  columns: DatatableColumn[];
  visibleColumns: string[];
}) {
  const row = rows[rowIndex];

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
