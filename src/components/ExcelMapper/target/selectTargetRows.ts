import { createSelector } from "reselect";
import { WorkBook } from "xlsx";
import { Targets } from ".";
import { MappingsJson } from "../MappingsJson";
import { SourceKeyColumns, SystemMap } from "../maps";
import { selectStateMappingsOfMappingsJson } from "../maps/selectStateMappingsOfMappingsJson";
import { TargetRow } from "../maps/selectTargetRows";
import { selectTargetRows as selectTargetRowsFromMapsState } from "../maps/selectTargetRows";
type S = {
  workbook: WorkBook;
  mappings: MappingsJson;
  systemMappings?: Record<string, SystemMap[]>;
};
export const selectTargetRows: (s: S) => TargetRow[] = createSelector(
  (s: S) => s.workbook,
  (s: S) => s.mappings,
  (s: S) => s.systemMappings,
  (workbook, mappings, systemMappings) => {
    const targetColumns = mappings.mappings.reduce<Targets>(
      (acc, mapping) => acc.concat({ id: mapping.targetId }),
      []
    );
    const stateMappings = selectStateMappingsOfMappingsJson(
      { workbook, targetColumns, keyIds: mappings.keyIds },
      mappings.mappings
    )[0];
    const sourceKeyColumns = mappings.keyIds.reduce<SourceKeyColumns>(
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
      sourceKeyColumns,
      targetColumns,
      systemMappings,
    });
    return rows;
  }
);
