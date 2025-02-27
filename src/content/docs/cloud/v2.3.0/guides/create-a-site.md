---
title: Creating a Site (v2.3.0)
description: Learn how to create a site in Altitude Platform v2.3.0
---

# Creating a Site in Altitude Platform v2.3.0

This guide will walk you through the process of creating a new site in Altitude Platform version 2.3.0, which includes several new features and improvements over previous versions.

## Prerequisites

Before you begin, make sure you have:

- An Altitude Platform account
- A GitHub repository with your project
- Basic familiarity with Git

## Step 1: Log in to Altitude Platform

1. Go to [Altitude Platform](https://www.platform.thgaltitude.com)
2. Log in with your credentials
3. If you're part of multiple teams, select the appropriate team

## Step 2: Create a New Site

1. From the dashboard, click the "Create Site" button
2. Enter a name for your site
3. Select the GitHub repository containing your project
4. Choose the branch you want to deploy
5. **New in v2.3.0**: You can now select multiple branches for preview deployments with custom domain patterns

## Step 3: Configure Build Settings

1. Specify the build command (e.g., `npm run build`)
2. Set the output directory (e.g., `dist` or `build`)
3. Configure environment variables needed for the build
4. **New in v2.3.0**: You can now set different environment variables for different deployment environments with inheritance support

## Step 4: Configure Advanced Settings

1. Set up KV store access with TTL support
2. Configure edge function settings with enhanced performance options
3. Set up team permissions with role-based access control
4. Configure CI/CD integration with detailed deployment reports
5. **New in v2.3.0**: Set up real-time monitoring alerts

## Step 5: Deploy Your Site

1. Click "Create Site" to finalize the setup
2. Wait for the initial build and deployment to complete
3. Once deployed, you'll receive a URL where your site is accessible
4. **New in v2.3.0**: View real-time deployment logs and metrics

## Step 6: Configure Custom Domain

1. Go to the site settings
2. Click on "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions
5. **New in v2.3.0**: Automatic SSL certificate provisioning and renewal with HTTP/3 support

## Troubleshooting

If you encounter issues during deployment:

- Use the new real-time monitoring dashboard to identify issues
- Check the enhanced build logs for detailed error information
- Use the deployment inspector to identify performance bottlenecks
- Contact support through the new in-app chat feature

## Next Steps

Now that you've created your site, you can:

- [Set up environment variables](/docs/cloud/v2.3.0/guides/environment-variables)
- [Configure the KV store](/docs/cloud/v2.3.0/guides/kv-store)
- [Set up team permissions](/docs/cloud/v2.3.0/guides/team-permissions)
- [Configure CI/CD integration](/docs/cloud/v2.3.0/guides/ci-cd-integration)
- [Set up real-time monitoring](/docs/cloud/v2.3.0/guides/monitoring)