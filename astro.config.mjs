import { defineConfig, passthroughImageService } from 'astro/config';
import { remarkCustomComponents } from './src/plugins/remarkCustomComponents.mjs';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import vue from '@astrojs/vue';
import altitude from '@thg-altitude/astro-adapter';

import tailwindcss from "@tailwindcss/vite";
import expressiveCode from 'astro-expressive-code';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  site: 'https://docs.thgaltitude.com',
  output: 'server',
  adapter: altitude({}),
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
  image: {
    service: passthroughImageService(),
  },
  vite: {
    plugins: [
      tailwindcss({
        globalStyle: "./src/styles/global.css"
      }),
      {
        name: 'vite-plugin-raw-css',
        transform(code, id) {
          if (id.endsWith('?raw')) {
            const realPath = id.replace('?raw', '');
            const fileContent = fs.readFileSync(path.resolve(realPath), 'utf-8');
            return `export default ${JSON.stringify(fileContent)};`;
          }
        }
      }
    ],
    ssr: {
      external: ['node:buffer', 'node:fs', 'node:path'],
    }
  }
});