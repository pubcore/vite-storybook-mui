import { Button } from "@mui/material";
import { useForm, UseFormReturn } from "react-hook-form";
import { useCallback, JSXElementConstructor } from "react";
import { Form } from "./components";

class FunctionKey extends Function {
  _key!: number;
}
type TStory = JSXElementConstructor<Record<string, never>> & FunctionKey;

const forms: Record<number, UseFormReturn> = {};
let counter = 0;
function useTestForm(Story: TStory, defaultValues = {}) {
  const form = useForm({ defaultValues });
  if (!Story._key) {
    Story._key = ++counter;
  }
  const key = Story._key;
  if (!forms[key]) {
    forms[key] = form;
  }
  return forms[key];
}

export interface FormDecoratorProps {
  args: {
    form: UseFormReturn;
  };
  parameters: { defaultValues: Record<string, unknown> };
}

export default function FormDecorator(
  Story: TStory,
  { args, parameters: { defaultValues = {} } }: FormDecoratorProps
) {
  args.form = useTestForm(Story, defaultValues);
  const { reset } = args.form;
  const onClick = useCallback(() => reset(), [reset]);
  return (
    <Form
      onSubmit={args.form.handleSubmit((values: unknown) =>
        console.log(values)
      )}
    >
      <Story />
      <div>
        <Button {...{ onClick }} variant="outlined" size="small">
          reset
        </Button>
        &nbsp;
        <Button type="submit" color="primary">
          submit
        </Button>
      </div>
    </Form>
  );
}
