import { WorkBook } from "xlsx";
import { ExcelMapperProps } from ".";
import { MappingsJson } from "./MappingsJson";
import { selectSourceColumnsByTargetId } from "./maps";

type initArg = Pick<
  ExcelMapperProps,
  "workbook" | "mappings" | "keyIds" | "targetColumns"
>;

export type S = {
  workbook?: WorkBook;
  workbookFileName?: string;
  mappings?: MappingsJson;
  step?: "keyColumns" | "map" | "preview";
};

export function init({
  workbook,
  keyIds,
  targetColumns,
  mappings: mappingsDefault,
}: initArg): S {
  let mappings = { keyIds, mappings: [] } as MappingsJson;
  if (workbook) {
    const sourceColumnsByTargetId = selectSourceColumnsByTargetId({
      workbook,
      targetColumns,
      keyIds,
    });

    let mappingsByTargetId = new Map();
    if (mappingsDefault) {
      mappingsByTargetId = mappingsDefault.mappings.reduce(
        (acc, mapping) => acc.set(mapping.targetId, mapping),
        new Map()
      );
    }

    mappings = {
      keyIds,
      mappings: targetColumns.flatMap(({ id }) => {
        const sourceColumns = sourceColumnsByTargetId.get(id);
        const mapping = mappingsByTargetId.get(id);
        return mapping
          ? [mapping]
          : (sourceColumns && [
              {
                targetId: id,
                sourceColumns,
              } as MappingsJson["mappings"][0],
            ]) ||
              [];
      }),
    };
  }

  return {
    workbook,
    workbookFileName: "-",
    mappings,
    step: "keyColumns",
  };
}
