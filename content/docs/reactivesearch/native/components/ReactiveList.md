---
title: 'ReactiveList'
meta_title: 'ReactiveList'
meta_description: '`ReactiveList` creates a data-driven result list UI component.'
keywords:
    - reactivesearch-native
    - reactivelist
    - appbase
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'native-reactivesearch'
---

![Image to be displayed](https://imgur.com/i9GNHTD.png)

`ReactiveList` creates a data-driven result list UI component. This list can reactively update itself based on changes in other components or changes in the database itself.

Example uses:

-   showing a feed of results based on the applied search criteria.
-   streaming realtime feed updates based on applied criteria like in a newsfeed.

## Usage

### Basic Usage

```js
<ReactiveList
	react={{
		and: ['CitySensor', 'SearchSensor'],
	}}
	onData={res => <Text>{res.title}</Text>}
/>
```

### Usage With All Props

```js
<ReactiveList
	componentId="SearchResult"
	dataField="ratings"
	stream={true}
	pagination={false}
	paginationAt="bottom"
	pages={5}
	sortBy="desc"
	size={10}
	showResultStats={true}
	onData={res => <Text>{res.title}</Text>}
	onResultStats={(total, took) => {
		return 'found ' + total + ' results in ' + took + 'ms.';
	}}
	react={{
		and: ['CitySensor', 'SearchSensor'],
	}}
/>
```

## Props

-   **componentId** `String`
    unique identifier of the component, can be referenced in other components' `react` prop.
-   **dataField** `String`
    data field to be connected to the component's UI view. It is useful for providing a sorting context.
-   **stream** `Boolean` [optional]
    whether to stream new result updates in the UI. Defaults to `false`. `stream: true` is appended to the streaming hit objects, which can be used to selectively react to streaming changes (eg. showing fade in animation on new streaming hits, Twitter/Facebook like streams, showing the count of new feed items available like _2 New Tweets_)
-   **pagination** `Boolean` [optional]
    pagination <> infinite scroll switcher. Defaults to `false`, i.e. an infinite scroll based view. When set to `true`, a pagination based list view with page numbers will appear.
-   **paginationAt** `String` [optional]
    Determines the position where to show the pagination, only applicable when **pagination** prop is set to `true`. Accepts one of `top`, `bottom` or `both` as valid values. Defaults to `bottom`.
-   **pages** `Number` [optional]
    number of user selectable pages to be displayed when pagination is enabled. Defaults to 5.
-   **sortBy** `String` [optional]
    sort the results by either `asc` or `desc` order. It is an alternative to `sortOptions`, both can't be used together.
-   **size** `Number` [optional]
    number of results to show per view. Defaults to 10.
-   **showResultStats** `Boolean` [optional]
    whether to show result stats in the form of results found and time taken. Defaults to `true`.
-   **onResultStats** `Function` [optional]
    show custom result stats using a function that takes two parameters for `time_taken` and `total_results` and returns a string.
-   **react** `Object` [optional]
    a dependency object defining how this component should react based on the state changes in the sensor components.
-   **onData** `Function` [optional]
    returns a list element object to be rendered based on the `res` data object. This callback function prop is called for each data item rendered in the **ReactiveList** component's view. For example,
    ```js
    onData = {
    	function(res) {
    		return (
    			<View>
    				<Text>{res.tilte}</Text>
    				<Text>{res.description}</Text>
    			</View>
    		);
    	},
    };
    ```
-   **onAllData** `Function` [optional]
    works like **onData** prop but all the data objects are passed to the callback function.
-   **innerProps** `Object` [optional]
    specifies additional props for the internal components. Accepts an object with the specified keys. Read more about the usage [here](/advanced/innerprops.html)

<br />

|   **Key** |                                            **Explanation**                                            |
| --------: | :---------------------------------------------------------------------------------------------------: |
|    `icon` |   [Icon](http://docs.nativebase.io/Components.html#icon-def-headref) component from **native-base**   |
|  `button` | [Button](http://docs.nativebase.io/Components.html#button-def-headref) component from **native-base** |
| `spinner` |      [Spinner](http://docs.nativebase.io/Components.html#Spinner) component from **native-base**      |
|    `text` |     [Text](http://facebook.github.io/react-native/docs/text.html) component from **react-native**     |

## Demo

[Try the demo](https://expo.io/@dhruvdutt/reactivelist-demo) instantly.

## Styles

`ReactiveList` component supports `style` prop. Read more about it [here](/advanced/style.html).

It also supports an `innerStyle` prop with the following keys:

-   `label`
-   `button`
-   `icon`

Read more about it [here](/advanced/style.html#innerstyle)

## Extending

`ReactiveList` component can be extended to

1. customize the look and feel with `style`,
2. render individual result data items using `onData`,
3. render the entire result data using `onAllData`.

```js
<ReactiveList
  ...
  style={{ paddingBottom: 10 }}
  onData={(res) => <Text>{res.data}</Text>}
/>
```

-   **style** `Object`
    CSS styles to be applied to the **ReactiveList** component.
-   **onData** `Function` [optional]
    a callback function where user can define how to render the view based on the data changes.
-   **onAllData** `Function` [optional]
    an alternative callback function to `onData`, where user can define how to render the view based on all the data changes. It accepts three parameters, `results`, `streamResults` and a **callback** function which should be called when the results reach the end (on scroll).

```js
onAllData(results, streamReasults, loadMoreData) {
	// return the list to render
}
```
