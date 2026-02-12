---
title: "Caching"
---

## Default Cache Behaviour

The default behaviour for Altitude is that requests are not cached by default. We want to be as flexible as possible and creating the assumption that responses can be cachable can lead to dangerous behaviour, especially when sensitive data is being returned.

## SSR Caching

### Cache-Control Header

You can override our default behaviour by adding `Cache-Control` headers in the responses of your functions.  
There are three types of cache controls headers you can add to specify how caching behaves for your functions.  
All times for `Cache-Control` headers are to be given in seconds. For more information regarding this header, please see the [MDN Cache-Control Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control).

**1. Max Age**

Adding `max-age` to the `Cache-Control` header will indicate a time for the _customers browser_ to store the response.

**2. Shared Cache Max Age**

Adding `s-maxage` to the `Cache-Control` header will indicate a time for _our shared cache on the edge_ to store the response.  
**Note:** This should not be returned on personalised pages as other users have access to this cache.

**3. Stale While Revalidate**

Adding `stale-while-revalidate` to the `Cache-Control` header will indicate a time for the users browser to serve stale data
if the other caches are expired. If stale data is served it will then refresh the cache in the backgroud, so the next request
has fresh data.

**Example**

If the following headers were added to the response of an SSR function:

`Cache-Control: max-age=120; s-maxage=300; stale-while-revalidate=900`

This will cache requests in the users browser for 2 minutes, we will cache them in the edge for 5 minutes and for 15 minutes after the cache expires, we will serve
stale data whilst in the background we will refresh the cache.

### Cache Configuration

Within Altitude, we give you the ability to fully customise your caching experience. You can specify custom caching length and cache keys on specific paths on your site.

A cache key serves as a unique identifier for each requested resource, and can contain information such as HTTP headers and cookies. It enables efficient storage and retrieval of cached content, optimizing delivery speed. By default the cache key only contains the host, path, query strings and the `Accept-Encoding` header however, on Altitude we maintain the ability to add additional information to it.

For example, if your site contains localised content based upon a locale cookie, we can pass this cookie into the cache key so that each locale maintains different cached responses and there can be no bleed.

An example of an `Altitude.yaml` file with caching enabled is below. For more information on the configuration, see [the edge configuration](../reference/file-based-configuration).

```yaml
version: v2.1
provider: cloudflare
routes:
  # Add routes here
cache:
  - pathRules:
      anyMatch:
        - /foo**
    ttlSeconds: 100
  - pathRules:
      anyMatch:
        - /foo**
      noneMatch:
        - /foo/bar**
    key:
      headers:
        - X-Foo
```

The result of adding this cache would be:

- For any path with a prefix `/foo`, you would have a cache-control header of `max-age=100`.
- For any path with a prefix `/foo` excluding paths with a prefix `/foo/bar`, you would be able to differ your cache by changing the `X-Foo` request header.
- For any other paths, the default settings remain.

## Cache Purging

Cache purging allows you to immediately update content delivered to users when you make changes to your site. Rather than waiting for the content to expire, you can use the API endpoint `POST sites/:siteId/purge-cache/:envName` which supports 6 purge types: domain, path, key, all, redirects and experimentation. The body parameter `purgeType` is always required and its value must be one of the six types, while the remaining parameters will depend on the purge type you have selected.

`purgeType: "domain"`

This will purge all cached content belonging to a particular domain. It requires the following parameter:

- `domainName`: The domain you want to purge, e.g. `"www.foo.com"`.

`purgeType: "path"`

This will purge cached content related to a particular path. It requires the following parameter:

- `path`: The path you want to purge, e.g. `"/c/"`. **Note:** even though a URL path may not end in a trailing slash, the label corresponding to a cached object will always, so we always require a trailing slash here.

Additionally, the following parameters are also accepted:

- `domainName`: If specified, the path will only be purged on this domain. Otherwise, it will be purged across the entire environment.
- `prefix`: Default: `false`. If set to `true`, we will not only purge the content on this path but we will also purge any sub-paths, for example if we purge `/products/` with prefix purging enabled, we will also purge `"/products/item1/"`, `"/products/item2/"`, etc.

`purgeType: "key"`

This will purge cached content in the environment labelled with the specified key. It requires the following parameter:

- `key`: The key you want to purge e.g. `"blog"`

`purgeType: "all"`

This will purge all cached content in the environment. No additional parameters are required. **Note:** it may take a few minutes for the request to be processed across all edge servers.

`purgeType: "redirects"`

This will purge cached content related to redirects of the specified rule group. It accepts the following parameter:

- `ruleGroupId`: The rule group you want to purge e.g. `"ruleGroup123"`. If omitted, all redirects will be purged on this environment.

`purgeType: "experimentation"`

This will purge cached content for all experiments on an environment. No additional parameters are required.

#### Example: Purging the path /bar/ on domain www.foo.com with prefix purging enabled:

```
 curl -i --location 'https://api.platform.thgaltitude.com/v1/sites/:siteId/purge-cache/:envName' --header 'Accept: application/json' --header 'Content-Type: application/json' --header "Authorization: Bearer $token" --data '{ "purgeType": "path", "domainName": "www.foo.com", "path": "/bar/", "prefix": true}'
```

Please follow the guide [How to use Altitude API](../guides/how-to-use-altitude-api/) to get your bearer token.

### Purging via Altitude UI

Cache purging can also be requested via the Altitude UI for purge types: `domain`, `path`, `key` and `all`

![Cache purge example](/statics/screenshots/cache/cache-purge-example.png)

## Request Collapsing

You should exercise caution if you are serving personalised pages to make sure that request collapsing doesn't cause personalised responses to be served to the wrong customers. Note that this is different from caching, and can apply even if `Cache-Control` is set to `no-cache, no-store`.

Request collapsing is a performance optimisation to reduce origin load when multiple customers are asking for the same resource at the same time. Fastly groups together multiple incoming requests into a single origin request, then serves that one response to multiple customers. The diagram below shows the three opportunities in the request flow for this to happen.

![Request collapsing example](/statics/diagrams/cache/request-collapsing.png)

Request collapsing will only happen on GETs where all the incoming requests share the same cache key.

To disable this behaviour for a particular path, you should:

- add a VCL snippet in your altitude yaml to disable caching (which also disables request collapsing)
  ```- name: bypass_req_collapse
  content: |
    if (req.url.path == "/personalised/") {
      return(pass);
    }
  type: recv
  priority: 100
  ```
- ensure that you add the `private` directive to the `Cache-Control` header on the response.

To read more about this, see [here](https://www.fastly.com/documentation/guides/concepts/edge-state/cache/request-collapsing/).
