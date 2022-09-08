import { FileUpload, FileUploadProps } from "../";

export default {
  title: "Inputs/File upload",
  args: {
    handleFile: ({ formData }) =>
      new Promise((res) => {
        console.log("Handle single file:", formData.get("file")!);
        setTimeout(res, 2000);
      }),
  } as Args,
};

type Args = FileUploadProps;

export const Default = (args: Args) => (
  <FileUpload {...{ ...args }}>
    Drag and drop or click to upload a file
  </FileUpload>
);

export const OnlyImages = (args: Args) => (
  <FileUpload
    {...{
      ...args,
      accept: {
        "image/png": [".png"],
        "image/jpeg": [".jpg", ".jpeg"],
        "image/gif": [".gif"],
        "image/svg+xml": [".svg"],
        "image/tiff": [".tif", ".tiff"],
      },
    }}
  >
    Drag and drop or click to upload an image
  </FileUpload>
);

export const MultipleFiles = (args: Args) => (
  <FileUpload
    {...{
      ...args,
      handleFile: undefined,
      handleFiles: ({ files }) =>
        new Promise((res) => {
          console.log("Handle multiple files:", files);
          setTimeout(res, 2000);
        }),
    }}
  >
    Drag and drop or click to upload files
  </FileUpload>
);
