---
title: 'API Reference'
meta_title: 'API Reference to SearchBase'
meta_description: 'SearchBase is a lightweight & platform agnostic search library with some common utilities.'
keywords:
    - apireference
    - searchbase
    - elasticsearch
    - search library
sidebar: 'docs'
nestedSidebar: 'searchbase-reactivesearch'
---

[searchbase](https://github.com/appbaseio/searchbase) - A lightweight & platform agnostic search library with some common utilities.

> Note:
>
> The API reference is meant for users of the `Searchbase` in a headless fashion.


##How does it work?

The working of `Searchbase` can be better explained by the following chart.
<br/><br/>

<img alt="Dataset" src="/images/searchbase.png" />

The `Searchbase` library is totally independent of the UI, it provides the necessary utilities to build a powerful search UI. It can be easily integrated with any UI framework. We separated out the search logic so you don't need to worry about the elasticsearch query generation & request execution. `Searchbase` maintains the search `state` and provide some `actions` which can be used to manipulate the state from the UI. Events can be used to listen for the state changes & update the UI accordingly.

Although we don't ship any UI component with `Searchbase` directly but we provide easy to integrate libraries for different platforms, please check `@appbaseio/react-search-ui` for the React framework. The UI solutions for `angular` and `Vue` framework are still in progress.

##Constructor
The constructor of searchbase is called with the following properties:

```js
const searchbase = new SearchBase(props);
```

###Properties

-   **index** `string` [Required]
    Refers to an index if you’re using your own Elasticsearch cluster. (Multiple indexes can be connected to by specifiying comma separated index names)
    If you're using the `appbase.io` hosted app then app name can be used as the `index` value. 
-   **url** `string` [Required]
    URL where Elasticsearch cluster is hosted
-   **dataField** `string | Array<string | DataField>` [Required]
    database field(s) to be connected to the component’s UI view. DataSearch accepts an Array in addition to String, useful for applying search across multiple fields with or without field weights.<br/>
    Field weights set the search weight for the database fields, useful when dataField is an Array of more than one field. This prop accepts an array of numbers. A higher number implies a higher relevance weight for the corresponding field in the search results.<br/>
    You can define the `dataField` as an array of objects of the `DataField` type to define the field weights.<br/>
    The `DataField` type has the following shape:
    ```typescript
    type DataField = {
    	field: string;
    	weight: number;
    };
    ```
-   **credentials** `string`
    app credentials as they appear on the dashboard. It should be a string of the format “username:password” and is used for authenticating the app. If you are not using an appbase.io app, credentials may not be necessary - although having an open-access Elasticsearch cluster is not recommended.
-   **analytics** `boolean`
    allows recording search analytics (and click analytics) when set to `true` and appbase.io is used as a backend. Defaults to `false`. Check the [analytics recipe](/advanced/analytics.html) for click analytics implementation.
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
-   **value** `string`
    Initial value of the search input which will be used to build the search query
-   **suggestions** `Array<Suggestion>`
    where a `Suggestion` is of type:
    ```typescript
    type Suggestion = {
    	label: string;
    	value: string;
    	source?: any;
    };
    ```
    You can define the custom suggestions which can be used to display in the UI, useful when you want to show some suggestions initially when the search input value is empty.
-   **results** `Array<Object>` You can define the custom results as an array of the objects which can be used to display initially when no query has been executed.
-   **fuzziness** `string | number`
    Sets a maximum edit distance on the search parameters, can be 0, 1, 2 or “AUTO”. Useful for showing the correct results for an incorrect search parameter by taking the fuzziness into account. For example, with a substitution of one character, fox can become box.
    Read more about it in the elastic search [docs](https://www.elastic.co/guide/en/elasticsearch/guide/current/fuzziness.html)
-   **searchOperators** `boolean`
    Defaults to `false`, if set to `true` than you can use special characters in the search query to enable the advanced search.<br/>
    Read more about it [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-simple-query-string-query.html).
-   **queryFormat** `QueryFormat` 
    ```typescript
    type QueryFormat = 'or' | 'and';
    ```
    Sets the query format, can be **or** or **and**. Defaults to **or**.
    -   **or** returns all the results matching **any** of the search query text's parameters. For example, searching for "bat man" with **or** will return all the results matching either "bat" or "man".
    -   On the other hand with **and**, only results matching both "bat" and "man" will be returned. It returns the results matching **all** of the search query text's parameters.
-   **size** `number`
    Number of results to fetch per request
-   **from** `number`
    To define from which page to start the results, important to implement pagination.
-   **includeFields** `Array<string>`
    fields to be included in search results
-   **excludeFields** `Array<string>`
    fields to be excluded in search results
-   **transformRequest** `(requestOptions: Object) => Promise<Object>`
    Enables transformation of network request before execution. This function will give you the the request object as the param and expect an updated request in return, for execution.<br/>
    For example add the `credentials` property in the request.
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
    Enables transformation of search network response before rendering them. This asynchronous function will give you elasticsearch response object as param and expects an updated response in return in similar structure of elasticsearch.<br/>
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
> `transformResponse` function is expected to return data in following structure.

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
    This async function can be used to modify the default query DSL generated by `Searchbase` before the execution of the network request. It accepts the queryDSL as parameter and expects a promise to be returned which resolves the modified query in the same format.<br/>
    The common use case can be to customize the query or defining the custom query options.<br/>
    For example let's add a `timeout` option in the results query.<br/>
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
    It works in a same way like `transformQuery` except it transforms the suggestions query DSL instead of results query.

> Note:
>
> Please note that the `transformQuery` and `transformSuggestionsQuery` callbacks are called before the `transformRequest`.
-   **beforeValueChange** `(value: string) => Promise<any>`
    is a callback function which accepts component's future **value** as a parameter and **returns** a promise. It is called everytime before a component's value changes. The promise, if and when resolved, triggers the execution of the component's query and if rejected, kills the query execution. This method can act as a gatekeeper for query execution, since it only executes the query after the provided promise has been resolved.<br/>
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
    sort the results by either `asc` or `desc` order.
    It is an alternative to `sortOptions`, both can’t be used together.
-   **nestedField** `string`
    use to set the `nested` mapping field that allows arrays of objects to be indexed in a way that they can be queried independently of each other. Applicable only when dataField is a part of `nested` type.
-   **sortOptions** `Array<SortOption>`
    ```typescript
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

##Subsrcibe

```js
const searchbase = new SearchBase(props)
searchbase.subscribeToStateChanges(({results, suggestions}), {
    console.log('prev value', results.prev, suggestions.prev);
    console.log('next value', results.next, suggestions.next);
}, ['results', 'suggestions'])
```

##Unsubscribe

```js
const searchbase = new SearchBase(props);
searchbase.unsubscribeToStateChanges(() => {});
```

##Callback of change events

```typescript
  // called when value changes
  onValueChange: (next: string, prev: string) => void;

  // called when results change
  onResults: (next: string, prev: string) => void;

  // called when suggestions change
  onSuggestions: (next: string, prev: string) => void;

  // called when there is an error while fetching results
  onError: (error: any) => void;

  // called when there is an error while fetching suggestions
  onSuggestionsError: (error: any) => void;

  // called when request status changes
  onRequestStatusChange: (next: string, prev: string) => void;

  // called when suggestions request status changes
  onSuggestionsRequestStatusChange: (next: string, prev: string) => void;

  // called when query changes
  onQueryChange: (next: string, prev: string) => void;

  // called when suggestions query changes
  onSuggestionsQueryChange: (next: string, prev: string) => void;

  // called when mic status changes
  onMicStatusChange: (next: string, prev: string) => void;
```

##Callback to create the side effects while querying

```typescript
transformQuery: (query: Object) => Promise<Object>;

transformSuggestionsQuery: (query: Object) => Promise<Object>;

transformRequest: (requestOptions: Object) => Promise<Object>;

transformResponse: (response: any) => Promise<any>;
```

##Setters
###Note
Most of the methods accepts `options` as the second parameter which has the following shape:

```typescript
{
    triggerQuery?: boolean, // defaults to `true`
    triggerSuggestionsQuery?: boolean, // defaults to `false`
    stateChanges?: boolean // defaults to `true`
};

```

-   **triggerQuery**
    `true` means executes the `results` query after making the changes
-   **triggerSuggestionsQuery**
    `true` means executes the `suggestions` query after making the changes
-   **stateChanges**
    `true` means invoke the subscribed functions to `subscribeToStateChanges` method i.e trigger the re-render after making changes

```typescript
setHeaders: (headers: Object, options?: Options) => void;

setSize: (size: number, options?: Options) => void;

setFrom: (from: number, options?: Options) => void;

setFuzziness: (fuzziness: number | string, options?: Options) => void;

setIncludeFields: (includeFields: Array<string>, options?: Options) => void;

setExcludeFields: (excludeFields: Array<string>, options?: Options) => void;

setSortBy: (sortBy: string, options?: Options) => void;

setSortByField: (sortByField: string, options?: Options) => void;

setNestedField: (nestedField: string, options?: Options) => void;

setDataField: (
dataField: string | Array<string | DataField>,
options?: Options
) => void;

setResults: (results: Array<Object>, options?: Option) => void;

setSuggestions: (suggestions: Array<Suggestion>, options?: Option) => void;

setValue: (value: string, options?: Options) => void;
```

##Getters

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
