import { Logout, LogoutProps } from "../";

export default {
  title: "Logout",
  argTypes: {
    logout: { action: "logout" },
  },
};

type Args = LogoutProps;

export const Default = (args: Args) => <Logout {...{ ...args }} />;
