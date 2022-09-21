import { useCallback, useState } from "react";
import { FileUpload, FileUploadProps } from "../";
import { ActionButton } from "../Button";

export default {
  title: "Inputs/File upload",
  args: {
    dropzoneOptions: {
      maxFiles: 1,
    },
    handleFile: ({ formData }) =>
      new Promise((res) => {
        console.log("handleFile:", (formData.get("file")! as File).name);
        setTimeout(res, 1000);
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
      dropzoneOptions: {
        ...args.dropzoneOptions,
        accept: {
          "image/png": [".png"],
          "image/jpeg": [".jpg", ".jpeg"],
          "image/gif": [".gif"],
          "image/svg+xml": [".svg"],
          "image/tiff": [".tif", ".tiff"],
        },
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
      dropzoneOptions: {
        maxFiles: undefined,
      },
      handleFile: undefined,
      handleFiles: ({ files }) =>
        new Promise((res) => {
          console.log(
            "[MultipleFiles] handleFiles:",
            files.map((f) => f.name).join(", ")
          );
          setTimeout(res, 1000);
        }),
    }}
  >
    Drag and drop or click to upload files
  </FileUpload>
);

const multiFileDropzoneOptions = {
  maxFiles: undefined,
  accept: undefined,
};

export const WithArrowFuncCallback = (args: Args) => {
  console.info("[WithArrowFuncCallback] rerender");

  const forceUpdate = useForceUpdate();

  return (
    <>
      <FileUpload
        {...{
          ...args,
          dropzoneOptions: multiFileDropzoneOptions,
          handleFile: undefined,
          handleFiles: ({ files }) =>
            new Promise((res) => {
              console.log(
                "[WithArrowFuncCallback] handleFiles:",
                files.map((f) => f.name).join(", ")
              );
              setTimeout(res, 1000);
            }),
        }}
      >
        Drag and drop or click to upload files
      </FileUpload>
      <ActionButton onClick={forceUpdate}>rerender</ActionButton>
    </>
  );
};

export const WithChangingCallback = (args: Args) => {
  console.info("[WithChangingCallback] rerender");

  const forceUpdate = useForceUpdate();

  const handler1 = useCallback(
    ({ files }: { files: File[] }) =>
      new Promise<void>((res) => {
        console.log(
          "[WithChangingCallback] handler 1 files:",
          files.map((f) => f.name).join(", ")
        );
        setTimeout(res, 1000);
      }),
    []
  );

  const handler2 = useCallback(
    ({ files }: { files: File[] }) =>
      new Promise<void>((res) => {
        console.log(
          "[WithChangingCallback] handler 2 files:",
          files.map((f) => f.name).join(", ")
        );
        setTimeout(res, 1000);
      }),
    []
  );

  const [handlerProps, setHandlerProps] = useState({ handleFiles: handler1 });

  const changeCallback = useCallback(
    () => setHandlerProps({ handleFiles: handler2 }),
    [handler2]
  );

  return (
    <>
      <FileUpload
        {...{
          ...args,
          dropzoneOptions: multiFileDropzoneOptions,
          handleFile: undefined,
          ...handlerProps,
        }}
      >
        Drag and drop or click to upload files
      </FileUpload>
      <ActionButton onClick={forceUpdate}>rerender</ActionButton>
      <ActionButton onClick={changeCallback}>change callback</ActionButton>
    </>
  );
};

function useForceUpdate() {
  const [, setValue] = useState(0);
  return () => setValue((value) => value + 1);
}
