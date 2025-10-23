---
title: Private packages
---

This guide will walk you through how to use private packages on Altitude Platform.

## Setup

Suppose you have an application you wish to deploy on altitude platform but you want to use a private package that is on Github Packages. In your repo you will have a package.json and .npmrc

**`package.json`**

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "dependencies": {
    "@yourOrg/ui-components": "^1.5.2"
  }
}
```

**`.npmrc`**

```ini
@yourOrg:registry=https://npm.pkg.github.com
```

The .npmrc file needs to be in updated with the correct credentials in order to make use the dependency in the package.json. We can make use of the `preBuildCommand` in the `altitude.yaml` which will trigger a script to add the correct credentials to the .npmrc before the build step.

## Create prebuild.js

This script extracts the environment variables from the `.env` file available during the build step, more details [here](../reference/configuration#variables-build-time). It should be in the same directory as your `altitude.yaml` file.

```js
import fs from "node:fs";

// Function to read environment variables from .env file.
const getEnvVariables = () => {
  try {
    const env = fs.readFileSync(".env", "utf-8").split("\n");

    return env.reduce((acc, line) => {
      const equalIndex = line.indexOf("=");
      if (equalIndex === -1) {
        return acc;
      }

      const variable = line.substring(0, equalIndex).trim();
      const value = line.substring(equalIndex + 1).trim();

      return { ...acc, [variable]: value };
    }, {});
  } catch (e) {
    console.log("Error getting environment variables");
    throw e;
  }
};

const vars = getEnvVariables();

//looks for the environment varaible and, if it exists, adds it to the .npmrc
const token = vars?.NPM_PKG_TOKEN?.trim();
if (token) {
  const existingToken = fs.readFileSync(".npmrc", "utf-8");
  const output = `//npm.pkg.github.com/:_authToken=${token}\n`;
  const newNPMRc = `${existingToken}\n${output}`;
  fs.writeFileSync(".npmrc", newNPMRc);
}
```

When this script is run your .npmrc file will look like

```ini
@yourOrg:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_TOKEN
```

## Add prebuild command to `altitude.yaml`

Then update your build section for private packages:

**`altitude.yaml`**

```yaml
version: v2.4
provider: cloudflare
routes:
  - pathPrefix: /
    name: guide
    type: static
    directory: .
    build:
      commands:
        - npm install
        - node prebuild.js
      output:
        directory: dist
```

Next time you deploy, the prebuild script will run before your build and your private package will install successfully.

- See also: [Configuration reference](../reference/configuration)
