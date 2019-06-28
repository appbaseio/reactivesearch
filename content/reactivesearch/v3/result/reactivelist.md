---
title: 'ReactiveList'
meta_title: 'ReactiveList'
meta_description: '`ReactiveList` creates a data-driven result list UI component. This list can reactively update itself based on changes in other components or changes in the database itself.'
keywords:
    - reactivesearch
    - reactivelist
    - appbase
    - elasticsearch
sidebar: 'web-reactivesearch'
---

![Image to be displayed](https://i.imgur.com/iY2csRm.png)

`ReactiveList` creates a data-driven result list UI component. This list can reactively update itself based on changes in other components or changes in the database itself.

Example uses:

-   showing a feed of results based on the applied search criteria.
-   streaming realtime feed updates based on applied criteria like in a newsfeed.

## Usage

### Basic Usage

```js
<ReactiveList
	componentId="SearchResult"
	react={{
		and: ['CitySensor', 'SearchSensor'],
	}}
	renderItem={res => <div>{res.title}</div>}
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
	renderItem={res => <div>{res.title}</div>}
	renderResultStats={function(stats) {
		return `Showing ${stats.displayedResults} of total ${stats.numberOfResults} in ${
			stats.time
		} ms`;
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
-   **scrollOnChange** `Boolean` [optional]
    Enables you to customise the window scrolling experience on query change. Defaults to `true` i.e. The window will scroll to top in case of the query change, which can be triggered by change in pagination, change in filters or search value, etc. When set to `false`, scroll position will stay intact.
-   **pagination** `Boolean` [optional]
    Defaults to `false`, When set to `true`, a pagination based list view with page numbers will appear.
-   **infiniteScroll** `Boolean` [optional]
    Defaults to `true`, When set to `true`, an infinite scroll based view will appear.
-   **paginationAt** `String` [optional]
    Determines the position where to show the pagination, only applicable when **pagination** prop is set to `true`. Accepts one of `top`, `bottom` or `both` as valid values. Defaults to `bottom`.
-   **pages** `Number` [optional]
    number of user selectable pages to be displayed when pagination is enabled. Defaults to 5.
-   **sortBy** `String` [optional]
    sort the results by either `asc` or `desc` order. It is an alternative to `sortOptions`, both can't be used together.
-   **sortOptions** `Object Array` [optional]
    an alternative to the `sortBy` prop, `sortOptions` creates a sorting view in the ReactiveList component's UI. Each array element is an object that takes three keys:
    -   `label` - label to be displayed in the UI.
    -   `dataField` - data field to use for applying the sorting criteria on.
    -   `sortBy` - specified as either `asc` or `desc`.
-   **defaultSortOption** `String` [optional]
    accepts the label of the desired sort option to set default sort value from given `sortOptions` array.
-   **size** `Number` [optional]
    number of results to show per view. Defaults to 10.
-   **loader** `String or JSX` [optional]
    display to show the user while the data is loading, accepts `String` or `JSX` markup.
-   **showLoader** `Boolean` [optional]
    defaults to `true`, if set to `false` then the ReactiveList will not display the default loader.
-   **showResultStats** `Boolean` [optional]
    whether to show result stats in the form of results found and time taken. Defaults to `true`.
-   **react** `Object` [optional]
    a dependency object defining how this component should react based on the state changes in the sensor components.
-   **URLParams** `Boolean` [optional]
    when set adds the current page number to the url. Only works when `pagination` is enabled.
-   **defaultQuery** `Function` [optional]
    applies a default query to the result component. This query will be run when no other components are being watched (via React prop), as well as in conjunction with the query generated from the React prop. The function should return a query.
    Read more about it [here](/advanced/customquery.html#when-to-use-default-query).
-   **renderItem** `Function` [optional]
    returns a list element object to be rendered based on the `res` data object. This callback function prop is called for each data item rendered in the **ReactiveList** component's view. For example,
    ```js
    renderItem = {
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
-   **render** `Function` [optional]
    A function returning the UI you want to render based on your results. This function receives a list of parameters and expects to return a `JSX`.
    Read more about it [here](#extending).
    > Note:
    >
    > Either `renderItem` or `render` is required in ReactiveList for rendering the data.
-   **renderError** `String or JSX or Function` [optional]
    can be used to render an error message in case of any error.
    ```js
    renderError={(error) => (
            <div>
                Something went wrong!<br/>Error details<br/>{error}
            </div>
        )
    }
    ```
-   **renderResultStats** `Function` [optional]
    renders custom result stats using a callback function that takes `stats` object as parameter and expects it to return a string or JSX. `stats` object contains following properties
    -   **`numberOfResults`**: `number`
        Total number of results found
    -   **`numberOfPages`**: `number`
        Total number of pages found based on current page size
    -   **`currentPage`**: `number`
        Current page number for which data is being rendered
    -   **`time`**: `number`
        Time taken to find total results (in ms)
    -   **`displayedResults`**: `number`
        Number of results displayed in current view
    ```js
    renderResultStats = {
    	function(stats) {
    		return `Showing ${stats.displayedResults} of total ${stats.numberOfResults} in ${
    			stats.time
    		} ms`;
    	},
    };
    ```
-   **renderNoResults** `Function` [optional]
    show custom message or component when no results found.
-   **onData** `Function` [optional]
    gets triggered after data changes, which returns an object with these properties: `data`,
    `streamData`, `promotedData`, `rawData` & `resultStats`.
-   **onError** `Function` [optional]
    gets triggered in case of an error and provides the `error` object, which can be used for debugging or giving feedback to the user if needed.
-   **onPageChange** `Function` [optional]
    executes when the current page is changed. If not defined, `window` will be scrolled to the top of the page.
-   **onPageClick** `Function` [optional]
    accepts a function which is invoked with the updated page value when a pagination button is clicked. For example if 'Next' is clicked with the current page number as '1', you would receive the value '2' as the function parameter.

> Note:
>
> The fundamental difference between `onPageChange` and `onPageClick` is that `onPageClick` is only called on a manual interaction with the pagination buttons, whereas, `onPageChange` would also be invoked if some other side effects caused the results to update which includes updating filters, queries or changing pages. The behaviour of these two may change in the future versions as we come up with a better API.

## Sub Components

-   **ResultCardsWrapper**
    A wrapper component for `ResultCard` components to render a card based layout.
    Read more about the usage [here](/result-components/resultcard.html#usage).
-   **ResultListWrapper**
    A wrapper component for `ResultList` components to render a list based layout.
    Read more about the usage [here](/result-components/resultlist.html#usage).

## Demo

<br />

<iframe src="https://codesandbox.io/embed/github/appbaseio/reactivesearch/tree/next/packages/web/examples/ReactiveList" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

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
2. render individual result data items using `renderItem`,
3. render the entire data using `render`.
4. connect with external interfaces using `onQueryChange`.

```js
<ReactiveList
  ...
  className="custom-class"
  style={{"paddingBottom": "10px"}}
  renderItem={
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
-   **renderItem** `Function` [optional]
    a callback function where user can define how to render the view based on the data changes.
-   **render** `Function` [optional]
    an alternative callback function to `renderItem`, where user can define how to render the view based on all the data changes.
    <br/>
    It accepts an object with these properties:
    -   **`loading`**: `boolean`
        indicates that the query is still in progress
    -   **`error`**: `object`
        An object containing the error info
    -   **`data`**: `array`
        An array of results obtained from the applied query.
    -   **`streamData`**: `array`
        An array of results streamed since the applied query, aka realtime data. Here, a meta property `_updated` or `_deleted` is also present within a result object to denote if an existing object has been updated or deleted.
    -   **`promotedData`**: `array`
        An array of promoted results obtained from the applied query. [Read More](https://docs.appbase.io/concepts/query-rules.html#part-1-introduction)
        > Note:
        >
        > `data`, `streamData` and `promotedData` results has a property called `_click_id` which can be used with triggerAnalytics to register the click analytics info.
    -   **`rawData`**: `array`
        An array of original hits obtained from the applied query.
    -   **`resultStats`**: `object`
        An object with the following properties which can be helpful to render custom stats:
        -   **`numberOfResults`**: `number`
            Total number of results found
        -   **`numberOfPages`**: `number`
            Total number of pages found based on current page size
        -   **`currentPage`**: `number`
            Current page number for which data is being rendered
        -   **`time`**: `number`
            Time taken to find total results (in ms)
        -   **`displayedResults`**: `number`
            Number of results displayed in current view
    -   **`handleLoadMore`**: `function`
        A callback function to be called to load the next page of results into the view. The callback function is only applicable in the case of infinite loading view (i.e. `infiniteScroll` prop set to `true`).
    -   **`triggerAnalytics`**: `function`
        A function which can be called to register a click analytics. [Read More](/advanced/analytics.html)

```js
<ReactiveList
	showLoader={false} // Hides the default loader
	render={({ loading, error, data }) => {
		if (loading) {
			return <div>Fetching Results.</div>;
		}
		if (error) {
			return <div>Something went wrong! Error details {JSON.stringify(error)}</div>;
		}
		return (
			<ul>
				{data.map(item => (
					<li>
						{item.title}
						{/* Render UI */}
					</li>
				))}
			</ul>
		);
	}}
/>
```

Or you can also use render function as children

```js
<ReactiveList>
    {
        ({
            loading,
            error,
            data,
            streamData,
            promotedData,
            rawData,
            resultStats,
            handleLoadMore,
            triggerAnalytics
        }) => (
            // return UI to be rendered
        )
    }
</ReactiveList>
```

> Note
>
> The `streamResults` parameter will be `[]` unless `stream` prop is set to `true`. Check the [handling streaming](/advanced/guides.html#handling-stream-updates) guide for more info.

-   **onQueryChange** `Function`
    is a callback function which accepts component's **prevQuery** and **nextQuery** as parameters. It is called everytime the component's query changes. This prop is handy in cases where you want to generate a side-effect whenever the component's query would change.

## Examples

<a href="https://opensource.appbase.io/playground/?selectedKind=Result%20components%2FReactiveList" target="_blank">ReactiveList with default props</a>
