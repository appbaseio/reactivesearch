---
title: 'SingleRange'
meta_title: 'SingleRange'
meta_description: '`SingleRange` creates a numeric range selector UI component that is connected to a database field.'
keywords:
    - reactivesearch
    - singlerange
    - appbase
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'vue-reactivesearch'
---

![Image to be displayed](https://i.imgur.com/d6u5asg.png)

`SingleRange` creates a numeric range selector UI component that is connected to a database field.

> Note
>
> It is similar to a [SingleList](/docs/reactivesearch/vue/list/SingleList/), except it is suited for numeric data.

Example uses:

-   filtering search results by prices in an e-commerce or food delivery experience.
-   browsing a movies listing site using a ratings filter.

## Usage

### Basic Usage

```html
<template>
	<single-range
		title="Prices"
		componentId="PriceSensor"
		dataField="price"
		:data="
            [{'start': 0, 'end': 10, 'label': 'Cheap'},
            {'start': 11, 'end': 20, 'label': 'Moderate'},
            {'start': 21, 'end': 50, 'label': 'Pricey'},
            {'start': 51, 'end': 1000, 'label': 'First Date'}]
        "
	/>
</template>
```

### Usage With All Props

```html
<template>
	<single-range
		componentId="PriceSensor"
		dataField="price"
		title="Prices"
		defaultSelected="Cheap"
		filterLabel="Price"
		:data="
            [{'start': 0, 'end': 10, 'label': 'Cheap'},
            {'start': 11, 'end': 20, 'label': 'Moderate'},
            {'start': 21, 'end': 50, 'label': 'Pricey'},
            {'start': 51, 'end': 1000, 'label': 'First Date'}]
        "
		:showRadio="true"
		:showFilter="true"
		:URLParams="false"
	/>
</template>
```

## Props

-   **componentId** `String`
    unique identifier of the component, can be referenced in other components' `react` prop.
-   **dataField** `String`
    data field to be connected to the component's UI view. The range items are filtered by a database query on this field.
-   **data** `Object Array`
    collection of UI `labels` with associated `start` and `end` range values.
-   **nestedField** `String` [optional]
    use to set the `nested` mapping field that allows arrays of objects to be indexed in a way that they can be queried independently of each other. Applicable only when dataField is a part of `nested` type.
-   **title** `String or JSX` [optional]
    title of the component to be shown in the UI.
-   **defaultSelected** `String` [optional]
    pre-select a label from the `data` array.
-   **showRadio** `Boolean` [optional]
    show radio button icon for each range item. Defaults to `true`.
-   **showFilter** `Boolean` [optional]
    show as filter when a value is selected in a global selected filters view. Defaults to `true`.
-   **filterLabel** `String` [optional]
    An optional label to display for the component in the global selected filters view. This is only applicable if `showFilter` is enabled. Default value used here is `componentId`.
-   **URLParams** `Boolean` [optional]
    enable creating a URL query string parameter based on the selected value of the range. This is useful for sharing URLs with the component state. Defaults to `false`.

## Demo

<br />

<iframe src="https://codesandbox.io/embed/github/appbaseio/reactivesearch/tree/next/packages/vue/examples/single-range" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Styles

`SingleRange` component supports `innerClass` prop with the following keys:

-   `title`
-   `list`
-   `radio`
-   `label`

Read more about it [here](/docs/reactivesearch/vue/theming/ClassnameInjection/).

## Extending

`SingleRange` component can be extended to

1. customize the look and feel with `className`, `style`,
2. update the underlying DB query with `customQuery`,
3. connect with external interfaces using `beforeValueChange`, `valueChange` and `queryChange`.

```js
<single-range
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
/>
```

-   **className** `String`
    CSS class to be injected on the component container.
-   **customQuery** `Function`
    takes **value** and **props** as parameters and **returns** the data query to be applied to the component, as defined in Elasticsearch Query DSL.
    `Note:` customQuery is called on value changes in the **SingleRange** component as long as the component is a part of `react` dependency of at least one other component.
-   **beforeValueChange** `Function`
    is a callback function which accepts component's future **value** as a parameter and **returns** a promise. It is called everytime before a component's value changes. The promise, if and when resolved, triggers the execution of the component's query and if rejected, kills the query execution. This method can act as a gatekeeper for query execution, since it only executes the query after the provided promise has been resolved.

## Events

-   **queryChange**
    is an event which accepts component's **prevQuery** and **nextQuery** as parameters. It is called everytime the component's query changes. This event is handy in cases where you want to generate a side-effect whenever the component's query would change.
-   **valueChange**
    is an event which accepts component's current **value** as a parameter. It is called everytime the component's value changes. This event is handy in cases where you want to generate a side-effect on value selection. For example: You want to show a pop-up modal with the valid discount coupon code when range item(s) is/are selected in a "Discounted Price" SingleRange.

## Examples

<a href="https://reactivesearch-vue-playground.netlify.com/?selectedKind=Range%20Components%2FSingleRange&selectedStory=Basic&full=0&addons=1&stories=1&panelRight=0" target="_blank">SingleRange with default props</a>
