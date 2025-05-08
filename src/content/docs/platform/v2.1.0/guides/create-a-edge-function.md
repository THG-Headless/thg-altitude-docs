---
title: Create an Edge Function
---

Writing your own edge functions to run on altitude is an easy and painless endeavour. Lets have a look at how to do it!

## Language Support
Altitude edge functions are written in Javascript and dependency management is done using NPM so each of your function folders should contain a `package.json` in which you can specify dependencies and build commands.
## Folder Structure
Function folders can be nested inside other function folders but it is recommended to keep them isolated. For example having a parent folder `functions` inside your project with separate sub-folders for each of your functions like so:  
```
`-- functions
    |-- function1
    |   |-- main.js
    |   `-- package.json
    |-- function2
    |   |-- main.js
    |   `-- package.json
    `-- function3
        |-- main.js
        `-- package.json
```
## Anatomy of a Function
We currently support Cloudflare as an edge function provider. In order to use this provider it is necessary for your function code to build to a single Javascript file after selecting the Cloudflare edge function provider in your [`altitude.yaml`](../reference/file-based-configuration) config file. Building to a single Javascript file can be done by adding a build command to the scripts block in that functions `package.json` e.g.
```json
{
  "name": "example_function",
  "version": "1.0.0",
  "description": "Example Function",
  "main": "main.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "vite build"
  },
  "keywords": [
    "test"
  ],
  "author": "",
  "license": "ISC"
}
```
For some tasks such as edge server side rendered (SSR) websites we provide easy to use starter kits available on [Altitude](https://www.platform.thgaltitude.com). This gives you an extensible easy to customise set of functions, with build commands pre-configured, so you can just focus on delivering your website rather than wiring edge functions together. More information on templates and starter kits can be found [here](../kits/introduction).
### Cloudflare Functions
To create a Cloudflare function you should create a Javascript file that exports a function called fetch like so:
```javascript
export default {
  async fetch(request, env) {
    
  }
}
```
The fetch function is responsible for processing any requests that this function receives. As input parameters it receives a `request` object containing data from the incoming request and the `env` parameter is an object with keys corresponding to the environment variables specified when creating your site on Altitude. The data available on the request object match that of the Web API's [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) object.

**A note on environment variables: the environment variables specified during site creation and in the environment settings on Altitude are shared between all functions.**

Sending a response from your function is just as easy here is a "Hello World" example demonstrating how to send a JSON blob back as a response:
```javascript
export default {
  async fetch(request, env) {
    const jsonBlob = {
      "message": "Hello World!"
    };
    const body = JSON.stringify(jsonBlob);

    return new Response(body, {
      headers: {
        "content-type": "application/json;charset=UTF-8"
      }
    });
  }
}
```
As you can see sending a response is as simple as returning a `Response` object from the `fetch` function. The first parameter of the `Response` object is the response body and the second parameter is an options object. The options that may be passed to the options object are:
|Option Name|Data Type|Description|
|---|---|---|
|`headers`|Object of string key value pairs|Values for the response headers|
|`status`|int|HTTP response status|
|`statusText`|string|status text to send in response|
## Function Examples
Here are some examples of things you can do with edge functions.
### Forward a request
In this example we look at a simple edge function for forwarding a request to a different API and returning the response.
```javascript
export default {
  async fetch(request, env) {
    const url = 'https://exampleAPI.com/api/graphql'
    const incomingRequestBody = await request.json();
    const incomingRequestHeaders = Object.fromEntries(request.headers);
    const init = {
      headers: {
          'content-type': 'application/json;charset=UTF-8',
          ...requestHeaders,
      },
      method: request.method || 'POST',
      body: JSON.stringify(incomingRequestBody),
    };
    return await fetch(url, init);
  }
}
```
Doing this is quite simple you just copy the original request headers and body, and forward them on to the destination URL. The reason for copying the request is so you can annotate the headers and body with additional data if necessary before forwarding the request onto the destination url. This function could easily be mounted on a path using the `altitude.yaml` config file, thus redirecting all requests to that path to an alternative URL (acting as a proxy endpoint).
