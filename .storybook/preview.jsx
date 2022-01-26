import { useDarkMode } from "storybook-dark-mode";
import { createTheme } from "../src/theme";
import { AppDecorator } from "../src/components";
import "../i18n/config";

export const decorators = [
  (Story) => (
    <AppDecorator {...{ useDarkMode, createTheme }}>
      <Story />
    </AppDecorator>
  ),
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};
