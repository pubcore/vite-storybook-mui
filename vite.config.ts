import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { peerDependencies } from "./package.json";

import typescript from "@rollup/plugin-typescript";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: "./src/components/index.ts",
      name: "@pubcore/vite-storybook-mui",
      fileName: (format) => `index.${format}.js`,
      formats: ["es"],
    },
    rollupOptions: {
      external: Object.keys(peerDependencies),
      plugins: [
        typescript({
          declaration: true,
          declarationDir: "./dist",
          include: "./src/components/**/*",
          exclude: "./src/**/*.stories.tsx",
        }),
      ],
    },
    sourcemap: true,
  },
});
