---
title: 'ReactiveGoogleMap'
meta_title: 'ReactiveGoogleMap'
meta_description: '`ReactiveGoogleMap` creates a data-driven map UI component using Google Maps. It is the key component for building map based experiences.'
keywords:
    - reactivesearch
    - reactivegooglemap
    - vue
    - maps
    - appbase
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'vue-reactivesearch'
---

![ReactiveGoogleMap Image](https://i.imgur.com/Q87ks8I.png)

`ReactiveGoogleMap` creates a data-driven map UI component using Google Maps. It is the key component for building map based experiences.

Example uses:

-   showing a map of user check-ins by city and topics for powering discovery based experiences.
-   displaying restaurants filtered by a nearby distance query on a map.

### Usage

#### Installation
`<reactive-google-map />` uses Google Maps JS library to render the google map and access the necessary geo-location services. To configure the google maps you have to install the `ReactiveGoogleMap` plugin with google maps key. For example,

```js
import Vue from 'vue';
import App from './App.vue';
import {
	ReactiveBase,
	ReactiveGoogleMap,
} from '@appbaseio/reactivesearch-vue';

Vue.use(ReactiveBase);
// Installing the ReactiveGoogleMap plugin
Vue.use(ReactiveGoogleMap, {
	key: 'PUT_YOUR_MAP_KEY',
});
Vue.config.productionTip = false;

new Vue({
	render: h => h(App),
}).$mount('#app');

```

#### Nuxt.js config
If you're using Nuxt.js then you have to add the following to the `build` section of your `nuxt.config.js` file:

```js
transpile: [/^gmap-vue($|\/)/, /^@appbaseio\/reactivesearch-vue($|\/)/],
```
You can also check this [example](https://codesandbox.io/s/github/appbaseio/reactivesearch/tree/vue-maps/packages/vue/examples/reactive-google-map-nuxt?file=/pages/index.vue) with Nuxt.js.

#### Basic Usage

```html
    <reactive-google-map
        componentId="MapUI" 
        dataField="location" 
    />
```

#### Usage With All Props

```html
<reactive-google-map
	componentId="MapUI"
	dataField="location"
	:size="10"
	:defaultZoom="13"
	:defaultCenter="{ lat: 37.74, lng: -122.45 }"
    :defaultRadius="200"
    :unit="mi"
	:showMarkerClusters="true"
	:showSearchAsMove="true"
	:searchAsMove="true"
    :autoCenter="true"
    :pagination="true"
	:react="{
		and: 'CitySensor',
	}"
/>
```

### Props

-   **componentId** `String`
    unique identifier of the component, can be referenced in other components' `react` prop.
-   **dataField** `String`
    DB data field to be connected to the component's UI view, usually of a [geopoint](https://www.elastic.co/guide/en/elasticsearch/reference/current/geo-point.html) (i.e. location) data type and used for rendering the markers on the map.
-   **size** `Number` [optional]
    number of results to show in the map view, can be a number in the range [1, 1000]. Defaults to 10.
-   **calculateMarkers** `Function` [optional] The `ReactiveGoogleMap` component uses the 
    ElasticSearch `hits` to render the markers, if you wish to override the default markers then `calculateMarkers` prop is the way.
    The `calculateMarkers` function accepts an object with following properties:
    - `data`, parsed hits data
    - `rawData`, Elasticsearch raw response

    The function must return an array of markers where each marker must have the following properties:
    - `_id`, unique identifier for each marker
    - [dataField], location object with `lat` and `lng` values.

    > Note: The `dataField` key should be similar to the `dataField` prop defined for the `ReactiveGoogleMap` component. For example, if your `dataField` name is `location` then the marker object would look like below:
    ```js
    {
        "_id": "xyz",
        "location": {
            lat: 37.7749,
            lng: 122.4194,
        }
    }
    ```
    You can check the following example that uses the Elasticsearch aggregations to render the markers.
    https://codesandbox.io/s/github/appbaseio/reactivesearch/tree/vue-maps/packages/vue/examples/reactive-google-map-aggregations?file=/src/App.vue
-   **clusterProps** `Object` [optional] can be used to bind the properties to the Google 
    Maps Cluster object. It supports the following properties:
    - *maxZoom* `Number`
    - *batchSizeIE* `Number`
    - *calculator* `Function`
    - *enableRetinaIcons* `Boolean`
    - *gridSize*  `Boolean`
    - *averageCenter* `Boolean`
    - *ignoreHidden* `Boolean`
    - *imageExtension* `Boolean`
    - *imagePath* `String`
    - *imageSizes* `Array`
    - *minimumClusterSize* `Number`
    - *clusterClass* `String`
    - *styles* `Array`
    - *zoomOnClick* `Boolean` 
-   **defaultZoom** `Number` [optional]
    preset map's zoom level, accepts integer values between [0, 20]. 0 is the minimum zoom level, where you can see the entire globe. 20 is the maximum zoom level. Defaults to 13.
-   **defaultCenter** `Object` [optional]
    preset map's center position by specifying an object with valid `lat` and `lng` values. This prop, when set, will cause the component to run a geo-distance query with a distance of 10mi (Refer: `defaultRadius` and `unit` prop to configure the distance).
-   **defaultQuery** `Function` [optional]
    applies a default query to the map component. This query will be run when no other components are being watched (via React prop), as well as in conjunction with the query generated from the React prop. The function should return a query.
    Read more about it [here](/docs/reactivesearch/v3/advanced/customqueries/#when-to-use-default-query).
    The following example uses the `defaultQuery` with `calculateMarkers` to display the markers using Elasticsearch `aggregations` instead of `hits`.
    https://codesandbox.io/s/github/appbaseio/reactivesearch/tree/vue-maps/packages/vue/examples/reactive-google-map-aggregations?from-embed=&file=/src/App.vue
    The following example changes the `defaultQuery` whenever the zoom value changes.
    https://codesandbox.io/s/github/appbaseio/reactivesearch/tree/vue-maps/packages/vue/examples/reactive-google-map-default-query?from-embed=&file=/src/App.vue
-   **center** `Object` [optional]
    set map's center position by specifying an object with valid `lat` and `lng` values. This prop, when set, will cause the component to run a geo-distance query with a distance of 10mi (Refer: `defaultRadius` and `unit` prop to configure the distance).
-   **defaultRadius** `Number` [optional]
    used as distance value for the geo-distance query when `defaultCenter` or `center` is set. It accepts all positive integers.
-   **unit** `String` [optional]
    unit for distance measurement, uses `mi` (for miles) by default. Distance units can be specified from the following:
    ![screenshot](https://i.imgur.com/STbeagk.png)
-   **showMarkers** `Boolean` [optional]
    whether to show the markers on the map, defaults to `true`. Sometimes, it doesn't make sense to display markers (when building a heatmap or weather map or a directions navigation map)
-   **defaultPin** `String` [optional]
    URL of the default marker pin image to be shown. It comes with a default image. Should only be set if you wish to use a custom marker.
-   **showMarkerClusters** `Boolean` [optional]
    whether to aggregate and form a cluster of nearby markers. Defaults to `true`.

> Note
>
> 1. It requires `showMarkers` prop enabled.
> 2. You have to define the [m1-m5] cluster images at `public/images` folder. Please check this [example](https://codesandbox.io/s/github/appbaseio/reactivesearch/tree/vue-maps/packages/vue/examples/reactive-google-map?from-embed=&file=/src/main.js).

-   **showSearchAsMove** `Boolean` [optional]
    whether to show the _Search As I Move_ checkbox in the UI. Defaults to `true`.
-   **searchAsMove** `Boolean` [optional]
    whether to set the _Search As I Move_ checkbox. Defaults to `false`.
-   **searchAsMoveLabel** `String` [optional]
    allows to customize the default text for search as move button
-   **autoClosePopover** `Boolean` [optional]
    automatically closes the existing open popovers when a new marker is clicked. Defaults to `false`.
-   **react** `Object` [optional]
    specify dependent components to reactively update **ReactiveGoogleMap's** options. Read more about it [here](/docs/reactivesearch/v3/advanced/reactprop/).
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
-   **className** `String` [optional]
    CSS class to be injected on the component container.
-   **style** `Object` [optional]
    CSS style object to be applied to the `ReactiveGoogleMap` component.
-   **pagination** `Boolean` [optional]
    When set to `true`, a pagination based list view with page numbers will appear.
-   **renderItem** `Function|slot-scope` [optional]
    useful to customize the markers. It can be defined as a `Function` or slot.
    The following example would render the marker with a label.

    ```html
    <reactive-google-map
        :renderItem="result => ({
            label: result.title,
        })"
    />
    ```

    The following example would render the marker with an icon.
     ```html
    <reactive-google-map
        :renderItem="result => ({
            icon: 'https://i.imgur.com/NHR2tYL.png',
        })"
    />
    ```

    The following example uses the `slot` to customize the marker.
    ```html
    <reactive-google-map>
        <div slot="renderItem" slot-scope="{ magnitude }">
            {{result.mag}}
        </div>
    </reactive-google-map>
    ```
-   **renderPopover** `slot-scope` [optional]
    It is useful to render the popover content when a marker is clicked. The slot data would be an object with the following properties:
    - **item** represents the marker data
    - **handleClose** useful to close the popover programmatically

    
    The following example displays the `title` and `description` in popover.

    ```html
    <reactive-google-map>
        <div slot="renderPopover" slot-scope="{ item }">
           <div>{{ item.title }}</div>
           <p>{{ item.description }}</p>
        </div>
    </reactive-google-map>
    ```
-   **renderClusterPopover** `slot-scope` [optional]
    It is useful to render the popover content when a cluster is clicked. The slot data would be an object with the following properties:
    - **markers** An array of markers for the selected cluster
    - **cluster** Cluster reference object
    - **handleClose** useful to close the popover programmatically

    The following example displays the `markers` information for a particular cluster.

    ```html
    <reactive-google-map>
        <div slot="renderClusterPopover" slot-scope="{ markers, cluster }">
           <pre>{{ JSON.stringify(markers, null, 2) }}</pre>
        </div>
    </reactive-google-map>
    ```
    ![alt cluster](https://i.imgur.com/e1JwXOi.jpg)
-   **render** `slot-scope` [optional]
    The `render` slot can be used to render the results in a list based UI.
    <br/>
    It accepts an object with these properties:
    -   **`loading`**: `boolean`
        indicates that the query is still in progress
    -   **`error`**: `object`
        An object containing the error info
    -   **`data`**: `array`
        An array of results obtained from combining `stream` and `promoted` results along with the `hits` .
    -   **`promotedData`**: `array`
        An array of promoted results obtained from the applied query. [Read More](/docs/search/rules/)
        > Note:
        >
        > `data`, `streamData` and `promotedData` results has a property called `_click_id` which can be used with triggerClickAnalytics to register the click analytics info.
    -   **`customData`** `object`
        Custom data set in the query rule when appbase.io is used as backend. [Read More](/docs/search/rules/#custom-data)
    -   **`rawData`** `object`
        An object of raw response as-is from elasticsearch query.
    -   **`resultStats`**: `object`
        An object with the following properties which can be helpful to render custom stats:
        -   **`numberOfResults`**: `number`
            Total number of results found
        -   **`numberOfPages`**: `number`
            Total number of pages found based on current page size
        -   **`currentPage`**: `number`
            Current page number for which data is being rendered
        -   **`time`**: `number`
            Time taken to find total results (in ms)
        -   **`displayedResults`**: `number`
            Number of results displayed in current view
        -   **`hidden`**: `number`
            Total number of hidden results found
        -   **`promoted`**: `number`
            Total number of promoted results found
    -   **`loadMore`**: `function`
        A callback function to be called to load the next page of results into the view.
    -   **`triggerClickAnalytics`**: `function`
        A function which can be called to register a click analytics. [Read More](/docs/reactivesearch/vue/advanced/analytics/)
    -   **`setPage`**: `function`
        A function which will allow to dispatch a page change event when using custom pagination. It accepts `pageNumber` as its parameter.

    ```html
    <reactive-google-map>
        <div slot="render" slot-scope="{ loading, error, data }">
            <div v-if="loading">Fetching Results.</div>
            <div v-if="Boolean(error)">Something went wrong! Error details {{JSON.stringify(error)}}</div>
            <ul v-bind:key="result._id" v-for="result in data">
                <li>
                    {{result.title}}
                    <!-- Render UI -->
                </li>
            </ul>
        </div>
    </reactive-google-map>
    ```
-   **renderError** `String|Function|slot-scope` [optional]
    can be used to render an error message in case of any error.

    ```html
    <template slot="renderError" slot-scope="error">
        <div>Something went wrong!<br />Error details<br />{{ error }}</div>
    </template>
    ```

## Demo

<br />

<iframe src="https://codesandbox.io/s/github/appbaseio/reactivesearch/tree/vue-maps/packages/vue/examples/reactive-google-map?from-embed=&file=/src/App.vue" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Styles

`ReactiveGoogleMap` component supports `innerClass` prop with the following keys:

-   `checkboxContainer`
-   `checkbox`
-   `label`

## Events

-   **queryChange**
    is an event which accepts component's **prevQuery** and **nextQuery** as parameters. It is called everytime the component's query changes. This event is handy in cases where you want to generate a side-effect whenever the component's query would change.

-   **pageClick**
    accepts a function which is invoked with the updated page value when a pagination button is clicked. For example if 'Next' is clicked with the current page number as '1', you would receive the value '2' as the function parameter.

-   **data** `Function` [optional]
    gets triggered after data changes, which returns an object with these properties: `data`,`promotedData`, `rawData`, `customData` & `resultStats`.

-   **error**
    gets triggered in case of an error and provides the `error` object, which can be used for debugging or giving feedback to the user if needed.

-   **zoom-changed**
    called whenever map zoom gets changed

-   **drag-end**
    gets triggered when map drag ends

-   **idle**
    gets called when map is in idle position

-   **open-marker-popover**
    gets called when marker popover gets opened or marker is clicked

-   **close-marker-popover**
    gets called when marker popover is closed

-   **open-cluster-popover**
    gets called when cluster popover gets opened or cluster is clicked

-   **close-cluster-popover**
    gets called when cluster popover is closed

-   **search-as-move**
    gets called whenever _Search As I Move_ checkbox is clicked. It returns the `checked` state of the _Search As I Move_ checkbox.
## Extending 

`ReactiveGoogleMap` component can be extended to

1. customize the look and feel with `className` and `style` props,
2. render the results in a customized view using `render` slot.
3. customize the markers using `renderItem` slot.
4. customize popover content using `renderPopover` slot.
5. get the google map reference using `refs`. The `getMapRef` method of `ReactiveGoogleMap` component would return the map ref.

## Examples

<a href="https://deploy-preview-31--reactivesearch-vue-playground.netlify.app/?path=/story/map-components-reactivegooglemap--basic" target="_blank">ReactiveGoogleMap with all the default props</a>
