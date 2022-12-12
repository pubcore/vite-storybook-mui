import { createSelector } from "reselect";
import { Mapping, SourceKeyColumns, SystemMap } from "./";
import { stringPipe } from "../stringPipe";
import { WorkBook } from "xlsx";
import {
  selectSourceCellsOfMapping,
  SourceCells,
} from "./selectSourceCellsOfMapping";

export type TargetCell = Readonly<{
  mapping: Mapping;
  sourceCells: SourceCells;
  pipeValue?: string;
  /**
   * If no systemMapping is defined: pipeValue === value
   */
  value?: string;
}>;

interface S {
  workbook: WorkBook;
  sourceKeyColumns: SourceKeyColumns;
  systemMappings?: Record<string, SystemMap[]>;
  [_: string]: unknown;
}
export const selectTargetCellsByIdOfMapping: (
  s: S,
  mapping: Mapping
) => Map<string, TargetCell> = createSelector(
  (_: S, mapping: Mapping) => mapping,
  selectSourceCellsOfMapping,
  (s: S) => s.systemMappings,
  (mapping, sourceCellsOfMapping, systemMappings) => {
    const targetCells = new Map<string, TargetCell>();
    sourceCellsOfMapping.forEach((sourceCells) => {
      const { id, cells } = sourceCells;
      const pipeValue = stringPipe(
        mapping.pipe,
        cells.map((cell) => cell.value)
      );
      targetCells.set(id.join("-"), {
        mapping,
        sourceCells,
        pipeValue,
        value:
          typeof pipeValue === "string" && systemMappings?.[mapping.target.id]
            ? systemMappings[mapping.target.id]!.reduce(
                (acc, map) => map(acc),
                pipeValue
              )
            : pipeValue,
      });
    });
    return targetCells;
  },
  {
    memoizeOptions: {
      maxSize: 200,
    },
  }
);
