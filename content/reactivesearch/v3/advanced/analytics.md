---
title: 'Analytics'
meta_title: 'Analytics'
meta_description: 'You can take advantage of search and click analytics when using Appbase.io as a backend with ReactiveSearch.'
keywords:
    - reactivesearch
    - analytics
    - appbase
    - elasticsearch
sidebar: 'web-reactivesearch'
---

You can take advantage of search and click analytics when using [Appbase.io](https://appbase.io) as a backend with ReactiveSearch. Search analytics work out of the box with `analytics` prop in `ReactiveBase`. This recipe explains how to implement click analytics for your app.

## Click Analytics

Click analytics have to be wired into the result components. Its supported in `ReactiveList`, however when using `ReactiveList`, the `renderItem` or `render` prop receives a method called `triggerAnalytics` to make click analytics work which you have to invoke with `onClick`.

```js
<ReactiveList
    ...
    renderItem={(data, triggerAnalytics) => (
        <div onClick={triggerAnalytics}>...</div>
    )}
>
```

When rendering your component using `render` you have to call the `triggerAnalytics` function by using the `_click_id` property of the result items as an argument.
Example:

```js
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
>
```
