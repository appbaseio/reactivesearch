---
title: 'API Reference'
meta_title: 'API Reference for Vue SearchBox'
meta_description: 'vue-searchbox is a lightweight library that provides scaffolding to create search experiences powered by Elasticsearch.'
keywords:
    - quickstart
    - vue-searchbox
    - search library
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'vue-searchbox-reactivesearch'
---

[vue-searchbox](https://github.com/appbaseio/searchbox/tree/master/packages/vue-searchbox) - Vue SearchBox is a standalone, lightweight(~27KB: Minified + Gzipped) search library that provides scaffolding to create search experiences powered by Elasticsearch.

## How does it work

[vue-searchbox](https://github.com/appbaseio/searchbox/tree/master/packages/vue-searchbox) provides declarative props to query Elasticsearch and bind the search state with the UI components. The `vue-searchbox` library provides a built-in UI component called SearchBox. As the name suggests, SearchBox component is useful for creating a search box UI. It also provides a general purpose [SearchComponent](/docs/reactivesearch/vue-searchbox/searchcomponent/) to bind to UI components for displaying different kinds of facets and results.


Example use-cases are:

-   To perform a search across e-commerce products by its `name` or `description` fields
-   To create a category filter component
-   To create a price range search filter
-   To build a location filter
-   To render the search results etc.

This library is divided into three components:

[SearchBase](/docs/reactivesearch/vue-searchbox/searchbase/) is a provider component that provides the [SearchBase](/docs/reactivesearch/searchbase/overview/QuickStart/) context to the child components. It binds the backend app (data source) with the UI view components (elements wrapped within SearchBase), allowing a UI component to be reactively updated every time there is a change in the data source or in other UI components.

[SearchBox](/docs/reactivesearch/vue-searchbox/searchbox/) offers a ready to use, lightweight, and performance-focused searchbox UI component to query and display results from your Elasticsearch cluster.

[SearchComponent](/docs/reactivesearch/vue-searchbox/searchcomponent/) can be used to build different kinds of search experiences. For examples,

-   a search bar component,
-   a category filter component,
-   a price range component,
-   a location filter component,
-   a component to render the search results etc.
