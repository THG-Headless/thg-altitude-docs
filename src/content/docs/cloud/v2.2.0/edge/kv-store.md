---
title: KV Store
---

## Introduction

Altitude offers robust support for Key-Value (KV) storage, enabling swift data access from functions. These stores are conveniently hosted at the edge, ensuring efficient retrieval. Within an Altitude site, users can create and manage collections of Key-Value pairs tailored to their specific needs

## Store Creation
Creating a KV store is a straightforward process. Simply navigate to the `KV Stores` tab on your Altitude site, then click the `Add Store` button to initiate the creation process. Provide a name for the store and optionally select an environment for association.

![Create Store](/statics/screenshots/kv_store/create-store.png)

Note that updating the KV store association for an environment necessitates triggering a new deployment on that environment for the changes to take effect.

## Key-Value Pairs

Within each KV store, users have full control over managing Key-Value pairs, including reading, editing, and deleting them as needed.

![KV Pairs](/statics/screenshots/kv_store/kv-pairs.png)

To retrieve a value from a function, use the `await env.ALTITUDE_KV_STORE.get(key)` syntax, where `key` corresponds to the desired value's key. Additionally, users can specify the `type` option to automatically convert the retrieved value to a desired data type within their functions. Furthermore, the `cacheTtl` option allows customisation of the time-to-live (TTL) for the cache on a specific KV pair. For more comprehensive details, users can refer to the[Cloudflare Read KV Documentation](https://developers.cloudflare.com/kv/api/read-key-value-pairs).