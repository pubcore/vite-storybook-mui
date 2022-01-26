import { createSelector } from "reselect";
import { S } from ".";

export const selectMappingIndexesByTargetId: (s: S) => Map<string, number> =
  createSelector(
    (s: S) => s.mappings,
    (mappings) =>
      mappings.reduce(
        (acc, mapping, index) => acc.set(mapping.target.id, index),
        new Map()
      )
  );
