---
title: Edge Functions Overview
description: Overview of Altitude Platform Edge Functions
order: 4
---

# Edge Functions Overview

Altitude Platform Edge Functions allow you to run JavaScript code at the edge, closer to your users for optimal performance.

## What are Edge Functions?

Edge functions are JavaScript functions that run on Altitude's global edge network. They enable you to:

- Process requests at the edge
- Generate dynamic content
- Interact with APIs
- Manipulate responses
- Implement custom logic

## Benefits of Edge Functions

Using edge functions provides several advantages:

- **Performance**: Reduced latency by processing requests closer to users
- **Scalability**: Automatic scaling to handle traffic spikes
- **Global Reach**: Deploy your code to multiple regions simultaneously
- **Cost Efficiency**: Pay only for the compute resources you use
- **Developer Experience**: Write standard JavaScript code

## Edge Function Types

Altitude Platform supports several types of edge functions:

### Request Handlers

Process incoming HTTP requests and generate responses:

```javascript
export default {
  async fetch(request, env) {
    return new Response("Hello from the edge!", {
      headers: { "Content-Type": "text/plain" }
    });
  }
}
```

### API Endpoints

Create serverless API endpoints:

```javascript
export default {
  async fetch(request, env) {
    const data = { message: "Hello from the API" };
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" }
    });
  }
}
```

### Server-Side Rendering

Render dynamic content at the edge:

```javascript
export default {
  async fetch(request, env) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Edge SSR Example</title>
        </head>
        <body>
          <h1>Hello from the Edge!</h1>
          <p>Generated at: ${new Date().toISOString()}</p>
        </body>
      </html>
    `;
    
    return new Response(html, {
      headers: { "Content-Type": "text/html" }
    });
  }
}
```

## Getting Started

To get started with edge functions, check out:

- [Writing Edge Functions](/docs/cloud/edge/functions)
- [Edge Function Examples](/docs/cloud/edge/examples)
- [Deployment Guide](/docs/cloud/guides/create-a-site)