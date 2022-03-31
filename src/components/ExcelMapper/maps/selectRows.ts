import { createSelector } from "reselect";
import { S, selectMappingsByTargetId } from ".";
import { Columns } from "../source/Column";
import {
  selectTargetCellsByIdOfMapping,
  TargetCell,
} from "./selectTargetCellsByIdOfMapping";

export type Row = {
  sourceColumns?: Columns;
  pipe?: string;
  targetColumnId: string;
  targetCellsById: Map<string[], TargetCell>;
};

export const selectRows: (s: S) => Row[] = createSelector(
  selectMappingsByTargetId,
  (s: S) => s.targetColumns,
  (s: S) => s.workbook,
  (s: S) => s.sourceKeyColumns,
  (mappingsByTargetId, targetColumns, workbook, sourceKeyColumns) => {
    return targetColumns.flatMap((target) => {
      const mapping = mappingsByTargetId.get(target.id);
      return [
        {
          sourceColumns: mapping?.sourceColumns,
          pipe: mapping?.pipe,
          targetColumnId: target.id,
          targetColumnName: target.name ?? target.id,
          targetCellsById: mapping
            ? selectTargetCellsByIdOfMapping(
                { workbook, sourceKeyColumns },
                mapping
              )
            : new Map(),
        },
      ];
    });
  }
);
