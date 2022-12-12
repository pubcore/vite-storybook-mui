import { createSelector } from "reselect";
import { S as State, selectMappingsByTargetId } from ".";
import { IdTree } from "./selectIdMaps";
import { selectIdMaps } from "./selectIdMaps";
import {
  selectTargetCellsByIdOfMapping,
  TargetCell,
} from "./selectTargetCellsByIdOfMapping";

export type TargetRow = Record<string, TargetCell | undefined>;

type S = Pick<
  State,
  | "workbook"
  | "sourceKeyColumns"
  | "mappings"
  | "targetColumns"
  | "systemMappings"
> & {
  [_: string]: unknown;
};

export const selectTargetRows: (s: S) => TargetRow[] = createSelector(
  selectIdMaps,
  (s: S) => s.workbook,
  (s: S) => s.sourceKeyColumns,
  selectMappingsByTargetId,
  (s: S) => s.systemMappings,
  (
    [{ ids }],
    workbook,
    sourceKeyColumns,
    mappingsByTargetId,
    systemMappings
  ) => {
    const rows: TargetRow[] = [];
    const mappingsAndTargetIds = Array.from(mappingsByTargetId);

    const addRow = (tree: IdTree, rows: TargetRow[], ids?: string) => {
      tree.forEach((subTree, id) => {
        if ((subTree as IdTree).__id) {
          addRow(subTree as IdTree, rows, ids ? ids + "-" + id : id);
        } else {
          rows.push(
            mappingsAndTargetIds.reduce<TargetRow>(
              (acc, [colName, mapping]) => {
                const targetCellsById = selectTargetCellsByIdOfMapping(
                  {
                    workbook,
                    sourceKeyColumns,
                    systemMappings,
                  },
                  mapping
                );
                acc[colName] = targetCellsById.get(ids ? ids + "-" + id : id);
                return acc;
              },
              {}
            )
          );
        }
      });
    };
    addRow(ids, rows);
    return rows;
  }
);
