import { createSelector } from "reselect";
import { S as State, selectMappingsByTargetId } from ".";
import { IdTree } from "./selectIdMaps";
import { Rows as IdRows } from "./selectIdMaps";
import { selectIdMaps } from "./selectIdMaps";
import {
  selectTargetCellsByIdOfMapping,
  TargetCell,
} from "./selectTargetCellsByIdOfMapping";

export type TargetRow = Record<string, TargetCell | undefined>;

type S = Pick<
  State,
  "workbook" | "sourceIdColumns" | "mappings" | "targetColumns"
> & {
  [_: string]: unknown;
};

export const selectTargetRows: (s: S) => TargetRow[] = createSelector(
  selectIdMaps,
  (s: S) => s.workbook,
  (s: S) => s.sourceIdColumns,
  selectMappingsByTargetId,
  ([{ ids }], workbook, sourceIdColumns, mappingsByTargetId) => {
    const rows: TargetRow[] = [];
    const mappingsAndTargetIds = Array.from(mappingsByTargetId);

    const addRow = (tree: IdTree, rows: TargetRow[], ids?: string) => {
      tree.forEach((subTree, id) => {
        if (ids && Array.isArray(subTree as IdRows)) {
          rows.push(
            mappingsAndTargetIds.reduce<TargetRow>(
              (acc, [colName, mapping]) => {
                const targetCellsById = selectTargetCellsByIdOfMapping(
                  {
                    workbook,
                    sourceIdColumns,
                  },
                  mapping
                );
                acc[colName] = targetCellsById.get(ids);
                return acc;
              },
              {}
            )
          );
        } else {
          addRow(subTree as IdTree, rows, ids ? ids + "-" + id : id);
        }
      });
    };
    addRow(ids, rows);
    return rows;
  }
);
