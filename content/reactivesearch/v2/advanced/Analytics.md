---
title: 'Analytics'
meta_title: 'Search and Analytics Data'
meta_description: 'Search analytics work out of the box with `analytics` prop in `ReactiveBase`.'
keywords:
    - reactivesearch
    - analytics
    - appbase
    - elasticsearch
sidebar: 'web-v2-reactivesearch'
---

You can take advantage of search and click analytics when using [Appbase.io](https://appbase.io) as a backend with ReactiveSearch. Search analytics work out of the box with `analytics` prop in `ReactiveBase`. This recipe explains how to implement click analytics for your app.

## Click Analytics

Click analytics have to be wired into the result components. Its supported in `ReactiveList`, `ResultCard` and `ResultList`. When using `ResultCard` or `ResultList` the click analytics will work on its own. However when using `ReactiveList`, the `onData` or `onAllData` prop receives an extra parameter to make click analytics work which you have to invoke with `onClick`.

```js
<ReactiveList
    ...
    onData={(data, triggerClickAnalytics) => (
        <div onClick={triggerClickAnalytics}>...</div>
    )}
>
```

With `onAllData(results, streamResults, loadMoreData, analytics)` the `analytics` parameter receives an object having the `base` value and `triggerClickAnalytics` function. When rendering your component using `onAllData` you have to read the `analytics` object and call the `triggerClickAnalytics` after adding the `base` value to the `index` (`base` is calculated internally from `currentPage * size`). `index` is assumed to start from `0`. Example:

```js
<ReactiveList
    ...
    onAllData={(
        results,
        streamResults,
        loadMore,
        { base, triggerClickAnalytics }
    ) =>
        results
            .map((item, index) => (
                <div
                    key={item._id}
                    onClick={() => triggerClickAnalytics(base + index)}
                >
                    ...
                </div>
            ))
    }
>
```
