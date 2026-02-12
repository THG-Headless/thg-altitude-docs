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
import { defineConfig } from "astro/config";
import config from "./config/site.js";

export default defineConfig({
  output: "server",
  integrations: [
    altitudeMiddleware({
      config,
      api: { enabled: true, graphql: gqlIndex, dirName: "[locale]" },
    }),
  ],
});
```

The config might look something like:

```js
// config/site.js
import { fetchIcon } from "@thg-altitude/utils";
import siteConfigFile from "../local/tenants/siteone.json";
import siteLangFile from "../local/lang/siteone.en_gb.properties.json";

export default {
  domains: ["www.siteone.com"],
  tenantInstance: "siteone",
  commerce: {
    endpoint: "https://horizon-api.www.siteone.com/graphql",
  },
  kv: [
    {
      key: "siteone",
      namespace: "config",
      local: siteConfigFile,
    },
    {
      key: "siteone.en_gb.properties",
      namespace: "lang",
      local: siteLangFile,
    },
  ],
  icons: {
    search: await fetchIcon("lucide", "search"),
    left: await fetchIcon("lucide", "chevron-left"),
    right: await fetchIcon("lucide", "chevron-right"),
  },
  i18n: {
    domains: {
      "www.siteone.com": {
        locales: {
          "en-gb": {
            icons: {
              flag: await fetchIcon("circle-flags", "gb"),
            },
          },
        },
        pathBasedRouting: false,
        fallbackLocale: "en-us",
      },
    },
    localeCookie: "locale_V6",
  },
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

That's it! You can now switch between tenants 'siteone' and 'sitetwo' by switching the x-altitude-instance header between www.siteone.com and www.sitetwo.com. When running your app locally, we recommend using the [ModHeader extension](https://chromewebstore.google.com/detail/modheader-modify-http-hea/idgpnmonknjnojddfkpgkljpfnnfcklj?hl=en) to change headers.

See the [multitenancy reference](../reference/multi-tenancy) for more information.

### Path based routing

Version 3 of the Astro Integration now supports path based routing. One tenant can support both domain based and path based routing.
For example, the config below has two domains, a .com and a .de, here the .com site does domain based routing and the .de does path based supporting both .de/de-de/ and .de/de-at/ paths.

```js
// config/site.js
import { fetchIcon } from "@thg-altitude/utils";
import siteConfigFile from "../local/tenants/siteone.json";
import siteLangFile from "../local/lang/siteone.en_gb.properties.json";
import siteConfigDeFile from "../local/tenants/siteoneDe.json";
import siteLangDeFile from "../local/lang/siteone.de_de.properties.json";
import siteConfigAtFile from "../local/tenants/siteoneAt.json";
import siteLangAtFile from "../local/lang/siteone.de_at.properties.json";

export default {
  domains: ["www.siteone.com", "www.siteone.de"],
  tenantInstance: "siteone",
  commerce: {
    endpoint: "https://horizon-api.www.siteone.com/en-gb/graphql",
  },
  kv: [
    {
      key: "siteone",
      namespace: "config",
      local: siteConfigFile,
    },
    {
      key: "siteone.en_gb.properties",
      namespace: "lang",
      local: siteLangFile,
    },
  ],
  icons: {
    search: await fetchIcon("lucide", "search"),
    left: await fetchIcon("lucide", "chevron-left"),
    right: await fetchIcon("lucide", "chevron-right"),
  },
  i18n: {
    domains: {
      "www.siteone.com": {
        locales: {
          "en-gb": {
            icons: {
              flag: await fetchIcon("circle-flags", "gb"),
            },
          },
        },
        pathBasedRouting: false,
        fallbackLocale: "de-de",
      },
      "www.siteone.de": {
        locales: {
          "de-de": {
            icons: {
              flag: await fetchIcon("circle-flags", "de"),
            },
            commerce: {
              endpoint: "https://horizon-api.www.siteone.com/de-de/graphql",
            },
            kv: [
              {
                key: "siteone",
                namespace: "config",
                local: siteConfigDeFile,
              },
              {
                key: "siteone.de_de.properties",
                namespace: "lang",
                local: siteLangDeFile,
              },
            ],
          },
          "de-at": {
            icons: {
              flag: await fetchIcon("circle-flags", "at"),
            },
            commerce: {
              endpoint: "https://horizon-api.www.siteone.com/de-at/graphql",
            },
            kv: [
              {
                key: "siteone",
                namespace: "config",
                local: siteConfigAtFile,
              },
              {
                key: "siteone.de_at.properties",
                namespace: "lang",
                local: siteLangAtFile,
              },
            ],
          },
        },
        pathBasedRouting: true,
        fallbackLocale: "de-de",
      },
    },
    localeCookie: "locale_V6",
  },
};
```

### Custom Locale Prefixes (v3.0.0)

V3.0.0 introduces the ability to use custom URL prefixes instead of standard locale codes. This allows for more user-friendly URLs and better local branding:

```js
// config/site.js with custom prefixes
export default {
  domains: ["www.global-store.com"],
  tenantInstance: "global-store",
  commerce: {
    endpoint: "https://api.global-store.com/graphql",
  },
  i18n: {
    domains: {
      "www.example.com": {
        pathBasedRouting: true,
        fallbackLocale: "en-us",
        locales: {
          "en-us": {
            commerce: {
              endpoint: "https://api.example.com/en/graphql"
            }
          },
          "en-mt": {
            customPrefix: "en-eu",
            commerce: {
              endpoint: "https://api.example.com/fr/graphql"
            }
          },
          "de-de": {
            customPrefix: "deutsch",
            commerce: {
              endpoint: "https://api.global-store.com/de/graphql"
            }
          }
        }
      }
    },
    localeCookie: "locale_V6"
  }
}
```

This configuration creates URL patterns like:
- `www.example.com/en-us/p/123` (English - fallback locale)
- `www.example.com/en-mt/p/123` (en-mt site with custom prefix)
- `www.example.com/de-de/p/123` (German site)
```

## Config validation

In development mode, the astro-integration will validate your configuration against JSON Schema v3 to ensure all required properties are present and properly formatted. The validation includes:

- **Required properties**: domains, commerce.endpoint, pathBasedRouting, fallbackLocale
- **Format validation**: Locale codes must match `xx-xx` pattern
- **Custom prefix validation**: Must be URL-safe if provided
- **Domain constraints**: Domain-based routing limited to 1 locale per domain

See the [config reference](../reference/config) for complete schema information.
