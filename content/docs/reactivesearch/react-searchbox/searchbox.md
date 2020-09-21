---
title: 'SearchBox API Reference'
meta_title: 'Documentation for React SearchBox'
meta_description: 'React SearchBox is a lightweight library that provides scaffolding to create search experiences powered by Elasticsearch.'
keywords:
    - react-searchbox
    - search library
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'react-searchbox-reactivesearch'
---

## SearchBox

SearchBox offers a lightweight and performance focused searchbox UI component to query and display results from your Elasticsearch cluster.

### Props

#### To customize the AutoSuggestions

-   **enableQuerySuggestions** `Boolean`
    Defaults to `false`. When enabled, it can be useful to curate search suggestions based on actual search queries that your users are making. Read more about it over [here](/docs/analytics/query-suggestions/).

    > Note:
    >
    > Query Suggestions only work when `enableAppbase` prop is `true`.

-   **showDistinctSuggestions** `Boolean` Show 1 suggestion per document. If set to `false` multiple suggestions may show up for the same document as
    searched value might appear in multiple fields of the same document, this is true only if you have configured multiple fields in `dataField` prop. Defaults to `true`.
    <br/> <br/>
    **Example** if you have `showDistinctSuggestions` is set to `false` and have following configurations

        ```js
        // Your document:
        {
            "name": "Warn",
            "address": "Washington"
        }
        // Component:
        <Searchbox dataField=['name', 'address'] ... />
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

#### To configure the SearchBox API

-   **id** `string` [required] a unique identifier for the query can be referenced in the react property of other queries.

-   **dataField** `dataFieldValidator`
    database field(s) to be queried against. Accepts a String or an Array of either String or `DataField` type. The latter is useful for searching across multiple fields with field weights.<br/>
    Think of field weights as a way to apply weighted search. To use field weights, you can define the `dataField` prop as an array of objects of `DataField` type.<br/>
    The `DataField` type has the following shape:

    > Note:
    > This prop is optional only when `enableAppbase` prop is set to `true`.

-   **aggregationField** `string`
    One of the most important use-cases this enables is showing `DISTINCT` results (useful when you are dealing with sessions, events and logs type data).
    It utilizes `composite aggregations` which are newly introduced in ES v6 and offer vast performance benefits over a traditional terms aggregation.
    You can read more about it over [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-composite-aggregation.html).
    You can use `aggregationData` using `onAggregationData` callback.

    ```javascript
    <SearchBox
        app="good-book-ds-latest"
        credentials="IPM14ICqp:8e573e86-8802-4a27-a7a1-4c7d0c62c186"
        dataField="original_title"
        aggregationField="original_title.keyword"
        onAggregationData={(next, prev) => <>}
    />
    ```

    > See impact of aggregationField with these example for [React](/docs/reactivesearch/v3/advanced/groupingresults/#how).

-   **nestedField** `string`
    Set the path of the `nested` type under which the `dataField` is present. Only applicable only when the field(s) specified in the `dataField` is(are) present under a [`nested` type](https://www.elastic.co/guide/en/elasticsearch/reference/current/nested.html) mapping.

-   **size** `number` To set the number of results to be returned by a query.

-   **title** `string` sets the title of the search component

-   **defaultValue** `string` sets the default values to be shown

-   **value** `string` controls the current value of the component. It selects the item from the list (on mount and on update)

-   **downShiftProps** `Object` are the props to be passed to `DownShift` for typeahead configurations

-   **placeholder** `string` is the placeholder for the search input

-   **showIcon** `Boolean` shows the icon in the search input box

-   **iconPosition** `position` Change icon positions either to left or right

-   **icon** `any` adds any icon to be shown in the search input box

-   **showClear** `Boolean` shows clear icon in the search input box

-   **clearIcon** `any` sets custom clear icon for the search input box

-   **autosuggest** `Boolean` enables autosuggestion while typing

-   **strictSelection** `Boolean` defaults to `false`. When set to `true`, the component will only set its value and fire the query if the value was selected from the suggestion. Otherwise the value will be cleared
    on selection. This is only relevant with `autosuggest`.

-   **defaultSuggestions** `suggestionsDef` preset search suggestions to be shown on focus when the SearchBox does not have any search query text set. Accepts an array of objects each having a **label** and
    **value** property. The label can contain either String or an HTML element.

-   **debounce** `wholeNumber` delays executing the query by the specified time in **ms** while the user is typing. Defaults to `0`, i.e. no debounce. Useful if you want to save on the number of requests sent.

-   **highlight** `Boolean` highglights search string in the result set

-   **highlightField** `Boolean` highglights the search field

-   **customHighlight** `Function`A function which can allow custom highlighting flexibilities

-   **queryFormat** `string` Sets the query format, can be **or** or **and**. Defaults to **or**.

-   **fuzziness** `fuzzinessDef` Sets a maximum edit distance on the search parameters, can be **0**, **1**, **2** or **"AUTO"**. Useful for showing the correct
    results for an incorrect search parameter by taking the fuzziness into account. For example, with a substitution of one character, **fox** can become **box**. Read more about it in the elastic search [docs](https://www.elastic.co/guide/en/elasticsearch/guide/current/fuzziness.html).

-   **showVoiceSearch** `Boolean` Enable voice search for searchbox

-   **searchOperators** `Boolean` defaults to `false`. If set to `true`, than you can use special characters in the search query to enable an advanced search behavior.<br/>
    Read more about it [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-simple-query-string-query.html).

-   **render** `Function` is a function returning the UI you want to render based on your results. This function receives a list of parameters and expects to return a `JSX`.

-   **renderQuerySuggestions** `Function` You can render query suggestions in a custom layout by using the `renderQuerySuggestions` prop.
    <br/>
    It accepts an object with these properties:

    -   **`loading`**: `boolean`
        indicates that the query is still in progress.
    -   **`error`**: `Object`
        An object containing the error info.
    -   **`data`**: `array`
        An array of query suggestions obtained based on search value.
    -   **`value`**: `string`
        current search input value i.e the search query being used to obtain suggestions.
    -   **`downshiftProps`**: `Object`
        provides all the control props from `downshift` which can be used to bind list items with click/mouse events.
        Read more about it [here](https://github.com/downshift-js/downshift#children-function).

-   **renderError** `Function`
    can be used to render an error message in case of any error.

    ```js
    renderError={(error) => (
            <div>
                Something went wrong!<br/>Error details<br/>{error}
            </div>
        )
    }
    ```

-   **renderNoSuggestion** `titleDef`
    can be used to render a message in case of no list items.

-   **getMicInstance** `Function` You can pass a callback function to get the instance of `SpeechRecognition` object, which can be used to override the
    default configurations.

-   **renderMic** `Function`can be used to render the custom mic option

-   **onChange** `Function` is a callback function which accepts component's current **value** as a parameter. It is called when you are using the `value`
    props and the component's value changes

-   **onValueChange** `Function` is a callback function which accepts component's current **value** as a parameter. It is called every-time the component's value changes. This prop is handy in cases where you
    want to generate a side-effect on value selection. For example: You want to show a pop-up modal with the valid discount coupon code when a user searches for a product in a SearchBox.

-   **onValueSelected** `Function` A function callback which executes on selecting a value from result set

*   **onError** `Function` gets triggered in case of an error while fetching results

*   **onResults** `Function` can be used to listen for the `results` property changes

*   **innerClass** `Object` inject class to the inner levels

*   **style** `Object` Sets custom class properties to inner components

*   **defaultQuery** `Function` This property is useful to customize the source query, as defined in Elasticsearch Query DSL. It is different
    from the customQuery in a way that it doesn't get leaked to other queries(dependent queries by react prop) and only modifies the query for which it has been applied.

*   **beforeValueChange** `Function`
    is a callback function which accepts component's future **value** as a parameter and **returns** a promise. It is called every-time before a component's value changes. The promise, if and when resolved, triggers the execution of the component's query and if rejected, kills the query execution. This method can act as a gatekeeper for query execution, since it only executes the query after the provided promise has been resolved.
    For example:

    ```js
    const component = new Component({
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

*   **onQueryChange** `Function`
    is a callback function which accepts component's **prevQuery** and **nextQuery** as parameters. It is called everytime the component's query changes. This prop is handy in cases where you want to generate a side-effect whenever the component's query would change.

*   **className** `string` You can add a className to any component which gets applied to the component at the root level.

*   **loader** `Object` Display an optional loader while fetching the options

*   **onBlur** `Function` is a callback handler for input blur event

*   **onKeyPress** `Function` is a callback handler for keypress event

*   **onKeyUp** `Function` is a callback handler for keyup event

*   **onFocus** `Function` is a callback handler for input focus event

*   **onKeyDown** `Function` is a callback handler for keydown event

*   **autoFocus** `Boolean` sets focus automatically when the input loads

*   **URLParams** `Boolean` enable creating a URL query string param based on the search query text value. This is useful for sharing URLs with the  
    component state. Defaults to `false`.

*   **appbaseConfig** `appbaseConfigDef` allows you to customize the analytics experience when appbase.io is used as a backend. It accepts an object
    which has the following properties:

    -   **recordAnalytics** `Boolean` allows recording search analytics (and click analytics) when set to `true` and appbase.io is used as a backend. Defaults to `false`.
    -   **enableQueryRules** `Boolean` If `false`, then appbase.io will not apply the query rules on the search requests. Defaults to `true`.
    -   **userId** `String` It allows you to define the user id to be used to record the appbase.io analytics. Defaults to the client's IP address.
    -   **customEvents** `Object` It allows you to set the custom events which can be used to build your own analytics on top of appbase.io analytics. Further, these events can be used to filter the analytics stats from the appbase.io dashboard.

-   **queryString** `Boolean` Defaults to `false`. If set to `true` than it allows you to create a complex search that includes wildcard characters,
    searches across multiple fields, and more. Read more about it [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html).

-   **error** `any` gets triggered in case of an error and provides the `error` object, which can be used for debugging or giving feedback to the user
    if needed.

-   **loading** `Boolean` indicates that the query is still in progress

-   **results** `Object` is an object which contains the following details of `results` query response.

#### Getter Properties

-   **onAggregationData** `Function` can be used to listen for the aggregationData property changes
    -   **data**: Array<Object> contains the parsed aggregations
    -   **raw**: Object Response returned by ES composite aggs query in the raw form.
    -   **rawData**: Object An object of raw response as-is from elasticsearch query.
    -   **afterKey**: Object If the number of composite buckets is too high (or unknown) to be returned in a single response use the afterKey parameter to retrieve the next
    -   **results**. This property will only be present for composite aggregations.
-   **onSuggestions** `Function` A function callback handler triggered on suggestions loading
