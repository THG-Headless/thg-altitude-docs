---
title: Big Query Logging
---

## Introduction

Altitude Platform enables users to link an environment to a self-owned BigQuery logging table. Currently the feature only allows one BigQuery configuration per environment. However, multiple environments can be configured to the same BigQuery table.

![Altitude Big Query configuration list](/statics/screenshots/bq_logging/bq_configurations_list.png)

## Setting up your BigQuery configuration

In order to link an environment to a BigQuery table, the table must already exist in BigQuery prior to setting up the configuration in Altitude.

After creating a table in BigQuery, navigate to your site on Altitude Platform and click on the `BQ Logging` tab. Once on the Big Query Logging configuration page, click `Create New Configuration`. The process of linking an environment to your BigQuery table has begun.

![Create new configuration](/statics/screenshots/bq_logging/create_new_configuration.png)

Here you select which environment you would like to associate your BigQuery table with.

![Select an Environment](/statics/screenshots/bq_logging/environment_select.png)

After selecting the environment, you can input your BigQuery table configuration. The required configuration information can be found in the following table.

| Parameter  | Description                                                                                                                                                                                    |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ProjectId  | This is the ID of the Google Cloud Platform project                                                                                                                                            |
| Dataset    | This is the top-level container in the Google Cloud Platform project that manages your tables                                                                                                  |
| Table Name | This is the name of the BigQuery table being configured to an environment                                                                                                                      |
| Headers    | This is a list of objects containing the column name, header name, and default value. This is an optional field. Find more information in the `Configure custom column headers` section below. |
| Email      | This is the email a service account with write access to your BigQuery dataset.                                                                                                                |
| Secret Key | This is the secret key associated with a service account with write access to your BigQuery table                                                                                              |

![Create new configuration form](/statics/screenshots/bq_logging/create_configuration_form.png)

### Default Altitude table columns

When creating the table in BigQuery, the Altitude platform columns will need to be added. These column names and types are [here](/statics/bq_schema.json)

### Configure custom column headers

In addition to the default Altitude BigQuery headers, the table can also be include custom columns. As well as including these custom columns at table creation, they also need to be defined when creating the table link in Altitude Platform.

![Add custom headers](/statics/screenshots/bq_logging/custom_headers.png)

When adding these custom column headers to Altitude Platform, 3 key values need to be provided:

| Value         | Description                                                                                  |
| ------------- | -------------------------------------------------------------------------------------------- |
| Column Name   | This is the name of the custom column as defined in the BigQuery table                       |
| Header Name   | This is the header on the request, cookie or response where the column data can be found     |
| Default Value | Default value is the value which will be presented in the table if the header is not present |

If creating the BigQuery table link in the UI, location will also need to be inputted. This references where the header can be found: on the request, response or on the incoming cookie.

If creating the BigQuery table link in the API, location can be defined by including `request.` or `cookie.` to your header name. If this is not present, Altitude will default to looking for the header on the response.
