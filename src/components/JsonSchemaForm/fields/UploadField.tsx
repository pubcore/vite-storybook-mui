import { UploadFile } from "@mui/icons-material";
import { Box } from "@mui/material";
import { FieldProps } from "@rjsf/core";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import FileUpload from "../../FileUpload";

function blobToDataUri(blob: Blob): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (_) => resolve(reader.result as string);
    reader.onerror = (_) => reject(reader.error);
    reader.onabort = (_) => reject(new Error("Read aborted"));
    reader.readAsDataURL(blob);
  });
}

export function UploadField({ onChange }: FieldProps) {
  const { t } = useTranslation();

  const handleFile = useCallback(
    async ({ formData }: { formData: FormData }) => {
      const file = formData.get("file") as File;
      const dataUri = await blobToDataUri(file);
      onChange(dataUri);
    },
    [onChange]
  );

  return (
    <Box className="custom-field upload-field">
      <FileUpload
        {...{
          handleFile,
          accept: ["*"],
          containerSxOverride: { padding: 1.5, marginTop: 0 },
        }}
      >
        <Box sx={{ whiteSpace: "nowrap" }}>
          <UploadFile />
          {t("attach_file")}
        </Box>
      </FileUpload>
    </Box>
  );
}
