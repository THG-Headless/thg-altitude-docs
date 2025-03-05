---
title: Edge Configuration
---

# Reference

## Globals

| Key                 | Required | Type                                                             | Examples   | Description                                                               |
| ------------------- | -------- | ---------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------- |
| version             | Yes      | String                                                           | v2.2       | Altitude Edge Configuration Version. The current latest version is `v2.2` |
| provider            | Yes      | String                                                           | cloudflare | Cloud Provider                                                            |
| routes              | Yes      | Array[[Routes Configuration](#routes)]                           |            |                                                                           |
| cache               | No       | Array[[Cache Configuration](#cache)]                             |            |                                                                           |
| conditionalHeaders  | No       | Array[[Conditional Header Configuration](#conditional-headers)]  |            | Defines conditional headers                                               |
| preflightRequest    | No       | [Preflight Request Configuration](#preflight)                    |            | Config for optional preflight request |


## Routes

It is optional to start the pathPrefix with '/'.

### Function or Static Route
There are 4 required key/value pairs in every route, with additional fields dependent on what is mounted on the route.


| Key                          | Required | Type                                      | Examples                              | Description                                                                                                                                                                          |
| ---------------------------- | -------- | ----------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| pathPrefix                   | Yes      | String                                    | / <br/> /blog <br/> robots.txt        | The path this route is hosted on                                                                                                                                                     |
| name                         | Yes      | String                                    | ssr <br/> ssg <br/> favicon.ico <br/> | Name of this route (must only be lowercase alphanumeric and dashes)                                                                                                                  |
| type                         | Yes      | String                                    | function <br/> static                 | Determines if the route is for a function or static. A statically typed route will serve the assets directly however,a function route will run the file specified in an Edge Worker. |
| directory                    | Yes      | String                                    | dist <br/> public                     | The location of the source code to be mounted on this route                                                                                                                          |
| filename                     | No       | String                                    | favicon.ico <br/> robots.txt          | Optionally specify a single file to be mounted on this route                                                                                                                         |
| build                        | No       | [Build Configuration](#builds)            |                                       |                                                                                                                                                                                      |
| shield                       | No       | [Shield Configuration](#shield-locations) | Manchester<br/> Tokyo                 | Describes the location to forward all requests to before reaching the origin of this route                                                                                           |
| streaming **`Coming soon!`** | No       | boolean                                   |                                       | Optionally allow bytes to be relayed from the origin response without buffering of this route       


### Proxy Route

| Key                          | Required | Type                                      | Examples                              | Description                                                                                                                                                                          |
| ---------------------------- | -------- | ----------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| pathPrefix                   | Yes      | String                                    |  /proxy-route        | The path this proxy is hosted on                                                                                                                                                     |
| name                         | Yes      | String                                    | proxy | Name of this route (must only be lowercase alphanumeric and dashes)                                                                                                                  |
| type                         | Yes      | String                                    | proxy    | The type of proxy route is always 'proxy' |
| url                          | Yes      | String                                    | https://proxy.thgaltitude.com                     | The url the route will be proxied to |
### Shield Locations

- London
- LondonCity
- Manchester
- Frankfurt
- Madrid
- New York City
- Los Angeles
- Toronto
- Johannesburg
- Seoul
- Sydney
- Tokyo
- Hong Kong
- Mumbai
- Singapore

### Builds

For source code which requires a build step, the following values are added under the build dictionary and its nested output dictionary:

| Key             | Required | Type   | Examples    | Description                                                                                               |
| --------------- | -------- | ------ | ----------- | --------------------------------------------------------------------------------------------------------- |
| command         | Yes      | String | build       | The name of the script command to run to build the app                                                    |
| output          | Yes      | String |             | The output sub-fields relate to the output of the build step                                              |
| directory       | Yes      | String | dist        | The location of the compiled source code                                                                  |
| filename        | No       | String | \_worker.js | Specifying the app entrypoint file for the route                                                          |
| staticDirectory | Yes      | String | ssr-assets  | The location of the static assets created by the build (do not repeat the build output directory in this) |
| staticFilename  | No       | String | gbr.svg     | Specifying a single static asset within the staticDirectory                                               |
| nodeSettings    | No       | [Node Settings](#node-settings) |      | Configuration of NodeJS for this build                                                  |

#### Node Settings
| Key             | Required | Default | Type   | Examples | Description                                                                                               |
| --------------- | -------- | ------- | ------ | -------- |---------------------------------------------------------------------------------------- |
| version         | No       | 18.15.0 | String | 22.13.1  | The version of NodeJS to build the route with. Supported node versions correspond to image tags found [here](https://gallery.ecr.aws/docker/library/node)|

### Adding a New Route

*When adding a new route to your altitude yaml ensure it's always added at the bottom of the routes list.*

When adding a new function or proxy route to a previously deployed site there is the possibily of a small amount of downtime where the route serves a 503.
To mitigate this, please split your deployment of new functions or proxies into two parts.
- First, deploy your site with the new route in your altitude yaml to deploy the new function or link the new proxy.
- Then, redeploy your site with the code that calls the route you defined.


## Cache

If you need to adjust your sites cache configuration by path, you can specify a new cache key or cache max-age through the Altitude Yaml. To read more, see [caching](/edge/cache/).

| Key        | Required | Type                                          | Examples | Description                                                                                                                                                                                              |
| ---------- | -------- | --------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| pathRules  | No       | [Glob Matching Configuration](#glob-matching) |          | A set of glob rules which identify when the cache settings should be activated. If this is not specifed, the cache configuration will be global.                                                         |
| key        | No       | [Cache Key Configuration](#cache-keys)        |          |                                                                                                                                                                                                          |
| ttlSeconds | No       | Integer                                       | 100      | This will be used to specify the time that the response of the route should be stored in the cache, in seconds. The timing specified first in the array will take priority if multiple ttlSeconds match. |

### Cache Keys

Describes properties that influences the routes caching behaviour. One of headers or cookies needs to be present.

| Key     | Required | Type          | Examples | Description                                                  |
| ------- | -------- | ------------- | -------- | ------------------------------------------------------------ |
| headers | No       | Array[String] |          | A list of headers to be added to the cache key of this route |
| cookies | No       | Array[String] |          | A list of cookies to be added to the cache key of this route |
| queryParams | No       | Array[String] |          | A list of query parameters to be added to the cache key of this route. If no cache blocks with a queryParams section are matched, the whole url (path + query parameters) are in the cache key. Otherwise, the cache key is path + query parameters specified. |

### Glob Matching

Glob matching allows Altitude to provide you with highly performant, flexible pattern matching. You have two options; `anyMatch` and `noneMatch`, and the logic is as follows:

- If you specify anyMatch, one of the paths specified has to match the request URL.
- If you specify noneMatch, all of the paths specified have to not match the request URL.
- If you specify both anyMatch and noneMatch, both of the conditions have to be true for the caching configuration to be applied

Here are a few examples:

- `/**`: This will match every path on your site
- `/foo`: This will only match the path `/foo`
- `/foo**`: This will match every path with the prefix `/foo`
- `/foo*`: This will match every path with the prefix `/foo` with only one following nested path section (`/foo/bar` will match however `/foo/bar/baz` will not).

| Key       | Required | Type          | Examples | Description                                                                                                                                                                                                       |
| --------- | -------- | ------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| anyMatch  | No       | Array[String] |          | A list of glob paths where one of the list needs to match for the cache settings to be activated for a path. If both this field and `noneMatch` are specified, both need to be successful for the path to match.  |
| noneMatch | No       | Array[String] |          | A list of glob paths where all of the list needs to not match the path for the cache settings to be activated. If both this field and `anyMatch` are specified, both need to be successful for the path to match. |


### Conditional Headers

| ⚠️        **Notice**: This feature is in still development and not ready for general access. If you haven't been referred to it, please ignore this section   |
|-----------------------------------------|


The conditional headers feature allows dynamically adding new headers onto requests to your site, depending on the existence and value of an original request header. [Example](#example-conditional-header-config)

There are 5 required key/value pairs for each conditional header.


| Key                          | Required | Examples                              | Description                                                                                   |
| ---------------------------- | -------- | ------------------------------------- | --------------------------------------------------------------------------------------------- |
| matchingHeader               | Yes      | X-Request-Header               | The header whose value will be checked for a match on the given pattern.                                                              |
| pattern                      | Yes      | isApp <br/> ([^,]+),([^,]+)    | A regex pattern used to check the value of a given header for a match.                           |
| newHeader                    | Yes      | X-New-Header                   | The name of the new header created.                                     |
| matchValue                   | Yes      | true <br/> $1                  | The value of the new header created if a match was found. Capture groups are supported.                                   |
| noMatchValue                 | Yes      | false                          | The value of the new header created if no match was found.                                  |

#### Notes

- When defining the pattern the regex used must cover the whole header value. Eg for `atest` needs a regex of `.*t(.*)` not `t(.*)`.
- If a reference in the `matchValue` is made to a capture group that is out of bounds, it will be replaced with an empty string. Eg if the regex pattern has 2 capture groups
and the match value is `test=$3`, the new header value on a match woud be `test=`.


#### Example Conditional Header Config
```yaml
...
ConditionalHeaders:
  - matchingHeader: X-Request-Header
    pattern: ([^,]+),([^,]+)
    newHeader: X-New-Header
    matchValue: match=$1
    noMatchValue: no-match
...

```

If a site had the following config:   
When a request goes to the site with the header `X-Request-Header: foo,bar`. A new header would be added to the request `X-New-Header: match=foo` before going to the origin of the site.

## Preflight
Sometimes you may need to set part of your cache key based on some data that is not directly accessible to the client making the request. This can be done using the **`preflightRequest`** block in your `altitude.yaml`. This block allows you to specify a path to hit before a request is sent to one of your Altitude functions. The response to from this preflight request can then be used in the cache key for that request.

| Key | Required | Type | Examples | Description |
|---|---|---|---|---|
| path | Yes | String | /foobar | The path to send the preflight request to. |
| cache | Yes | [Preflight Cache Configuration](#preflight-cache) | | Cache configuration for caching the preflight response. |
| headers | Yes | [Preflight Header Block](#preflight-headers) | | Configuration to set backend request headers from preflight response headers |
| pathRules | Yes | Array[String] | | A set of glob rules which identify when a preflight request will be sent. These follow the same format as [Glob Rules](#glob-matching) |

### Preflight Cache
Describes properties that influences the caching behaviour of a preflight request. Caching for preflight requests is done using headers.

| Key | Required | Type | Examples | Description |
|---|---|---|---|---|
| headers | Yes | Array[String] | | List of request headers to be used in the cache key for this request |

### Preflight headers
This config block allows you to specify a response header from the preflight response that will be set in the request going to your function. This header can then be used in the cache key from the backend response.

| Key | Required | Type | Examples | Description |
|---|---|---|---|---|
| from | Yes | String | x-foo-bar | Header from the preflight response that you want to set on the request to your function |
| set | Yes | String | x-fizz-buzz | Header you want to set on the reqeust to your backend function. This can then be used in your cache key|

### Example
Here is an example of a **`preflightRequest`** block that makes a preflight request to `/tier` on any request that has path matching the glob pattern `/info`. The response for the preflight request is then cached using the header `x-cache-key`. The request to the backend function then has a header called `x-member-tier` set with the value of the same named header from the preflight response.
```yaml
preflightRequest:
    path: /tier
    cache:
      headers:
        - 'x-cache-key'
    headers:
        set: 'x-member-tier'
        from: 'x-member-tier'
    pathRules:
        - /info
```