---
title: 'MultiDropdownList'
meta_title: 'MultiDropdownList'
meta_description: '`MultiDropdownList` creates a dropdown based multiple selection list UI component that is connected to a database field.'
keywords:
    - reactivesearch
    - multidropdownlist
    - appbase
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'vue-reactivesearch'
---

![Image to be displayed](https://i.imgur.com/OUjsjxH.png)

`MultiDropdownList` creates a dropdown based multiple selection list UI component that is connected to a database field. It is used for filtering results based on the current selection from a list of items.

> Note
>
> This component is exactly like the [MultiList](/docs/reactivesearch/vue/list/MultiList/) component except the UI is based on a dropdown, ideal for showing additional UI filters while conserving screen space.

Example uses:

-   create an e-commerce facet like search experience.
-   create a filter for airlines to fly by in a flight booking experience.

## Usage

### Basic Usage

```js
<template>
	<multi-dropdown-list componentId="CitySensor" dataField="group.group_city.raw" title="Cities" />
</template>
```

### Usage With All Props

```html
<multi-dropdown-list
	componentId="CitySensor"
	dataField="group.group_city.raw"
	title="Cities"
	sortBy="count"
	placeholder="Search City"
	filterLabel="City"
	:defaultSelected="['London']"
	:showCount="true"
	:size="100"
	:react="{ and: ['CategoryFilter', 'SearchFilter'] }"
	:showFilter="true"
	:URLParams="false"
/>
```

## Props

-   **componentId** `String`
    unique identifier of the component, can be referenced in other components' `react` prop.
-   **dataField** `String`
    DB data field to be mapped with the component's UI view. The dropdown list items are filtered by a database query on this field. This field is used for doing an aggregation and returns the result. We're using a `.raw` multifield here. You can use a field of type `keyword` or `not_analyzed` depending on your Elasticsearch cluster.
-   **nestedField** `String` [optional]
    use to set the `nested` mapping field that allows arrays of objects to be indexed in a way that they can be queried independently of each other. Applicable only when dataField is a part of `nested` type.
-   **title** `String or JSX` [optional]
    title of the component to be shown in the UI.
-   **size** `Number` [optional]
    control how many items to display in the List. Defaults to 100.
-   **sortBy** `String` [optional]
    property that decides on how to sort the list items, accepts one of `count`, `asc` or `desc` as valid values.
    -   `count` sorts the list based on the count occurences, with highest value at the top.
    -   `asc` sorts the list in the ascending order of the list item (Alphabetical).
    -   `desc` sorts the list in the descending order of the term. Defaulted to `count`.
-   **defaultSelected** `Array` [optional]
    pre-select one or more options from the dropdown list. Accepts an `Array` object containing the items that should be selected. It is important for the passed value(s) exactly match with the field value(s) as stored in appbase.io app.
-   **queryFormat** `String` [optional]
    queries the selected items from the list in one of two modes: `or`, `and`.
    -   Defaults to `or` which queries for results where any of the selected list items are present.
    -   In `and` mode, the applied query filters results where all of the selected items are present.
-   **showCount** `Boolean` [optional]
    show count of number of occurences besides an item. Defaults to `true`.
-   **showSearch** `Boolean` [optional]
    whether to show a searchbox to filter the list items locally. Defaults to false.
-   **renderItem** `Function|scoped-slot` [optional]
    customize the rendered list via a function or scoped-slot which receives the item label, count and isChecked & expects a JSX or String back. For example:

```js
    renderItem={({ label, count }) => (
        <div>
            {label}
            <span style={{ marginLeft: 5, color: 'dodgerblue' }}>
                {count}
            </span>
        </div>
    )}
```

or

```html
<template slot="renderItem" scoped-slot="{ label, count }">
	<div>
		{{label}}
		<span :style="{ marginLeft: 5, color: 'dodgerblue' }">
			{{count}}
		</span>
	</div>
</template>
```

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

-   **transformData** `Function` [optional]
    allows transforming the data to render inside the list. You can change the order, remove, or add items, tranform their values with this method. It provides the data as param which is an array of objects of shape `{ key: <string>, doc_count: <number> }` and expects you to return the array of objects of same shape.
-   **showMissing** `Boolean` [optional]
    defaults to `false`. When set to `true` it also retrives the aggregations for missing fields under the label specified by `missingLabel`.
-   **missingLabel** `String` [optional]
    defaults to `N/A`. Specify a custom label to show when `showMissing` is set to `true`.
-   **placeholder** `String` [optional]
    placeholder to be displayed in the dropdown searchbox.
-   **showFilter** `Boolean` [optional]
    show as filter when a value is selected in a global selected filters view. Defaults to `true`.
-   **filterLabel** `String` [optional]
    An optional label to display for the component in the global selected filters view. This is only applicable if `showFilter` is enabled. Default value used here is `componentId`.
-   **URLParams** `Boolean` [optional]
    enable creating a URL query string parameter based on the selected value of the list. This is useful for sharing URLs with the component state. Defaults to `false`.
-   **showLoadMore** `Boolean` [optional]
    defaults to `false` and works only with elasticsearch >= 6 since it uses [composite aggregations](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-composite-aggregation.html). This adds a "Load More" button to load the aggs on demand combined with the `size` prop. Composite aggregations are in beta and this is an experimental API which might change in a future release.

## Demo

<br/>
<iframe src="https://codesandbox.io/embed/github/appbaseio/reactivesearch/tree/next/packages/vue/examples/multi-dropdown-list" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Styles

`MultiDropdownList` component supports `innerClass` prop with the following keys:

-   `title`
-   `select`
-   `list`
-   `icon`
-   `count`

Read more about it [here](/docs/reactivesearch/vue/theming/ClassnameInjection/).

## Extending

`MultiDropdownList` component can be extended to

1. customize the look and feel with `className`,
2. update the underlying DB query with `customQuery` & `defaultQuery`,
3. connect with external interfaces using `beforeValueChange`, `valueChange` and `queryChange`,
4. specify how options should be filtered or updated using `react` prop.

```js
<multi-dropdown-list
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
    }`
    :beforeValueChange=`
        function(value) {
        // called before the value is set
        // returns a promise
        return new Promise((resolve, reject) => {
            // update state or component props
            resolve()
            // or reject()
        })
    }`
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
    // specify how and which options are filtered using `react` prop.
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
    `Note:` customQuery is called on value changes in the **MultiDropdownList** component as long as the component is a part of `react` dependency of at least one other component.
-   **defaultQuery** `Function`
    takes **value** and **props** as parameters and **returns** the data query to be applied to the source component, as defined in Elasticsearch Query DSL.
    `Note:` defaultQuery doesn't get leaked to other components.
-   **beforeValueChange** `Function`
    is a callback function which accepts component's future **value** as a parameter and **returns** a promise. It is called everytime before a component's value changes. The promise, if and when resolved, triggers the execution of the component's query and if rejected, kills the query execution. This method can act as a gatekeeper for query execution, since it only executes the query after the provided promise has been resolved.
-   **react** `Object`
    specify dependent components to reactively update **MultiDropdownList's** options.
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
-   **error**
    gets triggered in case of an error and provides the `error` object, which can be used for debugging or giving feedback to the user if needed.
