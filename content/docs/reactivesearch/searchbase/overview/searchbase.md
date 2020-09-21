---
title: 'SearchBase'
meta_title: 'API Reference for SearchBase class'
meta_description: 'SearchBase class holds the state for all the active search components and establishes an ability to connect them reactively.'
keywords:
    - apireference
    - searchbase
    - elasticsearch
    - search library
sidebar: 'docs'
nestedSidebar: 'searchbase-reactivesearch'
---

## How does it work?

The `SearchBase` class holds the state for all the active components and can be used to provide the global configuration to the registered components, it serves the following tasks:

-   To `register` a component by unique `id`
-   To `unregister` a component by `id`
-   To retrieve the instance of the `SearchComponent` class by `id`
-   To provide an ability to define the watch registered components reactively with the help of the `react` prop

> Note:
>
> 1. The `id` property is a unique identifier to each search component.
> 2. The `SearchBase` class is useful when you're using multiple components that depend on each other. For example, a filter component (to display the category options) depends on the search query (search component).
>    If you're only using a single component then [SearchComponent](docs/reactivesearch/searchbase/overview/searchcomponent/) class should work well.

## Constructor

The constructor of `SearchBase` is called with the following properties:

```js
const searchbase = new SearchBase(properties);
```

### Properties

#### Configure appbase.io environment

The following properties can be used to configure appbase.io environment globally, i.e. for all registered components. You can also configure these properties for each [Component](docs/reactivesearch/searchbase/overview/component/) as well.

-   **index** `string` [Required]
    Refers to an index of Elasticsearch cluster.

    `Note:` Multiple indexes can be connected to by specifying comma-separated index names.

-   **url** `string` [Required]
    URL for the Elasticsearch cluster

-   **credentials** `string` [Required]
    Basic Auth credentials if required for authentication purposes. It should be a string of the format `username:password`. If you are using an appbase.io cluster, you will find credentials under the `Security > API credentials` section of the appbase.io dashboard. If you are not using an appbase.io cluster, credentials may not be necessary - although having open access to your Elasticsearch cluster is not recommended.

-   **appbaseConfig** `Object` [optional]
    allows you to customize the analytics experience when appbase.io is used as a backend. It accepts an object which has the following properties:

    -   **recordAnalytics** `Boolean` allows recording search analytics (and click analytics) when set to `true` and appbase.io is used as a backend. Defaults to `false`.
    -   **enableQueryRules** `Boolean` If `false`, then appbase.io will not apply the query rules on the search requests. Defaults to `true`.
    -   **userId** `String` It allows you to define the user id to be used to record the appbase.io analytics. Defaults to the client's IP address.
    -   **customEvents** `Object` It allows you to set the custom events which can be used to build your own analytics on top of appbase.io analytics. Further, these events can be used to filter the analytics stats from the appbase.io dashboard.

#### To customize the query execution

The following properties can be used to customize the query execution globally. It is also possible to configure those properties for each [SearchComponent](docs/reactivesearch/searchbase/overview/searchcomponent/) too.

-   **headers** `Object`
    set custom headers to be sent with each server request as key/value pairs. For example:

```ts
const searchbase = new SearchBase({
	index: 'gitxplore-app',
	url: 'https://@arc-cluster-appbase-demo-6pjy6z.searchbase.io',
	credentials: 'a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61',
	headers: {
		secret: 'searchbase-is-awesome',
	},
});
```

-   **transformRequest** `(requestOptions: Object) => Promise<Object>`
    Enables transformation of network request before execution. This function will give you the request object as the param and expect an updated request in return, for execution.<br/>
    For example, we will add the `credentials` property in the request using `transformRequest`.
    ```js
    const searchbase = new SearchBase({
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
-   **transformResponse** `(response: any) => Promise<any>`
    Enables transformation of search network response before rendering it. It is an asynchronous function which will accept an Elasticsearch response object as param and is expected to return an updated response as the return value.<br/>
    For example:

```js
const searchbase = new SearchBase({
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

> Note
>
> `transformResponse` function is expected to return data in the following structure.

```json
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

### An example with all properties

```js
const searchbase = new SearchBase({
    index: "gitxplore-app",
    url: "https://@arc-cluster-appbase-demo-6pjy6z.searchbase.io",
    credentials: "a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61",
    appbaseConfig: {
        recordAnalytics: true,
        enableQueryRules: true,
        userId: 'jon@appbase.io',
        customEvents: {
            platform: "ios",
            device: "iphoneX"
        }
    },
    headers: {
        secret: "searchbase-is-awesome",
    },
    transformRequest: (request) => Promise.resolve({
        ...request,
        credentials: "true"
    }),
    transformResponse: response => Promise.resolve({
        ...response,
        hits: {
            ...response.hits,
            hits: [
                {
                    _id: "promoted",
                    _source: {
                        original_title: "Harry potter and the cursed child"
                    }
                },
                ...response.hits
            ]
        }
    }),
)}
```

### Methods

#### register

```ts
register(id: string, component: SearchComponent | Object): SearchComponent
```

This method can be used to register a search component with a unique `id`. It returns the instance of the [SearchComponent](docs/reactivesearch/searchbase/overview/searchcomponent/) class for that particular search component. The second param can be an instance of the [SearchComponent](docs/reactivesearch/searchbase/overview/searchcomponent/) class or an object to configure the properties of the [SearchComponent](docs/reactivesearch/searchbase/overview/searchcomponent/) class.

The following example registers a component with the second param as an object

```ts
const searchBase = new SearchBase({
	index: 'gitxplore-app',
	url: 'https://@arc-cluster-appbase-demo-6pjy6z.searchbase.io',
	credentials: 'a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61',
});

searchBase.register('search-component', {
	dataField: ['title', 'description'],
	value: '',
});
```

The following example registers a component with second param as an instance of [SearchComponent](docs/reactivesearch/searchbase/overview/searchcomponent/) class.

```ts
const searchBase = new SearchBase({
	index: 'gitxplore-app',
	url: 'https://@arc-cluster-appbase-demo-6pjy6z.searchbase.io',
	credentials: 'a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61',
});

const searchComponent = new SearchComponent({
	id: 'search-component',
	index: 'gitxplore-app',
	url: 'https://@arc-cluster-appbase-demo-6pjy6z.searchbase.io',
	credentials: 'a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61',
	dataField: ['title', 'description'],
	value: '',
});

searchBase.register('search-component', searchComponent);
```

Additionally, you can override the global configurations by defining it for a particular component. For example, to register a component with a different `index` name.

```ts
const searchBase = new SearchBase({
	index: 'gitxplore-app',
	url: 'https://@arc-cluster-appbase-demo-6pjy6z.searchbase.io',
	credentials: 'a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61',
});

searchBase.register('search-component', {
    index: 'gitxplore-app-2',
	dataField: ['title', 'description'],
	value: '',
});
```

#### unregister

```ts
unregister(id: string): void
```

This method is useful to unregister a component by `id`. It is a good practice to unregister (remove) an unmounted/unused component to avoid any side-effects.

#### getComponent

```ts
getComponent(id: string): SearchComponent
```

This method can be used to retrieve the instance of the [SearchComponent](docs/reactivesearch/searchbase/overview/searchcomponent/) class for a particular component by `id`.

#### getComponents

```ts
getComponents(): { [key: string]: SearchComponent }
```

This method returns all the active components registered on the `SearchBase` instance. The components state can be used for various purposes, for example, to display the selected filters in the UI.
