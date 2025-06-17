---
title: "Edge KV"
description: Configuring Cloudflare edge kv.
---

Altitude KV Stores can be used as a store for tenant configuration, which can be read at request time. Edge Key-Value stores (KVs) enable fast, scalable, distributed data storage at network edges, reducing latency for global applications.

To configure your Altitude KV store with Astro create a [middleware](https://docs.astro.build/en/guides/middleware/). Utilising the `getRuntime` provided in `@astrojs/cloudflare/runtime` method you can perform a lookup for KV.

```javascript
// middleware/index.js
import { getRuntime } from "@astrojs/cloudflare/runtime";

export async function onRequest(context, next) {
  const { env } = getRuntime(request);

  const tenantConfig = await env.ALTITUDE_KV_STORE.get("<kv-name>", {
    type: "json",
  });

  context.locals.tenantConfig = tenantConfig;

  return next();
}
```

Ensure that you replace `<kv-name>` with the name of your KV listed in Altitude Platform. More details on creating a KV store using Altitude [here](https://docs.thgaltitude.com/edge/kv-store/).

The following line will adds the KV store to the Astro Context object to make it available to read in any page.

```js
context.locals.tenantConfig = tenantConfig;
```

Example use:

```js
//page/index.astro
---
const { tenantConfig } = Astro.locals
---

{ tenantConfig.exampleFeatureFlag && <h1>Feature Enabled</h1> }
```

:::caution
The runtime used for reading KV will only be accessible after deploying the website. Ensure you have a local JSON equivelant for local development in place of the runtime.
:::

## Framework Guides

- [Astro: Edge KV](/frameworks/astro/#edge-kvs)

## Astro Integration

Users of the integration will no longer have to bind KV's within their own middleware at runtime. The integration will handle the binding of KVs inside of entry middleware and attach the value(s) to the [altitude global context](/packages/astro-integration/#altitude-global-context). More information about the KV schema can be found [here](/packages/astro-integration/#kv).

Multiple KV's can be provided for an application/site, the integration will iterate over each entry and attach the value to the corresponding namespace. Applications can rebind KVs to a preferred key if required within their middleware as shown below.

```js
//middleware/index.js
context.locals.tenantConfig = context.locals.altitude.runtime.kv.<namespace>
```

For environments that are not running within a Cloudflare worker, a local copy of the KV should be supplied and will be used attaching it to the same `namespace` provided.
