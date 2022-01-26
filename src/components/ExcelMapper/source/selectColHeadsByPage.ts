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
      //if there is no data-row, add one row
      if (headerRows.length <= count) {
        headerRows.push([]);
      }
      return acc.set(page, transpose(...headerRows));
    }, new Map())
);
