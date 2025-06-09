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
import config from './config/site.js'

export default defineConfig({
  output: 'server',
  integrations: [
      altitudeMiddleware({
            config,
            api: { enabled: true, graphql: gqlIndex }
        }),
] 
})
```

The config might look something like: 

```js
// config/site.js
import { fetchIcon } from '@thg-altitude/utils';
import siteConfigFile from '../local/tenants/siteone.json';
import siteLangFile from '../local/lang/siteone.en_gb.properties.json';

export default {
  domains: ['www.siteone.com'],
  tenantInstance: 'siteone',
  commerce: {
    endpoint: 'https://horizon-api.www.siteone.com/graphql'
  },
  kv: [
    {
      key: 'siteone',
      namespace: 'config',
      local: siteConfigFile
    },
    {
      key: 'siteone.en_gb.properties',
      namespace: 'lang',
      local: siteLangFile
    }
  ],
  icons: {
    search: await fetchIcon('lucide', 'search'),
    left: await fetchIcon('lucide', 'chevron-left'),
    right: await fetchIcon('lucide', 'chevron-right')
  },
  i18n: {
    locales: [
      {
        prefix: 'en-gb',
        domain: 'www.siteone.com',
        icons: {
          flag: await fetchIcon('circle-flags', 'gb')
        }
      }
    ],
    fallbackLocale: 'en-gb',
    exclusionList: ['api', 'images']
  }
};
```

For a full list of optional keys see the [config reference](../reference/config)

### Multi-tenancy mode

Define each of the site configs in their own respective file:

```javascript
// /config/siteone.js

import { env } from "@thg-altitude/astro-integration";
export default {
  domains: ["www.siteone.com"],
  commerce: {
    endpoint: "",
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

To switch between www.siteone.com and www.sitetwo.com, change your x-altitude-instance header from www.sisteone.com to www.sitetwo.com using the [ModHeader extension](https://chromewebstore.google.com/detail/modheader-modify-http-hea/idgpnmonknjnojddfkpgkljpfnnfcklj?hl=en). 

see the [multitenancy reference](../reference/multi-tenancy) for more info


## Config validation

In development mode, the first thing that astro-integration will do is validate the config or configs you have passed to it to make sure they match the schema (see the [config reference](../reference/config)) for the required keys.
