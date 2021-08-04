---
title: 'Advanced Guides'
meta_title: 'Advanced Guides'
meta_description: 'Advanced Guides Reactivesearch.'
keywords:
    - reactivesearch
    - guides
    - appbase
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'vue-reactivesearch'
---

## beforeValueChange

Most components in ReactiveSearch provides a `beforeValueChange` prop. It is a callback function which accepts component's future **value** as a parameter and **returns** a promise. It is called everytime before a component's value changes. The promise, if and when resolved, triggers the execution of the component's query and if rejected, kills the query execution. This method can act as a gatekeeper for query execution, since it only executes the query after the provided promise has been resolved.

> Note:
>
> If you're using Reactivesearch version >= `1.1.0`, `beforeValueChange` can also be defined as a synchronous function. `value` is updated by default, unless you throw an `Error` to reject the update. For example with data-search:

```js
beforeValueChange = value => {
	// The update is accepted by default
	if (value && value.toLowerCase().contains('Social')) {
        // To reject the update, throw an error
        throw Error('Search value should not contain social.');
	}
};
```

> Note
>
> Most of the time your needs can be solved using `value-change` event. If you absolutely need `beforeValueChange` you should ensure that you don't pass a function which takes a very long time to resolve the promise. The component goes in a **locked** state when using `beforeValueChange` and before the promise is resolved. This means all the state updates are suspended for the component.

## Handling stream updates

The result components also allow streaming updates if you're using [appbase.io](https://appbase.io/) to host your Elasticsearch cluster. You can enable this with the `stream` prop.

If you're using streaming you can use `render` which receives three parameters `render(data, streamData, loadMoreData)`. The initial results from the query are received in the first paramter `data`. The `streamData` parameter receives an array of objects when they’re created, deleted, or updated. If an object is updated, it contains a `_updated` key set to `true`. Similarly, if an object is deleted, it contains a `_deleted` key set to `true`. If an object is created, it contains neither of the two. This provides you with all the necessary information to handle streaming in your app suited to your needs. For example, we can utilize this to continuosly handle streaming updates and merge new data with the existing:

```js
render({ data, streamData }) {
    // generate an array of ids of streamData
    const streamResultsIds = streamData.map(data => data._id);

    return (
      data
        // consider streamData as the source of truth
        // first take existing data which is not present in stream data
        .filter(({ _id }) => !streamResultsIds.includes(_id))
        // then add data from stream data
        .concat(streamData)
        // remove data which is deleted in stream data
        .filter(data => !data._deleted)
    );
}
```
