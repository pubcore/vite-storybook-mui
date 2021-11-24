import { Form, FormProps } from "../";
import { Button } from "@mui/material";

export default {
  title: "Form container",
  argTypes: {
    onSubmit: { action: "onSubmit" },
  },
};

export const Default = (args: FormProps) => (
  <Form {...args}>
    <Button>dummy, to make the form not empty</Button>
  </Form>
);
