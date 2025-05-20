---
title: Use Altitude API
---

In this guide, you will learn how to use the Altitude API.

To access any endpoint in the Altitude API, you will need a bearer token. This token will allow you to interact with various endpoints. To obtain the bearer token, you need to create your API client in the Platform UI. Below are the steps explained in detail.

## Create API client

**Note:** You must be an org owner to create API clients. Please check out this guide: [Understanding user roles](../guides/understanding-user-roles/).

Navigate to the org settings page (https://www.platform.thgaltitude.com/settings). Create a new api client in `API Clients` section.

Once you have created a client, a modal will appear with your `Client ID` and `Client Secret`. Please make sure to copy these values before closing the modal.

In your terminal, export the following variables:

```sh
export ALTITUDE_CLIENT_ID = <Your Client ID>
export ALTITUDE_SECRET_KEY = <Your Client Secret>
```

## Get Bearer token

Once you have exported the variables mentioned above, use the following curl command to get a bearer token by hitting our OAuth endpoint:

```
curl --request POST --url "https://thgaltitude.eu.auth0.com/oauth/token" --header "content-type: application/x-www-form-urlencoded" --data "grant_type=client_credentials&client_id=$ALTITUDE_CLIENT_ID&client_secret=$ALTITUDE_CLIENT_SECRET&audience=https://api.platform.thgaltitude.com/"
```

In your terminal, export the following variable:

```sh
export BEARER_TOKEN = <Token you just got>
```

## Use the Altitude API

You can check our swagger docs (https://api.platform.thgaltitude.com/docs) to see the available endpoints and choose the endpoint of your interest.

Below is a demonstration of how you would hit the GET sites endpoint:

```
 curl -i --location 'https://api.platform.thgaltitude.com/v1/sites' --header "Authorization: Bearer $BEARER_TOKEN"
```

If you want to hit a POST endpoint, a few more headers are needed, and the parameters can be passed in the data object.

```
 curl -i --location 'https://api.platform.thgaltitude.com/<endpoint name from swagger docs>' --header 'Accept: application/json' --header 'Content-Type: application/json' --header "Authorization: Bearer $BEARER_TOKEN" --data '{"fieldName": "value"}'
```
