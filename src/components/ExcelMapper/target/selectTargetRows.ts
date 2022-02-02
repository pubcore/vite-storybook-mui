import { createSelector } from "reselect";
import { WorkBook } from "xlsx";
import { Targets } from ".";
import { MappingsJson } from "../MappingsJson";
import { SourceIdColumns } from "../maps";
import { selectStateMappingsOfMappingsJson } from "../maps/selectStateMappingsOfMappingsJson";
import { TargetRow } from "../maps/selectTargetRows";
import { selectTargetRows as selectTargetRowsFromMapsState } from "../maps/selectTargetRows";
type S = { workbook: WorkBook; mappings: MappingsJson };
export const selectTargetRows: (s: S) => TargetRow[] = createSelector(
  (s: S) => s.workbook,
  (s: S) => s.mappings,
  (workbook, mappings) => {
    const targetColumns = mappings.mappings.reduce<Targets>(
      (acc, mapping) => acc.concat({ id: mapping.targetId }),
      []
    );
    const stateMappings = selectStateMappingsOfMappingsJson(
      { workbook, targetColumns },
      mappings.mappings
    )[0];
    const sourceIdColumns = mappings.targetIds.reduce<SourceIdColumns>(
      (acc, id) => {
        const mapping = stateMappings.find(
          (mapping) => mapping.target.id == id
        );
        if (mapping) {
          acc.push(mapping.sourceColumns);
        }
        return acc;
      },
      []
    );
    const rows = selectTargetRowsFromMapsState({
      workbook,
      mappings: stateMappings,
      sourceIdColumns,
      targetColumns,
    });
    return rows;
  }
);
