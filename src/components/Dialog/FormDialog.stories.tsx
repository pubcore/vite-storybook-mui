import { FormDialog, FormDialogProps } from "../";

export default {
  title: "Dialogs",
  args: {
    open: true,
    name: "submit message",
    title: "Messages",
  },
  argTypes: {
    cancel: { action: "cancel" },
    execute: { action: "execute" },
  },
};

type Args = FormDialogProps;

export const Form = (args: Args) => (
  <FormDialog {...{ ...args }}>«content»</FormDialog>
);
