---
title: Commerce API
---

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

