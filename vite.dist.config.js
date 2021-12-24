
import { defineConfig } from 'vite'
import copy from 'rollup-plugin-copy'
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { adorableCSS } from "adorable-css/vite-plugin-adorable-css"

const path = require('path');

const alias = require('./alias');

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    jsxFactory: 'createElementJsx',
    jsxFragment: 'Fragment',
    jsxInject: `import { createElementJsx } from "el/sapa/functions/jsx"`
  },
  resolve: {
    alias,
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/editor-layouts/designeditor/index.js'),
      name: 'EasyLogicEditor',
      fileName: (format) => `editor.${format}.js`
    }
  },
  plugins: [
    adorableCSS({
      include: ['**/*.{svelte,jsx}']
    }),    
    svelte({
      /* plugin options */
    }),
    copy({
      targets: [
        { src: 'index.d.ts', dest: 'dist/' },
      ],
      hook: 'writeBundle',
    })
  ]

})