
import { defineConfig } from 'vite'
import { replaceCodePlugin } from "vite-plugin-replace";


const path = require('path');
const alias = require('./alias');

const pkgJSON = require('./package.json');

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias,
    },
    plugins: [
        replaceCodePlugin({
            replacements: [
              {
                from: /\@\@VERSION\@\@/g,
                to: pkgJSON.version,
              },
            ],
          }),
      ]

})