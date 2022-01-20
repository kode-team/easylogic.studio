
import { defineConfig } from 'vite'
import { replaceCodePlugin } from "vite-plugin-replace";
import { adorableCSS } from "adorable-css/vite-plugin-adorable-css"
import { svelte } from '@sveltejs/vite-plugin-svelte';

const alias = require('./alias');
const pkgJSON = require('./package.json');

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    // open: true,
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
    adorableCSS({
      include: ['**/*.{svelte,jsx}']
    }),    
    svelte({
			/* plugin options */
		}),    
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