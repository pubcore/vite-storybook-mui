import { set } from "lodash-es";
import { createSelector } from "reselect";
import { Columns } from "./Column";
import { selectCountOfHeaderRowsByPage } from "./selectCountOfHeaderRowsByPage";
import { selectRowsByPage } from "./selectRowsByPage";
import { S } from "./State";

export const ROW_SEPERATOR = "⏎";

export const selectColumns: (s: S) => {
  columns: Columns;
  columnsByName: Map<string, Columns>;
  /**
   * index of returned array equals column's index in workbook
   */
  columnsByPageindex: Array<Columns>;
} = createSelector(
  selectCountOfHeaderRowsByPage,
  selectRowsByPage,
  (countPerPage, rowsByPage) =>
    Array.from(countPerPage.entries()).reduce<ReturnType<typeof selectColumns>>(
      (acc, [page, countOfHeaderRows]) => {
        rowsByPage
          .get(page)
          ?.slice(0, countOfHeaderRows)
          .reduce((acc2, row) => {
            row.forEach(
              (cellVal, index) =>
                (acc2[index] = acc2[index]
                  ? acc2[index] + ROW_SEPERATOR + String(cellVal).trim()
                  : String(cellVal).trim())
            );
            return acc2;
          }, [])
          .forEach((columname, index) => {
            const column = {
              pageIndex: page.index,
              index,
              name: columname,
            };
            acc.columns.push(column);
            acc.columnsByName.set(
              columname,
              (acc.columnsByName.get(columname) ?? []).concat(column)
            );
            set(acc.columnsByPageindex, [page.index, index], column);
          });
        return acc;
      },
      { columns: [], columnsByName: new Map(), columnsByPageindex: [] }
    )
);
