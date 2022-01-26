import { createSelector } from "reselect";
import { Target } from ".";
import type { S } from "./State";
export const selectTargetById: (s: S) => Map<string, Target> = createSelector(
  (s: S) => s.targetColumns,
  (targets) =>
    targets.reduce((acc, target) => acc.set(target.id, target), new Map())
);
