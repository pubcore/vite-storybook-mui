import { createSelector } from "reselect";
import { selectWorkbook } from "./selectWorkbook";
import { S } from "./State";

export type Page = { name: string; index: number };
export type Pages = Array<Page>;

export const selectPages: (s: S) => Pages = createSelector(
  selectWorkbook,
  (workbook) =>
    workbook.SheetNames.reduce<Pages>(
      (acc, name, index) => acc.concat({ name, index }),
      []
    )
);
