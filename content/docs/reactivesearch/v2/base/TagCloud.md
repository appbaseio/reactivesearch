---
title: 'TagCloud'
meta_title: 'TagCloud'
meta_description: '`TagCloud` creates a tag cloud UI component, also known as word cloud or weighted list in visual design.'
keywords:
    - reactivesearch
    - tagcloud
    - appbase
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'web-v2-reactivesearch'
---

![Image to be displayed](https://i.imgur.com/owkwZKL.png)

`TagCloud` creates a tag cloud UI component, also known as word cloud or weighted list in visual design. It is a visual representation of text data, typically used to depict tags on websites, or to visualize free form text.

Example uses:

-   news websites and blogs displaying related tags to a current post.
-   show an e-commerce listings filter of user generated tags.

## Usage

### Basic Usage

```js
<TagCloud componentId="TagCloud01" dataField="cities" />
```

### Usage With All Props

```js
<TagCloud
	componentId="CitiesSensor"
	dataField="cities"
	title="City Cloud"
	size={32}
	showCount={true}
	multiSelect={true}
	defaultSelected={['Auckland', 'Atlanta']}
	queryFormat="or"
	react={{
		and: ['CategoryFilter', 'SearchFilter'],
	}}
	showFilter={true}
	filterLabel="Cities"
	URLParams={false}
	loader="Loading ..."
/>
```

## Props

-   **componentId** `String`
    unique identifier of the component, can be referenced in other components' `react` prop.
-   **dataField** `String`
    data field(s) to be mapped with the component's UI view.
-   **title** `String or JSX` [optional]
    title of the component to be shown in the UI.
-   **loader** `String or JSX` [optional]
    to display an optional loader while fetching the options.
-   **size** `Number` [optional]
    number of items to be displayed in the list. Defaults to 100.
-   **showCount** `Boolean` [optional]
    show a count of the number of occurrences besides each list item. Defaults to `true`.
-   **multiSelect** `Boolean` [optional]
    whether to support multiple tag selections. Defaults to `false`.
-   **defaultSelected** `String or Array` [optional]
    pre-select tag(s) from the tag cloud. An Array is accepted when _multiSelect_ mode is enabled.
-   **queryFormat** `String` [optional]
    sets whether to show results as a union with `"or"` (default) or an intersection with `"and"`. For example, if two tags are selected, say "Guitars" and "Electric Guitars" then with a `queryFormat` of "or" you would get results for both the tags. With a `queryFormat` of "and" you would get more specific results for guitars which satisfy both the tags.
-   **showFilter** `Boolean` [optional]
    show as filter when a value is selected in a global selected filters view. Defaults to `true`.
-   **filterLabel** `String` [optional]
    An optional label to display for the component in the global selected filters view. This is only applicable if `showFilter` is enabled. Default value used here is `componentId`.
-   **URLParams** `Boolean` [optional]
    enable creating a URL query string parameter based on the selected value of the tag(s). This is useful for sharing URLs with the component state. Defaults to `false`.

## Demo

<br />

<iframe src="https://codesandbox.io/embed/github/appbaseio/reactivesearch/tree/dev/packages/web/examples/TagCloud" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Styles

`TagCloud` component supports `innerClass` prop with the following keys:

-   `title`
-   `list`
-   `input`

Read more about it [here](/theming/class.html).

## Extending

`TagCloud` component can be extended to

1. customize the look and feel with `className`, `style`,
2. update the underlying DB query with `customQuery`,
3. connect with external interfaces using `beforeValueChange`, `onValueChange` and `onQueryChange`,
4. filter data using a combined query context via the `react` prop.

```js
<TagCloud
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
  react={{
    "and": ["PriceFilter"]
  }}
/>
```

-   **className** `String`
    CSS class to be injected on the component container.
-   **style** `Object`
    CSS styles to be applied to the **TagCloud** component.
-   **customQuery** `Function`
    takes **value** and **props** as parameters and **returns** the data query to be applied to the component, as defined in Elasticsearch Query DSL.
    `Note:` customQuery is called on value changes in the **TagCloud** component as long as the component is a part of `react` dependency of at least one other component.
-   **beforeValueChange** `Function`
    is a callback function which accepts component's future **value** as a parameter and **returns** a promise. It is called everytime before a component's value changes. The promise, if and when resolved, triggers the execution of the component's query and if rejected, kills the query execution. This method can act as a gatekeeper for query execution, since it only executes the query after the provided promise has been resolved.
-   **onValueChange** `Function`
    is a callback function which accepts component's current **value** as a parameter. It is called everytime the component's value changes. This prop is handy in cases where you want to generate a side-effect on value selection. For example: You want to show a pop-up modal with the valid discount coupon code when a user picks a category in a TagCloud.
-   **onQueryChange** `Function`
    is a callback function which accepts component's **prevQuery** and **nextQuery** as parameters. It is called everytime the component's query changes. This prop is handy in cases where you want to generate a side-effect whenever the component's query would change.
-   **react** `Object`
    specify dependent components to reactively update **TagCloud's** data view.
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

See more stories for TagCloud on playground.

<a href="https://opensource.appbase.io/playground/?selectedKind=Base%20components%2FTagCloud" target="_blank">TagCloud with default props</a>
