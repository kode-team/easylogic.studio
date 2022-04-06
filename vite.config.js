
import { defineConfig } from 'vite'
import { replaceCodePlugin } from "vite-plugin-replace";

const alias = require('./alias');
const pkgJSON = require('./package.json');

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    open: true,
    watch: {
      usePolling: true
    },    
    hmr: {
      protocol: 'ws',
      host: 'localhost'
    }
  },
  test: {
    environment: 'happy-dom',
    global: true,
  },
  esbuild: {
    jsxFactory: 'createElementJsx',
    jsxFragment: 'FragmentInstance',
    jsxInject: `import { createElementJsx, FragmentInstance } from "el/sapa/functions/jsx"`    
  },
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