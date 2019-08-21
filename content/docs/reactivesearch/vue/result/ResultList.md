---
title: 'ResultList'
meta_title: 'ResultList'
meta_description: '`ResultList` creates a result list UI component to display results in a list layout, suited for data that needs a compact display.'
keywords:
    - reactivesearch
    - resultlist
    - appbase
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'vue-reactivesearch'
---

![Imgur](https://i.imgur.com/oevEwGb.png)

`ResultList` creates a result list UI component to display results in a list layout, suited for data that needs a compact display.

Example uses:

-   showing e-commerce search listings.
-   showing filtered hotel booking results.

> Note
>
> An alternative layout to ResultList is a [**ResultCard**](/docs/reactivesearch/vue/result/ResultCard/), which displays result data in a card layout.

## Usage

### Basic Usage

```html
<template>
	<result-list
		componentId="SearchResult"
		dataField="original_title.raw"
		:from="0"
		:size="5"
		:renderData="booksList"
	/>
</template>
<script>
	methods: {
	    booksList(data) {
	        return {
	            title: data.original_title,
	            image: data.image,
	            description: `
	                <div>
	                    <p>
	                        <em>by ${data.authors}</em>
	                    </p>
	                    <p>
	                        <b>${data.average_rating}</b> ⭐
	                    </p>
	                    <span>Pub ${data.original_publication_year}</span>
	                </div>
	            `,
	        };
	    }
	}
</script>
```

### Usage With All Props

```html
<result-list componentId="SearchResult" dataField="original_title.raw" paginationAt="bottom"
:renderData="booksList" loader="Loading Books.." sortBy="desc" :stream="true" :pagination="false"
:pages="5" :size="10" :showResultStats="true" :react=`{ and: ["BookRatings", "SearchSensor"] }` />
```

## Props

-   **componentId** `String`
    unique identifier of the component, can be referenced in other components' `react` prop.
-   **dataField** `String`
    data field to be connected to the component's UI view. It is useful for providing a **sorting** context i.e. results would be sorted based on the `dataField`.
-   **excludeFields** `String Array` [optional]
    fields to be excluded in search results.
-   **includeFields** `String Array` [optional]
    fields to be included in search results.
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
-   **sortOptions** `Object Array` [optional]
    an alternative to the `sortBy` prop, `sortOptions` creates a sorting view in the resultlist component's UI. Each array element is an object that takes three keys:
    -   `label` - label to be displayed in the UI.
    -   `dataField` - data field to use for applying the sorting criteria on.
    -   `sortBy` - specified as either `asc` or `desc`.
-   **size** `Number` [optional]
    number of results to show per view. Defaults to 10.
-   **loader** `String|slot-scope` [optional]
    display to show the user while the data is loading, accepts `String` or `JSX` markup.
-   **showResultStats** `Boolean` [optional]
    whether to show result stats in the form of results found and time taken. Defaults to `true`.
-   **react** `Object` [optional]
    a dependency object defining how this component should react based on the state changes in the sensor components.
-   **URLParams** `Boolean` [optional]
    when set adds the current page number to the url. Only works when `pagination` is enabled.
-   **renderData** `Function|slot-scope` [optional]
    returns a list element object to be rendered based on the `res` data object. This callback function prop is called for each data item rendered in the ResultList component’s view.

    ```js
    <result-list
        :renderData="function(data){
            return {
                title: data.original_title,
                image: data.image,
                description: `
                    <div>
                        <p>
                            <em>by ${data.authors}</em>
                        </p>
                        <p>
                            <b>${data.average_rating}</b> ⭐
                        </p>
                        <span>Pub ${data.original_publication_year}</span>
                    </div>
                `,
                containerProps:{
                    on: {
                        mouseenter: () => console.log('😄'),
                        mouseleave: () => console.log('🚀')
                    }
                }
            };
        }"
    />
    ```

-   **renderResultStats** `Function|slot-scope` [optional]
    renders custom result stats using a callback function that takes `stats` object as parameter and expects it to return a string or html. `stats` object contains following properties
    -   `totalResults` - Total number of results found
    -   `totalPages` - Total number of pages found based on current page size
    -   `currentPage` - Current page number for which data is being rendered
    -   `displayedResults` - Number of results displayed in current view
    -   `time` - Time taken to find total results
    ```js
    :renderResultStats="
            function(stats){
                return (
                    `Showing ${stats.displayedResults} of total ${stats.totalResults} in ${stats.time} ms`
                )
            }
        "
    ```
-   **defaultQuery** `Function` [optional]
    applies a default query to the result component. This query will be run when no other components are being watched (via React prop), as well as in conjunction with the query generated from the React prop. The function should return a query.
-   **onNoResults** `String` [optional]
    show custom message or component when no results founds.

## Demo

<br />

<iframe src="https://codesandbox.io/embed/github/appbaseio/reactivesearch/tree/next/packages/vue/examples/result-list" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Styles

`resultlist` component supports `innerClass` prop with the following keys:

-   `resultsInfo`
-   `sortOptions`
-   `resultStats`
-   `noResults`
-   `button`
-   `pagination`
-   `active`
-   `list`
-   `poweredBy`

Read more about it [here](/docs/reactivesearch/vue/theming/ClassnameInjection/).

## Extending

`resultlist` component can be extended to

1. customize the look and feel with `className`,
2. render individual result data items using `renderData`,
3. connect with external interfaces using `queryChange`.

```js
<resultlist
  ...
  className="custom-class"
  :renderData=`
    function({ item }) {
      return(
        <div>
          { item.data }
        </div>
      )
    }
  `
  @queryChange=`
    function(prevQuery, nextQuery) {
      // use the query with other js code
      console.log('prevQuery', prevQuery);
      console.log('nextQuery', nextQuery);
    }
  `
/>
```

-   **className** `String`
    CSS class to be injected on the component container.
-   **renderData** `Function|slot-scope` [optional]
    a callback function or slot-scope where user can define how to render the view based on the data changes.

> Note
>
> The `streamResults` parameter will be `[]` unless `stream` prop is set to `true`. Check the [handling streaming](/docs/reactivesearch/vue/advanced/Guides#handling-stream-updates) guide for more info.

## Events

-   **queryChange**
    is an event which accepts component's **prevQuery** and **nextQuery** as parameters. It is called everytime the component's query changes. This event is handy in cases where you want to generate a side-effect whenever the component's query would change.
-   **pageChange**
    called when the current page is changed. If not defined, `window` will be scrolled to the top of the page.

-   **pageClick**
    accepts a function which is invoked with the updated page value when a pagination button is clicked. For example if 'Next' is clicked with the current page number as '1', you would receive the value '2' as the function parameter.

-   **data** `Function` [optional]
    gets triggered after data changes, which returns an object with these properties: `results`, `streamResults`, `loadMore`, `base` & `triggerClickAnalytics`.

-   **resultStats** `Function` [optional]
    gets triggered after stats changes, which returns an object with these properties:
    -   `totalResults` - Total number of results found
    -   `totalPages` - Total number of pages found based on current page size
    -   `currentPage` - Current page number for which data is being rendered
    -   `displayedResults` - Number of results displayed in current view
    -   `time` - Time taken to find total results

> Note:
>
> The fundamental difference between `pageChange` and `pageClick` is that `pageClick` is only called on a manual interaction with the pagination buttons, whereas, `pageChange` would also be invoked if some other side effects caused the results to update which includes updating filters, queries or changing pages. The behaviour of these two may change in the future versions as we come up with a better API.

-   **error**
    invoked when query listener throws any error
