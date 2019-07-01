---
id: multidatalist
title: 'MultiDataList'
layout: docs
sectionid: docs
permalink: list-components/multidatalist.html
prev: list-components/singledatalist.html
prevTitle: 'SingleDataList'
next: range-components/singlerange.html
nextTitle: 'Range Components: SingleRange'
redirect_from:
    - 'basic-components/multidatalist.html'
    - 'list-components/multidatalist'
    - 'multidatalist'
---

![Image to be displayed](https://i.imgur.com/9snfajo.png)

`MultiDataList` creates a multiple checkbox list UI component that is connected to a database field. It is used for filtering results based on the current selection(s) from a list of data items.

> Note
>
> This component behaves similar to the [MultiList](/list-components/multilist.html) component except the list items are user defined with the `data` prop, ideal for showing curated items in a list layout.

Example uses:

-   select one or multiple items from a list of categories for filtering e-commerce search results.
-   filtering restaurants by one or more cuisine choices.

## Usage

### Basic Usage

```js
<MultiDataList
	componentId="MeetupTops"
	dataField="group.group_topics.topic_name_raw.raw"
	data={[
		{
			label: 'Social',
			value: 'Social',
		},
		{
			label: 'Travel',
			value: 'Travel',
		},
		{
			label: 'Outdoors',
			value: 'Outdoors',
		},
	]}
	title="Meetups"
/>
```

### Usage With All Props

```js
<MultiDataList
	componentId="MeetupTops"
	dataField="group.group_topics.topic_name_raw.raw"
	data={[
		{
			label: 'Social',
			value: 'Social',
		},
		{
			label: 'Travel',
			value: 'Travel',
		},
		{
			label: 'Outdoors',
			value: 'Outdoors',
		},
	]}
	title="Meetups"
	showSearch={true}
	showCheckbox={true}
	placeholder="Filter meetups"
	defaultSelected={['Social']}
	selectAllLabel="All meetups"
	showFilter={true}
	filterLabel="Price"
	URLParams={false}
/>
```

## Props

-   **componentId** `String`
     unique identifier of the component, can be referenced in other components' `react` prop.
-   **dataField** `String`
     data field to be connected to the component's UI view.
-   **data** `Object Array`
     collection of UI `labels` with associated `value` to be matched against the database field.
-   **title** `String or JSX` [optional]
     title of the component to be shown in the UI.
-   **showSearch** `Boolean` [optional]
     whether to display a searchbox to filter the data list. Defaults to `false`.
-   **showCheckbox** `Boolean` [optional]
     whether to display a checkbox button beside the list item. Defaults to `true`.
-   **placeholder** `String` [optional]
     placeholder to be displayed in the searchbox. Defaults to "Search".
-   **defaultSelected** `String Array` [optional]
     default selected value(s) pre-selects option(s) from the list.
-   **selectAllLabel** `String` [optional]
     if provided displays an additional option to selct all list values.
-   **showFilter** `Boolean` [optional]
     show as filter when a value is selected in a global selected filters view. Defaults to `true`.
-   **filterLabel** `String` [optional]
     An optional label to display for the component in the global selected filters view. This is only applicable if `showFilter` is enabled. Default value used here is `componentId`.
-   **URLParams** `Boolean` [optional]
     enable creating a URL query string parameter based on the selected value of the list. This is useful for sharing URLs with the component state. Defaults to `false`.

## Demo

<br />

<iframe src="https://codesandbox.io/embed/github/appbaseio/reactivesearch/tree/dev/packages/web/examples/MultiDataList" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Styles

`MultiDataList` component supports `innerClass` prop with the following keys:

-   `title`
-   `input`
-   `list`
-   `checkbox`
-   `label`

Read more about it [here](/theming/class.html).

## Extending

`MultiDataList` component can be extended to

1. customize the look and feel with `className`, `style`,
2. update the underlying DB query with `customQuery`,
3. connect with external interfaces using `beforeValueChange`, `onValueChange` and `onQueryChange`.

```js
<MultiDataList
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
    CSS styles to be applied to the **MultiDataList** component.
-   **customQuery** `Function`
    takes **value** and **props** as parameters and **returns** the data query to be applied to the component, as defined in Elasticsearch Query DSL.
    `Note:` customQuery is called on value changes in the **MultiDataList** component as long as the component is a part of `react` dependency of at least one other component.
-   **beforeValueChange** `Function`
     is a callback function which accepts component's future **value** as a parameter and **returns** a promise. It is called everytime before a component's value changes. The promise, if and when resolved, triggers the execution of the component's query and if rejected, kills the query execution. This method can act as a gatekeeper for query execution, since it only executes the query after the provided promise has been resolved.
-   **onValueChange** `Function`
     is a callback function which accepts component's current **value** as a parameter. It is called everytime the component's value changes. This prop is handy in cases where you want to generate a side-effect on value selection. For example: You want to show a pop-up modal with the valid discount coupon code when list item(s) is/are selected in a "Discounted Price" MultiDataList.
-   **onQueryChange** `Function`
     is a callback function which accepts component's **prevQuery** and **nextQuery** as parameters. It is called everytime the component's query changes. This prop is handy in cases where you want to generate a side-effect whenever the component's query would change.

## Examples

<a href="https://opensource.appbase.io/playground/?selectedKind=List%20components%2FMultiDataList" target="_blank">MultiDataList with default props</a>
