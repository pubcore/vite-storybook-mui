import { WorkBook } from "xlsx";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";

export interface WorkbookTeaserProps {
  workbook: WorkBook;
  fileName: string;
}

export default function WorkbookTeaser({ fileName }: WorkbookTeaserProps) {
  const { t } = useTranslation();
  return (
    <Box>
      {t("selected_file")}: <b>{fileName}</b>
    </Box>
  );
}
