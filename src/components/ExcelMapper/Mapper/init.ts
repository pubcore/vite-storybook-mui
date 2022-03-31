import { MapperProps } from ".";
import { SourceKeyColumns } from "../maps";
import { selectStateMappingsOfMappingsJson } from "../maps/selectStateMappingsOfMappingsJson";

export function init({
  source,
  targetColumns,
  keyIds,
  mappings,
}: Pick<MapperProps, "source" | "targetColumns" | "keyIds" | "mappings">) {
  const [stateMappings, findings] =
    (mappings &&
      selectStateMappingsOfMappingsJson(
        {
          workbook: source.workbook,
          targetColumns,
        },
        mappings
      )) ??
    [];
  if (findings) {
    console.warn(findings);
  }
  const mappingsByTargetId = stateMappings?.reduce(
    (acc, mapping) => acc.set(mapping.target.id, mapping),
    new Map()
  );

  //this must depend on initial mapping property
  const sourceKeyColumns = keyIds.reduce<SourceKeyColumns>((acc, targetId) => {
    const sourceColumns =
      stateMappings &&
      stateMappings.find((mapping) => mapping.target.id === targetId)
        ?.sourceColumns;

    if (sourceColumns) {
      return acc.concat([sourceColumns]);
    } else {
      return acc;
    }
  }, []);

  return {
    workbook: source.workbook,
    targetColumns,
    keyIds,
    sourceKeyColumns,
    mappings: targetColumns.map(
      (target) =>
        mappingsByTargetId?.get(target.id) ?? {
          sourceColumns: [],
          pipe: "",
          target,
        }
    ),
  };
}
