import type { CollectionEntry } from 'astro:content';

export interface MDXImports {
  Tip: any;
  Warning: any;
  Note: any;
  EmojiList: any;
  CodeBlock: any;
  Table: any;
}

export interface MDXData {
  doc: CollectionEntry<'docs'>;
  imports: MDXImports;
  headings: {
    depth: number;
    slug: string;
    text: string;
  }[];
  Content: any;
}

export async function getMDXData(docPath: string): Promise<MDXData> {
  const { getCollection } = await import('astro:content');
  const { Tip, Warning, Note, EmojiList, CodeBlock, Table } = await import('@components/docs');

  const docs = await getCollection('docs');
  const doc = docs.find((doc: CollectionEntry<'docs'>) => doc.id === docPath);

  if (!doc) {
    throw new Error(`Documentation not found: ${docPath}`);
  }

  const { Content, headings } = await doc.render();

  return {
    doc,
    imports: {
      Tip,
      Warning,
      Note,
      EmojiList,
      CodeBlock,
      Table
    },
    headings,
    Content
  };
}