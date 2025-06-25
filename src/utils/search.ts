import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export interface SearchResult {
  id: string;
  title: string;
  content: string;
  url: string;
  productId: string;
  versionId: string;
  slug: string;
}

export interface SearchIndex {
  title: string;
  content: string;
  url: string;
  id: string;
  productId: string;
  versionId: string;
  slug: string;
}

/**
 * Extract product and version from a document ID
 * e.g., "platform/v2.3.0/edge/cache" -> { productId: "platform", versionId: "v2.3.0" }
 */
export function extractProductVersion(docId: string): { productId: string; versionId: string } | null {
  const parts = docId.split('/');
  if (parts.length >= 2) {
    return {
      productId: parts[0],
      versionId: parts[1]
    };
  }
  return null;
}

/**
 * Generate search index for all documentation
 */
export async function generateAllDocsSearchIndex(): Promise<SearchIndex[]> {
  const docs = await getCollection('docs');
  const searchIndex: SearchIndex[] = [];
  
  for (const doc of docs) {
    try {
      const scope = extractProductVersion(doc.id);
      if (!scope) continue;
      
      const content = extractSearchableContent(doc.body);
      const cleanId = doc.id.replace(/\.(md|mdx)$/, '');
      const slug = doc.id.replace(`${scope.productId}/${scope.versionId}/`, '');
      
      searchIndex.push({
        id: doc.id,
        title: doc.data.title || 'Untitled',
        content,
        url: `/docs/${cleanId}`,
        productId: scope.productId,
        versionId: scope.versionId,
        slug
      });
    } catch (error) {
      console.warn(`Failed to process document ${doc.id}:`, error);
    }
  }
  
  return searchIndex;
}

/**
 * Generate search index for all products (latest versions only)
 */
export async function generateAllProductsLatestVersionsSearchIndex(): Promise<SearchIndex[]> {
  const docs = await getCollection('docs');
  const searchIndex: SearchIndex[] = [];
  
  // Group docs by product to find latest versions
  const productVersions = new Map<string, string[]>();
  
  docs.forEach(doc => {
    const scope = extractProductVersion(doc.id);
    if (scope) {
      if (!productVersions.has(scope.productId)) {
        productVersions.set(scope.productId, []);
      }
      if (!productVersions.get(scope.productId)!.includes(scope.versionId)) {
        productVersions.get(scope.productId)!.push(scope.versionId);
      }
    }
  });
  
  // Get latest version for each product (assuming semantic versioning)
  const latestVersions = new Map<string, string>();
  for (const [productId, versions] of productVersions) {
    const sortedVersions = versions.sort((a, b) => {
      // Simple version comparison - could be enhanced
      const aNum = parseFloat(a.replace(/[^\d.]/g, ''));
      const bNum = parseFloat(b.replace(/[^\d.]/g, ''));
      return bNum - aNum; // Descending order
    });
    latestVersions.set(productId, sortedVersions[0]);
  }
  
  // Build index with only latest versions
  for (const doc of docs) {
    try {
      const scope = extractProductVersion(doc.id);
      if (!scope || latestVersions.get(scope.productId) !== scope.versionId) continue;
      
      const content = extractSearchableContent(doc.body);
      const cleanId = doc.id.replace(/\.(md|mdx)$/, '');
      const slug = doc.id.replace(`${scope.productId}/${scope.versionId}/`, '');
      
      searchIndex.push({
        id: doc.id,
        title: doc.data.title || 'Untitled',
        content,
        url: `/docs/${cleanId}`,
        productId: scope.productId,
        versionId: scope.versionId,
        slug
      });
    } catch (error) {
      console.warn(`Failed to process document ${doc.id}:`, error);
    }
  }
  
  return searchIndex;
}

/**
 * Generate search index for all versions of a specific product
 */
export async function generateProductSearchIndex(productId: string): Promise<SearchIndex[]> {
  const docs = await getCollection('docs');
  const searchIndex: SearchIndex[] = [];
  
  for (const doc of docs) {
    try {
      const scope = extractProductVersion(doc.id);
      if (!scope || scope.productId !== productId) continue;
      
      const content = extractSearchableContent(doc.body);
      const cleanId = doc.id.replace(/\.(md|mdx)$/, '');
      const slug = doc.id.replace(`${scope.productId}/${scope.versionId}/`, '');
      
      searchIndex.push({
        id: doc.id,
        title: doc.data.title || 'Untitled',
        content,
        url: `/docs/${cleanId}`,
        productId: scope.productId,
        versionId: scope.versionId,
        slug
      });
    } catch (error) {
      console.warn(`Failed to process document ${doc.id}:`, error);
    }
  }
  
  return searchIndex;
}

/**
 * Generate search index for a specific product and version
 */
export async function generateSearchIndex(productId: string, versionId: string): Promise<SearchIndex[]> {
  const docs = await getCollection('docs');
  const scopePrefix = `${productId}/${versionId}`;
  
  const scopedDocs = docs.filter(doc => doc.id.startsWith(scopePrefix));
  
  const searchIndex: SearchIndex[] = [];
  
  for (const doc of scopedDocs) {
    try {
      // Extract readable content from the document
      const content = extractSearchableContent(doc.body);
      const slug = doc.id.replace(scopePrefix + '/', '');
      
      // Remove file extensions from the URL
      const cleanId = doc.id.replace(/\.(md|mdx)$/, '');
      
      searchIndex.push({
        id: doc.id,
        title: doc.data.title || 'Untitled',
        content,
        url: `/docs/${cleanId}`,
        productId,
        versionId,
        slug
      });
    } catch (error) {
      console.warn(`Failed to process document ${doc.id}:`, error);
    }
  }
  
  return searchIndex;
}

/**
 * Extract searchable text content from markdown/MDX body
 */
function extractSearchableContent(body: string): string {
  // Remove frontmatter if present
  let content = body.replace(/^---[\s\S]*?---/, '');
  
  // Remove code blocks
  content = content.replace(/```[\s\S]*?```/g, '');
  content = content.replace(/`[^`]*`/g, '');
  
  // Remove HTML/JSX tags
  content = content.replace(/<[^>]*>/g, '');
  
  // Remove markdown formatting
  content = content.replace(/[#*_\[\]()]/g, '');
  
  // Remove extra whitespace and normalize
  content = content.replace(/\s+/g, ' ').trim();
  
  // Limit content length for performance
  if (content.length > 1000) {
    content = content.substring(0, 1000) + '...';
  }
  
  return content;
}

/**
 * Get all available product and version combinations
 */
export async function getAvailableScopes(): Promise<Array<{ productId: string; versionId: string }>> {
  const docs = await getCollection('docs');
  const scopes = new Set<string>();
  
  docs.forEach(doc => {
    const scope = extractProductVersion(doc.id);
    if (scope) {
      scopes.add(`${scope.productId}/${scope.versionId}`);
    }
  });
  
  return Array.from(scopes).map(scope => {
    const [productId, versionId] = scope.split('/');
    return { productId, versionId };
  });
}

/**
 * Filter search results based on query and scope
 */
export function filterSearchResults(
  results: SearchIndex[],
  query: string,
  maxResults: number = 10
): SearchIndex[] {
  if (!query.trim()) {
    return [];
  }
  
  const queryLower = query.toLowerCase();
  
  // Score results based on relevance
  const scoredResults = results.map(result => {
    let score = 0;
    const titleLower = result.title.toLowerCase();
    const contentLower = result.content.toLowerCase();
    
    // Title matches are more important
    if (titleLower.includes(queryLower)) {
      score += titleLower === queryLower ? 100 : 50;
    }
    
    // Content matches
    if (contentLower.includes(queryLower)) {
      score += 10;
    }
    
    // Boost score for matches at the beginning
    if (titleLower.startsWith(queryLower)) {
      score += 25;
    }
    
    return { ...result, score };
  })
  .filter(result => result.score > 0)
  .sort((a, b) => b.score - a.score)
  .slice(0, maxResults);
  
  return scoredResults.map(({ score, ...result }) => result);
}