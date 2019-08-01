---
title: 'ReactiveList'
meta_title: 'ReactiveList'
meta_description: '`ReactiveList` creates a data-driven result list UI component.'
keywords:
    - reactivesearch
    - reactivelist
    - appbase
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'vue-reactivesearch'
---

![Image to be displayed](https://i.imgur.com/iY2csRm.png)

`ReactiveList` creates a data-driven result list UI component. This list can reactively update itself based on changes in other components or changes in the database itself.

Example uses:

-   showing a feed of results based on the applied search criteria.
-   streaming realtime feed updates based on applied criteria like in a newsfeed.

## Usage

### Basic Usage

```html
<template>
    <reactive-list
        :react=`{
            "and": ["CitySensor", "SearchSensor"]
        }`
    >
         <div slot="renderData" slot-scope="{ item }">
            {{ item.title }}
         </div>
    </reactive-list>
</template>
```

### Usage With All Props

```html
<reactive-list componentId="SearchResult" dataField="ratings" paginationAt="bottom" loader="Loading
Results.." sortBy="desc" :stream="true" :pagination="false" :pages="5" :size="10"
:showResultStats="true" :react=`{ and: ["CitySensor", "SearchSensor"] }` />
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
     an alternative to the `sortBy` prop, `sortOptions` creates a sorting view in the ReactiveList component's UI. Each array element is an object that takes three keys:
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
     returns a list element object to be rendered based on the `res` data object. This callback function prop or slot is called for each data item rendered in the **ReactiveList** component's view. For example,

    ```html
    <div slot="renderData" slot-scope="{ item }">
    	<a class="full_row single-record single_record_for_clone" key="item._id">
    		<div class="text-container full_row" :style="{ paddingLeft: '10px' }">
    			<div class="text-head text-overflow full_row">
    				<span class="text-head-info text-overflow">
    					{{ item.name ? item.name : "" }} - {{ item.brand ? item.brand : "" }}
    				</span>
    				<span class="text-head-city">{{ item.brand ? item.brand : "" }}</span>
    			</div>
    			<div class="text-description text-overflow full_row">
    				<ul class="highlight_tags">
    					{{ item.price ? `Priced at $${{ item.price }}` : "Free Test Drive" }}
    				</ul>
    			</div>
    		</div>
    	</a>
    </div>
    ```

-   **renderAllData** `Function|slot-scope` [optional]
     works like **renderData** but all the data objects are passed to the callback function or slot.
    It accepts an object with these properties: `results`, `streamResults`, `loadMore`, `base` & `triggerClickAnalytics`.

    -   **`results`**: An array of results obtained from the applied query.
    -   **`streamResults`**: An array of results streamed since the applied query, aka realtime data. Here, a meta property `_updated` or `_deleted` is also present within a result object to denote if an existing object has been updated or deleted.
    -   **`loadMore`**: A callback function to be called to load the next page of results into the view. The callback function is only applicable in the case of infinite loading view (i.e. `pagination` prop set to `false`).
    -   **`base`**: An internally calculated value, useful to calculate analytics. [Read More](/advanced/analytics.html)
    -   **`triggerClickAnalytics`**: A function which can be called to register a click analytics. [Read More](/advanced/analytics.html)

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
-   **renderError** `String|Function|slot-scope` [optional]
    can be used to render an error message in case of any error.

```js
    :renderError="error => (
            <div>
                Something went wrong!<br/>Error details<br/>{error}
            </div>
        )
    "
```

or

```html
<template slot="renderError" slot-scope="error">
	<div>Something went wrong!<br />Error details<br />{{ error }}</div>
</template>
```

-   **renderNoResults** `String|Function|slot-scope` [optional]
    show custom message or component when no results found.
-   **defaultQuery** `Function` [optional]
     applies a default query to the result component. This query will be run when no other components are being watched (via React prop), as well as in conjunction with the query generated from the React prop. The function should return a query.

## Demo

<br />

<iframe src="https://codesandbox.io/embed/github/appbaseio/reactivesearch/tree/next/packages/vue/examples/reactive-list" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

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

1. customize the look and feel with `className`,
2. render individual result data items using `renderData`,
3. render the entire result data using `renderAllData`.
4. connect with external interfaces using `queryChange`.

```js
<ReactiveList
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
-   **renderAllData** `Function|slot-scope` [optional]
     an alternative callback function or slot-scope to `renderData`, where user can define how to render the view based on all the data changes.
     <br/>
    It accepts an object with these properties: `results`, `streamResults`, `loadMore`, `base` & `triggerClickAnalytics`.
    -   **`results`**: An array of results obtained from the applied query.
    -   **`streamResults`**: An array of results streamed since the applied query, aka realtime data. Here, a meta property `_updated` or `_deleted` is also present within a result object to denote if an existing object has been updated or deleted.
    -   **`loadMore`**: A callback function to be called to load the next page of results into the view. The callback function is only applicable in the case of infinite loading view (i.e. `pagination` prop set to `false`).
    -   **`base`**: An internally calculated value, useful to calculate analytics. [Read More](/advanced/analytics.html)
    -   **`triggerClickAnalytics`**: A function which can be called to register a click analytics. [Read More](/advanced/analytics.html)

> Note
>
> The `streamResults` parameter will be `[]` unless `stream` prop is set to `true`. Check the [handling streaming](/advanced/guides.html#handling-stream-updates) guide for more info.

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

*   **error**
    gets triggered in case of an error and provides the `error` object, which can be used for debugging or giving feedback to the user if needed.

> Note:
>
> The fundamental difference between `pageChange` and `pageClick` is that `pageClick` is only called on a manual interaction with the pagination buttons, whereas, `pageChange` would also be invoked if some other side effects caused the results to update which includes updating filters, queries or changing pages. The behaviour of these two may change in the future versions as we come up with a better API.

-   **error**
    invoked when query listener throws any error

## Examples

<a href="https://reactivesearch-vue-playground.netlify.com/?selectedKind=Result%20Components%2FReactive%20List&selectedStory=Basic&full=0&addons=1&stories=1&panelRight=0" target="_blank">ReactiveList with default props</a>
