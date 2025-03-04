import { defineConfig } from 'astro/config';
import { remarkCustomComponents } from './src/plugins/remarkCustomComponents.mjs';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import vue from '@astrojs/vue';

import tailwindcss from "@tailwindcss/vite";
import expressiveCode from 'astro-expressive-code';

export default defineConfig({
  site: 'https://docs.thgaltitude.com',

  integrations: [expressiveCode({
    themes: ['github-dark-default'],
  }), mdx({
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

  server: { port: 8080 },

  vite: {
    plugins: [tailwindcss({
      globalStyle: "./src/styles/global.css"
    })]
  }
});