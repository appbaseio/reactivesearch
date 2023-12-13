<h2 align="center">
  <img src="https://i.imgur.com/iiR9wAs.png" alt="reactivesearch" title="reactivesearch" width="200" />
  <br />
  Reactive Search
  <br />
</h2>

<p align="center" style="font-size: 1.2rem">UI components library for Elasticsearch, OpenSearch, Solr, MongoDB: Available for React and Vue</p>
<p align="center">
Read how to build an e-commerce search UI</p>
<p align="center">
a.) <a href="https://codeburst.io/how-to-build-a-yelp-like-search-app-using-react-and-elasticsearch-36a432bf6f92"> with React</a>, or b.) <a href="https://medium.appbase.io/building-booksearch-application-using-vue-and-elasticsearch-a39615f4d6b3">with Vue</a>
<br/>
<p align="center">
  <a href="https://github.com/appbaseio/reactivesearch/tree/next/packages/web" style="padding: 10px; display: inline;"><img  width="30%" src="https://docs.reactivesearch.io/images/react.jpeg" alt="web" title="web" /></a>
  <a href="https://github.com/appbaseio/reactivesearch/tree/next/packages/vue" style="padding: 10px; display: inline;"><img   width="30%" src="https://docs.reactivesearch.io/images/vue.png" alt="vue" title="vue" /></a>
</p>

Check out [Searchbox](https://opensource.appbase.io/searchbox/) if you're building search UIs for other JS frameworks, React Native or Flutter.

<hr />

[![](https://img.shields.io/badge/license-Apache%202-blue.svg)](https://github.com/appbaseio/reactivesearch/blob/dev/LICENSE)
[![ReactiveSearch Snapshot Tests](https://github.com/appbaseio/reactivesearch/actions/workflows/test.yml/badge.svg)](https://github.com/appbaseio/reactivesearch/actions/workflows/test.yml)
[![npm](https://img.shields.io/npm/dt/@appbaseio/reactivesearch.svg)](https://www.npmjs.com/package/@appbaseio/reactivesearch)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/appbaseio/reactivesearch/blob/dev/.github/CONTRIBUTING.md)
[![Mentioned in Awesome React](https://awesome.re/mentioned-badge.svg)](https://github.com/enaqx/awesome-react)
[![Mentioned in Awesome Elasticsearch](https://awesome.re/mentioned-badge.svg)](https://github.com/dzharii/awesome-elasticsearch)

<br />

<p>Check out the ReactiveSearch marketplace at <a href="https://reactiveapps.io/" target="_blank">reactiveapps.io</a>.</p>

<br />

![Banner Image showing all the web UI components we offer](https://i.imgur.com/bJ1QKZS.png)

[Web designer templates for sketch](https://opensource.appbase.io/reactivesearch/resources/ReactiveSearch_Playground.sketch).

![Banner Image showing all the mobile UI components we offer](https://i.imgur.com/13TvjbE.png)

[iOS and Android designer templates for sketch](https://opensource.appbase.io/reactivesearch/resources/ReactiveSearch_Playground.sketch).

<br />

## TOC

1. **[ReactiveSearch: Intro](#1-reactivesearch-intro)**
2. **[Features](#2-features)**
3. **[Component Playground](#3-component-playground)**
4. **[Live Examples](#4-live-demos)**
5. **[Comparison with Other Projects](#5-comparison-with-other-projects)**
6. **[Installation](#6-installation)**
7. **[Docs Manual](#7-docs-manual)**
8. **[Contributing](#8-contributing)**
9. **[Other Projects You Might Like](#9-other-projects-you-might-like)**

<br />

## 1. ReactiveSearch: Intro

ReactiveSearch is a UI components library for React and Vue, designed to work with ReactiveSearch cloud. It has over 20 UI components consisting of Lists, Ranges, Search UIs, Result displays, AI Answer, Charts, and a way to bring an existing UI component into the library.

A UI component can be used for filtering or searching on the index. For example:

-   A [`SingleList`](https://docs.reactivesearch.io/docs/reactivesearch/react/list/singlelist/) sensor component applies an exact match filter based on the selected item.
-   A [`RangeSlider`](https://docs.reactivesearch.io/docs/reactivesearch/react/range/rangeslider/) component applies a numeric range query based on the values selected from the UI.
-   A [`SearchBox`](https://docs.reactivesearch.io/docs/reactivesearch/react/search/searchbox/) component applies a suggestions and search query based on the search term typed by the user.

UI components can be used together (`react` prop allows configuring this on a per-component level) and render the matching results via a result display UI component.

**ReactiveSearch** supports the following built-in display components for displaying results (aka hits):
1. [ReactiveList](https://docs.reactivesearch.io/docs/reactivesearch/react/result/reactivelist/) - ReactiveList supports list and card display formats as well as allows custom rendering at both item and component level,
2. [ReactiveMap](https://docs.reactivesearch.io/docs/reactivesearch/react/map/reactivegooglemap/) - ReactiveMap offers choice of Google Maps and OpenStreetMaps for map rendering,
3. [AIAnswer](https://docs.reactivesearch.io/docs/reactivesearch/react/search/aianswer/) - AIAnswer offers Retrieval Augmented Generation (RAG) via search engine and OpenAI models, and
4. [ReactiveChart](https://docs.reactivesearch.io/docs/reactivesearch/react/chart/reactivechart/) - Powered by Apache E-Charts, ReactiveChart offers 5 built-in chart types: pie, bar, histogram, line, scatter, and additional charts in the Apache E-Charts format. ReactiveChart is only supported for React at this time.


<br />

## 2. Features

### Design

-   The UI components's query generation and ability to `react` allows for creating complex UIs where a number of UI components can reactively update based on user interaction.
-   The library handles the transformation of the UI interactions into search intent queries.
-   Comes with scoped and styled components with `className`` and `innerClass` prop support.
-   Is themable via [`ThemeProvider`](https://docs.reactivesearch.io/docs/reactivesearch/react/theming/overview/).

### Ease of Use

-   One step installation with [npm i @appbaseio/reactivesearch](https://docs.reactivesearch.io/docs/reactivesearch/react/overview/quickstart/),
-   Styled and scoped components that can be easily extended,
-   See the [reactivesearch starter app](https://github.com/awesome-reactivesearch/reactivesearch-starter-app).

### 🆕 ReactiveSearch API: Secure your Search Queries

Starting ReactiveSearch v4 (current major release), the library only sends the search intent, specification for this is here - [ReactiveSearch API ref](https://docs.reactivesearch.io/docs/search/reactivesearch-api/). Based on the choice of search engine you configure in ReactiveSearch cloud, the search query DSL is then generated by ReactiveSearch cloud. This approach is both more secure as well as allows transfering the search business logic on the server-side.


If you're using ReactiveSearch v3 (last major release), use of ReactiveSearch API over ElasticSearch's query DSL is an opt-in feature. You need to set the `enableAppbase` prop as `true` in your `ReactiveBase` component. This assumes that you are using appbase.io for your backend.

We recommend checking out this [KitchenSink App](https://codesandbox.io/s/loving-margulis-p8rd6z) that demonstrates the use of the `ReactiveSearch API` for all the ReactiveSearch components.

[⬆ Back to Top](#------reactive-search--)

<br />

## 3. Component Playground

Try the live component playground stories at [playground](https://opensource.appbase.io/playground/?filterBy=ReactiveSearch&selectedKind=Range%20components%2FRatingsFilter). Look out for the knobs section in the playground part of the stories to tweak each prop and see the effects.

<br />

## 4. Live Demos

A set of live demos inspired by real world apps, built with ReactiveSearch.

### Web

-  [demos/booksearch](https://opensource.appbase.io/reactivesearch/demos/goodbooks/) - An book search app based on a goodbooks dataset.
- [BookSearch with Antd](https://antd-booksearch.reactiveapps.io/) - A demo showing use of Ant design's theming and UI components with ReactiveSearch
- [E-commerce Movie Search](https://movies-ecommerce-demo.reactiveapps.io/) - A demo showing an e-commerce movie search UI
- [Dashboard search and charts](https://dashboard-app.reactiveapps.io/) - A demo with user authentication: login, search and charts UIs.

You can check all of them on the [examples section of website](https://opensource.reactivesearch.io/#examples).


[⬆ Back to Top](#------reactive-search--)

<br />

## 5. Comparison with Other Projects

Here, we share how `ReactiveSearch` compares with other projects that have similar aims.

|                                **#** |                                                               **ReactiveSearch**                                                                |                                                                              **SearchKit**                                                                              |                                         **InstantSearch**                                         |
| -----------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------: |
|                          **Backend** |                                          Elasticsearch, OpenSearch, Solr, MongoDB, OpenAI                                           |                                                      Any Elasticsearch index hosted on any Elasticsearch cluster.                                                       |                      Custom-built for Algolia, a proprietary search engine.                       |
|                      **Development** |                                                       Actively developed and maintained.                                                        |                                                        Active issue responses, some development and maintenance.                                                        |                                Actively developed and maintained.                                 |
|            **Onboarding Experience** | Starter apps, Live interactive tutorial, getting started guide, component playground, every component has a live working demo with codesandbox. |                                      Getting started tutorial, no live component demos, sparse reference spec for many components.                                      |                    Starter apps, getting started guide, component playground.                     |
|                  **Styling Support** |                      Styled and scoped components. No external CSS import required. Rich theming supported as React props.                      |                                            CSS based styles with BEM, not scoped to components. Theming supported with SCSS.                                            |     CSS based styles, requires external style import. Theming supported by manipulating CSS.      |
|              **Types of Components** |                              Lists, Ranges, Search, Dates, Maps, Result Displays. Can use your own UI components.                               | Lists, Ranges, Search*, Result*. Can't use your own UI components. (Only one component for Search and Result, resulting in more code to be written for customizability) |                   Lists, Range, Search, Result. Can use your own UI components.                   |
| **Supported Distribution Platforms** |                                                  React, Vue for Web, React Native for mobile.                                                   |                                                                             React for Web.                                                                              | React, Vue, Angular, vanilla JS for Web, React Native for mobile but latter has no UI components. |

We welcome contributions to this section. If you are building a project or you know of another project that is in the similar space, let us know and we will update the comparisons.

[⬆ Back to Top](#------reactive-search--)

<br />

## 6. Installation

Installing ReactiveSearch is just one command.

-   If you're using reactivesearch for React

```javascript
npm install @appbaseio/reactivesearch
```

You can check out the quickstart guide with React [here](https://docs.reactivesearch.io/docs/reactivesearch/react/overview/quickstart/).

-   If you're using reactivesearch for Vue

```javascript
npm install @appbaseio/reactivesearch-vue
```

You can check out the quickstart guide with Vue [here](https://docs.reactivesearch.io/docs/reactivesearch/vue/overview/quickstart/).

<br />

## 7. Docs Manual

The official docs for the React library are at [docs.reactivesearch.io/docs/reactivesearch/react](https://docs.reactivesearch.io/docs/reactivesearch/react/overview/quickstart/).

The components are divided into four sections:

-   List based UI components are at [reactivesearch/react/list](https://docs.reactivesearch.io/docs/reactivesearch/react/list/singlelist/).
-   Range based UI components are at [reactivesearch/react/range](https://docs.reactivesearch.io/docs/reactivesearch/react/range/singlerange/).
-   Search UI components are at [reactivesearch/react/search](https://docs.reactivesearch.io/docs/reactivesearch/react/search/datasearch/).
-   Result components are at [reactivesearch/react/result](https://docs.reactivesearch.io/docs/reactivesearch/react/result/reactivelist/).
-   Map components are at [reactivesearch/react/map](https://docs.reactivesearch.io/docs/reactivesearch/react/map/geodistanceslider/).
-   Chart components are at [reactivesearch/react/chart](https://docs.reactivesearch.io/docs/reactivesearch/react/chart/piechart/).

Docs for Vue version of the library are available at [docs.reactivesearch.io/docs/reactivesearch/vue](https://docs.reactivesearch.io/docs/reactivesearch/vue/overview/quickstart/).

[⬆ Back to Top](#------reactive-search--)

<br />

## 8. Contributing

Please check the [contribution guide](.github/CONTRIBUTING.md).

<br />

## 9. Other Projects You Might Like

-   [**ReactiveSearch API**](https://github.com/appbaseio/reactivesearch-api) API Gateway for ElasticSearch, OpenSearch, Solr, MongoDB, OpenAI (Out of the box Security, Rate Limit Features, Record Analytics and Request Logs).

-   [**searchbox**](https://github.com/appbaseio/searchbox) A lightweight and performance focused searchbox UI libraries to query and display results with ReactiveSearch Cloud.
    -   [**Vanilla JS**](https://github.com/appbaseio/searchbox)
    -   [**Flutter**](https://github.com/appbaseio/flutter-searchbox)

-   [**dejavu**](https://github.com/appbaseio/dejavu) Elasticsearch / OpenSearch data viewer and editor

-   [**appbase-js**](https://github.com/appbaseio/appbase-js) For when you need to index data in addition to UI components

[⬆ Back to Top](#------reactive-search--)

<a href="https://reactivesearch.io/support/"><img src="https://i.imgur.com/UL6B0uE.png" width="100%" /></a>
