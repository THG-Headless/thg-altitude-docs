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
  - draft-07 (recommended)
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

### API Request Structure for POST and PUT

```json
{
  "pattern": "user:*", // Key pattern to match (string)
  "matchType": "GLOB",
  "schema": {
    // JSON Schema definition (object)
    "type": "object",
    "properties": {
      "name": { "type": "string" },
      "value": { "type": "number" }
    },
    "required": ["name", "value"]
  }
}
```

### Implementation Example

```json
{
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "value": { "type": "number" }
  },
  "required": ["name", "value"]
}
```

## Limitations

- JDT (JSON Data Type) schemas are not supported
- Schema validation occurs only during value updates
- Maximum schema size: 100KB
