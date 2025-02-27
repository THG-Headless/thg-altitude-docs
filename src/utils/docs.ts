import type { CollectionEntry } from 'astro:content';
import type { Product } from '../config/products';

export interface DocPageData {
  doc: CollectionEntry<'docs'>;
  product: Product;
  headings: {
    depth: number;
    slug: string;
    text: string;
  }[];
  Content: any;
}

export async function getDocPageData(productId: string, docPath: string): Promise<DocPageData> {
  const { getCollection } = await import('astro:content');
  const { getProduct } = await import('../config/products');

  const docs = await getCollection('docs');
  const doc = docs.find((doc: CollectionEntry<'docs'>) => doc.id === docPath);

  if (!doc) {
    throw new Error(`Documentation not found: ${docPath}`);
  }

  const product = getProduct(productId);
  const { Content, headings } = await doc.render();

  return {
    doc,
    product,
    headings,
    Content
  };
}