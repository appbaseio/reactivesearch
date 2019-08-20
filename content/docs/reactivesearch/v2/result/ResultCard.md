---
title: 'ResultCard'
meta_title: 'ResultCard'
meta_description: '`ResultCard` creates a result card UI component to display results in a card layout, suited for data that have an associated image.'
keywords:
    - reactivesearch
    - resultcard
    - appbase
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'web-v2-reactivesearch'
---

![Image to be displayed](https://i.imgur.com/KnrGoRk.png)

`ResultCard` creates a result card UI component to display results in a card layout, suited for data that have an associated image.

Example uses:

-   showing e-commerce search results in a card layout.
-   showing filtered hotel booking results in a card layout.

> Note
>
> An alternative layout to ResultCard is a [**ResultList**](/docs/reactivesearch/v2/result/ResultList/), which displays result data in a list format.

## Usage

### Basic Usage

```js
<ResultCard
	react={{
		and: ['PriceFilter', 'SearchFilter'],
	}}
	onData={this.onData}
/>
```

### Pagination Usage With All Props

```js
<ResultCard
	componentId="ResultCard01"
	dataField="ratings"
	stream={true}
	sortBy="desc"
	size={8}
	pagination={true}
	paginationAt="bottom"
	pages={5}
	showResultStats={true}
	loader="Loading Results.."
	react={{
		and: ['PriceFilter', 'SearchFilter'],
	}}
	onData={this.onData}
/>
```

### Infinite Scroll Usage With All Props

```js
<ResultCard
	componentId="ResultCard01"
	dataField="ratings"
	stream={true}
	sortBy="desc"
	size={8}
	pagination={false}
	showResultStats={true}
	loader="Loading Results.."
	react={{
		and: ['PriceFilter', 'SearchFilter'],
	}}
	onData={this.onData}
/>
```

## Props

-   **componentId** `String`
    unique identifier of the component, can be referenced in other components' `react` prop.
-   **dataField** `String`
    data field to be mapped with `ResultCard`'s UI view, used for providing a sorting context.
-   **excludeFields** `String Array` [optional]
    fields to be excluded in search results.
-   **includeFields** `String Array` [optional]
    fields to be included in search results.
-   **stream** `Boolean` [optional]
    whether to stream new result updates in the UI. Defaults to `false`.
-   **scrollTarget** `String` [optional]
    accepts `id` of the container you wish to apply infinite loading on. **Note:** The container should be scrollable.
-   **pagination** `Boolean` [optional]
    pagination <> infinite scroll switcher. Defaults to `false`, i.e. an infinite scroll based view. When set to `true`, a pagination based list view with page numbers will appear.
-   **paginationAt** `String` [optional]
    Determines the position where to show the pagination, only applicable when **pagination** prop is set to `true`. Accepts one of `top`, `bottom` or `both` as valid values. Defaults to `bottom`.
-   **pages** `Number` [optional]
    number of pages to show at a time, defaults to 5.
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
    an alternative to the `sortBy` prop, `sortOptions` creates a sorting view in the ResultCard component's UI. Each array element is an object that takes three keys:
    -   `label` - label to be displayed in the UI.
    -   `dataField` - data field to use for applying the sorting criteria on.
    -   `sortBy` - specified as either `asc` or `desc`.
-   **size** `Number` [optional]
    number of results to show per view. Defaults to 20.
-   **loader** `String or JSX` [optional]
    display to show the user while the data is loading, accepts `String` or `JSX` markup.
-   **showResultStats** `Boolean` [optional]
    whether to show result stats in the form of results found and time taken. Defaults to `true`.
-   **onResultStats** `Function` [optional]
    renders custom result stats using a function that takes two parameters for `total_results` and `time_taken` and expects it to return a string or JSX.
-   **URLParams** `Boolean` [optional]
    when set adds the current page number to the url. Only works when `pagination` is enabled.
-   **onData** `Function` [optional]
    returns a card element object to be rendered based on the `res` data object. This callback function prop is called for each data item rendered in the **ResultCard** component's view.
    ```js
    onData = {
    	function(res) {
    		return {
    			image: res.image,
    			title: res.name,
    			description: (
    				<div>
    					<div className="price">${res.price}</div>
    					<p>
    						{res.room_type} · {res.accommodates} guests
    					</p>
    				</div>
    			),
    			url: res.listing_url,
    			containerProps: {
    				onMouseEnter: () => console.log('😁'),
    				onMouseLeave: () => console.log('🙀'),
    			},
    		};
    	},
    };
    ```
    The return format for the callback function is an object with `image`, `title`, `description` and `url` fields.
-   **defaultQuery** `Function` [optional]
    applies a default query to the result component. This query will be run when no other components are being watched (via React prop), as well as in conjunction with the query generated from the React prop. The function should return a query.
-   **onNoResults** `String or JSX` [optional]
    show custom message or component when no results founds.
-   **onError** `Function` [optional]
    gets triggered in case of an error and provides the `error` object, which can be used for debugging or giving feedback to the user if needed.

## Demo

<br />

<iframe src="https://codesandbox.io/embed/github/appbaseio/reactivesearch/tree/dev/packages/web/examples/ResultCard" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Styles

`ResultCard` component supports `innerClass` prop with the following keys:

-   `resultsInfo`
-   `sortOptions`
-   `resultStats`
-   `noResults`
-   `button`
-   `pagination`
-   `list`
-   `listItem`
-   `image`
-   `title`
-   `poweredBy`

Read more about it [here](/docs/reactivesearch/v2/theming/ClassnameInjection/).

## Extending

`ResultCard` component can be extended to

1. customize the look and feel with `className`, `style`,
2. render individual result data items using `onData`,
3. specify how results should be filtered using `react`.
4. render the entire result data using `onAllData`.
5. connect with external interfaces using `onQueryChange`.

```js
<ResultCard
  ...
  className="custom-class"
  // specify any number of custom styles.
  style={{"paddingBottom": "10px"}}
  // register a callback function with the `onData` prop.
  onData={
    function(res) {
      return {
        image: res.image,
        title: res.name,
        url: res.listing_url
      }
    }
  }
  onQueryChange={
    function(prevQuery, nextQuery) {
      // use the query with other js code
      console.log('prevQuery', prevQuery);
      console.log('nextQuery', nextQuery);
    }
  }
  // specify how and which results are filtered using `react` prop.
  react={
    "and": ["pricingFilter", "dateFilter"],
    "or": ["searchFilter"]
  }
/>
```

-   **className** `String`
    CSS class to be injected on the component container.
-   **style** `Object`
    CSS Styles to be applied to the **ResultCard** component.
-   **onData** `Function` [optional]
    a callback function where user can define how to render the view based on the data changes. In `ResultCard`'s case, the expected return format is an object with `image`, `title`, `url` and `description` keys.
-   **target** `string` [optional]
    This prop is equivalent to the `target` attribute of html `a` tags. It is only valid when `url` key is present in `onData()`'s returned object structure. It defaults to `_blank`.
-   **react** `Object`
    specify dependent components to reactively update **ResultCard's** data view.
    -   **key** `String`
        one of `and`, `or`, `not` defines the combining clause.
        -   **and** clause implies that the results will be filtered by matches from **all** of the associated component states.
        -   **or** clause implies that the results will be filtered by matches from **at least one** of the associated component states.
        -   **not** clause implies that the results will be filtered by an **inverse** match of the associated component states.
    -   **value** `String or Array or Object`
        -   `String` is used for specifying a single component by its `componentId`.
        -   `Array` is used for specifying multiple components by their `componentId`.
        -   `Object` is used for nesting other key clauses.

```js
onAllData(items, loadMoreData) {
	// return the list to render
}
```

> Note
>
> The **callback** function (`loadMoreData` here) will only be executed in case of infinite loading.

-   **onQueryChange** `Function`
    is a callback function which accepts component's **prevQuery** and **nextQuery** as parameters. It is called everytime the component's query changes. This prop is handy in cases where you want to generate a side-effect whenever the component's query would change.

## Examples

See more stories for ResultCard on playground.

<a href="https://opensource.appbase.io/playground/?selectedKind=Result%20components%2FResultCard" target="_blank">ResultCard with default props</a>
