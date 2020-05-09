---
title: 'API Reference'
meta_title: 'API Reference for SearchBase'
meta_description: 'SearchBase is a lightweight and platform agnostic search library for ElasticSearch.'
keywords:
    - apireference
    - searchbase
    - elasticsearch
    - search library
sidebar: 'docs'
nestedSidebar: 'searchbase-reactivesearch'
---

[searchbase](https://github.com/appbaseio/searchbase) - A lightweight & platform agnostic search library for ElasticSearch.

> Note:
>
> This API reference is meant for the headless usage of the `Searchbase` library.


##How does it work?

The working of `Searchbase` can be better explained by the following chart.
<br/><br/>

<img alt="Dataset" src="/images/searchbase.png" />

The `Searchbase` library is a headless implementation of the core architecture in Vanilla JS, which can be used with your own UI or alongside any framework. It provides all the necessary utilities to build a powerful search UI and can be easily integrated with any UI framework. Searchbase lib maintains the search `state` and provide some `actions` which can be used to manipulate the state from the UI. It also provides events which can be used to listen for the state changes & update the UI accordingly.

Although we don't ship any UI component with `Searchbase` directly, we provide easy to integrate libraries for different platforms. Please check `@appbaseio/react-searchbox` for the React framework. The UI solutions for `angular` and `Vue` frameworks are works in progress.

##Constructor
The constructor of searchbase is called with the following properties:

```js
const searchbase = new SearchBase(props);
```

###Properties

-   **index** `string` [Required]
    Refers to an index if you’re using your own Elasticsearch cluster. If you're using an `appbase.io` hosted app, then the app name can be used as the `index` value.

       `Note:` Multiple indexes can be connected to by specifiying comma separated index names.

-   **url** `string` [Required]
    URL for the Elasticsearch cluster
-   **enableAppbase** `boolean` [optional]
    enableAppbase is false by default. You can set this to true when you're using appbase.io alongside ElasticSearch. It enables the following features:
    -   Recording of analytics events - search and clicks. [Read more](/docs/reactivesearch/v3/advanced/analytics/).
    -   Query generation happens on server side - protecting against security concerns around query injection.
    -   Apply query rules and functions for search queries. [Read more](/docs/search/rules/).
    -   Apply additional security controls to requests: authenticate via RBAC (via JWTs) or Basic Auth, ACL based access control, IP based rate limits, IP/HTTP Referers whitelisting, fields filtering. [Read more](/docs/security/role/).
-   **dataField** `string | Array<string | DataField>` [optional*]
    index field(s) to be connected to the component’s UI view. DataSearch accepts an Array in addition to String, which is useful for searching across multiple fields with or without field weights.<br/>
    Field weights allow weighted search for the index fields. This prop accepts an array of numbers. A higher number implies a higher relevance weight for the corresponding field in the search results.<br/>
    You can define the `dataField` as an array of objects of the `DataField` type to set the field weights.<br/>
    The `DataField` type has the following shape:
    ```ts
    type DataField = {
    	field: string;
    	weight: number;
    };
    ```

    >   Note:
    >   This prop is optional only when `enableAppbase` is set to `true`.
    >

-   **aggregationField** `string` [optional]
    One of the most important use-cases this enables is showing `DISTINCT` results (useful when you are dealing with sessions, events and logs type data).
    It utilizes `composite aggregations` which are newly introduced in ES v6 and offer vast performance benefits over a traditional terms aggregation.
    You can read more about it over [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-composite-aggregation.html).
    You can use `aggregationData` using `onAggregationData` callback or `subscriber`.
    ```javascript
    const searchbase = new Searchbase({
    	index: 'good-book-ds-latest',
    	url: 'https://scalr.api.appbase.io',
    	credentials: 'IPM14ICqp:8e573e86-8802-4a27-a7a1-4c7d0c62c186',
    	dataField: 'original_title',
    	aggregationField: 'original_title.keyword',
    });
    // using callback
    searchbase.onAggregationData(next, prev) {}
    // using subscriber
    searchbase.subscribeToStateChanges(
        ({aggregations}) => {},
        'aggregations'
    );
    ```

    > See impact of aggregationField with these examples for [React](/docs/reactivesearch/v3/advanced/groupingresults/#how) and [Vue](/docs/reactivesearch/vue/advanced/groupingresults/#how).

-   **credentials** `string`
    Basic Auth credentials if required for authentication purposes. It should be a string of the format `username:password`. If you are using an appbase.io app, you will find credentials under your [API credentials page](https://dashboard.appbase.io/app?view=credentials). If you are not using an appbase.io app, credentials may not be necessary - although having an open access to your Elasticsearch cluster is not recommended.
-   **appbaseConfig** `Object` [optional]
    allows you to customize the analytics experience when appbase.io is used as a backend. It accepts an object which has the following properties:

    - **recordAnalytics** `Boolean` allows recording search analytics (and click analytics) when set to `true` and appbase.io is used as a backend. Defaults to `false`.
    - **enableQueryRules** `Boolean` If `false`, then appbase.io will not apply the query rules on the search requests. Defaults to `true`.
    - **userId** `String` It allows you to define the user id to be used to record the appbase.io analytics. Defaults to the client's IP address.
    - **customEvents** `Object` It allows you to set the custom events which can be used to build your own analytics on top of appbase.io analytics. Further, these events can be used to filter the analytics stats from the appbase.io dashboard.

-   **headers** `Object`
    set custom headers to be sent with each server request as key/value pairs. For example:

```ts
const searchbase = new Searchbase({
    index: "appname",
    url: "https://scalr.api.appbase.io",
    credentials: "abcdef123:abcdef12-ab12-ab12-ab12-abcdef123456",
    headers: {
        secret: 'searchbase-is-awesome',
    }
})
```
-   **showDistinctSuggestions** `Boolean` [optional]
    Show 1 suggestion per document. If set to `false` multiple suggestions may show up for the same document as searched value might appear in multiple fields of the same document, this is true only if you have configured multiple fields in `dataField` prop. Defaults to `true`.
	<br/> <br/>
    **Example** if you have `showDistinctSuggestions`  is set to `false` and have following configurations

	```js
	// Your document:
	{
		"name": "Warn",
		"address": "Washington"
	}
	// Component:
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
-   **highlight** `Boolean` [optional]
    whether highlighting should be enabled in the returned results.
-   **highlightField** `String or Array` [optional]
    when highlighting is enabled, this prop allows specifying the fields which should be returned with the matching highlights. When not specified, it defaults to applying highlights on the field(s) specified in the **dataField** prop.
-   **value** `string`
    Initial value of the search input which will be used to build out the search query.
-   **suggestions** `Array<Suggestion>`
    where a `Suggestion` is of type:
    ```ts
    type Suggestion = {
    	label: string;
    	value: string;
    	source?: any;
    };
    ```
    You can define custom suggestions which can be used to display in the UI, which are useful when you want to show initial suggestions on an empty search input value.
-   **results** `Array<Object>`
    You can define custom results as an array of objects which can be used to display initially when no query has been executed.
-   **fuzziness** `string | number`
    Set a maximum edit distance on the search parameters, can be 0, 1, 2 or "AUTO". This is useful for showing the correct results for an incorrect search parameter by taking the fuzziness into account. For example, with a substitution of one character, fox can become box.
    Read more about it in the elastic search [docs](https://www.elastic.co/guide/en/elasticsearch/guide/current/fuzziness.html)
-   **searchOperators** `boolean`
    Defaults to `false`. If set to `true`, then you can use special characters in the search query to enable the advanced search.<br/>
    Read more about it [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-simple-query-string-query.html).
-   **queryFormat** `QueryFormat`
    ```ts
    type QueryFormat = 'or' | 'and';
    ```
    Sets the query format, can be **or** or **and**. Defaults to **or**.
    -   **or** returns all the results matching **any** of the search query text's parameters. For example, searching for "bat man" with **or** will return all the results matching either "bat" or "man".
    -   On the other hand with **and**, only results matching both "bat" and "man" will be returned. It returns the results matching **all** of the search query text's parameters.
-   **size** `number`
    Number of suggestions and results to fetch per request.
-   **from** `number`
    To define from which page to start the results, it is important to implement pagination.
-   **includeFields** `Array<string>`
    fields to be included in search results.
-   **excludeFields** `Array<string>`
    fields to be excluded in search results.
-   **recordClick** `(objects: Object, isSuggestionClick: boolean = false) => void`
    Enables recording click analytics of a search request. Pass `isSuggestionClick=true`, if you want to record a suggestion click.
    ```javascript
    const searchbase = new Searchbase({
        index: 'good-book-ds',
        url: 'https://xe6N9nDRV:51ea7a8a-6354-4b5f-83e1-12dce3b7ec47@arc-cluster-appbase-demo-ps1pgt.searchbase.io',
        enableAppbase: true,
        appbaseConfig: {
            recordAnalytics: true,
            enableQueryRules: true,
        },
        dataField: 'original_title',
    });
    // using recordClick
    searchbase.recordClick({ 'cf827a07-60a6-43ef-ab93-e1f8e1e3e1a8': 2 }, true);
    ```
    Here `cf827a07-60a6-43ef-ab93-e1f8e1e3e1a8` is the ES docId and `2` is the click position.
-   **recordConversions** `(objects: Array<string>) => void`
    Enables recording a search conversion.
    ```javascript
    const searchbase = new Searchbase({
        index: 'good-book-ds',
        url: 'https://xe6N9nDRV:51ea7a8a-6354-4b5f-83e1-12dce3b7ec47@arc-cluster-appbase-demo-ps1pgt.searchbase.io',
        enableAppbase: true,
        appbaseConfig: {
            recordAnalytics: true,
            enableQueryRules: true,
        },
        dataField: 'original_title',
    });
    // using recordConversions
    searchbase.recordConversions(['cf827a07-60a6-43ef-ab93-e1f8e1e3e1a8']);
    ```
    Here `cf827a07-60a6-43ef-ab93-e1f8e1e3e1a8` is the ES docId.
-   **transformRequest** `(requestOptions: Object) => Promise<Object>`
    Enables transformation of network request before execution. This function will give you the the request object as the param and expect an updated request in return, for execution.<br/>
    For example, we will add the `credentials` property in the request using `transformRequest`.
    ```js
    const searchbase = new Searchbase({
        index: "appname",
        url: "https://scalr.api.appbase.io",
        credentials: "abcdef123:abcdef12-ab12-ab12-ab12-abcdef123456",
        transformRequest: request =>  Promise.resolve({
            ...request,
            credentials: include,
        })
    });
    ```
-   **transformResponse** `(response: any) => Promise<any>`
    Enables transformation of search network response before rendering them. It is an asynchronous function which will accept an ElasticSearch response object as param and is expected to return an updated response as the return value.<br/>
    For example:
```js
    const searchbase = new Searchbase({
        index: "appname",
        url: "https://scalr.api.appbase.io",
        credentials: "abcdef123:abcdef12-ab12-ab12-ab12-abcdef123456",
        transformResponse: async (elasticsearchResponse) => {
            const ids = elasticsearchResponse.hits.hits.map(
                item => item._id
            );
            const extraInformation = await getExtraInformation(ids);
            const hits = elasticsearchResponse.hits.hits.map(
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
                ...elasticsearchResponse,
                hits: {
                    ...elasticsearchResponse.hits,
                    hits
                }
            };
        },
    });
```
> Note
>
> `transformResponse` function is expected to return data in the following structure.

```json
    {
        hits: {
            hits: [...],
            total: 100
        },
        took: 1
    }
```
-   **transformQuery** `(query: Object) => Promise<Object>`
    This async function can be used to modify the default query DSL generated by `Searchbase` before the execution of the network request. It accepts the queryDSL as a parameter and expects a promise to be returned which resolves the modified query in the same format.<br/>
    The common use case here is to customize the query or setting additional query options.<br/>
    For example, we will add a `timeout` option in the results query below.<br/>
    ```js
    const searchbase = new Searchbase({
        index: "appname",
        url: "https://scalr.api.appbase.io",
        credentials: "abcdef123:abcdef12-ab12-ab12-ab12-abcdef123456",
        transformQuery: query =>  Promise.resolve({
            ...query,
            timeout: '1s'
        })
    });
    ```
    You can also define it outside of the constructor.

    ```js
    const searchbase = new Searchbase({
        index: "appname",
        url: "https://scalr.api.appbase.io",
        credentials: "abcdef123:abcdef12-ab12-ab12-ab12-abcdef123456"
    });
    searchbase.transformQuery = query =>  Promise.resolve({
        ...query,
        timeout: '1s'
    });
    ```
-   **transformSuggestionsQuery** `(query: Object) => Promise<Object>`
    It works in a same way as `transformQuery`, except it transforms the suggestions query DSL instead of results query.

> Note:
>
> Please note that the `transformQuery` and `transformSuggestionsQuery` callbacks are called before the `transformRequest` call is made.
-   **beforeValueChange** `(value: string) => Promise<any>`
    is a callback function which accepts the component's future **value** as a parameter and **returns** a promise. It is called everytime before a component's value changes. The promise, if and when resolved, triggers the execution of the component's query and if rejected, kills the query execution. This method can act as a gatekeeper for query execution since it only executes the query after the provided promise has been resolved.<br/>
    For example:
    ```js
    const searchbase = new Searchbase({
        index: "appname",
        url: "https://scalr.api.appbase.io",
        credentials: "abcdef123:abcdef12-ab12-ab12-ab12-abcdef123456",
        beforeValueChange: value =>  function(value) {
            // called before the value is set
            // returns a promise
            return new Promise((resolve, reject) => {
                // update state or component props
                resolve()
                // or reject()
            })
        }
    });
    ```
-   **sortBy** `string`
    sort the results by either `asc` or `desc` order. It is an alternative to `sortOptions`, both can’t be used together.
-   **sortByField** `string`
    data field which is useful for providing a sorting context to the results query.
-   **nestedField** `string`
    set the `nested` field path that allows an array of objects to be indexed in a way that can be queried independently of each other. Applicable only when dataField's mapping is of `nested` type.
-   **sortOptions** `Array<SortOption>`
    ```ts
    type SortOption = {
    	label: string;
    	dataField: string;
    	sortBy: string;
    };
    ```
    an alternative to the `sortBy` prop, `sortOptions` can be used to create a sorting view in the UI. Each array element is an object that takes three keys:
    -   `label` - label to be displayed in the UI.
    -   `dataField` - data field to use for applying the sorting criteria on.
    -   `sortBy` - specified as either `asc` or `desc`.

### An example with all properties
```js
const searchbase = new Searchbase({
    index: "appname",
    url: "https://scalr.api.appbase.io",
    credentials: "abcdef123:abcdef12-ab12-ab12-ab12-abcdef123456",
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
    highlight: true,
    highlightFields: ["original_title", "original_title.raw"],
    value: "",
    suggestions: [{
        label: "Harry Potter",
        value: "harry"
    }],
    results: [],
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
    sortOptions: [],
    sortByField: "",
    transformQuery: (query) => Promise.resolve({
        ...query,
        timeout: "1s"
    }),
    transformSuggestionsQuery: (query) => Promise.resolve({
        ...query,
        timeout: "1s"
    }),
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

##Getter properties
These properties are automatically calculated or managed by the `Searchbase` class. The library user is not expected to modify these properties.
-   **suggestions** `Results`
    It is an object which contains the following properties of `suggestions` query response.
    -   **`data`**: `Array<Suggestion>`
    `data` property contains the (promoted data + parsed suggestions) results, a `Suggestion` object has the following format:
        ```ts
        type Suggestion = {
            label: string;
            value: string;
            source?: any;
        };
        ```
    -   **`raw`**: `Object`
    Response returned by ES query in the raw form.
    -   **`numberOfResults`**: `number` Total number of results found
    -   **`time`**: `number` Total time taken by request (in ms)
    -   **`hidden`**: `number` Total number of hidden results found
    -   **`promoted`**: `number` Total number of promoted results found
    -   **`promotedData`**: `Array<Object>` An array of promoted results obtained from the applied query.
    -   **`customData`**: `Object` An object of custom data obtained from the `reactivesearch-v3` API. [Read More](/docs/search/reactivesearch-api/).
    -   **`rawData`**: `object`  An object of raw response as-is from elasticsearch query.
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
    -   **`rawData`**: `object`  An object of raw response as-is from elasticsearch query.
-   **aggregations** `CompositeAggregationResults`
    It is an object which contains the following details of `composite aggregations` query response.
    -   **`data`**: `Array<Object>` contains the parsed aggregations
    -   **`raw`**: `Object` Response returned by ES `composite aggs` query in the raw form.
    -   **`rawData`**: `object`  An object of raw response as-is from elasticsearch query.
    -   **`afterKey`**: `Object` If the number of composite buckets is too high (or unknown) to be returned in a single response use the `afterKey` parameter to retrieve the next results.
-   **query** `Object`
    The ElasticSearch query that is to be executed
-   **suggestionsQuery** `Object`
    The query executed for getting suggestions
-   **requestPending** `boolean`
    Useful for getting the status of the API, whether it has been executed or not
-   **suggestionsRequestPending** `boolean`
    Useful for telling whether suggestions has been fetched or not
-   **micStatus** `MicStatusField`
    Returns the current status of the mic. Can be `INACTIVE`, `ACTIVE` or `DENIED`
-   **micActive** `boolean`
    Returns `true` if mic is active
-   **minInactive** `boolean`
    Returns `true` if mic is inactive
-   **micDenied** `boolean`
    Returns `true` if it doesn't have access to the mic
-   **micInstance**
    Returns the current mic instance. Can be used to set mic language and other properties of mic

##Setters
> Note:
> All of the methods accept options as the second parameter which has the following shape:
>
```ts
{
    triggerQuery?: boolean, // defaults to `true`
    triggerSuggestionsQuery?: boolean, // defaults to `false`
    stateChanges?: boolean // defaults to `true`
};
```

-   **triggerQuery**
    `true` executes the `results` query after making the changes
-   **triggerSuggestionsQuery**
    `true` executes the `suggestions` query after making the changes
-   **stateChanges**
    `true` invokes the subscribed functions to `subscribeToStateChanges` method, i.e trigger the re-render after making changes

The following methods of `Searchbase` class can be used to set or update the search properties:
-   **setHeaders** `(headers: Object, options?: Options) => void`
can be used to set the `headers` property
-   **setSize** `(size: number, options?: Options) => void`
can be used to set the `size` property
-   **setFrom** `(from: number, options?: Options) => void`
can be used to set the `from` property, which is useful while implementing pagination
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
-   **setDataField** `(
        dataField: string | Array<string | DataField>,
        options?: Options
    ) => void`
can be used to set the `dataField` property
-   **setResults** `(results: Array<Object>, options?: Option) => void`
can be used to set the custom `results`
-   **setSuggestions** `(suggestions: Array<Suggestion>, options?: Option) => void`
can be used to set the custom `suggestions`
-   **setValue** `(value: string, options?: Options) => void`
can be used to set the `value` property


##Callback of change events
You can define the following events callback to listen for the search state changes. The callback function accepts the updated value as the first param and the previous value as the second param. These callback functions may be used in the following scenarios:
1. Perform side-effects e.g. make a network request,
2. Update the UI. However it is recommended to use the `subscribeToStateChanges` to update the UI which uses `Searchbase` properties.


- **onValueChange** `(next: string, prev: string) => void`
can be used to listen for the `value` property changes. <br/>
```js
    const searchbase = new Searchbase({
        index: "appname",
        url: "https://scalr.api.appbase.io",
        credentials: "abcdef123:abcdef12-ab12-ab12-ab12-abcdef123456"
    });
    searchbase.onValueChange = (nextValue, prevValue) =>  {
        // do something with the updated or previous values
    };
```
- **onResults** `(next: string, prev: string) => void`;
can be used to listen for the `results` property changes
- **onSuggestions** `(next: string, prev: string) => void`;
can be used to listen for the `suggestions` property changes
- **onAggregationData** `(next: string, prev: string) => void`;
can be used to listen for the `aggregations` property changes
```javascript
    const searchbase = new Searchbase({
    	index: 'good-book-ds-latest',
    	url: 'https://scalr.api.appbase.io',
    	credentials: 'IPM14ICqp:8e573e86-8802-4a27-a7a1-4c7d0c62c186',
    	dataField: 'original_title',
    	aggregationField: 'original_title.keyword',
    });
    // using callback
    searchbase.onAggregationData(next, prev) {}
```
- **onError** `(error: any) => void`;
called when there is an error while fetching results
- **onSuggestionsError** `(error: any) => void`;
called when there is an error while fetching suggestions
- **onRequestStatusChange** `(next: string, prev: string) => void`;
called when request status changes
- **onSuggestionsRequestStatusChange** `(next: string, prev: string) => void`;
called when suggestions request status changes
- **onQueryChange** `(next: string, prev: string) => void`;
called when query changes
- **onSuggestionsQueryChange** `(next: string, prev: string) => void`;
called when suggestions query changes
- **onMicStatusChange** `(next: string, prev: string) => void`;
called when mic status changes

##Subscribe to the properties changes
Although we have events callback which can be used to update the UI based on a particular property changes, the `subscribeToStateChanges` method gives you more control over the UI rendering logic and is more efficient.

### How does it work?
1. This method is controlled by the `stateChanges` property which can be defined in the [setters](#setters) while updating a particular property. If `stateChanges` is set to `true`, then only the subscribed functions will be called unlike events callback which gets called every time when a property changes it's value.<br/>
So basically, `subscribeToStateChanges` provides more control over the events callback in a way that you can define whether to update the UI or not while setting a particular property's value.<br/>
2. You can define the properties for which you want to update the UI.
3. It allows you to register multiple callback functions for search state updates.

### Usage
```ts
subscribeToStateChanges(
    fn: Function,
    propertiesToSubscribe?: string | Array<string>
): void
```
You can use the `subscribeToStateChanges` method of `Searchbase` class to subscribe to the state changes of the properties. <br/>
A common use-case is to subscribe a component or DOM element to a particular property or a set of properties & update the UI according to the changes. <br/>
The callback function accepts an object in the following shape:
```js
{
    [propertyName]: { // property name for example, `results`
        prev: any; // previous value of the property
        next: any; // next value of the property
    }
}
```

Let's check this example to bind a React component with the `results` property change.

```js
import React from 'react';

class Results extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            results: []
        }
        const searchbase = new Searchbase(config);
        searchbase.subscribeToStateChanges(this.stateChangeHandler, 'results');
    }
    stateChangeHandler = ({ results }) => {
        console.log('prev value', results.prev, suggestions.prev);
        console.log('next value', results.next, suggestions.next);
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

##Unsubscribe to the properties changes
It is recommended to unsubscribe the callback functions after the component has been unmounted.

For example in `React`, we can use the `componentWillUnmount` life cycle method to unsubscribe to the changes.
```js
componentWillUnmount() {
    searchbase.unsubscribeToStateChanges(this.stateChangeHandler);
}
```
