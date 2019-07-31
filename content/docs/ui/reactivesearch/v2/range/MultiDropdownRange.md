---
title: 'MultiDropdownRange'
meta_title: 'MultiDropdownRange'
meta_description: '`MultiDropdownRange` creates a dropdown based multiple numeric range UI component that is connected to a database field.'
keywords:
    - reactivesearch
    - multidropdownrange
    - appbase
    - elasticsearch
sidebar: 'web-v2-reactivesearch'
---

![Image to be displayed](https://i.imgur.com/VdWiHD3.png)

`MultiDropdownRange` creates a dropdown based multiple numeric range UI component that is connected to a database field.

> Note
>
> It is exactly like the [MultiRange](/basic-components/multirange.html) component but displayed in a dropdown, ideal for showing additional UI filters while conserving screen space

Example uses:

-   filtering search results by prices in an e-commerce or food delivery experience.
-   browsing movies by a ratings filter.

## Usage

### Basic Usage

```js
<MultiDropdownRange
	componentId="PriceSensor"
	dataField="price"
	data={[
		{ start: 0, end: 10, label: 'Cheap' },
		{ start: 11, end: 20, label: 'Moderate' },
		{ start: 21, end: 50, label: 'Pricey' },
		{ start: 51, end: 1000, label: 'First Date' },
	]}
	title="Prices"
/>
```

### Usage With All Props

```js
<MultiDropdownRange
	componentId="PriceSensor"
	dataField="price"
	data={[
		{ start: 0, end: 10, label: 'Cheap' },
		{ start: 11, end: 20, label: 'Moderate' },
		{ start: 21, end: 50, label: 'Pricey' },
		{ start: 51, end: 1000, label: 'First Date' },
	]}
	title="Prices"
	defaultSelected={['Cheap', 'Moderate']}
	placeholder="Select price ranges"
	showFilter={true}
	filterLabel="Price"
	URLParams={false}
/>
```

## Props

-   **componentId** `String`
    unique identifier of the component, can be referenced in other components' `react` prop.
-   **dataField** `String`
    data field to be connected to the component's UI view. The range items are filtered by a database query on this field.
-   **data** `Object Array`
    collection of UI `labels` with associated `start` and `end` range values.
-   **title** `String or JSX` [optional]
    title of the component to be shown in the UI.
-   **defaultSelected** `Array` [optional]
    pre-select one or more labels from the `data` array.
-   **placeholder** `String` [optional]
    set the placeholder to show for the dropdown UI, useful when no option is `defaultSelected`. The default placeholder value is set to "Select a value".
-   **showFilter** `Boolean` [optional]
    show as filter when a value is selected in a global selected filters view. Defaults to `true`.
-   **filterLabel** `String` [optional]
    An optional label to display for the component in the global selected filters view. This is only applicable if `showFilter` is enabled. Default value used here is `componentId`.
-   **URLParams** `Boolean` [optional]
    enable creating a URL query string parameter based on the selected value of the list. This is useful for sharing URLs with the component state. Defaults to `false`.

## Demo

<br />

<iframe src="https://codesandbox.io/embed/github/appbaseio/reactivesearch/tree/dev/packages/web/examples/MultiDropdownRange" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Styles

`MultiDropdownRange` component supports `innerClass` prop with the following keys:

-   `title`
-   `select`
-   `list`
-   `icon`

Read more about it [here](/theming/class.html).

## Extending

`MultiDropdownRange` component can be extended to

1. customize the look and feel with `className`, `style`,
2. update the underlying DB query with `customQuery`,
3. connect with external interfaces using `beforeValueChange`, `onValueChange` and `onQueryChange`.

```js
<MultiDropdownRange
  ...
  className="custom-class"
  style={{"paddingBottom": "10px"}}
  customQuery={
    function(value, props) {
      return {
        match: {
          data_field: "this is a test"
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
/>
```

-   **className** `String`
    CSS class to be injected on the component container.
-   **style** `Object`
    CSS styles to be applied to the **MultiDropdownRange** component.
-   **customQuery** `Function`
    takes **value** and **props** as parameters and **returns** the data query to be applied to the component, as defined in Elasticsearch Query DSL.
    `Note:` customQuery is called on value changes in the **MultiDropdownRange** component as long as the component is a part of `react` dependency of at least one other component.
-   **beforeValueChange** `Function`
    is a callback function which accepts component's future **value** as a parameter and **returns** a promise. It is called everytime before a component's value changes. The promise, if and when resolved, triggers the execution of the component's query and if rejected, kills the query execution. This method can act as a gatekeeper for query execution, since it only executes the query after the provided promise has been resolved.
-   **onValueChange** `Function`
    is a callback function which accepts component's current **value** as a parameter. It is called everytime the component's value changes. This prop is handy in cases where you want to generate a side-effect on value selection. For example: You want to show a pop-up modal with the valid discount coupon code(s) when range item(s) is/are selected in a "Prices" MultiDropdownRange.
-   **onQueryChange** `Function`
    is a callback function which accepts component's **prevQuery** and **nextQuery** as parameters. It is called everytime the component's query changes. This prop is handy in cases where you want to generate a side-effect whenever the component's query would change.

## Examples

<a href="https://opensource.appbase.io/playground/?selectedKind=Range%20components%2FMultiDropdownRange" target="_blank">MultiDropdownRange with default props</a>
