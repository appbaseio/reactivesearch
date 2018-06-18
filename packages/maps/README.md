<h2 align="center">
  <img src="https://i.imgur.com/iiR9wAs.png" alt="reactivemaps" title="reactivemaps" width="200" />
  <br />
  Reactivemaps
  <br />
</h2>

<p align="center">Elasticsearch UI components for building data-driven Map UIs. <a href="https://opensource.appbase.io/reactivemaps/">Website 🌐</a></p>
<p align="center" style="font-size: 1.2rem"><a href="https://opensource.appbase.io/reactive-manual/getting-started/reactivemaps.html">Quickstart with Reactivemaps</a>.</p>

<hr />

[![npm version](https://badge.fury.io/js/%40appbaseio%2Freactivemaps.svg)](https://badge.fury.io/js/%40appbaseio%2Freactivemaps)
[![](https://img.shields.io/badge/license-Apache%202-blue.svg)](https://github.com/appbaseio/mirage/blob/dev/LICENSE.md)
[![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/appbaseio/reactivesearch)
[![npm](https://img.shields.io/npm/dt/@appbaseio/reactivemaps.svg)](https://www.npmjs.com/package/@appbaseio/reactivemaps)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/appbaseio/reactivesearch/blob/dev/.github/CONTRIBUTING.md)

Elasticsearch UI components for building data-driven Map UIs.

![](https://i.imgur.com/Dwz8pX4.png)

[Get our designer templates for sketch](https://opensource.appbase.io/reactivemaps/resources/ReactiveMaps_Playground.sketch).


## Installation

ReactiveMaps is a complimentary library to ReactiveSearch. Map components require ReactiveSearch architecture and its root component to begin with. If you wish to build anything on reactivemaps, you’ll need to install reactivesearch along with it.

```
yarn add @appbaseio/reactivemaps @appbaseio/reactivesearch
```

## Introduction

Reactivemaps allow you to connect your google-map component with your Elasticsearch cluster and also enables it to talk to other **reactive** components. Not just that, it enhances the development experience by efficiently integrating the streaming enhancements on the map component allowing you to build realtime apps with maps seamlessly. 

Reactivemap efficiently evaluates the map centers dynamically as the map updates and it also allows you to search on the map as it is moved. All and all, Reactivemap offers a rich bundled experience of realtime maps with a simple-to-use API.

## Concepts

**1. Map component**

ReactiveMap creates a data-driven map UI component. It is the key component for build map based experiences. - [ReactiveMap](https://opensource.appbase.io/reactive-manual/map-components/reactivemap.html)

**2. Complimentary sensor components**

Besides the sensor components from reactivesearch, reactivemap is compatible with two other pre-defined sensor components - GeoDistanceSlider and GeoDistanceDropdown. You can read more about them in the [docs](https://opensource.appbase.io/map-components/geodistanceslider.html)


## Live Demos

A set of live demos inspired by real world apps, built with Reactivemaps.

- [Airbeds](https://opensource.appbase.io/reactivesearch/demos/airbeds/) - An airbnb-like booking search experience.
- [Datalayers](https://opensource.appbase.io/reactivesearch/demos/datalayer/) - Demo combining the dark forces of datalayer and Reactivemaps.
- [Meetup Blast](https://opensource.appbase.io/reactivesearch/demos/meetup/) - A kickass meetup inspired search app built with Reactivemaps.
- [Board the bus](https://opensource.appbase.io/reactivesearch/demos/transport/) - Catch realtime bus transportation demo in action with Reactivemaps.

## Documentation

The official docs for the library are at [https://opensource.appbase.io/reactive-manual](https://opensource.appbase.io/reactive-manual).

## Related tooling and projects

- [**ReactiveSearch**](https://opensource.appbase.io/reactivesearch/) Everything you need to know about reactivesearch.

- [**appbase-js**](https://github.com/appbaseio/appbase-js) While building search UIs is dandy with Reactive Search, you might also need to add some input forms. **appbase-js** comes in handy there.

- [**dejavu**](https://github.com/appbaseio/dejavu) allows viewing raw data within an appbase.io (or Elasticsearch) app. **Soon to be released feature:** An ability to import custom data from CSV and JSON files, along with a guided walkthrough on applying data mappings.

- [**mirage**](https://github.com/appbaseio/mirage) ReactiveSearch components can be extended using custom Elasticsearch queries. For those new to Elasticsearch, Mirage provides an intuitive GUI for composing queries.

<a href="https://appbase.io/support/"><img src="https://i.imgur.com/UL6B0uE.png" width="100%" /></a>
