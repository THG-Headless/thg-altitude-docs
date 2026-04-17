---
title: CLI Commands
description: Reference guide for the Altitude CLI commands and usage.
---

# Altitude CLI Commands

This reference guide covers the commands available in the Altitude CLI and how to use them.

## Installation

To install the CLI you must first have [Node.js](https://nodejs.org/en) installed on your machine.

You can then install our CLI package by entering the following into the command-line:

```bash
npm install -g @thg-altitude/cli
```

## Setup

In order to use the Altitude CLI, you will first need to register an API client to authorize your requests.

To do this, navigate to your organization's settings page where you can find a list of API Clients. Please note, only organization Owners can create API clients.

Once you have created an API Client, store its credentials as the following environment variables within the environment that you intend to use the CLI:

```
ALTITUDE_CLIENT_ID
ALTITUDE_SECRET_KEY
```

## Deployment Commands

### Deploy a Site

To start a deployment with the CLI, enter the following in the command-line:

```bash
altitude deploy
```

You will then be asked to select the site and branch that you wish to deploy. Then you will be asked to select the environment you wish to deploy to.

The options are to name the environment after the branch name, to create a custom environment, or to select an existing environment.

### Headless Deployment

In order to use this CLI headlessly (for example, within a CI pipeline) you will need to pass arguments for the site and the branch that you wish to deploy as well as the name of the environment you want to deploy to. This can be an existing environment or a new one.

```bash
altitude deploy --site "My Site Name" --branch main --env environmentName
```

You can also pass the git reference of the specific commit that you would like to deploy:

```bash
altitude deploy --site "My Site Name" --ref {GIT_REF} --env environmentName
```

## Environment Commands

### Get Environment Information

The CLI allows you to get environment information in a JSON format. You will need to pass arguments for the environment name and the site which the environment belongs to. This will return an object containing: the environment name, the deployment URL, and the latest deployment information.

```bash
altitude environment info --site "My Site Name" --env environmentName
```

### Delete Environment

To delete an environment, use the following command:

```bash
altitude environment delete --site "My Site Name" --env environmentName
```

## Additional Commands

The Altitude CLI provides several other commands for managing your sites and environments. You can see a full list of available commands by running:

```bash
altitude --help
```

For help with a specific command, you can run:

```bash
altitude [command] --help