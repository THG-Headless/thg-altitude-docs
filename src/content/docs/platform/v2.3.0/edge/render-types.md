---
title: Render Types
---

## Static Site Generation (SSG)
The static site generaiton method was made popular in web development during the time in which CDN (Content Delivery Network) products were the only available edge environment. The concept of SSG orients around the idea of running a task either locally or in a build pipeline to generate all possible combinations of pages (or routes) so that for every page or combination (locales, currency, etc) there would be an equivelant HTML file.

The pattern is still a low cost route to delivering content on the edge, however due to the nature of the generation is best reserved to environments which have a low rate of change or a predictable method of change (e.g. Blogs, Landing Pages or Documentation).

**Single Page App (SPA)**

A variant of the rendering method that pairs with SSG is a web app implementation called SPA. SPA is a flavour of implementation for a website which promotes JavaScript being used to load (hydrate) pages to the browser rather than relying on traditional route of requesting a web page the SPA removes aspects of the fetch that typically occurs per page load making for a quicker second (and onward) load.

#### Further Reading
- Learn how to [Deploy an SSG](/guides/deploy-a-ssg-site/) on Altitude
- Learn how to [Deploy an SPA](/guides/deploy-a-spa-site/) on Altitude

## SSR (Server-side Rendering)
The SSR rendering method grew in popularity as edge compute infastructures became more performant and viable alternatives to a CDN. A server-side rendered page is typically a page that is generated in a server, typically on-the-fly as customers view the pages.

This method of rendering is ideal for environments where change is frequent and the depth of the pages (routes) grows (e.g. Commerce) as in an SSR pattern no pages need to be pre-generated as they're only created when requested.

#### Further Reading

- Learn how to [Deploy an SSR](/guides/deploy-a-ssr-site/) on Altitude