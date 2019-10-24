<h2 align="center">
  <img src="https://i.imgur.com/iiR9wAs.png" alt="reactivesearch" title="reactivesearch" width="200" />
  <br />
  Reactive Search
  <br />
</h2>

<p align="center" style="font-size: 1.2rem">A React and React Native UI components library for Elasticsearch</p>
<p align="center">
Read how to build an e-commerce search UI</p>
<p align="center">
a.) <a href="https://codeburst.io/how-to-build-a-yelp-like-search-app-using-react-and-elasticsearch-36a432bf6f92"> with React</a>, or b.) <a href="https://hackernoon.com/building-an-e-commerce-search-app-with-react-native-2c87760a2315">with React Native</a>.</p>
<br/>
<p align="center">
  <a href="https://github.com/appbaseio/reactivesearch/tree/dev/packages/web" style="padding: 10px; display: inline-block;"><img src="https://i.imgur.com/Uo97x64.png" alt="web" title="web" /></a>
  <a href="https://github.com/appbaseio/reactivesearch/tree/dev/packages/native" style="padding: 10px; display: inline-block;"><img src="https://i.imgur.com/jgZp3W2.png" alt="native" title="native" /></a>
  <a href="https://github.com/appbaseio/reactivesearch/tree/dev/packages/maps" style="padding: 10px; display: inline-block;"><img src="https://i.imgur.com/bNPG50x.png" alt="native" title="native" /></a>
</p>

<hr />

[![](https://img.shields.io/badge/license-Apache%202-blue.svg)](https://github.com/appbaseio/reactivesearch/blob/dev/LICENSE)
[![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/appbaseio/reactivesearch)
[![npm](https://img.shields.io/npm/dt/@appbaseio/reactivesearch.svg)](https://www.npmjs.com/package/@appbaseio/reactivesearch)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/appbaseio/reactivesearch/blob/dev/.github/CONTRIBUTING.md)
[![Mentioned in Awesome React](https://awesome.re/mentioned-badge.svg)](https://github.com/enaqx/awesome-react)
[![Mentioned in Awesome Elasticsearch](https://awesome.re/mentioned-badge.svg)](https://github.com/dzharii/awesome-elasticsearch)

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

ReactiveSearch is an Elasticsearch UI components library for React and React Native. It has 25+ components consisting of Lists, Ranges, Search UIs, Result displays and a way to bring any existing UI component into the library.

The library is conceptually divided into two parts:

1. Sensor components and
2. Actuator components.

Each sensor component is built for applying a specific filter on the data. For example:

-   A [`SingleList`](https://docs.appbase.io/docs/reactivesearch/v3/list/singlelist/) sensor component applies an exact match filter based on the selected item.
-   A [`RangeSlider`](https://docs.appbase.io/docs/reactivesearch/v3/range/rangeslider/) component applies a numeric range query based on the values selected from the UI.
-   A [`DataSearch`](https://docs.appbase.io/docs/reactivesearch/v3/search/datasearch/) component applies a suggestions and search query based on the search term typed by the user.

Sensor components can be configured to create a combined query context and render the matching results via an actuator component.

**ReactiveSearch** primarily comes with two actuators: `ResultCard` and `ResultList`. ResultCard displays the results in a card interface whereas ResultList displays them in a list. Both provide built-in support for pagination and infinite scroll views. Besides these, the library also provides low level actuators (ReactiveComponent and ReactiveList) to render in a more customized fashion.

<br />

## 2. Features

### Design

-   The sensor / actuator design pattern allows creating complex UIs where any number of sensors can be chained together to reactively update an actuator (or even multiple actuators).
-   The library handles the transformation of the UI interactions into database queries. You only need to include the components and associate each with a DB field.
-   Built in live updates - Actuators can be set to update results even when the underlying data changes in the DB.
-   Comes with scoped and styled components. Doesn't require any external CSS library import, comes with className and innerClass support.
-   Is themable via [`ThemeProvider`](https://docs.appbase.io/docs/reactivesearch/v3/theming/overview/).

### Ease of Use

-   One step installation with [npm i @appbaseio/reactivesearch](https://docs.appbase.io/docs/reactivesearch/v3/overview/quickstart/),
-   A UMD build that works directly in the browser. Installation steps [here](https://docs.appbase.io/docs/reactivesearch/v3/overview/quickstart/#step-5-reactivesearch-as-umd),
-   Styled and scoped components that can be easily extended,
-   See the [reactivesearch starter app](https://github.com/appbaseio-apps/reactivesearch-starter-app).

[⬆ Back to Top](#reactive-search)

<br />

## 3. Component Playground

Try the live component playground at [playground](https://opensource.appbase.io/playground/?filterBy=ReactiveSearch&selectedKind=Range%20components%2FRatingsFilter). Look out for the knobs section in the playground part of the stories to tweak each prop and see the effects.

<br />

## 4. Live Demos

A set of live demos inspired by real world apps, built with ReactiveSearch.

### Web

-   [demos/airbeds](https://opensource.appbase.io/reactivesearch/demos/airbeds/) - An airbnb-like booking search experience.
-   [demos/technews](https://opensource.appbase.io/reactivesearch/demos/technews/) - A full-text search app on the Hacker News dataset.
-   [demos/gitxplore](https://opensource.appbase.io/reactivesearch/demos/gitxplore/) - Explore all the popular Github repositories.
-   [demos/productsearch](https://opensource.appbase.io/reactivesearch/demos/producthunt/) - Filtered feed of products based on a small Product Hunt dataset.
-   [demos/booksearch](https://opensource.appbase.io/reactivesearch/demos/goodbooks/) - An book search app based on a goodbooks dataset.
-   [demos/ecommerce](https://opensource.appbase.io/reactivesearch/demos/ecommerce/) - An e-commerce car store app.

You can check all of them on the [examples section of website](https://opensource.appbase.io/reactivesearch/#examples).

### Mobile

-   [Booksearch on Play Store](https://play.google.com/store/apps/details?id=com.booksnative): A booksearch app showing a searchable collection of over 10k books built with ReactiveSearch. Also available as a snack.
-   [Gitxplore on Play Store](https://play.google.com/store/apps/details?id=com.appbaseio.gitxplore): A Github repository explorer app to search over the 25k+ most popular github repos.
-   [ReactiveTodos on App Store](https://itunes.apple.com/us/app/reactivetodos/id1347926945?mt=8): A shared collaborative to-do list app to showcase the capability of Reactivesearch.

[⬆ Back to Top](#reactive-search)

<br />

## 5. Comparison with Other Projects

Here, we share how `ReactiveSearch` compares with other projects that have similar aims.

|                                **#** |                                                               **ReactiveSearch**                                                                |                                                                              **SearchKit**                                                                              |                                         **InstantSearch**                                         |
| -----------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------: |
|                          **Backend** |                                          Any Elasticsearch index hosted on any Elasticsearch cluster.                                           |                                                      Any Elasticsearch index hosted on any Elasticsearch cluster.                                                       |                      Custom-built for Algolia, a proprietary search engine.                       |
|                      **Development** |                                                       Actively developed and maintained.                                                        |                                                        Active issue responses, some development and maintenance.                                                        |                                Actively developed and maintained.                                 |
|            **Onboarding Experience** | Starter apps, Live interactive tutorial, getting started guide, component playground, every component has a live working demo with codesandbox. |                                      Getting started tutorial, no live component demos, sparse reference spec for many components.                                      |                    Starter apps, getting started guide, component playground.                     |
|                  **Styling Support** |                      Styled and scoped components. No external CSS import required. Rich theming supported as React props.                      |                                            CSS based styles with BEM, not scoped to components. Theming supported with SCSS.                                            |     CSS based styles, requires external style import. Theming supported by manipulating CSS.      |
|              **Types of Components** |                              Lists, Ranges, Search, Dates, Maps, Result Displays. Can use your own UI components.                               | Lists, Ranges, Search*, Result*. Can't use your own UI components. (Only one component for Search and Result, resulting in more code to be written for customizability) |                   Lists, Range, Search, Result. Can use your own UI components.                   |
| **Supported Distribution Platforms** |                                                  React, Vue for Web, React Native for mobile.                                                   |                                                                             React for Web.                                                                              | React, Vue, Angular, vanilla JS for Web, React Native for mobile but latter has no UI components. |

We welcome contributions to this section. If you are building a project or you know of another project that is in the similar space, let us know and we will update the comparisons.

[⬆ Back to Top](#reactive-search)

<br />

## 6. Installation

Installing ReactiveSearch is just one command.

-   If you're using reactivesearch for web

```javascript
npm install @appbaseio/reactivesearch
```

You can check out the quickstart guide with React [here](https://docs.appbase.io/docs/reactivesearch/v3/overview/quickstart/).

-   If you're using reactivesearch for mobile (native)

```javascript
npm install @appbaseio/reactivesearch-native
```

You can check out the quickstart guide with React Native [here](https://docs.appbase.io/docs/reactivesearch/native/overview/QuickStart/).

<br />

## 7. Docs Manual

The official docs for the Web library are at [docs.appbase.io/docs/reactivesearch/v3](https://docs.appbase.io/docs/reactivesearch/v3/overview/quickstart/).

The components are divided into four sections:

-   Generic UI components are at [reactivesearch/v3/base](https://docs.appbase.io/docs/reactivesearch/v3/base/selectedfilters/).
-   List based UI components are at [reactivesearch/v3/list](https://docs.appbase.io/docs/reactivesearch/v3/list/singlelist/).
-   Range based UI components are at [reactivesearch/v3/range](https://docs.appbase.io/docs/reactivesearch/v3/range/singlerange/).
-   Search UI components are at [reactivesearch/v3/search](https://docs.appbase.io/docs/reactivesearch/v3/search/datasearch/).
-   Result components are at [reactivesearch/v3/result](https://docs.appbase.io/docs/reactivesearch/v3/result/reactivelist/).

Docs for React Native version of the library are available at [docs.appbase.io/docs/reactivesearch/native](https://docs.appbase.io/docs/reactivesearch/native/overview/QuickStart/).

[⬆ Back to Top](#reactive-search)

<br />

## 8. Contributing

Please check the [contribution guide](.github/CONTRIBUTING.md).

<br />

## 9. Other Projects You Might Like

-   [**arc**](https://github.com/appbaseio/arc) API Gateway for ElasticSearch (Out of the box Security, Rate Limit Features, Record Analytics and Request Logs).

-   [**dejavu**](https://github.com/appbaseio/dejavu) allows viewing raw data within an appbase.io (or Elasticsearch) app. **Soon to be released feature:** An ability to import custom data from CSV and JSON files, along with a guided walkthrough on applying data mappings.

-   [**mirage**](https://github.com/appbaseio/mirage) ReactiveSearch components can be extended using custom Elasticsearch queries. For those new to Elasticsearch, Mirage provides an intuitive GUI for composing queries.

-   [**ReactiveMaps**](https://github.com/appbaseio/reactivesearch/tree/next/packages/maps) is a similar project to Reactive Search that allows building realtime maps easily.

-   [**appbase-js**](https://github.com/appbaseio/appbase-js) While building search UIs is dandy with Reactive Search, you might also need to add some input forms. **appbase-js** comes in handy there.

[⬆ Back to Top](#reactive-search)

<a href="https://appbase.io/support/"><img src="https://i.imgur.com/UL6B0uE.png" width="100%" /></a>
