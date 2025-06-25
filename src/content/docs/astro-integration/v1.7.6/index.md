---
title: Astro Integration
description: Astro Integration configuration reference guide.
---

Middleware and utilities to make developing Altitude websites with Astro even better.

- 🌎 **Internationalisation:** Support for internationalisation.
- 🔥 **Performance Patterns:** Edge performance optimisations out of the box.

Available Soon:

- 🔌 **Easy access to APIs:** Easier access our commerce APIs from your codebase using ready made helpers and proxies.

---

# Installation

```sh
npm i @thg-altitude/astro-integration
```


# Configuration

The below reference covers all of the different configuration options for the Astro Integration providing further flexibility for your application.

```js
//config/site.js
export default {
  // configuration options here...
}
```

## Domains options

### domains.default

**Type**: `String` \
**Required: True**

The default domain of a site excluding protocol. This value is used in conjuction with i18n, see [internationalisation](/docs/astro-integration/guides/i18n) for further information on this value.

### domains.variants

**Type:** `Array[]` \
**Required: True**

Contains all additional domains associated with a site inclusive of the default. This is the value the integration uses to map to this config. The header `x-altitude-instance` can be used to switch between different configs for local development, see the [multi tenancy](/docs/astro-integration/guides/multitenancy) guide for further information on how this works.

```javascript
domains: {
  default: "www.example.com",
  variants: ["wwww.example.com", "uat.www.example.com"]
}
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
**Required: True**

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

## Custom

Custom keys can also be supplied to the build config, such as environment variables. These values will not affect the configuration of the integration but will be provided on the [altitude global context](#altitude-global-context) at runtime. This is useful for multi tenancy when values need to change based on each tenants config. Further information can be found in the [multi tenancy guide](/docs/astro-integration/guides/multitenancy)

## Invoking the integration

The build config and `altitudeMiddleware` function should be imported and passed as an argument to the integration as shown below.

```js
//astro.config.js
import { altitudeMiddleware } from '@thg-altitude/astro-integration'
import buildConfig from './config/site'

export default defineConfig({
  integrations: [
    altitudeMiddleware(
      buildConfig
    ),
  ],
  // ...other Astro config setup
})
```

## Methods

The integration provides some useful common functions and patterns available to be used in applications out the box. Methods are attached to the `altitude` namespace and provides storefront owners a layer of abstraction away from verbose core commerce functionality and performance uplifts.

### Quick method reference

```javascript
altitude: {
  i18n: (func, ...args) => String;
  commerce: {
    api: async (
      operationFields: { operation: String!, variables: Object! },
      headers: Object!,
      options: { apqEnabled: Boolean }
    ) => Object;
  };
  blog: {
    api: async (
      endpoint: String!,
      operationFields: { operation: String!, variables: Object, cacheKey: Request! || String!, wafBypass: String!, clientSecret: String!, clientId: String!},
      options: { headers: Object }
    ) => Response;
  };
  cache: {
    get: async(cacheKey: String! || Request!, operationName: String) => Response || null;
    set: async(cacheKey: String! || Request!, response: Response!, options: { expiry: Number }) => void;
  }
}
```

### i18n

The i18n method aids with localising copy on site. The function provides flexibility to resolve langauge strings to their values or the object structure to support non-technical stakeholders understand what keys to update.

#### valueFunc

**Type:** `function() => String` \
**Required: True**

An anonymous function that when invoked returns the string that is intended to be evaluated.

#### args

**Type:** `String` \
**Required: False**

Optional argument that will be used to dynamically replace string placeholders in the value of the language string passed, or replace dynamic keys using bracket notation.

**Example Use**

```javascript
---
const { altitude: { i18n } } = Astro.locals
const lang = Astro.locals.altitude.rutime.kv.lang

const productTitle = "Vivienne Westwood Logo Ribbed Wool Beanie"
const contentKey = "details"
---
<p>{i18n(() => lang.product.promotionalOffer, productTitle)}</p> // Buy one Vivienne Westwood Logo Ribbed Wool Beanie get one free
<p>{i18n(() => lang.product[contentKey], contentKey)}</p> //lang.product.details will be the string that is now evaluated
```

**Exposing Keys**

The keys used for copy on site can be exposed using headers. This will allow the relevant teams to identify the entry on a site and update its value in Content UI on the fly. To expose the keys an additional request header should be added `Properties-Preview: SHOW-KEYS`

### Commerce API

The integration provides out the box commerce api fetching on the server exposing the method as `altitude.commerce.api`. The method enables applications to configure the operation, variables and headers to retrieve commerce data for a given site or tenant. The endpoint the method will use for these calls will be the `commerce.endpoint` supplied in an application or tenants [build config](#configuration).

#### operationFields.operation

**Type:** `String` \
**Required: True**

The operation to be passed to the body as the query. Any parsing of the operation should be done at application level ahead of time.

#### operationFields.variables

**Type:** `Object` \
**Required: True**

The variables to be passed as part of the api call. If no variables are required an empty object should be passed.

#### headers

**Type:** `Object` \
**Required: True**

All required headers to be passed as part of the commerce fetch. No headers are defaulted so all should be provided.

#### options.apqEnabled

**Type:** `Boolean` \
**Required: False** \
**Default: False**

This enables Horizons [Automatic Persisted Queries](https://thehutgroup.github.io/Horizon-Public-Docs/#automated-persisted-queries) feature.

#### Return value

From version 1.7.0 the api method returns the full response object. 

Version <=1.6.X
The commerce api method will return an Object containing three values: `body`, `duration`, `status`.

- `body`: The response from the api call.
- `duration`: The duration of the api call in ms.
- `status`: The status code of the response.

**Example use**

```javascript
//c/index.astro

const body = await locals.query({
  operation: Schema,
  variables: {
    handle: pathName,
  },
  customHeaders: {
    foo: 'bar',
  },
})
```

```javascript
//middleware/index.js
import { print } from 'graphql'

query: async (args) => {
  const { operation, variables = {}, customHeaders = {} } = args

  let query
  if (typeof operation == 'string') {
    query = operation
  } else {
    query = print(operation)
  }

  try {
    const { body, duration, status } = await locals.altitude.commerce.api(
      { operation: query, variables },
      {
        ...customHeaders,
        'Content-Type': 'application/json',
        'User-Agent': request.headers.get('User-Agent'),
        'X-Altitude-Instance': locals.tenantInstance, // application specific header
      },
      {
        apqEnabled: false,
      }
    )
    return body
  } catch (e) {
    console.log(e)
  }
}
```

### Cache API

The cache api can be used to enhance the performance of sites by reducing the number of network calls being made as it reduces load times and avoids repeated API calls, which is especially beneficial for large components which do not change often such as the header and footer. Instead, the response of these calls can be set in cache so future requests can attempt to retrieve the response from cache instead of calling the origin.

#### Get

##### cacheKey

**Type:** `String || Request` \
**Required: True**

The cache key to be used to get a response from cache. This value must be unique when in a multi tenancy environment and cache keys can be easily created using the helper function `altitude.createCacheKey(key: String)`

##### operationName

**Type:** `String` \
**Required: False** \
**Default:** `""`

The get cache api function logs out the operation name that has receieved a cache hit for observability.

**Example Use**

```javascript
let response, cacheKey
if (!import.meta.env.DEV) {
  cacheKey = altitude.createCacheKey(`${horizonEndpoint}/${host}/headerfooter`)
  response = await altitude.cache.get(cacheKey, 'nav')
}
```

#### Set

##### cacheKey

**Type:** `String || Request` \
**Required: True**

The cache key to be used to set a response in cache for request lookups. This value must be unique when in a multi tenancy environment and cache keys can be easily created using the helper function `altitude.createCacheKey(key: String)`

##### response

**Type:** `Response` \
**Required: True**

The response object to be put into cache to be retrieved for future cache lookups.

##### options.expiry

**Type:** `Number` \
**Required: False** \
**Default:** `600`

Optional value for how long this response should stay in the cache for in seconds. Defaulted to 600 seconds (10 minutes)

**Example Use**

```javascript
if (!response) {
  try {
    response = await Astro.locals.utils.query({
      operation: HeaderFooter,
    })

    if (response.statusText !== 'OK') throw new Error('Error Fetching nav')

    if (!import.meta.env.DEV) {
      await altitude.cache.set(cacheKey, response.clone(), { expiry: 600 })
    }
  } catch (e) {
    console.log(e.message)
  }
}
```

Performance can be improved by using the cache as it reduces load times and avoids repeated API calls, which is especially beneficial for large components which do not change often such as the header and footer of pages. For example, by using the functions described above to first check the cache, and if its empty, to populate the cache once the data has been fetched:

### Blog API

The blog api function is used to fetch blog content from a specified `endpoint`. The fetch utilises the Cache API to get and set auth tokens which are sent as a header to reduce the amount of calls to auth service.

#### endpoint

**Type:** `String` \
**Required: True**

The endpoint the integration should use to retrieve blog data.

#### operationFields.operation

**Type:** `String` \
**Required: True**

The operation to be passed to the body as the query. Any parsing of the operation should be done at application level ahead of time.

#### operationFields.variables

**Type:** `Object` \
**Required: False**

The variables to be passed as part of the api call.

#### operationFields.cacheKey

**Type:** `String || Request` \
**Required: True**

The cache key to be used to get and set auth tokens from cache. This value must be unique when in a multi tenancy environment and cache keys can be easily created using the helper function `altitude.createCacheKey(key: String)`

#### operationFields.wafBypass

**Type:** `String` \
**Required: True**

Application specific WAF bypass key, used for auth.

#### operationFields.clientSecret

**Type:** `String` \
**Required: True**

Application specific client secret, used for auth.

#### operationFields.clientId

**Type:** `String` \
**Required: True**

Tenant or Application specific ID, used for auth.

#### options.headers

**Type:** `Object` \
**Required: False**

Any additional headers to be sent as part of the request. `Content-Type: application/json` and `Authorization` are currently defaulted.

**Example Use**

```javascript
const blogEndpoint =
  Astro.locals?.tenantConfig?.application?.features?.tesseract?.endpoint

let resp
try {
  resp = await altitude.blog.api(blogEndpoint, {
    operation: TesseractHome,
    cacheKey: altitude.createCacheKey(
      `${Astro.locals.tenantConfig.application.horizonEndpoint}/${Astro.locals.host}/blog`
    ),
    wafBypass: import.meta.env.WAF_BYPASS,
    clientSecret: import.meta.env.AUTH_CLIENT_SECRET,
    clientId:import.meta.env.BLOG_CLIENT_ID
  })
} catch (e) {
  console.log(e)
}
```

## Altitude Commerce Endpoint

Enabling the commerce endpoint creates a new endpoint `/api/commerce` that allows client side graphql calls to be proxied through the server to your specified endpoint in your build configs `commerce.endpoint`. The option to enable this is done at the point of invoking the altitudeMiddleware.

The key benefit of this approach is reducing the size of client-size imports, through no longer needing to import the query in the client-side script.

The Astro route injection uses pattern matching to direct requests to the endpoint, `/api/commerce/`. It then looks up the query value in the GraphQL object map, using the operationName search parameter value.

### Configuring the endpoint

Firstly, there is a requirement to add `api` to the tenant build config `exclusionList` to avoid localisation rewrites, which would result in the route 404ing. More information on this can be found in the [documentation](/docs/astro-integration/guides/i18n/#i18nexclusionlist)

```js
// tenant config obj
{
exclusionList: ['api']
}
```

The endpoint in enabled by an argument passed to the altitudeMiddleware function. This object needs two keys: `enabled` and `graphql`. The `enabled` key determines if the route to the endpoint should exist, and `graphql` requires an object containing Key/Value pairs of the query name, and the raw query as the value.

This object does impact the build size, so it is important to only pass in queries that will be used client-side. If the \_worker.js file size becomes too large, the deployment will fail.

```js
//astro.config.js
import { altitudeMiddleware } from '@thg-altitude/astro-integration'
import buildConfig from './config/site'

const graphqlQueriesObj = // your chosen import method

export default defineConfig({
  integrations: [
    altitudeMiddleware(
      buildConfig,
      {},
      {"enabled": true, "graphql" : graphqlQueriesObj}
    ),
  ],
  // ...other Astro config setup
})
```

### Sending a request to the endpoint

Currently this endpoint uses 4 values in the body:

- variables (optional, used for providing data in GraphQL mutations)
- horizonApq (optional, defaults to false)
- application (Multi-Tenanted Account only - 'account')
- opaqueCookieDomain

Application currently only applies to the use of the Multi-Tenanted Account option, with a value of 'account'.opaqueCookieDomain allows access the correct domains when setting response headers.

Variables handles any input needed by the Horizon query. The horizonApq setting allows enabling [persisted queries](#commerce-api)

```
const variables {...}
const url = /api/commerce?operation=ExampleOperation
const data = await fetch(url, {
method: 'POST',
headers: {...},
body: JSON.stringify({
      variables: variables,
      horizonApq: false,
      application: 'storefront',
      opaqueCookieDomain
})
})
```

## Altitude Global Context

The integration will provide additional information about the config resolvement at runtime and attach it to `context.locals.altitude`. Please see all available attachments below.

### altitude.runtime.config

The build config object the integration has resolved to. For applications using the integration's [localisation](/docs/astro-integration/guides/i18n) solution this will be the locale specific config.

### altitude.runtime.kv.\<namespace>

The value of [KV](#kv) retrieved using the key provided. This will be attached using the namespace value provided in the KV for the key retrieved.

<h2 id="internationalisation">Internationalisation</h2>

These keys will be provided on the altitude namespace for applications that are using the built in i18n solution. Further information can be found [here](/docs/astro-integration/guides/i18n)

### altitude.locale

The locale the integration has resolved to from the request.

- `en-gb`

### altitude.availableLocales

Array containing all the locales a sites config supports.

- `['en-gb', 'fr-fr']`

### altitude.localeDomains

An object containing the ISO 639-1 code and domain path it corresponds to.

- `{'en-gb': 'https://www.example.com', 'fr-fr': 'https://www.example.fr'}`

### altitude.preferredLocale

ISO 639-1 code that resolves using the highest weighted valid `Accept-Language` header or existing cookie specified in the i18n section of the build config. If none are provided or invalid, `null` will be returned.

## Resources

- [NPM Package](https://www.npmjs.com/package/@thg-altitude/astro-integration)
