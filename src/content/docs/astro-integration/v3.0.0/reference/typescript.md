---
title: "TypeScript Support"
description: "Complete TypeScript integration and type safety for the Astro Integration v3.0.0"
---

# TypeScript Support

The Astro Integration v3.0.0 has been completely rewritten in TypeScript, providing comprehensive type definitions for enhanced developer experience and compile-time safety.

## Type Imports

Import types from the main package to ensure type safety in your configuration:

```typescript
import {
  altitudeMiddleware,
  type Config,
  type TenantConfig,
  type DomainConfig,
  type I18nConfig,
  type LocaleEntry,
  type CommerceConfig,
  type KvEntry
} from "@thg-altitude/astro-integration";
```

## Configuration Types

### Main Configuration Type

```typescript
type Config = {
  domains: string[];
  commerce: CommerceConfig;
  kv: KvEntry[];
  pathBasedRouting: boolean;
  i18n?: I18nConfig;
};
```

### I18n Configuration Type

```typescript
type I18nConfig = {
  domains: Record<string, DomainConfig>;
  localeCookie: string;
};

type DomainConfig = {
  locales: Record<string, LocaleEntry>;
  pathBasedRouting: boolean;
  fallbackLocale: string;
};
```

### Locale Configuration Type

```typescript
type LocaleEntry = {
  commerce: CommerceConfig;
  kv?: KvEntry[];
  icons?: Record<string, string>;
  customPrefix?: string;  // New in v3.0.0
};
```

### Commerce Configuration Type

```typescript
type HeaderValue = {
  type: "env" | "request";
  variable: string;
};

type CommerceConfig = {
  endpoint: string;
  headers?: Record<string, string | HeaderValue>;
};
```

### KV Configuration Type

```typescript
type KvEntry = {
  key: string;
  namespace: "config" | "lang" | "session";
  local: object;
};
```

## Type-Safe Configuration Examples

### Single Tenant Configuration

```typescript
// config/site.ts
import type { Config } from "@thg-altitude/astro-integration";

const config: Config = {
  domains: ["www.example.com"],
  commerce: {
    endpoint: "https://api.example.com/graphql",
    headers: {
      'x-api-key': {
        type: "env",
        variable: "API_KEY"
      }
    }
  },
  kv: [
    {
      key: "site-config",
      namespace: "config",
      local: {}
    }
  ],
  i18n: {
    domains: {
      "www.example.com": {
        pathBasedRouting: true,
        fallbackLocale: "en-us",
        locales: {
          "en-us": {
            commerce: {
              endpoint: "https://api.example.com/en/graphql"
            }
          },
          "fr-fr": {
            customPrefix: "francais",
            commerce: {
              endpoint: "https://api.example.com/fr/graphql"
            }
          }
        }
      }
    },
    localeCookie: "locale_preference"
  }
};

export default config;
```

### Multi-Tenant Configuration

```typescript
// config/tenants.ts
import type { Config } from "@thg-altitude/astro-integration";

const siteOne: Config = {
  domains: ["www.site-one.com"],
  commerce: {
    endpoint: "https://api.site-one.com/graphql"
  },
  kv: [
    {
      key: "site-one-config",
      namespace: "config",
      local: {}
    }
  ]
};

const siteTwo: Config = {
  domains: ["www.site-two.com"],
  commerce: {
    endpoint: "https://api.site-two.com/graphql"
  },
  kv: [
    {
      key: "site-two-config",
      namespace: "config",
      local: {}
    }
  ],
  i18n: {
    domains: {
      "www.site-two.com": {
        pathBasedRouting: false,
        fallbackLocale: "de-de",
        locales: {
          "de-de": {
            commerce: {
              endpoint: "https://api.site-two.com/de/graphql"
            }
          }
        }
      }
    },
    localeCookie: "locale"
  }
};

export default [siteOne, siteTwo];
```

### Astro Configuration with TypeScript

```typescript
// astro.config.mts
import { defineConfig } from "astro/config";
import { altitudeMiddleware } from "@thg-altitude/astro-integration";
import config from "./config/site.js";

export default defineConfig({
  output: "server",
  integrations: [
    altitudeMiddleware({
      config,
      api: {
        enabled: true,
        graphql: gqlIndex,
        dirName: "[locale]"
      }
    })
  ]
});
```

## Runtime Types

### Tenant Configuration Type (Runtime)

The integration provides a `TenantConfig` type that represents the resolved configuration at runtime:

```typescript
type TenantConfig = {
  domain: string;
  locale?: string;
  commerce: CommerceConfig;
  kv: KvEntry[];
  icons?: Record<string, string>;
  pathBasedRouting: boolean;
  pathPrefix?: string;
};
```

## Type Validation Benefits

Using TypeScript with the Astro Integration provides several benefits:

### Compile-Time Validation

```typescript
// ✅ TypeScript will catch this error at compile time
const invalidConfig: Config = {
  domains: ["example.com"],
  commerce: {
    // Error: Missing required 'endpoint' property
  },
  kv: []
};

// ✅ TypeScript ensures proper locale format
const validLocale: LocaleEntry = {
  commerce: {
    endpoint: "https://api.example.com/graphql"
  },
  customPrefix: "english" // Optional, properly typed
};
```

### IDE Support

TypeScript integration provides:

- **IntelliSense**: Auto-completion for configuration properties
- **Type checking**: Real-time validation in your IDE
- **Refactoring support**: Safe renaming and code restructuring
- **Documentation**: Inline type documentation and property descriptions

### Enhanced Error Messages

```typescript
// TypeScript provides detailed error messages for configuration issues
const config: Config = {
  domains: ["example.com"],
  commerce: {
    endpoint: "https://api.example.com/graphql"
  },
  kv: [
    {
      key: "config",
      namespace: "invalid", // Error: Type '"invalid"' is not assignable to type '"config" | "lang" | "session"'
      local: {}
    }
  ]
};
```

## Migration to TypeScript

### Converting JavaScript Configurations

To migrate existing JavaScript configurations to TypeScript:

1. **Rename files**: Change `.js` extensions to `.ts`
2. **Add type imports**: Import necessary types from the package
3. **Add type annotations**: Apply types to your configuration objects
4. **Fix type errors**: Address any type mismatches revealed by TypeScript

### Example Migration

**Before (JavaScript):**

```javascript
// config/site.js
export default {
  domains: ["www.example.com"],
  commerce: {
    endpoint: "https://api.example.com/graphql"
  },
  // ... rest of configuration
};
```

**After (TypeScript):**

```typescript
// config/site.ts
import type { Config } from "@thg-altitude/astro-integration";

const config: Config = {
  domains: ["www.example.com"],
  commerce: {
    endpoint: "https://api.example.com/graphql"
  },
  // ... rest of configuration
};

export default config;
```

## Cloudflare Workers TypeScript Support

The integration includes proper TypeScript support for Cloudflare Workers environments:

```typescript
// For Cloudflare Workers projects
import type { Config } from "@thg-altitude/astro-integration";

const config: Config = {
  domains: ["worker.example.com"],
  commerce: {
    endpoint: "https://api.example.com/graphql",
    headers: {
      'cf-ray': {
        type: "request",
        variable: "cf-ray"
      }
    }
  },
  kv: [
    {
      key: "worker-config",
      namespace: "config",
      local: {} // Will use Cloudflare KV in production
    }
  ]
};

export default config;
```

The integration automatically handles Cloudflare Workers-specific TypeScript types through the `@cloudflare/workers-types` dependency.

## Best Practices

### 1. Use Strict Type Checking

Enable strict TypeScript checking in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictPropertyInitialization": true
  }
}
```

### 2. Separate Type Definitions

For complex configurations, consider separating type definitions:

```typescript
// types/config.ts
import type { Config } from "@thg-altitude/astro-integration";

export interface CustomConfig extends Config {
  customProperty?: string;
  environment: "development" | "staging" | "production";
}

// config/site.ts
import type { CustomConfig } from "../types/config";

const config: CustomConfig = {
  // ... configuration with custom properties
  environment: "production"
};
```

### 3. Validate at Build Time

Use TypeScript's type system to catch configuration errors early:

```typescript
// utils/validate-config.ts
import type { Config } from "@thg-altitude/astro-integration";

export function validateConfig(config: Config): void {
  // TypeScript ensures this function receives a properly typed config
  if (!config.domains.length) {
    throw new Error("At least one domain must be configured");
  }

  // Additional runtime validation if needed
}
```

## Troubleshooting TypeScript Issues

### Common Type Errors

**Error**: Property 'customPrefix' does not exist on type 'LocaleEntry'

**Solution**: Ensure you're using v3.0.0 or later and importing the latest types:

```typescript
import type { LocaleEntry } from "@thg-altitude/astro-integration";
```

**Error**: Type 'string' is not assignable to type '"config" | "lang" | "session"'

**Solution**: Use only the allowed KV namespace values:

```typescript
const kvEntry: KvEntry = {
  key: "my-key",
  namespace: "config", // Must be one of: config, lang, session
  local: {}
};
```

**Error**: Missing required properties in configuration

**Solution**: Ensure all required properties are present:

```typescript
const config: Config = {
  domains: ["example.com"], // Required
  commerce: {
    endpoint: "https://api.example.com/graphql" // Required
  },
  kv: [], // Required (can be empty array)
  // i18n is optional
};
```

For more advanced TypeScript usage and troubleshooting, consult the [TypeScript documentation](https://www.typescriptlang.org/docs/) and the [Astro TypeScript guide](https://docs.astro.build/en/guides/typescript/).