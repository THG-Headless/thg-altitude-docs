---
title: Getting started
order: 0
---

# Installation

```sh
npm i @thg-altitude/astro-integration
```

## Invoking the integration

The build config and `altitudeMiddleware` function should be imported and passed as an argument to the integration as shown below.

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import buildConfig from './config/site.js'

export default defineConfig({
  output: 'server',
  integrations: [
    altitudeMiddleware(buildConfig)
] 
})
```

Where 'buildConfig' is an object that is defined in [schema](https://github.com/THG-AltitudeSiteBuilds/astro-integration/blob/main/config_schemas/schemaV2.json) 
