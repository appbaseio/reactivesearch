---
title: 'TextField'
meta_title: 'TextField'
meta_description: '`TextField` creates a simple text input field component connected to data.'
keywords:
    - reactivesearch-native
    - textfield
    - appbase
    - elasticsearch
sidebar: 'native-reactivesearch'
---

![](https://i.imgur.com/LONj15o.png)
![](https://i.imgur.com/cxXtf3D.png)

`TextField` creates a simple text input field component connected to data. It can be further extended by specifying a user defined query on the input data.

## Usage

### Basic Usage

```js
<TextField componentId="NameTextSensor" dataField="name" />
```

### Usage With All Props

```js
<TextField
	componentId="NameTextSensor"
	dataField="name"
	defaultSelected="volvo"
	placeholder="Type a car name"
	debounce={300}
	showFilter={true}
	filterLabel="Car"
/>
```

## Props

-   **componentId** `String`
    unique identifier of the component, can be referenced in other components' `react` prop.
-   **dataField** `String`
    data field to be connected to the component's UI view.
-   **defaultSelected** `String` [optional]
    preset some value in the text field.
-   **placeholder** `String` [optional]
    placeholder to be displayed in the text field when it has no value.
-   **debounce** `Number` [optional]
    delays executing the query by the specified time in **ms** while the user is typing. Defaults to `0`, i.e. no debounce. Useful if you want to save on the number of requests sent.
-   **showFilter** `Boolean` [optional]
    show as filter when a value is selected in a global selected filters view. Defaults to `true`.
-   **filterLabel** `String` [optional]
    An optional label to display for the component in the global selected filters view. This is only applicable if `showFilter` is enabled. Default value used here is `componentId`.
-   **innerProps** `Object` [optional]
    specifies additional props for the internal components. Accepts an object with the specified keys. Read more about the usage [here](/advanced/innerprops.html)

<br />

|  **Key** |                                            **Explanation**                                            |
| -------: | :---------------------------------------------------------------------------------------------------: |
|   `item` |  The wrapping [Item](http://docs.nativebase.io/Components.html#Form) component from **native-base**   |
|   `icon` |   [Icon](http://docs.nativebase.io/Components.html#icon-def-headref) component from **native-base**   |
|  `input` |        [Input](http://docs.nativebase.io/Components.html#Form) component from **native-base**         |
| `button` | [Button](http://docs.nativebase.io/Components.html#button-def-headref) component from **native-base** |

## Demo

<br />

<div data-snack-id="@dhruvdutt/textfield-example" data-snack-platform="ios" data-snack-preview="true" data-snack-theme="light" style="overflow:hidden;background:#fafafa;border:1px solid rgba(0,0,0,.16);border-radius:4px;height:505px;width:100%"></div>

<a href="https://snack.expo.io/@dhruvdutt/textfield-example" target="_blank">View on Snack</a>

## Styles

`TextField` component supports `style` prop. Read more about it [here](/advanced/style.html).

It also supports an `innerStyle` prop with the following keys

-   `button`
-   `icon`
-   `input`

Read more about it [here](/advanced/style.html#innerstyle)

## Extending

`TextField` component can be extended to

1. customize the look and feel with `style`,
2. update the underlying DB query with `customQuery`,
3. connect with external interfaces using `beforeValueChange`, `onValueChange` and `onQueryChange`,

```js
<TextField
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
    CSS styles to be applied to the **TextField** component.
-   **customQuery** `Function`
    takes **value** and **props** as parameters and **returns** the data query to be applied to the component, as defined in Elasticsearch Query DSL.
    `Note:` customQuery is called on value changes in the **TextField** component as long as the component is a part of `react` dependency of at least one other component.
-   **beforeValueChange** `Function`
    is a callback function which accepts component's future **value** as a parameter and **returns** a promise. It is called everytime before a component's value changes. The promise, if and when resolved, triggers the execution of the component's query and if rejected, kills the query execution. This method can act as a gatekeeper for query execution, since it only executes the query after the provided promise has been resolved.
-   **onValueChange** `Function`
    is a callback function which accepts component's current **value** as a parameter. It is called everytime the component's value changes. This prop is handy in cases where you want to generate a side-effect on value selection. For example: You want to show a pop-up modal with the valid discount coupon code when a user searches for something in the TextField.
-   **onQueryChange** `Function`
    is a callback function which accepts component's **prevQuery** and **nextQuery** as parameters. It is called everytime the component's query changes. This prop is handy in cases where you want to generate a side-effect whenever the component's query would change.
