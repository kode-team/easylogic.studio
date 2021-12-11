
import { defineConfig } from 'vite'
const path = require('path');

const alias = require('./alias');

// https://vitejs.dev/config/
export default defineConfig({
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
    }
})