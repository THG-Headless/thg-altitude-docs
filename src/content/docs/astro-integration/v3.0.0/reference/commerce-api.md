---
title: Commerce API
---

## Altitude Commerce Endpoint

Enabling the commerce endpoint creates a new endpoint `/api/commerce` that allows client side graphql calls to be proxied through the server to your specified endpoint in your build configs `commerce.endpoint`. The option to enable this is done at the point of invoking the altitudeMiddleware.

The key benefit of this approach is reducing the size of client-size imports, through no longer needing to import the query in the client-side script.

The Astro route injection uses pattern matching to direct requests to the endpoint, `/api/commerce/`. It then looks up the query value in the GraphQL object map, using the operationName search parameter value.


### Configuring the endpoint

The endpoint in enabled by an argument passed to the altitudeMiddleware function. This object can have three keys: `enabled`, `graphql` and additional `dirName`. The `enabled` key determines if the route to the endpoint should exist, and `graphql` requires an object containing Key/Value pairs of the query name, and the raw query as the value. 

In v3 of the Astro Integration you can now pass a `dirName` property, which can be either a static or dynamic value (e.g. `[locale]`). This determines the path where the `/api/commerce` endpoint is injected. For example, if `dirName` is set, the route will be injected at `/${dirName}/api/commerce`; otherwise, it defaults to `/api/commerce`. This is handled by the route injection logic:

```js
injectRoute({
  pattern: api.dirName ? "/" + api.dirName + "/api/commerce" : "/api/commerce",
  entrypoint: "@thg-altitude/astro-integration/api/commerce.js",
});
```

If you use a dynamic `dirName` (such as `[locale]`), make sure your client requests are prefixed with the correct dynamic segment, e.g. `/${Astro.locals.locale}/api/commerce?operation=ExampleOperation`.

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
      {"enabled": true, "graphql" : graphqlQueriesObj, "dirName": "[locale]"}
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
const url = /api/commerce?operation=ExampleOperation // see note below
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
For the url, if a `dirName` has been passed this needs to match the url. If the `dirName` was a dynamic path like locale the url needs to be prefixed with this dynamically e.g. `/${Astro.locals.locale}/api/commerce?operation=ExampleOperation`
