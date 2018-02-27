<h2 align="center">
  <img src="https://i.imgur.com/iiR9wAs.png" alt="reactivesearch" title="reactivesearch" width="200" />
  <br />
  ReactiveSearch Native
  <br />
</h2>

<p align="center" style="font-size: 1.2rem">A React Native UI components library for Elasticsearch. <a href="https://opensource.appbase.io/reactivesearch/native">🌐 &nbsp;Website</a></p>
<p align="center"><a href="https://medium.appbase.io/build-your-next-react-native-app-with-reactivesearch-ce21829f3bf5">Read the launch blog post here</a>.</p>

<hr />

[![npm version](https://badge.fury.io/js/%40appbaseio%2Freactivesearch-native.svg)](https://badge.fury.io/js/%40appbaseio%2Freactivesearch-native)
[![](https://img.shields.io/badge/license-Apache%202-blue.svg)](https://github.com/appbaseio/reactivesearch/blob/dev/LICENSE)
[![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/appbaseio/reactivesearch)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/appbaseio/reactivesearch/blob/dev/.github/CONTRIBUTING.md)

<br />

#### :rocket: Jumpstart your app development with
```
npm install @appbaseio/reactivesearch-native
```

and this [quickstart guide](https://opensource.appbase.io/reactive-manual/native/getting-started/reactivesearch.html).

![](https://ph-files.imgix.net/2d1eab6b-c836-4255-89df-0553841d7c33?auto=format&auto=compress&codec=mozjpeg&cs=strip)


## Introduction

Building a data-driven mobile app with React Native takes anywhere between several weeks to months today.

ReactiveSearch offers cross-platform UI components that work not only for iOS and Android, but also for the [web](https://github.com/appbaseio/reactivesearch/tree/dev/packages/web). These UI components can further directly talk to an Elasticsearch backend with a `ReactiveBase` backend provider component.

> Much like how Bootstrap and Materialize provide scaffolding to build styles for your website, ReactiveSearch provides scaffolding to build data-driven apps.

Using it, we have been able to consistently ship apps within days, and we hope that you will build your next React Native app using ReactiveSearch.


<br />

## Features

- Works out of the box with an Elasticsearch index or appbase.io service.
- Cross-platform components - Works on both iOS and Android, with equivalent components also available for the [web](https://opensource.appbase.io/reactive-manual/getting-started/componentsindex.html).
- [Bring your own design components](opensource.appbase.io/reactive-manual/native/advanced/reactivecomponent.html) and make them work with ReactiveSearch components.
- Full theming support, components are built with primitives from NativeBase.io.
- Built with accessibility in mind, all components have an interactive playground (see an example for [DataSearch](https://opensource.appbase.io/reactive-manual/native/components/datasearch.html#demo)), live examples and [comprehensive docs](https://opensource.appbase.io/reactive-manual/native/).

<br />

## Try it out

Run this [example app with Snack Editor](https://snack.expo.io/@metagrover/booksearch) to see ReactiveSearch in action.

Or get your own app up and running in 15 mins by following the [quickstart guide](https://opensource.appbase.io/reactive-manual/native/getting-started/reactivesearch.html).

<br />

## Example Apps

We have published the following apps to the App Store / Playstore.

- [Booksearch on Play Store](https://play.google.com/store/apps/details?id=com.booksnative): A booksearch app showing a searchable collection of over 10k books built with ReactiveSearch. [Also available as an interactive demo](https://snack.expo.io/@metagrover/booksearch).  
- [Gitxplore on Play Store](https://play.google.com/store/apps/details?id=com.appbaseio.gitxplore): A Github repository explorer app to  search over the 25k+ most popular github repos. [Also available as an interactive demo](https://snack.expo.io/@dhruvdutt/gitxplore).  
- [ReactiveTodos on App Store](https://itunes.apple.com/us/app/reactivetodos/id1347926945?mt=8): A shared collaborative to-do list app to showcase the capability of Reactivesearch. [Also available as an interactive demo](https://snack.expo.io/@dhruvdutt/todo).

<br />

## Contributing

We welcome contributions in the form of issues, PRs. Please read the [contribution guide](https://github.com/appbaseio/reactivesearch/tree/dev/.github/CONTRIBUTING.md).

<br />

## Debugging and Troubleshooting

The simplest way to debug the app is using [React Native Debugger](https://github.com/jhen0409/react-native-debugger).
If you are having trouble running your react native app and are seeing any dependency warnings, reset cache via

```
yarn start --reset-cache
```
