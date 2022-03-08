import { createSelector } from "reselect";
import { ExcelMapperProps } from "..";
import { MappingsJson } from "../MappingsJson";
import { selectSourceColumnsByTargetId } from "./selectSourceColumnsByTargetId";

type S = Pick<
  ExcelMapperProps,
  "targetColumns" | "targetIds" | "workbook" | "mappings"
> & { mappingsDraft?: ExcelMapperProps["mappings"] };

export const selectMappings: (s: S) => MappingsJson = createSelector(
  (s: S) => s.workbook,
  (s: S) => s.targetColumns,
  (s: S) => s.targetIds,
  (s: S) => s.mappings,
  (s: S) => s.mappingsDraft,
  (workbook, targetColumns, targetIds, mappings, mappingsDraft) => {
    const sourceColumnsByTargetId =
      workbook &&
      selectSourceColumnsByTargetId({ workbook, targetColumns, targetIds });
    const mappingsByTargetId = mappings?.mappings?.reduce(
      (acc, mapping) => acc.set(mapping.targetId, mapping),
      new Map()
    );
    const mappingsDraftByTargetId = mappingsDraft?.mappings?.reduce(
      (acc, mapping) => acc.set(mapping.targetId, mapping),
      new Map()
    );

    return {
      targetIds,
      mappings: targetColumns.flatMap<MappingsJson["mappings"][0]>(({ id }) => {
        const sourceColumns = sourceColumnsByTargetId?.get(id);
        const mapping = mappingsByTargetId?.get(id);
        const mappingDraft = mappingsDraftByTargetId?.get(id);
        return mappingDraft
          ? [mappingDraft]
          : mapping
          ? [mapping]
          : (sourceColumns && [
              {
                targetId: id,
                sourceColumns,
              },
            ]) ||
            [];
      }),
    };
  }
);
