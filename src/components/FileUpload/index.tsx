import { useTranslation } from "react-i18next";
import { useDropzone } from "react-dropzone";
import { CircularProgress } from "@mui/material";
import { useTheme, Box } from "@mui/material";
import { useCallback, useState } from "react";

export interface FileUploadProps {
  handleFile(arg: { formData: FormData }): Promise<void>;
}

export default function FileUpload({ handleFile }: FileUploadProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [progress, setProgress] = useState(0);
  const getFilesFromEvent = useCallback(
    async (e) => {
      try {
        setProgress(1);
        if (!["drop", "change"].includes(e.type)) {
          return [];
        }
        const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
        if (!files) {
          return [];
        }
        const formData = new FormData();
        formData.append("file", files[0]);
        //reset the input field
        e.target.value = null;

        await handleFile({ formData });
        return [];
      } finally {
        setProgress(0);
      }
    },
    [handleFile]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept:
      ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
    maxFiles: 1,
    getFilesFromEvent,
  });
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 5,
        marginTop: 2,
        borderWidth: 2,
        borderRadius: 2,
        borderColor: "text.primary",
        borderStyle: "dashed",
        color: "text.primary",
        outline: "none",
        transition: "border 0.24s ease-in-out",
        cursor: "pointer",
      }}
      {...getRootProps()}
    >
      <input id="bnmarl-drop" {...getInputProps()} />
      {progress ? (
        <CircularProgress
          size={theme.spacing(3)}
          color="inherit"
          thickness={6}
        />
      ) : (
        t("file_upload_dropzone")
      )}
    </Box>
  );
}
