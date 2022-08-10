import { createSelector } from "reselect";
import stringSimilarity from "string-similarity";
import { WorkBook } from "xlsx";
import { Finding, StateMappings } from ".";
import { MappingsJson } from "../MappingsJson";
import { selectColumns } from "../source";
import { Columns } from "../source/Column";
import { selectTargetById, Targets } from "../target";

interface S {
  workbook: WorkBook;
  targetColumns: Targets;
  keyIds: string[];
  [_: string]: unknown;
}

const MATCH_THRESHOLD = 0.95;

export const selectStateMappingsOfMappingsJson: (
  s: S,
  mappings: MappingsJson["mappings"]
) => [_1: StateMappings, _2?: Array<Finding>] = createSelector(
  (_: S, mappings: MappingsJson["mappings"]) => mappings,
  (s: S) => s.workbook,
  (s: S) => s.targetColumns,
  (s: S) => s.keyIds,
  (mappings, workbook, targetColumns, keyIds) => {
    const sourceColumns = selectColumns(workbook);
    const foundColumnsByQueryName = new Map<string, Columns>();
    const foundColumnsByTargetId = new Map<string, Columns>();
    const columnsFoundByGroupId = new Map<string, boolean>();
    const targetsById = selectTargetById({ targetColumns });

    const result = mappings.reduce(
      (acc, mapping) => {
        const foundColumns: StateMappings[number]["sourceColumns"] =
          mapping.sourceColumns.flatMap((sourceColumn) => {
            const { name: queryName } = sourceColumn;
            let columns = sourceColumns.columnsByName.get(queryName);
            if (!columns) {
              //check, if columns has already been found
              if (!foundColumnsByQueryName.get(queryName)) {
                columns = sourceColumns.columns.filter(
                  (col) =>
                    stringSimilarity.compareTwoStrings(
                      queryName.toLowerCase(),
                      col.name.toLowerCase()
                    ) > MATCH_THRESHOLD
                );
                if (columns.length > 0) {
                  foundColumnsByQueryName.set(queryName, columns);
                }
              }
            }

            if (columns?.length) {
              return columns;
            } else {
              acc[1].push({
                id: "MAPPED_COLUMN_NOT_FOUND",
                payload: sourceColumn,
              });
              return [];
            }
          });

        const target = targetsById.get(mapping.targetId);
        if (!target) {
          acc[1].push({ id: "TARGET_NOT_FOUND", payload: mapping });
        } else {
          acc[0].push({
            sourceColumns: foundColumns,
            pipe: mapping.pipe ?? "",
            target,
          });
          foundColumnsByTargetId.set(target.id, foundColumns);
          columnsFoundByGroupId.set(target?.groupId ?? "*", true);
        }
        return acc;
      },
      [[], []] as [StateMappings, Array<Finding>]
    );

    if (foundColumnsByTargetId.size <= 0) {
      result[1].push({ id: "NO_COLUMN_FOUND" });
    } else {
      //check required target columns (if at least one column found in group)
      targetColumns.forEach((target) => {
        const { id, groupId = "*" } = target;
        const noColumnsForThisGroup = !columnsFoundByGroupId.get(groupId);
        foundColumnsByTargetId.get(id) ||
          noColumnsForThisGroup ||
          keyIds.indexOf(id) > 0 || //secondary keys are optional
          result[1].push({ id: "COLUMN_NOT_FOUND", payload: target });
      });
    }

    if (result[1].length <= 0) {
      return [result[0]];
    }
    return result;
  }
);
