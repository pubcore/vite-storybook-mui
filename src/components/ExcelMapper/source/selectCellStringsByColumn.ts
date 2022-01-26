import { Column } from "react-virtualized";
import { createSelector } from "reselect";
import { selectColumns, selectRowsByPage } from ".";
import { selectCountOfHeaderRowsByPage } from "./selectCountOfHeaderRowsByPage";
import { selectPages } from "./selectPages";
import type { S } from "./State";

export const selectCellStringsByColumn: (s: S) => Map<Column, string[]> =
  createSelector(
    selectRowsByPage,
    selectPages,
    selectColumns,
    selectCountOfHeaderRowsByPage,
    (rowsByPage, pages, { columnsByPageindex }, countOfHeaderRowsByPage) => {
      return pages.reduce((acc, page) => {
        const pageColumns = columnsByPageindex[page.index];
        pageColumns.forEach((column) => {
          const colStrings: string[] = [];
          rowsByPage.get(page)?.forEach((row, index) => {
            if (index >= (countOfHeaderRowsByPage.get(page) ?? 0)) {
              colStrings.push(row[column.index]);
            }
          });
          acc.set(column, colStrings);
        });
        return acc;
      }, new Map());
    }
  );
