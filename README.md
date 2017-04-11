[![Join the chat at https://gitter.im/appbaseio/reactivesearch](https://badges.gitter.im/appbaseio/reactivesearch.svg)](https://gitter.im/appbaseio/reactivesearch?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) ![Build Status Image](https://img.shields.io/badge/build-passing-brightgreen.svg) [![Code Climate](https://codeclimate.com/github/appbaseio/reactivesearch/badges/gpa.svg)](https://codeclimate.com/github/appbaseio/reactivesearch)

A React components library for building great search experiences.

![](http://i.imgur.com/2j6aFPo.png)

## TOC

1. **[Reactive Search: Intro](#1-reactive-search-intro)**   
2. **[Features](#2-features)**  
3. **[Component Playground](#3-component-playground)**
4. **[Live Examples](#4-live-examples)**  
5. **[Installation](#5-installation)**
6. **[Getting Started](#6-getting-started)**  
7. **[Docs Manual](#7-docs-manual)**
8. **[Developing Locally](#8-developing-locally)**  

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

* One step installation with [npm install @appbaseio/reactivesearch](https://opensource.appbase.io/reactivesearch/manual/v1.0.0/getting-started/Installation.html),
* **TODO** A UMD build that works directly in the browser. See a demo [here](https://github.com/appbaseio-apps/reactivesearch-starter-app#try-in-browser-without-npm),
* Works out of the box with Materialize CSS and comes with a polyfill CSS for Bootstrap. Compatibility for other frameworks can be added too,
* **TODO** See the [reactivesearch starter app](https://github.com/appbaseio-apps/reactivesearch-starter-app).


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

## 5. Installation

Follow the installation guide from the official docs [here](https://opensource.appbase.io/reactivesearch/manual/v1.0.0/getting-started/Installation.html).

You can try out the library live without any installation via the [interactive tutorial](https://opensource.appbase.io/reactivesearch/onboarding/).

## 6. Getting Started

Follow the getting started guide to build a Hello Maps! app from the official docs [here](https://opensource.appbase.io/reactivesearch/manual/v1.0.0/getting-started/Start.html).


## 7. Docs Manual

The official docs for the library are at [https://opensource.appbase.io/reactivesearch/manual](https://opensource.appbase.io/reactivesearch/manual).

The components are divided into two sections:
* Generic UI components are at [https://opensource.appbase.io/reactivesearch/manual/v1.0.0/components](https://opensource.appbase.io/reactivesearch/manual/v1.0.0/components/).
* Map based UI components are at [https://opensource.appbase.io/reactivesearch/manual/v1.0.0/map-components](https://opensource.appbase.io/reactivesearch/manual/v1.0.0/map-components/).
* Each component's styles API is mentioned in a separate **CSS Styles API** section. See here for [SingleList](https://opensource.appbase.io/reactivesearch/manual/v1.0.0/components/SingleList.html#-singlelist-css-styles-api).
* You can read more about the Styles API here - https://opensource.appbase.io/reactivesearch/manual/v1.0.0/getting-started/StyleGuide.html.


## 8. Developing Locally

```
git clone https://github.com/appbasieo/reactivesearch
npm install
```

Start the development server on port `8012`.

```
npm start
```

Examples can be accessed at [https://localhost:8012/examples](https://localhost:8012/examples).  

You can also start the component playground on port `9009` with

```
npm run storybook
```

By adding the `manual` submodule, you can access the docs locally.

```
git submodule init
cd manual && git submodule update
```

Once added, the docs manual can be accessed at [http://localhost:8012/manual](http://localhost:8012/manual).
