import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { peerDependencies } from "./package.json";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/components/index.ts"),
      name: "@pubcore/vite-storybook-mui",
      fileName: (format) => `index.${format}.js`,
      formats: ["es"],
    },
    rollupOptions: {
      external: Object.keys(peerDependencies),
    },
    sourcemap: true,
  },
});
