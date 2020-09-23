---
title: 'SearchBase API Reference'
meta_title: 'API Reference for SearchBase'
meta_description: 'SearchBase is a provider component that provides the search context to the child components.'
keywords:
    - apireference
    - searchbase
    - elasticsearch
    - search library
sidebar: 'docs'
nestedSidebar: 'vue-searchbox-reactivesearch'
---

## How does it work?

`SearchBase` is a provider component that provides the [SearchBase](/docs/reactivesearch/searchbase/overview/QuickStart/) context to the child components. It binds the backend app (data source) with the UI view components (elements wrapped within SearchBase), allowing a UI component to be reactively updated every time there is a change in the data source or in other UI components.

## Props

### To configure the Appbase environments

-   **index** `string` [required]
    Refers to an index of the Elasticsearch cluster.

    `Note:` Multiple indexes can be connected to by specifying comma-separated index names.

-   **url** `string` [required]
    URL for the Elasticsearch cluster

-   **credentials** `string` [required]
    Basic Auth credentials if required for authentication purposes. It should be a string of the format `username:password`. If you are using an appbase.io cluster, you will find credentials under the `Security > API credentials` section of the appbase.io dashboard. If you are not using an appbase.io cluster, credentials may not be necessary - although having open access to your Elasticsearch cluster is not recommended.

-   **appbaseConfig** `Object`
    allows you to customize the analytics experience when appbase.io is used as a backend. It accepts an object which has the following properties:

    -   **recordAnalytics** `boolean` allows recording search analytics (and click analytics) when set to `true` and appbase.io is used as a backend. Defaults to `false`.
    -   **enableQueryRules** `boolean` If `false`, then appbase.io will not apply the query rules on the search requests. Defaults to `true`.
    -   **userId** `string` It allows you to define the user id to be used to record the appbase.io analytics. Defaults to the client's IP address.
    -   **customEvents** `Object` It allows you to set the custom events which can be used to build your own analytics on top of appbase.io analytics. Further, these events can be used to filter the analytics stats from the appbase.io dashboard.

### To customize the query execution

-   **headers** `Object` [optional] set custom headers to be sent with each server request as key/value pairs.

-   **transformRequest** `Function` Enables transformation of network request before
    execution. This function will give you the request object as the param and expect an updated request in return, for execution.

```html
<template>
    <search-base
        index="gitxplore-app"
        url="https://@arc-cluster-appbase-demo-6pjy6z.searchbase.io"
        credentials="a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61"
        :transformRequest="transformRequest"
    />
</template>
<script>
export default {
    name: "App",
    methods: {
        transformRequest(elasticsearchResponse) {
            return Promise.resolve({
                ...request,
                credentials: include,
            })
        }
    }
}
</script>
```

-   **transformResponse** `Function` Enables transformation of search network response before  
    rendering them. It is an asynchronous function which will accept an Elasticsearch response object as param and is expected to return an updated response as the return value.

```html
<template>
    <search-base
        index="gitxplore-app"
        url="https://@arc-cluster-appbase-demo-6pjy6z.searchbase.io"
        credentials="a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61"
        :transformResponse="transformResponse"
    />
</template>
<script>
export default {
    name: "App",
    methods: {
        async transformResponse(elasticsearchResponse) {
            const ids = elasticsearchResponse.hits.hits.map(item => item._id);
            const extraInformation = await getExtraInformation(ids);
            const hits = elasticsearchResponse.hits.hits.map(item => {
                const extraInformationItem = extraInformation.find(
                    otherItem => otherItem._id === item._id,
                );
                return {
                    ...item,
                    ...extraInformationItem,
                };
            });

            return {
                ...elasticsearchResponse,
                hits: {
                    ...elasticsearchResponse.hits,
                    hits,
                },
            };
        }
    }
}
</script>
```

> Note: transformResponse function is expected to return data in the following structure.

```javascript
{
    // Elasticsearch hits response
    hits: {
        hits: [...],
        total: 100
    },
    // Elasticsearch aggregations response
    aggregations: {

    }
    took: 1
}
```

## Advanced Usage
 Although, `vue-searchbox` API should be enough to build the powerful search UIs but if you need to access the [SearchComponent](docs/reactivesearch/searchbase/overview/searchcomponent/) instance for a particular component id for more advanced use-cases then you can access it with the help of vue JS' `inject` API.

 ```html
 <script>
  export default {
     name: "App",
     inject: ['searchbase'],
     render() {
         console.log("component instance", this.searchbase.getComponent('component-id'))
         return null
     }
 }
 </script>
 ```
