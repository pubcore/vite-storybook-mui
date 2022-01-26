import { createSelector } from "reselect";
import { S, selectMappingsByTargetId } from ".";
import { set } from "lodash-es";

export const selectIsSourceColumnFlagsOfTargetId: (
  s: S,
  targetId: string
) => boolean[][] = createSelector(
  (_: S, targetId: string) => targetId,
  selectMappingsByTargetId,
  (targetId, mappingsByTargetId) => {
    return (
      mappingsByTargetId
        .get(targetId)
        ?.sourceColumns?.reduce(
          (acc, { pageIndex, index }) => set(acc, [pageIndex, index], true),
          []
        ) || []
    );
  }
);
