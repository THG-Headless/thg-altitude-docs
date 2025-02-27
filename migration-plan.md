# Documentation Migration Plan

## Overview

This plan outlines the steps to migrate documentation from two source projects into the central THG Commerce documentation site:

1. **thg-commerce-insights** → Insights section
2. **Horizon-Public-Docs** → Commerce API section (with renaming from "Horizon" to "Commerce API")

## Source Projects Analysis

### THG Commerce Insights

**Source Location:** `/Users/gourleyp/Sites/thg-commerce-insights/docs/src/content/docs/`

**Content Structure:**
- Main index page with overview
- Getting started guide
- Framework-specific integration guides:
  - Astro
  - Next.js
  - React Native
- Core documentation (beacon)
- Guides (altitude, offline-support, source-resolution, troubleshooting)
- API reference

**Content Format:** MDX files with frontmatter

### Horizon Public Docs (Commerce API)

**Source Location:** `/Users/gourleyp/Sites/Horizon-Public-Docs/`

**Content Structure:**
- Main index page with API overview
- Examples organized by e-commerce functionality:
  - Basket
  - Checkout
  - Customer
  - Features
  - Navigation
  - Product
  - Product lists

**Content Format:** Markdown files with Jekyll frontmatter

## Target Structure

### Insights Section

**Target Location:** `/Users/gourleyp/Sites/thg-commerce-docs/src/content/docs/insights/`

**Planned Structure:**
- `index.mdx` - Overview page
- `getting-started.mdx` - Getting started guide
- `/frameworks/` - Framework-specific guides
  - `astro.mdx`
  - `nextjs.mdx`
  - `react-native.mdx`
- `/core/` - Core concepts
  - `beacon.mdx`
- `/guides/` - Implementation guides
  - `altitude.mdx`
  - `offline-support.mdx`
  - `source-resolution.mdx`
  - `troubleshooting.mdx`
- `/reference/` - API reference
  - `api.mdx`

### Commerce API Section

**Target Location:** `/Users/gourleyp/Sites/thg-commerce-docs/src/content/docs/commerce-api/`

**Planned Structure:**
- `index.mdx` - Overview page (renamed from Horizon to Commerce API)
- `/examples/` - Example implementations
  - `/basket/` - Basket examples
    - `add-to-basket.mdx`
    - `discount-codes.mdx`
    - `index.mdx`
    - `supersize.mdx`
  - `/checkout/` - Checkout examples
    - `index.mdx`
  - `/customer/` - Customer examples
    - `account-creation.mdx`
    - `account-data.mdx`
    - `customer-referrals.mdx`
    - `customer-services.mdx`
    - `index.mdx`
    - `login.mdx`
  - `/features/` - Feature examples
    - `click-and-collect.mdx`
    - `customer-referrals.mdx`
    - `index.mdx`
    - `loyalty.mdx`
    - `product-personalisation.mdx`
    - `reviews.mdx`
    - `supersize.mdx`
  - `/navigation/` - Navigation examples
    - `index.mdx`
    - `navigation-types.mdx`
  - `/product/` - Product examples
    - `index.mdx`
    - `reviews.mdx`
  - `/product-lists/` - Product list examples
    - `index.mdx`
    - `product-list.mdx`
    - `search.mdx`

## Migration Steps

### Phase 1: Prepare Target Directories

1. Create necessary directory structure in the target site
2. Ensure all required directories exist

### Phase 2: Migrate THG Commerce Insights Content

1. Copy and adapt the main index page
2. Migrate getting started guide
3. Migrate framework-specific guides
4. Migrate core documentation
5. Migrate implementation guides
6. Migrate API reference

### Phase 3: Migrate Horizon Public Docs Content

1. Copy and adapt the main index page (with renaming from "Horizon" to "Commerce API")
2. Migrate examples by category
3. Update internal links to use the new structure
4. Ensure all images are properly migrated

### Phase 4: Verify and Test

1. Check all links work correctly
2. Ensure formatting is consistent
3. Verify all images display correctly
4. Test navigation between sections

## Content Adaptation Guidelines

1. Update frontmatter to match the target site format
2. Replace "Horizon" with "Commerce API" in all content (except in code examples and URLs)
3. Ensure consistent styling across all migrated content
4. Update any absolute links to relative links within the documentation
5. Preserve code examples exactly as they are

## Implementation Plan

The migration will be implemented using a script-assisted approach:
1. Create the directory structure first
2. Copy and adapt content file by file
3. Perform text replacements for "Horizon" to "Commerce API"
4. Verify the migration with manual checks