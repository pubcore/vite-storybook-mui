import { createSelector } from "reselect";
import { S as State } from ".";
import { ROW_SEPERATOR, selectColumns } from "../source";
import { Columns } from "../source/Column";

type S = Pick<State, "workbook" | "targetColumns" | "keyIds"> & {
  [_: string]: unknown;
};

export const selectSourceColumnsByTargetId: (s: S) => Map<string, Columns> =
  createSelector(
    (s: S) => s.workbook,
    (s: S) => s.targetColumns,
    (workbook, targetColumns) => {
      const { columns } = selectColumns(workbook);
      return targetColumns.reduce((acc, targetCol) => {
        acc.set(
          targetCol.id,
          columns.filter((col) =>
            (ROW_SEPERATOR + col.name + ROW_SEPERATOR).includes(
              ROW_SEPERATOR + targetCol.id + ROW_SEPERATOR
            )
          )
        );
        return acc;
      }, new Map<string, Columns>());
    }
  );
