import { getCollection } from 'astro:content';

export async function GET({ request }) {
  try {
    // Get all markdown content from collections
    const docsEntries = await getCollection('docs');
    const blogEntries = await getCollection('blog');
    
    // Combine all entries
    const allEntries = [...docsEntries, ...blogEntries];
    
    // Extract and concatenate markdown content
    let allContent = '';
    
    for (const entry of allEntries) {
      // Add metadata about the file
      allContent += `\n\n# File: ${entry.id}\n\n`;
      
      // Add frontmatter as YAML
      allContent += '---\n';
      Object.entries(entry.data).forEach(([key, value]) => {
        allContent += `${key}: ${value}\n`;
      });
      allContent += '---\n\n';
      
      // Add the actual content
      allContent += entry.body;
      
      // Add separator between files
      allContent += '\n\n-------------------------------------------\n\n';
    }
    
    // Return the content directly as a text response
    return new Response(allContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  } catch (error) {
    console.error('Error generating markdown content:', error);
    
    return new Response(`Error generating markdown content: ${error.message}`, {
      status: 500,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }
}