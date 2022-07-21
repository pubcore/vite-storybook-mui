import { Task, UploadFile } from "@mui/icons-material";
import { Box } from "@mui/material";
import { FieldProps } from "@rjsf/core";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import FileUpload from "../../FileUpload";

function blobToDataUri(blob: Blob): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.onabort = () => reject(new Error("Read aborted"));
    reader.readAsDataURL(blob);
  });
}

type UploadFieldProps = FieldProps & { accept?: string[] };

const defaultAccept = ["*"];

export function UploadField({
  onChange,
  accept = defaultAccept,
}: UploadFieldProps) {
  const { t } = useTranslation();

  const [fileName, setFileName] = useState<undefined | string>();

  const handleFile = useCallback(
    async ({ formData }: { formData: FormData }) => {
      // const file = formData?.get("file") as File;
      // if (!file) return;
      // const dataUri = await blobToDataUri(file);
      // onChange(dataUri);
      setFileName("sample.pdf");
      onChange({ uri: "/sample.pdf" });
    },
    [onChange]
  );

  return (
    <FileUpload
      {...{
        handleFile,
        accept,
        containerSxOverride: { padding: 1.5, marginTop: 0 },
      }}
    >
      <Box sx={{ display: "flex", whiteSpace: "nowrap", alignItems: "center" }}>
        {fileName ? (
          <>
            <Task sx={{ marginRight: 1 }} />
            {fileName}
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
