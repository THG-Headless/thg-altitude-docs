---
title: Migrating from v2.3.0 to v2.4.0
description: Learn how to migrate your Altitude Platform projects from v2.3.0 to v2.4.0
---

# Migrating from v2.3.0 to v2.4.0

This guide will help you migrate your existing Altitude Platform projects from v2.3.0 to v2.4.0. Version 2.4.0 introduces health checks for edge functions, enabling automatic failover to Altitude Anywhere when your workers become unhealthy.

## What's New in v2.4.0

### Health Checks

You can now configure health checks for your function routes to monitor the health of your Cloudflare Workers. When a health check fails, traffic is automatically routed to Altitude Anywhere to ensure high availability.

```yaml
version: v2.4
provider: cloudflare
routes:
  - pathPrefix: /
    name: ssr
    type: function
    directory: functions/ssr
    healthcheck:
      path: /health
      intervalMillis: 30000
      threshold: 2
      window: 3
      expectedResponse: 200
      method: GET
    build:
      command: build
      output:
        directory: dist
        filename: worker.js
```

For more details, see [Health Checks](/docs/platform/v2.4.0/edge/health-checks).

## Migration Steps

### 1. Update Your altitude.yaml Version

Update the `version` field in your `altitude.yaml` file:

```yaml
# Before
version: v2.3

# After
version: v2.4
```

### 2. (Optional) Add Health Checks

If you want to take advantage of automatic failover, add a health check configuration to your function routes:

1. Add a `healthcheck` block to your function route in `altitude.yaml`
2. Implement a health check endpoint in your worker

Example health check endpoint:

```javascript
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Health check endpoint
    if (url.pathname === "/health") {
      return new Response(null, { status: 204 });
    }

    // Your normal application logic
    return handleRequest(request, env);
  }
}
```

## Breaking Changes

There are no breaking changes in v2.4.0. All existing v2.3.0 configurations will continue to work without modification after updating the version number.

## Compatibility Notes

- Health checks are only supported for function routes. Static and proxy routes do not support health checks.
- The health check feature is optional. If you don't configure a health check, your site will continue to operate as it did in v2.3.0.

## Further Reading

- [Health Checks](/docs/platform/v2.4.0/edge/health-checks)
- [File-Based Configuration Reference](/docs/platform/v2.4.0/reference/file-based-configuration)
