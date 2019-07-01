---
id: reactivemap
title: 'ReactiveMap'
layout: docs
sectionid: docs
permalink: map-components/reactivemap.html
prev: map-components/geodistancedropdown.html
prevTitle: 'GeoDistanceDropdown'
---

![ReactiveMap Image](https://i.imgur.com/Q87ks8I.png)

A `ReactiveMap` creates a data-driven map UI component. It is the key component for build map based experiences.

Example uses:

-   showing a map of user checkins by city and topics for powering discovery based experiences.
-   displaying restaurants filtered by a nearby distance query on a map.

### Usage

#### Basic Usage

```js
<ReactiveMap componentId="MapUI" dataField="location" title="Venue Location Map" />
```

#### Usage With All Props

```js
<ReactiveMap
	componentId="MapUI"
	dataField="location"
	title="Venue Location Map"
	size={100}
	defaultZoom={13}
	defaultCenter={{ lat: 37.74, lng: -122.45 }}
	showMapStyles={true}
	defaultMapStyle="Standard"
	showMarkerClusters={true}
	showSearchAsMove={true}
	searchAsMove={true}
	onPopoverClick={this.onPopoverClick}
	stream={true}
	// 'react' defines when and how the map component should update
	react={{
		and: 'CitySensor',
	}}
	// map events
	onData={this.onData}
	// less useful props
	autoCenter={true}
/>
```

### Props

-   **componentId** `String`
    unique identifier of the component, can be referenced in other components' `react` prop.
-   **dataField** `String`
    DB data field to be connected to the component's UI view, usually of a geopoint (i.e. location) data type and used for rendering the markers on the map.
-   **title** `String or JSX` [optional]
    title of the component to be shown in the UI.
-   **size** `Number` [optional]
    number of results to show in the map view, can be a number in the range [1, 1000]. Defaults to 100.
-   **defaultZoom** `Number` [optional]
    preset map's zoom level, accepts integer values between [0, 20]. 0 is the minimum zoom level, where you can see the entire globe. 20 is the maximum zoom level. Defaults to 13.
-   **defaultCenter** `Object` [optional]
    preset map's center position by specifying an object with valid `lat` and `lng` values. This prop, when set, will cause the component to run a geo-distance query with a distance of 10mi (Refer: `defaultRadius` and `unit` prop to configure the distance).
-   **center** `Object` [optional]
    set map's center position by specifying an object with valid `lat` and `lng` values. This prop, when set, will cause the component to run a geo-distance query with a distance of 10mi (Refer: `defaultRadius` and `unit` prop to configure the distance).
-   **defaultRadius** `Number` [optional]
    used as distance value for the geo-distance query when `defaultCenter` or `center` is set. It accepts all positive integers.
-   **unit** `String` [optional]
    unit for distance measurement, uses `mi` (for miles) by default. Distance units can be specified from the following:
    ![screenshot](https://i.imgur.com/STbeagk.png)
-   **showMapStyles** `Boolean` [optional]
    whether to show map styles dropdown picker in the map UI. Defaults to `true`.
-   **defaultMapStyle** `String` [optional]
    preset a map style for the map UI. Available options include "Standard", "Blue Essence", "Blue Water", "Flat Map", "Light Monochrome", "Midnight Commander", "Unsaturated Browns".
-   **showMarkers** `Boolean` [optional]
    whether to show the markers on the map, defaults to `true`. Sometimes, it doesn't make sense to display markers (when building a heatmap or weather map or a directions navigation map)
-   **defaultPin** `String` [optional]
    URL of the default marker pin image to be shown. It comes with a default image. Should only be set if you wish to use a custom marker.
-   **showMarkerClusters** `Boolean` [optional]
    whether to aggregate and form a cluster of nearby markers. Defaults to `true`.
-   **showSearchAsMove** `Boolean` [optional]
    whether to show the _Search As I Move_ checkbox in the UI. Defaults to `true`.
-   **searchAsMove** `Boolean` [optional]
    whether to set the _Search As I Move_ checkbox. Defaults to `false`.
-   **onPopoverClick** `function` [optional]
    a function that takes one argument for getting a marker's data and returns an HTML markup to be displayed in the popover box.
-   **autoClosePopover** `Boolean` [optional]
    automatically closes the exisiting open popovers when `onPopoverClick` gets fired. Defaults to `false`.
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
-   **autoCenter** `Boolean` [optional]
    whether to auto center the map based on the geometric center of all the location markers. Defaults to `false`.
-   **streamAutoCenter** `Boolean` [optional]
    whether to auto center the map based on the geometric center of all the location markers while `stream` prop is set to `true`. Defaults to `false`.
    <!-- - **autoMarkerPosition** `Boolean` [optional]
        whether to set the rotation angle of the marker image based on the delta changes in its location, useful when displaying realtime traffic data. Defaults to `false`. -->
-   **className** `String`
    CSS class to be injected on the component container.
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

<br />

<iframe height='500' scrolling='no' title='ReactiveMap Example' src='//codepen.io/dhruvdutt/embed/KRwmvz/?height=500&theme-id=light&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/dhruvdutt/pen/KRwmvz/'>ReactiveMap Example</a> by Dhruvdutt Jadhav (<a href='https://codepen.io/dhruvdutt'>@dhruvdutt</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Styles

`ReactiveMap` component supports `innerClass` prop with the following keys:

-   `title`
-   `input`
-   `list`
-   `checkboxContainer`
-   `checkbox`
-   `label`
-   `select`
-   `icon`
-   `count`
-   `button`
-   `pagination`
-   `active`

## Examples

<a href="https://opensource.appbase.io/playground/?selectedKind=Map%20Components%2FReactiveMap&selectedStory=Basic&full=0&addons=1&stories=1&panelRight=0&addonPanel=storybooks%2Fstorybook-addon-knobs" target="_blank">ReactiveMap with all the default props</a>
