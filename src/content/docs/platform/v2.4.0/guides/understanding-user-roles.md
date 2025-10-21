---
title: User Roles and Permissions
description: A guide to the different user roles and permissions used on Altitude.
---

User roles on Altitude are managed on both an organisation level and on a site level.

## Organisation Roles

### Admin

An organisation admin can:

- Manage/invite users and manage teams within the organisation
- Update any user's role within the organisation
- Update git connections and create API clients
- Perform admin actions on any site within the organisation

### Member

An organisation member has:

- Read-only access to the organisation settings and configuration and cannot create new sites
- Read-only access to public sites unless the user has been given admin access in the site settings
- Only has visibility of sites marked as public unless they have been given specific access to the site

## Site Specific Roles

A site can be configured to allow it to be visible to any user within the organisation or to only allow or users or teams specifically assigned to the site with the `public` or `private` options respectively. Organisation admins have access to any site regardless of this setting.

Users or teams can be assigned one of the following roles against a site:

### Admin

- Has full management access over the site

### Reviewer

- Has read-only access to the site
- Cannot create environments or trigger deployments

### Trader

- Has read-only access to the site
- Can manage individual and bulk upload redirect/rewrite rules

## Teams

Allows users to be grouped to make managing site access easier

- A user in a team inherits the site role that has been assigned to the team

- Only organisation admins can manage teams and add/remove users within them
