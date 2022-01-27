//const viteProjectConfig = require("../vite.config.ts");
const path = require("path");
const toPath = (_path) => path.join(process.cwd(), _path);

module.exports = {
  framework: "@storybook/react",
  core: {
    builder: "webpack5",
  },
  stories: ["../src/components"],
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
      },
    },
    "storybook-dark-mode",
  ],
  staticDirs: ["../pub"], //do not name it public, rollopu copies it to dist
  webpackFinal: async (config) => {
    return {
      ...config,
      experiments: {
        topLevelAwait: true,
      },
    };
  },
};
