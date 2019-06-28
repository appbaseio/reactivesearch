---
title: 'GeoDistanceDropdown'
meta_title: 'GeoDistanceDropdown'
meta_description: '`GeoDistanceDropdown` creates a location search based dropdown UI component that is connected to a database field. It is used for distance based filtering.'
keywords:
    - reactivesearch
    - geodistancedropdown
    - appbase
    - elasticsearch
sidebar: 'web-reactivesearch'
---

![Image to be displayed](https://i.imgur.com/zRnIUWY.png)

`GeoDistanceDropdown` creates a location search based dropdown UI component that is connected to a database field. It is used for distance based filtering.

Example uses:

-   finding restaurants in walking distance from your location.
-   discovering things to do near a landmark.

## Usage

### Basic Usage

```js
<GeoDistanceDropdown
	componentId="LocationUI"
	dataField="location"
	data={[
		{ distance: 20, label: '< 20 miles' },
		{ distance: 50, label: '< 50 miles' },
		{ distance: 100, label: '< 100 miles' },
	]}
/>
```

### Usage With All Props

```js
<GeoDistanceDropdown
  componentId="locationUI"
  dataField="location"
  title="Location Dropdown Selector"
  data={
    [
      { "distance": 20, "label": "< 20 miles" },
      { "distance": 50, "label": "< 50 miles" },
      { "distance": 100, "label": "< 100 miles" },
    ]
  }
  defaultValue={{
    location: "London, UK"
    label: "< 100 miles"
  }}
  countries={["uk"]}
  placeholder="Select a distance range.."
  unit="mi"
  autoLocation={true}
  showFilter={true}
  filterLabel="Location"
  URLParams={false}
/>
```

## Props

-   **componentId** `String`
    unique identifier of the component, can be referenced in other components' `react` prop.
-   **dataField** `String`
    data field to be connected to the component's UI view.
-   **nestedField** `String` [optional]
    use to set the `nested` mapping field that allows arrays of objects to be indexed in a way that they can be queried independently of each other. Applicable only when dataField is a part of `nested` type.
-   **data** `Object Array`
    collection of UI `labels` with associated `distance` value.
-   **title** `String or JSX` [optional]
    title of the component to be shown in the UI.
-   **defaultValue** `Object` [optional]
    pre-select values of the search query with `label` and `location` keys.
-   **placeholder** `String` [optional]
    set the placeholder to show in the location search box, useful when no option is `defaultValue`.
-   **value** `Object` [optional]
    controls the current value of the component. It sets the item from the list & also sets the location (on mount and on update). Use this prop in conjunction with `onChange` function.
-   **onChange** `function` [optional]
    is a callback function which accepts component's current **value** as a parameter. It is called when you are using the `value` prop and the component's value changes. This prop is used to implement the [controlled component](https://reactjs.org/docs/forms.html#controlled-components) behavior.
-   **showIcon** `Boolean` [optional]
    whether to display a search or custom icon in the input box. Defaults to `true`.
-   **iconPosition** `String` [optional]
    sets the position of the search icon. Can be `left` or `right`. Defaults to `right`.
-   **icon** `JSX` [optional]
    displays a custom search icon instead of the default 🔍
-   **unit** `String` [optional]
    unit for distance measurement, uses `mi` (for miles) by default. Distance units can be specified from the following:
    ![screenshot](https://i.imgur.com/STbeagk.png)
-   **autoLocation** `Boolean` [optional]
    when enabled, preset the user's current location in the location search box. Defaults to `true`.
-   **showFilter** `Boolean` [optional]
    show as filter when a value is selected in a global selected filters view. Defaults to `true`.
-   **filterLabel** `String` [optional]
    An optional label to display for the component in the global selected filters view. This is only applicable if `showFilter` is enabled. Default value used here is `componentId`.
-   **URLParams** `Boolean` [optional]
    enable creating a URL query string parameter based on the selected value from the dropdown. This is useful for sharing URLs with the component state. Defaults to `false`.
-   **countries** `String Array` [optional]
    restricts predictions to specified country (ISO 3166-1 Alpha-2 country code, case insensitive). For example, 'us', 'in', or 'au'. You can provide an array of up to five country code strings.

## Demo

<br />

<iframe height='500' scrolling='no' title='GeoDistanceDropdown Example' src='//codepen.io/dhruvdutt/embed/qYEmqp/?height=500&theme-id=light&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/dhruvdutt/pen/qYEmqp/'>GeoDistanceDropdown Example</a> by Dhruvdutt Jadhav (<a href='https://codepen.io/dhruvdutt'>@dhruvdutt</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Styles

`GeoDistanceDropdown` component supports `innerClass` prop with the following keys:

-   `title`
-   `input`
-   `list`
-   `select`
-   `icon`
-   `count`

Read more about it [here](/theming/class.html).

## Extending

`GeoDistanceDropdown` component can be extended to

1. customize the look and feel with `className`, `style`,
2. update the underlying DB query with `customQuery`,
3. connect with external interfaces using `beforeValueChange`, `onValueChange` and `onQueryChange`.
4. specify how options should be filtered or updated using `react` prop.
5. add the following [synthetic events](https://reactjs.org/events.html) to the underlying `input` element:
    - onBlur
    - onFocus
    - onKeyPress
    - onKeyDown
    - onKeyUp
    - autoFocus

```js
<GeoDistanceDropdown
  ...
  className="custom-class"
  style={{"paddingBottom": "10px"}}
  customQuery={
    function(location, distance, props) {
      return {
        // query in the format of Elasticsearch Query DSL
        geo_distance: {
          distance: distance + props.unit,
          location_dataField: location
        }
      }
    }
  }
  beforeValueChange={
    function(value) {
      // called before the value is set
      // returns a promise
      return new Promise((resolve, reject) => {
        // update state or component props
        resolve()
        // or reject()
      })
    }
  }
  onValueChange={
    function(value) {
      console.log("current value: ", value)
      // set the state
      // use the value with other js code
    }
  }
  onQueryChange={
    function(prevQuery, nextQuery) {
      // use the query with other js code
      console.log('prevQuery', prevQuery);
      console.log('nextQuery', nextQuery);
    }
  }
/>
```

-   **className** `String`
    CSS class to be injected on the component container.
-   **style** `Object`
    CSS styles to be applied to the **GeoDistanceDropdown** component.
-   **customQuery** `Function`
    takes **location**, **distance** and **props** as parameters and **returns** the data query to be applied to the component, as defined in Elasticsearch Query DSL.<br/>
    `Note:` customQuery is called on value changes in the **GeoDistanceDropdown** component as long as the component is a part of `react` dependency of at least one other component.
-   **beforeValueChange** `Function`
    is a callback function which accepts component's future **value** as a parameter and **returns** a promise. It is called every time before a component's value changes. The promise, if and when resolved, triggers the execution of the component's query and if rejected, kills the query execution. This method can act as a gatekeeper for query execution, since it only executes the query after the provided promise has been resolved.
-   **onValueChange** `Function`
    is a callback function which accepts component's current **value** as a parameter. It is called every time the component's value changes. This prop is handy in cases where you want to generate a side-effect on value selection. For example: You want to show a pop-up modal with the valid discount coupon code when a user searches within a specific location area.
-   **onQueryChange** `Function`
    is a callback function which accepts component's **prevQuery** and **nextQuery** as parameters. It is called everytime the component's query changes. This prop is handy in cases where you want to generate a side-effect whenever the component's query would change.
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

## Examples

<a href="https://opensource.appbase.io/playground/?selectedKind=Map%20Components%2FGeoDistanceDropdown&selectedStory=Basic&full=0&addons=1&stories=1&panelRight=0&addonPanel=storybooks%2Fstorybook-addon-knobs" target="_blank">GeoDistance Dropdown with all the default props</a>
