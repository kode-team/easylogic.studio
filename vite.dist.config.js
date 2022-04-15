
import { defineConfig } from 'vite'
import copy from 'rollup-plugin-copy'

const path = require('path');

const alias = require('./alias');

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    jsxFactory: 'createElementJsx',
    jsxFragment: 'FragmentInstance',
    jsxInject: `import { createElementJsx, FragmentInstance } from "el/sapa/functions/jsx"`    
  },
  resolve: {
    alias,
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/editor-layouts/index.js'),
      name: 'EasyLogicEditor',
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