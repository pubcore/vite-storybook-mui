import { InputSelect, InputSelectProps } from "../";

export default {
  title: "InputSelect",
  args: {
    register: () => {
      //dummy
    },
    label: "select stars",
  },
};
type Args = InputSelectProps;

export const Default = (args: Args) => <InputSelect {...{ ...args }} />;
export const Error = (args: Args) => (
  <InputSelect
    {...{
      ...args,
      errorText:
        "exploded with a longer text, and there should occure a line break",
    }}
  />
);
