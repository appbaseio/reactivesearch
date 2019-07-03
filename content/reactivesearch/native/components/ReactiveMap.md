---
title: 'ReactiveMap'
meta_title: 'ReactiveMap'
meta_description: '`ReactiveMap` creates a data-driven map UI component.'
keywords:
    - reactivesearch-native
    - reactivemap
    - appbase
    - elasticsearch
sidebar: 'native-reactivesearch'
---

A `ReactiveMap` creates a data-driven map UI component. It is the key component for build map based experiences.

> ReactiveMaps is a complimentary library to ReactiveSearch. Map component requires ReactiveSearch architecture and its root component to begin with. If you wish to build anything with reactivemaps-native, you’ll need to install reactivesearch-native along with it.

Reactivemap can be added by installing `@appbaseio/reactivemaps-native`. For more details about the setup and installation, [checkout the reactivemaps-native quickstart guide](https://opensource.appbase.io/reactive-manual/native/getting-started/reactivemaps-native.html)

Example uses:

-   showing a map of user checkins by city and topics for powering discovery based experiences.
-   displaying restaurants filtered by a nearby distance query on a map.

### Usage

#### Basic Usage

```js
import ReactiveMap from '@appbaseio/reactivemaps-native';

<ReactiveMap componentId="MapUI" dataField="location" />;
```

#### Usage With All Props

```js
<ReactiveMap
	componentId="MapUI"
	dataField="location"
	size={100}
	defaultZoom={13}
	defaultCenter={{ lat: 37.74, lng: -122.45 }}
	defaultMapStyle="Standard"
	onPopoverClick={this.onPopoverClick}
	stream={true}
	// 'react' defines when and how the map component should update
	react={{
		and: 'CitySensor',
	}}
	// map events
	onData={this.onData}
/>
```

### Props

-   **componentId** `String`
    unique identifier of the component, can be referenced in other components' `react` prop.
-   **dataField** `String`
    DB data field to be connected to the component's UI view, usually of a geopoint (i.e. location) data type and used for rendering the markers on the map.
-   **size** `Number` [optional]
    number of results to show in the map view, can be a number in the range [1, 1000]. Defaults to 100.
-   **defaultZoom** `Number` [optional]
    preset map's zoom level. Internally used as initial latitude and longitude deltas. Defaults to 8.
-   **defaultCenter** `Object` [optional]
    preset map's center position by specifying an object with valid `lat` and `lng` values.
-   **defaultMapStyle** `String` [optional]
    preset a map style for the map UI. Available options include "Standard", "Blue Essence", "Blue Water", "Flat Map", "Light Monochrome", "Midnight Commander", "Unsaturated Browns".
-   **showMarkers** `Boolean` [optional]
    whether to show the markers on the map, defaults to `true`. Sometimes, it doesn't make sense to display markers (when building a heatmap or weather map or a directions navigation map)
-   **defaultPin** `String` [optional]
    URL of the default marker pin image to be shown. It comes with a default image. Should only be set if you wish to use a custom marker.
-   **showMarkerClusters** `Boolean` [optional]
    whether to aggregate and form a cluster of nearby markers. Defaults to `true`.
-   **onPopoverClick** `function` [optional]
    a function that takes one argument for getting a marker's data and returns an HTML markup to be displayed in the popover box.
-   **stream** `Boolean` [optional]
    whether to stream new result (aka realtime view) updates in the UI. Defaults to `false`.
-   **react** `Object`
    specify dependent components to reactively update **GeoDistanceDropdown's** options. Read more about it [here](/advanced/react.html).
    -   **key** `String`
        one of `and`, `or`, `not` defines the combining clause.
        -   **and** clause implies that the results will be filtered by matches from **all** of the associated component states.
        -   **or** clause implies that the results will be filtered by matches from **at least one** of the associated component states.
        -   **not** clause implies that the results will be filtered by an **inverse** match of the associated component states.
    -   **value** `String or Array or Object`
        -   `String` is used for specifying a single component by its `componentId`.
        -   `Array` is used for specifying multiple components by their `componentId`.
        -   `Object` is used for nesting other key clauses.
-   **style** `Object`
    CSS style object to be applied to the `ReactiveMap` component.
-   **onData** `function`
    event fired when one or more markers are indexed, updated or removed from the map. It takes an object with the following formats (`label`, `icon`, `custom`):

```js
// To render the given text in the marker
onData={result => ({
    label: result.title,
})}

// To render a marker image
onData={result => ({
    icon: 'https://i.imgur.com/NHR2tYL.png',
})}

// To render a custom markup (as label) in the marker position
onData={result => ({
    custom: (<div>{result.mag}</div>),
})}
```

## Demo

-   [Try the demo](https://snack.expo.io/@metagrover/reactivemap-with-reactivesearch-native) instantly.
-   Checkout example with SingleList [here](https://github.com/appbaseio/reactivesearch/blob/dev/packages/native/examples/maps/App.js)
