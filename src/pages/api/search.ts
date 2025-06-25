import type { APIRoute } from 'astro';
import { generateSearchIndex, generateAllDocsSearchIndex, generateAllProductsLatestVersionsSearchIndex, generateProductSearchIndex, filterSearchResults } from '../../utils/search';

export const GET: APIRoute = async ({ url, request }) => {
  try {
    const searchParams = new URL(request.url).searchParams;
    const query = searchParams.get('q');
    const productId = searchParams.get('product');
    const versionId = searchParams.get('version');
    const limit = parseInt(searchParams.get('limit') || '10');
    const allProducts = searchParams.get('allProducts') === 'true';
    const allVersions = searchParams.get('allVersions') === 'true';

    // Validate required parameters
    if (!productId || !versionId) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required parameters: product and version are required' 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Generate search index based on scope preferences
    let searchIndex;
    if (allProducts && allVersions) {
      // Search across all products and all versions
      searchIndex = await generateAllDocsSearchIndex();
    } else if (allProducts) {
      // Search across all products (latest versions only)
      searchIndex = await generateAllProductsLatestVersionsSearchIndex();
    } else if (allVersions) {
      // Search across all versions of current product
      searchIndex = await generateProductSearchIndex(productId);
    } else {
      // Search only current product/version (default)
      searchIndex = await generateSearchIndex(productId, versionId);
    }

    // If no query provided, return empty results
    if (!query || !query.trim()) {
      return new Response(
        JSON.stringify({ 
          results: [],
          total: 0,
          query: '',
          scope: { 
            productId, 
            versionId,
            allProducts,
            allVersions,
            scopeDescription: allProducts && allVersions ? 'All versions of all products' :
                            allProducts ? 'All products (latest versions)' : 
                            allVersions ? `All ${productId} versions` : 
                            `${productId} ${versionId}`
          }
        }),
        { 
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
          }
        }
      );
    }

    // Filter and return search results
    const results = filterSearchResults(searchIndex, query, limit);

    return new Response(
      JSON.stringify({
        results,
        total: results.length,
        query: query.trim(),
        scope: { 
          productId, 
          versionId,
          allProducts,
          allVersions,
          scopeDescription: allProducts && allVersions ? 'All versions of all products' :
                          allProducts ? 'All products (latest versions)' : 
                          allVersions ? `All ${productId} versions` : 
                          `${productId} ${versionId}`
        }
      }),
      { 
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
        }
      }
    );

  } catch (error) {
    console.error('Search API error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error during search',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

export const POST: APIRoute = async ({ request }) => {
  return new Response(
    JSON.stringify({ error: 'Method not allowed' }),
    { 
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    }
  );
};