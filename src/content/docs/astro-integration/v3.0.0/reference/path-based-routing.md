---
title: "Path Based Routing"
description: Use one GTLD to serve multiple locales.
---
## Overview
 This integration supports two i18n routing strategies:

 1. **Domain-based routing** - Different domains serve different locales (e.g., `www.example.com`, `www.example.de`)
 2. **Path-based routing** - Locale prefix in the URL path (e.g., `www.example.com/en-gb/p/123`, `www.example.com/de-de/p/123`)

 Path-based routing is ideal when you want to:
 - Serve multiple languages from a single domain
 - Simplify domain management and SSL certificates
 - Allow users to easily switch between languages
 - Maintain SEO benefits with clear locale-specific URLs


  ## How It Works

 ### Locale Detection

 The system extracts locales from URL paths using the pattern `[a-z]{2}-[a-z]{2}` (e.g., `en-gb`, `de-de`, `fr-fr`). When a user visits a URL:

 1. **Direct locale match**: If the path starts with a valid locale (`/en-gb/p/...`), the system uses that locale
 2. **Cookie fallback**: If no locale in path, checks for a locale preference cookie
 3. **Default fallback**: Uses the configured `fallbackLocale` for the domain


  ### Configuration Options
  For full config explanations vist the [config page](./config.md). The key properties needed for path based routing are:

 | Property | Type | Description |
 |----------|------|-------------|
 | `pathBasedRouting` | boolean | Enables path-based routing for the domain |
 | `fallbackLocale` | string | Default locale to redirect to (format: `xx-xx`) |
 | `locales` | object | Map of locale codes to locale configurations |
 | `localeCookie` | string | Name of cookie used to store user's locale preference |


  ## Features

 ### Automatic Redirects

 The system automatically redirects users to appropriate localized URLs:

 - **No locale in path + valid cookie**: `/page` → `/de-de/page` (if cookie has `de-de`)
 - **No locale in path + no cookie**: `/page` → `/en-gb/page` (using fallbackLocale)
 - **Invalid locale in path**: `/invalid/page` → `/en-gb/page` (using fallbackLocale)

  ### Multi-tenant Support

 Path-based routing works with both single and multi-tenant configurations:

 - **Single tenant**: One configuration serves all domains
 - **Multi-tenant**: Different domains can have different locale sets and routing strategies

  ### Mixed tenant configs supported
  One tenant can utilise both path-based and domain based routing. The config setup for this would look like:
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


  ## Schema Validation

 The configuration is validated against JSON Schema with these constraints:

 - **Domain-based routing**: Limited to 1 locale per domain
 - **Path-based routing**: Unlimited locales allowed
 - **Locale format**: Must match `^[a-z]{2}-[a-z]{2}$`
 - **Required fields**: domains, commerce.endpoint, i18n.localeCookie
 - **KV namespaces**: Only "config", "lang", or "session" allowed