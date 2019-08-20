---
title: 'innerProps'
meta_title: 'innerProps'
meta_description: 'ReactiveSearch components accept a prop innerProps which can be utilized for passing props to internal components as specified in the Props section of each component.'
keywords:
    - reactivesearch-native
    - innerProps
    - appbase
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'native-reactivesearch'
---

ReactiveSearch components accept a prop `innerProps` which can be utilized for passing props to internal components as specified in the **Props** section of each component.

## Usage

You can pass an object via the `innerprops` prop to pass additonal props like:

```js
innerProps={{
    icon: {
        ...
    },
    button: {
        ...
    }
}}
```

## Examples

This example uses the `innerProps` prop to pass some additional props to the internal [Icon](http://docs.nativebase.io/Components.html#icon-def-headref) component of [TextField](/docs/reactivesearch/native/components/TextField/).

```js{3-8}
<TextField
    ...
    innerprops={{
        icon: {
            color: 'tomato',
            fontSize: 13
        }
    }}
/>
```
