---
title: 'API Reference'
meta_title: 'API Reference for SearchBase'
meta_description: 'Searchbase is a lightweight and platform agnostic library that provides scaffolding to create search experiences powered by Elasticsearch.'
keywords:
    - apireference
    - searchbase
    - elasticsearch
    - search library
sidebar: 'docs'
nestedSidebar: 'searchbase-reactivesearch'
---

[searchase](https://github.com/appbaseio/searchbox/tree/master/packages/searchbase) is a lightweight & platform agnostic library to build the search UIs with Elasticsearch.

> Note:
>
> This API reference is meant for the headless usage of the `searchbase` library.

## How does it work?

The working of `searchbase` can be better explained by the following chart.
<br/><br/>

<img alt="Dataset" src="/images/searchbase.png" />

The `searchbase` library is a headless implementation of the core architecture in Vanilla JS, which can be used with your own UI or alongside any framework. It provides all the necessary utilities to build a powerful search UI and can be easily integrated with any UI framework. SearchBase lib maintains the search `state` and provides some `actions` which can be used to manipulate the state from the UI. It also provides events which can be used to listen for the state changes & update the UI accordingly.

Although we don't ship any UI component with `searchbase` directly, we provide easy to integrate libraries for different platforms. You can check `@appbaseio/react-searchbox` and `@appbaseio/vue-searchbox` for React and Vue. A UI solution for `angular` is on our roadmap as well.

## How to use?

The `searchbase` library exports two classes named [SearchComponent](docs/reactivesearch/searchbase/overview/searchcomponent/) and [SearchBase](docs/reactivesearch/searchbase/overview/searchbase/).

The [SearchBase](docs/reactivesearch/searchbase/overview/searchbase/) class holds the state for all the active components and acts like a connector among those components to establish a communication.


The [SearchComponent](docs/reactivesearch/searchbase/overview/searchcomponent/) class represents a search component that can be used to build different kinds of search experiences. For examples,

-   a search bar component,
-   a category filter component,
-   a price range component,
-   a location filter component,
-   a component to render the search results etc.

The [SearchComponent](docs/reactivesearch/searchbase/overview/searchbase/) class is useful when you're using multiple components that depend on each other. For example, a filter component (to display the category options) depends on the search query (search component).

>    If you're only using a single component then [SearchComponent](docs/reactivesearch/searchbase/overview/searchcomponent/) class should work well.
