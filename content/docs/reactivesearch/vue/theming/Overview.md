---
title: 'Theming'
meta_title: 'Theming'
meta_description: 'Themes can be used to change the default styles for all the ReactiveSearch components.'
keywords:
    - reactivesearch
    - theming
    - appbase
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'vue-reactivesearch'
---

Themes can be used to change the default styles for all the ReactiveSearch components. These include basic styles like fonts, colors or component styles. The component styles are applied to most of the components.

## Usage

[ReactiveBase](/docs/reactivesearch/vue/overview/ReactiveBase/) acts as the theme provider for all the child ReactiveSearch components. It supports a `theme` prop which accepts an object with the following defaults:

```js
{
  typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Noto Sans", "Ubuntu", "Droid Sans", "Helvetica Neue", sans-serif',
      fontSize: '16px',
  },

  colors: {
    textColor: '#424242',
    primaryTextColor: '#fff',
    primaryColor: '#0B6AFF',
    titleColor: '#424242',
    alertColor: '#d9534f',
  }
};
```

## Examples

You can overwrite the aforementioned default styles by providing the respective key/values as `theme` prop. The supported keys are `typography`, `colors` and `component`. For example:

```jsx
<ReactiveBase
  app="good-books-ds"
  url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@arc-cluster-appbase-demo-6pjy6z.searchbase.io"
  :enable-appbase="true"
  :theme="{
      typography: {
          fontFamily: 'Raleway, Helvetica,      sans-serif',
          },
      colors: {
          primaryColor: '#008000',
          titleColor: 'white',
        },
      component: {
          padding: 10
        }
    }"
>
  <Component1 .. />
  <Component2 .. />
</ReactiveBase>
```
