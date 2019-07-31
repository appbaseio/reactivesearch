---
title: 'MultiRange'
meta_title: 'MultiRange'
meta_description: '`MultiRange` creates a multiple checkbox based numeric range UI component.'
keywords:
    - reactivesearch
    - multirange
    - appbase
    - elasticsearch
sidebar: 'vue-reactivesearch'
---

![Image to be displayed](https://i.imgur.com/Qq4sdKM.png)

`MultiRange` creates a multiple checkbox based numeric range UI component.

> Note
>
> It is similar to a [MultiList](/basic-components/multilist.html) component but for numeric data fields.

Example uses:

-   filtering search results by prices in an e-commerce or food delivery experience.
-   browsing movies by a ratings filter.

## Usage

### Basic Usage

```html
<template>
	<multi-range
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
	<multi-range
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
-   **nestedField** `String` [optional]
     use to set the `nested` mapping field that allows arrays of objects to be indexed in a way that they can be queried independently of each other. Applicable only when dataField is a part of `nested` type.
-   **data** `Object Array`
     collection of UI `labels` with associated `start` and `end` range values.
-   **title** `String or JSX` [optional]
     title of the component to be shown in the UI.
-   **defaultSelected** `String` [optional]
     pre-select a label from the `data` array.
-   **showCheckbox** `Boolean` [optional]
     show checkbox icon for each range item. Defaults to `true`.
-   **showFilter** `Boolean` [optional]
     show as filter when a value is selected in a global selected filters view. Defaults to `true`.
-   **filterLabel** `String` [optional]
     An optional label to display for the component in the global selected filters view. This is only applicable if `showFilter` is enabled. Default value used here is `componentId`.
-   **URLParams** `Boolean` [optional]
     enable creating a URL query string parameter based on the selected value of the range. This is useful for sharing URLs with the component state. Defaults to `false`.

## Demo

<iframe src="https://codesandbox.io/embed/github/appbaseio/reactivesearch/tree/next/packages/vue/examples/multi-Range" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Styles

`MultiRange` component supports `innerClass` prop with the following keys:

-   `title`
-   `list`
-   `checkbox`
-   `label`

Read more about it [here](/theming/class.html).

## Extending

`MultiRange` component can be extended to

1. customize the look and feel with `className`, `style`,
2. update the underlying DB query with `customQuery`,
3. connect with external interfaces using `beforeValueChange`, `valueChange` and `queryChange`.

```js
<multi-range
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
-   **style** `Object`
     CSS styles to be applied to the **MultiRange** component.
-   **customQuery** `Function`
     takes **value** and **props** as parameters and **returns** the data query to be applied to the component, as defined in Elasticsearch Query DSL.
    `Note:` customQuery is called on value changes in the **MultiRange** component as long as the component is a part of `react` dependency of at least one other component.
-   **beforeValueChange** `Function`
     is a callback function which accepts component's future **value** as a parameter and **returns** a promise. It is called everytime before a component's value changes. The promise, if and when resolved, triggers the execution of the component's query and if rejected, kills the query execution. This method can act as a gatekeeper for query execution, since it only executes the query after the provided promise has been resolved.

## Events

-   **queryChange**
     is an event which accepts component's **prevQuery** and **nextQuery** as parameters. It is called everytime the component's query changes. This event is handy in cases where you want to generate a side-effect whenever the component's query would change.
-   **valueChange**
     is an event which accepts component's current **value** as a parameter. It is called everytime the component's value changes. This event is handy in cases where you want to generate a side-effect on value selection. For example: You want to show a pop-up modal with the valid discount coupon code when a range item is selected in a "Discounted Price" MultiRange.
