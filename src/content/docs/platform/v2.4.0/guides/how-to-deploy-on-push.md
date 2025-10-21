---
title: Deploy on Push
---

In this guide, you will learn how to use the CLI tool to automate the deployment your site using Github Actions.

## Prerequisites

Before you can use Github CI/CD integration, you must have an Altitude site with a Github repository associated with it. If you don't have a site yet, follow the instructions [here](../guides/create-a-site) to create one.

You also need to have an Altitude API client. If you haven't created one yet, follow the instructions [here](../reference/cli-commands) to set it up. When you create an API client, you will be given a `Client ID` and a `Client Secret`. Store these two values in your Github repository as environment secrets using the following keys:

```
ALTITUDE_CLIENT_ID: <Your Altitude API Client ID>
ALTITUDE_SECRET_KEY: <Your Altitude API Client Secret>
```

## Setup

To set up the Github CI/CD integration, follow these steps:

1. Login to your Github account and navigate to the repository containing your site code.
2. Create a new file named `.github/workflows/altitude-deploy.yml` in the root directory of your repository.
3. Copy the following code and paste it into the `altitude-deploy.yml` file:

```yaml
name: Publish with Altitude

on:
  push:
    branches: [main]

jobs:
  publish:
    runs-on: ubuntu-latest
    env:
      ALTITUDE_CLIENT_ID: ${{ secrets.ALTITUDE_CLIENT_ID }}
      ALTITUDE_SECRET_KEY: ${{ secrets.ALTITUDE_SECRET_KEY }}
    steps:
      - uses: actions/setup-node@v3
        with:
          node-version: 18.12.0
      - run: npx @thg-altitude/cli deploy --site "Your Site" --branch main
```

4. Replace the value of the `--site` flag with the name of your site as shown on the Altitude platform.
5. Depending on your configuration, you can modify the `on` section of the workflow to change when you want the site to be published. For example, you can set it to trigger on a specific branch or when a pull request is merged.
6. If you wish to automate the deployment of a branch other than `main`, update the value of the `--branch` flag.
7. Commit the addition of the `.github/workflows/altitude-deploy.yml` file to your repository's main branch.

## Deployment

Once you have completed the steps above, your site will be deployed on the Altitude platform automatically whenever a commit is pushed to the main branch of your repository.