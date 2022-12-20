import { Findings } from "./Findings";
import { Finding } from "./maps";

export default { title: "ExcelMapper/Findings" };

const findings: Finding[] = [
  { id: "MAPPED_COLUMN_NOT_FOUND", payload: { name: "column name one" } },
  { id: "MAPPED_COLUMN_NOT_FOUND", payload: { name: "column name two" } },
  { id: "MAPPED_COLUMN_NOT_FOUND", payload: { name: "column name three" } },
  { id: "MAPPED_COLUMN_NOT_FOUND", payload: { name: "column name four" } },
  { id: "MAPPED_COLUMN_NOT_FOUND", payload: { name: "column name five" } },
  { id: "MAPPED_COLUMN_NOT_FOUND", payload: { name: "column name six" } },
  { id: "MAPPED_COLUMN_NOT_FOUND", payload: { name: "column name seven" } },
  { id: "MAPPED_COLUMN_NOT_FOUND", payload: { name: "column name eight" } },
  { id: "MAPPED_COLUMN_NOT_FOUND", payload: { name: "column name nine" } },
  { id: "COLUMN_NOT_FOUND", payload: { id: "column name ten" } },
  { id: "COLUMN_NOT_FOUND", payload: { id: "column name eleven" } },
  { id: "ONLY_ID_COLUMN_FOUND", payload: { id: "UUID" } },
  { id: "NO_COLUMN_FOUND" },
  {
    id: "TARGET_NOT_FOUND",
    payload: { targetId: "ONE", sourceColumns: [{ name: "a column" }] },
  },
];

export const Default = () => <Findings {...{ findings }} />;
