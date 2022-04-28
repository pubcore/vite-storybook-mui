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
      formats: ["es", "umd"],
    },
    rollupOptions: {
      external: Object.keys(peerDependencies),
      plugins: [
        typescript({
          tsconfig: "./tsconfig-build.json",
        }),
      ],
    },
    sourcemap: true,
  },
});
