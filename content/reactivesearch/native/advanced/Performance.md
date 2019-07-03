---
title: 'Performance'
meta_title: 'Performance'
keywords:
    - reactivesearch-native
    - performance
    - appbase
    - elasticsearch
sidebar: 'native-reactivesearch'
---

Good performace is very critical to mobile apps and websites. With emerging technologies, it is of paramount importance to ship highly performant applications. Users don't care what technologies are used to build the products they use, they just want things to work smoothly.

Often while building apps with React Native, you will run into performance issues here and there. The key thing to note here is that React Native is not the solution of every problem. While it works
out of the box for a range of use-cases, you should know that if your mobile app requires too much hardware interaction, you'd be better off writing native solutions (i.e. Java, Objective C or Swift) for the intensive parts of your application. For most cases, you will readily find open-source solutions.

A good starting guide to understand and improving performance in your app is the [official react native docs](https://facebook.github.io/react-native/docs/performance.html), which goes in details about profiling, measuring and improving performance in React Native apps.

For starters, let's go over the architecture briefly:

We have three things:

-   JavaScript core - where your react native (js) code runs
-   Bridge
-   Native - where native modules and APIs reside

Bridge, as the name suggests, helps in the data (message) transactions between JavaScript core and Native. It enables your JavaScript code to talk to the native modules and interact with the device API. Since JavaScript is single-threaded, it is recommended to move the heavy computational tasks to native, and ultimately reducing the transactions at the bridge. This is the whole fundamental logic to improve performance in your React Native apps.

In this guide, we will discuss some tips that you can follow to improve the performance of your app:

### 1. The ultimate goal

For everything to work smoothly, you need to make sure that your application display is being rendered at 60 frames per second, i.e. you have 16.67ms to do all of the work needed to generate the static image (frame) that the user will see on the screen at any particular interval.

### 2. Profile everything

You can use the built-in profiler to get detailed information about work done in the JavaScript thread and main thread side-by-side. Read more about it [here](https://facebook.github.io/react-native/docs/performance.html#profiling).

### 3. Spy MessageQueue

Get logs from the JS bridge by enabling SPY mode from MessageQueue module: `MessageQueue.spy(true)`. Refer [this article](https://medium.com/@rotemmiz/react-native-internals-a-wider-picture-part-1-messagequeue-js-thread-7894a7cba868) for details.

### 4. Find the culprit and move it to native

Use remote debugger and chrome profiler to find the tasks that are taking too long and hindering performance in your app, and see if they can be fixed. If not, offload them to native and compute via Native modules.

### 5. Production builds

Always test on real devices befor you publish to production. Sometimes, toggling the `development` mode also helps.
