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
nestedSidebar: 'vue-reactivesearch'
---

![Image to be displayed](https://i.imgur.com/QAYt2AN.png)

`DataSearch` creates a search box UI component that is connected to one or more database fields.

Example uses:

-   Searching for a rental listing by its `name` or `description` field.
-   Creating an e-commerce search box for finding products by their listing properties.

## Usage

### Basic Usage

```html
<template>
	<data-search
        componentId="SearchSensor"
        :dataField="['group_venue', 'group_city']"
    />
</template>
```

### Usage With All Props

```html
<data-search
  componentId="SearchSensor"
  title="Search"
  defaultValue="Songwriting"
  placeholder="Search for cities or venues"
  highlightField="group_city"
  queryFormat="or"
  filterLabel="City"
  :autosuggest="true"
  :highlight="true"
  :showFilter="true"
  :fieldWeights="[1, 3]"
  :fuzziness="0"
  :size="10"
  :debounce="100"
  :react="{
    and: ['CategoryFilter', 'SearchFilter']
  }"
  :dataField="['group_venue', 'group_city']"
  :URLParams="false"
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
    You can read more about it over [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-composite-aggregation.html). You can access `aggregationData` using `render` slot as shown:

    ```html
    <template
    	slot="render"
    	slot-scope="{
            ...
            aggregationData
        }"
    >
    	...
    </template>
    ```

    > If you are using an app with elastic search version less than 6, then defining this prop will result in error and you need to handle it manually using **renderError** slot.

    > It is possible to override this query by providing `customQuery`.

-   **nestedField** `String` [optional]
    Set the path of the `nested` type under which the `dataField` is present. Only applicable only when the field(s) specified in the `dataField` is(are) present under a [`nested` type](https://www.elastic.co/guide/en/elasticsearch/reference/current/nested.html) mapping.
-   **title** `String or JSX` [optional]
    set the title of the component to be shown in the UI.
-   **defaultValue** `string` [optional]
    preset the search query text in the search box.
-   **fieldWeights** `Array` [optional]
    set the search weight for the database fields, useful when dataField is an Array of more than one field. This prop accepts an array of numbers. A higher number implies a higher relevance weight for the corresponding field in the search results.
-   **placeholder** `String` [optional]
    set placeholder text to be shown in the component's input field. Defaults to "Search".
-   **autosuggest** `Boolean` [optional]
    set whether the autosuggest functionality should be enabled or disabled. Defaults to `true`. When set to `false`, it searches as user types, unless `debounce` is also set.
-   **showIcon** `Boolean` [optional]
    whether to display a search or custom icon in the input box. Defaults to `true`.
-   **iconPosition** `String` [optional]
    sets the position of the search icon. Can be set to either `left` or `right`. Defaults to `right`.
-   **icon** `JSX` [optional]
    set a custom search icon instead of the default icon 🔍
-   **showClear** `Boolean` [optional]
    show a clear text `X` icon. Defaults to `false`.
-   **showFilter** `Boolean` [optional]
    show as filter when a value is selected in a global selected filters view. Defaults to `true`.
-   **showVoiceSearch** `Boolean` [optional]
    show a voice icon in the searchbox to enable users to set voice input. Defaults to `false`.
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
-   **filterLabel** `String` [optional]
    An optional label to display for the component in the global selected filters view. This is only applicable if `showFilter` is enabled. Default value used here is `componentId`.
-   **clearIcon** `JSX` [optional]
    set a custom icon for clearing text instead of the default cross.
-   **debounce** `Number` [optional]
    set the milliseconds to wait before executing the query. Defaults to `0`, i.e. no debounce.
-   **highlight** `Boolean` [optional]
    whether highlighting should be enabled in the returned results.
-   **highlightField** `String or Array` [optional]
    when highlighting is enabled, this prop allows specifying the fields which should be returned with the matching highlights. When not specified, it defaults to applying highlights on the field(s) specified in the **dataField** prop.
-   **customHighlight** `Function` [optional]
    a function which returns the custom [highlight settings](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-highlighting.html). It receives the `props` and expects you to return an object with the `highlight` key. Check out the <a href="https://opensource.appbase.io/reactivesearch/demos/technews/" target="_blank">technews demo</a> where the `DataSearch` component uses a `customHighlight` as given below,

```html
<template>
    <data-search
        componentId="title"
        highlight="true"
        :dataField="['title', 'text']"
        :customHighlight="getCustomHighlight"
    />
</template>
<script>
export default {
	name: 'app',
	methods: {
		getCustomHighlight: (props) => ({
            highlight: {
                pre_tags: ['<mark>'],
                post_tags: ['</mark>'],
                fields: {
                    text: {},
                    title: {},
                },
                number_of_fragments: 0,
            },
        }),
	},
};
</script>
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
-   **innerRef** `Function` [optional]
    You can pass a callback using `innerRef` which gets passed to the inner input element as [`ref`](https://reactjs.org/docs/refs-and-the-dom.html).
-   **URLParams** `Boolean` [optional]
    enable creating a URL query string param based on the search query text value. This is useful for sharing URLs with the component state. Defaults to `false`.
-   **render** `Function|slot-scope` [optional]
    You can render suggestions in a custom layout by using the `render` as a `prop` or a `slot`.
    <br/>
    It accepts an object with these properties:
    -   **`loading`**: `boolean`
        indicates that the query is still in progress.
    -   **`error`**: `object`
        An object containing the error info.
    -   **`data`**: `array`
        An array of parsed suggestions obtained from the applied query.
    -   **`rawData`** `object`
        An object of raw response as-is from elasticsearch query.
    -   **`promotedData`**: `array`
        An array of promoted results obtained from the applied query. [Read More](/docs/search/rules/)
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
        provides the following control props from `downshift` which can be used to bind list items with click/mouse events.
        -   **isOpen** `boolean`
            Whether the menu should be considered open or closed. Some aspects of the downshift component respond differently based on this value (for example, if isOpen is true when the user hits "Enter" on the input field, then the item at the highlightedIndex item is selected).
        -   **getItemProps** `function`
            Returns the props you should apply to any menu item elements you render.
        -   **getItemEvents** `function`
            Returns the events you should apply to any menu item elements you render.
        -   **highlightedIndex** `number`
            The index that should be highlighted.

You can use `DataSearch` with `render slot` as shown:

```html
<data-search
	class="result-list-container"
	categoryField="authors.raw"
	componentId="BookSensor"
	:dataField="['original_title', 'original_title.search']"
	:URLParams="true"
>
	<div
		class="suggestions"
		slot="render"
		slot-scope="{
            error,
            loading,
            downshiftProps: { isOpen, highlightedIndex, getItemProps, getItemEvents },
            data: suggestions,
        }"
	>
		<ul v-if="isOpen">
			<li
				style="{ background-color: highlightedIndex ? 'grey' : 'transparent' }"
				v-for="suggestion in (suggestions || []).map(s => ({
								label: s.source.authors,
								value: s.source.authors,
								key: s._id,
							}))"
				v-bind="getItemProps({ item: suggestion })"
				v-on="getItemEvents({ item: suggestion })"
				:key="suggestion._id"
			>
				{{ suggestion.label }}
			</li>
		</ul>
	</div>
</data-search>
```

Or you can also use render as prop.

```html
<template>
	<data-search :render="render" />
</template>
<script>
	export default {
		name: 'app',
		methods: {
			render({
				error,
				loading,
				downshiftProps: { isOpen, highlightedIndex, getItemProps, getItemEvents },
				data: suggestions,
			}) {...},
		},
	};
</script>
```

-   **renderNoSuggestion** `String|slot-scope` [optional]
    can be used to render a message when there is no suggestions found.
-   **renderError** `String|Function|slot-scope` [optional]
    can be used to render an error message in case of any error.

```html
    <template slot="renderError" slot-scope="error">
        <div>
            Something went wrong!<br />Error details<br />{{ error }}
        </div>
    </template>
```

-   **getMicInstance** `Function` [optional]
    You can pass a callback function to get the instance of `SpeechRecognition` object, which can be used to override the default configurations.
-   **renderMic** `String|Function|slot-scope` [optional]
    can be used to render the custom mic option.<br/>
    It accepts an object with the following properties:
    -   **`handleClick`**: `function`
        needs to be called when the mic option is clicked.
    -   **`status`**: `string`
        is a constant which can have one of these values:<br/>
        `INACTIVE` - mic is in inactive state i.e not listening<br/>
        `STOPPED` - mic has been stopped by the user<br/>
        `ACTIVE` - mic is listening<br/>
        `DENIED` - permission is not allowed<br/>
    ```html
        <template slot="renderMic" slot-scope="{ handleClick, status }">
            <div v-if="status === `ACTIVE`">
                <img src="/active_mic.png" onClick={handleClick} />
            </div>
            <div v-if="status === `DENIED`">
                <img src="/denied_mic.png" onClick={handleClick} />
            </div>
            <div v-if="status === `STOPPED`">
                <img src="/mute_mic.png" onClick={handleClick} />
            </div>
            <div v-if="typeof status === `undefined`">
                <img src="/inactive_mic.png" onClick={handleClick} />
            </div>
        </template>
    ```

## Demo

<br />

<iframe src="https://codesandbox.io/embed/github/appbaseio/reactivesearch/tree/next/packages/vue/examples/data-search" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Styles

`DataSearch` component supports an `innerClass` prop to provide styles to the sub-components of DataSearch. These are the supported keys:

-   `title`
-   `input`

Read more about it [here](/docs/reactivesearch/vue/theming/ClassnameInjection/).

## Extending

`DataSearch` component can be extended to:

1. customize the look and feel with `className`,
2. update the underlying DB query with `customQuery`,
3. connect with external interfaces using `beforeValueChange`, `valueChange` and `queryChange`,
4. specify how search suggestions should be filtered using `react` prop.
5. use your own function to render suggestions using `parseSuggestion` prop. It expects an object back for each `suggestion` having keys `label` and `value`. The query is run against the `value` key and `label` is used for rendering the suggestions. `label` can be either `String` or JSX. For example,

```html
<template>
	<data-search :parseSuggestion="parseSuggestion" />
</template>
<script>
export default {
	name: 'app',
	methods: {
		parseSuggestion: suggestion => ({
            label: `${suggestion._source.original_title} by ${suggestion._source.authors}`,
            value: suggestion._source.original_title,
            source: suggestion._source  // for onValueSelected to work with renderSuggestion
        }),
	},
};
</script>
```

-   it's also possible to take control of rendering individual suggestions with `parseSuggestion` prop or the entire suggestions rendering using the `render` prop.

The `suggestions` parameter receives all the unparsed suggestions from elasticsearch, however `parsedSuggestions` are also passed which can also be used for suggestions rendering.

```html
<template>
    <data-search
        className="custom-class"
        :customQuery="getCustomQuery"
        :beforeValueChange="handleBeforeValueChange"
        :react="{
            and: ['pricingFilter', 'dateFilter'],
            or: ['searchFilter']
        }"
        @valueChange="handleValueChange"
        @queryChange="handleQueryChange"
/>
</template>
<script>
export default {
	name: 'app',
	methods: {
		getCustomQuery: (value, props) => {
            return {
                query: {
                    match: {
                        data_field: "this is a test"
                    }
                }
            }
        },
        handleBeforeValueChange: (value) => {
            // called before the value is set
            // returns a promise
            return new Promise((resolve, reject) => {
                // update state or component props
                resolve()
                // or reject()
            })
        },
        handleValueChange: (value) => {
            console.log("current value: ", value)
            // set the state
            // use the value with other js code
        },
        handleQueryChange: (prevQuery, nextQuery) => {
            // use the query with other js code
            console.log('prevQuery', prevQuery);
            console.log('nextQuery', nextQuery);
        }
	},
};
</script>
```

-   **className** `String`
    CSS class to be injected on the component container.
-   **customQuery** `Function`
    takes **value** and **props** as parameters and **returns** the data query to be applied to the component, as defined in Elasticsearch Query DSL.
    `Note:` customQuery is called on value changes in the **DataSearch** component as long as the component is a part of `react` dependency of at least one other component.
-   **defaultQuery** `Function`
    is a callback function that takes **value** and **props** as parameters and **returns** the data query to be applied to the source component, as defined in Elasticsearch Query DSL, which doesn't get leaked to other components. In simple words, `defaultQuery` prop allows you to modify the query to render the suggestions when `autoSuggest` is enabled.
    Read more about it [here](/docs/reactivesearch/vue/advanced/CustomQueries/#when-to-use-default-query).
-   **beforeValueChange** `Function`
    is a callback function which accepts component's future **value** as a parameter and **returns** a promise. It is called everytime before a component's value changes. The promise, if and when resolved, triggers the execution of the component's query and if rejected, kills the query execution. This method can act as a gatekeeper for query execution, since it only executes the query after the provided promise has been resolved.

    > Note:
    >
    > If you're using Reactivesearch version >= `1.1.0`, `beforeValueChange` can also be defined as a synchronous function. `value` is updated by default, unless you throw an `Error` to reject the update. For example:

    ```js
    beforeValueChange = value => {
        // The update is accepted by default
    	if (value && value.toLowerCase().contains('Social')) {
    		// To reject the update, throw an error
    		throw Error('Search value should not contain social.');
    	}
    };
    ```

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

## Events

-   **queryChange**
    is an event which accepts component's **prevQuery** and **nextQuery** as parameters. It is called everytime the component's query changes. This event is handy in cases where you want to generate a side-effect whenever the component's query would change.
-   **valueChange**
    is an event which accepts component's current **value** as a parameter. It is called everytime the component's value changes. This event is handy in cases where you want to generate a side-effect on value selection. For example: You want to show a pop-up modal with the valid discount coupon code when a list item is selected in a "Discounted Price" SingleList.
-   **valueSelected**
    is called when a search is performed either by pressing **enter** key or the input is blurred.

-   **suggestions**
    You can use this event to listen for the changes in suggestions.The function receives `suggestions` list.

-   **error**
    gets triggered in case of an error and provides the `error` object, which can be used for debugging or giving feedback to the user if needed.

The following events to the underlying `input` element:

-   **blur**
-   **focus**
-   **keyPress**
-   **keyDown**
-   **keyUp**

## Examples

<a href="https://reactivesearch-vue-playground.netlify.com/?selectedKind=Search%20Components%2FDataSearch&selectedStory=Basic&full=0&addons=1&stories=1&panelRight=0" target="_blank">DataSearch with default props</a>
