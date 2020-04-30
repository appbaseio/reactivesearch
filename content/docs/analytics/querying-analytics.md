---
title: 'Querying Analytics'
meta_title: 'Querying Analytics - Core Concepts'
meta_description: 'A short guide on how to query and use the Appbase.io analytics API.'
keywords:
    - concepts
    - appbase
    - analytics
    - implement
    - query
    - suggestions
sidebar: 'docs'
---

Now that you have implemented analytics for tracking all the metrics that matter to you, appbase.io is ready to provide analytics insights into your data. Appbase.io analytics appear on the dashboard instantly.


## Query via Dashboard

You can access all the analytics data from the Analytics section of the Appbase.io Dashboard. Analytics GUI allows you to view and download all the metrics in a `JSON` or `CSV` format. Furthermore, if you have recorded custom event data, then you can filter by those as well.

## Query via APIs

While analytics data is readily accessible from the dashboard, it's also possible to use our REST APIs to embed analytics into your own apps.

You can see the API reference over [here](https://arc-api.appbase.io/?version=latest#fa69cbac-143b-4ce1-881b-c8287ac48d37).

> Note:
>
> Querying via APIs is available for users that have at least `Production-I` plan or an `Arc Enterprise`.

### An Example Query Endpoint

The below endpoint returns a list of popular searches.

```bash
curl --location --request GET 'http://{{USERNAME}}:{{PASSWORD}}@{{CLUSTER_URL}}/_analytics/popular-searches'
```

### An Example Query With Filtering Applied

You can use the custom events as a query param to filter out the analytics APIs. <br/>
Let's check the below example to get the `popular searches` filtered by a custom event named `platform` having value as `android`.

```bash
curl --location --request GET "http://{{USERNAME}}:{{PASSWORD}}@{{CLUSTER_URL}}/_analytics/popular-searches?platform=android"
```

It's simple as this to make the most of appbase.io analytics.
