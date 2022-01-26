import { WorkBook } from "xlsx";
import { Box } from "@mui/material";

export interface WorkbookTeaserProps {
  workbook: WorkBook;
  fileName: string;
}

export default function WorkbookTeaser({
  workbook,
  fileName,
}: WorkbookTeaserProps) {
  return (
    <Box>
      <Box>
        <b>{fileName}</b>
      </Box>
      <Box>
        {workbook?.SheetNames.reduce(
          (acc, name) => acc + name + ", ",
          ""
        ).slice(0, -2)}
      </Box>
    </Box>
  );
}
