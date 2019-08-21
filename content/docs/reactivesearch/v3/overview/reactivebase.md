---
title: 'ReactiveBase'
meta_title: 'ReactiveBase'
meta_description: 'ReactiveMaps is a complimentary library to ReactiveSearch.'
keywords:
    - reactivesearch
    - reactivebase
    - appbase
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'web-reactivesearch'
---

**ReactiveBase** is a container component that wraps all the `ReactiveSearch` components together. It binds the backend app (data source) with the UI view components (elements wrapped within ReactiveBase), allowing a UI component to be reactively updated every time there is a change in the data source or in other UI components.

This is the first component you will need to add when using `ReactiveSearch`.

### Usage

```js
<ReactiveBase
  app="appname"
  credentials="abcdef123:abcdef12-ab12-ab12-ab12-abcdef123456"
>
    <Component1 .. />
    <Component2 .. />
</ReactiveBase>
```

### Props

-   **app** `String`
    app name as it appears on the dashboard. Refers to an index if you're using your own Elasticsearch cluster. (Multiple indexes can be connected to by specifiying comma separated index names)
-   **type** `String` [optional]
    types on which the queries should run on. Multiple types can be passed as comma separated values. The default behavior here is to search on all the app types.
-   **credentials** `String` [optional]
    app credentials as they appear on the dashboard. It should be a string of the format "username:password" and is used for authenticating the app. If you are not using an appbase.io app, credentials may not be necessary - although having an open-access Elasticsearch cluster is not recommended.
-   **url** `String` [optional]
    URL where Elasticsearch cluster is hosted, only needed if your app uses a non appbase.io URL.
-   **headers** `Object` [optional]
    set custom headers to be sent with each server request as key/value pairs. For example:

```js{4-6}
<ReactiveBase
  app="appname"
  credentials="abcdef123:abcdef12-ab12-ab12-ab12-abcdef123456"
  headers={{
      secret: 'reactivesearch-is-awesome'
  }}
>
    <Component1 .. />
    <Component2 .. />
</ReactiveBase>
```

-   **analytics** `Boolean` [optional]
    allows recording search analytics (and click analytics) when set to `true` and appbase.io is used as a backend. Defaults to `false`. Check the [analytics recipe](/advanced/analytics.html) for click analytics implementation.
-   **as** `String` [optional]
    allows to use the custom html element tag, defaults to `div`.
-   **searchStateHeader** `Boolean` [optional]
    Defaults to `false`. Allows recording some **advanced** search analytics (and click analytics) when set to `true` and appbase.io is used as a backend.
    > Note:
    >
    > You must use the react version >= 16.6 to make it work with click analytics.
-   **theme** `Object` [optional]
    allows over-writing of default styles by providing the respective key/values. You can read more about its usage [here](/theming/themes.html)
-   **themePreset** `String` [optional]
    allows over-writing of default styles by providing a preset value. Supported values are `light` (default) and `dark`. You can read more about its usage [here](/theming/themes.html)
-   **getSearchParams** `Function` [optional]
    Enables you to customise the evaluation of query-params-string from the url (or) any other source. If this function is not set, the library will use `window.location.search` as the search query-params-string for parsing selected-values. This can come handy if the URL is using hash values.
-   **setSearchParams** `Function` [optional]
    Enables you to customise setting of the query params string in the url by providing the updated query-params-string as the function parameter. If this function is not set, the library will set the `window.history` via `pushState` method.
-   **transformRequest** `Function` [optional]
    Enables transformation of network request before execution. This function will give you the the request object as the param and expect an updated request in return, for execution. Note that this is an experimental API and will likely change in the future.
-   **graphQLUrl** `String` [optional]
    Allows user to query from GraphqQL server instead of `ElasticSearch` REST api. [graphql-compose-elasticsearch](https://github.com/graphql-compose/graphql-compose-elasticsearch) helps in transforming `GraphQL` queries into `ElasticSearch` rest api. Here is an example of `GraphQL` server which acts as proxy for `ElasticSearch`.
    -   [GraphQL Server for books application](https://github.com/appbaseio-apps/graphql-elasticsearch-server)
-   **tranformResponse** `Function` [optional]
    Enables transformation of search network response before rendering them. This asynchronous function will give you elasticsearch response object and componentId as params and expects an updated response in return in similar structure of elasticsearch. You can use `componentId` to conditionally tranform response for particular reactivesearch component only.

```js{7-34}
    <ReactiveBase
        app="appname"
        credentials="abcdef123:abcdef12-ab12-ab12-ab12-abcdef123456"
        headers={{
            secret: 'reactivesearch-is-awesome'
        }}
        transformResponse={async (elasticsearchResponse, componentId) => (
            const ids = elasticsearchResponse.responses[0].hits.hits.map(
                item => item._id
            );
            const extraInformation = await getExatraInformation(ids);
            const hits = elasticsearchResponse.responses[0].hits.hits.map(
                (item) => {
                    const extraInformationItem = extraInformation.find(
                        otherItem => otherItem._id === item._id
                    );
                    return {
                        ...item,
                        ...extraInformationItem
                    };
                }
            );

            return {
                response: [
                    {
                        ...elasticsearchResponse.responses[0],
                        hits: {
                            ...elasticsearchResponse.responses[0].hits,
                            hits
                        }
                    }
                ]
            };
        )}
    >
        <Component1 .. />
        <Component2 .. />
    </ReactiveBase>
```

> Note
>
> `transformResponse` function is expected to return data in following structure.

```json
{
    response: [
        {
            hits: {
                hits: [...],
                total: 100
            },
            took: 1
        }
    ]
}
```

### Connect to Elasticsearch

> Note
>
> An **app** within ReactiveSearch's context refers to an **index** in Elasticsearch.

ReactiveSearch works out of the box with an Elasticsearch index hosted anywhere. You can use the `url` prop of the **ReactiveBase** component to connect the child ReactiveSearch components to your own index. For example,

```jsx
<ReactiveBase
  app="your-elasticsearch-index"
  url="http://your-elasticsearch-cluster"
>
    <Component1 .. />
    <Component2 .. />
</ReactiveBase>
```

It's also possible to secure your Elasticsearch cluster's access with a middleware proxy server that is connected to ReactiveSearch. This allows you to set up custom authorization rules, prevent misuse, only pass back non-sensitive data, etc. Here's an example app where we show this using a Node.JS / Express middleware:

-   [Proxy Server](https://github.com/appbaseio-apps/reactivesearch-proxy-server)
-   [Proxy Client](https://github.com/appbaseio-apps/reactivesearch-proxy-client)

> Note
>
> If you are using the **url** prop for an Elasticsearch cluster, ensure that your ReactiveSearch app can access the cluster. Typically, you will need to configure CORS in **elasticsearch.yml** to enable access.

```yaml
http.cors.enabled: true
http.cors.allow-credentials: true
http.cors.allow-origin: 'http://reactive-search-app-domain.com:port'
http.cors.allow-headers: X-Requested-With, X-Auth-Token, Content-Type, Content-Length, Authorization, Access-Control-Allow-Headers, Accept
```

> Note
>
> If you are using Elasticsearch on AWS, then the recommended approach is to connect via the middleware proxy as they don't allow setting the Elasticsearch configurations.

### Next Steps

Once you have added the **ReactiveBase** component, you can get started with adding other components as its children.

-   List specific components can be found [here](/docs/reactivesearch/v3/list/singlelist/).
-   Range specific components can be found [here](/docs/reactivesearch/v3/range/singlerange/).
-   Search specific components can be found [here](/docs/reactivesearch/v3/search/datasearch/).
-   Result specific components can be found
    [here](/docs/reactivesearch/v3/result/reactivelist/).

You can read more about when to use which components in the overview guide [here](/docs/reactivesearch/v3/overview/components/).
