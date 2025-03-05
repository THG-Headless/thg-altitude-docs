---
title: Deprecation of Altitude Rules
---

## Introduction

On the **1st February 2024**, we will be deprecating the use of the file `altitude-rules.yaml` which formerly controlled redirects and rewrites.

## Why?

We have moved this functionality to exist within the Platform UI for numerous reasons. You can read more about this new feature [here](/edge/rules/).

- Immediate Implementation: Changes made via the new interface take effect instantly, eliminating the need for redeployment and facilitating quicker updates.

- User-Friendly Interface: The redesigned system simplifies rule management, catering to diverse roles like traders and SEO managers, without requiring direct codebase access.

## Migration Guide

We formerly had 2 sections within the Altitude Rules file, one for redirects and another for rewrites. Both of these rules will now be handled in one easy-to-use UI.

To migrate your rules, open up the UI and select the [batch rule creation](/edge/rules/#batch-rule-creation).

A recommendation is that you create a new, non-production environment for your site and association your rule group with this environment to test it with. In this environment, delete your `altitude-rules.yaml` file so there is a clean slate to work with. Remember to deploy your new environment after this association so they are coupled.

From here, we can translate our rules into the batch rule creation input. An example of this is:

<table>
  <tr>
    <th>Altitude Rules</th>
    <th>Batch Input</th>
  </tr>
  <tr>
  <td>

```yml
redirects:
  - sourceUrl: /regex/(.+)
    targetUrl: /$1
    preserveQueryString: false
    statusCode: 301
  - sourceUrl: /non-regex?foo=bar
    targetUrl: /
rewrites:
  - sourceUrl: /foo
    targetUrl: /bar
    preserveQueryString: true
  - sourceUrl: /test?replace=([^&]*)
    targetUrl: /test/$1
```

  </td>

  <td>

```json
{
  "rules": [
    {
      "source": "/regex/(.+)",
      "target": "/$1",
      "queryParams": [],
      "preserveQueryParams": false,
      "ruleType": "PermanentRedirect",
      "isRegex": true
    },
    {
      "source": "/non-regex",
      "target": "/",
      "queryParams": [
        {
          "key": "foo",
          "value": "bar"
        }
      ],
      "preserveQueryParams": true,
      "ruleType": "TemporaryRedirect",
      "isRegex": false
    },
    {
      "source": "/foo",
      "target": "/bar",
      "queryParams": [],
      "preserveQueryParams": true,
      "ruleType": "Rewrite",
      "isRegex": false
    },
    {
      "source": "/test",
      "target": "/test/{{replaceValue}}",
      "queryParams": [
        {
          "key": "replace",
          "value": "{{replaceValue}}"
        }
      ],
      "preserveQueryParams": true,
      "ruleType": "Rewrite",
      "isRegex": true
    }
  ]
}
```

  </td>
  </tr>
</table>

From the example above, the noticable differences are:

- **Preserve Query Params**: In the UI, you can now specify whether you want to preserve query parameters after the redirect/rewrite.
- **Is Regex**: To improve the perforamnce of your redirects, we now ask you to specify whether it is a simple matching rule or you are using regex within the rule.
- **JSON Special Characters**: In your yaml rules, if you have got a rule which has a backslash in it, you will have to convert this to a double backslash. Note: **This is only when adding a rule using the batch addition**
- **Query Parameters**: We now have a seperate block for query parameters. As well the query parameters being in their own well-defined block, you can now do query parameter -> target replacement as described [here](/edge/rules/#common-pattern-replacement).
