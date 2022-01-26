import SelectColumns, { SelectColumnsProps as Args } from "./SelectColumns";
import { selectSource } from "../source/selectSource";
import { workbook, workbook2 } from "../../../../test/testWorkbook";
const selectedColumns: boolean[][] = [[true]];

export default {
  title: "ExcelMapper/Select Columns",
  argTypes: {
    toggleColumn: { action: "toggleColumn" },
  },
  args: { selectedColumns },
};

export const ManyColumns = (args: Args) => (
    <SelectColumns {...{ ...args, source: selectSource(workbook) }} />
  ),
  ManyPages = (args: Args) => (
    <SelectColumns {...{ ...args, source: selectSource(workbook2) }} />
  );
