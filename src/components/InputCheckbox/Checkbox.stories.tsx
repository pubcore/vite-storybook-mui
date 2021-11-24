import React from "react";
import { InputCheckbox as Checkbox, InputCheckboxProps } from "../";
import FormDecorator from "../../FormDecorator";

export default {
  title: "Checkboxes",
  decorators: [FormDecorator],
  args: {}, //"form" is injected in FormDecorator
  parameters: {
    defaultValues: { three: true },
  },
};

type Args = InputCheckboxProps;

export const WithoutLabel = (args: Args) => {
    return <Checkbox {...{ ...args, name: "one" }} />;
  },
  WithLabel = (args: Args) => (
    <Checkbox {...{ ...args, name: "two", label: "I read the text" }} />
  ),
  WithDefaultValueTrue = (args: Args) => (
    <Checkbox {...{ ...args, name: "three" }} />
  );
