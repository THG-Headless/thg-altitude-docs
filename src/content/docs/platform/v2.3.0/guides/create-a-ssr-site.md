---
title: Create an SSR Website
---

## 1. Setup Edge Configuration

First set up your Altitude.yaml file to use `function` as a deploy type. This will let us know which build commands your project uses and where your worker is built.

**`altitude.yaml`**
```yaml
...
routes:
  - pathPrefix: /
    name: <your function/site name>
    type: function
    directory: .
    build:
      command: build
      output:
        directory: <your projects build command>
        filename: <worker filename (for e.g. _worker.js)>
        staticDirectory: static/ssr
...

```

## 2. Build & Deploy.

Now you're ready to build and deploy.

## Further Reading

- Learn [how to deploy](./create-a-site#deploy) on Altitude
