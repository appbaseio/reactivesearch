---
title: 'CategorySearch'
meta_title: 'CategorySearch'
meta_description: '`CategorySearch` creates a category based data search UI component with an autosuggest functionality. It is used for applying full-text search across one or more fields.'
keywords:
    - reactivesearch
    - categorysearch
    - appbase
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'web-reactivesearch'
---

![Image to be displayed](https://i.imgur.com/IsmEuyr.png)

`CategorySearch` creates a category based data search UI component with an autosuggest functionality. It is used for applying full-text search across one or more fields.

Example uses:

-   Searching for a rental listing by its `name` or `description` field.
-   Creating an e-commerce search box for finding products by their listing properties.

## Usage

### Basic Usage

```js
<CategorySearch
	componentId="SearchSensor"
	dataField={['group_venue', 'group_city']}
	categoryField="group_topics"
/>
```

### Usage With All Props

```js
<CategorySearch
	componentId="SearchSensor"
	dataField={['group_venue', 'group_city']}
	categoryField="group_topics"
	title="Search"
	defaultValue={{
		term: 'Paris',
		category: '*',
	}}
	fieldWeights={[1, 3]}
	placeholder="Search for cities or venues"
	autoSuggest={true}
	defaultSuggestions={[{ label: 'Programming', value: 'Programming' }]}
	highlight={false}
	highlightField="group_city"
	queryFormat="or"
	fuzziness={0}
	debounce={100}
	react={{
		and: ['CategoryFilter', 'SearchFilter'],
	}}
	showFilter={true}
	filterLabel="Venue filter"
	URLParams={false}
/>
```

## Props

-   **componentId** `String`
    unique identifier of the component, can be referenced in other components' `react` prop.
-   **dataField** `String or Array`
    database field(s) to be queried against. Accepts an Array in addition to String, useful for applying search across multiple fields.
-   **nestedField** `String` [optional]
    Set the path of the `nested` type under which the `dataField` is present. Only applicable only when the field(s) specified in the `dataField` is(are) present under a [`nested` type](https://www.elastic.co/guide/en/elasticsearch/reference/current/nested.html) mapping.
-   **categoryField** `String` [optional]
    data field which has the category values mapped.
-   **title** `String or JSX` [optional]
    Sets the title of the component to be shown in the UI.
-   **defaultValue** `Object` [optional]
    set the initial search query text on mount & the category.
-   **value** `Object` [optional]
    sets the current value of the component. It sets the search query text & the category (on mount and on update). Use this prop in conjunction with the `onChange` props. Usage:

```jsx
<CategorySearch
	{...searchProps}
	value={{
		term: 'Harry',
		category: '*',
	}}
/>
```

-   **onChange** `function` [optional]
    is a callback function which accepts component's current **value** as a parameter. It is called when you are using the `value` prop and the component's value changes. This prop is used to implement the [controlled component](https://reactjs.org/docs/forms.html#controlled-components) behavior.
    ```js
    <CategorySearch
    	value={this.state.value}
    	onChange={(value, triggerQuery, event) => {
    		this.setState({ value }, () => triggerQuery());
    	}}
    />
    ```
    > Note: If you're using the controlled behavior than it's your responsibility to call the `triggerQuery` method to update the query i.e execute the search query and update the query results in connected components by `react` prop. It is not mandatory to call the `triggerQuery` in `onChange` you can also call it in other input handlers like `onBlur` or `onKeyPress`.
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
    set a custom icon for clearing text instead of the default cross.
-   **autosuggest** `Boolean` [optional]
    set whether the autosuggest functionality should be enabled or disabled. Defaults to `true`.
-   **strictSelection** `Boolean` [optional]
    defaults to `false`. When set to `true`, the component will only set its value and fire the query if the value was selected from the suggestion. Otherwise the value will be cleared on selection. This is only relevant with `autosuggest`.
-   **defaultSuggestions** `Array` [optional]
    preset search suggestions to be shown on focus when the search box does not have any search query text set. Accepts an array of objects each having a **label** and **value** property. The label can contain either String or an HTML element.
-   **debounce** `Number` [optional]
    set the milliseconds to wait before executing the query. Defaults to `0`, i.e. no debounce.
-   **highlight** `Boolean` [optional]
    Whether highlighting should be enabled in the returned results. Defaults to `false`.
-   **highlightField** `String` or `Array` [optional]
    When highlighting is enabled, this prop allows specifying the fields which should be returned with the matching highlights. When not specified, it defaults to applying highlights on the field(s) specified in the **dataField** prop.
-   **customHighlight** `Function` [optional]
    a function which returns the custom [highlight settings](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-highlighting.html). It receives the `props` and expects you to return an object with the `highlight` key. Check out the <a href="https://opensource.appbase.io/reactivesearch/demos/technews/" target="_blank">technews demo</a> where the `DataSearch` component uses a `customHighlight` as given below,

```js
<CategorySearch
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
-   **showFilter** `Boolean` [optional]
    show as filter when a value is selected in a global selected filters view. Defaults to `true`.
-   **showVoiceSearch** `Boolean` [optional]
    show a voice icon in the searchbox to enable users to set voice input. Defaults to `false`.
-   **searchOperators** `Boolean` [optional]
    Defaults to `false`. If set to `true`, ou can use special characters in the search query to enable an advanced search behavior.<br/>
    Read more about it [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-simple-query-string-query.html).
-   **filterLabel** `String` [optional]
    An optional label to display for the component in the global selected filters view. This is only applicable if `showFilter` is enabled. Default value used here is `componentId`.
-   **URLParams** `Boolean` [optional]
    enable creating a URL query string param based on the search query text value. This is useful for sharing URLs with the component state. Defaults to `false`.
-   **render** `Function` [optional]
    You can render suggestions in a custom layout by using the `render` prop.
    <br/>
    It accepts an object with these properties:
    -   **`loading`**: `boolean`
        indicates that the query is still in progress.
    -   **`error`**: `object`
        An object containing the error info.
    -   **`data`**: `array`
        An array of parsed suggestions (original suggestions + category suggestions) obtained from the applied query.
    -   **`categories`**: `array`
        An array of parsed category suggestions.
    -   **`rawCategories`**: `array`
        An array of original category suggestions.
    -   **`suggestions`**: `array`
        An array of parsed suggestions.
    -   **`rawSuggestions`**: `array`
        An array of original suggestions.
    -   **`value`**: `string`
        current search input value i.e the search query being used to obtain categories and suggestions.
    -   **`downshiftProps`**: `object`
        provides all the control props from `downshift` which can be used to bind list items with click/mouse events.
        Read more about it [here](https://github.com/downshift-js/downshift#children-function).

```js
<CategorySearch
	render={({
		loading,
		error,
		value,
		categories,
		suggestions,
		downshiftProps: { isOpen, getItemProps },
	}) => {
		if (loading) {
			return <div>Fetching Suggestions.</div>;
		}
		if (error) {
			return <div>Something went wrong! Error details {JSON.stringify(error)}</div>;
		}
		return isOpen && Boolean(value.length) ? (
			<div>
				{suggestions.slice(0, 5).map((suggestion, index) => (
					<div key={suggestion.value} {...getItemProps({ item: suggestion })}>
						{suggestion.value}
					</div>
				))}
				{categories.slice(0, 3).map((category, index) => (
					<div
						key={category.key}
						{...getItemProps({ item: { value: value, category: category.key } })}
					>
						{value} in {category.key}
					</div>
				))}
				{Boolean(value.length) && (
					<div {...getItemProps({ item: { label: value, value: value } })}>
						Search for "{value}" in all categories
					</div>
				)}
			</div>
		) : null;
	}}
/>
```

Or you can also use render function as children

```js
<CategorySearch>
        {
            ({
                loading,
                error,
                data,
                categories,
                rawCategories,
                suggestions,
                rawSuggestions
                value,
                downshiftProps
            }) => (
                // return custom suggestions UI to be rendered
            )
        }
</CategorySearch>
```

-   **renderError** `String or JSX or Function` [optional]
    can we used to render an error message in case of any error.
    ```js
    renderError={(error) => (
            <div>
                Something went wrong!<br/>Error details<br/>{error}
            </div>
        )
    }
    ```
-   **renderNoSuggestion** `String or JSX or Function` [optional]
    can we used to render a message when there is no suggestions found.

    ```js
    renderNoSuggestion={() => (
            <div>
                No suggestions found
            </div>
        )
    }
    ```

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
-   **onSuggestions** `Function` [optional]
    You can pass a callback function to listen for the changes in suggestions. The function receives `suggestions` list.
-   **onError** `Function` [optional]
    You can pass a callback function that gets triggered in case of an error and provides the `error` object which can be used for debugging or giving feedback to the user if needed.

## Demo

<br />

<iframe src="https://codesandbox.io/embed/github/appbaseio/reactivesearch/tree/next/packages/web/examples/CategorySearch" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Styles

`CategorySearch` component supports an `innerClass` prop to provide styles to the sub-components of CategorySearch. These are the supported keys:

-   `title`
-   `input`
-   `list`

Read more about it [here](/docs/reactivesearch/v3/theming/classnameinjection/).

## Extending

`CategorySearch` component can be extended to:

1. customize the look and feel with `className`, `style`,
2. update the underlying DB query with `customQuery`,
3. connect with external interfaces using `beforeValueChange`, `onValueChange`, `onValueSelected` and `onQueryChange`,
4. specify how search suggestions should be filtered using `react` prop,
5. use your own function to render suggestions using `parseSuggestion` prop. It expects an object back for each `suggestion` having keys `label` and `value`. The query is run against the `value` key and `label` is used for rendering the suggestions. `label` can be either `String` or JSX. For example,

```js
<CategorySearch
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
    > 1. All these events accepts the `triggerQuery` as a second parameter which can be used to trigger the `CategorySearch` query with the current selected value (useful to customize the search query execution).
    > 2. There is a known [issue](https://github.com/appbaseio/reactivesearch/issues/1087) with `onKeyPress` when `autosuggest` is set to true. It is recommended to use `onKeyDown` for the consistency.

```js
<CategorySearch
  ...
  className="custom-class"
  style={{"paddingBottom": "10px"}}
  customQuery={
    function(value, props, category) {
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
    function(value, category, cause, source) {
      console.log("current value and category: ", value, category)
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
    CSS styles to be applied to the **CategorySearch** component.
-   **customQuery** `Function`
    takes **value**, **props** and **category** as parameters and **returns** the data query to be applied to the component, as defined in Elasticsearch Query DSL.
    `Note:` customQuery is called on value changes in the **CategorySearch** component as long as the component is a part of `react` dependency of at least one other component.
-   **defaultQuery** `Function`
    takes **value**, **props** and **category** as parameters and **returns** the data query to be applied to the source component, as defined in Elasticsearch Query DSL, which doesn't get leaked to other components.<br/>
    Read more about it [here](/docs/reactivesearch/v3/advanced/customquery#when-to-use-default-query).
-   **beforeValueChange** `Function`
    is a callback function which accepts component's future **value** as a parameter and **returns** a promise. It is called everytime before a component's value changes. The promise, if and when resolved, triggers the execution of the component's query and if rejected, kills the query execution. This method can act as a gatekeeper for query execution, since it only executes the query after the provided promise has been resolved.
-   **onValueChange** `Function`
    is a callback function which accepts component's current **value** as a parameter. It is called everytime the component's value changes. This prop is handy in cases where you want to generate a side-effect on value selection. For example: You want to show a pop-up modal with the valid discount coupon code when a user searches for a product in a CategorySearch.
-   **onValueSelected** `Function`
    is called with the value and the category selected via user interaction. If the search was performed by selecting the 'in all categories' suggestion, category is received as `*`. If it was performed for one of the categorized suggestion, the `category` is received. In other cases (either searching without selecting a suggestion or picking an uncategorized suggestion), `category` is received as `null`. It works only with `autosuggest` and is called whenever a suggestion is selected or a search is performed by pressing **enter** key. It also passes the `cause` of action and the `source` object if the cause of action was `'SUGGESTION_SELECT'`. The source would be `null` if a category based suggestion was selected. The possible causes are:
    -   `'SUGGESTION_SELECT'`
    -   `'ENTER_PRESS'`
    -   `'CLEAR_VALUE'
-   **onQueryChange** `Function`
    is a callback function which accepts component's **prevQuery** and **nextQuery** as parameters. It is called everytime the component's query changes. This prop is handy in cases where you want to generate a side-effect whenever the component's query would change.
-   **react** `Object`
    specify dependent components to reactively update **CategorySearch's** suggestions.
    -   **key** `String`
        one of `and`, `or`, `not` defines the combining clause.
        -   **and** clause implies that the results will be filtered by matches from **all** of the associated component states.
        -   **or** clause implies that the results will be filtered by matches from **at least one** of the associated component states.
        -   **not** clause implies that the results will be filtered by an **inverse** match of the associated component states.
    -   **value** `String or Array or Object`
        -   `String` is used for specifying a single component by its `componentId`.
        -   `Array` is used for specifying multiple components by their `componentId`.
        -   `Object` is used for nesting other key clauses.

## Examples

<a href="https://opensource.appbase.io/playground/?selectedKind=Search%20components%2FCategorySearch" target="_blank">CategorySearch with default props</a>
