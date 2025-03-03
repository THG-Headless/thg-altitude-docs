# Bespoke Components Prototype

This document contains prototype implementations of the bespoke components that will replace the Starlight components.

## Tabs Component

```astro
---
// src/components/bespoke/Tabs.astro
---

<div class="tabs">
  <div class="tabs-header" role="tablist">
    {/* We'll generate tab buttons from the TabItem children */}
  </div>
  <div class="tabs-content">
    <slot />
  </div>
</div>

<script>
  // Client-side JavaScript for tab switching
  document.addEventListener('DOMContentLoaded', () => {
    const tabContainers = document.querySelectorAll('.tabs');
    
    tabContainers.forEach(container => {
      // Find all tab items within this container
      const tabItems = container.querySelectorAll('.tab-item');
      
      // Create tab buttons if they don't exist
      const tabsHeader = container.querySelector('.tabs-header');
      if (tabsHeader && tabsHeader.children.length === 0) {
        tabItems.forEach((tabItem, index) => {
          const label = tabItem.getAttribute('data-label') || `Tab ${index + 1}`;
          const button = document.createElement('button');
          button.className = 'tab-button';
          button.setAttribute('role', 'tab');
          button.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
          button.setAttribute('tabindex', index === 0 ? '0' : '-1');
          button.setAttribute('data-index', index.toString());
          button.textContent = label;
          tabsHeader.appendChild(button);
        });
      }
      
      // Get all tab buttons
      const tabButtons = container.querySelectorAll('.tab-button');
      
      // Set initial state
      if (tabButtons.length > 0 && tabItems.length > 0) {
        tabItems.forEach((panel, index) => {
          if (index !== 0) panel.hidden = true;
        });
      }
      
      // Add click handlers to tab buttons
      tabButtons.forEach((button) => {
        button.addEventListener('click', () => {
          const selectedIndex = parseInt(button.getAttribute('data-index') || '0');
          
          // Update tab button states
          tabButtons.forEach(btn => {
            btn.setAttribute('aria-selected', 'false');
            btn.setAttribute('tabindex', '-1');
          });
          button.setAttribute('aria-selected', 'true');
          button.setAttribute('tabindex', '0');
          
          // Show selected panel, hide others
          tabItems.forEach((panel, panelIndex) => {
            panel.hidden = panelIndex !== selectedIndex;
          });
        });
      });
      
      // Add keyboard navigation
      container.addEventListener('keydown', (e) => {
        if (e.target.classList.contains('tab-button')) {
          const currentIndex = parseInt(e.target.getAttribute('data-index') || '0');
          let newIndex = currentIndex;
          
          if (e.key === 'ArrowRight') {
            newIndex = (currentIndex + 1) % tabButtons.length;
          } else if (e.key === 'ArrowLeft') {
            newIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
          } else {
            return;
          }
          
          tabButtons[newIndex].click();
          tabButtons[newIndex].focus();
        }
      });
    });
  });
</script>

<style>
  .tabs {
    margin: 1.5rem 0;
    border-radius: 0.5rem;
    overflow: hidden;
    background-color: var(--color-bg-secondary, #f9fafb);
  }
  
  .tabs-header {
    display: flex;
    border-bottom: 1px solid var(--color-border, #e5e7eb);
    background-color: var(--color-bg-tabs-header, #f3f4f6);
  }
  
  .tab-button {
    padding: 0.75rem 1.25rem;
    border: none;
    background: transparent;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    font-weight: 500;
    color: var(--color-text-secondary, #4b5563);
    transition: all 0.2s ease;
  }
  
  .tab-button[aria-selected="true"] {
    border-bottom-color: var(--color-primary, #3b82f6);
    color: var(--color-primary, #3b82f6);
    background-color: var(--color-bg-tabs-active, #fff);
  }
  
  .tab-button:hover:not([aria-selected="true"]) {
    background-color: var(--color-bg-tabs-hover, #e5e7eb);
    color: var(--color-text-primary, #1f2937);
  }
  
  .tabs-content {
    padding: 1.5rem;
    background-color: var(--color-bg-content, #fff);
  }
</style>
```

## TabItem Component

```astro
---
// src/components/bespoke/TabItem.astro
interface Props {
  label: string;
}

const { label } = Astro.props;
---

<div class="tab-item" role="tabpanel" data-label={label}>
  <slot />
</div>

<style>
  .tab-item {
    margin: 0;
  }
</style>
```

## Usage Example

Here's how these components would be used in MDX files:

```astro
---
title: Get Started
description: Framework agnostic components for core commerce functionality.
---

import { Tabs, TabItem } from "@components/bespoke/Tabs";
import Preview from "@components/docs/preview.astro";
import VariationsAstro from "@components/docs/variations/VariationsAstro.astro";

## Installation

```sh
npm install @thg-altitude/elements
```

## Setup

The elements package exports framework specific components which can be imported into your application.

<div class="not-content">
<Tabs>
    <TabItem label="Preview">
        <Preview>
          <VariationsAstro sku="10530943" />
        </Preview>
    </TabItem>
  <TabItem label="Vue">
    ```vue
    <script setup>
      import { VariationVue } from "@thg-altitude/elements/vue"; 
    </script>

    <template>
      <VariationVue />
    </template>
    ```

  </TabItem>
  <TabItem label="Astro">
    ```astro
      ---
      import { VariationAstro } from "@thg-altitude/elements/astro"; 
      ---
      <VariationAstro />
    ``` 
  </TabItem>
</Tabs>
</div>
```

## Implementation Notes

1. The Tabs component automatically generates tab buttons based on the TabItem children
2. Each TabItem has a `label` prop that is used for the tab button text
3. The component handles tab switching, keyboard navigation, and accessibility
4. The styling is customizable through CSS variables

## Accessibility Features

- Proper ARIA roles and attributes
- Keyboard navigation support
- Focus management
- High contrast styling

## Browser Compatibility

The component is designed to work in all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## Performance Considerations

- The component uses client-side JavaScript for tab switching
- The script is lightweight and only runs after the DOM is loaded
- No external dependencies are required