import { createSelector } from "reselect";
import { Page } from ".";
import { selectPages } from "./selectPages";
import { S } from "./State";

export const selectPagesByIndex: (s: S) => Map<number, Page> = createSelector(
  selectPages,
  (pages) =>
    pages.reduce(
      (acc, page, index) => acc.set(index, page),
      new Map<number, Page>()
    )
);
