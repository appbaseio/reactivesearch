<h2 align="center">
  <img src="https://i.imgur.com/iiR9wAs.png" alt="reactivesearch" title="reactivesearch" width="200" />
  <br />
  Reactive Search
  <br />
</h2>

<p align="center" style="font-size: 1.2rem">A React and React Native UI components library for Elasticsearch</p>
<p align="center"><a href="https://codeburst.io/how-to-build-an-e-commerce-search-ui-with-react-and-elasticsearch-a581c823b2c3">Read how to build an e-commerce search UI on codeburst</a></p>

<br/>
<p align="center">
  <a href="https://github.com/appbaseio/reactivesearch/tree/dev/packages/web" style="padding: 10px; display: inline-block;"><img src="https://i.imgur.com/Uo97x64.png" alt="web" title="web" /></a>
  <a href="https://github.com/appbaseio/reactivesearch/tree/dev/packages/native" style="padding: 10px; display: inline-block;"><img src="https://i.imgur.com/jgZp3W2.png" alt="native" title="native" /></a>
</p>

<hr />

[![npm version](https://badge.fury.io/js/%40appbaseio%2Freactivesearch.svg)](https://badge.fury.io/js/%40appbaseio%2Freactivesearch)
[![](https://img.shields.io/badge/license-Apache%202-blue.svg)](https://github.com/appbaseio/reactivesearch/blob/dev/LICENSE)
[![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/appbaseio/reactivesearch)
[![npm](https://img.shields.io/npm/dt/@appbaseio/reactivesearch.svg)](https://www.npmjs.com/package/@appbaseio/reactivesearch)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/appbaseio/reactivesearch/#8-developing-locally)

#### :rocket: Jumpstart your app development with
```
npm install @appbaseio/reactivesearch
```

![Banner Image showing all the UI components we offer](https://i.imgur.com/bJ1QKZS.png)

[Get our designer templates for sketch](https://opensource.appbase.io/reactivesearch/resources/ReactiveSearch_Playground.sketch).

## TOC

1. **[ReactiveSearch: Intro](#1-reactivesearch-intro)**
2. **[Features](#2-features)**
3. **[Component Playground](#3-component-playground)**
4. **[Live Examples](#4-live-demos)**
5. **[Comparison with Other Projects](#5-comparison-with-other-projects)**
6. **[Installation](#6-installation)**
7. **[Getting Started](#7-getting-started)**
8. **[Docs Manual](#8-docs-manual)**
9. **[Contributing](#9-contributing)**
10. **[Other Projects You Might Like](#10-other-projects-you-might-like)**

<br>

## 1. ReactiveSearch: Intro

ReactiveSearch is a React UI components library for Elasticsearch. It has 25+ components consisting of Lists, Ranges, Search UIs, Result displays and a way to bring any existing UI component into the library.

The library is conceptually divided into two parts:  

1. Sensor components and
2. Actuator components.

Each sensor component is built for applying a specific filter on the data. For example:

* A [`SingleList`](https://opensource.appbase.io/reactive-manual/list-components/singlelist.html) sensor component applies an exact match filter based on the selected item.
* A [`RangeSlider`](https://opensource.appbase.io/reactive-manual/range-components/rangeslider.html) component applies a numeric range query based on the values selected from the UI.
* A [`DataSearch`](https://opensource.appbase.io/reactive-manual/search-components/datasearch.html) component applies a suggestions and search query based on the search term typed by the user.

Sensor components can be configured to create a combined query context and render the matching results via an actuator component.

**ReactiveSearch** primarily comes with two actuators: `ResultCard` and `ResultList`. ResultCard displays the results in a card interface whereas ResultList displays them in a list. Both provide built-in support for pagination and infinite scroll views. Besides these, the library also provides low level actuators (ReactiveComponent and ReactiveList) to render in a more customized fashion.

## 2. Features

### Design

* The sensor / actuator design pattern allows creating complex UIs where any number of sensors can be chained together to reactively update an actuator (or even multiple actuators).
* The library handles the transformation of the UI interactions into database queries. You only need to include the components and associate each with a DB field.
* Built in live updates - Actuators can be set to update results even when the underlying data changes in the DB.
* Comes with scoped and styled components. Doesn't require any external CSS library import, comes with className and innerClass support.
* Is themable via [`ThemeProvider`](https://opensource.appbase.io/reactive-manual/theming/themes.html).


### Ease of Use

* One step installation with [npm install @appbaseio/reactivesearch](https://opensource.appbase.io/reactive-manual/v1/getting-started/reactivesearch.html),
* A UMD build that works directly in the browser. Installation steps [here](https://opensource.appbase.io/reactive-manual/getting-started/reactivesearch.html#reactivesearch-as-umd),
* Styled and scoped components that can be easily extended,
* See the [reactivesearch starter app](https://github.com/appbaseio-apps/reactivesearch-starter-app).

[⬆ Back to Top](#reactive-search)

## 3. Component Playground

Try the live component playground at [playground](https://opensource.appbase.io/playground/?filterBy=ReactiveSearch&selectedKind=Range%20components%2FRatingsFilter). Look out for the knobs section in the playground part of the stories to tweak each prop and see the effects.


## 4. Live Demos

A set of live demos inspired by real world apps, built with ReactiveSearch.

- [demos/airbeds](https://opensource.appbase.io/reactivesearch/demos/airbeds/) - An airbnb-like booking search experience.
- [demos/technews](https://opensource.appbase.io/reactivesearch/demos/technews/) - A full-text search app on the Hacker News dataset.
- [demos/gitxplore](https://opensource.appbase.io/reactivesearch/demos/gitxplore/) - Explore all the popular Github repositories.
- [demos/productsearch](https://opensource.appbase.io/reactivesearch/demos/producthunt/) - Filtered feed of products based on a small Product Hunt dataset.
- [demos/booksearch](https://opensource.appbase.io/reactivesearch/demos/goodbooks/) - An book search app based on a goodbooks dataset.
- [demos/ecommerce](https://opensource.appbase.io/reactivesearch/demos/ecommerce/) - An e-commerce car store app.


You can check all of them on the [examples section of website](https://opensource.appbase.io/reactivesearch/#examples).

[⬆ Back to Top](#reactive-search)

## 5. Comparison with Other Projects

Here, we share how `ReactiveSearch` compares with other projects that have similar aims.

|  **#** | **ReactiveSearch** | **SearchKit** | **InstantSearch** |
|  ------: | :------: | :------: | :------: |
|  **Backend** | Any Elasticsearch index hosted on any Elasticsearch cluster. | Any Elasticsearch index hosted on any Elasticsearch cluster. | Custom-built for Algolia, a proprietary search engine. |
|  **Development** | Actively developed and maintained. | Active issue responses, some development and maintenance. | Actively developed and maintained. |
|  **Onboarding Experience** | Starter apps, Live interactive tutorial, getting started guide, component playground, every component has a live working demo with codesandbox. | Getting started tutorial, no live component demos, sparse reference spec for many components. | Starter apps, getting started guide, component playground. |
|  **Styling Support** | Styled and scoped components. No external CSS import required. Rich theming supported as React props. | CSS based styles with BEM, not scoped to components. Theming supported with SCSS. | CSS based styles, requires external style import. Theming supported by manipulating CSS. |
|  **Types of Components** | Lists, Ranges, Search, Dates, Maps*, Result Displays. Can use your own UI components. (Maps need an upgrade) | Lists, Ranges, Search*, Result*. Can't use your own UI components. (Only one component for Search and Result, resulting in more code to be written for customizability) | Lists, Range, Search, Result. Can use your own UI components. |
|  **Supported Distribution Platforms** | React for Web, React Native for mobile in alpha and actively developed. | React for Web. | React, Vue, Angular, vanilla JS for Web, React Native for mobile but latter has no UI components. |

We welcome contributions to this section. If you are building a project or you know of another project that is in the similar space, let us know and we will update the comparisons.

[⬆ Back to Top](#reactive-search)

## 6. Installation

Installing ReactiveSearch is just one command.

```javascript
npm install @appbaseio/reactivesearch
```

You can also read about it [here](https://opensource.appbase.io/reactive-manual/getting-started/reactivesearch.html).


## 7. Getting Started

Follow the getting started guide to build a Hello Search! app from the official docs [here](https://opensource.appbase.io/reactive-manual/getting-started/reactivesearch.html).

## 8. Docs Manual

The official docs for the library are at [https://opensource.appbase.io/reactive-manual](https://opensource.appbase.io/reactive-manual).

The components are divided into four sections:
* Generic UI components are at [reactive-manual/base-components](https://opensource.appbase.io/reactive-manual/base-components/textfield.html).
* List based UI components are at [reactive-manual/list-components](https://opensource.appbase.io/reactive-manual/list-components/singlelist.html).
* Range based UI components are at [reactive-manual/range-components](https://opensource.appbase.io/reactive-manual/range-components/singlerange.html).
* Search UI components are at [reactive-manual/search-components](https://opensource.appbase.io/reactive-manual/search-components/datasearch.html).
* Result components are at [reactive-manual/result-components](https://opensource.appbase.io/reactive-manual/result-components/resultlist.html).

[⬆ Back to Top](#reactive-search)

## 9. Contributing

Please check the [contribution guide](.github/CONTRIBUTING.md).

## 10. Other Projects You Might Like

- [**ReactiveSearch Dashboard**](https://dashboard.appbase.io/reactivesearch/) All your Reactive Search related apps (created via interactive tutorial, shared by others, etc.) can be accessed from here.
- [**ReactiveMaps**](https://github.com/appbaseio/reactivemaps) is a similar project to Reactive Search that allows building realtime maps easily.

- [**appbase-js**](https://github.com/appbaseio/appbase-js) While building search UIs is dandy with Reactive Search, you might also need to add some input forms. **appbase-js** comes in handy there.

- [**dejavu**](https://github.com/appbaseio/dejavu) allows viewing raw data within an appbase.io (or Elasticsearch) app. **Soon to be released feature:** An ability to import custom data from CSV and JSON files, along with a guided walkthrough on applying data mappings.

- [**mirage**](https://github.com/appbaseio/mirage) ReactiveSearch components can be extended using custom Elasticsearch queries. For those new to Elasticsearch, Mirage provides an intuitive GUI for composing queries.

[⬆ Back to Top](#reactive-search)

