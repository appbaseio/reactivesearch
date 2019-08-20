---
title: 'Theming'
meta_title: 'Theming'
meta_description: 'Themes can be used to change the default styles for all the ReactiveSearch components.'
keywords:
    - reactivesearch-native
    - theming
    - appbase
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'native-reactivesearch'
---

Themes can be used to change the default styles for all the ReactiveSearch components. Currently it supports changing the colors for components.

## Concepts

[ReactiveBase](/docs/reactivesearch/native/overview/reactivebase/) acts as the theme provider for all the child ReactiveSearch components. It supports a `theming` prop which accepts an object with the following defaults:

```js
{
    primaryColor: '#0b6aff',
    primaryTextColor: '#fff',
    textColor: '#424242'
}
```

## Examples

You can overwrite the aforementioned default styles by providing the respective key/values as `theming` prop, for example:

```js{4-6}
<ReactiveBase
    app="appname"
    credentials="abcdef123:abcdef12-ab12-ab12-ab12-abcdef123456"
    theming={{
        primaryColor: '#bada55'
    }}
>
    <Component1 .. />
    <Component2 .. />
</ReactiveBase>
```
