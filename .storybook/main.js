//const viteProjectConfig = require("../vite.config.ts");

const storiesBasePath = "../src/components";

// const only = [];
const only = ["JsonSchemaForm", "Button"];


module.exports = {
  framework: "@storybook/react",
  core: {
    builder: "storybook-builder-vite",
  },
  stories: ["../src/components"],
  stories: only.length > 0 ? only.map(o => `${storiesBasePath}/${o}/**/*.stories.tsx`) : [`${storiesBasePath}/**/*.stories.tsx`],
  typescript: {
    check: false,
    reactDocgen: false,
  },
  features: {
    //https://storybook.js.org/docs/react/configure/overview#on-demand-story-loading
    storyStoreV7: true,
    postcss: false,
    emotionAlias: false,
  },
  addons: [
    "@storybook/addon-links",
    {
      name: "@storybook/addon-essentials",
      options: {
        backgrounds: false,
        docs: false,
        controls: false,
      },
    },
    "storybook-dark-mode",
  ],
  staticDirs: ["../pub"], //do not name it public, rollopu copies it to dist
};
