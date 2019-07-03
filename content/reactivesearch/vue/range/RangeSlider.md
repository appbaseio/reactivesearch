---
id: rangeslider
title: 'RangeSlider'
meta_title: 'RangeSlider'
meta_description: '`RangeSlider` creates a numeric range slider UI component.'
keywords:
    - reactivesearch
    - rangeslider
    - appbase
    - elasticsearch
sidebar: 'vue-reactivesearch'
---

![Image to be displayed](https://i.imgur.com/Q39TgCB.png)

`RangeSlider` creates a numeric range slider UI component. It is used for granular filtering of numeric data.

Example uses:

-   filtering products from a price range in an e-commerce shopping experience.
-   filtering flights from a range of departure and arrival times.

## Usage

### Basic Usage

```html
<template>
	<range-slider
		dataField="ratings_count"
		componentId="BookSensor"
		title="RangeSlider: Ratings"
		:range="{
        start: 3000,
        end: 50000
      }"
	/>
</template>
```

While `RangeSlider` only requires the above props to be used, it comes with many additional props for pre-setting default range values, setting the step value of the range slider, specifying labels for the range endpoints, whether to display histogram etc.

### Usage With All Props

```html
<template>
	<range-slider
		dataField="ratings_count"
		componentId="BookSensor"
		title="RangeSlider: Ratings"
		:range="{
        start: 3000,
        end: 50000
      }"
		:defaultSelected="{
        start: 1,
        end: 5
      }"
		:showFilter="true"
		:URLParams="false"
	/>
</template>
```

## Props

-   **componentId** `String`
     unique identifier of the component, can be referenced in other components' `react` prop.
-   **dataField** `String`
     DB data field to be mapped with the component's UI view. The selected range creates a database query on this field.
-   **nestedField** `String` [optional]
     use to set the `nested` mapping field that allows arrays of objects to be indexed in a way that they can be queried independently of each other. Applicable only when dataField is a part of `nested` type.
-   **range** `Object`
    an object with `start` and `end` keys and corresponding numeric values denoting the minimum and maximum possible slider values.
-   **title** `String or JSX` [optional]
     title of the component to be shown in the UI.
-   **defaultSelected** `Object` [optional]
     an object with `start` and `end` keys and corresponding numeric values denoting the pre-selected range values.
-   **showFilter** `Boolean` [optional]
     show the selected item as a filter in the selected filters view. Defaults to `true`.
-   **URLParams** `Boolean` [optional]
     enable creating a URL query string parameter based on the selected value of the list. This is useful for sharing URLs with the component state. Defaults to `false`.
-   **sliderOptions** `Object` [optional]
    use to pass props directly to the slider component `RangeSlider` uses. Read more about it [here](https://github.com/NightCatSama/vue-slider-component)

## Demo

<br/>
<iframe src="https://codesandbox.io/embed/github/appbaseio/reactivesearch/tree/next/packages/vue/examples/range-slider" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Styles

`RangeSlider` component supports `innerClass` prop with the following keys:

-   `title`

Read more about it [here](/theming/class.html).

## Extending

`RangeSlider` component can be extended to

1. customize the look and feel with `className`, `style`,
2. update the underlying DB query with `customQuery`,
3. connect with external interfaces using `beforeValueChange`, `valueChange` and `queryChange`.

```js
<range-slider
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
    `Note:` customQuery is called on value changes in the **RangeSlider** component as long as the component is a part of `react` dependency of at least one other component.
-   **beforeValueChange** `Function`
     is a callback function which accepts component's future **value** as a parameter and **returns** a promise. It is called everytime before a component's value changes. The promise, if and when resolved, triggers the execution of the component's query and if rejected, kills the query execution. This method can act as a gatekeeper for query execution, since it only executes the query after the provided promise has been resolved.

## Events

-   **queryChange**
     is an event which accepts component's **prevQuery** and **nextQuery** as parameters. It is called everytime the component's query changes. This event is handy in cases where you want to generate a side-effect whenever the component's query would change.
-   **valueChange**
     is an event which accepts component's current **value** as a parameter. It is called everytime the component's value changes. This event is handy in cases where you want to generate a side-effect on value selection.For example: You want to show a pop-up modal with the valid discount coupon code when some range is selected in a “Discounted Price” RangeSlider.
