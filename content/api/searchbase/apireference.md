---
title: 'API Reference'
meta_title: 'API Reference to SearchBase'
meta_description: 'SearchBase is a lightweight & platform agnostic search library with some common utilities.'
keywords:
    - quickstart
    - javascript
    - appbase
    - elasticsearch
    - searchbase
    - search library
sidebar: 'api-reference'
---

[searchbase](https://github.com/appbaseio/searchbase) - A lightweight & platform agnostic search library with some common utilities.

##Constructor
The constructor of searchbase is called with the following props:

```js
const searchbase = new SearchBase(props);
```

###Props

-   **index** `string`
    Elasticsearch index name
-   **url** `string`
    Elasticsearch URL
-   **credentials** `string`
    Auth credentials if any
-   **analytics** `boolean`
    To enable the recording of analytics
-   **headers** `Object`
    Request headers
-   **value** `string`
    Value of the search input which will be used to build the search query
-   **suggestions** `Array<Suggestion>`
    where `Suggestion` is of type:
    ```typescript
    type Suggestion = {
    	label: string;
    	value: string;
    	source?: any;
    };
    ```
-   **results** `Array<Object>`
-   **fuzziness** `string | number`
    Sets a maximum edit distance on the search parameters, can be 0, 1, 2 or “AUTO”. Useful for showing the correct results for an incorrect search parameter by taking the fuzziness into account. For example, with a substitution of one character, fox can become box.
    Read more about it in the elastic search [docs](https://www.elastic.co/guide/en/elasticsearch/guide/current/fuzziness.html)
-   **searchOperators** `boolean`
-   **queryFormat** `QueryFormat`
    ```typescript
    type QueryFormat = 'or' | 'and';
    ```
-   **size** `number`
    Number of results to fetch per request
-   **from** `number`
    To define from which page to start the results, important to implement pagination.
-   **dataField** `string | Array<string | DataField>`
    ```typescript
    type DataField = {
    	field: string;
    	weight: number;
    };
    ```
-   **includeFields** `Array<string>`
    fields to be included in search results
-   **excludeFields** `Array<string>`
    fields to be excluded in search results
-   **transformQuery** `(query: Object) => Promise<Object>`
    Transform the default query applied
-   **transformSuggestionsQuery** `(query: Object) => Promise<Object>`
    Transform the default suggestions query applied
-   **transformRequest** `(requestOptions: Object) => Promise<Object>`
    Transform the default request request applied
-   **transformResponse** `(response: any) => Promise<any>`
    Transform the response received from the API
-   **beforeValueChange** `(value: string) => Promise<any>`
    To change the value before setting it
-   **sortBy** `string`
    sort the results by either asc or desc order.
    It is an alternative to sortOptions, both can’t be used together.
-   **nestedField** `string`
-   **sortOptions** `Array<SortOption>`

    ```typescript
    type SortOption = {
    	label: string;
    	dataField: string;
    	sortBy: string;
    };
    ```

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

```typescript
micStatus: MicStatusField;
micInstance: any;
micActive: boolean;
micInactive: boolean;
micDenied: boolean;
query: Object;
suggestionsQuery: Object;
requestPending: boolean;
suggestionsRequestPending: boolean;
```
