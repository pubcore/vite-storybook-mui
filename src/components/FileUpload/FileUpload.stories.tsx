import { FileUpload, FileUploadProps } from "../";

export default {
  title: "Inputs/File upload",
  args: {
    handleFile: () => new Promise((res) => setTimeout(() => res(), 2000)),
  } as Args,
};

type Args = FileUploadProps;

export const Default = (args: Args) => <FileUpload {...{ ...args }} />;
