import { WorkBook } from "xlsx";
import { ExcelMapperProps } from ".";
import { MappingsJson } from "./MappingsJson";
import { selectSourceColumnsByTargetId } from "./maps";

type initArg = Pick<
  ExcelMapperProps,
  "workbook" | "mappings" | "targetIds" | "targetColumns"
>;

export type S = {
  workbook?: WorkBook;
  workbookFileName?: string;
  mappings?: MappingsJson;
  step?: "idColumns" | "map" | "preview";
};

export function init({
  workbook,
  targetIds,
  targetColumns,
  mappings: mappingsDefault,
}: initArg): S {
  let mappings = { targetIds, mappings: [] } as MappingsJson;
  if (workbook) {
    const sourceColumnsByTargetId = selectSourceColumnsByTargetId({
      workbook,
      targetColumns,
      targetIds,
    });

    let mappingsByTargetId = new Map();
    if (mappingsDefault) {
      mappingsByTargetId = mappingsDefault.mappings.reduce(
        (acc, mapping) => acc.set(mapping.targetId, mapping),
        new Map()
      );
    }

    mappings = {
      targetIds,
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
    step: "idColumns",
  };
}
