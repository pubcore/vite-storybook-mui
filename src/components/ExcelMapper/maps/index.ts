import { WorkBook } from "xlsx";
import { MappingsJson } from "../MappingsJson";
import { Page } from "../source";
import { Columns } from "../source/Column";
import { Target, Targets } from "../target";

//State S
export type S = Readonly<{
  workbook: WorkBook;
  targetColumns: Targets;
  keyIds: string[];
  sourceKeyColumns: SourceKeyColumns;
  mappings: Array<{
    sourceColumns: Columns;
    pipe: string;
    target: Target;
  }>;
  systemMappings?: Record<string, SystemMap[]>;
}>;

export type StateMappings = S["mappings"];

export type Mapping = Readonly<{
  workbook: WorkBook;
  sourceColumns: Columns;
  sourceKeyColumnsByPageindex: Map<number, SourceKeyColumns>;
  //Pipe defaults to identity (target = source), if it's falsy
  pipe?: string;
  target: Target;
}>;

//global, target dependant value mapping
export type SystemMap = (s: string) => string;

export type Result = Readonly<[findings?: Finding[]]>;

export type Finding =
  | { id: "COLUMN_NOT_FOUND"; payload: Target }
  | {
      id: "MAPPED_COLUMN_NOT_FOUND";
      payload: { name: string };
    }
  | { id: "NO_ID_COLUMNS_DEFINED_ON_PAGE"; payload: Page }
  | { id: "TARGET_NOT_FOUND"; payload: MappingsJson["mappings"][0] }
  | { id: "NO_COLUMN_FOUND" };

export type Findings = Array<Finding>;

export type SelectedColumns = Record<string, boolean[][]>;

type Severities = {
  errors?: Finding[];
  warnings?: Finding[];
  infos?: Finding[];
};

export function selectSeverities({
  findings,
}: {
  findings?: Finding[];
}): Severities {
  return findings
    ? findings.reduce<Severities>((acc, finding) => {
        if (finding.id) {
          acc.errors = (acc.errors ?? []).concat(finding);
        }
        return acc;
      }, {})
    : {};
}

/**
 * At least one Target column is used for identification of corresponding rows.
 * Each source page must have one column (at least) mapped to first TargetId
 * First entry mapps to primary target id
 * Optional second entry maps to secondary target id and so on
 */
export type SourceKeyColumns = Array<Columns>;

export { selectMappingsByTargetId } from "./selectMappingsByTargetId";
export { selectMappingOfTargetId } from "./selectMappingOfTargetId";
export { selectSourceColumnsByTargetId } from "./selectSourceColumnsByTargetId";
