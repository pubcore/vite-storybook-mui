import { useTranslation } from "react-i18next";
import { Accept, DropzoneOptions, useDropzone } from "react-dropzone";
import { CircularProgress, SxProps } from "@mui/material";
import { useTheme, Box } from "@mui/material";
import { ReactNode, useEffect, useRef, useState } from "react";

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

const emptyObject = {};

export default function FileUpload({
  handleFile: handleFileProp,
  handleFiles: handleFilesProp,
  children,
  dropzoneOptions = emptyObject,
  containerSxOverride = emptyObject,
}: FileUploadProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [progress, setProgress] = useState(0);

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    maxFiles: handleFileProp ? 1 : undefined,
    accept: acceptExcel,
    ...dropzoneOptions,
  });

  const handleFile = useRef(handleFileProp);
  handleFile.current = handleFileProp;

  const handleFiles = useRef(handleFilesProp);
  handleFiles.current = handleFilesProp;

  useEffect(() => {
    let isMounted = true;
    const processFile = async (files: typeof acceptedFiles) => {
      try {
        setProgress(1);
        if (handleFile.current) {
          const formData = new FormData();
          formData.append("file", files[0]!);
          await handleFile.current({ formData });
        } else if (handleFiles.current) await handleFiles.current({ files });
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
  }, [acceptedFiles]);

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
      <input className="bnmarl-drop" {...getInputProps()} />
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
