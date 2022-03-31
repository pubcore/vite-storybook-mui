import { createSelector } from "reselect";
import { zip as transpose } from "lodash-es";
import { Page } from "./selectPages";
import { S } from "./State";
import { selectRowsByPage } from "./selectRowsByPage";
import { selectCountOfHeaderRowsByPage } from "./selectCountOfHeaderRowsByPage";

type ColHeadsByPage = Map<Page, Array<string[]>>;

//A ColumnHead constist of "headline rows" plus one (or a few) datarow(s)
export const selectColHeadsByPage: (s: S) => ColHeadsByPage = createSelector(
  selectRowsByPage,
  selectCountOfHeaderRowsByPage,
  (rowsByPage, countOfHeaderRowsPyPage) =>
    Array.from(rowsByPage.entries()).reduce((acc, [page, rows]) => {
      const count = countOfHeaderRowsPyPage.get(page) ?? 0 + 1;
      const headerRows = rows.slice(0, count + 1);

      //ensure that width of a body row is not greater than header width ...
      let index = 0;
      let maxHeaderWidth = 0;
      for (const row of headerRows) {
        if (index < count) {
          maxHeaderWidth = Math.max(maxHeaderWidth, row.length);
        } else if (row.length > maxHeaderWidth) {
          headerRows[index] = row.slice(0, maxHeaderWidth);
        }
        index++;
      }

      //if there is no data-row, add one row
      if (headerRows.length <= count) {
        headerRows.push([]);
      }
      return acc.set(page, transpose(...headerRows));
    }, new Map())
);
