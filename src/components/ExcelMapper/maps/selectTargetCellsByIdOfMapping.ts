import { createSelector } from "reselect";
import { Mapping, SourceIdColumns } from "./";
import { stringPipe } from "../stringPipe";
import { WorkBook } from "xlsx";
import {
  selectSourceCellsOfMapping,
  SourceCells,
} from "./selectSourceCellsOfMapping";

export type TargetCell = Readonly<{
  mapping: Mapping;
  sourceCells: SourceCells;
  value?: string;
}>;

interface S {
  workbook: WorkBook;
  sourceIdColumns: SourceIdColumns;
  [_: string]: unknown;
}
export const selectTargetCellsByIdOfMapping: (
  s: S,
  mapping: Mapping
) => Map<string, TargetCell> = createSelector(
  (_: S, mapping: Mapping) => mapping,
  selectSourceCellsOfMapping,
  (mapping, sourceCellsOfMapping) => {
    const targetCells = new Map<string, TargetCell>();
    sourceCellsOfMapping.forEach((sourceCells) => {
      const { id, cells } = sourceCells;
      targetCells.set(id.join("-"), {
        mapping,
        sourceCells,
        value: stringPipe(
          mapping.pipe,
          cells.map((cell) => cell.value)
        ),
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
