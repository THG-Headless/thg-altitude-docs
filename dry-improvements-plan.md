# DRY Improvements Plan for THG Altitude Docs

## 0. Common Patterns Identified

### Page Structure
- All product pages follow identical layout structure
- Common sections: Features, Business Value, Resources
- Consistent styling and grid layouts
- Shared components: PageLayout, ProductHero

### Component Patterns
- Feature cards with icon, title, description
- Resource links with icon, title, description
- Business value sections with title, description, and two-column layout
- Highlight sections in ProductHero

## 1. Centralize Product Page Configurations

### Create Extended Product Interface
```typescript
interface ProductPageConfig extends Product {
  features: {
    title: string;
    description: string;
    icon: string;
  }[];
  resources: {
    title: string;
    description: string;
    href: string;
    icon: string;
  }[];
  highlights: {
    title: string;
    description: string;
  }[];
  businessValue?: {
    title: string;
    description: string;
    sections: {
      title: string;
      description: string;
    }[];
  };
}
```

### Move to Centralized Configuration
Create `src/config/product-pages.ts` to store all product-specific page content, reducing duplication across individual product pages.

## 2. Create Reusable Components

### Product Page Sections
Extract common sections into reusable components:
- `src/components/products/ProductFeatures.astro`
- `src/components/products/ProductResources.astro`
- `src/components/products/ProductBusinessValue.astro`

### Standardize Product Page Template
Create a unified product page template that uses the centralized configuration:
```typescript
// src/layouts/ProductPageLayout.astro
interface Props {
  productId: string;
}
```

## 3. Standardize Documentation Structure

### Quick Links Template
Define a standard quick links structure in the Product interface:
```typescript
interface QuickLinksTemplate {
  overview: string;    // /products/{id}
  docs: string;        // /docs/{id}
  quickstart?: string; // /docs/{id}/quickstart
  api?: string;        // /docs/{id}/api
}
```

### Documentation Layout Components
Create reusable documentation components:
- `src/components/docs/DocsSidebar.astro` - Consistent sidebar navigation
- `src/components/docs/DocsHeader.astro` - Standard documentation header
- `src/components/docs/ApiReference.astro` - Reusable API documentation template

## 4. Icon System Improvements

### Icon Management
- Create an icon registry in `src/components/icons/index.ts`
- Convert all inline SVGs to reusable components
- Implement consistent sizing and styling system
- Categories:
  - UI icons (arrows, chevrons, etc.)
  - Feature icons (used in feature sections)
  - Product icons (from /icons directory)
  - Resource icons (documentation, gallery, etc.)

### Icon Component System
```typescript
// src/components/icons/Icon.astro
interface Props {
  name: string;          // Icon identifier
  size?: 'sm' | 'md' | 'lg';  // Predefined sizes
  className?: string;    // Additional classes
}
```

Example usage:
```astro
<Icon name="docs" size="md" className="text-primary-600" />
```

## 5. Shared Styles and Constants

### Style System
- Extract repeated class combinations into Tailwind components
- Create consistent spacing and layout utilities
- Define reusable card and section styles

Example:
```css
/* src/styles/components.css */
@layer components {
  .feature-card {
    @apply text-center bg-white dark:bg-stone-900 p-6 rounded-xl shadow-sm;
  }
  .section-container {
    @apply max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto;
  }
}
```

## Implementation Steps

### Phase 1: Foundation (Weeks 1-2)
1. Create shared style system
   - Extract common Tailwind patterns
   - Define reusable components
   - Set up consistent spacing/layout
   - Implement dark mode utilities

2. Implement icon system
   - Create Icon component
   - Convert all SVGs to component library
   - Update existing icon usage
   - Document icon categories and usage

### Phase 2: Component Architecture (Weeks 2-3)
3. Create shared product page components
   - ProductFeatures component with standardized layout
   - ProductResources with consistent card design
   - ProductBusinessValue with flexible sections
   - Extract and standardize common layouts

4. Build configuration system
   - Define extended product interfaces
   - Create product page configs
   - Set up documentation structure
   - Implement type checking

### Phase 3: Migration (Weeks 3-4)
5. Convert one product (Cloud) as proof of concept
   - Implement new components
   - Use centralized configuration
   - Validate functionality
   - Test responsive behavior

6. Systematic migration of remaining products
   - Convert each product page
   - Update documentation pages
   - Ensure consistent navigation
   - Validate cross-product links

### Phase 4: Quality & Documentation (Week 5)
7. Testing and validation
   - Add component tests
   - Verify responsive behavior
   - Check accessibility compliance
   - Performance testing

8. Documentation updates
   - Document new component system
   - Create usage guidelines
   - Update developer documentation
   - Add migration guide

## Benefits

- Reduced code duplication
- Easier maintenance and updates
- Consistent user experience
- Simplified product page creation
- Type-safe configurations

## Migration Strategy

1. Start with one product (e.g., Cloud) as a proof of concept
2. Create and test new components and configurations
3. Gradually migrate other product pages
4. Add automated tests for shared components
5. Document the new system for future maintainers