import { createSelector } from "reselect";
import { selectTargetById } from "../target";
import { Mapping, S as State } from "./index";
import { selectSourceKeyColumnsByPageIndex } from "./selectSourceKeyColumnsByPageIndex";

const selectStateMappingIndexesByTargetId = createSelector(
  (s: S) => s.mappings,
  (mappings) =>
    mappings.reduce(
      (acc, mapping, index) => acc.set(mapping.target.id, index),
      new Map<string, number>()
    )
);

const selectStateMappingOfTargetId = createSelector(
  (_: S, targetId: string) => targetId,
  (s: S) => s.mappings,
  selectStateMappingIndexesByTargetId,
  (targetId, mappings, stateMappingIndexesByTargetId) => {
    const index = stateMappingIndexesByTargetId.get(targetId);
    return index === undefined ? undefined : mappings[index];
  }
);

type S = Pick<
  State,
  "targetColumns" | "workbook" | "sourceKeyColumns" | "mappings"
>;

export const selectMappingOfTargetId: (s: S, targetId: string) => Mapping =
  createSelector(
    (_: S, targetId: string) => targetId,
    selectStateMappingOfTargetId,
    (s: S) => s.workbook,
    (s: S) => s.targetColumns,
    selectSourceKeyColumnsByPageIndex,
    (
      targetId,
      stateMapping,
      workbook,
      targetColumns,
      sourceKeyColumnsByPageindex
    ) => {
      const target = selectTargetById({ targetColumns }).get(targetId);
      if (!target) throw TypeError(`target not found for ${targetId}`);
      return {
        workbook,
        sourceColumns: stateMapping?.sourceColumns ?? [],
        sourceKeyColumnsByPageindex,
        pipe: stateMapping?.pipe,
        target,
      };
    }
  );
