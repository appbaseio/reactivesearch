---
title: 'Implement Analytics'
meta_title: 'Implementing Appbase.io analytics - Core Concepts'
meta_description: 'A short guide on how to setup analytics and track search terms and queries.'
keywords:
    - concepts
    - appbase
    - analytics
    - implement
sidebar: 'docs'
---

In this page, you will learn about how to implement Appbase.io analytics for your stack and use-case.

### Prerequite: Deploying Appbase.io

Appbase.io Analytics requires a deployment of appbase.io alongside your ElasticSearch cluster. You can deploy appbase.io as:
1. A hosted offering: (Recommended) for a complete end-to-end managed experience. [Learn More](https://appbase.io/clusters/)
2. Deploy as a Docker image: Run anywhere, including with your Kubernetes ElasticSearch cluster. [Learn More](https://docs.appbase.io/docs/hosting/BYOC/#using-docker)
3. Amazon Machine Image (AMI): Deploy within your VPC alongside AWS ElasticSearch. [Learn More](https://docs.appbase.io/docs/hosting/BYOC/#using-ami)

![Diagram showing how appbase.io works with ElasticSearch](/images/byoc.png)


## How To Track Analytics

Appbase.io offers turnkey search analytics for ElasticSearch. No matter how your search is implemented today, it's easy to integrate analytics in a matter of minutes.


### With Appbase.io UI Libraries

 If you're already consuming any of the below libraries to build your search UI, then you don't need any additional setup. These libraries support a prop called `analytics` which when set to `true` enables the recording of search analytics. They also come with additional configs to track custom events. You can go to the specific library that you're using to learn more.

| Library                |  Variant    | Docs                                               |
| -------------------- | ----------  | -----------------------------------------------------------|
| **`ReactiveSearch`** | `React`     | [Learn More](/docs/reactivesearch/v3/advanced/analytics)    |
| **`ReactiveSearch`** | `Vue`       | [Learn More](/docs/reactivesearch/vue/advanced/analytics/)  |
| **`SearchBox`**      | `VanillaJS` | [Learn More](/docs/reactivesearch/searchbox/api/)  |
| **`SearchBox`**      | `React`     | [Learn More](/docs/reactivesearch/react-searchbox/apireference/)  |
| **`SearchBox`**      | `Vue`       | [Learn More](/docs/reactivesearch/vue-searchbox/apireference/)  |
| **`SearchBase`**     | `VanillaJS` | [Learn More](/docs/reactivesearch/searchbase/overview/apireference/)  |

### With any JavaScript
If you're not using any of the above search UI libraries or need more freedom to record clicks and conversions from any place in your application, then we recommend using [analytics.js](https://github.com/appbaseio/analytics). Analytics.js can be used to integrate Appbase.io analytics with any JavaScript based solution (client or server) and it covers all aspects of Appbase.io analytics from recording a search event to recording custom events and clicks. You can read more about it [here](https://github.com/appbaseio/analytics.js#api-reference).

### With REST API

Analytics REST APIs allow you to record search and click analytics from any platform (mobile, server-side) of your choice.

There are three types of analytics:

1. Search Analytics,
2. Click Analytics and
3. Conversion Analytics


<b>1. Search Analytics</b>

Use [PUT /:index/_analytics/search](https://arc-api.appbase.io/?version=latest#63470390-374f-447f-b854-70b5ab0fe92f) endpoint to record a search event.

```bash
curl --location --request PUT 'http://{{USERNAME}}:{{PASSWORD}}@{{CLUSTER_URL}}/{{INDEX}}/_analytics/search' \
--header 'Content-Type: application/json' \
--data-raw '{
	"query": "iphone",
	"user_id": "jon_snow",
	"event_data": {
		"platform": "mac"
	},
	"filters": {
		"year": "2018"
	},
	"hits": [{
	    "id": "12345678",
	    "source": {
	    	"title": "iphoneX"
	    },
	    "type": "_doc"
	}]
}'
```

API reference over [here](https://arc-api.appbase.io/?version=latest#63470390-374f-447f-b854-70b5ab0fe92f).

<b>2. Click Analytics</b>

Use [PUT /:index/_analytics/click](https://arc-api.appbase.io/?version=latest#df88a85a-c31d-4376-b22b-485a9d1021b8) endpoint to record a click event.

```bash
curl --location --request PUT 'http://{{USERNAME}}:{{PASSWORD}}@{{CLUSTER_URL}}/{{INDEX}}/_analytics/click' \
--header 'Content-Type: application/json' \
--data-raw '{
    "query_id": "89c14471-2df5-4414-8b17-33479ef71bc0",
    "click_type": "suggestion",
    "click_on": {
        "iphone_1234": 2
    },
    "user_id": "kuldeep-2",
    "event_data": {
        "user_segment": "paid"
    }
}'
```

API reference over [here](https://arc-api.appbase.io/?version=latest#df88a85a-c31d-4376-b22b-485a9d1021b8).

<b>3. Conversion Analytics</b>

Use [PUT /:index/_analytics/conversion](https://arc-api.appbase.io/?version=latest#f8ee22c6-ba15-4b9e-83d8-34cc2953f245) endpoint to record a conversion event.


```bash
curl --location --request PUT 'http://{{USERNAME}}:{{PASSWORD}}@{{CLUSTER_URL}}/{{INDEX}}/_analytics/conversion' \
--header 'Content-Type: application/json' \
--data-raw '{
    "query_id": "e3840c97-dd30-4696-8781-f355f40dd0f4",
    "conversion_on": [
        "iphone_1234"
    ],
    "event_data": {
        "user_segment_2": "free"
    }
}'
```

API reference over [here](https://arc-api.appbase.io/?version=latest#f8ee22c6-ba15-4b9e-83d8-34cc2953f245).

> Note:
>
> Recording custom events is available as an enterprise feature. You need to have at least `Production-I` plan or an `Arc Enterprise` plan to avail this.

### Appbase.io Apps

If you are using appbase.io apps (legacy), you can implement analytics in the following manner:

<b>Search Analytics</b>

When using the REST API to make a search query, you can pass along the following headers:

`X-Search-Query` -> The value here represents the search query term (the input value in DataSearch, CategorySearch if you are using ReactiveSearch).

Whenever an `X-Search-Query` header is passed, the API returns a response header for the search Id called as `X-Search-Id`. This can be passed further as a request header to associate other search attributes (filters, clicks) with the same original query. Think of `X-Search-Id` as a search session.

`X-Search-Id` -> An existing Id (aka search session) on which to apply the search query. This is returned as a response header by the backend for each search query.

`X-Search-Filters` -> This header should contain the value in the format: "key1=value1,key2=value2,..." where the key represents the filter component and value represents the selected value. (If the same filter has multiple values selected, they should be passed as "key1=value1,key1=value2,...").


<b>Click/Conversion Analytics</b>

There is a [POST /:app/\_analytics](https://rest.appbase.io/#fe48f095-2122-bacb-6574-d081448dd0f9) endpoint which can be used to record click analytics.

For example:

```bash
curl --location --request POST "https://scalr.api.appbase.io/{APP_NAME}/_analytics" \
    --header "X-Search-Id: replace-with-real-search-id" \
    --header "X-Search-Click: true" \
    --header "X-Search-ClickPosition: 5" \
    --header "X-Search-Conversion: true" \
    --header "Authorization: replace-with-basic-auth-credentials"
```

The above endpoints accept the following values as headers:

`X-Search-Click` -> value is of type true / false,

`X-Search-ClickPosition` -> value is of type Number (e.g. 1, 2 denoting the result item being clicked)

`X-Search-Conversion` -> value is of type true / false.


## Advanced Settings


### How to enable / disable Empty Query
By default, a library like ReactiveSearch shows you a set of results. even if the search hasn't been performed. Technically it calls the `match_all` query which can be considered as an empty query. By default, we record the analytics for empty queries too. You can find out about it in the Appbase.io dashboard with the `<empty_query>` key.

You can disable this behavior in `ReactiveSearch` by defining the `analyticsConfig` prop in the `ReactiveBase` and set the `emptyQuery` as `false`. If you're not using the `ReactiveSearch`, then just don't send the `X-Search-Query` header while performing a `match_all` query.

## How An Analytics Session Works

An analytics session is driven by the `X-Search-Query` header or `query` field if you're using the REST API. It is the user's responsibility to define the search query to trigger an analytics session. One analytics session can be considered as one search count.

Don't worry! `ReactiveSearch` handles this for you. You just need to set the `analytics` prop as `true` in the `ReactiveBase` component. [Read more about how to configure analytics in ReactiveSearch](/docs/reactivesearch/v3/advanced/analytics).

### How Are Searches Counted

- When a user types something in sequence, for example: `b→bo→boo→book`, we understand the context and instead of creating different search sessions, we count it as a search session with search key stored as `book`.
- By default, the search context is valid for up to `30s`. For example, `b→bo→boo...30 seconds...->book` will be recorded as two different searches with keys as `boo` & `book`.
