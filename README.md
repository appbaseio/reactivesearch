## Reactive Search

[![Join the chat at https://gitter.im/appbaseio/reactivesearch](https://badges.gitter.im/appbaseio/reactivesearch.svg)](https://gitter.im/appbaseio/reactivesearch?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) ![Build Status Image](https://img.shields.io/badge/build-passing-brightgreen.svg) [![Code Climate](https://codeclimate.com/github/appbaseio/reactivesearch/badges/gpa.svg)](https://codeclimate.com/github/appbaseio/reactivesearch)

A React components library for building Airbnb / Yelp like search experiences.

![](https://i.imgur.com/dIix6Jl.png)

## TOC

1. **[Reactive Search: Intro](#1-reactive-search-intro)**
2. **[Features](#2-features)**
3. **[Component Playground](#3-component-playground)**
4. **[Live Examples](#4-live-examples)**
5. **[Installation](#5-installation)**
6. **[Getting Started](#6-getting-started)**
7. **[Docs Manual](#7-docs-manual)**
8. **[Developing Locally](#8-developing-locally)**
9. **[Other Projects You Might Like](#9-other-projects-you-might-like)**

<br>

## 1. Reactive Search: Intro

Reactive Search is a React components library for building realtime search experiences. It is built on top of the appbase.io realtime DB service and ships with 25+ components for Lists, Dropdowns, Range Sliders, Data Search, Multi Level Menu, Calendars, Feeds Maps, Ratings Filter, Result Cards and Result Lists.

The library is conceptually divided into two parts:  

1. Sensor components and
2. Actuator components.

Each sensor component is purpose built for applying a specific filter on the data. For example:

* A `SingleList` sensor component applies an exact match filter based on the selected item.
* A `RangeSlider` component applies a numeric range query based on the values selected from the UI.
* A `RatingsFilter` component conveniently applies a ★ ratings filter on a dataset containing ratings like data.

Sensor components can be configured to create a combined query context and render the matching results via an actuator component.

**ReactiveSearch** primarily comes with two actuators: `ResultCard` and `ResultList`. ResultCard displays the results in a card interface whereas ResultList displays them in a list. Both provide built-in support for pagination and infinite scroll views.

Besides these, the library also provides low level actuators (ReactiveElement, ReactiveList) to render in a more customized fashion.

## 2. Features

### Design

* The sensor / actuator design pattern allows creating complex UIs where any number of sensors can be chained together to reactively update an actuator (or even multiple actuators).
* The library handles the transformation of the UI interactions into database queries. You only need to include the components and associate each with a DB field.
* Built in live updates - Actuators can be set to update results even when the underlying data changes in the DB.
* Comes with a cleanly namespaced CSS classes API that allows extending built-in styles without hassle.
* Built in `light` and `dark` UI themes.


### Ease of Use

* One step installation with [npm install @appbaseio/reactivesearch](https://opensource.appbase.io/reactive-manual/v1.0.0/getting-started/RSInstallation.html),
* A UMD build that works directly in the browser. See a demo [here](https://github.com/appbaseio-apps/reactivesearch-starter-app#try-in-browser-without-npm),
* Works out of the box with Materialize CSS and comes with a polyfill CSS for Bootstrap. Compatibility for other frameworks can be added too,
* See the [reactivesearch starter app](https://github.com/appbaseio-apps/reactivesearch-starter-app).

[⬆ Back to Top](#reactive-search)

## 3. Component Playground

Try the live component playground at [playground](https://opensource.appbase.io/playground/?filterBy=ReactiveSearch&selectedKind=s%2FRatingsFilter&selectedStory=Basic&full=0&down=1&left=1&panelRight=0&downPanel=kadirahq%2Fstorybook-addon-knobs). Look out for the knobs section in the playground part of the stories to tweak each prop and see the effects.


## 4. Live Examples

A set of examples built with ReactiveSearch and inspired by real world apps.

- [examples/airbeds](https://opensource.appbase.io/reactivesearch/examples/airbeds/) - An airbnb-like booking search experience.
- [examples/news](https://opensource.appbase.io/reactivesearch/examples/news) - A full-text search app on the Hacker News dataset.
- [examples/whosintown](https://opensource.appbase.io/reactivesearch/examples/whosintown/) - A live feed of meetup RSVPs based on topics, location and distance filters.
- [examples/productsearch](https://opensource.appbase.io/reactivesearch/examples/productsearch/) - Filtered feed of products based on a small Product Hunt dataset.
- [examples/ecommerce](https://opensource.appbase.io/reactivesearch/examples/ecommerce/) - An e-commerce car store app built with ReactiveSearch.
- [examples/yelpsearch](https://opensource.appbase.io/reactivesearch/examples/yelpsearch/) - A yelp-like app for finding local eateries.


You can check all of them on the [examples page](https://opensource.appbase.io/reactivesearch/examples/).

[⬆ Back to Top](#reactive-search)

## 5. Installation

Installing ReactiveSearch is just one command.

```javascript
npm i @appbaseio/reactivesearch
```

and another to add the stylesheets in the html.

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.98.0/css/materialize.min.css">
<link rel="stylesheet" href="https://cdn.rawgit.com/appbaseio/reactivesearch/master/dist/css/style.min.css">
```

You can also read about it [here](https://opensource.appbase.io/reactive-manual/v1.0.0/getting-started/RSInstallation.html).

(In the works) You can try out the library live without any installation via the [interactive tutorial](https://opensource.appbase.io/reactivesearch/dashboard/tutorial/).

## 6. Getting Started

Follow the getting started guide to build a Hello Maps! app from the official docs [here](https://opensource.appbase.io/reactive-manual/v1.0.0/getting-started/RSStart.html).

## 7. Docs Manual

The official docs for the library are at [https://opensource.appbase.io/reactive-manual](https://opensource.appbase.io/reactive-manual).

The components are divided into two sections:
* Generic UI components are at [https://opensource.appbase.io/reactive-manual/v1.0.0/components](https://opensource.appbase.io/reactive-manual/v1.0.0/components/).
* Map based UI components are at [https://opensource.appbase.io/reactive-manual/v1.0.0/map-components](https://opensource.appbase.io/reactive-manual/v1.0.0/map-components/).
* Each component's styles API is mentioned in a separate **CSS Styles API** section. See here for [SingleList](https://opensource.appbase.io/reactive-manual/v1.0.0/components/SingleList.html#-singlelist-css-styles-api).
* You can read more about the Styles API here - https://opensource.appbase.io/reactive-manual/v1.0.0/advanced/StyleGuide.html.

[⬆ Back to Top](#reactive-search)

## 8. Developing Locally

```
git clone https://github.com/appbasieo/reactivesearch
npm install (or yarn)
```

Start the development server on port `8000`.

```
npm start (or yarn start)
```

Examples can be accessed at [https://localhost:8000/examples](https://localhost:8000/examples).  

## 9. Other Projects You Might Like

- [**ReactiveSearch Dashboard**](https://dashboard.appbase.io/reactivesearch/) All your Reactive Search related apps (created via interactive tutorial, shared by others, etc.) can be accessed from here.
- [**ReactiveMaps**](https://github.com/appbaseio/reactivemaps) is a similar project to Reactive Search that allows building realtime maps easily.

- [**appbase-js**](https://github.com/appbaseio/appbase-js) While building search UIs is dandy with Reactive Search, you might also need to add some input forms. **appbase-js** comes in handy there.

- [**dejavu**](https://github.com/appbaseio/dejavu) allows viewing raw data within an appbase.io (or Elasticsearch) app. **Soon to be released feature:** An ability to import custom data from CSV and JSON files, along with a guided walkthrough on applying data mappings.

- [**mirage**](https://github.com/appbaseio/mirage) ReactiveSearch components can be extended using custom Elasticsearch queries. For those new to Elasticsearch, Mirage provides an intuitive GUI for composing queries.

[⬆ Back to Top](#reactive-search)
