---
title: "Config"
---

# Configuration

The below reference covers all of the different configuration options for the Astro Integration v3.0.0, providing enhanced flexibility for your application.

```js
//config/site.js
export default {
  // configuration options here...
}
```

### Domains

**Type:** `Array[]` \
**Required: True**


Contains all domains associated with a site, excluding protocol. If i18n is enabled, this will contain all the domains for which you want localised copy. Make sure to include the same domain in `i18n`. If i18n is not enabled, this array will contain a single item which is the GTLD for your site, which astro integration will read for the purposes of tenant resolution. If running in single-tenancy mode, this key won't be read by the integration. 

```javascript
domains: ["wwww.example.com", "www.example.fr"]
```

## Commerce

### commerce.endpoint

**Type:** `String` \
**Required: False**

The commerce api endpoint the specified site uses. This value will be used with the [commerce api](#commerce-api) method and must be provided if your application intends to use this method.

```javascript
commerce: {
  endpoint: 'https://horizon-api.www.example.com/graphql'
}
```

### commerce.headers

**Type:** `Object` \
**Required: False**

This block allows headers to be added to a request to the [commerce endpoint](#altitude-commerce-endpoint) on the server side. The name of the header is the key, and the value an object with a type key of "env"|"request" to specify if the value should be taken from environment variables, or from another request header. This is useful for sensitive headers that should not be accessible in the browser, and retaining the value of a header that may get overwritten or masked as it passes through proxies, e.g. client_ip.

```javascript
commerce: {
  endpoint: "https://horizon-api.www.example.com/graphql";,
  headers: {
    'x-example-secret-header': {
      "type": "env",
      "variable": "SECRET_HEADER_NAME"
    }
  },
      'x-example-new-header': {
      "type": "request",
      "variable": "old-header-name"
    }
}

```

This would equate to:
```
x-example-secret-header: import.meta.env.SECRET_HEADER_NAME
x-example-new-header : request.headers.get('old-header-name')
```

## KV

**Type:** `Array[]` \
**Required: False**

An array of KV options can be supplied. Below are the options that should be supplied per entry. See the [Edge KV](/docs/astro-integration/guides/edge-kv) guide for more details.

This field is required even if all locale specific configs have their own KV entries. So use this section either for a sensible set of default values or leave it as an empty array if you are sure that all locales have correct KV configs.

```javascript
kv: [
  {
    // kv option entry one goes here
  },
  {
    // kv option entry two goes here
  },
]
```

### \<Object>.key

**Type:** `String` \
**Required: True**

The key to be retrieved in your Cloudflare KV store.

### \<Object>.namespace

**Type:** `String` \
**Required: True**

This value will be used to attach the contents of the KV key to a specified namespace on the altitude global context e.g. `altitude.runtime.kv.<namespace>`. More details on the altitude namespace can be found [here](#altitude-global-context)

### \<Object>.local

**Type:** `Any` \
**Required: True**

Used for local development. This will be the value that is resolved when the application is not ran inside of a worker. The value can imported in or defined directly within this key.

```javascript
import fooBar from '../local/config'

kv: [
  {
    key: 'standalone',
    namespace: 'config',
    local: {
      // local file import variable could also be used
      foo: 'bar',
    },
  },
]
```

## i18n

Users of the integration have the ability to opt in to i18n to unlock localisation on their application. The integration is responsible for mapping to locale specific configs and validating a locale is supported when a request is made. The i18n configuration enables localisation and allows you to define domains and their associated locales, each with their own settings.

to opt-in, see the [guide](/docs/astro-integration/v3.0.0/guides/enable-i18n) on enabling i18n.

### Example
```js
i18n: {
  domains: {
    '<domain>': {
      locales: {
        '<locale-code>': {
          commerce: { endpoint: '<graphql-endpoint>' },
          kv: [ /* KV config objects */ ],
          icons: { flag: /* icon object */ }
        },
        // ...other locales
      },
      pathBasedRouting: true, // Optional: enables path-based locale routing
      fallbackLocale: '<locale-code>' // Fallback locale for this domain
    },
    // ...other domains
  },
  localeCookie: '<cookie-name>' // Optional: name of the cookie used to persist locale
}
```

### i18n.domains

**Type**: `Object` \
 **Required: True**

Defines all domains for which you want to provide localised content. Each domain key maps to its own locale configuration. The domain must be specified in the [domains](#domains) key at the root of the config to ensure the integration can map to the sites config.

```javascript
i18n: {
  domains: {
    'domain1': {...},
    'domain2': {...}
  }
}
```

### i18n.domains.\<domain>.locales

**Type**: `Object` \
**Required: True**

Lists all supported locales for the domain. Each locale code (e.g. 'en-gb') maps to its own configuration object. If a domain is doing path based routing it can have more than one locale associated with it (in this case the `pathBasedRouting` flag must be set to true).


```javascript
i18n: {
  domains: {
    '<domain>': {
      locales: {
        'en-gb': {...}
        'en-us': {...}
      }
    }
  }
}
```

### i18n.domains.\<domain>.pathBasedRouting

**Type**: `Boolean` \
**Required: True**

Enables path-based locale routing for this domain. When `true`, multiple locales can be served from the same domain using URL path prefixes (e.g., `/en-gb/`, `/fr-fr/`). When `false`, the domain serves only one locale without path prefixes.

**Schema Validation**:
- When `pathBasedRouting: false`, only one locale is allowed per domain
- When `pathBasedRouting: true`, unlimited locales are allowed per domain

**Examples**:

```javascript
// Path-based routing (multiple locales)
"www.example.com": {
  pathBasedRouting: true,
  fallbackLocale: "en-us",
  locales: {
    "en-us": {...},
    "fr-fr": {...},
    "de-de": {...}
  }
}

// Domain-based routing (single locale)
"fr.example.com": {
  pathBasedRouting: false,
  fallbackLocale: "fr-fr",
  locales: {
    "fr-fr": {...}
  }
}
```

### i18n.domains.\<domain>.locales.\<locale>.customPrefix

**Type**: `String` \
**Required: False**

Allows you to define a custom URL path prefix for a locale instead of using the standard locale code. This is particularly useful for creating user-friendly URLs or branding purposes.

**Examples:**

```javascript
i18n: {
  domains: {
    'www.example.com': {
      pathBasedRouting: true,
      fallbackLocale: 'en-us',
      locales: {
        'en-us': {
          // No customPrefix - uses locale as prefix
          commerce: {...}
        },
        'fr-fr': {
          customPrefix: 'francais',
          commerce: {...}
        },
        'de-de': {
          customPrefix: 'deutsch',
          commerce: {...}
        },
        'es-es': {
          customPrefix: 'espanol',
          commerce: {...}
        }
      }
    }
  }
}
```

This configuration creates URL patterns like:
- `www.example.com/en-us/` (English - fallback locale)
- `www.example.com/francais/` (French)
- `www.example.com/deutsch/` (German)
- `www.example.com/espanol/` (Spanish)

Note: ensure an proxys you site uses is tolerant to different path prefix structures.

### i18n.domains.\<domain>.locales.\<locale>.kv

Any locale specific KV keys to be retrieved from the cloudflare namespace. See config setup [here](#kv).

If there are no locale specific KV settings then favour putting them in the top-level kv object instead.

### i18n.domains.\<domain>.locales.\<locale>.commerce.endpoint

Any locale specific api endpoint to be used. See config setup [here](/packages/astro-integration/#commerce)

### i18n.domains.\<domain>.fallbackLocale

**Type**: `String` \
**Required: True**
**Pattern**: `^[a-z]{2}-[a-z]{2}$`

The default locale to use for this domain if no valid locale is detected. Must be one of the locales defined in the `locales` object for this domain.


### i18n.localeCookie

**Type**: `String` \
**Required: True**

The name of the cookie used to persist the user's locale preference across sessions. This cookie stores the actual locale code (e.g., `"en-gb"`), not custom prefixes.


#### Locale Inheritance
Locale configs are treated in a special way in the Astro integration and will inherit from the main config file e.g. this config
```javascript
{
  domains: ['www.acme.com'],
  commerce: {
    endpoint: 'https://www.acme.com'
  },
  i18n: {
    domains: {
      'www.acme.com': {
        locales: {
          'en-gb': {
            commerce: {
              endpoint: 'https://www.acme.com'
            },
            kv: [
              {
                key: 'acme',
                namespace: 'config'
              }
            ]
          }
        },
        pathBasedRouting: false,
        fallbackLocale: 'en-gb'
      }
    },
    localeCookie: 'locale_V6'
  }
}
```
Will be treated like the below config by the integration.
```javascript
{
  domains: ['www.acme.com'],
  commerce: {
    endpoint: 'https://www.acme.com'
  },
  i18n: {
    locales: [
      {
        prefix: 'en-gb',
        domain: 'www.acme.com',
        kv: [
          {
            key: 'acme',
            namespace: 'config'
          }
        ],
        domains: ['www.acme.com'],
        commerce: {
          endpoint: 'https://www.acme.com'
        }
      }
    ],
    fallbackLocale: 'en-gb'
  }
}
```
Notice how the `domains` and `commerce` objects from the top level config are copied into the locale specific config. If a key is present in the locale specific it will **always** take precedence over the same key in the main config and thus act as an override. This inheritance and override behaviour is then applied to nested fields in the main and locale configs. However it does **not** apply to array elements, arrays are inherited or overidden in their entirety. If you want to explicitly opt out of inheriting a particular key from the main config then set that key or its parent as `null` in the locale config.


## Custom

Custom keys can also be supplied to the build config, such as environment variables. These values will not affect the configuration of the integration but will be provided on the [altitude global context](#altitude-global-context) at runtime. This is useful for multi tenancy when values need to change based on each tenants config. Further information can be found in the [multi tenancy guide](/docs/astro-integration/v3.0.0/reference/multi-tenancy)


# Reference

- **JSON Schema v3**: [Full schema definition](https://github.com/THG-AltitudeSiteBuilds/astro-integration/blob/main/config_schemas/schemaV3.json)
- **TypeScript Types**: [Type definitions](https://github.com/THG-AltitudeSiteBuilds/astro-integration/blob/main/types/index.ts)
- **Migration Guide**: [Upgrading from v2](../guides/migration-v3)
- **Path-based Routing**: [Detailed routing guide](./path-based-routing) 