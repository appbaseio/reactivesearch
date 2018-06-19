<h2 align="center">
  <img src="https://i.imgur.com/iiR9wAs.png" alt="reactivesearch" title="reactivesearch" width="200" />
  <br />
  ReactiveSearch
  <br />
</h2>

<p align="center">Elasticsearch UI components for React. <a href="https://opensource.appbase.io/reactivesearch/">Website 🌐</a></p>
<p align="center" style="font-size: 1.2rem"><a href="https://scotch.io/tutorials/build-an-airbnb-clone-with-react-and-elasticsearch">Read how to build an Airbnb clone with ReactiveSearch</a>.</p>

<hr />

[![npm version](https://badge.fury.io/js/%40appbaseio%2Freactivesearch.svg)](https://badge.fury.io/js/%40appbaseio%2Freactivesearch)
[![](https://img.shields.io/badge/license-Apache%202-blue.svg)](https://github.com/appbaseio/mirage/blob/dev/LICENSE.md)
[![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/appbaseio/reactivesearch)
[![npm](https://img.shields.io/npm/dt/@appbaseio/reactivesearch.svg)](https://www.npmjs.com/package/@appbaseio/reactivesearch)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/appbaseio/reactivesearch/blob/dev/.github/CONTRIBUTING.md)

React UI components for Elasticsearch.

![Banner Image showing all the UI components we offer](https://i.imgur.com/bJ1QKZS.png)

[Get our designer templates for sketch](https://opensource.appbase.io/reactivesearch/resources/ReactiveSearch_Playground.sketch).


## Installation

```
yarn add @appbaseio/reactivesearch
```

## Concepts

The library is conceptually divided into two parts:

**1. Sensor components**

Each sensor component is purpose built for applying a specific filter on the data. For example: Rendering a Radio UI elements list based on the available dataset - [SingleList](https://opensource.appbase.io/reactive-manual/list-components/singlelist.html)

**2. Actuator components**

Actuators represent the result UI view components. ReactiveSearch primarily comes with two actuators: `ResultCard` and `ResultList`.

ResultCard displays the results in a card interface whereas ResultList displays them in a list. Both provide built-in support for pagination and infinite scroll views. Besides these, the library also provides low level actuators (ReactiveComponent and ReactiveList) to render in a more customized fashion.

## Live Demos

A set of live demos inspired by real world apps, built with ReactiveSearch.

- [demos/airbeds](https://opensource.appbase.io/reactivesearch/demos/airbeds/) - An airbnb-like booking search experience.
- [demos/technews](https://opensource.appbase.io/reactivesearch/demos/technews/) - A full-text search app on the Hacker News dataset.
- [demos/gitxplore](https://opensource.appbase.io/reactivesearch/demos/gitxplore/) - Explore all the popular Github repositories.
- [demos/productsearch](https://opensource.appbase.io/reactivesearch/demos/producthunt/) - Filtered feed of products based on a small Product Hunt dataset.
- [demos/booksearch](https://opensource.appbase.io/reactivesearch/demos/goodbooks/) - An book search app based on a goodbooks dataset.
- [demos/ecommerce](https://opensource.appbase.io/reactivesearch/demos/ecommerce/) - An e-commerce car store app.

## Documentation

The official docs for the library are at [https://opensource.appbase.io/reactive-manual](https://opensource.appbase.io/reactive-manual).

The components are divided into four sections:
* Generic UI components are at [reactive-manual/base-components](https://opensource.appbase.io/reactive-manual/base-components/textfield.html).
* List based UI components are at [reactive-manual/list-components](https://opensource.appbase.io/reactive-manual/list-components/singlelist.html).
* Range based UI components are at [reactive-manual/range-components](https://opensource.appbase.io/reactive-manual/range-components/singlerange.html).
* Search UI components are at [reactive-manual/search-components](https://opensource.appbase.io/reactive-manual/search-components/datasearch.html).
* Result components are at [reactive-manual/result-components](https://opensource.appbase.io/reactive-manual/result-components/resultlist.html).

## Changelog

Check out the [changelog](./CHANGELOG.md) for more info.

## Related tooling and projects

- [**ReactiveSearch Dashboard**](https://dashboard.appbase.io/reactivesearch/) All your Reactive Search related apps (created via interactive tutorial, shared by others, etc.) can be accessed from here.
- [**ReactiveMaps**](https://github.com/appbaseio/reactivemaps) is a similar project to Reactive Search that allows building realtime maps easily.

- [**appbase-js**](https://github.com/appbaseio/appbase-js) While building search UIs is dandy with Reactive Search, you might also need to add some input forms. **appbase-js** comes in handy there.

- [**dejavu**](https://github.com/appbaseio/dejavu) allows viewing raw data within an appbase.io (or Elasticsearch) app. **Soon to be released feature:** An ability to import custom data from CSV and JSON files, along with a guided walkthrough on applying data mappings.

- [**mirage**](https://github.com/appbaseio/mirage) ReactiveSearch components can be extended using custom Elasticsearch queries. For those new to Elasticsearch, Mirage provides an intuitive GUI for composing queries.

<a href="https://appbase.io/support/"><img src="https://i.imgur.com/UL6B0uE.png" width="100%" /></a>
