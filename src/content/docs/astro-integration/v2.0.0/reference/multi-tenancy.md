---
title: "Multi-Tenancy"
description: Serve multiple brands from a single Altitude site.
---

Multi-tenancy is a pattern in which multiple brands may be served from the same codebase. It can be used to quickly onboard a new brand, or 'tenant', via a new configuration, as a fast route to scale.

To enable multi-tenancy for your site, see the [guide](/docs/astro-integration/v2.0.0/guides/getting-started/#multitenancy)

---
# Multi-tenancy

## Custom Domains

Altitude allows multiple [custom domains](https://docs.thgaltitude.com/edge/domains/) to be attached to a single site, giving the feel of a separately hosted site per-tenant.

For example `www.allsole.com` and `www.biossance.com` point to the same Altitude deployment.

## Tenant Configuration

There are certain properties which will want to vary between tenants to give then a distinct feel, such as:

- Styling
- Feature flags
- API urls, reCaptcha keys etc.

A solution to achieving this is for your application to read these properties from a configuration object which can vary per-tenant.

## Key-Value Stores

Altitude KV Stores can be used as a store for tenant configuration, which can be read at request time.

## Determining the Tenant

To select the correct tenant config, Altitude uses the request's domain or a special header:

- **Production:** The `X-Forwarded-Host` header (set by Fastly) maps the domain to the tenant config.
- **Development/local:** The `x-altitude-instance` header specifies the tenant. You can set this header using a tool like [ModHeader](https://modheader.com/) for easy switching.

## Multi-tenancy Stylesheets

When sharing a codebase with multiple tenants, being able to differentiate branding colours and typography is essential. However it's equally essential to ensure that the codebase is [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) and you're not building stylesheets when not necessary.

### Tailwind

By utilising [Tailwind Themes](https://tailwindcss.com/docs/theme) alongside a combination of data attributes and CSS variables you can achieve a pattern of having one shared UI but with tenant specific CSS.

Example:

```css
//main.css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html[data-theme="default"] {
    --color-esther: 34, 39, 46;
    --color-maximus: 45, 51, 59;
    --color-linx: 55, 62, 71;
  }

  html[data-theme="neon"] {
    --color-esther: 20, 61, 42;
    --color-maximus: 13, 82, 66;
    --color-linx: 20, 82, 11;
  }
}
```

Within your HTML you then switch to the relevant theme:

```html
<html data-theme="neon"></html>
```

##### Alternative: DaisyUI + Tailwind

DaisyUI offers a multi-theme configuration out of the box. This can help achieve the capability of creating multiple themes which can be used for creating variety across tenants.

[DaisyUI Themes](https://daisyui.com/docs/themes/)
[DaisyUI components](https://daisyui.com/components/)

:::note
Tailwind is a build time dependency and is unaware at the build stage what tenant is active. Therefore you need to consider that the impact of not optimising your theme file(s) efficiently so that minimal CSS changes are required will result in all tenants CSS weight increasing.

Using this alongside a speific tenant CSS file that is loaded at runtime (for minor layout changes / adjustments) will help the CSS scale to a larger volume of sites without concerns of shared performance regressions.
:::

### Astro Integration

Applications using the Astro Integration can leverage built in mapping to resolve configs to the correct tenant. This is determined at runtime and domains (x-altitude-instance for local development or the domain in prod) will be mapped by matching a value from within a tenants [`domains.variants`](/packages/astro-integration/#domains-options) array.

Applications that have a multi tenancy model, will supply an array of configs to the integration function [`altitudeMiddleware`](/packages/astro-integration/#invoke-the-integration). It is recommended that each tenants config is in their own respective file and exported from a single file to keep the configs tidy, sectioned and consistent.

```javascript
// /config/index.js
import siteOne from "./siteOne";
import siteTwo from "./siteTwo";
import siteThree from "./siteThree";

export default [siteOne, siteTwo, siteThree];
```

#### Multi Tenancy Config

As well as defining tenant specific endpoints and KV keys, the config file allows application owners to extend any site specific values and expose these at runtime. One benefit that the integration allows is the ability to unlock tenant specific environment variables. Tenant specific secrets can be supplied to the build config. The integration exports an `env` function which can be imported and invoked inside of individual build configs. The `env` function takes in the **reference** of the environment variable as an argument not the value.

```js
//config/siteOne.js
import { env } from '@thg-altitude/astro-integration'
export default {
  domains: {
    default: "www.example.com",
    variants: ["www.example.com"],
  },
  ... // exsiting site setup
  blog: {
    secret: env('EXAMPLE_SITE_BLOG_SECRET')
  }
};
```

The value of this environment variable can then be accessed by using the [altitude global context](/packages/astro-integration/#altitude-global-context) `altitude.runtime.config`.

```javascript
---
const { altitude, runtime } = Astro.locals

// runtime(Production) vs vite development server(Local development)
const blogSecret = runtime ? runtime.env[altitude.runtime.config.blog.secret] : import.meta.env[altitude.runtime.config.blog.secret]
---
```

### Tenant Switching

When developing in a multi tenanted application, it may be desired that you are able to switch between tenants on the fly. For local development and DEV/UAT cloudflare environments this is easily achieved by adding a custom HTTP header to the request. The header to be used must be `x-altitude-instance` and the value will determine which tenant to switch to. This value should exist in that tenants config file, listed under the [`domains.variants`](/packages/astro-integration/#domains-options) array. Tenant switching will not be enabled on live domains.

Applications that are using [localised domains](/guides/i18n/#localised-domains) will use the domain associated to that locale.
