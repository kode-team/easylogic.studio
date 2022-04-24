
import { defineConfig } from 'vite'
import copy from 'rollup-plugin-copy'

const path = require('path');

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    jsxFactory: 'createElementJsx',
    jsxFragment: 'FragmentInstance',
    jsxInject: `import { createElementJsx, FragmentInstance } from "sapa"`    
  },
  resolve: {
    alias: {
      'elf': path.resolve(__dirname, "./src/elf"),
      'sapa': path.resolve(__dirname, "./src/sapa"),
      'style': path.resolve(__dirname, "./src/scss"),
      'plugins': path.resolve(__dirname, "./src/plugins"),
      'export-library': path.resolve(__dirname, "./src/export-library"),
      'editor-layouts': path.resolve(__dirname, "./src/editor-layouts"),
    }
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/editor-layouts/index.js'),
      name: 'elf',
      fileName: (format) => `editor.${format}.js`
    }
  },
  plugins: [
    copy({
      targets: [
        { src: 'index.d.ts', dest: 'dist/' },
      ],
      hook: 'writeBundle',
    })
  ]

})