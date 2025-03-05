---
title: Sidebar Ordering
description: Learn how to customize the order of items in the documentation sidebar
order: 5
---

# Customizing Sidebar Order

This guide explains how to control the order of items in the documentation sidebar using frontmatter properties.

## Using the `order` Property

You can control the position of pages in the sidebar by adding an `order` property to the frontmatter of your markdown files:

```markdown
---
title: My Page Title
description: Page description
order: 2
---
```

Pages with lower `order` values appear before pages with higher values. Pages without an `order` value will appear after all ordered pages, sorted alphabetically by title.

## Example

Here's how different `order` values affect the sidebar position:

| File | Order Value | Position |
|------|-------------|----------|
| getting-started.md | 1 | First |
| configuration.md | 2 | Second |
| quickstart.md | 2 | Third (alphabetical within same order) |
| advanced-topics.md | 3 | Fourth |
| unordered-page.md | (none) | Last (alphabetical among unordered) |

## Directory Ordering

Directories (sections) in the sidebar are ordered based on the lowest `order` value of any file within that directory. This allows you to control the position of entire sections in the sidebar.

For example, if you have a directory structure like:

```
cloud/
├── getting-started.md (order: 1)
├── configuration.md (order: 2)
├── edge/
│   ├── overview.md (order: 4)
│   └── functions.md (order: 5)
└── guides/
    ├── create-a-site.md (order: 6)
    └── sidebar-ordering.md (order: 5)
```

The sidebar would be ordered as:

1. Getting Started (order: 1)
2. Configuration (order: 2)
3. Edge (lowest order in directory: 4)
4. Guides (lowest order in directory: 5)

## Best Practices

Here are some best practices for using sidebar ordering:

1. **Use increments of 10**: Use values like 10, 20, 30 to leave room for inserting new pages between existing ones.

2. **Be consistent**: Use the same ordering scheme across all documentation.

3. **Document your order values**: Keep a record of your order values to avoid conflicts.

4. **Group related content**: Use similar order ranges for related content.

5. **Consider new users**: Place introductory content at the beginning.

## Example Ordering Scheme

Here's an example ordering scheme for documentation:

- **1-10**: Getting started, overview
- **11-20**: Basic concepts
- **21-50**: Core features
- **51-70**: Advanced topics
- **71-90**: Reference
- **91-99**: Troubleshooting, FAQ

## Updating Existing Documentation

When adding new pages to existing documentation:

1. Check the order values of surrounding pages
2. Choose an appropriate value for your new page
3. Update the frontmatter with the chosen order value
4. Verify the sidebar order after publishing

By using the `order` property consistently, you can create an intuitive navigation structure that guides users through your documentation in a logical sequence.