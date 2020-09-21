---
title: 'SearchBase API Reference'
meta_title: 'API Reference for SearchBase'
meta_description: 'React SearchBox is a lightweight library that provides scaffolding to create search experiences powered by Elasticsearch.'
keywords:
    - apireference
    - searchbase
    - elasticsearch
    - search library
sidebar: 'docs'
nestedSidebar: 'react-searchbox-reactivesearch'
---

## SearchBase

It is a container component that wraps all the ReactiveSearch components together. It binds the backend app (data source) with the UI view components
(elements wrapped within ReactiveBase), allowing a UI component to be reactively updated every time there is a change in the data source or in other UI components.

### Props

#### To configure the Appbase environments

-   **index** `string` [required]
    refers to an `index` if you’re using your own Elasticsearch cluster. If you're using an appbase.io hosted cluster, then the cluster name can be used.

    > Note: Multiple indexes can be connected to by specifying comma separated index names.

-   **url** `string` [required]
    URL for the Elasticsearch cluster. Defaults to `https://scalr.api.appbase.io`

-   **credentials** `string` [optional]
    Basic auth credentials for authentication purposes. It should be a string of the format `username:password`.
    If you are using an appbase.io app, you will find credentials under your [API credentials page](https://dashboard.appbase.io/app?view=credentials). If you are not using an appbase.io app, credentials may not be necessary - although having an open access to your Elasticsearch cluster is not recommended.

-   **appbaseConfig** `Object` [optional]
    This allows you to customize the analytics experience when appbase.io is used as a backend. It accepts an object which has the following properties:

    -   **recordAnalytics** Boolean allows recording search analytics (and click analytics) when set to true and appbase.io is used as a backend. Defaults to false.

    -   **enableQueryRules** Boolean If false, then appbase.io will not apply the query rules on the search requests. Defaults to true.

    -   **userId** String It allows you to define the user id to be used to record the appbase.io analytics. Defaults to the client's IP address.

    -   **customEvents** Object It allows you to set the custom events which can be used to build your own analytics on top of appbase.io analytics. Further, these events can be used to filter the analytics stats from the appbase.io dashboard.

#### To customize the query execution

-   **headers** `Object` [optional] set custom headers to be sent with each server request as key/value pairs.

-   **transformRequest** `Function` Enables transformation of network request before
    execution. This function will give you the request object as the param and expect an updated request in return, for execution.

    ```js
    const component = new Component({
    	index: 'gitxplore-app',
    	url: 'https://@arc-cluster-appbase-demo-6pjy6z.searchbase.io',
    	credentials: 'a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61',
    	transformRequest: request =>
    		Promise.resolve({
    			...request,
    			credentials: include,
    		}),
    });
    ```

-   **transformResponse** `Function` Enables transformation of search network response before  
    rendering them. It is an asynchronous function which will accept an Elasticsearch response object as param and is expected to return an updated response as the return value.

    ```js
    const component = new Component({
    	index: 'gitxplore-app',
    	url: 'https://@arc-cluster-appbase-demo-6pjy6z.searchbase.io',
    	credentials: 'a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61',
    	transformResponse: async elasticsearchResponse => {
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
    	},
    });
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
