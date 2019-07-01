---
id: datacontroller
title: 'DataController'
layout: docs
sectionid: docs
permalink: base-components/datacontroller.html
prev: base-components/tagcloud.html
prevTitle: 'TagCloud'
next: base-components/selectedfilters.html
nextTitle: 'SelectedFilters'
redirect_from:
    - 'basic-components/datacontroller.html'
    - 'base-components/datacontroller'
    - 'datacontroller'
---

![Image to be displayed](https://imgur.com/l0bUQ8u.png)

As the name suggests, a `DataContoller` component creates a UI optional component connected with a custom database query.

There are many cases where filtering of results is controlled by query preferences not visible in the view. A Data Controller comes in handy there.

Example uses:

-   Showing personalized feeds based on user's global preferences that are not visible in the current UI view, like in meetup.com's recommendations to users.
-   Extending the existing UI components to perform a user defined database query.

## Usage

### Basic Usage

```js
<DataController componentId="DataControllerSensor">
	<p>A custom 💪 UI component</p>
</DataController>
```

### Usage With All Props

```js
<DataController
	componentId="DataControllerSensor"
	title="Data Controller Component"
	defaultSelected="default"
	showFilter={true}
	filterLabel="Venue filter"
	URLParams={false}
>
	<p>A custom 💪 UI component</p>
</DataController>
```

## Props

-   **componentId** `String`
     unique id of the sensor, can be referenced in another component's **react** prop.
-   **title** `String or JSX` [optional]
     Sets the title of the component to be shown in the UI, applicable when **visible** is set to `true`.
-   **defaultSelected** `any` [optional]
     pre-select a value in the data controller.
-   **showFilter** `Boolean` [optional]
     show as filter when a value is selected in a global selected filters view. Defaults to `true`.
-   **filterLabel** `String` [optional]
     An optional label to display for the component in the global selected filters view. This is only applicable if `showFilter` is enabled. Default value used here is `componentId`.
-   **URLParams** `Boolean` [optional]
     enable creating a URL query string parameter based on the selected value of the list. This is useful for sharing URLs with the component state. Defaults to `false`.

## Demo

<br />

<iframe src="https://codesandbox.io/embed/github/appbaseio/reactivesearch/tree/dev/packages/web/examples/DataController" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Extending

`DataController` component can be extended to

1. customize the look and feel with `className`, `style`,
2. update the underlying DB query with `customQuery`,
3. connect with external interfaces using `beforeValueChange`, `onValueChange` and `onQueryChange`.

```js
<DataController
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
     CSS styles to be applied to the **DataController** component. This prop is only applicable when **visible** prop is set to `true`.
-   **customQuery** `Function`
     takes **value** and **props** as parameters and **returns** the data query to be applied to the component, as defined in Elasticsearch Query DSL.
    `Note:` customQuery is called on value changes in the **DataController** component as long as the component is a part of `react` dependency of at least one other component.
-   **beforeValueChange** `Function`
     is a callback function which accepts component's future **value** as a parameter and **returns** a promise. It is called everytime before a component's value changes. The promise, if and when resolved, triggers the execution of the component's query and if rejected, kills the query execution. This method can act as a gatekeeper for query execution, since it only executes the query after the provided promise has been resolved.
-   **onValueChange** `Function`
     is a callback function which accepts component's current **value** as a parameter. It is called everytime the component's value changes. This prop is handy in cases where you want to generate a side-effect on value selection. For example: You want to show a pop-up modal with the valid discount coupon code when a user searches for a product via a DataController.
-   **onQueryChange** `Function`
     is a callback function which accepts component's **prevQuery** and **nextQuery** as parameters. It is called everytime the component's query changes. This prop is handy in cases where you want to generate a side-effect whenever the component's query would change.

## Examples

<a href="https://opensource.appbase.io/playground/?selectedKind=Base%20components%2FDataController" target="_blank">DataController with default props</a>
