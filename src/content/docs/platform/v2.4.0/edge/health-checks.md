---
title: "Health Checks"
description: "Configure health checks for your edge functions to enable automatic failover"
---

# Health Checks

Health checks allow you to monitor the health of your functions and automatically failover to our backup platform when issues with our primary edge function provider are detected.

## How Health Checks Work

When you configure a health check for a function route, our CDN periodically sends requests to your function's health check endpoint. To determine whether or not your site is healthy, the CDN uses a window of recent health checks and a required threshold of passing health check requests in order to be considered healthy. For example, if the threshold is set to 3 and the window is set to 5, of the last 5 health check requests, 3 must have returned the expected response in order for the function to be considered healthy.

If the amount of passing health checks is less than the required threshold (such as in the event of outage of our primary provider), then we will serve your function from a backup platform until the threshold is once again met.

## Configuring Health Checks

Health checks are configured in your `altitude.yaml` file as part of a function route definition. Here's a basic example:

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
    build:
      command: build
      output:
        directory: dist
        filename: worker.js
```

### Configuration Options

| Option           | Required | Default | Description                                                                                   |
| ---------------- | -------- | ------- | --------------------------------------------------------------------------------------------- |
| path             | Yes      |         | The path for the health check endpoint on your function (e.g., `/health`)                     |
| intervalMillis   | No       | 15000   | How often to perform the health check in milliseconds                                         |
| timeoutMillis    | No       | 5000    | How long to wait for the health check response in milliseconds                                |
| threshold        | No       | 3       | How many checks within the window must be successful for the backend to be considered healthy |
| window           | No       | 5       | Number of most recent health check queries to evaluate for thresholding                       |
| initial          | No       | 4       | Number of health checks to initially consider as successful before real checks begin          |
| expectedResponse | No       | 200     | The expected HTTP status code for a healthy response                                          |
| method           | No       | HEAD    | HTTP method to use for the health check request (`HEAD` or `GET`)                             |
| headers          | No       | []      | Custom headers to include in the health check request                                         |

## Implementing a Health Check Endpoint

Your function needs to implement an endpoint that responds to health check requests. We advise that you choose a unique path on the function, e.g. `pages/altitude/health`. Here's a simple example of an Astro endpoint:

```typescript
import type { APIRoute } from "astro";

export const GET: APIRoute = () => {
  return new Response("OK", { status: 200 });
};
```

This health check will cover the simple case of our CDN being unable to reach the primary origin, but you can extend the health check to include testing connectivity between the function and any external services, such as Horizon. Please take caution in ensuring your health check is correctly configured before deploying as a misconfigured health check can cause failover even if it isn't necessary. Also, consider that the more complex your health check is, the longer you may need to configure the timeout property.

## Multi-Tenant Health Checks

If you're running a multi-tenant setup where different domains serve different sites, you can use custom headers to perform tenant-specific health checks, but you are limited to only checking the health of one tenant across the environment:

```yaml
healthcheck:
  path: /altitude/health
  method: GET
  expectedResponse: 200
  headers:
    - "X-Altitude-Instance: www.mysite.com"
```

Your function can then use this header to perform site-specific health checks:

```javascript
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/altitude/health") {
      const instance = request.headers.get("X-Altitude-Instance");

      // Perform site-specific health check
      const isHealthy = await checkSiteHealth(instance);

      if (isHealthy) {
        return new Response(null, { status: 200 });
      } else {
        return new Response("Unhealthy", { status: 503 });
      }
    }

    // Rest of function
  },
};
```

## Limitations

- Health checks are only available for **function routes**. Static and proxy routes do not support health checks.

## Further Reading

- [File-Based Configuration Reference](/docs/platform/v2.4.0/reference/file-based-configuration#health-checks)
- [Edge Functions](/docs/platform/v2.4.0/edge/functions)
