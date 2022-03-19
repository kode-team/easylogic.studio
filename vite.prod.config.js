import { defineConfig } from 'vite'
import { adorableCSS } from "adorable-css/vite-plugin-adorable-css"

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
    outDir: path.join(__dirname, './docs'),
    rollupOptions: {
      input: {
        editor: path.resolve(__dirname, 'index.html'),
      }
    }
  },
  plugins: [
    adorableCSS({
      include: ['**/*.{svelte,jsx}']
    })
  ]
})