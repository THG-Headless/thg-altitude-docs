---
title: Enabling i18n
order: 2
---


## Prerequisites:

Before you begin, make sure you have: 

- astro-integration running in multitenancy mode. See [guide](../guides/enable-multitenancy)

(Note: i18n is not supported for single-tenancy mode at this time.)

## Step 1: Add i18n keys to each buildConfig in the tenants array

Make sure *every* tenant in the `tenants` array that you are passing to `altitudeMiddleware` has an i18n key.

To check that this is working, run `npm run dev` in the console, you should see the following: 

```
15:40:31 [info] Detected multi-tenancy config (i18n enabled)
```

## Step 2: Support rewrites in astro folder structure

When i18n is enabled, astro-integration rewrites every request to `/pathname` to `/localePrefix/pathname` 

<div class="callout info">

For example, if localePrefix is `/en-gb` then a request to `/` will be rewritten to `/en-gb/` and a request to `/basket` will be rewritten to `/en-gb/basket`

</div>

This means that your storefront must have the appropriate request handlers. This can be achieved by nesting your normal handlers in the `/pages` directory into `pages/[locale`, 

The custom 404.astro page should remain at the root of the pages directory to serve any custom 404 pages.

```jsx
pages
├── [locale]
│   ├── [...https].astro
│   ├── basket.astro
│   ├── c
│   │   └── [...slug]
│   │       └── index.astro
│   ├── create-review
│   │   └── [...handle]
│   │       └── index.astro
│   ├── index.astro
│   ├── kv
│   │   └── sessionSettings.js
│   ├── p
│   │   └── [...handle]
│   │       └── index.astro
│   ├── reviews
│   │   └── [sku].astro
│   ├── robots.txt.js
│   └── search.astro
└── 404.astro
```

At request time, astro-integration will read the x-altitude-instance header (in dev mode) or the [X-Forwarded-Host](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Forwarded-Host) header (in production) to decide which tenantConfig to read.

To mitigate the risk of duplicate content, any requests directly to the prefix that have not been subject to a rewrite will 404.

Example request pattern:

```
www.example.com => rewrite => www.example.com/en-gb/
www.example.com/en-gb/ => www.example.com/en-gb/ (404)
```