---
title: Deploying with Astro
---

## What is Astro?

Astro is an all-in-one web framework for building fast, content-focused websites.

## Key Features

- Component Islands: A new web architecture for building faster websites.
- Server-first API design: Move expensive hydration off of your users’ devices.
- Zero JS, by default: No JavaScript runtime overhead to slow you down.
- Edge-ready: Deploy anywhere, even a global edge runtime like Deno or Cloudflare.
- Customizable: Tailwind, MDX, and 100+ other integrations to choose from.
- UI-agnostic: Supports React, Preact, Svelte, Vue, Solid, Lit and more.

## Deploy on Altitude

Altitude has first-class support for Astro and deploying an Astro site is possible in a few steps.

### 1. Create an Astro Project.

Follow the instructions on Astro's documentation to create a new project or if you have an existing project, skip this step.

### 2. Set your Astro Mode.

Astro ships with three different output targets:

- ‘static’ - Building a static site to be deploy to any static host (static site generation).
- ‘server’ - Building an app to be deployed to a host supporting SSR (server-side rendering).
- ‘hybrid’ - Building a static site with a few server-side rendered pages (hybrid rendering).

You can configure this in your [astro.config.js](https://docs.astro.build/en/reference/configuration-reference/#output).

### 3. Create your Altitude file.

Altitude depends on one file existing in your project and this helps describe the type of deployment and the settings for your projects build.

Depending on the output mode selected above refer to these guides on tailoring your `altitude.yaml` file appropriately.

- [Create an SSR Site](./create-a-ssr-site/)
- [Create an SSG Site](./create-a-ssr-site/)
- [Create an SPA Site](./create-a-ssr-site/)

### 4. Done! 🎉
