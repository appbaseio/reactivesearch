---
title: 'DataSearch'
meta_title: 'DataSearch'
meta_description: '`DataSearch` creates a search box UI component that is connected to one or more database fields.'
keywords:
    - reactivesearch
    - datasearch
    - appbase
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'web-reactivesearch'
---

![Image to be displayed](https://i.imgur.com/rthmjVh.png)

`DataSearch` creates a search box UI component that is connected to one or more database fields.

Example uses:

-   Searching for a rental listing by its `name` or `description` field.
-   Creating an e-commerce search box for finding products by their listing properties.

## Usage

### Basic Usage

```js
<DataSearch componentId="SearchSensor" dataField={['group_venue', 'group_city']} />
```

### Usage With All Props

```js
<DataSearch
	componentId="SearchSensor"
	dataField={['group_venue', 'group_city']}
	title="Search"
	defaultValue="Songwriting"
	fieldWeights={[1, 3]}
	placeholder="Search for cities or venues"
	autosuggest={true}
	defaultSuggestions={[
		{ label: 'Songwriting', value: 'Songwriting' },
		{ label: 'Musicians', value: 'Musicians' },
	]}
	highlight={true}
	highlightField="group_city"
	queryFormat="or"
	fuzziness={0}
	debounce={100}
	react={{
		and: ['CategoryFilter', 'SearchFilter'],
	}}
	size={10}
	showFilter={true}
	filterLabel="Venue filter"
	URLParams={false}
/>
```

## Props

-   **componentId** `String`
    unique identifier of the component, can be referenced in other components' `react` prop.
-   **dataField** `String or Array` [optional*]
    database field(s) to be queried against. Accepts an Array in addition to String, useful for applying search across multiple fields.
>   Note:
>   This prop is optional only when `enableAppbase` prop is set to `true` in `ReactiveBase` component.
>
-   **size** `Number` [optional]
    number of suggestions to show. Defaults to `10`.
-   **aggregationField** `String` [optional]
    One of the most important use-cases this enables is showing `DISTINCT` results (useful when you are dealing with sessions, events and logs type data). It utilizes `composite aggregations` which are newly introduced in ES v6 and offer vast performance benefits over a traditional terms aggregation.
    You can read more about it over [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-composite-aggregation.html). You can access `aggregationData` using render prop as shown:

    ```javascript
    <DataSearch
        aggregationField="original_title.keyword"
        render={({aggregationData}) => {...}}
    />
    ```

    > If you are using an app with elastic search version less than 6, than defining this prop will result in error and you need to handle it manually using **renderError** prop.

    > It is possible to override this query by providing `defaultQuery` or `customQuery`.

	> Note: This prop has been marked as deprecated starting v3.18.0. Please use the `distinctField` prop instead.

-   **aggregationSize**
    To set the number of buckets to be returned by aggregations.

    > Note: This is a new feature and only available for appbase versions >= 7.41.0.
-   **nestedField** `String` [optional]
    Set the path of the `nested` type under which the `dataField` is present. Only applicable only when the field(s) specified in the `dataField` is(are) present under a [`nested` type](https://www.elastic.co/guide/en/elasticsearch/reference/current/nested.html) mapping.
-   **title** `String or JSX` [optional]
    set the title of the component to be shown in the UI.
-   **defaultValue** `string` [optional]
    set the initial search query text on mount.
-   **value** `string` [optional]
    sets the current value of the component. It sets the search query text (on mount and on update). Use this prop in conjunction with the `onChange` prop.
-   **enableSynonyms** `bool` [optional]
    Defaults to `true`, can be used to `disable/enable` the synonyms behavior for the search query. Read more about it [here](/docs/search/reactivesearch-api/reference/#enablesynonyms)
    > Note:
    >
    > This property only works with [ReactiveSearch API](/docs/search/reactivesearch-api/) i.e when `enableAppbase` is set to `true` in `ReactiveBase` component.
-   **enableQuerySuggestions** `bool` [optional]
    This prop has been marked as deprecated starting `v3.12.6`. Please use the `enablePopularSuggestions` prop instead.
-   **enablePopularSuggestions** `bool` [optional]
    Defaults to `false`. When enabled, it can be useful to curate search suggestions based on actual search queries that your users are making. Read more about it over [here](/docs/analytics/popular-suggestions/).

    > Note:
    >
    > Popular Suggestions only work when `enableAppbase` prop is `true`.
-   **enableRecentSearches** `Boolean` Defaults to `false`. If set to `true` then users will see the top recent searches as the default suggestions. Appbase.io recommends defining a unique id(`userId` property) in `appbaseConfig` prop for each user to personalize the recent searches.
> Note: Please note that this feature only works when `recordAnalytics` is set to `true` in `appbaseConfig`.
-   **enablePredictiveSuggestions** `bool` [optional]
    Defaults to `false`. When set to `true`, it predicts the next relevant words from a field's value based on the search query typed by the user. When set to `false` (default), the entire field's value would be displayed. This may not be desirable for long-form fields (where average words per field value is greater than 4 and may not fit in a single line).
-   **downShiftProps** `Object` [optional]
    allow passing props directly to the underlying `Downshift` component. You can read more about Downshift props [here](https://github.com/paypal/downshift#--downshift-------).
-   **fieldWeights** `Array` [optional]
    set the search weight for the database fields, useful when dataField is an Array of more than one field. This prop accepts an array of numbers. A higher number implies a higher relevance weight for the corresponding field in the search results.
-   **placeholder** `String` [optional]
    set placeholder text to be shown in the component's input field. Defaults to "Search".
-   **showIcon** `Boolean` [optional]
    whether to display a search or custom icon in the input box. Defaults to `true`.
-   **iconPosition** `String` [optional]
    sets the position of the search icon. Can be set to either `left` or `right`. Defaults to `right`.
-   **icon** `JSX` [optional]
    set a custom search icon instead of the default 🔍
-   **showClear** `Boolean` [optional]
    show a clear text `X` icon. Defaults to `false`.
-   **clearIcon** `JSX` [optional]
    allows setting a custom icon for clearing text instead of the default cross.
-   **autosuggest** `Boolean` [optional]
    set whether the autosuggest functionality should be enabled or disabled. Defaults to `true`.
-   **strictSelection** `Boolean` [optional]
    defaults to `false`. When set to `true` the component will only set its value and fire the query if the value was selected from the suggestion. Otherwise the value will be cleared on selection. This is only relevant with `autosuggest`.
-   **defaultSuggestions** `Array` [optional]
    preset search suggestions to be shown on focus when the search box does not have any search query text set. Accepts an array of objects each having a **label** and **value** property. The label can contain either String or an HTML element.
-   **debounce** `Number` [optional]
    set the milliseconds to wait before executing the query. Defaults to `0`, i.e. no debounce.
-   **highlight** `Boolean` [optional]
    whether highlighting should be enabled in the returned results.
-   **highlightField** `String or Array` [optional]
    when highlighting is enabled, this prop allows specifying the fields which should be returned with the matching highlights. When not specified, it defaults to applying highlights on the field(s) specified in the **dataField** prop.
-   **customHighlight** `Function` [optional]
    a function which returns the custom [highlight settings](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-highlighting.html). It receives the `props` and expects you to return an object with the `highlight` key. Check out the <a href="https://opensource.appbase.io/reactivesearch/demos/technews/" target="_blank">technews demo</a> where the `DataSearch` component uses a `customHighlight` as given below,

    ```js
    <DataSearch
    	componentId="title"
    	dataField={['title', 'text']}
    	highlight
    	customHighlight={props => ({
    		highlight: {
    			pre_tags: ['<mark>'],
    			post_tags: ['</mark>'],
    			fields: {
    				text: {},
    				title: {},
    			},
    			number_of_fragments: 0,
    		},
    	})}
    />
    ```

-   **queryFormat** `String` [optional]
    Sets the query format, can be **or** or **and**. Defaults to **or**.

    -   **or** returns all the results matching **any** of the search query text's parameters. For example, searching for "bat man" with **or** will return all the results matching either "bat" or "man".
    -   On the other hand with **and**, only results matching both "bat" and "man" will be returned. It returns the results matching **all** of the search query text's parameters.

-   **fuzziness** `String or Number` [optional]
    Sets a maximum edit distance on the search parameters, can be **0**, **1**, **2** or **"AUTO"**. Useful for showing the correct results for an incorrect search parameter by taking the fuzziness into account. For example, with a substitution of one character, **fox** can become **box**. Read more about it in the elastic search [docs](https://www.elastic.co/guide/en/elasticsearch/guide/current/fuzziness.html).
    > Note:
    >
    > This prop doesn't work when the value of `queryFormat` prop is set to `and`.
-   **showFilter** `Boolean` [optional]
    show as filter when a value is selected in a global selected filters view. Defaults to `true`.
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
	<DataSearch dataField=['name', 'address'] .../>

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

`Note:` Check the above concept in action over [here](https://codesandbox.io/s/musing-allen-qc58z).

-   **showVoiceSearch** `Boolean` [optional]
    show a voice icon in the searchbox to enable users to set voice input. Defaults to `false`.
-   **searchOperators** `Boolean` [optional]
    Defaults to `false`. If set to `true` than you can use special characters in the search query to enable an advanced search behavior.<br/>
    Read more about it [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-simple-query-string-query.html).
-   **queryString** `Boolean` [optional]
    Defaults to `false`. If set to `true` than it allows you to create a complex search that includes wildcard characters, searches across multiple fields, and more. Read more about it [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html).
-   **filterLabel** `String` [optional]
    An optional label to display for the component in the global selected filters view. This is only applicable if `showFilter` is enabled. Default value used here is `componentId`.
-   **URLParams** `Boolean` [optional]
    enable creating a URL query string param based on the search query text value. This is useful for sharing URLs with the component state. Defaults to `false`.
-   **excludeFields** `String Array` [optional]
    fields to be excluded in the suggestion's query when `autoSuggest` is true.
-   **includeFields** `String Array` [optional]
    fields to be included in the suggestion's query when `autoSuggest` is true.
-   **render** `Function` [optional]
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
    -   **`querySuggestions`**: `array`
        This prop has been marked as deprecated starting `v3.12.6`. Please use the `popularSuggestions` prop instead.
    -   **`recentSearches`**: `array`
        An array of recent searches made by user if `enableRecentSearches` is set to `true`.
    -   **`rawData`** `object`
        An object of raw response as-is from elasticsearch query.
    -   **`promotedData`**: `array`
        An array of promoted results obtained from the applied query. [Read More](/docs/search/rules/).
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
    -   **`downshiftProps`**: `object`
        provides all the control props from `downshift` which can be used to bind list items with click/mouse events.
        Read more about it [here](https://github.com/downshift-js/downshift#children-function).

```js
<DataSearch
	render={({ loading, error, data, value, downshiftProps: { isOpen, getItemProps } }) => {
		if (loading) {
			return <div>Fetching Suggestions.</div>;
		}
		if (error) {
			return <div>Something went wrong! Error details {JSON.stringify(error)}</div>;
		}
		return isOpen && Boolean(value.length) ? (
			<div>
				{data.slice(0, 5).map((suggestion, index) => (
					<div key={suggestion.value} {...getItemProps({ item: suggestion })}>
						{suggestion.value}
					</div>
				))}
				{Boolean(value.length) && (
					<div {...getItemProps({ item: { label: value, value: value } })}>
						Show all results for "{value}"
					</div>
				)}
			</div>
		) : null;
	}}
/>
```

Or you can also use render function as children

```js
<DataSearch>
        {
            ({
                loading,
                error,
                data,
                rawData,
                value,
                downshiftProps
            }) => (
                // return UI to be rendered
            )
        }
</DataSearch>
```

-   **renderError** `String or JSX or Function` [optional]
    can be used to render an error message in case of any error.
    ```js
    renderError={(error) => (
            <div>
                Something went wrong!<br/>Error details<br/>{error}
            </div>
        )
    }
    ```
-   **renderNoSuggestion** `String or JSX or Function` [optional]
    can be used to render a message when there is no suggestions found.
    ```js
    renderNoSuggestion={() => (
            <div>
                No suggestions found
            </div>
        )
    }
    ```
-   **renderQuerySuggestions** `String or JSX or Function` [optional]
    This prop has been marked as deprecated starting `v3.12.6`. Please use the `renderPopularSuggestions` prop instead.

-   **renderPopularSuggestions** `String or JSX or Function` [optional]
You can render popular suggestions in a custom layout by using the `renderQuerySuggestions` prop.
    <br/>
    It accepts an object with these properties:
    -   **`loading`**: `boolean`
        indicates that the query is still in progress.
    -   **`error`**: `object`
        An object containing the error info.
    -   **`data`**: `array`
        An array of popular suggestions obtained based on search value.
    -   **`value`**: `string`
        current search input value i.e the search query being used to obtain suggestions.
    -   **`downshiftProps`**: `object`
        provides all the control props from `downshift` which can be used to bind list items with click/mouse events.
        Read more about it [here](https://github.com/downshift-js/downshift#children-function).

    ```javascript
    <DataSearch
        dataField={['original_title', 'original_title.search']}
        componentId="BookSensor"
        enablePopularSuggestions
        renderPopularSuggestions={({
            value,
            data: suggestions,
            downshiftProps: { isOpen, getItemProps, highlightedIndex },
        }) =>
            isOpen &&
            Boolean(value.length) && (
                <div>
                    {(suggestions || []).map((suggestion, index) => (
                        <div
                            style={{
                                padding: 10,
                                background:
                                    index === highlightedIndex
                                        ? '#eee'
                                        : 'transparent',
                                color: 'green',
                            }}
                            key={suggestion.value}
                            {...getItemProps({ item: suggestion })}
                        >
                            {suggestion.value}
                        </div>
                    ))}
                </div>
            )
        }
    />

-   **getMicInstance** `Function` [optional]
    You can pass a callback function to get the instance of `SpeechRecognition` object, which can be used to override the default configurations.
-   **renderMic** `String or JSX or Function` [optional]
    can we used to render the custom mic option.<br/>
    It accepts an object with the following properties:
    -   **`handleClick`**: `function`
        needs to be called when the mic option is clicked.
    -   **`status`**: `string`
        is a constant which can have one of these values:<br/>
        `INACTIVE` - mic is in inactive state i.e not listening<br/>
        `STOPPED` - mic has been stopped by the user<br/>
        `ACTIVE` - mic is listening<br/>
        `DENIED` - permission is not allowed<br/>
    ```js
    	renderMic = {({ handleClick, status }) => {
    				switch(status) {
    					case 'ACTIVE':
    						return <img src="/active_mic.png" onClick={handleClick} />
    					case 'DENIED':
    					case 'STOPPED':
    						return <img src="/mute_mic.png" onClick={handleClick} />
    					default:
    						return <img src="/inactive_mic.png" onClick={handleClick} />
    				}
    	}}
    ```
-   **onChange** `function` [optional]
    is a callback function which accepts component's current **value** as a parameter. It is called when you are using the `value` prop and the component's value changes. This prop is used to implement the [controlled component](https://reactjs.org/docs/forms.html/#controlled-components) behavior.

    ```js
    <DataSearch
    	value={this.state.value}
    	onChange={(value, triggerQuery, event) => {
    		this.setState(
    			{
    				value,
    			},
    			() => triggerQuery(),
    		);
    	}}
    />
    ```

> Note:
>
> If you're using the controlled behavior than it's your responsibility to call the `triggerQuery` method to update the query i.e execute the search query and update the query results in connected components by `react` prop. It is not mandatory to call the `triggerQuery` in `onChange` you can also call it in other input handlers like `onBlur` or `onKeyPress`.

-   **onSuggestions** `Function` [optional]
    You can pass a callback function to listen for the changes in suggestions. The function receives `suggestions` list.
-   **onError** `Function` [optional]
    You can pass a callback function that gets triggered in case of an error and provides the `error` object which can be used for debugging or giving feedback to the user if needed.


-   **recentSearchesIcon** `JSX` [optional]
You can use a custom icon in place of the default icon for the recent search items that are shown when `enableRecentSearches` prop is set to true. You can also provide styles using the `recent-search-icon` key in the `innerClass` prop.

    ```html
        <DataSearch
            ...
            enableRecentSearches
            innerClass={{
                'recent-search-icon': '...',
            }}
            recentSearchesIcon={<RecentIcon />}
        />
    ```

-   **popularSearchesIcon** `JSX` [optional]
You can use a custom icon in place of the default icon for the popular searches that are shown when `enablePopularSuggestions` prop is set to true. You can also provide styles using the `popular-search-icon` key in the `innerClass` prop.

    ```html
        <DataSearch
            ...
            enablePopularSuggestions
            innerClass={{
                'popular-search-icon': '...'
            }}
            popularSearchesIcon={<PopularIcon />}
        />
    ```

-   **distinctField** `String` [optional]
This prop returns only the distinct value documents for the specified field. It is equivalent to the `DISTINCT` clause in SQL. It internally uses the collapse feature of Elasticsearch. You can read more about it over [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/collapse-search-results.html).


-   **distinctFieldConfig** `Object` [optional]
This prop allows specifying additional options to the `distinctField` prop. Using the allowed DSL, one can specify how to return K distinct values (default value of K=1), sort them by a specific order, or return a second level of distinct values. `distinctFieldConfig` object corresponds to the `inner_hits` key's DSL.  You can read more about it over [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/collapse-search-results.html).

```jsx
<DataSearch
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

	> Note: In order to use the `distinctField` and `distinctFieldConfig` props, the `enableAppbase` prop must be set to true in `ReactiveBase`.

## Demo

<br />

<iframe src="https://codesandbox.io/embed/github/appbaseio/reactivesearch/tree/next/packages/web/examples/DataSearch" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Styles

`DataSearch` component supports an `innerClass` prop to provide styles to the sub-components of DataSearch. These are the supported keys:

-   `title`
-   `input`
-   `list`
-   `recent-search-icon`
-   `popular-search-icon`

Read more about it [here](/docs/reactivesearch/v3/theming/classnameinjection/).

## Extending

`DataSearch` component can be extended to:

1. customize the look and feel with `className`, `style`,
2. update the underlying DB query with `customQuery`,
3. connect with external interfaces using `beforeValueChange`, `onValueChange`, `onValueSelected` and `onQueryChange`,
4. specify how search suggestions should be filtered using `react` prop,
5. use your own function to render suggestions using `parseSuggestion` prop. It expects an object back for each `suggestion` having keys `label` and `value`. The query is run against the `value` key and `label` is used for rendering the suggestions. `label` can be either `String` or JSX. For example,

```js
<DataSearch
  ...
  parseSuggestion={(suggestion) => ({
    label: (
        <div>
            {suggestion._source.original_title} by
            <span style={{ color: 'dodgerblue', marginLeft: 5 }}>
                {suggestion._source.authors}
            </span>
        </div>
    ),
    value: suggestion._source.original_title,
    source: suggestion._source  // for onValueSelected to work with parseSuggestion
  })}
/>
```

-   it's also possible to take control of rendering individual suggestions with `parseSuggestion` prop or the entire suggestions rendering using the `render` prop. Check the [custom suggestions](/docs/reactivesearch/v3/advanced/customsuggestions/) recipe for more info.

6. add the following [synthetic events](https://reactjs.org/events.html) to the underlying `input` element:

    - onBlur
    - onFocus
    - onKeyPress
    - onKeyDown
    - onKeyUp
    - autoFocus

    > Note:
    >
    > 1. All these events accepts the `triggerQuery` as a second parameter which can be used to trigger the `DataSearch` query with the current selected value (useful to customize the search query execution).
    > 2. There is a known [issue](https://github.com/appbaseio/reactivesearch/issues/1087) with `onKeyPress` when `autosuggest` is set to true. It is recommended to use `onKeyDown` for the consistency.

```js
<DataSearch
  ...
  className="custom-class"
  style={{"paddingBottom": "10px"}}
  customQuery={
    function(value, props) {
      return {
        query: {
            match: {
                data_field: "this is a test"
            }
        }
      }
    }
  }
  beforeValueChange={
    function(value) {
      // called before the value is set
      // returns a promise
      return new Promise((resolve, reject) => {
        // update state or component props
        resolve()
        // or reject()
      })
    }
  }
  onValueChange={
    function(value) {
      console.log("current value: ", value)
      // set the state
      // use the value with other js code
    }
  }
  onValueSelected={
    function(value, cause, source) {
      console.log("current value: ", value)
    }
  }
  onQueryChange={
    function(prevQuery, nextQuery) {
      // use the query with other js code
      console.log('prevQuery', prevQuery);
      console.log('nextQuery', nextQuery);
    }
  }
  // specify how and which suggestions are filtered using `react` prop.
  react={
    "and": ["pricingFilter", "dateFilter"],
    "or": ["searchFilter"]
  }
/>
```

-   **className** `String`
    CSS class to be injected on the component container.
-   **style** `Object`
    CSS styles to be applied to the **DataSearch** component.
-   **customQuery** `Function`
    takes **value** and **props** as parameters and **returns** the data query to be applied to the component, as defined in Elasticsearch Query DSL.
    `Note:` customQuery is called on value changes in the **DataSearch** component as long as the component is a part of `react` dependency of at least one other component.
-   **defaultQuery** `Function`
    is a callback function that takes **value** and **props** as parameters and **returns** the data query to be applied to the source component, as defined in Elasticsearch Query DSL, which doesn't get leaked to other components. In simple words, `defaultQuery` prop allows you to modify the query to render the suggestions when `autoSuggest` is enabled.
    Read more about it [here](/docs/reactivesearch/v3/advanced/customqueries/#when-to-use-default-query).
-   **beforeValueChange** `Function`
    is a callback function which accepts component's future **value** as a parameter and **returns** a promise. It is called everytime before a component's value changes. The promise, if and when resolved, triggers the execution of the component's query and if rejected, kills the query execution. This method can act as a gatekeeper for query execution, since it only executes the query after the provided promise has been resolved.

    > Note:
    >
    > If you're using Reactivesearch version >= `3.3.7`, `beforeValueChange` can also be defined as a synchronous function. `value` is updated by default, unless you throw an `Error` to reject the update. For example:

    ```js
    beforeValueChange = value => {
        // The update is accepted by default
    	if (value && value.toLowerCase().contains('Social')) {
    		// To reject the update, throw an error
    		throw Error('Search value should not contain social.');
    	}
    };
    ```

-   **onValueChange** `Function`
    is a callback function which accepts component's current **value** as a parameter. It is called everytime the component's value changes. This prop is handy in cases where you want to generate a side-effect on value selection. For example: You want to show a pop-up modal with the valid discount coupon code when a user searches for a product in a DataSearch.
-   **onValueSelected** `Function`
    is called with the value selected via user interaction. It works only with `autosuggest` and is called whenever a suggestion is selected or a search is performed by pressing **enter** key. It also passes the `cause` of action and the `source` object if the cause of action was `'SUGGESTION_SELECT'`. The possible causes are:
    -   `'SUGGESTION_SELECT'`
    -   `'ENTER_PRESS'`
    -   `'CLEAR_VALUE'`
    -   `'SEARCH_ICON_CLICK'`
-   **onQueryChange** `Function`
    is a callback function which accepts component's **prevQuery** and **nextQuery** as parameters. It is called everytime the component's query changes. This prop is handy in cases where you want to generate a side-effect whenever the component's query would change.
-   **react** `Object`
    specify dependent components to reactively update **DataSearch's** suggestions.
    -   **key** `String`
        one of `and`, `or`, `not` defines the combining clause.
        -   **and** clause implies that the results will be filtered by matches from **all** of the associated component states.
        -   **or** clause implies that the results will be filtered by matches from **at least one** of the associated component states.
        -   **not** clause implies that the results will be filtered by an **inverse** match of the associated component states.
    -   **value** `String or Array or Object`
        -   `String` is used for specifying a single component by its `componentId`.
        -   `Array` is used for specifying multiple components by their `componentId`.
        -   `Object` is used for nesting other key clauses.
-   **index** `String` [optional]
    The index prop can be used to explicitly specify an index to query against for this component. It is suitable for use-cases where you want to fetch results from more than one index in a single ReactiveSearch API request. The default value for the index is set to the `app` prop defined in the ReactiveBase component.

    > Note: This only works when `enableAppbase` prop is set to true in `ReactiveBase`.
-   **focusShortcuts** `Array<string | number>` [optional]
A list of keyboard shortcuts that focus the search box. Accepts key names and key codes. Compatible with key combinations separated using '+'. Defaults to `['/']`.
-   **autoFocus** `boolean` [optional] When set to true, search box is auto-focused on page load. Defaults to `false`.


-   **addonBefore** `string|JSX` [optional] The HTML markup displayed before (on the left side of) the searchbox input field. Users can use it to render additional actions/ markup, eg: a custom search icon hiding the default.
<img src="https://i.imgur.com/Lhm8PgV.png" style="margin:0 auto;display:block;"/>
```jsx
 <DataSearch
        showIcon={false}
        addonBefore={
          <img
            src="https://img.icons8.com/cute-clipart/64/000000/search.png"
            height="30px"
          />
        }
        id="search-component"
        ...
 />
```


-   **addonAfter** `string|JSX` [optional] The HTML markup displayed after (on the right side of) the searchbox input field. Users can use it to render additional actions/ markup, eg: a custom search icon hiding the default.

<img src="https://i.imgur.com/upZRx9K.png" style="margin:0 auto;display:block;"/>

```jsx
 <DataSearch
        showIcon={false}
        addonAfter={
          <img
            src="https://img.icons8.com/cute-clipart/64/000000/search.png"
            height="30px"
          />
        }
        id="search-component"
        ...
 />
```

-   **expandSuggestionsContainer** `boolean` [optional] When set to false the width of suggestions dropdown container is limited to the width of searchbox input field. Defaults to `true`.
<img src="https://i.imgur.com/x3jF23m.png"/>
```jsx
 <DataSearch
        expandSuggestionsContainer={false}
        addonBefore={
          <img ... />
        }
        addonAfter={
          <img ... />
        }
        id="search-component"
        ...
 />
```

## Examples

<a href="https://opensource.appbase.io/playground/?selectedKind=Search%20components%2FDataSearch" target="_blank">DataSearch with default props</a>
