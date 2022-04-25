import { defineConfig } from "vite";

import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    jsxFactory: "createElementJsx",
    jsxFragment: "FragmentInstance",
    jsxInject: `import { createElementJsx, FragmentInstance } from "sapa"`,
  },
  resolve: {
    alias: {
      "elf/ui": path.resolve(__dirname, "./src/elf/ui"),
      elf: path.resolve(__dirname, "./src/elf"),
      sapa: path.resolve(__dirname, "./src/sapa"),
      style: path.resolve(__dirname, "./src/scss"),
      plugins: path.resolve(__dirname, "./src/plugins"),
      "export-library": path.resolve(__dirname, "./src/export-library"),
      "editor-layouts": path.resolve(__dirname, "./src/editor-layouts"),
    },
  },
  build: {
    outDir: path.join(__dirname, "./docs"),
    rollupOptions: {
      input: {
        editor: path.resolve(__dirname, "index.html"),
        whiteboard: path.resolve(__dirname, "whiteboard.html"),
        dataeditor: path.resolve(__dirname, "dataeditor.html"),
        threeeditor: path.resolve(__dirname, "3d.html"),
        blankeditor: path.resolve(__dirname, "blank.html"),
      },
    },
  },
});
