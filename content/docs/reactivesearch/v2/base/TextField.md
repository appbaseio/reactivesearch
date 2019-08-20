---
title: 'TextField'
meta_title: 'TextField'
meta_description: '`TextField` creates a simple text input field component that is optionally data connected.'
keywords:
    - reactivesearch
    - textfield
    - appbase
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'web-v2-reactivesearch'
---

![Image to be displayed](https://i.imgur.com/rdankwu.png)

`TextField` creates a simple text input field component that is optionally data connected. It can be further extended by specifying a user defined query on the input data.

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
	title="TextField"
	defaultSelected="volvo"
	placeholder="Type a car name"
	showFilter={true}
	filterLabel="Car"
	URLParams={false}
/>
```

## Props

-   **componentId** `String`
    unique identifier of the component, can be referenced in other components' `react` prop.
-   **dataField** `String`
    data field to be connected to the component's UI view.
-   **title** `String or JSX` [optional]
    title of the component to be shown in the UI.
-   **defaultSelected** `String` [optional]
    preset some value in the text field.
-   **placeholder** `String` [optional]
    placeholder to be displayed in the text field when it has no value.
-   **showClear** `Boolean` [optional]
    show a clear text icon. Defaults to `false`.
-   **clearIcon** `JSX` [optional]
    allows setting a custom icon for clearing text instead of the default cross.
-   **showFilter** `Boolean` [optional]
    show as filter when a value is selected in a global selected filters view. Defaults to `true`.
-   **filterLabel** `String` [optional]
    An optional label to display for the component in the global selected filters view. This is only applicable if `showFilter` is enabled. Default value used here is `componentId`.
-   **innerRef** `Function` [optional]
    You can pass a callback using `innerRef` which gets passed to the inner input element as [`ref`](https://reactjs.org/docs/refs-and-the-dom.html).
-   **URLParams** `Boolean` [optional]
    enable creating a URL query string parameter based on the selected value of the text field. This is useful for sharing URLs with the component state. Defaults to `false`.

## Demo

<br />

<iframe src="https://codesandbox.io/embed/github/appbaseio/reactivesearch/tree/dev/packages/web/examples/TextField" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Styles

`TextField` component supports `innerClass` prop with the following keys:

-   title
-   input

Read more about it [here](/docs/reactivesearch/v2/theming/ClassnameInjection/).

## Extending

`TextField` component can be extended to

1. customize the look and feel with `className`, `style`,
2. update the underlying DB query with `customQuery`,
3. connect with external interfaces using `beforeValueChange`, `onValueChange` and `onQueryChange`,
4. add the following [synthetic events](https://reactjs.org/events.html) to the underlying `input` element:
    - onBlur
    - onFocus
    - onKeyPress
    - onKeyDown
    - onKeyUp
    - autoFocus

```js
<TextField
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

## Examples

<a href="https://opensource.appbase.io/playground/?selectedKind=Base%20components%2FTextField" target="_blank">TextField with default props</a>
