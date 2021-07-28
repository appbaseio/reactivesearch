---
title: 'SearchComponent API Reference'
meta_title: 'Documentation for SearchComponent'
meta_description: 'SearchComponent represents a search component that can be used to build different kinds of search components.'
keywords:
    - vue-searchbox
    - search library
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'vue-searchbox-reactivesearch'
---

## How does it work?

`SearchComponent` represents a search component that component can be used to bind to different kinds of search UI widgets. It uses the [SearchComponent](docs/reactivesearch/searchbase/overview/searchcomponent/) class from [SearchBase](docs/reactivesearch/searchbase/overview/QuickStart/) to bind any UI component to be able to query appbase.io declaratively. Some examples of components you can bind this with:

-   a category filter component,
-   a search bar component,
-   a price range component,
-   a location filter component,
-   a component to render the search results.

## Props

### Configure appbase.io environment

The below props are only needed if you're not using the `SearchComponent` component under [SearchBase](docs/reactivesearch/searchbase/overview/searchbase/) provider. These props can also be used to override the global environment defined in the [SearchBase](docs/reactivesearch/searchbase/overview/searchbase/) component.

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

### To configure the ReactiveSearch API

The following properties can be used to configure the appbase.io [ReactiveSearch API](/docs/search/reactivesearch-api/):

-   **id** `string` [required]
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

```html
<template>
    <search-component
        id="result-component"
        :dataField="['original_title', 'original_title.search']"
        :react="{
            and: {
                or: ['CityComp', 'TopicComp'],
                not: 'BlacklistComp',
            },
        }"
    />
</template>
```

Here, we are specifying that the results should update whenever one of the blacklist items is not present and simultaneously any one of the city or topics matches.

-   **size** `number`
    Number of suggestions and results to fetch per request.

-   **from** `number`
    To define from which page to start the results, it is important to implement pagination.

-   **includeFields** `Array<string>`
    fields to be included in search results.

-   **excludeFields** `Array<string>`
    fields to be excluded in search results.

-   **sortBy** `string`
    sort the results by either `asc` or `desc` order.

-   **aggregationField** `string` [optional]
    One of the most important use-cases this enables is showing `DISTINCT` results (useful when you are dealing with sessions, events, and logs type data).
    It utilizes `composite aggregations` which are newly introduced in ES v6 and offer vast performance benefits over a traditional terms aggregation.
    You can read more about it over [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-composite-aggregation.html).
    You can use `aggregationData` using `onAggregationData` callback or `subscriber`.

```html
<template>
    <search-component
        id="result-component"
        :dataField="['original_title', 'original_title.search']"
        aggregationField="original_title.keyword"
        @aggregationData="handleAggregationData"
    />
</template>
<script>
export default App {
    name: 'App',
    methods: {
        handleAggregationData(prev, next) {
            console.log("aggregations", prev, next)
        }
    }
}
</script>
```
-   **aggregationSize**
    To set the number of buckets to be returned by aggregations.

    > Note: This is a new feature and only available for appbase versions >= 7.41.0.
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
    Defaults to `false`. If set to `true` then it allows you to create a complex search that includes wildcard characters, searches across multiple fields, and more. Read more about it [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html).

-  **clearOnQueryChange** `boolean` [optional]
    Defaults to `false`, i.e. the component's input selection isn't cleared when the query of its dependent component changes (which is set via react prop). When set to `true`, the component's input selection is cleared.

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

-   **distinctField** `String` [optional]
	This prop returns only the distinct value documents for the specified field. It is equivalent to the `DISTINCT` clause in SQL. It internally uses the collapse feature of Elasticsearch. You can read more about it over [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/collapse-search-results.html).

-   **distinctFieldConfig** `Object` [optional]
	This prop allows specifying additional options to the `distinctField` prop. Using the allowed DSL, one can specify how to return K distinct values (default value of K=1), sort them by a specific order, or return a second level of distinct values. `distinctFieldConfig` object corresponds to the `inner_hits` key's DSL.  You can read more about it over [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/collapse-search-results.html).

```html
<search-component
	....
	distinctField="authors.keyword"
	:distinctFieldConfig="{
		inner_hits: {
			name: 'most_recent',
			size: 5,
			sort: [{ timestamp: 'asc' }],
		},
		max_concurrent_group_searches: 4,
	}"
/>
```

#### To customize the AutoSuggestions

-   **enablePopularSuggestions** `boolean` [optional]
    Defaults to `false`. When enabled, it can be useful to curate search suggestions based on actual search queries that your users are making. Read more about it over [here](/docs/analytics/popular-suggestions/).

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



### To customize the query execution

-   **headers** `Object`
    set custom headers to be sent with each server request as key/value pairs. For example:

```html
<search-component
    id="search-component"
    :dataField="['original_title', 'original_title.search']"
    :headers="{
		secret: 'searchbase-is-awesome',
	}"
/>
```

-   **transformRequest** `(requestOptions: Object) => Promise<Object>`
    Enables transformation of network request before execution. This function will give you the request object as the param and expect an updated request in return, for execution.<br/>
    For example, we will add the `credentials` property in the request using `transformRequest`.


```html
<template>
    <search-component
        id="search-component"
        :dataField="['original_title', 'original_title.search']"
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

-   **transformResponse** `(response: any) => Promise<any>`
    Enables transformation of search network response before rendering them. It is an asynchronous function which will accept an Elasticsearch response object as param and is expected to return an updated response as the return value.<br/>
    For example:

```html
<template>
    <search-component
        id="search-component"
        :dataField="['original_title', 'original_title.search']"
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

```html
<template>
    <search-component
        id="city-component"
        type="term"
        :dataField="['city']"
        :defaultQuery="defaultQuery"
    />
</template>
<script>
    export default App {
        name: 'App',
        methods: {
            defaultQuery() {
                return {
                    query: {
                        terms: {
                            country: ['India'],
                        },
                    },
                }
            }
        }
    }
</script>
```

-   **customQuery**: `(component: SearchComponent) => Object`
    takes `SearchComponent` instance as parameter and **returns** the query to be applied to the dependent components by `react` prop, as defined in Elasticsearch Query DSL.

    For example, the following example has two components `search-component`(to render the suggestions) and `result-component`(to render the results). The `result-component` depends on the `search-component` to update the results based on the selected suggestion. The `search-component` has the `customQuery` prop defined that will not affect the query for suggestions(that is how `customQuery` is different from `defaultQuery`) but it'll affect the query for `result-component` because of the `react` dependency on `search-component`.

```html
<template>
    <search-base
        index="gitxplore-app"
        url="https://@arc-cluster-appbase-demo-6pjy6z.searchbase.io"
        credentials="a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61"
    >
        <search-component
            id="search-component"
            :dataField="['original_title', 'original_title.search']"
            :customQuery="customQuery"
        />
        <search-component
            id="result-component"
            dataField="original_title"
            :react="{
                and: ['search-component']
            }"
        />
    </search-base>
</template>
<script>
    export default App {
        name: 'App',
        methods: {
            customQuery() {
                return {
                    timeout: '1s',
                    query: {
                        match_phrase_prefix: {
                            fieldName: {
                                query: 'hello world',
                                max_expansions: 10,
                            },
                        },
                    },
                }
            }
        }
    }
</script>
```

### Miscellaneous

-  **beforeValueChange** `Function`
    is a callback function which accepts component's future **value** as a parameter and **returns** a promise. It is called every-time before a component's value changes. The promise, if and when resolved, triggers the execution of the component's query and if rejected, kills the query execution. This method can act as a gatekeeper for query execution, since it only executes the query after the provided promise has been resolved.
    For example:

```html
<template>
    <search-component
        id="search-component"
        :dataField="['original_title', 'original_title.search']"
        :beforeValueChange="beforeValueChange"
    />
</template>
<script>
    export default App {
        name: 'App',
        methods: {
            beforeValueChange(value) {
                // called before the value is set
                // returns a promise
                return new Promise((resolve, reject) => {
                    // update state or component props
                    resolve();
                    // or reject()
                });
            }
        }
    }
</script>
```

-   **URLParams** `Boolean` enable creating a URL query string param based on the search query value. This is useful for sharing URLs with the component state. Defaults to `false`.

## Events

-   **valueChange** is an event which accepts component's current **value** as a parameter. It is called every-time the component's value changes. This prop is handy in cases where you want to generate a side-effect on value selection. For example: You want to show a pop-up modal with the valid discount coupon code when a user searches for a product in a SearchBox.

-  **error** gets triggered in case of an error while fetching results

-  **results** can be used to listen for the `results` changes

-  **queryChange**
    is an event which accepts component's **prevQuery** and **nextQuery** as parameters. It is called every time the component's query changes. This prop is handy in cases where you want to generate a side-effect whenever the component's query would change.

-  **aggregationData** can be used to listen for the `aggregationData` property changes
    - **data**: `Array<Object>` contains the parsed aggregations
    - **raw**: `Object` Response returned by ES composite aggs query in the raw form.
    - **rawData**: `Object` An object of raw response as-is from elasticsearch query.
    - **afterKey**: `Object` If the number of composite buckets is too high (or unknown) to be returned in a single response use the afterKey parameter to retrieve the next

- **requestStatusChange** can be used to listen for the request status changes

- **micStatusChange** can be used to listen for the mic status changes

## Render UI
You can use the default `scoped-slot` to render your custom UI. The following properties are available in the slot.

### Getters
-   **loading**: `boolean`
    indicates that the query is still in progress.
-   **error**: `Object`
    An object containing the error info.
-   **results** `Results`
It is an object which contains the following details of `suggestions` query response.

    -   **`data`**: `Array<Object>` contains the (promoted data + parsed hits)
    -   **`raw`**: `Object` Response returned by ES query in the raw form.
    -   **`numberOfResults`**: `number` Total number of results found
    -   **`time`**: `number` Total time taken by request (in ms)
    -   **`hidden`**: `number` Total number of hidden results found
    -   **`promoted`**: `number` Total number of promoted results found
    -   **`promotedData`**: `Array<Object>` An array of promoted results obtained from the applied query.
    -   **`customData`**: `Object` An object of custom data obtained from the ReactiveSearch API.
    -   **`rawData`**: `Object` An object of raw response as-is from elasticsearch query.
-   **suggestions** `() => Array<Object>`
    This method can be used to get the parsed suggestions from the `results`. If `enablePopularSuggestions` property is set to `true` then the popular suggestions will get appended at the top with a top-level property named `_popular_suggestion` as `true`. The `suggestion` object will have the following shape:

```ts
{
    label: string;
    value: string;
    source: Object;
}
```
-   **aggregationData** `Aggregations`
It is an object which contains the following details of `aggregations` query response.

    -   **`data`**: `Array<Object>` contains the parsed aggregations
    -   **`raw`**: `Object` Response returned by ES `composite aggs` query in the raw form.
    -   **`rawData`**: `Object` An object of raw response as-is from elasticsearch query.
    -   **`afterKey`**: `Object` If the number of composite buckets is too high (or unknown) to be returned in a single response use the `afterKey` parameter to retrieve the next results. This property will only be present for `composite` aggregations.

-   **value**
Represents the current value of the component

-   **query** `Object`
The last query that has been executed by the component

-   **micStatus** `MicStatusField`
Returns the current status of the mic. Can be `INACTIVE`, `ACTIVE` or `DENIED`

-   **micActive** `boolean`
Returns `true` if mic is active

-   **micInactive** `boolean`
Returns `true` if mic is inactive

-   **micDenied** `boolean`
Returns `true` if it doesn't have access to the mic

-   **micInstance** `Object`
Returns the current mic instance. Can be used to set mic language and other properties of mic

-   **id** `string` as defined in props
-   **react** `Object` `react` as defined in props
-   **queryFormat** `string` as defined in props
-   **dataField** `string | Array<string | DataField>` as defined in props
-   **categoryField** `string` as defined in props
-   **categoryValue** `string` represents the current value of the selected category
-   **nestedField** `string` as defined in props
-   **from** `number` represents the current state of the `from` value. This property is useful to implement pagination.
-   **size** `number` represents the current state of the `size` of results to be returned by query
-   **sortBy** `string` current state of the `sortBy` value
-   **aggregationField** `string` as defined in props
-   **includeFields** `Array<string>` represents the current value of `includeFields` property
-   **excludeFields** represents the current value of `excludeFields` property
-   **fuzziness** `string|number` represents the current value of `fuzziness` property
-   **searchOperators** `boolean` as defined in props
-   **highlight** `boolean` as defined in props
-   **highlightField** `string|Array<string>` as defined in props
-   **customHighlight** `Object` as defined in props
-   **enableSynonyms** `boolean` as defined in props
-   **queryString** `string` as defined in props
-   **enablePopularSuggestions** `boolean` as defined in props
-   **showDistinctSuggestions** `boolean` as defined in props
-   **defaultQuery** represents the current value of `defaultQuery` property
-   **customQuery**  represents the current value of `customQuery` property
-   **requestStatus** represents the current state of the request, can have values as `INACTIVE`, `PENDING` or `ERROR`.
-   **appbaseConfig** `Object` as defined in props
-   **queryId** `string` to get the query id returned by appbase.io search to track the analytics

### Setters

> Note:
> All of the methods accept `options` as the second parameter which has the following shape:

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

The following methods can be used to set or update the properties in the search state:

-   **setValue** `( value: any, options?: Options ) => void`  can be used to set the `value` property
-   **setSize** `( size: number, options?: Options ) => void`  can be used to set the `size` property
-   **setFrom** `( from: number, options?: Options ) => void` can be used to set the `from` property. Useful to implement pagination.
-   **setAfter** `(after: object, options?: Options) => void`
    can be used to set the `after` property, which is useful while implementing pagination when the `type` of the component is `term`. The `after` key is a a property of `aggregationData`.
-   **setFuzziness** `( fuzziness: string|number, options?: Options ) => void` can be used to set the `fuzziness` property.
-   **setIncludeFields** `( includeFields: Array<string>, options?: Options ) => void` can be used to set the `includeFields` property.
-   **setExcludeFields** `( excludeFields: Array<string>, options?: Options ) => void` can be used to set the `excludeFields` property.
-   **setSortBy** `( sortBy: string, options?: Options ) => void` can be used to set the sortBy` property.
-   **setReact** `( react: Object, options?: Options ) => void` can be used to set the `react` property.
-   **setDefaultQuery** `( defaultQuery: function, options?: Options ) => void` can be used to set the `defaultQuery` property.
-   **setCustomQuery** `( customQuery: function, options?: Options ) => void` can be used to set the `customQuery` property.
-   **handleMicClick** `(micOptions: Object, options: Options): Promise<any>` can be used to handle the custom voice search implementation

-   **setDataField** `( dataField: string | Array<string | DataField>, options?: Options ) => void`

### Methods to trigger queries programmatically

> Note:
> All of the methods accept `options` as the second parameter which has the following shape:

```ts
{
    stateChanges?: boolean // defaults to `true`
};
```
-   **stateChanges**
`true` invokes the subscribed functions to `subscribeToStateChanges` method, i.e trigger the re-render after making changes

The following methods can be used to execute the component's queries programmatically.

-   **triggerDefaultQuery** `(options): Promise<any>` can be used to trigger the `customQuery` programmatically
-   **triggerCustomQuery** `(options): Promise<any>` can be used to trigger the `defaultQuery` programmatically

### Methods to subscribe to state changes
-   **subscribeToStateChanges** `function` can be used to subscribe to the changes for the properties. Read more at [here](/docs/reactivesearch/searchbase/overview/searchcomponent/#subscribe-to-the-properties-changes).
-   **unsubscribeToStateChanges** `function` can be used to unsubscribe to the changes for the properties. Read more at [here](/docs/reactivesearch/searchbase/overview/searchcomponent/#subscribe-to-the-properties-changes).

### Record Analytics
-   **recordClick** `function` enables recording click analytics of a search request. Please check the usage at [here](/docs/reactivesearch/searchbase/overview/searchcomponent/#record-analytics).
-   **recordConversions** `function` enables recording conversions of a search request. Please check the usage at [here](/docs/reactivesearch/searchbase/overview/searchcomponent/#record-analytics).
