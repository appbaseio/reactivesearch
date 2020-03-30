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

You can take advantage of search and click analytics when using [Appbase.io](https://appbase.io) as a backend with ReactiveSearch. Search analytics work out of the box with `analytics` prop in `ReactiveBase`. This recipe explains how to implement click analytics for your app.

## Click Analytics

Click analytics have to be wired into the result components. Its supported in `ReactiveList`, however when using `ReactiveList`, the `renderItem` or `render` prop receives a method called `triggerAnalytics` to make click analytics work which you have to invoke with `onClick`.

```jsx
<ReactiveList
    ...
    renderItem={(data, triggerAnalytics) => (
        <div onClick={triggerAnalytics}>...</div>
    )}
/>
```

When rendering your component using `render` you have to call the `triggerAnalytics` function by using the `_click_id` property of the result items as an argument.
Example:

```jsx
<ReactiveList
    ...
    render={({
        data,
        triggerAnalytics
    }) =>
        results
            .map((item, index) => (
                <div
                    key={item._id}
                    onClick={() => triggerAnalytics(item._click_id)}
                >
                    ...
                </div>
            ))
    }
/>
```

## Click Analytics in Map Component

When rendering results using `renderAllData` in `ReactiveGoogleMap` you may have to call the `triggerAnalytics` function by using the `_click_id` property of the result items as an argument. Example:

```jsx
<ReactiveGoogleMap
    ...
    renderAllData={(hits, streamHits, loadMore, renderMap, renderPagination, triggerAnalytics) => {
        return(
            <>
				{hits.map(hit => (
					<div onClick={() => triggerAnalytics(hit._click_id)}>
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
    renderAllData={(hits, streamHits, loadMore, renderMap, renderPagination, triggerAnalytics) => {
        return(
            <>
				{hits.map(hit => (
					<div onClick={() => triggerAnalytics(hit._click_id)}>
						{JSON.stringify(hit)}
					</div>
				))}
                {renderMap()}
            </>
        )
    }
/>
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
