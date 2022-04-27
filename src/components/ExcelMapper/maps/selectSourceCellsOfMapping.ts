import { createSelector } from "reselect";
import { WorkBook } from "xlsx";
import { Mapping, SourceKeyColumns } from ".";
import { selectRowsByPage } from "../source";
import { Column } from "../source/Column";
import { selectPagesByIndex } from "../source/selectPageByIndex";
import { IdTree, Rows, selectIdMaps } from "./selectIdMaps";

export type SourceCells = {
  id: string[];
  cells: Array<{ column: Column; rowIndex: number; value?: string }>;
};

type S = {
  workbook: WorkBook;
  sourceKeyColumns: SourceKeyColumns;
  [_: string]: unknown;
};
export const selectSourceCellsOfMapping: (
  s: S,
  m: Mapping
) => Array<SourceCells> = createSelector(
  selectIdMaps,
  (_: S, mapping: Mapping) => mapping,
  (idMapsReult, mapping) => {
    const ids = idMapsReult[0].ids;
    const sourceCollumns = mapping.sourceColumns;
    const sourceCells: SourceCells[] = [];
    const sourceRowsByPage = selectRowsByPage(mapping.workbook);
    const pageByIndex = selectPagesByIndex(mapping.workbook);

    function mapIdTreeToSourceCells(
      ids: IdTree | Rows,
      parentIds: string[] = []
    ) {
      ids.forEach((subTree, id) => {
        const rowIndexByPageIndex = new Map<number, number | undefined>();

        if (Array.isArray(subTree)) {
          rowIndexByPageIndex.set(id as number, subTree[0]);
        } else {
          mapIdTreeToSourceCells(
            subTree as IdTree,
            parentIds.concat(id as string)
          );
        }

        if (rowIndexByPageIndex.size > 0) {
          const cells = sourceCollumns.reduce((acc, column) => {
            const page = pageByIndex.get(column.pageIndex);
            if (!page) {
              return acc;
            }
            const rowIndex = rowIndexByPageIndex.get(page.index);
            if (rowIndex === undefined) {
              return acc;
            }
            const value =
              sourceRowsByPage.get(page)?.[rowIndex]?.[column.index];
            const cell = { column, rowIndex, value };
            return acc.concat(cell);
          }, [] as SourceCells["cells"]);

          if (cells.length > 0) {
            sourceCells.push({ id: parentIds, cells });
          }
        }
      });
    }

    mapIdTreeToSourceCells(ids);
    return sourceCells;
  },
  {
    memoizeOptions: {
      maxSize: 200,
    },
  }
);
