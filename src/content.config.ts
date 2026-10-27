import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Keep the legacy entry ids (relative path including extension, e.g.
// `platform/v2.4.0/edge/cache.md`) — the routing, version and search utils
// parse them, and the default glob ids would slugify `v2.4.0` to `v240`.
const legacyId = ({ entry }: { entry: string }) => entry;

const docs = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/docs', generateId: legacyId }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    draft: z.boolean().optional(),
    order: z.number().optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog', generateId: legacyId }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    author: z.string().optional(),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional(),
  }),
});

export const collections = {
  docs,
  blog,
};
