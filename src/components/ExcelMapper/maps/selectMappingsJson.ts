import { createSelector } from "reselect";
import { S as State } from ".";
import { MappingsJson } from "../MappingsJson";

type S = Pick<State, "mappings" | "keyIds" | "targetColumns"> & {
  [_: string]: unknown;
};
export const selectMappingsJson: (s: S) => MappingsJson = createSelector(
  (s: S) => s.mappings,
  (s: S) => s.keyIds,
  (s: S) => s.targetColumns,
  (mappings, keyIds, targetColumns) => ({
    targetColumns,
    keyIds,
    mappings: mappings.reduce<MappingsJson["mappings"]>(
      (acc, { sourceColumns, pipe, target }) => {
        const nameLookup = new Map<string, boolean>();
        acc.push({
          sourceColumns: sourceColumns.flatMap(({ name }) => {
            if (nameLookup.get(name)) {
              return [];
            } else {
              nameLookup.set(name, true);
              return [{ name }];
            }
          }),
          pipe,
          targetId: target.id,
        });
        return acc;
      },
      []
    ),
  })
);
