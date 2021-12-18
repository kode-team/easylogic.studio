
import { defineConfig } from 'vite'
import { replaceCodePlugin } from "vite-plugin-replace";
// import { adorableCSS } from "adorable-css/vite-plugin-adorable-css"

const alias = require('./alias');
const pkgJSON = require('./package.json');

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    jsxFactory: 'createElement',
    jsxFragment: 'Fragment',
    jsxInject: `import { createElement } from "el/sapa/functions/jsx"`    
  },
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