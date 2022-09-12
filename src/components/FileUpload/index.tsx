import { useTranslation } from "react-i18next";
import { Accept, DropzoneOptions, useDropzone } from "react-dropzone";
import { CircularProgress, SxProps } from "@mui/material";
import { useTheme, Box } from "@mui/material";
import { ReactNode, useEffect, useState } from "react";

export interface FileUploadProps {
  handleFile?: (arg: { formData: FormData }) => Promise<void>;
  handleFiles?: (arg: { files: File[] }) => Promise<void>;
  children?: ReactNode;
  containerSxOverride?: SxProps;
  dropzoneOptions?: DropzoneOptions;
}

export const acceptExcel: Accept = {
  "text/csv": [".csv"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    ".xlsx",
  ],
  "application/vnd.ms-excel": [".xls"],
};

export default function FileUpload({
  handleFile,
  handleFiles,
  children,
  dropzoneOptions = {},
  containerSxOverride = {},
}: FileUploadProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [progress, setProgress] = useState(0);

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    maxFiles: handleFile ? 1 : undefined,
    accept: acceptExcel,
    ...dropzoneOptions,
  });

  useEffect(() => {
    let isMounted = true;
    const processFile = async (files: typeof acceptedFiles) => {
      try {
        setProgress(1);
        if (handleFile) {
          const formData = new FormData();
          formData.append("file", files[0]!);
          await handleFile({ formData });
        } else if (handleFiles) await handleFiles({ files });
        return [];
      } catch (err) {
        console.error(err);
      } finally {
        isMounted && setProgress(0);
      }
    };
    if (acceptedFiles.length > 0) {
      processFile(acceptedFiles);
    }
    return () => {
      isMounted = false;
    };
  }, [acceptedFiles, handleFile, handleFiles]);

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
        ...containerSxOverride,
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
        <Box sx={{ userSelect: "none" }}>
          {children ?? t("file_upload_dropzone")}
        </Box>
      )}
    </Box>
  );
}
