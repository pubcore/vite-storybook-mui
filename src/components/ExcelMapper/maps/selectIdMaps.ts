import { selectRowsByPage } from "../source";
import { selectCountOfHeaderRowsByPage } from "../source";
import { createSelector } from "reselect";
import { selectSourceKeyColumnsByPageIndex } from "./selectSourceKeyColumnsByPageIndex";
import { selectPages } from "../source/selectPages";
import { WorkBook } from "xlsx";
import { Findings, SourceKeyColumns } from ".";

type PageIndex = number;
type RowIndex = number;
export type Rows = Map<PageIndex, Array<RowIndex>>;
export type IdTree = Map<string, IdTree | Rows> & { __id?: string };
type IdMaps = {
  // pages: Map<
  //   number,
  //   {
  //     idsByRowIndex: Map<number, IdTree>;
  //     rowIndexesById: Map<IdTree, number>;
  //   }
  // >;
  ids: IdTree;
};

interface S {
  workbook: WorkBook;
  sourceKeyColumns: SourceKeyColumns;
  [_: string]: unknown;
}

export const selectIdMaps: (s: S) => [idm: IdMaps, f?: Findings] =
  createSelector(
    (s: S) => s.workbook,
    selectSourceKeyColumnsByPageIndex,
    (wb, SourceKeyColumnsByPageIndex) => {
      const idTree: IdTree = new Map();
      const findings: NonNullable<Findings> = [];

      const pages = selectPages(wb) ?? [];
      for (const page of pages) {
        const rowsByPage = selectRowsByPage(wb);
        const countOfHeaderRows =
          selectCountOfHeaderRowsByPage(wb).get(page) ?? -1;
        const rows = rowsByPage.get(page) ?? [];
        const pageSourceKeyColumns = SourceKeyColumnsByPageIndex.get(
          page.index
        );
        if (!pageSourceKeyColumns) {
          findings.push({ id: "NO_ID_COLUMNS_DEFINED_ON_PAGE", payload: page });
          continue;
        }

        for (const [rowIndex, row] of rows.entries()) {
          if (rowIndex < countOfHeaderRows) {
            continue;
          }
          addRowToIdTree(idTree, rowIndex, row, pageSourceKeyColumns);
        }
      }

      return [{ ids: idTree }, findings.length ? findings : undefined];
    }
  );

export function addRowToIdTree(
  idTree: IdTree,
  rowIndex: number,
  row: string[],
  sourceKeyColumns: SourceKeyColumns,
  depth = 0
) {
  //TODO manny to one mapping for id-columns
  const idColumn = sourceKeyColumns[depth]?.[0];
  const lastIdColumn = [...sourceKeyColumns].pop()?.[0];
  if (!idColumn && !lastIdColumn) {
    return;
  }

  const id = row[idColumn?.index ?? -1];
  if (depth === 0 && !id) {
    return;
  }

  const subTree = id ? idTree.get(id) : idTree;

  if (!subTree) {
    if (depth + 1 < sourceKeyColumns.length) {
      const _tree: IdTree = new Map();
      _tree.__id = id;
      idTree.set(id!, _tree);
      addRowToIdTree(_tree, rowIndex, row, sourceKeyColumns, depth + 1);
    } else {
      const rows: Rows = new Map([[idColumn!.pageIndex, [rowIndex]]]);
      idTree.set(id!, rows);
    }
  } else {
    if (depth + 1 < sourceKeyColumns.length) {
      if ((subTree as IdTree).__id) {
        addRowToIdTree(
          subTree as IdTree,
          rowIndex,
          row,
          sourceKeyColumns,
          depth + 1
        );
      } else if (id !== undefined) {
        const _tree: IdTree = new Map();
        _tree.__id = id;
        _tree.set(id, subTree);
        idTree.set(id, _tree);
        addRowToIdTree(_tree, rowIndex, row, sourceKeyColumns, depth + 1);
      } else {
        console.warn("Undefined id for id-column", idColumn);
      }
    } else {
      if ((subTree as IdTree).__id) {
        subTree.forEach((subSubTree) => {
          addRowToIdTree(
            subSubTree as IdTree,
            rowIndex,
            row,
            sourceKeyColumns,
            depth + 1
          );
        });
      } else {
        const pageIndex = idColumn?.pageIndex ?? lastIdColumn?.pageIndex;
        pageIndex !== undefined &&
          (subTree as Rows).set(
            pageIndex,
            ((subTree as Rows).get(pageIndex) ?? []).concat(rowIndex)
          );
      }
    }
  }
}
