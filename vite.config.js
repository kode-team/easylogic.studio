
import { defineConfig } from 'vite'
import { replaceCodePlugin } from "vite-plugin-replace";
// import { adorableCSS } from "adorable-css/vite-plugin-adorable-css"


const path = require('path');
const alias = require('./alias');

const pkgJSON = require('./package.json');

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias,
  },
  plugins: [
    // adorableCSS({
    //   include: [
    //     'src/**/*.js',
    //   ],
    // }),
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