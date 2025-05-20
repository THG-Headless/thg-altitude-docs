---
title: Getting started
order: 0
---

# Installation

```sh
npm i @thg-altitude/astro-integration
```

## Invoking the integration 

### Single-tenancy mode

The build config and `altitudeMiddleware` function should be imported and passed as an argument to the integration as shown below.

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tenants from './config/site.js'

export default defineConfig({
  output: 'server',
  integrations: [
      altitudeMiddleware({
            buildConfig : tenants,
            api: { enabled: true, graphql: gqlIndex }
        }),
] 
})
```

Where 'buildConfig' is an object that is defined in [schema](https://github.com/THG-AltitudeSiteBuilds/astro-integration/blob/main/config_schemas/schemaV2.json) 


### Multi-tenancy mode

Define each of the site configs in their own respective file:

```javascript
// /config/siteone.js

import { env } from "@thg-altitude/astro-integration";
export default {
  site: "www.siteone.com",
  commerce: {
    endpoint: "",
  },
  blog: {
    secret: env("SITEONE_ENV_REFERENCE"),
  },
};
```

Export the config files from a single file as an array containing each config object:

```javascript
// /config/index.js

import siteone from "./siteone";
import sitetwo from "./sitetwo";

export default [siteone, sitetwo];
```

Inside of the astro.config.mjs file, import the integration function and invoke this inside of defineConfig with your site configs array.

```javascript
import { altitudeMiddleware, env } from "@thg-altitude/astro-integration";
import tenants from "./config";

export default defineConfig({
  integrations: [
    altitudeMiddleware({
      config: tenants,
    }),
  ],
});
```

see the [multitenancy reference](../reference/multi-tenancy) for more info