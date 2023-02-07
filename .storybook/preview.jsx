import { useDarkMode } from "storybook-dark-mode";
import { createTheme } from "../src/theme";
import { AppDecorator } from "../src/components";
import "../i18n/config";
import React from "react";

export const decorators = [
  (Story) => (
    <AppDecorator {...{ useDarkMode, createTheme }}>
      <React.StrictMode>
        <Story />
      </React.StrictMode>
    </AppDecorator>
  ),
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  layout: "fullscreen",
};
