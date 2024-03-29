//const viteProjectConfig = require("../vite.config.ts");

module.exports = {
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  stories: ["../src/components/**/*.stories.tsx"],
  typescript: {
    check: false,
    reactDocgen: false,
  },
  features: {
    //https://storybook.js.org/docs/react/configure/overview#on-demand-story-loading
    storyStoreV7: true,
    postcss: false,
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
