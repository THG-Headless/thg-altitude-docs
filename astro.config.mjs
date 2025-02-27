import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import { remarkCustomComponents } from './src/plugins/remarkCustomComponents.mjs';

export default defineConfig({
  site: 'https://docs.thgaltitude.com',
  integrations: [
    mdx({
      extendMarkdownConfig: true,
      optimize: true,
      syntaxHighlight: 'prism',
      remarkPlugins: [remarkCustomComponents],
      rehypePlugins: [],
      remarkRehype: {
        allowDangerousHtml: true,
        passThrough: ['mdxJsxFlowElement']
      },
      gfm: true
    }),
    tailwind()
  ],
  markdown: {
    syntaxHighlight: 'prism',
    remarkPlugins: [remarkCustomComponents],
    rehypePlugins: [],
    remarkRehype: {
      allowDangerousHtml: true
    },
    gfm: true
  },
  server: { port: 8080 }
});
