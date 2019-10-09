---
title: 'Implement Analytics'
meta_title: 'Implementing Appbase analytics - Core Concepts'
meta_description: 'A short guide on how to setup analytics and track search terms and queries.'
keywords:
    - concepts
    - appbase
    - analytics
    - implement
sidebar: 'docs'
---

## Usage with ReactiveSearch
If you are using **ReactiveSearch** library for building your search UIs, then all you have to do is set the `analytics` prop in the `<ReactiveBase>` component.

This will start auto-recording search analytics. You can see how to set the click analytics in the [reactive manual docs](https://opensource.appbase.io/reactive-manual/advanced/analytics.html).

## Analytics via API

If you intend to build your own search UI, here's how you can implement analytics on your own. There are two types of analytics:

1. Search Analytics and
2. Click Analytics.

### Search Analytics

When using the REST API to make a search query, you can pass along the following headers:

`X-Search-Query` -> The value here represents the search query term (the input value in DataSearch, CategorySearch if you are using ReactiveSearch).

Whenever an `X-Search-Query` header is passed, the API returns a response header for the search Id called as `X-Search-Id`. This can be passed further as a request header to associate other search attributes (filters, clicks) with the same original query. Think of `X-Search-Id` as a search session.

`X-Search-Id` -> An existing Id (aka search session) on which to apply the search query on. This is returned as a response header by the backend for each search query.

`X-Search-Filters` -> This header should contain the value in the format: "key1=value1,key2=value2,..." where the key represents the filter component and value represents the selected value. (If the same filter has multiple values selected, they should be passed as "key1=value1,key1=value2,...").

### Click Analytics

Typically, click analytics are recorded when a user clicks on a result item on the search page or triggers a conversion event (like buying the item found via search results).

#### Hosted [appbase.io](http://appbase.io)
There is a [POST /:app/\_analytics](https://rest.appbase.io/#fe48f095-2122-bacb-6574-d081448dd0f9) endpoint which can be used to record click analytics.

For example:
```
curl --location --request POST "https://scalr.api.appbase.io/{{APP_NAME}}/_analytics" \
  --header "X-Search-Id: {{SEARCH_ID}} \
  --header "X-Search-Click: true" \
  --header "X-Search-ClickPosition: 5" \
  --header "X-Search-Conversion: true" \
  --header "Authorization: {{APP_CREDENTIALS}}"
```
#### Clusters or via Arc
If you're using [appbase.io](http://appbase.io) clusters or `Arc` then you just need to change the URL to your cluster/Arc URL.<br/>
Check the API docs [here](https://arc-api.appbase.io/?version=latest#ca047056-d009-414b-915a-1bc290134490).

For example:
```
curl --location --request POST "http://{{USERNAME}}:{{PASSWORD}}@{{CLUSTER_URL}}/{{INDEX}}/_analytics" \
  --header "X-Search-Id: {{SEARCH_ID}}" \
  --header "X-Search-Click: true" \
  --header "X-Search-ClickPosition: 5" \
  --header "X-Search-Conversion: true"
```

The above endpoints accept the following values as headers:
`X-Search-Click` -> value is of type true / false,

`X-Search-ClickPosition` -> value is of type Number (e.g. 1, 2 denoting the result item being clicked)

`X-Search-Conversion` -> value is of type true / false.

Since these events record what happens after a search query is fired, they should also be accompanied by an `X-Search-Id` header.

## Advanced Analytics
### How to implement custom events
Apart from the pre-defined search headers you can also set custom events with the help of `X-Search-CustomEvent` header. Custom events allow you to build your own analytics on top of the appbase.io analytics.<br/>
For example, you might be interested to know the platform used by a user to make the search request.<br/>
There can be plenty of scenarios, the choice is yours that how you want to use it.

`X-Search-CustomEvent` -> It accepts the value in the following format: "key1=value1,key2=value2,..." where key represents the event name and value represents the event value.<br/>
For e.g `X-Search-CustomEvent="platform=android"`

### How to filter using custom events
You can use the custom events as a query param to filter out the analytics APIs. <br/>
Let's check the below example to get the `popular searches` filtered by the custom event named `platform` having value as `android`.
```
curl --location --request GET "http://{{USERNAME}}:{{PASSWORD}}@{{CLUSTER_URL}}/_analytics/popular-searches?platform=android"
```

### How to enable / disable Empty Query
By default, the ReactiveSearch shows you the default UI even if the search hasn't been performed. Technically it calls the `match_all` query which can be considered as the empty query. By default we record the analytics for empty queries too, you can find it out in the Appbase.io dashboard with the `<empty_query>` key.<br/>
You can disable this behavior in `ReactiveSearch` by defining the `analyticsConfig` prop in the `ReactiveBase` and set the `emptyQuery` as `false`. 
If you're not using the `ReactiveSearch` then just don't send the `X-Search-Query` header while performing a `match_all` request.

### How An Analytics Session Works
An analytics session is driven by the `X-Search-Query` header, it's the user's responsibility to set this header to trigger an analytics session. One analytics session can be considered as one search count.<br/>
Don't worry `ReactiveSearch` handles it for you, just you need to set the `analytics` prop as `true` in the `ReactiveBase` component.

#### How we count searches
- When a user types something equals to `b→bo→boo→book`, we understand the context and instead of creating the different search sessions we count it as one search with key as `book`.
- A search context is only valid for a maximum of the `30s` i.e `b→bo→boo...30 seconds...->book` will be recorded as two different searches with keys as `boo` & `book`.