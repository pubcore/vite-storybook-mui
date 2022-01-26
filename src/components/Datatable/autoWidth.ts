import type { ColumnType } from "./Datatable";

interface autoWidthArgs {
  minWidth: number;
  maxWidth: number;
  visibleColumns: ColumnType[];
}

export function autoWidth({
  minWidth,
  maxWidth,
  visibleColumns,
}: autoWidthArgs) {
  if (minWidth > maxWidth) return maxWidth;
  const columnPadding = 20;
  const columnsWidth = visibleColumns.reduce(
    (acc, { width }) => acc + width + columnPadding,
    100 // tolerance
  );

  if (isNaN(columnsWidth)) throw new TypeError("columnsWidth is NaN");

  return Math.min(maxWidth, Math.max(columnsWidth, minWidth));
}
