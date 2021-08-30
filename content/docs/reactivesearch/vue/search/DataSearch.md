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

- Searching for a rental listing by its `name` or `description` field.
- Creating an e-commerce search box for finding products by their listing properties.

## Usage

### Basic Usage

```html
<template>
	<data-search componentId="SearchSensor" :dataField="['group_venue', 'group_city']" />
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
  :dataField="[
			{
				'field': 'group_venue',
				'weight': 1
			},
			{
				'field': 'group_city',
				'weight': 3
			},
			{
				'field': 'original_title',
				'weight': 5
			},
			{
				'field': 'original_title.autosuggest',
				'weight': 1
			}
	]"
	:fuzziness="0"
	:size="10"
	:debounce="100"
	:react="{
    and: ['CategoryFilter', 'SearchFilter']
  }"
	:URLParams="false"
/>
```

## Props

-   **componentId** `String`
    unique identifier of the component, can be referenced in other components' `react` prop.
-   **dataField** `string | Array<string | DataField*>` [optional*]
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
    database field(s) to be queried against. Accepts an Array in addition to String, useful for applying search across multiple fields. Check examples at [here](/docs/search/reactivesearch-api/reference/#datafield).

    > Note:
    > 1. This prop is optional only when `enableAppbase` prop is set to `true` in `ReactiveBase` component.
    > 2. The `dataField` property as `DataField` object is only available for ReactiveSearch version >= `v3.21.0` and Appbase version `v7.47.0`.

-   **size** `Number` [optional]
    number of suggestions to show. Defaults to `10`.
-   **excludeFields** `String Array` [optional]
    fields to be excluded in the suggestion's query when `autoSuggest` is true.
-   **includeFields** `String Array` [optional]
    fields to be included in the suggestion's query when `autoSuggest` is true.
-   **enableQuerySuggestions** `bool` [optional]
    This prop has been marked as deprecated starting `v1.7.8`. Please use the `enablePopularSuggestions` prop instead.
-   **enablePopularSuggestions** `bool` [optional]
    Defaults to `false`. When enabled, it can be useful to curate search suggestions based on actual search queries that your users are making. Read more about it over [here](/docs/analytics/popular-suggestions/).

    > Note:
    >
    > Popular Suggestions only work when `enableAppbase` prop is `true`.

-   **enablePredictiveSuggestions** `bool` [optional]
    Defaults to `false`. When set to `true`, it predicts the next relevant words from a field's value based on the search query typed by the user. When set to `false` (default), the entire field's value would be displayed. This may not be desirable for long-form fields (where average words per field value is greater than 4 and may not fit in a single line).

-   **enableRecentSearches** `Boolean` Defaults to `false`. If set to `true` then users will see the top recent searches as the default suggestions. Appbase.io recommends defining a unique id(`userId` property) in `appbaseConfig` prop for each user to personalize the recent searches.

    > Note: Please note that this feature only works when `recordAnalytics` is set to `true` in `appbaseConfig`.

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

    > Note: This prop has been marked as deprecated starting v1.14.0. Please use the `distinctField` prop instead.

-   **aggregationSize**
    To set the number of buckets to be returned by aggregations.

    > Note: This is a new feature and only available for appbase versions >= 7.41.0.

-   **nestedField** `String` [optional]
    Set the path of the `nested` type under which the `dataField` is present. Only applicable only when the field(s) specified in the `dataField` is(are) present under a [`nested` type](https://www.elastic.co/guide/en/elasticsearch/reference/current/nested.html) mapping.
-   **title** `String or JSX` [optional]
    set the title of the component to be shown in the UI.
-   **defaultValue** `string` [optional]
    preset the search query text in the search box.
-   **value** `string` [optional]
    sets the current value of the component. It sets the search query text (on mount and on update). Use this prop in conjunction with the `change` event.
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
    show a clear text `X` icon. Defaults to `true`.
-   **showFilter** `Boolean` [optional]
    show as filter when a value is selected in a global selected filters view. Defaults to `true`.
-   **showVoiceSearch** `Boolean` [optional]
    show a voice icon in the searchbox to enable users to set voice input. Defaults to `false`.
-   **showDistinctSuggestions** `Boolean` [optional]
    Show 1 suggestion per document. If set to `false` multiple suggestions may show up for the same document as searched value might appear in multiple fields of the same document, this is true only if you have configured multiple fields in `dataField` prop. Defaults to `true`.
    <br/> <br/>
    **Example** if you have `showDistinctSuggestions` is set to `false` and have following configurations

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

- **filterLabel** `String` [optional]
  An optional label to display for the component in the global selected filters view. This is only applicable if `showFilter` is enabled. Default value used here is `componentId`.
- **clearIcon** `JSX` [optional]
  set a custom icon for clearing text instead of the default cross.
- **debounce** `Number` [optional]
  set the milliseconds to wait before executing the query. Defaults to `0`, i.e. no debounce.
- **highlight** `Boolean` [optional]
  whether highlighting should be enabled in the returned results.
- **highlightField** `String or Array` [optional]
  when highlighting is enabled, this prop allows specifying the fields which should be returned with the matching highlights. When not specified, it defaults to applying highlights on the field(s) specified in the **dataField** prop.
- **customHighlight** `Function` [optional]
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
			getCustomHighlight: props => ({
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

- **focusShortcuts** `Array<string | number>` [optional]
  A list of keyboard shortcuts that focus the search box. Accepts key names and key codes. Compatible with key combinations separated using '+'. Defaults to `['/']`.
- **autoFocus** `boolean` [optional] When set to true, search box is auto-focused on page load. Defaults to `false`.
- **expandSuggestionsContainer** `boolean` [optional] When set to false the width of suggestions dropdown container is limited to the width of searchbox input field. Defaults to `true`.
  <img src="https://i.imgur.com/x3jF23m.png"/>

```jsx
 <data-search
      expandSuggestionsContainer={false}
      ...
  >
      <img slot="addonBefore" src="..." />
      <img slot="addonAfter" src="..." />
  </data-sesarch>
```

- **queryFormat** `String` [optional]
  Sets the query format, can be **or** or **and**. Defaults to **or**.

  - **or** returns all the results matching **any** of the search query text's parameters. For example, searching for "bat man" with **or** will return all the results matching either "bat" or "man".
  - On the other hand with **and**, only results matching both "bat" and "man" will be returned. It returns the results matching **all** of the search query text's parameters.

- **fuzziness** `String or Number` [optional]
  Sets a maximum edit distance on the search parameters, can be **0**, **1**, **2** or **"AUTO"**. Useful for showing the correct results for an incorrect search parameter by taking the fuzziness into account. For example, with a substitution of one character, **fox** can become **box**. Read more about it in the elastic search [docs](https://www.elastic.co/guide/en/elasticsearch/guide/current/fuzziness.html).
  > Note:
  >
  > This prop doesn't work when the value of `queryFormat` prop is set to `and`.
- **innerRef** `Function` [optional]
  The `innerRef` prop along with the `ref` prop can be used to access the reference of the `input` element that can be used to access/manipulate the native events or values for input element. For, an example the below snippet changes the `type` of the `input` element to `search` from the `text`.

```html
<template>
	<data-search
		componentId="BookSensor"
		dataField="['original_title', 'original_title.search']"
		ref="data-search"
		innerRef="input"
	/>
</template>
<script>
	export default {
		name: 'app',
		mounted() {
			this.$refs['data-search'].$children[0].$refs['input'].type = 'search';
		},
	};
</script>
```

- **URLParams** `Boolean` [optional]
  enable creating a URL query string param based on the search query text value. This is useful for sharing URLs with the component state. Defaults to `false`.
- **render** `Function|slot-scope` [optional]
  You can render suggestions in a custom layout by using the `render` as a `prop` or a `slot`.
  <br/>
  It accepts an object with these properties:
  - **`loading`**: `boolean`
    indicates that the query is still in progress.
  - **`error`**: `object`
    An object containing the error info.
  - **`data`**: `array`
    An array of parsed suggestions obtained from the applied query.
  - **`popularSuggestions`**: `array`
    An array of popular suggestions obtained based on search value.
  - **`querySuggestions`**: `array`
    This prop has been marked as deprecated starting `v1.7.8`. Please use the `popularSuggestions` prop instead.
  - **`recentSearches`**: `array`
    An array of recent searches made by user if `enableRecentSearches` is set to `true`.
  - **`rawData`** `object`
    An object of raw response as-is from elasticsearch query.
  - **`promotedData`**: `array`
    An array of promoted results obtained from the applied query. [Read More](/docs/search/rules/)
  - **`resultStats`**: `object`
    An object with the following properties which can be helpful to render custom stats:
    - **`numberOfResults`**: `number`
      Total number of results found
    - **`time`**: `number`
      Time taken to find total results (in ms)
    - **`hidden`**: `number`
      Total number of hidden results found
    - **`promoted`**: `number`
      Total number of promoted results found
  - **`value`**: `string`
    current search input value i.e the search query being used to obtain suggestions.
  - **`downshiftProps`**: `object`
    provides the following control props from `downshift` which can be used to bind list items with click/mouse events.
    - **isOpen** `boolean`
      Whether the menu should be considered open or closed. Some aspects of the downshift component respond differently based on this value (for example, if isOpen is true when the user hits "Enter" on the input field, then the item at the highlightedIndex item is selected).
    - **getItemProps** `function`
      Returns the props you should apply to any menu item elements you render.
    - **getItemEvents** `function`
      Returns the events you should apply to any menu item elements you render.
    - **highlightedIndex** `number`
      The index that should be highlighted.
  - **triggerClickAnalytics**: `object`
    method can be used to register click analytics for suggestions. It accepts two arguments, click position and document ID (required only if you're using `rawData` to render suggestions).

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

- **renderNoSuggestion** `String|slot-scope` [optional]
  can be used to render a message when there are no suggestions found.
- **renderError** `String|Function|slot-scope` [optional]
  can be used to render an error message in case of any error.

```html
<template slot="renderError" slot-scope="error">
	<div>Something went wrong!<br />Error details<br />{{ error }}</div>
</template>
```

- **renderQuerySuggestions** `Function|slot-scope` [optional]
  This prop has been marked as deprecated starting `v1.7.8`. Please use the `renderPopularSuggestions` prop instead.

- **renderPopularSuggestions** `Function|slot-scope` [optional]
  You can render popular suggestions in a custom layout by using the `renderQuerySuggestions` as a `prop` or a `slot`.
  <br/>
  It accepts an object with these properties:
  - **`loading`**: `boolean`
    indicates that the query is still in progress.
  - **`error`**: `object`
    An object containing the error info.
  - **`data`**: `array`
    An array of popular suggestions obtained based on search value.
  - **`value`**: `string`
    current search input value i.e the search query being used to obtain suggestions.
  - **`downshiftProps`**: `object`
    provides the following control props from `downshift` which can be used to bind list items with click/mouse events.
    - **isOpen** `boolean`
      Whether the menu should be considered open or closed. Some aspects of the downshift component respond differently based on this value (for example, if isOpen is true when the user hits "Enter" on the input field, then the item at the highlightedIndex item is selected).
    - **getItemProps** `function`
      Returns the props you should apply to any menu item elements you render.
    - **getItemEvents** `function`
      Returns the events you should apply to any menu item elements you render.
    - **highlightedIndex** `number`
      The index that should be highlighted.

You can use `DataSearch` with `renderQuerySuggestions slot` as shown:

```html
<data-search
	class="result-list-container"
	categoryField="authors.raw"
	componentId="BookSensor"
	:dataField="['original_title', 'original_title.search']"
	:URLParams="true"
	:enablePopularSuggestions="true"
>
	<div
		class="suggestions"
		slot="renderPopularSuggestions"
		slot-scope="{
            error,
            loading,
            downshiftProps: { isOpen, highlightedIndex, getItemProps, getItemEvents },
            data: suggestions,
        }"
	>
		<ul v-if="isOpen">
			<li
				style="{ background-color: highlightedIndex ? 'grey' : 'transparent', color: 'green' }"
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

- **getMicInstance** `Function` [optional]
  You can pass a callback function to get the instance of `SpeechRecognition` object, which can be used to override the default configurations.
- **renderMic** `String|Function|slot-scope` [optional]
  can be used to render the custom mic option.<br/>
  It accepts an object with the following properties:

  - **`handleClick`**: `function`
    needs to be called when the mic option is clicked.
  - **`status`**: `string`
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

- **recentSearchesIcon** `slot-scope` [optional]
  You can use a custom icon in place of the default icon for the recent search items that are shown when `enableRecentSearches` prop is set to true. You can also provide styles using the `recent-search-icon` key in the `innerClass` prop.

      ```html
          <DataSearch
              ...
              :enableRecentSearches="true"
              :innerClass="{
                  'recent-search-icon': '...',
              }"
          >
              <recent-icon slot="recentSearchesIcon" />
          </DataSearch>
      ```

- **popularSearchesIcon** `slot-scope` [optional]
  You can use a custom icon in place of the default icon for the popular searches that are shown when `enablePopularSuggestions` prop is set to true. You can also provide styles using the `popular-search-icon` key in the `innerClass` prop.

      ```html
          <DataSearch
              ...
              :enablePopularSuggestions="true"
              :innerClass="{
                  'popular-search-icon': '...'
              }"
          >
              <popular-icon slot="popularSearchesIcon" />
          </DataSearch>
      ```

- **addonBefore** `slot-scope` [optional] The HTML markup displayed before (on the left side of) the searchbox input field. Users can use it to render additional actions/ markup, eg: a custom search icon hiding the default.
  <img src="https://i.imgur.com/Lhm8PgV.png" style="margin:0 auto;display:block;"/>
```jsx
  <data-search
      ...
      :enablePopularSuggestions="true"
      :innerClass="{
         'popular-search-icon': '...'
      }"
  >
      <img 
        slot="addonBefore"
        src="https://img.icons8.com/cute-clipart/64/000000/search.png"
        height="30px"
      />
  </data-search>
```

- **addonAfter** `slot-scope` [optional] The HTML markup displayed before (on the right side of) the searchbox input field. Users can use it to render additional actions/ markup, eg: a custom search icon hiding the default.
  <img src="https://i.imgur.com/upZRx9K.png" style="margin:0 auto;display:block;"/>

```jsx
  <data-search
      ...
      :enablePopularSuggestions="true"
      :innerClass="{
         'popular-search-icon': '...'
      }"
  >
      <img 
        slot="addonBefore"
        src="https://img.icons8.com/cute-clipart/64/000000/search.png"
        height="30px"
      />
  </data-search>
```

- **distinctField** `String` [optional]
  This prop returns only the distinct value documents for the specified field. It is equivalent to the `DISTINCT` clause in SQL. It internally uses the collapse feature of Elasticsearch. You can read more about it over [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/collapse-search-results.html).

- **distinctFieldConfig** `Object` [optional]
  This prop allows specifying additional options to the `distinctField` prop. Using the allowed DSL, one can specify how to return K distinct values (default value of K=1), sort them by a specific order, or return a second level of distinct values. `distinctFieldConfig` object corresponds to the `inner_hits` key's DSL. You can read more about it over [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/collapse-search-results.html).

```html
<data-search
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

    > Note: In order to use the `distinctField` and `distinctFieldConfig` props, the `enableAppbase` prop must be set to true in `ReactiveBase`.

-   **index** `String` [optional]
    The index prop can be used to explicitly specify an index to query against for this component. It is suitable for use-cases where you want to fetch results from more than one index in a single ReactiveSearch API request. The default value for the index is set to the `app` prop defined in the ReactiveBase component.

    > Note: This only works when `enableAppbase` prop is set to true in `ReactiveBase`.

## Demo

<br />

<iframe src="https://codesandbox.io/embed/github/appbaseio/reactivesearch/tree/next/packages/vue/examples/data-search" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Styles

`DataSearch` component supports an `innerClass` prop to provide styles to the sub-components of DataSearch. These are the supported keys:

- `title`
- `input`
- `recent-search-icon`
- `popular-search-icon`

Read more about it [here](/docs/reactivesearch/vue/theming/ClassnameInjection/).

## Extending

`DataSearch` component can be extended to:

1. customize the look and feel with `className`,
2. update the underlying DB query with `customQuery`,
3. connect with external interfaces using `beforeValueChange`, `value-change` and `query-change`,
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
				source: suggestion._source, // for onValueSelected to work with renderSuggestion
			}),
		},
	};
</script>
```

- it's also possible to take control of rendering individual suggestions with `parseSuggestion` prop or the entire suggestions rendering using the `render` prop.

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
    @value-change="handleValueChange"
    @query-change="handleQueryChange"
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
							data_field: 'this is a test',
						},
					},
				};
			},
			handleBeforeValueChange: value => {
				// called before the value is set
				// returns a promise
				return new Promise((resolve, reject) => {
					// update state or component props
					resolve();
					// or reject()
				});
			},
			handleValueChange: value => {
				console.log('current value: ', value);
				// set the state
				// use the value with other js code
			},
			handleQueryChange: (prevQuery, nextQuery) => {
				// use the query with other js code
				console.log('prevQuery', prevQuery);
				console.log('nextQuery', nextQuery);
			},
		},
	};
</script>
```

- **className** `String`
  CSS class to be injected on the component container.
- **customQuery** `Function`
  takes **value** and **props** as parameters and **returns** the data query to be applied to the component, as defined in Elasticsearch Query DSL.
  `Note:` customQuery is called on value changes in the **DataSearch** component as long as the component is a part of `react` dependency of at least one other component.
- **defaultQuery** `Function`
  is a callback function that takes **value** and **props** as parameters and **returns** the data query to be applied to the source component, as defined in Elasticsearch Query DSL, which doesn't get leaked to other components. In simple words, `defaultQuery` prop allows you to modify the query to render the suggestions when `autoSuggest` is enabled.
  Read more about it [here](/docs/reactivesearch/vue/advanced/CustomQueries/#when-to-use-default-query).
- **beforeValueChange** `Function`
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

- **react** `Object`
  specify dependent components to reactively update **DataSearch's** suggestions.
  - **key** `String`
    one of `and`, `or`, `not` defines the combining clause.
    - **and** clause implies that the results will be filtered by matches from **all** of the associated component states.
    - **or** clause implies that the results will be filtered by matches from **at least one** of the associated component states.
    - **not** clause implies that the results will be filtered by an **inverse** match of the associated component states.
  - **value** `String or Array or Object`
    - `String` is used for specifying a single component by its `componentId`.
    - `Array` is used for specifying multiple components by their `componentId`.
    - `Object` is used for nesting other key clauses.

## Events

- **change** `function` [optional]
  is an event that accepts component's current **value** as a parameter. It is called when you are using the `value` prop and the component's value changes. This event is useful to control the value updates of search input.

  ```jsx
  <template>
      <data-search
          value="value"
          @change="handleChange"
      />
  </template>

  <script>
  export default {
    name: 'app',
      data() {
          return {
              value: ""
          }
      },
      methods: {
          handleChange(value, triggerQuery, event) {
              this.value = value;
              // Trigger the search query to update the dependent components
              triggerQuery({
                isOpen: false // To close the suggestions dropdown; optional
              })
          }
      }
  };
  </script>
  ```

> Note:
>
> If you're using the controlled behavior than it's your responsibility to call the `triggerQuery` method to update the query i.e execute the search query and update the query results in connected components by `react` prop. It is not mandatory to call the `triggerQuery` in `onChange` you can also call it in other input handlers like `onBlur` or `onKeyPress`. The `triggerQuery` method accepts an object with `isOpen` property (default to `false`) that can be used to control the opening state of the suggestion dropdown.

- **query-change**
  is an event which accepts component's **prevQuery** and **nextQuery** as parameters. It is called everytime the component's query changes. This event is handy in cases where you want to generate a side-effect whenever the component's query would change.
- **value-change**
  is an event which accepts component's current **value** as a parameter. It is called everytime the component's value changes. This event is handy in cases where you want to generate a side-effect on value selection. For example: You want to show a pop-up modal with the valid discount coupon code when a list item is selected in a "Discounted Price" SingleList.
- **value-selected**
  is called when a search is performed either by pressing **enter** key or the input is blurred.

- **suggestions**
  You can use this event to listen for the changes in suggestions.The function receives `suggestions` list.

- **error**
  gets triggered in case of an error and provides the `error` object, which can be used for debugging or giving feedback to the user if needed.

The following events to the underlying `input` element:

- **blur**
- **focus**
- **key-press**
- **key-down**
- **key-up**


> Note:
>
> 1. All these events accepts the `triggerQuery` as a second parameter which can be used to trigger the `DataSearch` query with the current selected value (useful to customize the search query execution).
> 2. There is a known [issue](https://github.com/appbaseio/reactivesearch/issues/1087) with `key-press` when `autosuggest` is set to true. It is recommended to use `key-down` for the consistency.

## Examples

<a href="https://reactivesearch-vue-playground.netlify.com/?selectedKind=Search%20Components%2FDataSearch&selectedStory=Basic&full=0&addons=1&stories=1&panelRight=0" target="_blank">DataSearch with default props</a>
