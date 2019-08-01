---
title: 'RangeSlider'
meta_title: 'RangeSlider'
meta_description: '`RangeSlider` creates a numeric range slider UI component. It is used for granular filtering of numeric data.'
keywords:
    - reactivesearch
    - rangeslider
    - appbase
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'web-reactivesearch'
---

![Image to be displayed](https://i.imgur.com/gK5zwRo.png)

`RangeSlider` creates a numeric range slider UI component. It is used for granular filtering of numeric data.

Example uses:

-   filtering products from a price range in an e-commerce shopping experience.
-   filtering flights from a range of departure and arrival times.

## Usage

### Basic Usage

```js
<RangeSlider
	componentId="RangeSliderSensor"
	dataField="guests"
	title="Guests"
	range={{
		start: 0,
		end: 10,
	}}
/>
```

While `RangeSlider` only requires the above props to be used, it comes with many additional props for pre-setting default range values, setting the step value of the range slider, specifying labels for the range endpoints, whether to display histogram etc.

### Usage With All Props

```js
<RangeSlider
	componentId="RangeSliderSensor"
	dataField="guests"
	title="Guests"
	range={{
		start: 0,
		end: 10,
	}}
	defaultValue={{
		start: 1,
		end: 5,
	}}
	rangeLabels={{
		start: 'Start',
		end: 'End',
	}}
	stepValue={1}
	showHistogram={true}
	showFilter={true}
	interval={2}
	react={{
		and: ['CategoryFilter', 'SearchFilter'],
	}}
	URLParams={false}
/>
```

## Props

-   **componentId** `String`
    unique identifier of the component, can be referenced in other components' `react` prop.
-   **dataField** `String`
    DB data field to be mapped with the component's UI view. The selected range creates a database query on this field.
-   **range** `Object`
    an object with `start` and `end` keys and corresponding numeric values denoting the minimum and maximum possible slider values.
-   **nestedField** `String` [optional]
    use to set the `nested` mapping field that allows arrays of objects to be indexed in a way that they can be queried independently of each other. Applicable only when dataField is a part of `nested` type.
-   **title** `String or JSX` [optional]
    title of the component to be shown in the UI.
-   **defaultValue** `Object` [optional]
    selects a initial range values using `start` and `end` key values from one of the data elements.
-   **value** `Object` [optional]
    controls the current value of the component. It selects the data from the range (on mount and on update). Use this prop in conjunction with `onChange` function.
-   **onChange** `function` [optional]
    is a callback function which accepts component's current **value** as a parameter. It is called when you are using the `value` prop and the component's value changes. This prop is used to implement the [controlled component](https://reactjs.org/docs/forms.html#controlled-components) behavior.
-   **rangeLabels** `Object` [optional]
    an object with `start` and `end` keys and corresponding `String` labels to show labels near the ends of the `RangeSlider` component.
-   **showFilter** `Boolean` [optional]
    show the selected item as a filter in the selected filters view. Defaults to `true`.
-   **snap** `Boolean` [optional]
    makes the slider snap on to points depending on the `stepValue` when the slider is released. Defaults to `true`. When set to `false`, `stepValue` is ignored.
-   **stepValue** `Number` [optional]
    step value specifies the slider stepper. Value should be an integer greater than or equal to `1` and less than `Math.floor((range.end - range.start) / 2)`. Defaults to 1.
-   **tooltipTrigger** `String` [optional]
    trigger the tooltip according to the value specified. Can be `hover`, `focus`, `always` and `none`. Defaults to `none`.
-   **renderTooltipData** `Function` [optional]
    customize the rendered tooltip content via a function which receives the tooltip content and expects a JSX or String back. For example:

    ```js
    renderTooltipData={data => (
        <h5 style={{
            color: 'red',
            textDecoration: 'underline'
        }}>
            {data}
        </h5>
    )}
    ```

-   **showHistogram** `Boolean` [optional]
    whether to display the range histogram or not. Defaults to `true`.
-   **interval** `Number` [optional]
    set the histogram bar interval, applicable when _showHistogram_ is `true`. Defaults to `Math.ceil((props.range.end - props.range.start) / 100) || 1`.
-   **URLParams** `Boolean` [optional]
    enable creating a URL query string parameter based on the selected value of the list. This is useful for sharing URLs with the component state. Defaults to `false`.

## Demo

<br />

<iframe src="https://codesandbox.io/embed/github/appbaseio/reactivesearch/tree/next/packages/web/examples/RangeSlider" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Styles

`RangeSlider` component supports `innerClass` prop with the following keys:

-   `title`
-   `slider`
-   `label`

Read more about it [here](/theming/class.html).

## Extending

`RangeSlider` component can be extended to

1. customize the look and feel with `className`, `style`,
2. update the underlying DB query with `customQuery`,
3. connect with external interfaces using `beforeValueChange`, `onValueChange` and `onQueryChange`,
4. filter data using a combined query context via the `react` prop.

```js
<RangeSlider
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
  onQueryChange={
    function(prevQuery, nextQuery) {
      // use the query with other js code
      console.log('prevQuery', prevQuery);
      console.log('nextQuery', nextQuery);
    }
  }
  react={{
    "and": ["ListSensor"]
  }}
/>
```

-   **className** `String`
    CSS class to be injected on the component container.
-   **style** `Object`
    CSS styles to be applied to the **RangeSlider** component.
-   **customQuery** `Function`
    takes **value** and **props** as parameters and **returns** the data query to be applied to the component, as defined in Elasticsearch Query DSL.
    `Note:` customQuery is called on value changes in the **RangeSlider** component as long as the component is a part of `react` dependency of at least one other component.
-   **beforeValueChange** `Function`
    is a callback function which accepts component's future **value** as a parameter and **returns** a promise. It is called everytime before a component's value changes. The promise, if and when resolved, triggers the execution of the component's query and if rejected, kills the query execution. This method can act as a gatekeeper for query execution, since it only executes the query after the provided promise has been resolved.
-   **onValueChange** `Function`
    is a callback function which accepts component's current **value** as a parameter. It is called everytime the component's value changes. This prop is handy in cases where you want to generate a side-effect on value selection. For example: You want to show a pop-up modal with the valid discount coupon code when some range is selected in a "Discounted Price" RangeSlider.
-   **onQueryChange** `Function`
    is a callback function which accepts component's **prevQuery** and **nextQuery** as parameters. It is called everytime the component's query changes. This prop is handy in cases where you want to generate a side-effect whenever the component's query would change.
-   **react** `Object`
    specify dependent components to reactively update **RangeSlider's** data view.
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

See more stories for RangeSlider on playground.

<a href="https://opensource.appbase.io/playground/?selectedKind=Range%20components%2FRangeSlider" target="_blank">RangeSlider with default props</a>
