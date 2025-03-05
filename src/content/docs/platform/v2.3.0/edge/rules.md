---
title: Rules
---

## Introduction

The **rules** feature of the Altitude platform allows you to define rules for performing HTTP redirects or rewrites. The rules can be grouped and associated with a site, an environment, or a domain.

To begin, a rule group needs to be created. You can name your rule group and specify the associated resources on creation (environment or domain). If the group is not associated with either, the association will be with the site.

![Create a group](/statics/screenshots/rules/create-rule-group.png)

## Rule Creation

Once created, rules can be added to the group one at a time or in bulk using the batch creation feature.

### Single Rule Creation

To create a rule, you will be prompted to input the following information:

- `Rule type`: Rules can either be redirects or rewrites. This is which of these applies to the rule being created.
- `Source path`: This is the original URL that you want to redirect/rewrite.
- `Target path`: This is the URL that you want the source to redirect/rewrite to.
- `Query parameters`: This is a list of key value pairs, if present the redirect will only apply if the query parameters in the URL match those in the list.
- `This rule is using regex matching instead of simple string comparison`: If checked the rule uses regex.
- `This rule is going to be permanent`: If the rule is a redirect, there will be an option to choose whether it is permanent.
- `Query parameters will be preserved`: If checked the query parameters will remain in the URL once the redirect has been applied.

![Create a rule](/statics/screenshots/rules/create-rule.png)

### Batch Rule Creation

For the batch create feature, a JSON file needs to be uploaded:

```json
{
  "rules": [
    {
      "source": "<string>",
      "target": "<string>",
      "queryParams": [
        {
          "key": "<string>",
          "value": "<string>"
        }
      ],
      "preserveQueryParams": "<boolean>",
      "ruleType": "TemporaryRedirect | PermanentRedirect | Rewrite",
      "isRegex": "<boolean>"
    }
  ]
}
```

You can upload a maximum of 500 rules at one time. The newly created rules will then be visible in the rules table, where you can see the rule type, whether it uses regex, and the source and target paths. In the Actions column of the table there are buttons which allow editing and deleting a specific rule.

### Example

Example: consider the following `redirect` rule, where the source url is `^/old-page(\/?|$)`, the target url is `/new-page` and the `preserve query parameters` checkbox is ticked. In this case, whenever a request is made to `/old-page`, it will be redirected to `/new-page` with a `301` (Moved Permanently) status code.

The same rule, added with the batch create, will look like this:

```json
{
  "rules": [
    {
      "source": "^/old-page(/?|$)",
      "target": "/new-page",
      "queryParams": [
        {
          "key": "key",
          "value": "value"
        }
      ],
      "preserveQueryParams": true,
      "ruleType": "PermanentRedirect",
      "isRegex": true
    }
  ]
}
```

As another example, consider the following `rewrite` rule, where the source url is `^/(\/?|$)` and the target url is `/index.html`. In this case, if a request is made to `/`, it will be rewritten to `/index.html`.

Note, when the rules get applied there could be a short delay due to cache TTL. Additionally, a redeployment will be needed after an association change.

## Association with Sites, Environments and Domains

The top level association is site level. This means that the rules will be applied to all environments and domains for that site. Only one rule group can be associated with a site.

A rule group can be associated with environments or domains. Environment association means that the rules associated with the group will be applied to the environment and its related domains. Domain association means that the rules associated with the group will only be applied to the selected domain; this is the most specific association.

## Source URL Formats

The source url field in both `redirects` and `rewrites` cases accept regular expressions. This provides flexibility in defining the source URLs that trigger the rules.

> **Note**: If you want to assert the end of the path in the source url, such as `/page` followed by the end of the URL, you can use a regex pattern like `\/page(\/?|$)`. Make sure to use a regex checker such as [regex101](https://regex101.com/) to validate and test your patterns.

## Target URL Formats

The target url field in both `redirects` and `rewrites` cases can accept either a path or a full URL.

- **Path**: If you provide a path as the target url, it will be relative to the domain of the incoming request. For example, `/new-page` would redirect or rewrite to `https://www.example.com/new-page` if the incoming request was made to `https://www.example.com/old-page`.

- **Full URL**: If you provide a full URL as the target url, it should include the protocol (e.g., `http://`, `https://`). For example, `https://www.example.com/new-page` would redirect or rewrite to `https://www.example.com/new-page` regardless of the incoming request's domain.

Ensure that the full URL in the target url includes the appropriate protocol to ensure accurate redirection or rewriting.

## Common Pattern Replacement

Regex enables common pattern replacement. As an example, consider a redirect rule where the source url is `/products/(.*)` and the target url is `/shop/$1`. Any URL that matches the pattern `/products/(.*)` will be redirected to `/shop/$1`, where `$1` represents the captured group from the source url pattern. This allows for dynamic replacement based on the captured value.

For instance, if a request is made to `/products/shoes`, it will be redirected to `/shop/shoes`. Similarly, `/products/clothing` will be redirected to `/shop/clothing`. This pattern replacement can be utilized to create cleaner and more user-friendly URLs for your website.

You can also do pattern replacement between the query parameter value and the target. For example, if the value is set to `{{test}}` and the target is `/bar/{{test}}`, the `{{test}}` variable would be substituted in the target, where it is also present.

Please note that regular expressions provide a powerful way to define patterns and capture specific parts of the URL for use in the target URL. However, it's important to ensure that the regular expressions are correctly formulated and tested to avoid unintended redirects or rewrites.

## Chaining Redirects and Rewrites

> **Caution**: When modifying redirect rules, ensure that you avoid creating infinite loops.

Altitude platform will automatically collapse redirect and rewrite chains. This is a performance optimisation to reduce round trips between the browser and the server.

As an example, consider the two rules below:

![Redirect collapsing example](/statics/diagrams/rules/redirect-collapsing.png)

The target of rule 1 matches the source of rule 2. The platform combines the two rules together to save the browser following multiple redirects.

In a chain, the query parameters are preserved only if all steps in the chain have the `preserve query parameters` checkbox checked. If any step in the chain has the `preserve query parameters` checkbox unchecked, the query parameters will not be preserved.

When there are multiple rules that match a URL, the `redirects` block is processed before the `rewrites` block.

Please exercise caution to prevent infinite loops in the chaining of redirects and rewrites, as it may lead to unintended consequences and impact the functionality of your website. If an infinite loop is detected, no rules will be applied to the request.

## Static Site Generator (SSG) Rule

If you are using a Static Site Generator (SSG) and you want to transform all paths to point to an HTML file, you can add a `rewrite` rule. This rule will ensure that incoming URLs are rewritten to target HTML files. Here's an example of how to add such a rule: set the source url as `\/([^\?/.]+)(?<!\.)(?=\/$|$|\?)` and the target url as `/$1.html`.

In this example, the source url field is defined using a regular expression pattern. The pattern `\/([^\?/.]+)(?<!\.)(?=\/$|$|\?)` matches any path segment that does not follow a dot (`.`) or a forward slash (`/`) and is followed by a slash (`/`), the end of the URL, or a query string. The captured path segment is represented as `$1`.

The target url field specifies that the captured path segment should be appended with the `.html` extension. For example, if a request is made to `/example-page`, it will be rewritten to `/example-page.html`.

By adding this `rewrite` rule, incoming URLs will be transformed to point to HTML files. You can also create this rule as a `redirect` instead, depending on your need.

## Validation and Limits

The platform will not allow regex rules that do not contain matching groups. This is because regex rules are more expensive to compute than basic rules.

There is currently a limit of 15,000 basic rules and 100 regex rules per rulegroup.