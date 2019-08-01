---
title: 'MultiDropdownList'
meta_title: 'MultiDropdownList'
meta_description: 'MultiDropdownList creates a dropdown list based multi select UI component.'
keywords:
    - reactivesearch-native
    - multidropdownlist
    - appbase
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'native-reactivesearch'
---

![](https://i.imgur.com/exOZLk4.png)
![](https://i.imgur.com/QZ3ZBko.png)

`MultiDropdownList` creates a dropdown list based multi select UI component. It is used for filtering results based on the current selection(s) from a list of items.

Example uses:

-   create an e-commerce facet like search experience.
-   create a filter for airlines to fly by in a flight booking experience.

## Usage

### Basic Usage

```js
<MultiDropdownList componentId="SearchSensor" dataField="brand.raw" />
```

### Usage With All Props

```js
<MultiDropdownList
	componentId="SearchSensor"
	dataField="brand.raw"
	placeholder="Pick a car"
	defaultSelected={['volvo']}
	selectAllLabel="All cars"
	sortBy="count"
	showCount
	queryFormat="or"
	size={100}
	showFilter={true}
	filterLabel="Car"
	react={{
		and: ['CategoryFilter', 'SearchFilter'],
	}}
/>
```

## Props

-   **componentId** `String`
    unique identifier of the component, can be referenced in other components' `react` prop.
-   **dataField** `String`
    data field to be connected to the component's UI view. This field is used for doing an aggregation and returns the result. We're using a `.raw` multifield here. You can use a field of type `keyword` or `not_analyzed` depending on your Elasticsearch cluster.
-   **defaultSelected** `String Array` [optional]
    default selected value pre-selects an option from the list.
-   **placeholder** `String` [optional]
    placeholder to be displayed in the dropdown searchbox. Defaults to "Select a value".
-   **size** `Number` [optional]
    control how many items to display in the List. Defaults to 100.
-   **sortBy** `String` [optional]
    property that decides on how to sort the list items, accepts one of `count`, `asc` or `desc` as valid values. `count` sorts the list based on the count occurences, with highest value at the top. `asc` sorts the list in the ascending order of the list item (Alphabetical). `desc` sorts the list in the descending order of the term. Defaulted to `count`.
-   **showCount** `Boolean` [optional]
    show count of number of occurences besides an item. Defaults to `true`.
-   **queryFormat** `String` [optional]
    queries the selected items from the list in one of two modes: `or`, `and`.
    -   Defaults to `or` which queries for results where any of the selected list items are present.
    -   In `and` mode, the applied query filters results where all of the selected items are present.
-   **selectAllLabel** `String` [optional]
    if provided, shows an extra option to select all the options in the list with the provided string value.
-   **showFilter** `Boolean` [optional]
    show as filter when a value is selected in a global selected filters view. Defaults to `true`.
-   **filterLabel** `String` [optional]
    An optional label to display for the component in the global selected filters view. This is only applicable if `showFilter` is enabled. Default value used here is `componentId`.
-   **innerProps** `Object` [optional]
    specifies additional props for the internal components. Accepts an object with the specified keys. Read more about the usage [here](/advanced/innerprops.html)

<br />

|    **Key** |                                             **Explanation**                                              |
| ---------: | :------------------------------------------------------------------------------------------------------: |
|     `item` |    The wrapping [Item](http://docs.nativebase.io/Components.html#Form) component from **native-base**    |
|     `icon` |    [Icon](http://docs.nativebase.io/Components.html#icon-def-headref) component from **native-base**     |
| `flatList` |  [FlatList](https://facebook.github.io/react-native/docs/flatlist.html) component from **react-native**  |
|   `button` |  [Button](http://docs.nativebase.io/Components.html#button-def-headref) component from **native-base**   |
|   `header` |  [Header](http://docs.nativebase.io/Components.html#header-def-headref) component from **native-base**   |
|    `title` |            [Title](http://docs.nativebase.io/Components.html) component from **native-base**             |
|     `text` |      [Text](http://facebook.github.io/react-native/docs/text.html) component from **react-native**       |
|    `modal` | [Modal](https://facebook.github.io/react-native/docs/modal.html#docsNav) component from **react-native** |

## Demo

<br />

<div data-snack-id="@dhruvdutt/multidropdownlist-example" data-snack-platform="ios" data-snack-preview="true" data-snack-theme="light" style="overflow:hidden;background:#fafafa;border:1px solid rgba(0,0,0,.16);border-radius:4px;height:505px;width:100%"></div>

<a href="https://snack.expo.io/@dhruvdutt/multidropdownlist-example" target="_blank">View on Snack</a>

## Styles

`MultiDropdownList` component supports `style` prop. Read more about it [here](/advanced/style.html).

It also supports an `innerStyle` prop with the following keys:

-   `label`
-   `left`
-   `button`
-   `icon`
-   `right`
-   `body`
-   `title`

Read more about it [here](/advanced/style.html#innerstyle)

## Extending

`MultiDropdownList` component can be extended to

1. customize the look and feel with `style`,
2. update the underlying DB query with `customQuery`,
3. connect with external interfaces using `beforeValueChange`, `onValueChange` and `onQueryChange`,
4. specify how search suggestions should be filtered using `react` prop

```js
<MultiDropdownList
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
  // specify how and which suggestions are filtered using `react` prop.
  react={
    "and": ["pricingFilter", "dateFilter"],
    "or": ["searchFilter"]
  }
/>
```

-   **style** `Object`
    CSS styles to be applied to the **MultiDropdownList** component.
-   **customQuery** `Function`
    takes **value** and **props** as parameters and **returns** the data query to be applied to the component, as defined in Elasticsearch Query DSL.
    `Note:` customQuery is called on value changes in the **MultiDropdownList** component as long as the component is a part of `react` dependency of at least one other component.
-   **beforeValueChange** `Function`
    is a callback function which accepts component's future **value** as a parameter and **returns** a promise. It is called everytime before a component's value changes. The promise, if and when resolved, triggers the execution of the component's query and if rejected, kills the query execution. This method can act as a gatekeeper for query execution, since it only executes the query after the provided promise has been resolved.
-   **onValueChange** `Function`
    is a callback function which accepts component's current **value** as a parameter. It is called everytime the component's value changes. This prop is handy in cases where you want to generate a side-effect on value selection. For example: You want to show a pop-up modal with the valid discount coupon code when a user searches for something in the MultiDropdownList.
-   **onQueryChange** `Function`
    is a callback function which accepts component's **prevQuery** and **nextQuery** as parameters. It is called everytime the component's query changes. This prop is handy in cases where you want to generate a side-effect whenever the component's query would change.
-   **react** `Object`
    specify dependent components to reactively update **MultiDropdownList's** suggestions.
    -   **key** `String`
        one of `and`, `or`, `not` defines the combining clause.
        -   **and** clause implies that the results will be filtered by matches from **all** of the associated component states.
        -   **or** clause implies that the results will be filtered by matches from **at least one** of the associated component states.
        -   **not** clause implies that the results will be filtered by an **inverse** match of the associated component states.
    -   **value** `String or Array or Object`
        -   `String` is used for specifying a single component by its `componentId`.
        -   `Array` is used for specifying multiple components by their `componentId`.
        -   `Object` is used for nesting other key clauses.
