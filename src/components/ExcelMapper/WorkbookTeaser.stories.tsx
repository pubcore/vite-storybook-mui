import WorkbookTeaser from "./WorkbookTeaser";
import { workbook, fileName } from "../../../test/testWorkbook";

export default {
  title: "ExcelMapper/Workbook Teaser",
};

export const Default = () => <WorkbookTeaser {...{ workbook, fileName }} />;
