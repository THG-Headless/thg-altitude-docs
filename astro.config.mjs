import { fileURLToPath } from 'node:url';
import { defineConfig, passthroughImageService } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import { remarkCustomComponents } from './src/plugins/remarkCustomComponents.mjs';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import vue from '@astrojs/vue';
import altitude from '@thg-altitude/astro-adapter';

import tailwindcss from "@tailwindcss/vite";

const componentsDir = new URL('./src/components/', import.meta.url);

// @cloudflare/vite-plugin treats every `.html` import as a Workers text module,
// which would turn our HTML component imports into plain strings. Resolve them
// first so Astro still compiles them as components.
function htmlComponents() {
  return {
    name: 'altitude-docs:html-components',
    enforce: 'pre',
    resolveId(source) {
      if (source.startsWith('@components/') && source.endsWith('.html')) {
        return fileURLToPath(new URL(source.slice('@components/'.length), componentsDir));
      }
      return null;
    },
  };
}

export default defineConfig({
  site: 'http://thgaltitude.com/',
  output: 'server',
  adapter: altitude(),
  build: {
    assets: 'statics'
  },
  // Astro 7 defaults to 'jsx'; keep the v5 whitespace behaviour.
  compressHTML: true,
  // Astro 7 defaults to Sätteri; remark/rehype plugins need the unified processor.
  markdown: {
    processor: unified(),
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
      htmlComponents(),
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