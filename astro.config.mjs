import { defineConfig, passthroughImageService } from 'astro/config';
import { remarkCustomComponents } from './src/plugins/remarkCustomComponents.mjs';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import vue from '@astrojs/vue';
import altitude from '@thg-altitude/astro-adapter';

import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: 'http://thgaltitude.com/',
  output: 'server',
  adapter: altitude(),
  build: {
    assets: 'statics'
  },
  integrations: [
  mdx({
    syntaxHighlight: 'shiki',
    shikiConfig: {
      theme: 'houston'
    },
    extendMarkdownConfig: true,
    optimize: true,
    remarkPlugins: [remarkCustomComponents],
    rehypePlugins: [],
    remarkRehype: {
      allowDangerousHtml: true,
      passThrough: ['mdxJsxFlowElement']
    },
    gfm: true
  }), react(), vue()],
  server: {
    port: 8080,
    host: 'localhost'
  },
  image: {
    service: passthroughImageService(),
  },
  vite: {
    plugins: [
      tailwindcss({
        globalStyle: "./src/styles/global.css"
      })
    ],
    resolve: {
      // Use react-dom/server.edge instead of react-dom/server.browser for React 19.
      // Without this, MessageChannel from node:worker_threads needs to be polyfilled.
      alias: import.meta.env.PROD && {
        "react-dom/server": "react-dom/server.edge",
      },
    },
    ssr: {
      external: ['node:buffer', 'node:fs', 'node:path'],
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'class-variance-authority', 'clsx', 'tailwind-merge'],
      // Force dependency pre-bundling
      force: true
    }
  }
});