---
title: Enabling Multitenancy
order: 1
---

see the [Multitenancy reference](/docs/astro-integration/v2.0.0/reference/multi-tenancy) for more background.


## Prerequisites: 

- astro-integration set up in single tenancy mode. See [guide](../guides/getting-started)
  
## Step 1: convert buildConfig to an array

By default, astro-integration runs in single tenanted mode. This means the first argument passed to `altitudeMiddleware` is an object matching the [build config schema](https://github.com/THG-AltitudeSiteBuilds/astro-integration/blob/main/config_schemas/schemaV1.json). Enable multitenancy by passing an array instead:

```jsx
// astro.config.mjs
import [tenant1, tenant2] from './config/index.js';
export default defineConfig({
	integrations: [
	altitudeMiddleware(
		tenantsArray
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

