---
title: CLI
---

## Installation

To install the CLI you must first have [Node.js](https://nodejs.org/en) installed on your machine.

You can then install our CLI package by entering the following into the command-line:

```
npm install -g @thg-altitude/cli
```

## Setup

In order to use the Altitude CLI, you will first need to register an API client to authorise your requests with.

To do this, navigate to your organisations settings page where you can find a list of API Clients. Please note, only organisation Owners can create API clients.

Once you have created an API Client, store its credentials as the following environment variables wihtin the environment that you intend to use the CLI.

```
ALTITUDE_CLIENT_ID
ALTITUDE_SECRET_KEY
```

## Deploying

To start a deployment with the CLI, enter the folliwng in the command-line:

```
altitude deploy
```

You will then be asked to select the site and branch that you wish to deploy. Then you will be asked to select the environment you wish to deploy to.

The options are to name the environment after the branch name, to create a custom environment, or to select an existing environment.

### Headless Deployment

In order to use this CLI headlessly (for example, within a CI pipeline) you will need to pass arguments for the site and the branch or that you wish to deploy as well as the name of the environment you want to deploy to. This can be an existing environment or a new one.

```
altitude deploy --site My Site Name --branch main --env environmentName
```

You can also pass the git reference of the specific commit that you could like to deploy.

```
altitude deploy --site My Site Name --ref {GIT_REF} --env environmentName
```

### Get Environment Information

The CLI also allows you to get environment information in a JSON format. You will need to pass arguments for the environment name and the site which the environment belongs to. This will return an object containing: the environment name, the deployment url, and the latest deployment information.

```
altitude environment info --site My Site Name --env environmentName
```

### Delete Environment
```
altitude environment delete --site foo --env bar
```