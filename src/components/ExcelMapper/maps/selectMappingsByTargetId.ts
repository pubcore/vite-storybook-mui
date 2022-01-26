import { Mapping, S as State, selectMappingOfTargetId } from ".";

type S = Pick<
  State,
  "targetColumns" | "mappings" | "workbook" | "sourceIdColumns"
> & {
  [_: string]: unknown;
};

export const selectMappingsByTargetId = (s: S) =>
  s.targetColumns.reduce(
    (acc, targetCol) =>
      acc.set(targetCol.id, selectMappingOfTargetId(s, targetCol.id)),
    new Map<string, Mapping>()
  );
