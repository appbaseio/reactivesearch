---
title: 'Customizing Style'
meta_title: 'Cuatomizing Style'
meta_description: 'ReactiveSearch components can also be styled using inline-styles.'
keywords:
    - reactivesearch
    - style
    - appbase
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'web-reactivesearch'
---

ReactiveSearch components can also be styled using inline-styles. Each component supports a `style` prop which accepts an object. Find more info on the [react docs](https://reactjs.org/docs/dom-elements.html#style).

> Note
>
> Using the `style` attribute as the primary means of styling elements is generally [not recommended](https://reactjs.org/docs/dom-elements.html#style). ReactiveSearch components also support `className` prop allowing you to style them using CSS classes.

## Usage

You can pass the style object via the `style` prop like:

```json
{
	"backgroundColor": "coral",
	"color": "black"
}
```

Alternatively, you can also add a `className` to any component which gets applied to the component at the root level. You may also inject `className` to the inner levels using the `innerClass` prop. You can read more about it in the [next section](/docs/reactivesearch/v3/theming/classnameinjection/).

## Examples

### Using the style prop

```jsx{3-6}
<DataSearch
    ...
    style={{
        border: '1px dashed coral',
        backgroundColor: '#fefefe'
    }}
/>
```

### Using the className prop

```jsx{3}
<DataSearch
    ...
    className="search-box"
/>
```
