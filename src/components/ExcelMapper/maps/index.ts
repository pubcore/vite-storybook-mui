import { WorkBook } from "xlsx";
import { Columns } from "../source/Column";
import { Target, Targets } from "../target";

//State S
export type S = Readonly<{
  workbook: WorkBook;
  targetColumns: Targets;
  targetIds: string[];
  sourceIdColumns: SourceIdColumns;
  mappings: Array<{
    sourceColumns: Columns;
    pipe: string;
    target: Target;
  }>;
}>;

export type StateMappings = S["mappings"];

export type Mapping = Readonly<{
  workbook: WorkBook;
  sourceColumns: Columns;
  sourceIdColumnsByPageindex: Map<number, SourceIdColumns>;
  //Pipe defaults to identity (target = source), if it's falsy
  pipe?: string;
  target: Target;
}>;

export type Result = Readonly<[findings: Finding[]]>;

export type Finding = {
  id: string;
  payload?: Record<string, unknown>;
};

export type Findings = Array<Finding> | null;

export type SelectedColumns = Record<string, boolean[][]>;

/**
 * At least one Target column is used for identification of corresponding rows.
 * Each source page must have one column (at least) mapped to first TargetId
 * First entry mapps to primary target id
 * Optional second entry maps to secondary target id and so on
 */
export type SourceIdColumns = Array<Columns>;

export { selectMappingsByTargetId } from "./selectMappingsByTargetId";
export { selectMappingOfTargetId } from "./selectMappingOfTargetId";
export { selectSourceColumnsByTargetId } from "./selectSourceColumnsByTargetId";
