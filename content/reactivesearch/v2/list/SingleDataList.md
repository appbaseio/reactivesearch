---
id: singledatalist
title: 'SingleDataList'
layout: docs
sectionid: docs
permalink: list-components/singledatalist.html
prev: list-components/multidropdownlist.html
prevTitle: 'MultiDropdownList'
next: list-components/multidatalist.html
nextTitle: 'MultiDataList'
redirect_from:
    - 'basic-components/singledatalist.html'
    - 'list-components/singledatalist'
    - 'singledatalist'
---

![Image to be displayed](https://i.imgur.com/pb7g1Su.png)

`SingleDataList` creates a radio select list UI component. It is used for filtering results based on the current selection from a list of data items.

> Note
>
> This component is like the [SingleList](/list-components/singlelist.html) component except the filters are set based on the `data` prop, ideal for showing custom UI filters in a list layout.

Example uses:

-   select a category from a list of categories for filtering e-commerce search results.
-   filtering restaurants by a cuisine choice.

## Usage

### Basic Usage

```js
<SingleDataList
	componentId="MeetupTops"
	dataField="group.group_topics.topic_name_raw.raw"
	title="Meetups"
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
/>
```

### Usage With All Props

```js
<SingleDataList
	componentId="MeetupTops"
	dataField="group.group_topics.topic_name_raw.raw"
	title="Meetups"
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
	showSearch={true}
	showRadio={true}
	placeholder="Filter meetups"
	defaultSelected="Social"
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
-   **showRadio** `Boolean` [optional]
     whether to display a radio button beside the list item. Defaults to `true`.
-   **placeholder** `String` [optional]
     placeholder to be displayed in the searchbox. Defaults to "Search".
-   **defaultSelected** `String` [optional]
     default selected value pre-selects an option from the list.
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

<iframe src="https://codesandbox.io/embed/github/appbaseio/reactivesearch/tree/dev/packages/web/examples/SingleDataList" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Styles

`SingleDataList` component supports `innerClass` prop with the following keys:

-   `title`
-   `input`
-   `list`
-   `radio`
-   `label`

Read more about it [here](/theming/class.html).

## Extending

`SingleDataList` component can be extended to

1. customize the look and feel with `className`, `style`,
2. update the underlying DB query with `customQuery`,
3. connect with external interfaces using `beforeValueChange`, `onValueChange` and `onQueryChange`.

```js
<SingleDataList
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
    CSS styles to be applied to the **SingleDataList** component.
-   **customQuery** `Function`
    takes **value** and **props** as parameters and **returns** the data query to be applied to the component, as defined in Elasticsearch Query DSL.
    `Note:` customQuery is called on value changes in the **SingleDataList** component as long as the component is a part of `react` dependency of at least one other component.
-   **beforeValueChange** `Function`
     is a callback function which accepts component's future **value** as a parameter and **returns** a promise. It is called everytime before a component's value changes. The promise, if and when resolved, triggers the execution of the component's query and if rejected, kills the query execution. This method can act as a gatekeeper for query execution, since it only executes the query after the provided promise has been resolved.
-   **onValueChange** `Function`
     is a callback function which accepts component's current **value** as a parameter. It is called everytime the component's value changes. This prop is handy in cases where you want to generate a side-effect on value selection. For example: You want to show a pop-up modal with the valid discount coupon code when a list item is selected in a "Discounted Price" SingleDataList.
-   **onQueryChange** `Function`
     is a callback function which accepts component's **prevQuery** and **nextQuery** as parameters. It is called everytime the component's query changes. This prop is handy in cases where you want to generate a side-effect whenever the component's query would change.

## Examples

<a href="https://opensource.appbase.io/playground/?selectedKind=List%20components%2FSingleDataList" target="_blank">SingleDataList with default props</a>
