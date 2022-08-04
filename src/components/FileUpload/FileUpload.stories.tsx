import { FileUpload, FileUploadProps } from "../";

export default {
  title: "Inputs/File upload",
  args: {
    handleFile: () => new Promise((res) => setTimeout(() => res(), 2000)),
  } as Args,
};

type Args = FileUploadProps;

export const Default = (args: Args) => <FileUpload {...{ ...args }} />;

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
  />
);
