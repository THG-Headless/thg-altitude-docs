---
title: Migrating from v2.2.0 to v2.3.0
description: Learn how to migrate your Altitude Platform projects from v2.2.0 to v2.3.0
---

# Migrating from v2.2.0 to v2.3.0

This guide will help you migrate your existing Altitude Platform projects from v2.2.0 to v2.3.0. Version 2.3.0 introduces several new features and some breaking changes that you need to be aware of.

## Breaking Changes

### KV Store API Changes

The KV Store API has been updated in v2.3.0 to support TTL and atomic operations:

#### v2.2.0 (Old)

```javascript
export default {
  async fetch(request, env) {
    // Store data
    await env.MY_KV_STORE.put('key', 'value');
    
    // Retrieve data
    const value = await env.MY_KV_STORE.get('key');
    
    return new Response(value);
  }
}
```

#### v2.3.0 (New)

```javascript
export default {
  async fetch(request, env) {
    // Store data with TTL (time-to-live in seconds)
    await env.MY_KV_STORE.put('key', 'value', { expirationTtl: 86400 });
    
    // Atomic operations
    await env.MY_KV_STORE.atomic()
      .put('counter', '1')
      .add('visits', 1)
      .commit();
    
    // Retrieve data with metadata
    const { value, metadata } = await env.MY_KV_STORE.getWithMetadata('key');
    
    return new Response(value);
  }
}
```

### Monitoring API Changes

The Monitoring API has been updated to support real-time metrics:

#### v2.2.0 (Old)

```javascript
export default {
  async fetch(request, env, ctx) {
    // Log an event
    ctx.log.info('Request received', { url: request.url });
    
    return new Response('Hello World');
  }
}
```

#### v2.3.0 (New)

```javascript
export default {
  async fetch(request, env, ctx) {
    // Log an event with enhanced metadata
    ctx.log.info('Request received', { 
      url: request.url,
      country: request.cf.country,
      browser: request.headers.get('user-agent')
    });
    
    // Record a custom metric
    ctx.metrics.increment('requests', 1, { 
      path: new URL(request.url).pathname 
    });
    
    return new Response('Hello World');
  }
}
```

## Migration Steps

### 1. Update KV Store Usage

Update all your KV store operations to use the new API:

1. Review all KV store operations in your code
2. Add TTL for keys that should expire
3. Use atomic operations for counters and other values that need atomic updates
4. Update any code that relies on the old API

### 2. Update Monitoring Code

1. Update your logging code to include enhanced metadata
2. Add custom metrics for important events
3. Update any dashboards or alerts to use the new metrics

### 3. Update Configuration Files

1. Update the `altitude.yaml` configuration file to include new monitoring settings:

```yaml
version: 2.3
provider: cloudflare
monitoring:
  alerts:
    - name: high-error-rate
      metric: error_rate
      threshold: 0.05
      duration: 60
  dashboards: true
```

### 4. Update Deployment Settings

1. Log in to the Altitude Platform dashboard
2. Go to your site settings
3. Update the deployment configuration to use v2.3.0
4. Configure new features like role-based access control
5. Set up real-time monitoring alerts
6. Re-deploy your site

### 5. Test Thoroughly

After migration, thoroughly test your site to ensure everything works as expected:

1. Test all KV store operations
2. Verify monitoring and metrics are working
3. Test any custom domains with HTTP/3
4. Check team permissions and access control
5. Verify CI/CD integration

## New Features in v2.3.0

Take advantage of these new features after migrating:

### Enhanced KV Store

```javascript
// Set a key with metadata
await env.MY_KV_STORE.put('user:123', JSON.stringify(userData), {
  expirationTtl: 3600,
  metadata: { lastUpdated: new Date().toISOString() }
});

// List keys with a prefix
const keys = await env.MY_KV_STORE.list({ prefix: 'user:' });
```

### Real-time Monitoring

Access the new monitoring dashboard to:

1. View real-time request logs
2. Track custom metrics
3. Set up alerts for critical events
4. Analyze performance trends
5. Export metrics to external systems

### Role-based Access Control

Configure fine-grained permissions for team members:

1. Create custom roles with specific permissions
2. Assign roles to team members
3. Control access to specific environments
4. Audit access and changes

## Need Help?

If you encounter any issues during migration:

- Check the [troubleshooting guide](/docs/cloud/v2.3.0/guides/troubleshooting)
- Contact support through the new in-app chat feature
- Join our [community forum](https://community.thgaltitude.com)