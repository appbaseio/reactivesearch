---
title: 'QuickStart'
meta_title: 'QuickStart to React Native SearchBox'
meta_description: 'react-native-searchbox is a lightweight library that provides scaffolding to create search experiences powered by Elasticsearch.'
keywords:
    - quickstart
    - react-native-searchbox
    - search library
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'react-native-searchbox-reactivesearch'
---

[react-native-searchbox](https://github.com/appbaseio/searchbox/tree/master/packages/native) provides declarative props to query Elasticsearch, and bind UI components with different types of search queries. As the name suggests, it provides a default UI component for searchbox.

## Installation

To install `react-native-searchbox`, you can use `npm` or `yarn` to get set as follows:

### Using npm

```js
npm install @appbaseio/react-native-searchbox
```

### Using yarn

```js
yarn add @appbaseio/react-native-searchbox
```

`react-native-searchbox` requires [react-native-vector-icons](https://github.com/oblador/react-native-vector-icons) as a peer dependency. [Expo](https://expo.io/) or [create-react-native-app](https://github.com/react-community/create-react-native-app) projects include react-native-vector-icons out of the box, so all you need to do is install `@appbaseio/react-native-searchbox`.

If your project is a standard React Native project created using react-native init (it should have an ios/android directory), then you have to install the [react-native-vector-icons](https://github.com/oblador/react-native-vector-icons) along with `react-native-searchbox`.


## Basic usage

### A simple example

The following example renders an autosuggestion search bar(`search-component`) with one custom component(`result-component`) to render the results. The `result-component` watches the `search-component` for input changes and updates its UI when the user selects a suggestion.

<div data-snack-id="@bietkul/6c74e7" data-snack-platform="ios" data-snack-preview="true" data-snack-theme="light" style="overflow:hidden;background:#F9F9F9;border:1px solid var(--color-border);border-radius:4px;height:505px;width:100%"></div>
<script async src="https://snack.expo.io/embed.js"></script>

### An example with a facet

<div data-snack-id="@bietkul/a52bd3" data-snack-platform="ios" data-snack-preview="true" data-snack-theme="light" style="overflow:hidden;background:#F9F9F9;border:1px solid var(--color-border);border-radius:4px;height:505px;width:100%"></div>
<script async src="https://snack.expo.io/embed.js"></script>


You can check out the docs for API Reference over [here](/docs/reactivesearch/react-native-searchbox/apireference/).
