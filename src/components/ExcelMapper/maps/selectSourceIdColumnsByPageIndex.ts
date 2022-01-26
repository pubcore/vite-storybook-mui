import { createSelector } from "reselect";
import { SourceIdColumns } from ".";

interface S {
  sourceIdColumns: SourceIdColumns;
  [_: string]: unknown;
}

export const selectSourceIdColumnsByPageIndex: (
  s: S
) => Map<number, SourceIdColumns> = createSelector(
  (s: S) => s.sourceIdColumns,
  (sourceIdColumns) => {
    return (sourceIdColumns ?? []).reduce((acc, columns, prio) => {
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
