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
	<data-search componentId="SearchSensor" :dataField="['group_venue', 'group_city']" />
</template>
```

### Usage With All Props

```js
<data-search
  componentId="SearchSensor"
  title="Search"
  defaultSelected="Songwriting"
  placeholder="Search for cities or venues"
  highlightField="group_city"
  queryFormat="or"
  filterLabel="City"
  :autosuggest="true"
  :highlight="true"
  :showFilter="true"
  :fieldWeights="[1, 3]"
  :fuzziness="0"
  :debounce="100"
  :react=`{
    and: ['CategoryFilter', 'SearchFilter']
  }`
  :dataField="['group_venue', 'group_city']"
  :URLParams="false"
/>
```

## Props

-   **componentId** `String`
    unique identifier of the component, can be referenced in other components' `react` prop.
-   **dataField** `String or Array`
    database field(s) to be connected to the component's UI view. DataSearch accepts an Array in addition to String, useful for applying search across multiple fields.
-   **nestedField** `String` [optional]
    use to set the `nested` mapping field that allows arrays of objects to be indexed in a way that they can be queried independently of each other. Applicable only when dataField is a part of `nested` type.
-   **title** `String or JSX` [optional]
    set the title of the component to be shown in the UI.
-   **defaultSelected** `string` [optional]
    preset the search query text in the search box.
-   **fieldWeights** `Array` [optional]
    set the search weight for the database fields, useful when dataField is an Array of more than one field. This prop accepts an array of numbers. A higher number implies a higher relevance weight for the corresponding field in the search results.
-   **placeholder** `String` [optional]
    set the placeholder text to be shown in the searchbox input field. Defaults to "Search".
-   **autosuggest** `Boolean` [optional]
    set whether the autosuggest functionality should be enabled or disabled. Defaults to `true`. When set to `false`, it searches as user types, unless `debounce` is also set.
-   **showIcon** `Boolean` [optional]
    whether to display a search or custom icon in the input box. Defaults to `true`.
-   **iconPosition** `String` [optional]
    sets the position of the search icon. Can be `left` or `right`. Defaults to `right`.
-   **icon** `JSX` [optional]
    displays a custom search icon instead of the default 🔍
-   **showClear** `Boolean` [optional]
    show a clear text icon. Defaults to `false`.
-   **showFilter** `Boolean` [optional]
    show as filter when a value is selected in a global selected filters view. Defaults to `true`.
-   **filterLabel** `String` [optional]
    An optional label to display for the component in the global selected filters view. This is only applicable if `showFilter` is enabled. Default value used here is `componentId`.
-   **clearIcon** `JSX` [optional]
    allows setting a custom icon for clearing text instead of the default cross.
-   **debounce** `Number` [optional]
    sets the milliseconds to wait before executing the query. Defaults to `0`, i.e. no debounce.
-   **highlight** `Boolean` [optional]
    whether highlighting should be enabled in the returned results.
-   **highlightField** `String or Array` [optional]
    when highlighting is enabled, this prop allows specifying the fields which should be returned with the matching highlights. When not specified, it defaults to applying highlights on the field(s) specified in the **dataField** prop.
-   **customHighlight** `Function` [optional]
    a function which returns the custom [highlight settings](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-highlighting.html). It receives the `props` and expects you to return an object with the `highlight` key. Check out the <a href="https://opensource.appbase.io/reactivesearch/demos/technews/" target="_blank">technews demo</a> where the `DataSearch` component uses a `customHighlight` as given below,

```js
<data-search
    componentId="title"
    highlight="true"
    :dataField="['title', 'text']"
    :customHighlight=`(props) => ({
        highlight: {
            pre_tags: ['<mark>'],
            post_tags: ['</mark>'],
            fields: {
                text: {},
                title: {},
            },
            number_of_fragments: 0,
        },
    })`
/>
```

-   **queryFormat** `String` [optional]
    Sets the query format, can be **or** or **and**. Defaults to **or**.

    -   **or** returns all the results matching **any** of the search query text's parameters. For example, searching for "bat man" with **or** will return all the results matching either "bat" or "man".
    -   On the other hand with **and**, only results matching both "bat" and "man" will be returned. It returns the results matching **all** of the search query text's parameters.

-   **fuzziness** `String or Number` [optional]
    Sets a maximum edit distance on the search parameters, can be **0**, **1**, **2** or **"AUTO"**. Useful for showing the correct results for an incorrect search parameter by taking the fuzziness into account. For example, with a substitution of one character, **fox** can become **box**. Read more about it in the elastic search [docs](https://www.elastic.co/guide/en/elasticsearch/guide/current/fuzziness.html).
-   **innerRef** `Function` [optional]
    You can pass a callback using `innerRef` which gets passed to the inner input element as [`ref`](https://reactjs.org/docs/refs-and-the-dom.html).
-   **URLParams** `Boolean` [optional]
    enable creating a URL query string parameter based on the selected value of the list. This is useful for sharing URLs with the component state. Defaults to `false`.
-   **renderNoSuggestion** `String|scoped-slot` [optional]
    can we used to render a message when there is no suggestions found.
-   **renderError** `String|Function|scoped-slot` [optional]
    can be used to render an error message in case of any error.

```js
    renderError={error => (
            <div>
                Something went wrong!<br/>Error details<br/>{error}
            </div>
        )
    }
```

or

```html
<template slot="renderError" scoped-slot="error">
	<div>Something went wrong!<br />Error details<br />{{ error }}</div>
</template>
```

## Demo

<br />

<iframe src="https://codesandbox.io/embed/github/appbaseio/reactivesearch/tree/next/packages/vue/examples/data-search" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Styles

`DataSearch` component supports `innerClass` prop with the following keys:

-   `title`
-   `input`

Read more about it [here](/theming/class.html).

## Extending

`DataSearch` component can be extended to

1. customize the look and feel with `className`,
2. update the underlying DB query with `customQuery`,
3. connect with external interfaces using `beforeValueChange`, `valueChange` and `queryChange`,
4. specify how search suggestions should be filtered using `react` prop.
5. use your own function to render suggestions using `renderSuggestion` prop. It expects an object back for each `suggestion` having keys `label` and `value`. The query is run against the `value` key and `label` is used for rendering the suggestions. `label` can be either `String` or JSX. For example,

```js
<data-search
  ...
  :renderSuggestion="suggestion => ({
    label: `${suggestion._source.original_title} by ${suggestion._source.authors}`,
    value: suggestion._source.original_title,
    source: suggestion._source  // for onValueSelected to work with renderSuggestion
  })"
/>
```

-   it's also possible to take control of rendering individual suggestions with `renderSuggestion` prop or the entire suggestions rendering using the `renderAllSuggestions` prop.

`renderAllSuggestions` can be used as a `scoped-slot` or `Function` which receives some parameters which you may use to build your own custom suggestions rendering

```html
<template
	slot="renderAllSuggestions"
	scoped-slot="{
        currentValue,       // the current value in the search
        isOpen,             // isOpen from downshift
        getItemProps,       // item props to be passed to suggestions
        highlightedIndex,   // index value which should be highlighted
        suggestions,        // unmodified suggestions from Elasticsearch
        parsedSuggestions,  // suggestions parsed by ReactiveSearch
    }"
>
	...
</template>
```

The `suggestions` parameter receives all the unparsed suggestions from elasticsearch, however `parsedSuggestions` are also passed which can also be used for suggestions rendering.

```js
<data-search
  ...
  className="custom-class"
  :customQuery=`
    function(value, props) {
      return {
        query: {
            match: {
                data_field: "this is a test"
            }
        }
      }
    }
  `
  :beforeValueChange=`
    function(value) {
      // called before the value is set
      // returns a promise
      return new Promise((resolve, reject) => {
        // update state or component props
        resolve()
        // or reject()
      })
    }
  `
  @valueChange=`
    function(value) {
      console.log("current value: ", value)
      // set the state
      // use the value with other js code
    }`
  @queryChange=`
    function(prevQuery, nextQuery) {
      // use the query with other js code
      console.log('prevQuery', prevQuery);
      console.log('nextQuery', nextQuery);
    }`
  // specify how and which suggestions are filtered using `react` prop.
  :react=`{
    "and": ["pricingFilter", "dateFilter"],
    "or": ["searchFilter"]
  }`
/>
```

-   **className** `String`
    CSS class to be injected on the component container.
-   **customQuery** `Function`
    takes **value** and **props** as parameters and **returns** the data query to be applied to the component, as defined in Elasticsearch Query DSL.
    `Note:` customQuery is called on value changes in the **DataSearch** component as long as the component is a part of `react` dependency of at least one other component.
-   **beforeValueChange** `Function`
    is a callback function which accepts component's future **value** as a parameter and **returns** a promise. It is called everytime before a component's value changes. The promise, if and when resolved, triggers the execution of the component's query and if rejected, kills the query execution. This method can act as a gatekeeper for query execution, since it only executes the query after the provided promise has been resolved.
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
