import { getCollection } from 'astro:content';
import * as semver from 'semver';

/**
 * Check if a folder name matches a semver pattern
 * @param folder Folder name to check
 * @returns True if the folder name matches a semver pattern
 */
export function isVersionFolder(folder: string): boolean {
  // Match patterns like v1.0.0, 1.0.0, v1, etc.
  return /^v?\d+(\.\d+)*$/.test(folder);
}

/**
 * Get all versions for a product
 * @param productId Product ID
 * @returns Array of version folders, sorted by semver (latest first)
 */
export async function getProductVersions(productId: string): Promise<string[]> {
  const allDocs = await getCollection('docs');
  
  // Find all folders that match semver pattern
  const versionFolders = new Set<string>();
  
  allDocs.forEach(doc => {
    if (doc.id.startsWith(`${productId}/`)) {
      const parts = doc.id.split('/');
      if (parts.length >= 2 && isVersionFolder(parts[1])) {
        versionFolders.add(parts[1]);
      }
    }
  });
  
  // Sort versions semantically
  return Array.from(versionFolders).sort((a, b) => {
    // Remove 'v' prefix if present for semver comparison
    const verA = a.replace(/^v/, '');
    const verB = b.replace(/^v/, '');
    
    // Use semver.compare if both are valid semver
    if (semver.valid(verA) && semver.valid(verB)) {
      return -semver.compare(verA, verB); // Negative to sort latest first
    }
    
    // Fall back to simple string comparison for non-standard versions
    return b.localeCompare(a);
  });
}

/**
 * Get the latest version for a product
 * @param versions Array of version folders
 * @returns The latest version or null if no versions exist
 */
export function getLatestVersion(versions: string[]): string | null {
  return versions.length > 0 ? versions[0] : null;
}

/**
 * Check if a path contains a version segment
 * @param path URL path
 * @param productId Product ID
 * @returns Object with version and base path if found, null otherwise
 */
export function extractVersionFromPath(path: string, productId: string): { version: string; basePath: string } | null {
  const pathParts = path.split('/');
  const productIndex = pathParts.indexOf(productId);
  
  if (productIndex >= 0 && pathParts.length > productIndex + 1) {
    const potentialVersion = pathParts[productIndex + 1];
    if (isVersionFolder(potentialVersion)) {
      const basePath = pathParts.slice(0, productIndex + 1).join('/');
      return { version: potentialVersion, basePath };
    }
  }
  
  return null;
}

/**
 * Generate version navigation links
 * @param currentPath Current URL path
 * @param productId Product ID
 * @param currentVersion Current version
 * @param allVersions All available versions
 * @param basePath Base path without version
 * @returns Array of version navigation links
 */
export function generateVersionLinks(
  currentPath: string,
  productId: string,
  currentVersion: string,
  allVersions: string[],
  basePath: string
): { version: string; url: string; isLatest: boolean; isCurrent: boolean }[] {
  const latestVersion = getLatestVersion(allVersions);
  const remainingPath = currentPath.substring((basePath + '/' + currentVersion).length);
  
  return allVersions.map(version => ({
    version,
    url: `${basePath}/${version}${remainingPath}`,
    isLatest: version === latestVersion,
    isCurrent: version === currentVersion
  }));
}