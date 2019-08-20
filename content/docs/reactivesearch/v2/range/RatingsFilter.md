---
title: 'RatingsFilter'
meta_title: 'RatingsFilter'
meta_description: '`RatingsFilter` creates a Ratings Filter UI component.'
keywords:
    - reactivesearch
    - ratingsfilter
    - appbase
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'web-v2-reactivesearch'
---

![Image to be displayed](https://i.imgur.com/7GHyqJp.png)

`RatingsFilter` creates a Ratings Filter UI component. It is used for filtering results based on a ratings score.

Example uses:

-   filtering movie listings by their ratings.
-   filtering items in an e-commerce search listing based on its ratings.

## Usage

### Basic Usage

```js
<RatingsFilter
	componentId="ratingsSensor"
	dataField="ratings"
	data={[
		{ start: 4, end: 5, label: '4 & up' },
		{ start: 3, end: 5, label: '3 & up' },
		{ start: 1, end: 5, label: 'All' },
	]}
/>
```

### Usage With All Props

```js
<RatingsFilter
	componentId="CarCategorySensor"
	dataField="ratings"
	title="Ratings Filter"
	data={[
		{ start: 4, end: 5, label: '4 & up' },
		{ start: 3, end: 5, label: '3 & up' },
		{ start: 1, end: 5, label: 'All' },
	]}
	defaultSelected={{
		start: 4,
		end: 5,
	}}
	URLParams={false}
/>
```

## Props

-   **componentId** `String`
    unique identifier of the component, can be referenced in other components' `react` prop.
-   **dataField** `String`
    data field to be mapped with the component's UI view.
-   **data** `Object Array`
    collection of UI `label` with associated with `start` and `end` ratings values.
-   **title** `String or JSX` [optional]
    title of the component to be shown in the UI.
-   **defaultSelected** `Object` [optional]
    pre-select a ratings value using `start` and `end` key values from one of the data elements.
-   **URLParams** `Boolean` [optional]
    enable creating a URL query string parameter based on the selected rating. This is useful for sharing URLs with the component state. Defaults to `false`.

## Demo

<br />

<iframe src="https://codesandbox.io/embed/github/appbaseio/reactivesearch/tree/dev/packages/web/examples/RatingsFilter" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Styles

`RatingsFilter` component supports `innerClass` prop with the following keys:

-   `title`

Read more about it [here](/docs/reactivesearch/v2/theming/ClassnameInjection/).

## Extending

`RatingsFilter` component can be extended to

1. customize the look and feel with `className`, `style`,
2. update the underlying DB query with `customQuery`,
3. connect with external interfaces using `beforeValueChange`, `onValueChange` and `onQueryChange`.

```js
<RatingsFilter
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
  onQueryChange={
    function(prevQuery, nextQuery) {
      // use the query with other js code
      console.log('prevQuery', prevQuery);
      console.log('nextQuery', nextQuery);
    }
  }
  onValueChange={
    function(value) {
      console.log("current value: ", value)
      // set the state
      // use the value with other js code
    }
  }
/>
```

-   **className** `String`
    CSS class to be injected on the component container.
-   **style** `Object`
    CSS styles to be applied to the **RatingsFilter** component.
-   **customQuery** `Function`
    takes **value** and **props** as parameters and **returns** the data query to be applied to the component, as defined in Elasticsearch Query DSL.
    `Note:` customQuery is called on value changes in the **RangeFilter** component as long as the component is a part of `react` dependency of at least one other component.
-   **beforeValueChange** `Function`
    is a callback function which accepts component's future **value** as a parameter and **returns** a promise. It is called everytime before a component's value changes. The promise, if and when resolved, triggers the execution of the component's query and if rejected, kills the query execution. This method can act as a gatekeeper for query execution, since it only executes the query after the provided promise has been resolved.
-   **onValueChange** `Function`
    is a callback function which accepts component's current **value** as a parameter. It is called everytime the component's value changes. This prop is handy in cases where you want to generate a side-effect on value selection. For example: You want to show a pop-up modal with the valid discount coupon code when a user searches for a product with a specific rating in a RatingsFilter.
-   **onQueryChange** `Function`
    is a callback function which accepts component's **prevQuery** and **nextQuery** as parameters. It is called everytime the component's query changes. This prop is handy in cases where you want to generate a side-effect whenever the component's query would change.

## Examples

See more stories for RatingsFilter on playground.

<a href="https://opensource.appbase.io/playground/?selectedKind=Range%20components%2FRatingsFilter" target="_blank">RatingsFilter with default props</a>
