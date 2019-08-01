---
title: 'ReactiveBase'
meta_title: 'ReactiveBase'
meta_description: 'Reactivebase is a container component that wraps all the `ReactiveSearch` components together.'
keywords:
    - reactivesearch-native
    - reactivebase
    - appbase
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'native-reactivesearch'
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
    app name as it appears on the dashboard.
-   **credentials** `String` [optional]
    app credentials as they appear on the dashboard. It should be a string of the format "username:password" and is used for authenticating the app. If you are not using an appbase.io app, credentials may not be necessary - although having an open-access Elasticsearch cluster is not recommended.
-   **url** `String` [optional]
    URL where Elasticsearch cluster is hosted, only needed if your app uses a non appbase.io URL.
-   **type** `String` [optional]
    types on which the queries should run on. Multiple types can be passed as comma separated values. The default behavior here is to search on all the app types.
-   **theming** `Object` [optional]
    allows over-writing of default styles by providing the respective key/values. You can read more about its usage [here](https://opensource.appbase.io/reactive-manual/native/advanced/theming.html).

### Connect to Elasticsearch

> Note
>
> An app within ReactiveSearch’s context refers to an index in Elasticsearch.

ReactiveSearch works out of the box with an Elasticsearch index hosted anywhere. You can use the `url` prop of the **ReactiveBase** component to connect the child ReactiveSearch components to your own index. For example,

```js
<ReactiveBase
  app="appname"
  url="http://your-elasticsearch-index"
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

Once you have added the **ReactiveBase** component, you can get started with adding [other components](/components/) as its children.

You can read more about when to use which components in the overview guide [here](/getting-started/componentsindex.html).
