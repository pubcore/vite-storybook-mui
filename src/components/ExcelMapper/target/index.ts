export type Target = {
  id: string;
  name?: string;
};

export type Targets = Target[];

export { selectTargetById } from "./selectTargetById";

export type Rows = Array<Record<string, string>>;
