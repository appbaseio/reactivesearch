---
title: 'SingleDropdownRange'
meta_title: 'SingleDropdownRange'
meta_description: '`SingleDropdownRange` creates a dropdown based numeric range UI component.'
keywords:
    - reactivesearch-native
    - singledropdownrange
    - appbase
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'native-reactivesearch'
---

![](https://i.imgur.com/wRAfxTB.png)
![](https://i.imgur.com/wRuR7yf.png)

`SingleDropdownRange` creates a dropdown based numeric range UI component.

Example uses:

-   filtering search results by prices in an e-commerce or food delivery experience.
-   browsing movies by a ratings filter.

## Usage

### Basic Usage

```js
<SingleDropdownRange
	componentId="PriceSensor"
	dataField="price"
	data={[
		{ start: 0, end: 10, label: 'Cheap' },
		{ start: 11, end: 20, label: 'Moderate' },
		{ start: 21, end: 50, label: 'Pricey' },
		{ start: 51, end: 1000, label: 'First Date' },
	]}
/>
```

### Usage With All Props

```js
<SingleDropdownRange
	componentId="PriceSensor"
	dataField="price"
	data={[
		{ start: 0, end: 10, label: 'Cheap' },
		{ start: 11, end: 20, label: 'Moderate' },
		{ start: 21, end: 50, label: 'Pricey' },
		{ start: 51, end: 1000, label: 'First Date' },
	]}
	defaultSelected="Cheap"
	placeholder="Select price range"
	showFilter={true}
	filterLabel="Price"
/>
```

## Props

-   **componentId** `String`
    unique identifier of the component, can be referenced in other components' `react` prop.
-   **dataField** `String`
    data field to be connected to the component's UI view.
-   **data** `Object Array`
    collection of UI `labels` with associated `start` and `end` range values.
-   **defaultSelected** `String` [optional]
    pre-select a label from the `data` array.
-   **placeholder** `String` [optional]
    placeholder to be displayed in the dropdown searchbox. Defaults to "Select a value".
-   **showFilter** `Boolean` [optional]
    show as filter when a value is selected in a global selected filters view. Defaults to `true`.
-   **filterLabel** `String` [optional]
    An optional label to display for the component in the global selected filters view. This is only applicable if `showFilter` is enabled. Default value used here is `componentId`.
-   **innerProps** `Object` [optional]
    specifies additional props for the internal components. Accepts an object with the specified keys. Read more about the usage [here](/docs/reactivesearch/native/advanced/innerProps)

<br />

|      **Key** |                                              **Explanation**                                               |
| -----------: | :--------------------------------------------------------------------------------------------------------: |
|     `picker` |   [Picker](http://docs.nativebase.io/Components.html#picker-def-headref) component from **native-base**    |
| `pickerItem` | [Picker.Item](http://docs.nativebase.io/Components.html#picker-def-headref) component from **native-base** |

## Demo

<br />

<div data-snack-id="@dhruvdutt/singledropdownrange-example" data-snack-platform="ios" data-snack-preview="true" data-snack-theme="light" style="overflow:hidden;background:#fafafa;border:1px solid rgba(0,0,0,.16);border-radius:4px;height:505px;width:100%"></div>

<a href="https://snack.expo.io/@dhruvdutt/singledropdownrange-example" target="_blank">View on Snack</a>

## Styles

`SingleDropdownRange` component supports `style` prop. Read more about it [here](/docs/reactivesearch/native/advanced/Style).

It also supports an `innerStyle` prop with the following keys:

-   `label`
-   `title`

Read more about it [here](/docs/reactivesearch/native/advanced/Style#innerstyle)

## Extending

`SingleDropdownRange` component can be extended to

1. customize the look and feel with `style`,
2. update the underlying DB query with `customQuery`,
3. connect with external interfaces using `beforeValueChange`, `onValueChange` and `onQueryChange`

```js
<SingleDropdownRange
  ...
  style={{ paddingBottom: 10 }}
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

-   **style** `Object`
    CSS styles to be applied to the **SingleDropdownRange** component.
-   **customQuery** `Function`
    takes **value** and **props** as parameters and **returns** the data query to be applied to the component, as defined in Elasticsearch Query DSL.
    `Note:` customQuery is called on value changes in the **SingleDropdownRange** component as long as the component is a part of `react` dependency of at least one other component.
-   **beforeValueChange** `Function`
    is a callback function which accepts component's future **value** as a parameter and **returns** a promise. It is called everytime before a component's value changes. The promise, if and when resolved, triggers the execution of the component's query and if rejected, kills the query execution. This method can act as a gatekeeper for query execution, since it only executes the query after the provided promise has been resolved.
-   **onValueChange** `Function`
    is a callback function which accepts component's current **value** as a parameter. It is called everytime the component's value changes. This prop is handy in cases where you want to generate a side-effect on value selection. For example: You want to show a pop-up modal with the valid discount coupon code when a user searches for something in the SingleDropdownRange.
-   **onQueryChange** `Function`
    is a callback function which accepts component's **prevQuery** and **nextQuery** as parameters. It is called everytime the component's query changes. This prop is handy in cases where you want to generate a side-effect whenever the component's query would change.
