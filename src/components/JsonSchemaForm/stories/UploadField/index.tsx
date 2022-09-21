import { Task, UploadFile } from "@mui/icons-material";
import { Box } from "@mui/system";
import { FieldProps } from "@rjsf/core";
import { ReactNode, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import FileUpload from "../../../FileUpload";

interface Evidence {
  uri: string;
}

export function UploadField({ onChange }: FieldProps<Evidence[]>) {
  const { t } = useTranslation();
  const [fileNames, setFileNames] = useState<string[] | undefined>();
  const maxFiles = undefined;

  const handleFilesUpload = useCallback(
    async ({ files }: { files: File[] }) => {
      console.log("handle multiple files:", files);
      setFileNames(files.map((f) => f.name));
      onChange(
        files.map((f) => ({ uri: `https://example.org/file/${f.name}` }))
      );
    },
    [onChange]
  );

  const handleFileUpload = useCallback(
    async ({ formData }: { formData: FormData }) => {
      const file = formData.get("file")! as File;
      console.log("handle single file:", file);
      setFileNames([file.name]);
      onChange([{ uri: `https://example.org/file/${file.name}` }]);
    },
    [onChange]
  );

  const getFileUploadProps = useCallback(
    () => ({
      ...(!maxFiles || maxFiles > 1
        ? { handleFiles: handleFilesUpload }
        : { handleFile: handleFileUpload }),
      containerSxOverride: {
        padding: 1,
        marginTop: 1,
        borderColor: fileNames ? "text.primary" : "text.secondary",
      },
      dropzoneOptions: {
        maxFiles,
        accept: {
          "application/pdf": [".pdf"],
          "application/msword": [".doc"],
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            [".docx"],
          "application/vnd.ms-excel": [".xls"],
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
            ".xlsx",
          ],
          "image/png": [".png"],
          "image/jpeg": [".jpg", ".jpeg"],
        },
      },
    }),
    [fileNames, handleFileUpload, handleFilesUpload, maxFiles]
  );

  return (
    <FileUpload {...getFileUploadProps()}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          whiteSpace: "normal",
          fontSize: 14,
        }}
      >
        {fileNames ? (
          <>
            <Task sx={{ marginRight: 1 }} />
            {fileNames.reduce(
              (acc, name) => acc + `${acc.length > 0 ? ", " : ""}${name}`,
              ""
            )}
          </>
        ) : (
          <>
            <UploadFile sx={{ marginRight: 1 }} />
            {t("attach_file")}
          </>
        )}
      </Box>
    </FileUpload>
  );
}
