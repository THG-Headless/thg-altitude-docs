#!/usr/bin/env node

/**
 * Documentation Migration Script
 * 
 * This script automates the migration of documentation from source projects to the central docs site.
 * It handles:
 * 1. Creating necessary directory structure
 * 2. Copying and adapting content files
 * 3. Replacing "Horizon" with "Commerce API" where appropriate
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Source and target paths
const INSIGHTS_SOURCE = '/Users/gourleyp/Sites/thg-commerce-insights/docs/src/content/docs';
const COMMERCE_API_SOURCE = '/Users/gourleyp/Sites/Horizon-Public-Docs';
const TARGET_BASE = '/Users/gourleyp/Sites/thg-commerce-docs/src/content/docs';

// Directory structure for Insights
const INSIGHTS_DIRS = [
  'insights',
  'insights/frameworks',
  'insights/core',
  'insights/guides',
  'insights/reference'
];

// Directory structure for Commerce API
const COMMERCE_API_DIRS = [
  'commerce-api',
  'commerce-api/examples',
  'commerce-api/examples/basket',
  'commerce-api/examples/checkout',
  'commerce-api/examples/customer',
  'commerce-api/examples/features',
  'commerce-api/examples/navigation',
  'commerce-api/examples/product',
  'commerce-api/examples/product-lists'
];

// File mapping for Insights (source path -> target path)
const INSIGHTS_FILES = [
  { src: 'index.mdx', dest: 'insights/index.mdx' },
  { src: 'getting-started.mdx', dest: 'insights/getting-started.mdx' },
  { src: 'astro/integration.mdx', dest: 'insights/frameworks/astro.mdx' },
  { src: 'next/integration.mdx', dest: 'insights/frameworks/nextjs.mdx' },
  { src: 'react-native/tracking.mdx', dest: 'insights/frameworks/react-native.mdx' },
  { src: 'core/beacon.mdx', dest: 'insights/core/beacon.mdx' },
  { src: 'guides/altitude.mdx', dest: 'insights/guides/altitude.mdx' },
  { src: 'guides/offline-support.mdx', dest: 'insights/guides/offline-support.mdx' },
  { src: 'guides/source-resolution.mdx', dest: 'insights/guides/source-resolution.mdx' },
  { src: 'guides/troubleshooting.mdx', dest: 'insights/guides/troubleshooting.mdx' },
  { src: 'reference/api.mdx', dest: 'insights/reference/api.mdx' }
];

// File mapping for Commerce API (source path -> target path)
const COMMERCE_API_FILES = [
  { src: 'index.md', dest: 'commerce-api/index.mdx', transform: true },
  { src: 'examples/basket/add-to-basket.md', dest: 'commerce-api/examples/basket/add-to-basket.mdx', transform: true },
  { src: 'examples/basket/discount-codes.md', dest: 'commerce-api/examples/basket/discount-codes.mdx', transform: true },
  { src: 'examples/basket/index.md', dest: 'commerce-api/examples/basket/index.mdx', transform: true },
  { src: 'examples/basket/supersize.md', dest: 'commerce-api/examples/basket/supersize.mdx', transform: true },
  { src: 'examples/checkout/index.md', dest: 'commerce-api/examples/checkout/index.mdx', transform: true },
  { src: 'examples/customer/account-creation.md', dest: 'commerce-api/examples/customer/account-creation.mdx', transform: true },
  { src: 'examples/customer/account-data.md', dest: 'commerce-api/examples/customer/account-data.mdx', transform: true },
  { src: 'examples/customer/customer-referrals.md', dest: 'commerce-api/examples/customer/customer-referrals.mdx', transform: true },
  { src: 'examples/customer/customer-services.md', dest: 'commerce-api/examples/customer/customer-services.mdx', transform: true },
  { src: 'examples/customer/index.md', dest: 'commerce-api/examples/customer/index.mdx', transform: true },
  { src: 'examples/customer/login.md', dest: 'commerce-api/examples/customer/login.mdx', transform: true },
  { src: 'examples/features/click-and-collect.md', dest: 'commerce-api/examples/features/click-and-collect.mdx', transform: true },
  { src: 'examples/features/customer-referrals.md', dest: 'commerce-api/examples/features/customer-referrals.mdx', transform: true },
  { src: 'examples/features/index.md', dest: 'commerce-api/examples/features/index.mdx', transform: true },
  { src: 'examples/features/loyalty.md', dest: 'commerce-api/examples/features/loyalty.mdx', transform: true },
  { src: 'examples/features/product-personalisation.md', dest: 'commerce-api/examples/features/product-personalisation.mdx', transform: true },
  { src: 'examples/features/reviews.md', dest: 'commerce-api/examples/features/reviews.mdx', transform: true },
  { src: 'examples/features/supersize.md', dest: 'commerce-api/examples/features/supersize.mdx', transform: true },
  { src: 'examples/navigation/index.md', dest: 'commerce-api/examples/navigation/index.mdx', transform: true },
  { src: 'examples/navigation/navigation-types.md', dest: 'commerce-api/examples/navigation/navigation-types.mdx', transform: true },
  { src: 'examples/product/index.md', dest: 'commerce-api/examples/product/index.mdx', transform: true },
  { src: 'examples/product/reviews.md', dest: 'commerce-api/examples/product/reviews.mdx', transform: true },
  { src: 'examples/product-lists/index.md', dest: 'commerce-api/examples/product-lists/index.mdx', transform: true },
  { src: 'examples/product-lists/product-list.md', dest: 'commerce-api/examples/product-lists/product-list.mdx', transform: true },
  { src: 'examples/product-lists/search.md', dest: 'commerce-api/examples/product-lists/search.mdx', transform: true }
];

/**
 * Create directories if they don't exist
 * @param {string} dir - Directory path
 */
function createDirectory(dir) {
  const fullPath = path.join(TARGET_BASE, dir);
  if (!fs.existsSync(fullPath)) {
    console.log(`Creating directory: ${fullPath}`);
    fs.mkdirSync(fullPath, { recursive: true });
  }
}

/**
 * Transform content by replacing "Horizon" with "Commerce API"
 * @param {string} content - File content
 * @returns {string} - Transformed content
 */
function transformContent(content) {
  // Don't replace in code blocks, URLs, or specific technical references
  const lines = content.split('\n');
  let inCodeBlock = false;
  
  return lines.map(line => {
    // Check if we're entering or leaving a code block
    if (line.trim().startsWith('```') || line.trim().startsWith('~~~')) {
      inCodeBlock = !inCodeBlock;
      return line;
    }
    
    // Don't replace in code blocks or if the line contains a URL
    if (inCodeBlock || line.includes('http') || line.includes('```') || line.includes('`Horizon`')) {
      return line;
    }
    
    // Replace "Horizon" with "Commerce API" in regular text
    return line
      .replace(/\bHorizon\b/g, 'Commerce API')
      .replace(/\bhorizon\b/g, 'commerce-api');
  }).join('\n');
}

/**
 * Update frontmatter to match target site format
 * @param {string} content - File content
 * @param {string} filename - File name
 * @returns {string} - Content with updated frontmatter
 */
function updateFrontmatter(content, filename) {
  // Extract title from the content
  const titleMatch = content.match(/title:\s*(.*)/);
  const title = titleMatch ? titleMatch[1].trim() : path.basename(filename, path.extname(filename));
  
  // Extract description from the content
  const descMatch = content.match(/description:\s*(.*)/);
  const description = descMatch ? descMatch[1].trim() : '';
  
  // Check if content already has frontmatter
  if (content.startsWith('---')) {
    // Replace existing frontmatter
    return content.replace(/---\n([\s\S]*?)---/, `---
title: ${title}
description: ${description}
---`);
  } else {
    // Add new frontmatter
    return `---
title: ${title}
description: ${description}
---

${content}`;
  }
}

/**
 * Copy and transform a file
 * @param {string} sourcePath - Source file path
 * @param {string} targetPath - Target file path
 * @param {boolean} transform - Whether to transform content
 */
function copyFile(sourcePath, targetPath, transform = false) {
  try {
    console.log(`Copying ${sourcePath} to ${targetPath}`);
    
    // Read source file
    let content = fs.readFileSync(sourcePath, 'utf8');
    
    // Transform content if needed
    if (transform) {
      content = transformContent(content);
    }
    
    // Update frontmatter
    content = updateFrontmatter(content, targetPath);
    
    // Write to target file
    fs.writeFileSync(path.join(TARGET_BASE, targetPath), content);
    
    console.log(`Successfully copied and transformed ${targetPath}`);
  } catch (error) {
    console.error(`Error copying ${sourcePath}: ${error.message}`);
  }
}

/**
 * Main function to run the migration
 */
function runMigration() {
  console.log('Starting documentation migration...');
  
  // Create directories
  console.log('\nCreating directory structure...');
  [...INSIGHTS_DIRS, ...COMMERCE_API_DIRS].forEach(createDirectory);
  
  // Copy Insights files
  console.log('\nMigrating Insights documentation...');
  INSIGHTS_FILES.forEach(file => {
    const sourcePath = path.join(INSIGHTS_SOURCE, file.src);
    copyFile(sourcePath, file.dest);
  });
  
  // Copy Commerce API files
  console.log('\nMigrating Commerce API documentation...');
  COMMERCE_API_FILES.forEach(file => {
    const sourcePath = path.join(COMMERCE_API_SOURCE, file.src);
    copyFile(sourcePath, file.dest, file.transform);
  });
  
  console.log('\nMigration completed successfully!');
}

// Run the migration
runMigration();