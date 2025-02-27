# THG Altitude Documentation

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Documentation Features](#documentation-features)
  - [Versioned Documentation](#versioned-documentation)
  - [Navigation Structure](#navigation-structure)
  - [Content Sorting](#content-sorting)
  - [Special Pages](#special-pages)
- [Development](#development)
- [Deployment](#deployment)

## Overview

Documentation site covering the following:

- **Browser Components** - Browser native UI (Accessible / Performant as Possible)
- **Custom Components** - Directory of opinionated web components
- **Elements** - Installable commerce features
- **Starter Kits** - Commerce accelerant
- **Astro Integration** - i18N, Commerce API, Blog API abstractions
- **Astro Adapter** - Astro to Altitude worker adapter
- **Altitude CLI** - Environment management
- **Altitude v0** - Prompt to UI to deployment interface/LLM

The documentation site is built with [Astro](https://astro.build/).

## Project Structure

```
thg-altitude-docs/
├── public/             # Static assets
├── src/
│   ├── assets/         # Project assets
│   ├── components/     # Astro components
│   ├── config/         # Configuration files
│   ├── content/        # Documentation content (Markdown/MDX)
│   │   └── docs/       # Documentation files
│   │       ├── product1/
│   │       │   ├── v1.0.0/  # Versioned docs
│   │       │   ├── v2.0.0/  # Versioned docs
│   │       │   └── ...
│   │       └── product2/
│   ├── layouts/        # Page layouts
│   ├── pages/          # Astro pages
│   ├── plugins/        # Custom plugins
│   ├── styles/         # CSS styles
│   └── utils/          # Utility functions
└── astro.config.mjs    # Astro configuration
```

## Documentation Features

### Versioned Documentation

The documentation system supports versioned documentation for each product, allowing you to maintain multiple versions of documentation simultaneously.

#### Version Structure

Versions are organized using semver-formatted folders within each product's documentation directory:

```
src/content/docs/product/
├── index.mdx           # Product landing page
├── changelog.mdx       # Product changelog
├── v1.0.0/             # Version 1.0.0 docs
│   ├── index.mdx       # Version landing page
│   ├── guides/         # Guides for this version
│   └── ...
├── v2.0.0/             # Version 2.0.0 docs
│   ├── index.mdx       # Version landing page
│   ├── guides/         # Guides for this version
│   └── ...
└── ...
```

#### Version Detection

The system automatically detects version folders using the following pattern:
- Folders that match `v\d+(\.\d+)*` (e.g., `v1.0.0`, `v2.1.0`)
- Folders that match `\d+(\.\d+)*` (e.g., `1.0.0`, `2.1.0`)

#### Version Navigation

When viewing versioned documentation:

1. A version dropdown appears in the navigation breadcrumb
2. The dropdown shows all available versions for the current product
3. The latest version is highlighted with a "Latest" badge
4. An "Always use latest" option redirects to the `/docs/[product]/latest/[...path]` URL

#### Latest Version Redirect

The system provides a special route for accessing the latest version of documentation:

```
/docs/[product]/latest/[...path]
```

This route automatically redirects to the corresponding path in the latest version, making it easy to link to the most current documentation.

#### Automatic Redirection

When accessing a product's documentation without specifying a version (e.g., `/docs/cloud`), the system automatically redirects to the latest version of that product's documentation.

### Navigation Structure

The documentation system generates a hierarchical navigation structure based on the content files.

#### Sidebar Generation

The sidebar navigation is automatically generated from the content files, with the following features:

1. **Hierarchical Structure**: Files are organized into a nested structure based on their directory hierarchy
2. **Active Item Highlighting**: The current page and its parent sections are highlighted
3. **Expandable Sections**: Sections can be expanded/collapsed to show/hide their children
4. **Automatic Hiding**: The sidebar is automatically hidden when there's no content to display

#### Special Case Handling

- **Single Item Pages**: If a page is the only item in its section (e.g., a standalone page like `/docs/cloud/changelog`), the sidebar is hidden to provide a cleaner layout
- **Non-versioned Content**: Non-versioned content (e.g., `/docs/cloud/changelog`) is accessible without redirection

### Content Sorting

The documentation system provides several ways to control the order of items in the navigation:

#### Order Property

You can specify an `order` property in the frontmatter of any content file to control its position in the navigation:

```yaml
---
title: Getting Started
description: Learn how to get started with Altitude
order: 1
---
```

Items with an `order` property are sorted before items without one, and items with the same `order` are sorted alphabetically.

#### Directory Ordering

The order of directories is determined by the minimum `order` of their children. This allows you to control the position of entire sections by setting the `order` of their index files.

#### Default Sorting

When no `order` is specified, the system uses the following sorting rules:

1. Directories come before files
2. Items are sorted alphabetically by title

### Special Pages

#### Product Index Pages

Each product has an index page at `/docs/[product]/index.mdx` that serves as the landing page for that product's documentation.

#### Changelog Pages

Products can have a changelog page at `/docs/[product]/changelog.mdx` that lists all changes across versions.

#### Version Index Pages

Each version has an index page at `/docs/[product]/[version]/index.mdx` that serves as the landing page for that version's documentation.

## Development

To run the documentation site locally:

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm run dev
```

The site will be available at http://localhost:3000.

## Deployment

The documentation site is deployed using the Altitude Platform.