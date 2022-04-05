import { createSelector } from "reselect";
import { S as State } from ".";
import { ROW_SEPERATOR, selectColumns } from "../source";
import { Columns } from "../source/Column";

type S = Pick<State, "workbook" | "targetColumns" | "keyIds"> & {
  [_: string]: unknown;
};

/**
 * Select source columns with exact matches of target-ids (case insensitve)
 * If columns could be found by target-ids, no explicit/manual mapping is needed
 */
export const selectSourceColumnsByTargetId: (s: S) => Map<string, Columns> =
  createSelector(
    (s: S) => s.workbook,
    (s: S) => s.targetColumns,
    (workbook, targetColumns) => {
      const { columns } = selectColumns(workbook);
      return targetColumns.reduce((acc, targetCol) => {
        const sourceCols = columns.filter((col) =>
          (ROW_SEPERATOR + col.name + ROW_SEPERATOR)
            .toLowerCase()
            .includes(
              ROW_SEPERATOR + targetCol.id.toLowerCase() + ROW_SEPERATOR
            )
        );
        if (sourceCols.length > 0) {
          acc.set(targetCol.id, sourceCols);
        }
        return acc;
      }, new Map<string, Columns>());
    }
  );
