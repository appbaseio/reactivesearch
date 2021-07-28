---
title: 'SearchBox API Reference'
meta_title: 'Documentation for React Native SearchBox'
meta_description: 'SearchBox offers a lightweight and performance focused searchbox UI component to query and display results from your Elasticsearch cluster.'
keywords:
    - react-native-searchbox
    - search library
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'react-native-searchbox-reactivesearch'
---

## How does it work?

SearchBox offers a lightweight and performance focused searchbox UI component to query and display results from your Elasticsearch cluster.

## Props

### Configure appbase.io environment

The below props are only needed if you're not using the `SearchBox` component under [SearchBase](docs/reactivesearch/searchbase/overview/searchbase/) provider. These props can also be used to override the global environment defined in the [SearchBase](docs/reactivesearch/searchbase/overview/searchbase/) component.

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

### To configure the ReactiveSearch API

The following properties can be used to configure the appbase.io [ReactiveSearch API](/docs/search/reactivesearch-api/):

-   **id** `string` [Required]
    unique identifier of the component, can be referenced in other components' `react` prop.

-   **dataField** `string | Array<string | DataField>`
    index field(s) to be connected to the component’s UI view. SearchBox accepts an `Array` in addition to `string`, which is useful for searching across multiple fields with or without field weights.<br/>
    Field weights allow weighted search for the index fields. A higher number implies a higher relevance weight for the corresponding field in the search results.<br/>
    You can define the `dataField` property as an array of objects of the `DataField` type to set the field weights.<br/>
    The `DataField` type has the following shape:

    ```ts
    type DataField = {
    	field: string;
    	weight: number;
    };
    ```

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

```jsx
<SearchBox
    id="search-component"
    dataField={["original_title", "original_title.search"]}
    react={{
		and: {
			or: ['CityComp', 'TopicComp'],
			not: 'BlacklistComp',
		},
	}}
/>
```

Here, we are specifying that the suggestions should update whenever one of the blacklist items is not present and simultaneously any one of the city or topics matches.

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
	> Note: This prop has been marked as deprecated starting v1.2.0. Please use the `distinctField` prop instead.

```jsx
<SearchBox
    id="search-component"
    dataField={["original_title", "original_title.search"]}
    aggregationField="original_title.keyword"
    onAggregationData={(next, prev) => {}}
/>
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
    Defaults to `false`. If set to `true` than it allows you to create a complex search that includes wildcard characters, searches across multiple fields, and more. Read more about it [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html).

-   **distinctField** `String` [optional]
	This prop returns only the distinct value documents for the specified field. It is equivalent to the `DISTINCT` clause in SQL. It internally uses the collapse feature of Elasticsearch. You can read more about it over [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/collapse-search-results.html).


-   **distinctFieldConfig** `Object` [optional]
	This prop allows specifying additional options to the `distinctField` prop. Using the allowed DSL, one can specify how to return K distinct values (default value of K=1), sort them by a specific order, or return a second level of distinct values. `distinctFieldConfig` object corresponds to the `inner_hits` key's DSL.  You can read more about it over [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/collapse-search-results.html).

```jsx
<SearchBox
	....
	distinctField="authors.keyword"
	distinctFieldConfig={{
		inner_hits: {
			name: 'most_recent',
			size: 5,
			sort: [{ timestamp: 'asc' }],
		},
		max_concurrent_group_searches: 4,
	}}
/>
```

### To customize the AutoSuggestions

-   **enablePopularSuggestions** `Boolean`
    Defaults to `false`. When enabled, it can be useful to curate search suggestions based on actual search queries that your users are making. Read more about it over [here](/docs/analytics/popular-suggestions/).
-   **maxPopularSuggestions** `Number` can be used to configure the size of popular suggestions. The default value is `5`.
-   **enableRecentSearches** `Boolean` Defaults to `false`. If set to `true` then users will see the top recent searches as the default suggestions. Appbase.io recommends defining a unique id for each user to personalize the recent searches.
> Note: Please note that this feature only works when `recordAnalytics` is set to `true` in `appbaseConfig`.

For example,
```js
    <SearchBase
        index="good-books-ds"
        credentials="a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61"
        url="https://arc-cluster-appbase-demo-6pjy6z.searchbase.io"
        appbaseConfig={{
            recordAnalytics: true,
            // Unique user id or use device id
            userId: 'jon@appbase.io',
        }}
    >
        <SearchBox
            id="search-component"
            dataField={[
                {
                    field: 'original_title',
                    weight: 1
                },
                {
                    field: 'original_title.search',
                    weight: 3
                }
            ]}
            enableRecentSearches
        />
    </SearchBase>
```
-   **enablePredictiveSuggestions** `bool` [optional]
    Defaults to `false`. When set to `true`, it predicts the next relevant words from a field's value based on the search query typed by the user. When set to `false` (default), the entire field's value would be displayed. This may not be desirable for long-form fields (where average words per field value is greater than 4 and may not fit in a single line).

```jsx
<SearchBox
	....
	enablePredictiveSuggestions
/>
```
-   **showAutoFill** `Boolean` Defaults to `true`. This property allows you to enable the auto-fill behavior for suggestions. It helps users to select a suggestion without applying the search which further refines the auto-suggestions i.e minimizes the number of taps or scrolls that the user has to perform before finding the result.
-   **showDistinctSuggestions** `Boolean` Show 1 suggestion per document. If set to `false` multiple suggestions may show up for the same document as the searched value might appear in multiple fields of the same document, this is true only if you have configured multiple fields in `dataField` prop. Defaults to `true`.
    <br/> <br/>
    **Example** if you have `showDistinctSuggestions` is set to `false` and have the following configurations

        ```js
        // Your document:
        {
            "name": "Warn",
            "address": "Washington"
        }
        // Component:
        <SearchBox dataField={['name', 'address']} />
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

### To customize the SearchBox UI

-   **searchBarProps** `Object`
    Searchbox uses the [SearchBar](https://reactnativeelements.com/docs/searchbar/) component from [react-native-elements](https://reactnativeelements.com/) to render the input box that means it supports all the properties that are described [here](https://reactnativeelements.com/docs/searchbar#props).

-   **placeholder** `string` set placeholder text to be shown in the component's input field. Defaults to "Search".

-   **autosuggest** `Boolean` set whether the autosuggest functionality should be enabled or disabled. Defaults to `true`.

-   **defaultSuggestions** `Array<Object>` preset search suggestions to be shown on focus when the SearchBox does not have any search query text set. Accepts an array of objects each having a **label** and **value** property. The label can contain either String or an HTML element. For example

```jsx
<SearchBox
    defaultSuggestions={[
        {
            label: 'Songwriting',
            value: 'Songwriting'
        },
        {
            label: 'Musicians',
            value: 'Musicians'
        }
    ]}
>
```
-   **debounce** `wholeNumber` delays executing the query by the specified time in **ms** while the user is typing. Defaults to `0`, i.e. no debounce. Useful if you want to save on the number of requests sent.

-   **renderItem** `Function` is useful to customize the suggestion list item. This function accepts two params:
    -   **suggestion** `object` represents the suggestion item that has `label`, `value` and `source` properties. In the case of a popular suggestion, the `source` object will have a property named `_popular_suggestion` as `true`.
    -   **isRecentSearch** `boolean` if `true` then it means that the suggestion is a recent search.
    For example,
```jsx
    <SearchBox
        renderItem={(item, isRecentSearch) => (
                <Text style={{ color: isRecentSearch ? 'blue' : 'red' }}>
                    {item.label}
                </Text>
            )
        }
/>
```
-   **render** `Function`
    You can render suggestions in a custom layout by using the `render` prop.
    <br/>
    It accepts an object with these properties:
    -   **`loading`**: `boolean`
        indicates that the query is still in progress.
    -   **`error`**: `object`
        An object containing the error info.
    -   **`data`**: `array`
        An array of suggestions obtained from combining `promoted` suggestions along with the `hits` .
    -   **`popularSuggestions`**: `array`
        An array of popular suggestions obtained based on search value.
    -   **`recentSearches`**: `array`
        represents the recent searches made by user if `enableRecentSearches` is set to `true`
    -   **`rawData`** `object`
        An object of raw response as-is from elasticsearch query.
    -   **`promotedData`**: `array`
        An array of promoted results obtained from the applied query. [Read More](/docs/search/rules/).
    -   **`customData`** `object`
        Custom data set in the query rule when appbase.io is used as backend. [Read More](/docs/search/rules/#custom-data)
    -   **`resultStats`**: `object`
        An object with the following properties which can be helpful to render custom stats:
        -   **`numberOfResults`**: `number`
            Total number of results found
        -   **`time`**: `number`
            Time taken to find total results (in ms)
        -   **`hidden`**: `number`
            Total number of hidden results found
        -   **`promoted`**: `number`
            Total number of promoted results found
    -   **`value`**: `string`
        current search input value i.e the search query being used to obtain suggestions.
    -   **`triggerClickAnalytics`**: `function`
        A function which can be called to register suggestions click analytics. [Read More](docs/reactivesearch/v3/advanced/analytics/)

-   **renderError** `Function`
    can be used to render an error message in case of any error.

```jsx
<SearchBox
    renderError={(error) => (
            <Text>
                Something went wrong!<br/>Error details<br/>{JSON.stringify(error)}
            </Text>
        )
    }
/>
```

-   **renderNoSuggestion** `string|JSX`
    can be used to render a message in case of no list items.

-   **autoFillIcon**: `any`
    This prop allows to override the [Icon props](https://reactnativeelements.com/docs/icon#props) or use a custom component. Use `null` or `false` to hide the icon.

-   **recentSearchIcon**: `any`
    This prop allows to override the [Icon props](https://reactnativeelements.com/docs/icon#props) or use a custom component. Use `null` or `false` to hide the icon.

-   **goBackIcon**: `any`
    This prop allows to override the [Icon props](https://reactnativeelements.com/docs/icon#props) or use a custom component. Use `null` or `false` to hide the icon.

### Customize style

-   **theme** `Object`
    Searchbox uses the [SearchBar](https://reactnativeelements.com/docs/searchbar/) component from [react-native-elements](https://reactnativeelements.com/) that means you can configure the theme with the help of `react-native-elements` [theme object](https://reactnativeelements.com/docs/customization#the-theme-object).

-   **style** `Object`
    CSS styles to be applied to the **SearchBox** component.

-   **searchHeaderStyle** `Object`
    allows to customize the header for the auto-suggestions modal

-   **suggestionsContainerStyle** `Object`
    can be used to customize the style for suggestions container

-   **separatorStyle** `Object`
    useful to customize the suggestion separator UI

> Note: To customize the UI for input box please take a look at the style props defined for [SearchBar](https://reactnativeelements.com/docs/searchbar#props) component from `react-native-elements`. The `SearchBox` component accepts a prop named `searchBarProps` that can be used to pass the props to `SearchBar` component from `react-native-elements`.

### Controlled behavior

-   **defaultValue** `string` set the initial search query text on mount.

-   **value** `string` [optional]
    sets the current value of the component. It sets the search query text (on mount and on update). Use this prop in conjunction with the `onChange` prop.

-   **onChange** `Function` [optional]
    is a callback function which accepts component's current **value** as a parameter. It is called when you are using the `value` prop and the component's value changes. This prop is used to implement the [controlled component](https://reactjs.org/docs/forms.html/#controlled-components) behavior.

    ```js
	import { SearchContext } from '@appbaseio/react-searchbox';
	const Search = () => {
		// To retrieve the searchbase context
		const searchbase = useContext(SearchContext);
		useEffect(() => {
			// Get the instance of search component
			const searchComponent = searchbase.getComponent('book-search');
			if(searchComponent) {
				// To fetch suggestions
				searchComponent.triggerDefaultQuery();
				// To update results
				searchComponent.triggerCustomQuery();
			}
		}, [text])
		return (
			<SearchBox
				id="book-search"
				value={text}
				onChange={(value) => {
					setText(value);
				}}
			/>
		)
	}
    ```

### Callbacks for change events

-   **onValueChange** `Function` is a callback function which accepts component's current **value** as a parameter. It is called every-time the component's value changes. This prop is handy in cases where you want to generate a side-effect on value selection. For example: You want to show a pop-up modal with the valid discount coupon code when a user searches for a product in a SearchBox.

-   **onValueSelected** `Function` A function callback which executes on selecting a value from result set

-  **onError** `Function` gets triggered in case of an error while fetching results

-  **onResults** `Function` can be used to listen for the suggestions changes

-   **onQueryChange** `Function`
    is a callback function which accepts component's **prevQuery** and **nextQuery** as parameters. It is called everytime the component's query changes. This prop is handy in cases where you want to generate a side-effect whenever the component's query would change.

-   **onAggregationData** `Function` can be used to listen for the `aggregationData` property changes
    - **data**: `Array<Object>` contains the parsed aggregations
    - **raw**: `Object` Response returned by ES composite aggs query in the raw form.
    - **rawData**: `Object` An object of raw response as-is from elasticsearch query.
    - **afterKey**: `Object` If the number of composite buckets is too high (or unknown) to be returned in a single response use the afterKey parameter to retrieve the next

-   **onBlur** `Function` is a callback handler for input blur event

-   **onKeyPress** `Function` is a callback handler for keypress event

-   **onFocus** `Function` is a callback handler for input focus event

### To customize the query execution

-   **headers** `Object`
    set custom headers to be sent with each server request as key/value pairs. For example:

```jsx
<SearchBox
    id="search-component"
    dataField={["original_title", "original_title.search"]}
/>
```

-   **transformRequest** `(requestOptions: Object) => Promise<Object>`
    Enables transformation of network request before execution. This function will give you the request object as the param and expect an updated request in return, for execution.<br/>
    For example, we will add the `credentials` property in the request using `transformRequest`.

```jsx
<SearchBox
    id="search-component"
    dataField={["original_title", "original_title.search"]}
    transformRequest= {request =>
        Promise.resolve({
            ...request,
            credentials: include,
        })
    }
/>
```

-   **transformResponse** `(response: any) => Promise<any>`
    Enables transformation of search network response before rendering them. It is an asynchronous function which will accept an Elasticsearch response object as param and is expected to return an updated response as the return value.<br/>
    For example:

```jsx
<SearchBox
    id="search-component"
    dataField={["original_title", "original_title.search"]}
    transformResponse={async elasticsearchResponse => {
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
	}}
/>
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
    is a callback function that takes [SearchComponent](docs/reactivesearch/searchbase/overview/searchcomponent/) instance as parameter and **returns** the data query to be applied to the suggestions, as defined in Elasticsearch Query DSL, which doesn't get leaked to other components. In simple words, `defaultQuery` is used with data-driven components to impact their own data.

    For example, set the `timeout` to `1s` for suggestion query.

```jsx
<SearchBox
    id="search-component"
    dataField={["original_title", "original_title.search"]}
    defaultQuery={() => ({
        "timeout": "1s"
    })}
/>
```

-   **customQuery**: `(component: SearchComponent) => Object`
    takes [SearchComponent](docs/reactivesearch/searchbase/overview/searchcomponent/) instance as parameter and **returns** the query to be applied to the dependent components by `react` prop, as defined in Elasticsearch Query DSL.

    For example, the following example has two components `search-component`(to render the suggestions) and `result-component`(to render the results). The `result-component` depends on the `search-component` to update the results based on the selected suggestion. The `search-component` has the `customQuery` prop defined that will not affect the query for suggestions(that is how `customQuery` is different from `defaultQuery`) but it'll affect the query for `result-component` because of the `react` dependency on `search-component`.

```jsx
<SearchBase
    index="gitxplore-app"
    url="https://@arc-cluster-appbase-demo-6pjy6z.searchbase.io"
    credentials="a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61"
/>
    <SearchBox
        id="search-component"
        dataField={["original_title", "original_title.search"]}
        customQuery={
            () => ({
                timeout: '1s',
                query: {
                    match_phrase_prefix: {
                        fieldName: {
                            query: 'hello world',
                            max_expansions: 10,
                        },
                    },
                },
            })
        }
    />
    <SearchComponent
        id="result-component"
        dataField="original_title"
        react={{
            and: ['search-component']
        }}
    />
```

### Miscellaneous

-  **beforeValueChange** `Function`
    is a callback function that accepts the component's future **value** as a parameter and **returns** a promise. It is called every-time before a component's value changes. The promise, if and when resolved, triggers the execution of the component's query and if rejected, kills the query execution. This method can act as a gatekeeper for query execution since it only executes the query after the provided promise has been resolved.
    For example:

```jsx
<SearchBox
    id="search-component"
    dataField={["original_title", "original_title.search"]}
    beforeValueChange={
        function(value) {
            // called before the value is set
            // returns a promise
            return new Promise((resolve, reject) => {
                // update state or component props
                resolve();
                // or reject()
            });
        }
    }
/>
```
