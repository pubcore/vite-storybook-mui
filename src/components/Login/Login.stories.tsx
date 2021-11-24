import React from "react";
import { Login, LoginProps } from "../";

export default {
  title: "Login",
  parameters: { actions: { argTypesRegex: "^on.*" } },
  argTypes: { login: { action: "login" } },
  args: {
    registerUri: "https://localhost",
  },
};

type Args = LoginProps;

export const Default = (args: Args) => <Login {...{ ...args }} />,
  Wait = (args: Args) => (
    <Login
      {...{
        ...args,
        login: () =>
          new Promise((res) =>
            setTimeout(
              () => res({ textkey: "succeeded", severity: "info" }),
              1000
            )
          ),
      }}
    />
  );
