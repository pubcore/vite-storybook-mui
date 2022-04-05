import { FormDialog, FormDialogProps } from "../";
import { action } from "@storybook/addon-actions";

export default {
  title: "Dialogs",
  args: {
    open: true,
    name: "submit message",
    title: "Messages",
    execute: (e: React.FormEvent) => {
      console.log("test");
      e.preventDefault();
      action("execute")(e);
    },
  },
  argTypes: {
    cancel: { action: "cancel" },
  },
};

type Args = FormDialogProps;

export const Form = (args: Args) => (
  <FormDialog {...{ ...args }}>«content»</FormDialog>
);
export const FormSubmitting = (args: Args) => (
  <FormDialog {...{ ...args, isSubmitting: true }}>«content»</FormDialog>
);
