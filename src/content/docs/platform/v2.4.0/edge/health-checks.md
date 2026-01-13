---
title: "Health Checks"
description: "Configure health checks for your edge functions to enable automatic failover"
---

# Health Checks

Health checks allow you to monitor the health of your functions and automatically failover to our backup ;platform Altitude Anywhere when issues with our primary edge function provider (Cloudflare) are detected.

## How Health Checks Work

When you configure a health check for a function route, Fastly (our CDN) periodically sends requests to your worker's health check endpoint. Based on the responses, Fastly will determine whether your worker is healthy:

1. **Healthy**: If the health check endpoint returns the expected response code within the timeout period, the worker is considered healthy and traffic continues to flow to it normally.

2. **Unhealthy**: If the health check fails (wrong status code, timeout, or error), and the number of failed health checks exceeds the threshold for a given window, Fastly marks the backend as unhealthy and automatically routes traffic to Altitude Anywhere.

3. **Recovery**: Once the health check starts passing again, traffic is automatically routed back to your Cloudflare Worker.

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
| path             | Yes      |         | The path for the health check endpoint on your worker (e.g., `/health`)                       |
| intervalMillis   | No       | 15000   | How often to perform the health check in milliseconds                                         |
| timeoutMillis    | No       | 5000    | How long to wait for the health check response in milliseconds                                |
| threshold        | No       | 3       | How many checks within the window must be successful for the backend to be considered healthy |
| window           | No       | 5       | Number of most recent health check queries to evaluate for thresholding                       |
| initial          | No       | 4       | Number of health checks to initially consider as successful before real checks begin          |
| expectedResponse | No       | 200     | The expected HTTP status code for a healthy response                                          |
| method           | No       | HEAD    | HTTP method to use for the health check request (`HEAD` or `GET`)                             |
| headers          | No       |         | Custom headers to include in the health check request                                         |

## Implementing a Health Check Endpoint

Your worker needs to implement an endpoint that responds to health check requests. Here's a simple example:

```javascript
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Health check endpoint
    if (url.pathname === "/health") {
      // Health check logic to determine whether health check should pass or fail
      return new Response(null, { status: 204 });
    }

    // Rest of function
  },
};
```

### Health Check Best Practices

1. **Simple logic**: Health check endpoints should be lightweight and fast. Avoid complex logic that could timeout.

2. **Check dependencies**: If your worker depends on external services (databases, APIs, Horizon), consider checking their availability in your health check. Factor in how long it takes for these services to respond in your `timeoutMillis` field.

3. **Use appropriate status codes**: Return 2xx (200 and 204 are common status codes for health checks), and 5xx for unhealthy. Configure `expectedResponse` to match your implementation.

## Multi-Tenant Health Checks

If you're running a multi-tenant setup where different domains serve different sites, you can use custom headers to perform tenant-specific health checks, but you are limited to only checking the health of one tenant across the environment:

```yaml
healthcheck:
  path: /health
  method: GET
  expectedResponse: 200
  headers:
    - "X-Altitude-Instance: www.mysite.com"
```

Your worker can then use this header to perform site-specific health checks:

```javascript
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
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
- The `Host` header for health check requests is automatically set to your Cloudflare Worker's domain and cannot be overridden.

## Further Reading

- [File-Based Configuration Reference](/docs/platform/v2.4.0/reference/file-based-configuration#health-checks)
- [Edge Functions](/docs/platform/v2.4.0/edge/functions)
