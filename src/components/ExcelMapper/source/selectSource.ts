import { selectColumns } from ".";
import { selectColHeadsByPage } from "./selectColHeadsByPage";
import { selectPages } from "./selectPages";
import { S } from "./State";

export const selectSource = (workbook: S) => ({
  workbook,
  pages: selectPages(workbook),
  columnHeadsByPage: selectColHeadsByPage(workbook),
  columns: selectColumns(workbook).columns,
  columnsByPageindex: selectColumns(workbook).columnsByPageindex,
});

export type Source = ReturnType<typeof selectSource>;
