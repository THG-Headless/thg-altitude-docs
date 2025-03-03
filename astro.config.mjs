import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import { remarkCustomComponents } from './src/plugins/remarkCustomComponents.mjs';

import react from '@astrojs/react';

import vue from '@astrojs/vue';

import expressiveCode from 'astro-expressive-code';

export default defineConfig({
  site: 'https://docs.thgaltitude.com',
  output: 'hybrid',
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
  }), tailwind(), react(), vue()],
  server: { port: 8080 }
});