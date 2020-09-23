---
title: 'SearchComponent class'
meta_title: 'API Reference for SearchComponent class'
meta_description: 'SearchComponent class represents the properties/methods for a search component.'
keywords:
    - apireference
    - searchbase
    - elasticsearch
    - search library
sidebar: 'docs'
nestedSidebar: 'searchbase-reactivesearch'
---

## How does it work?

The `SearchComponent` class represents a search component that can be used to build different kinds of search components for examples,

-   a category filter component,
-   a search bar component,
-   a price range component,
-   a location filter component,
-   a component to render the search results etc.

## Constructor

The constructor of the `SearchComponent` class is called with the following properties:

```js
const searchComponent = new SearchComponent(properties);
```

### Properties

#### Configure appbase.io environment

-   **index** `string` [Required]
    Refers to an index of the Elasticsearch cluster.

    `Note:` Multiple indexes can be connected to by specifying comma-separated index names.

-   **url** `string` [Required]
    URL for the Elasticsearch cluster

-   **credentials** `string` [Required]
    Basic Auth credentials if required for authentication purposes. It should be a string of the format `username:password`. If you are using an appbase.io cluster, you will find credentials under the `Security > API credentials` section of the appbase.io dashboard. If you are not using an appbase.io cluster, credentials may not be necessary - although having open access to your Elasticsearch cluster is not recommended.

-   **appbaseConfig** `Object`
    allows you to customize the analytics experience when appbase.io is used as a backend. It accepts an object which has the following properties:

    -   **recordAnalytics** `boolean` allows recording search analytics (and click analytics) when set to `true` and appbase.io is used as a backend. Defaults to `false`.
    -   **enableQueryRules** `boolean` If `false`, then appbase.io will not apply the query rules on the search requests. Defaults to `true`.
    -   **userId** `string` It allows you to define the user id to be used to record the appbase.io analytics. Defaults to the client's IP address.
    -   **customEvents** `Object` It allows you to set the custom events which can be used to build your own analytics on top of appbase.io analytics. Further, these events can be used to filter the analytics stats from the appbase.io dashboard.

#### To configure the ReactiveSearch API

The following properties can be used to configure the appbase.io [ReactiveSearch API](/docs/search/reactivesearch-api/):

-   **id** `string` [Required]
    unique identifier of the component, can be referenced in other components' `react` prop.

-   **type** `string`
    This property represents the type of the query which is defaults to `search`, valid values are `search`, `term`, `range` & `geo`. You can read more [here](/docs/search/reactivesearch-api/implement/#type-of-queries).

-   **dataField** `string | Array<string | DataField>`
    index field(s) to be connected to the component’s UI view. DataSearch accepts an `Array` in addition to `string`, which is useful for searching across multiple fields with or without field weights.<br/>
    Field weights allow weighted search for the index fields. A higher number implies a higher relevance weight for the corresponding field in the search results.<br/>
    You can define the `dataField` property as an array of objects of the `DataField` type to set the field weights.<br/>
    The `DataField` type has the following shape:

    ```ts
    type DataField = {
    	field: string;
    	weight: number;
    };
    ```

-   **value** `any`
    Represents the value for a particular query [type](/docs/search/reactivesearch-api/reference/#type). Depending on the query type, the value format would differ. You can refer to the different value formats over [here](/docs/search/reactivesearch-api/reference/#value).

-   **queryFormat** `string`
    Sets the query format, can be **or** or **and**. Defaults to **or**.

    -   **or** returns all the results matching **any** of the search query text's parameters. For example, searching for "bat man" with **or** will return all the results matching either "bat" or "man".
    -   On the other hand with **and**, only results matching both "bat" and "man" will be returned. It returns the results matching **all** of the search query text's parameters.

-   **react** `Object`
    `react` prop is useful for components whose data view should reactively update when on or more dependent components change their states, e.g. a component to display the results can depend on the search component to filter the results.
    -   **key** `string`
        one of `and`, `or`, `not` defines the combining clause.
        -   **and** clause implies that the results will be filtered by matches from **all** of the associated component states.
        -   **or** clause implies that the results will be filtered by matches from **at least one** of the associated component states.
        -   **not** clause implies that the results will be filtered by an **inverse** match of the associated component states.
    -   **value** `string or Array or Object`
        -   `string` is used for specifying a single component by its `id`.
        -   `Array` is used for specifying multiple components by their `id`.
        -   `Object` is used for nesting other key clauses.

An example of a `react` clause where all three clauses are used and values are `Object`, `Array` and `string`.

```js
const resultComponent = new SearchComponent({
	react: {
		and: {
			or: ['CityComp', 'TopicComp'],
			not: 'BlacklistComp',
		},
	},
});
```

Here, we are specifying that the result component should update whenever one of the blacklist items is not present and simultaneously any one of the city or topics matches.

-   **size** `number`
    Number of suggestions and results to fetch per request.

-   **from** `number`
    To define from which page to start the results, it is important to implement pagination.

-   **includeFields** `Array<string>`
    fields to be included in search results.

-   **excludeFields** `Array<string>`
    fields to be excluded in search results.

-   **sortBy** `string`
    sort the results by either `asc` or `desc` order. The `count` option can also be used to filter the aggregations based on `count` if the query type is as `term`.

-   **aggregationField** `string` [optional]
    One of the most important use-cases this enables is showing `DISTINCT` results (useful when you are dealing with sessions, events, and logs type data).
    It utilizes `composite aggregations` which are newly introduced in ES v6 and offer vast performance benefits over a traditional terms aggregation.
    You can read more about it over [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-composite-aggregation.html).
    You can use `aggregationData` using `onAggregationData` callback or `subscriber`.

    ```js
    const component = new SearchComponent({
    	index: 'good-book-ds-latest',
    	url: 'https://scalr.api.appbase.io',
    	credentials: 'IPM14ICqp:8e573e86-8802-4a27-a7a1-4c7d0c62c186',
    	dataField: 'original_title',
    	aggregationField: 'original_title.keyword',
    });
    // using callback
    component.onAggregationData(next, prev) {}
    // using subscriber
    component.subscribeToStateChanges(
        ({ changes }) => {
            console.log("Aggregations =>", changes.aggregationData.next);
        },
        'aggregationData'
    );
    ```

-   **highlight** `boolean` [optional]
    whether highlighting should be enabled in the returned results.

-   **highlightField** `string or Array` [optional]
    when highlighting is enabled, this prop allows specifying the fields which should be returned with the matching highlights. When not specified, it defaults to applying highlights on the field(s) specified in the **dataField** prop.

-   **customHighlight** `Object` [optional]
    It can be used to set the custom highlight settings. You can read the `Elasticsearch` docs for the highlight options at [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-highlighting.html).

-   **categoryField** `string` [optional]
    Data field which has the category values mapped.

-   **categoryValue** `string` [optional]
    This is the selected category value. It is used for informing the search result.

-   **nestedField** `string`
    set the `nested` field path that allows an array of objects to be indexed in a way that can be queried independently of each other. Applicable only when dataField's mapping is of `nested` type.

-   **fuzziness** `string | number`
    Set a maximum edit distance on the search parameters, which can be 0, 1, 2, or "AUTO". This is useful for showing the correct results for an incorrect search parameter by taking the fuzziness into account. For example, with a substitution of one character, the fox can become a box.
    Read more about it in the elastic search [docs](https://www.elastic.co/guide/en/elasticsearch/guide/current/fuzziness.html)

-   **enableSynonyms**: boolean
    This property can be used to control (enable/disable) the synonyms behavior for a particular query. Defaults to `true`, if set to `false` then fields having `.synonyms` suffix will not affect the query.

-   **searchOperators** `boolean`
    Defaults to `false`. If set to `true`, then you can use special characters in the search query to enable the advanced search.<br/>
    Read more about it [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-simple-query-string-query.html).

-   **queryString** `boolean` [optional]
    Defaults to `false`. If set to `true` than it allows you to create a complex search that includes wildcard characters, searches across multiple fields, and more. Read more about it [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html).

-   **pagination**: boolean
    This property allows you to implement the `pagination` for `term` type of queries. If `pagination` is set to `true` then appbase will use the [composite aggregations](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-composite-aggregation.html) of Elasticsearch instead of [terms aggregations](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-terms-aggregation.html).

-   **after**: Object
    This property can be used to implement the pagination for `aggregations`. We use the [composite aggregations](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-composite-aggregation.html) of `Elasticsearch` to execute the aggregations' query, the response of composite aggregations includes a key named `after_key` which can be used to fetch the next set of aggregations for the same query. You can read more about the pagination for composite aggregations at [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-composite-aggregation.html#_pagination).

    You need to define the `after` property in the next request to retrieve the next set of aggregations.

-   **showMissing**: boolean
    Defaults to `false`. When set to `true` then it also retrieves the aggregations for missing fields.

-   **missingLabel**: string
    Defaults to `N/A`. It allows you to specify a custom label to show when [showMissing](/docs/search/reactivesearch-api/reference/#showmissing) is set to `true`.

-   **includeNullValues**: boolean
    If you have sparse data or documents or items not having the value in the specified field or mapping, then this prop enables you to show that data.

-   **interval**: number
    To set the histogram bar interval, applicable when [aggregations](/docs/search/reactivesearch-api/reference/#aggregations) value is set to `["histogram"]`. Defaults to `Math.ceil((range.end - range.start) / 100) || 1`.

-   **aggregations**: Array<string>
    It helps you to utilize the built-in aggregations for `range` type of queries directly, valid values are:
-   `max`: to retrieve the maximum value for a `dataField`,
-   `min`: to retrieve the minimum value for a `dataField`,
-   `histogram`: to retrieve the histogram aggregations for a particular `interval`

-   **selectAllLabel**: string
    This property allows you to add a new property in the list with a particular value in such a way that when selected i.e `value` is similar/contains to that label(`selectAllLabel`) then `term` query will make sure that the `field` exists in the `results`.

#### To customize the AutoSuggestions

-   **enableQuerySuggestions** `boolean` [optional]
    Defaults to `false`. When enabled, it can be useful to curate search suggestions based on actual search queries that your users are making. Read more about it over [here](/docs/analytics/query-suggestions/).

-   **showDistinctSuggestions** `boolean` [optional]
    Show 1 suggestion per document. If set to `false` multiple suggestions may show up for the same document as the searched value might appear in multiple fields of the same document, this is true only if you have configured multiple fields in `dataField` prop. Defaults to `true`.
    <br/> <br/>
    **Example** if you have `showDistinctSuggestions` is set to `false` and have the following configurations

    ```js
    // Your document:
    {
    	"name": "Warn",
    	"address": "Washington"
    }
    // SearchComponent:
    dataField=['name', 'address']
    // Search Query:
    "wa"
    ```

    Then there will be 2 suggestions from the same document
    as we have the search term present in both the fields
    specified in `dataField`.

    ```
    Warn
    Washington
    ```

#### To customize the query execution

-   **headers** `Object`
    set custom headers to be sent with each server request as key/value pairs. For example:

```ts
const component = new SearchComponent({
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
    const component = new SearchComponent({
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
    Enables transformation of search network response before rendering them. It is an asynchronous function which will accept an Elasticsearch response object as param and is expected to return an updated response as the return value.<br/>
    For example:

```js
const component = new SearchComponent({
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

-   **defaultQuery**: `(component: SearchComponent) => Object`
    is a callback function that takes the `SearchComponent` instance as parameter and **returns** the data query to be applied to the source component, as defined in Elasticsearch Query DSL, which doesn't get leaked to other components. In simple words, `defaultQuery` is used with data-driven components to impact their own data. It is meant to modify the default query which is used by a component to render the UI.

    Some of the valid use-cases are:

    -   To modify the query to render the `suggestions` or `results` in `search` type of components.
    -   To modify the `aggregations` in `term` type of components.

    For example, in a `term` type of component showing a list of cities, you may only want to render cities belonging to India.

    ```js
    const component = new SearchComponent({
    	index: 'gitxplore-app',
    	url: 'https://@arc-cluster-appbase-demo-6pjy6z.searchbase.io',
    	credentials: 'a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61',
    	defaultQuery: () => ({
    		query: {
    			terms: {
    				country: ['India'],
    			},
    		},
    	}),
    });
    ```

-   **customQuery**: `(component: SearchComponent) => Object`
    takes `SearchComponent` instance as parameter and **returns** the query to be applied to the dependent components by `react` prop, as defined in Elasticsearch Query DSL.

    For example, the following example has two components `search-component`(to render the suggestions) and `result-component`(to render the results). The `result-component` depends on the `search-component` to update the results based on the selected suggestion. The `search-component` has the `customQuery` prop defined that will not affect the query for suggestions(that is how `customQuery` is different from `defaultQuery`) but it'll affect the query for `result-component` because of the `react` dependency on `search-component`.

    ```js
    const searchBase = new SearchBase({
    	index: 'gitxplore-app',
    	url: 'https://@arc-cluster-appbase-demo-6pjy6z.searchbase.io',
    	credentials: 'a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61',
    });

    searchBase.register('search-component', {
    	customQuery: () => ({
    		timeout: '1s',
    		query: {
    			match_phrase_prefix: {
    				fieldName: {
    					query: 'hello world',
    					max_expansions: 10,
    				},
    			},
    		},
    	}),
    });

    searchBase.register('result-component', {
    	react: {
    		and: ['search-component'],
    	},
    });
    ```

#### Miscellaneous

-   **beforeValueChange** `(value: string) => Promise<any>`
    is a callback function which accepts the component's future **value** as a parameter and **returns** a promise. It is called every time before a component's value changes. The promise, if and when resolved, triggers the execution of the component's query and if rejected, kills the query execution. This method can act as a gatekeeper for query execution since it only executes the query after the provided promise has been resolved.<br/>
    For example:
    ```js
    const component = new SearchComponent({
    	index: 'gitxplore-app',
    	url: 'https://@arc-cluster-appbase-demo-6pjy6z.searchbase.io',
    	credentials: 'a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61',
    	beforeValueChange: value =>
    		function(value) {
    			// called before the value is set
    			// returns a promise
    			return new Promise((resolve, reject) => {
    				// update state or component props
    				resolve();
    				// or reject()
    			});
    		},
    });
    ```

### An example with all properties

```js
const component = new SearchComponent({
    index: 'gitxplore-app',
    url: 'https://@arc-cluster-appbase-demo-6pjy6z.searchbase.io',
    credentials: 'a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61',
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
    id: 'search-component',
    type: 'search',
    highlight: true,
    highlightFields: ["original_title", "original_title.raw"],
    value: "",
    fuzziness: "AUTO",
    searchOperators: true,
    queryFormat: "or",
    size: 10,
    from: 0,
    dataField: "original_title",
    includeFields: ["*"],
    excludeFields: [],
    sortBy: "asc",
    nestedField: "",
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
    beforeValueChange:  value => new Promise((resolve, reject) => {
        if(/[^a-zA-Z0-9]/.test(value)) {
            resolve(value)
        } else {
            reject('Special characters not allowed.')
        }
    }),
)}
```

## Getter properties

These properties are automatically calculated or managed by the `SearchBase` class. The library user is not expected to modify these properties.

-   **results** `Results`
    It is an object which contains the following details of `results` query response.

    -   **`data`**: `Array<Object>` contains the (promoted data + parsed hits)
    -   **`raw`**: `Object` Response returned by ES query in the raw form.
    -   **`numberOfResults`**: `number` Total number of results found
    -   **`time`**: `number` Total time taken by request (in ms)
    -   **`hidden`**: `number` Total number of hidden results found
    -   **`promoted`**: `number` Total number of promoted results found
    -   **`promotedData`**: `Array<Object>` An array of promoted results obtained from the applied query.
    -   **`customData`**: `Object` An object of custom data obtained from the `reactivesearch-v3` API.
    -   **`rawData`**: `Object` An object of raw response as-is from elasticsearch query.

-   **aggregationData** `Aggregations`
    It is an object which contains the following details of `aggregations` query response.

    -   **`data`**: `Array<Object>` contains the parsed aggregations
    -   **`raw`**: `Object` Response returned by ES `composite aggs` query in the raw form.
    -   **`rawData`**: `Object` An object of raw response as-is from elasticsearch query.
    -   **`afterKey`**: `Object` If the number of composite buckets is too high (or unknown) to be returned in a single response use the `afterKey` parameter to retrieve the next results. This property will only be present for `composite` aggregations.

-   **suggestions** `() => Array<Object>`
    This method can be used to get the parsed suggestions from the `results`. If `enableQuerySuggestions` property is set to `true` then the query suggestions will get appended at the top with a top-level property named `_query_suggestion` as `true`. The `suggestion` object will have the following shape:

    ```ts
    {
    	label: string;
    	value: string;
    	source: Object;
    }
    ```

-   **query** `Object`
    The last query that has been executed

-   **requestPending** `boolean`
    Useful for getting the status of the API, whether it has been executed or not

-  **requestStatus** `string`
    Represents the current state of the request, can have values as `INACTIVE`, `PENDING` or `ERROR`.

-   **micStatus** `MicStatusField`
    Returns the current status of the mic. Can be `INACTIVE`, `ACTIVE` or `DENIED`

-   **micActive** `boolean`
    Returns `true` if mic is active

-   **micInactive** `boolean`
    Returns `true` if mic is inactive

-   **micDenied** `boolean`
    Returns `true` if it doesn't have access to the mic

-   **micInstance**
    Returns the current mic instance. Can be used to set mic language and other properties of mic

## Setters

> Note:
> All of the methods accept options as the second parameter which has the following shape:

```ts
{
    triggerDefaultQuery?: boolean, // defaults to `true`
    triggerCustomQuery?: boolean, // defaults to `false`
    stateChanges?: boolean // defaults to `true`
};
```

-   **triggerDefaultQuery**
    `true` executes the query for a particular component
-   **triggerCustomQuery**
    `true` executes the query for the dependent components (dependencies defined in the `react` property)
-   **stateChanges**
    `true` invokes the subscribed functions to `subscribeToStateChanges` method, i.e trigger the re-render after making changes

The following methods of `SearchComponent` class can be used to set or update the search properties:

-   **setHeaders** `(headers: Object, options?: Options) => void`
    can be used to set the `headers` property
-   **setSize** `(size: number, options?: Options) => void`
    can be used to set the `size` property
-   **setFrom** `(from: number, options?: Options) => void`
    can be used to set the `from` property, which is useful while implementing pagination
-   **setAfter** `(after: object, options?: Options) => void`
    can be used to set the `after` property, which is useful while implementing pagination when the `type` of the component is `term`
-   **setFuzziness** `(fuzziness: number | string, options?: Options) => void`
    can be used to set the `fuzziness` property
-   **setIncludeFields** `(includeFields: Array<string>, options?: Options) => void`
    can be used to set the `includeFields` property
-   **setExcludeFields** `(excludeFields: Array<string>, options?: Options) => void`
    can be used to set the `excludeFields` property
-   **setSortBy** `(sortBy: string, options?: Options) => void`
    can be used to set the `sortBy` property
-   **setSortByField** `(sortByField: string, options?: Options) => void`
    can be used to set the `sortByField` property
-   **setNestedField** `(nestedField: string, options?: Options) => void`
    can be used to set the `nestedField` property
-   **setDataField** `( dataField: string | Array<string | DataField>, options?: Options ) => void`
    can be used to set the `dataField` property
-   **setResults** `(results: Array<Object>, options?: Option) => void`
    can be used to set the custom `results`
-   **setValue** `(value: string, options?: Options) => void`
    can be used to set the `value` property

-   **setReact** `(react: Object, options?: types.Options): void`
    can be used to set the `react` property

-   **setDefaultQuery** `( defaultQuery: (component: SearchComponent) => void, options?: types.Options ): void`
    can be used to set the default query

-   **setCustomQuery** `( defaultQuery: (component: SearchComponent) => void, options?: types.Options ): void`
    can be used to set the custom query

## Callback of change events

You can define the callback of the following event to listen for the search state changes. The callback function accepts the updated value as the first param and the previous value as the second param. These callback functions may be used in the following scenarios:

1. Perform side-effects e.g. make a network request,
2. Update the UI. However, it is recommended to use the `subscribeToStateChanges` to update the UI which uses `SearchComponent` properties.

-   **onValueChange** `(next: string, prev: string) => void`
    can be used to listen for the `value` property changes. <br/>

```js
const component = new SearchComponent({
	index: 'gitxplore-app',
	url: 'https://@arc-cluster-appbase-demo-6pjy6z.searchbase.io',
	credentials: 'a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61',
});
component.onValueChange = (nextValue, prevValue) => {
	// do something with the updated or previous values
};
```

-   **onResults** `(next: string, prev: string) => void`;
    can be used to listen for the `results` property changes

-   **onAggregationData** `(next: string, prev: string) => void`;
    can be used to listen for the `aggregationData` property changes

```javascript
    const component = new SearchComponent({
    	index: 'gitxplore-app',
        url: 'https://@arc-cluster-appbase-demo-6pjy6z.searchbase.io',
        credentials: 'a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61',
        type: 'term',
    	dataField: 'category.keyword',
    });
    // using callback
    component.onAggregationData(next, prev) {}
```

-   **onError** `(error: any) => void`;
    called when there is an error while fetching results

-   **onRequestStatusChange** `(next: string, prev: string) => void`;
    called when request status changes

-   **onQueryChange** `(next: string, prev: string) => void`;
    called when query changes

-   **onMicStatusChange** `(next: string, prev: string) => void`;
    called when mic status changes

## Execute queries

The following methods can be used to trigger the queries for components.

-   **triggerDefaultQuery** `(options?: types.Option): Promise<any>`
    This method can be used to execute the default query for a particular component.
    For examples,
    
    - to display the `suggestions` or `results` for a `search` type of component,
    - to display the filter options(`aggregations`) for a `term` type of component

-   **triggerCustomQuery** `(options?: types.Option): Promise<any>`
    This method can be used to execute queries for the dependent components.

## Subscribe to the properties changes

Although we have callbacks for change events that can be used to update the UI based on particular property changes, the `subscribeToStateChanges` method gives you more control over the UI rendering logic and is more efficient.

### How does it work?

1. This method is controlled by the `stateChanges` property which can be defined in the [setters](#setters) while updating a particular property. If `stateChanges` is set to `true`, then only the subscribed functions will be called, unlike events callback which gets called every time when a property changes its value.<br/>
   So basically, `subscribeToStateChanges` provides more control over the event's callback in a way that you can define whether to update the UI or not while setting a particular property's value.<br/>
2. You can define the properties for which you want to update the UI.
3. It allows you to register multiple callback functions for search state updates.

### Usage

```ts
subscribeToStateChanges(
    fn: Function,
    propertiesToSubscribe?: string | Array<string>
): void
```

You can use the `subscribeToStateChanges` method of `SearchComponent` class to subscribe to the state changes of the properties. <br/>
A common use-case is to subscribe to a component or DOM element to a particular property or a set of properties & update the UI according to the changes. <br/>
The callback function accepts an object in the following shape:

```js
{
    [propertyName]: { // property name for example, `results`
        prev: any; // previous value of the property
        next: any; // next value of the property
    }
}
```

These are the properties that can be subscribed for the changes:

-   `results`
-   `aggregationData`
-   `requestStatus`
-   `error`
-   `value`
-   `query`
-   `micStatus`
-   `dataField`
-   `size`
-   `from`
-   `fuzziness`
-   `includeFields`
-   `excludeFields`
-   `sortBy`
-   `react`
-   `defaultQuery`
-   `customQuery`

Let's check this example to bind a React component with the `results` property change.

```js
import React from 'react';

class Results extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            results: []
        }
        this.component = new SearchComponent(config);
        this.component.subscribeToStateChanges(this.stateChangeHandler, 'results');
    }
    stateChangeHandler = ({ results }) => {
        console.log('prev value', results.prev);
        console.log('next value', results.next);
        // Update the component state based on the value changes
        this.setState({
            results: results.next
        });
    }
    render() {
        return (
            <div id="results">
                {this.state.results.map(result => <Results {..results} />)}
            </div>
        )
    }
}
```

## Unsubscribe to the properties changes

It is recommended to unsubscribe the callback functions after the component has been unmounted.

For example in `React`, we can use the `componentWillUnmount` life cycle method to unsubscribe to the changes.

```js
componentWillUnmount() {
    this.component.unsubscribeToStateChanges(this.stateChangeHandler);
}
```

## Record Analytics

The `SearchComponent` class provides the methods to record clicks and conversions for search results.

-   **recordClick** `(clickObjects: Object, isSuggestionClick: boolean = false) => void`
    Enables recording click analytics of a search request. Pass `isSuggestionClick=true`, if you want to record a suggestion click.

    ```js
    const component = new SearchComponent({
    	index: 'good-book-ds',
    	url: 'https://arc-cluster-appbase-demo-ps1pgt.component.io',
    	credentials: 'a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61',
    	appbaseConfig: {
    		recordAnalytics: true,
    		enableQueryRules: true,
    	},
    	dataField: 'original_title',
    });
    // using recordClick
    component.recordClick({ 'cf827a07-60a6-43ef-ab93-e1f8e1e3e1a8': 2 }, true);
    ```

    Here `cf827a07-60a6-43ef-ab93-e1f8e1e3e1a8` is the ES docId and `2` is the click position.

-   **recordConversions** `(conversionObjects: Array<string>) => void`
    Enables recording a search conversion.
    ```js
    const component = new SearchComponent({
    	index: 'good-book-ds',
    	url: 'https://arc-cluster-appbase-demo-ps1pgt.searchbase.io',
    	credentials: 'a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61',
    	appbaseConfig: {
    		recordAnalytics: true,
    		enableQueryRules: true,
    	},
    	dataField: 'original_title',
    });
    // using recordConversions
    component.recordConversions(['cf827a07-60a6-43ef-ab93-e1f8e1e3e1a8']);
    ```
    Here `cf827a07-60a6-43ef-ab93-e1f8e1e3e1a8` is the ES docId.
