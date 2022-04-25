import { defineConfig } from "vite";
import { replaceCodePlugin } from "vite-plugin-replace";
import eslintPlugin from "vite-plugin-eslint";

import path from "path";
// eslint-disable-next-line no-undef
const pkgJSON = require("./package.json");

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    open: true,
    // watch: {
    //   usePolling: true,
    // },
    hmr: {
      protocol: "ws",
      host: "localhost",
    },
  },
  test: {
    environment: "happy-dom",
    global: true,
  },
  esbuild: {
    jsxFactory: "createElementJsx",
    jsxFragment: "FragmentInstance",
    jsxInject: `import { createElementJsx, FragmentInstance } from "sapa/functions/jsx"`,
  },
  resolve: {
    alias: {
      "elf/ui": path.resolve(__dirname, "./src/elf/ui"),
      "elf/core": path.resolve(__dirname, "./src/elf/core"),
      elf: path.resolve(__dirname, "./src/elf"),
      sapa: path.resolve(__dirname, "./src/sapa"),
      style: path.resolve(__dirname, "./src/scss"),
      plugins: path.resolve(__dirname, "./src/plugins"),
      "export-library": path.resolve(__dirname, "./src/export-library"),
      "apps/common": path.resolve(__dirname, "./src/apps/common"),
      apps: path.resolve(__dirname, "./src/apps"),
    },
  },
  plugins: [
    eslintPlugin(),
    replaceCodePlugin({
      replacements: [
        {
          from: /@@VERSION@@/g,
          to: pkgJSON.version,
        },
      ],
    }),
  ],
});
