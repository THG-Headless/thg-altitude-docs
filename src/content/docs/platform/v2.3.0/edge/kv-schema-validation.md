---
title: KV Store Schema Validation
---

## Overview

Altitude's Key-Value (KV) store includes schema validation capabilities to maintain consistent value structures. This feature helps validate your KV pairs against set predefined schemas.

For more information about KV stores:

- [KV Store basics](./edge/kv-store.md)

## Schema Validation Features

### Supported Schema Formats

- JSON Schema (exclusively), we do not currently support JDT
- Supported JSON Schema versions:
  - [draft-07](https://json-schema.org/draft-07/draft-handrews-json-schema-01) (recommended)
  - draft-2019-09
  - draft-06
  - draft-04

### Validation Patterns

You can define schemas for:

- Specific keys
- Glob patterns (matching multiple keys)

## Using Schema Validation

### API Operations

The KV Schema API supports full CRUD operations for both Key and Glob patterns:

- Create new schemas
- Read existing schemas
- Update schema definitions
- Delete schemas

## Special Cases & Rules:

- If multiple glob patterns match a KV pair, the most specific glob pattern takes precedence, and the value must satisfy all applicable schemas.
- You can create a glob schema even if no keys currently match.
- You cannot create a key schema unless a corresponding key already exists.
- If a KV pair does not match its schema, the create/update operation fails.
- KV values must always be a JSON object if it is defined against a schema.
- If you attempt to create a glob schema but existing values do not match, the schema creation will fail.

### Example API Request Structure for POST

```bash
curl -X POST "https://www.uat.platform.thgaltitude.com/api/v1/sites/:siteId/kv-schema/:kvStoreId" \
-H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
-H "Content-Type: application/json" \
-d '{
  "pattern": "user:*",
  "matchType": "GLOB",
  "schema": {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "generalGlobSchema",
    "type": "object",
    "required": ["id", "name"],
    "properties": {
      "id": {
        "type": "string"
      },
      "name": {
        "type": "string"
      }
    },
    "additionalProperties": false
  }
}'
```

## Limitations

- JDT (JSON Data Type) schemas are not supported
- Draft-2020-12 is not supported
- Maximum schema size: 100KB
