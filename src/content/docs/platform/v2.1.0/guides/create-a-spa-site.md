---
title: Create an SPA Website
---

## 1. Setup Edge Configuration

First set up your Altitude.yaml file to use `static` as a rendering type. This will let us know that your project has pre-built the HTML required to serve a page.

**`altitude.yaml`**

```yaml
version: v2.1
provider: cloudflare
routes:
  - pathPrefix: /
    name: <your function/site name>
    type: static
    directory: .
    build:
      command: <your projects build command>
      output:
        directory: <your projects build directory>
```

## 2. Setup Rules

When creating a single-page application frameworks will typically produce a single `index.html` file after building your project. This acts as the entrypoint for all pages.

When using an SPA you can rewrite paths to resolve to one index.html file. We need to add some rules to allow the SPA to work as expected. Using the guide on rules found [here](../edge/rules/), we need to add a rule to enable this functionality. Please use the following input within the batch rules creation.

```json
{
  "rules": [
    {
      "source": "/([^?/.]+)(?<!.)(?=/$|$|?)",
      "target": "/index.html",
      "queryParams": [],
      "preserveQueryParams": true,
      "ruleType": "Rewrite",
      "isRegex": true
    }
  ]
}
```

The sourceUrl field is defined using a regular expression pattern. The pattern `\/([^\?/.]+)(?<!\.)(?=\/$|$|\?)` matches any path segment that does not follow a dot (`.`) or a forward slash (`/`) and is followed by a slash (`/`), the end of the URL, or a query string. The captured path segment is represented as `$1`.

You could also adjust the rule to add it as a Temporary or permanent redirect if desired.

## 3. Build & Deploy.

Now you're ready to build and deploy.

## Further Reading

- Learn [how to deploy](./create-a-site#deploy) on Altitude
- Lean more about rules [here](../edge/rules)
