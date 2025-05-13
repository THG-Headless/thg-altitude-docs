---
title: Enabling Multitenancy
order: 1
---

Multi-tenancy is a pattern in which multiple brands may be served from the same codebase. It can be used to quickly onboard a new brand, or ‘tenant’, via a new configuration, as a fast route to scale.


## Prerequisites: 

- astro-integration running in single tenancy mode. See [guide](../guides/getting-started)
  
## Step 1: convert buildConfig to an array

By default, astro-integration runs in single tenanted mode. This means the first argument passed to `altitudeMiddleware` is an object which matches this [schema](https://github.com/THG-AltitudeSiteBuilds/astro-integration/blob/main/config_schemas/schemaV1.json). To enable multitenancy, all you need to do is pass an array of configs instead of a single config: 

In multitenancy mode, astro-integration is passed an array of tenantConfigs:  

```jsx
// astro.config.mjs
import tenantArray from './config/index.js';
export default defineConfig({
	integrations: [
	altitudeMiddleware(
		tenantArray
		// ...options
	)]
})
```

```jsx
//config/index.js

import tenant1 from './tenant1';
import tenant2 from './tenant2';
import altitudedemo from './altitudedemo';

export default [tenant1, tenant2, altitudedemo];
```

Multitenancy means that at request time, astro-integration will read the x-altitude-instance header (in dev mode) or the x-forwarded-host header (in production) to decide which tenantConfig to read. 

