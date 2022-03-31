import { createSelector } from "reselect";
import { SourceKeyColumns } from ".";

interface S {
  sourceKeyColumns: SourceKeyColumns;
  [_: string]: unknown;
}

export const selectSourceKeyColumnsByPageIndex: (
  s: S
) => Map<number, SourceKeyColumns> = createSelector(
  (s: S) => s.sourceKeyColumns,
  (sourceKeyColumns) => {
    return (sourceKeyColumns ?? []).reduce((acc, columns, prio) => {
      columns.forEach((col) => {
        if (!acc.get(col.pageIndex)) {
          acc.set(col.pageIndex, []);
        }
        if (!acc.get(col.pageIndex)[prio]) {
          acc.get(col.pageIndex)[prio] = [];
        }
        acc.get(col.pageIndex)[prio].push(col);
      });
      return acc;
    }, new Map());
  }
);
