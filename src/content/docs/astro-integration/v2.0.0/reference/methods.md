---
title: Methods
---

# Methods

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

