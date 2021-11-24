import { InputText, InputTextProps } from "../";

export default {
  title: "Input text",
  args: {
    name: "name",
    register: () => {
      //dummy
    },
  },
};

type Args = InputTextProps;

export const Default = (args: Args) => <InputText {...args} />,
  WithLable = (args: Args) => <InputText {...args} label="Your name" />,
  WithHint = (args: Args) => (
    <InputText {...args} helperText="Here some help text" />
  );
