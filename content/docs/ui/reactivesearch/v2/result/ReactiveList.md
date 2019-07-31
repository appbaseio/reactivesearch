---
title: 'ReactiveList'
meta_title: 'ReactiveList'
meta_description: '`ReactiveList` creates a data-driven result list UI component.'
keywords:
    - reactivesearch
    - reactivelist
    - appbase
    - elasticsearch
sidebar: 'web-v2-reactivesearch'
---

![Image to be displayed](https://i.imgur.com/iY2csRm.png)

`ReactiveList` creates a data-driven result list UI component. This list can reactively update itself based on changes in other components or changes in the database itself.

This component forms the base for building more specific result display components like [`ResultCard`](/search-components/resultcard.html) or [`ResultList`](/search-components/resultlist.html).

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
	onData={res => <div>{res.title}</div>}
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
	loader="Loading Results.."
	showResultStats={true}
	onData={res => <div>{res.title}</div>}
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
-   **excludeFields** `String Array` [optional]
    fields to be excluded in search results.
-   **includeFields** `String Array` [optional]
    fields to be included in search results.
-   **stream** `Boolean` [optional]
    whether to stream new result updates in the UI. Defaults to `false`. `stream: true` is appended to the streaming hit objects, which can be used to selectively react to streaming changes (eg. showing fade in animation on new streaming hits, Twitter/Facebook like streams, showing the count of new feed items available like _2 New Tweets_)
-   **scrollTarget** `String` [optional]
    accepts `id` of the container you wish to apply infinite loading on. **Note:** The container should be scrollable.
-   **pagination** `Boolean` [optional]
    pagination <> infinite scroll switcher. Defaults to `false`, i.e. an infinite scroll based view. When set to `true`, a pagination based list view with page numbers will appear.
-   **paginationAt** `String` [optional]
    Determines the position where to show the pagination, only applicable when **pagination** prop is set to `true`. Accepts one of `top`, `bottom` or `both` as valid values. Defaults to `bottom`.
-   **pages** `Number` [optional]
    number of user selectable pages to be displayed when pagination is enabled. Defaults to 5.
-   **onPageChange** `Function` [optional]
    executes when the current page is changed. If not defined, `window` will be scrolled to the top of the page.
-   **onPageClick** `Function` [optional]
    accepts a function which is invoked with the updated page value when a pagination button is clicked. For example if 'Next' is clicked with the current page number as '1', you would receive the value '2' as the function parameter.

> Note:
>
> The fundamental difference between `onPageChange` and `onPageClick` is that `onPageClick` is only called on a manual interaction with the pagination buttons, whereas, `onPageChange` would also be invoked if some other side effects caused the results to update which includes updating filters, queries or changing pages. The behaviour of these two may change in the future versions as we come up with a better API.

-   **sortBy** `String` [optional]
    sort the results by either `asc` or `desc` order. It is an alternative to `sortOptions`, both can't be used together.
-   **sortOptions** `Object Array` [optional]
    an alternative to the `sortBy` prop, `sortOptions` creates a sorting view in the ReactiveList component's UI. Each array element is an object that takes three keys:
    -   `label` - label to be displayed in the UI.
    -   `dataField` - data field to use for applying the sorting criteria on.
    -   `sortBy` - specified as either `asc` or `desc`.
-   **size** `Number` [optional]
    number of results to show per view. Defaults to 10.
-   **loader** `String or JSX` [optional]
    display to show the user while the data is loading, accepts `String` or `JSX` markup.
-   **showResultStats** `Boolean` [optional]
    whether to show result stats in the form of results found and time taken. Defaults to `true`.
-   **onResultStats** `Function` [optional]
    renders custom result stats using a function that takes two parameters for `total_results` and `time_taken` and expects it to return a string or JSX.
-   **react** `Object` [optional]
    a dependency object defining how this component should react based on the state changes in the sensor components.
-   **URLParams** `Boolean` [optional]
    when set adds the current page number to the url. Only works when `pagination` is enabled.
-   **onData** `Function` [optional]
    returns a list element object to be rendered based on the `res` data object. This callback function prop is called for each data item rendered in the **ReactiveList** component's view. For example,
    ```js
    onData = {
    	function(res) {
    		return (
    			<a className="full_row single-record single_record_for_clone" key={res._id}>
    				<div className="text-container full_row" style={{ paddingLeft: '10px' }}>
    					<div className="text-head text-overflow full_row">
    						<span className="text-head-info text-overflow">
    							{res.name ? res.name : ''} - {res.brand ? res.brand : ''}
    						</span>
    						<span className="text-head-city">{res.brand ? res.brand : ''}</span>
    					</div>
    					<div className="text-description text-overflow full_row">
    						<ul className="highlight_tags">
    							{res.price ? `Priced at $${res.price}` : 'Free Test Drive'}
    						</ul>
    					</div>
    				</div>
    			</a>
    		);
    	},
    };
    ```
-   **onAllData** `Function` [optional]
    works like **onData** prop but all the data objects are passed to the callback function.
    > Note:
    >
    > Either `onData` or `onAllData` is required in ReactiveList for rendering the data.
-   **defaultQuery** `Function` [optional]
    applies a default query to the result component. This query will be run when no other components are being watched (via React prop), as well as in conjunction with the query generated from the React prop. The function should return a query.
-   **onNoResults** `String or JSX` [optional]
    show custom message or component when no results founds.
-   **onError** `Function` [optional]
    gets triggered in case of an error and provides the `error` object, which can be used for debugging or giving feedback to the user if needed.

## Demo

<br />

<iframe src="https://codesandbox.io/embed/github/appbaseio/reactivesearch/tree/dev/packages/web/examples/ReactiveList" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Styles

`ReactiveList` component supports `innerClass` prop with the following keys:

-   `resultsInfo`
-   `sortOptions`
-   `resultStats`
-   `noResults`
-   `button`
-   `pagination`
-   `active`
-   `list`
-   `poweredBy`

Read more about it [here](/theming/class.html).

## Extending

`ReactiveList` component can be extended to

1. customize the look and feel with `className`, `style`,
2. render individual result data items using `onData`,
3. render the entire result data using `onAllData`.
4. connect with external interfaces using `onQueryChange`.

```js
<ReactiveList
  ...
  className="custom-class"
  style={{"paddingBottom": "10px"}}
  onData={
    function(res) {
      return(
        <div>
          { res.data }
        </div>
      )
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
    CSS Styles to be applied to the **ReactiveList** component.
-   **onData** `Function` [optional]
    a callback function where user can define how to render the view based on the data changes.
-   **onAllData** `Function` [optional]
    an alternative callback function to `onData`, where user can define how to render the view based on all the data changes.
    <br/>
    It accepts three parameters: `results`, `streamResults` and `loadMoreData`.
    -   **`results`**: An array of results obtained from the applied query.
    -   **`streamResults`**: An array of results streamed since the applied query, aka realtime data. Here, a meta property `_updated` or `_deleted` is also present within a result object to denote if an existing object has been updated or deleted.
    -   **`loadMoreData`**: A callback function to be called to load the next page of results into the view. The callback function is only applicable in the case of infinite loading view (i.e. `pagination` prop set to `false`).

```js
onAllData(results, streamResults, loadMoreData) {
	// return the list to render
}
```

> Note
>
> The `streamResults` parameter will be `[]` unless `stream` prop is set to `true`. Check the [handling streaming](/advanced/guides.html#handling-stream-updates) guide for more info.

-   **onQueryChange** `Function`
    is a callback function which accepts component's **prevQuery** and **nextQuery** as parameters. It is called everytime the component's query changes. This prop is handy in cases where you want to generate a side-effect whenever the component's query would change.

## Examples

<a href="https://opensource.appbase.io/playground/?selectedKind=Result%20components%2FReactiveList" target="_blank">ReactiveList with default props</a>
