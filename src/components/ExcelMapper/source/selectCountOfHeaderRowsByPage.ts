import { createSelector } from "reselect";
import { detectHeadlines } from "../detectHeadlines";
import { Page } from "./selectPages";
import { selectRowsByPage } from "./selectRowsByPage";
import { S } from "./State";

export type CountOfHeaderRowsByPage = Map<Page, number | undefined>;

export const selectCountOfHeaderRowsByPage: (s: S) => CountOfHeaderRowsByPage =
  createSelector(
    selectRowsByPage,
    (rowsByPage) =>
      Array.from(rowsByPage.entries()).reduce(
        (acc, [page, rows]) => acc.set(page, detectHeadlines({ rows })),
        new Map()
      ) ?? new Map()
  );
