import { createSelector } from "reselect";
import { ExcelMapperProps } from "..";
import { MappingsJson } from "../MappingsJson";
import { selectSourceColumnsByTargetId } from "./selectSourceColumnsByTargetId";

type S = Pick<
  ExcelMapperProps,
  "targetColumns" | "keyIds" | "workbook" | "mappings"
> & { mappingsDraft?: ExcelMapperProps["mappings"] };

export const selectMappings: (s: S) => MappingsJson = createSelector(
  (s: S) => s.workbook,
  (s: S) => s.targetColumns,
  (s: S) => s.keyIds,
  (s: S) => s.mappings,
  (s: S) => s.mappingsDraft,
  (workbook, targetColumns, keyIds, mappings, mappingsDraft) => {
    const sourceColumnsByTargetId =
      workbook &&
      selectSourceColumnsByTargetId({ workbook, targetColumns, keyIds });
    const mappingsByTargetId = mappings?.mappings?.reduce(
      (acc, mapping) => acc.set(mapping.targetId, mapping),
      new Map()
    );
    const mappingsDraftByTargetId = mappingsDraft?.mappings?.reduce(
      (acc, mapping) => acc.set(mapping.targetId, mapping),
      new Map()
    );

    return {
      keyIds,
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
