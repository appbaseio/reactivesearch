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
