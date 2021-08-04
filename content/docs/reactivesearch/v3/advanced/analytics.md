---
title: 'Analytics'
meta_title: 'Analytics'
meta_description: 'You can take advantage of search and click analytics when using Appbase.io as a backend with ReactiveSearch.'
keywords:
    - reactivesearch
    - analytics
    - appbase
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'web-reactivesearch'
---

You can take advantage of search and click analytics when using [Appbase.io](https://appbase.io) as a backend with ReactiveSearch. Search analytics work out of the box with `analytics` prop in `ReactiveBase`. This recipe explains how to implement click analytics and track impressions for your app.

## Click Analytics

Click analytics have to be wired into the result components. Its supported in `ReactiveList`, however when using `ReactiveList`, the `renderItem` or `render` prop receives a method called `triggerClickAnalytics` to make click analytics work which you have to invoke with `onClick`.

```jsx
<ReactiveList
    ...
    renderItem={(data, triggerClickAnalytics) => (
        <div onClick={triggerClickAnalytics}>...</div>
    )}
/>
```

When rendering your component using `render` you have to call the `triggerClickAnalytics` function by using the `_click_id` property of the result items as an argument. This method also supports the document id(optional) as the second param. If document id is not set then ReactiveSearch will calculate it based on the click position.
Example:

```jsx
<ReactiveList
    ...
    render={({
        data,
        triggerClickAnalytics
    }) =>
        results
            .map((item, index) => (
                <div
                    key={item._id}
                    onClick={() => triggerClickAnalytics(item._click_id)}
                >
                    ...
                </div>
            ))
    }
/>
```

## Click Analytics in Map Component

When rendering results using `renderAllData` in `ReactiveGoogleMap` you may have to call the `triggerClickAnalytics` function by using the `_click_id` property of the result items as an argument. This method also supports the document id(optional) as the second param. If document id is not set then ReactiveSearch will calculate it based on the click position. Example:

```jsx
<ReactiveGoogleMap
    ...
    renderAllData={(hits, loadMore, renderMap, renderPagination, triggerClickAnalytics) => {
        return(
            <>
				{hits.map(hit => (
					<div onClick={() => triggerClickAnalytics(hit._click_id)}>
						{JSON.stringify(hit)}
					</div>
				))}
                {renderMap()}
            </>
        )
    }
/>
```

Similarily, in `OpenStreetMap`:

```jsx
<ReactiveOpenStreetMap
    ...
    renderAllData={(hits, loadMore, renderMap, renderPagination, triggerClickAnalytics) => {
        return(
            <>
				{hits.map(hit => (
					<div onClick={() => triggerClickAnalytics(hit._click_id)}>
						{JSON.stringify(hit)}
					</div>
				))}
                {renderMap()}
            </>
        )
    }
/>
```

## Track Impressions for Search Results

Impressions tracking is tied to the result components. You may have to do some extra setup in the `ReactiveList` component to track the impressions. Please follow the following instructions for different kind of use-cases.

1. If you're using the `render` or `renderItem` method for the results UI then you have to define the `id` property for each result element. The value of `id` property must be the `_id` value from the elasticsearch hit object.

For an example, the following example uses the `renderItem` method
```jsx
<ReactiveList
	renderItem={(data) => {
		return (
            /* Set the id property on list element to track the impressions */
            <li id={hit._id} key={hit._id}>
                {hit.title}
                {/* Render UI */}
            </li>
        )
	}}
/>
```

Check this example with the `render` method

```jsx
<ReactiveList
	render={({ data }) => {
		return (
			<ul>
				{data.map(hit => (
                    /* Set the id property on list element to track the impressions */
					<li id={hit._id} key={hit._id}>
						{hit.title}
						{/* Render UI */}
					</li>
				))}
			</ul>
		);
	}}
/>
```
2. If you're using `render` method with `ResultCard` or `ResultList` components then you have to define the `id` prop for those components.

For an example,

```jsx
<ReactiveList
    componentId="SearchResult"
>
    {({ data }) => (
        <ResultCardsWrapper>
            {
                data.map(item => (
                    /* Set the id property on ResultCard to track the impressions */
                    <ResultCard id={item._id} key={item._id}>
                        <ResultCard.Title
                            dangerouslySetInnerHTML={{
                                __html: item.original_title
                            }}
                        />
                        <ResultCard.Description>
                            <div>
                                <div>by {item.authors}</div>
                                <div>
                                    ({item.average_rating} avg)
                                </div>
                            </div>
                            <span>
                                Pub {item.original_publication_year}
                            </span>
                        </ResultCard.Description>
                    </ResultCard>
                ))
            }
        </ResultCardsWrapper>
    )}
</ReactiveList>
```

## Configure the analytics experience
You can define the `appbaseConfig` prop in the `ReactiveBase` component to customize the analytics experience when appbase.io is used as a backend. It accepts an object which has the following properties:
- **recordAnalytics** `Boolean` allows recording search analytics (and click analytics) when set to `true` and appbase.io is used as a backend. Defaults to `false`.
- **searchStateHeader** `Boolean` If `true`, then appbase.io will record the search state with every search request made from `ReactiveSearch`. Defaults to `false`.
- **emptyQuery** `Boolean` If `false`, then appbase.io will not record the analytics for the empty queries i.e `match_all` queries. Defaults to `true`.
- **enableQueryRules** `Boolean` If `false`, then appbase.io will not apply the query rules on the search requests. Defaults to `true`.
- **suggestionAnalytics** `Boolean` If `false`, then appbase.io will not record the click analytics for the suggestions. Defaults to `true`.
- **userId** `String` It allows you to define the user id to be used to record the appbase.io analytics. Defaults to the client's IP address.
- **customEvents** `Object` It allows you to set the custom events which can be used to build your own analytics on top of appbase.io analytics. Further, these events can be used to filter the analytics stats from the appbase.io dashboard.
<br/>
For example in the following code, we're setting up two custom events that will be recorded with each search request.
```js
    <Reactivebase
        appbaseConfig={{
                customEvents: {
                    platform: "ios",
                    device: "iphoneX"
                }
        }}
    >
    </Reactivebase>
```
