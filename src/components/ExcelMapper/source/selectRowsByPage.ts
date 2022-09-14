import { createSelector } from "reselect";
import { utils } from "xlsx";
import { Page, selectPages } from "./selectPages";
import { selectWorkbook } from "./selectWorkbook";
import { S } from "./State";

export type RowsByPage = Map<Page, string[][]>;

export const selectRowsByPage: (s: S) => RowsByPage = createSelector(
  selectWorkbook,
  selectPages,
  (workbook, pages) =>
    pages.reduce(
      (acc, page) =>
        acc.set(
          page,
          utils.sheet_to_json<string[]>(workbook.Sheets[page.name]!, {
            header: 1,
            raw: false,
            defval: "",
          })
        ),
      new Map()
    )
);
