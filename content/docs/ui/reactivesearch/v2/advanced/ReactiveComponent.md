---
title: 'Reactive Component'
meta_title: 'Reactive Component'
meta_description: 'With `ReactiveComponent`, you can convert any React Component into a Reactivesearch component.'
keywords:
    - reactivesearch
    - reactivecomponent
    - appbase
    - elasticsearch
sidebar: 'web-v2-reactivesearch'
---

We have built this library keeping you, the developer, in mind. If you're here, it is obvious that you want to create a custom component that is reactive in nature. Perhaps, you already have a component in your design kit and want it to work seamlessly with Reactivesearch.

With `ReactiveComponent`, you can convert any React Component into a Reactivesearch component i.e. your react component will be able to talk to other Reactivesearch components and connect with your elasticsearch cluster seamlessly.

> How does this work?
>
> `ReactiveComponent` is a wrapper component that allows you to connect custom component(s) (passed as children) with the Reactivesearch ecosystem.

### Usage

For example, let's suppose that we are building an e-commerce store where we have a react component called `ColorPicker` which renders the `colors` passed to it as tiles, allowing us to filter the products by their colors.

![ColorPicker](https://i.imgur.com/wuKhCTT.png)

```javascript{2}
<ColorPicker
    colors={['#000', '#666', '#fff']}
    onChange={this.handleColorChange}
>
```

Now, let's assume that we have all these hex-codes stored as `keywords` in an Elasticsearch index. To display each unique color tile, we can run a `terms` aggregations query. The `defaultQuery` prop of ReactiveComponent allows us to do this and pass the results to a child component.

```javascript
<ReactiveComponent
	componentId="myColorPicker" // a unique id we will refer to later
	defaultQuery={() => ({
		aggs: {
			color: {
				terms: {
					field: 'color',
				},
			},
		},
	})}
>
	<ColorPickerWrapper />
</ReactiveComponent>
```

The above snippet runs the `defaultQuery` passed to the ReactiveComponent when the component gets mounted and consequently pass the query results to the `ColorPickerWraper` component (i.e. child component of ReactiveComponent) as the following two props: `hits` and `aggregations`.

```javascript
class ColorPickerWrapper extends React.Component {
	render() {
		let colors = [];

		if (
			// checking for when component gets the aggregation results
			this.props.aggregations &&
			this.props.aggregations.colors &&
			this.props.aggregations.colors.buckets.length
		) {
			colors = this.props.aggregations.map(color => color.key);
		}

		return (
			<ColorPicker
				colors={colors}
				onChange={() => {
					// handles color change
					// we will define this in the next step
				}}
			/>
		);
	}
}
```

Up until this point, we have figured out how to display the colored tiles by running an Elasticsearch query and passing the results to our `ColorPickerWrapper` component.

But we also need to be able to filter the products by a color tile when selected by the end-user. This is where `setQuery()` prop comes in handy. It takes an object param of shape:

```javascript
{
    query: {},
    value: ''
}
```

where,

-   **query** - is the query of the component,
-   **value** - can be an array, string or number (This will be shown in selected filters and URLParams if active. In our case, this is the hex-code of the selected color tile)

In our current example, we would simply have to call `this.props.setQuery()` with the updated query and value of the component:

```javascript{17-28}
class ColorPickerWrapper extends React.Component {
	render() {
		let colors = [];

		if (
			// checking for when component gets the aggregation results
			this.props.aggregations &&
			this.props.aggregations.colors &&
			this.props.aggregations.colors.buckets.length
		) {
			colors = this.props.aggregations.map(color => color.key);
		}

		return (
			<ColorPicker
				colors={colors}
				onChange={newColor => {
					// handles color change
					const query = {
						query: {
							term: { color: newColor },
						},
					};

					this.props.setQuery({
						query,
						value: newColor,
					});
				}}
			/>
		);
	}
}
```

Now, the components which will have `myColorPicker` present in their `react` prop can react to the changes in the ColorPicker component based on the query passed to the setQuery method. You can check a [similar example implementation here](https://github.com/appbaseio/reactivesearch/blob/dev/packages/web/examples/ReactiveComponent/src/index.js).

### Props

#### Child Component

-   **hits** `Array`
    `hits` prop is an array of results from the Elasticsearch query of the component.
-   **aggregations** `Object`
    `aggregations` prop contains the results from `aggs` Elasticsearch query of the component.
-   **setQuery** `function`
    `setQuery` function sets the query of the component. It takes an object param of shape:

```javascript
    {
        query: {}, // query of the component
        value: ''  // value of the component
    }
```

-   **selectedValue** `any`
    `selectedValue` contains the current value of the component (which can be set via `setQuery()` function). This is used for URLParams and SelectedFilters.
-   **isLoading** `Boolean`
    `true` means the query is in the execution state.

#### ReactiveComponent

-   **className** `String`
    CSS class to be injected on the component container.
-   **style** `Object`
    CSS styles to be applied to the **DataSearch** component.
-   **defaultQuery** `Function`
    **returns** the default query to be applied to the component, as defined in Elasticsearch Query DSL.
-   **onQueryChange** `Function`
    is a callback function which accepts component's **prevQuery** and **nextQuery** as parameters. It is called everytime the component's query changes. This prop is handy in cases where you want to generate a side-effect whenever the component's query would change.
-   **onAllData** `Function`
    callback function which provides `hits` and `aggregations` as function params.
-   **showFilter** `Boolean` [optional]
    show as filter when a value is selected in a global selected filters view. Defaults to `true`.
-   **filterLabel** `String` [optional]
    An optional label to display for the component in the global selected filters view. This is only applicable if `showFilter` is enabled. Default value used here is `componentId`.
-   **react** `Object`
    `react` prop is available in components whose data view should reactively update when on or more dependent components change their states, e.g. [`ReactiveMap`](/map-components/reactivemap.html), [`ReactiveList`](/basic-components/reactivelist.html).

    -   **key** `String`
        one of `and`, `or`, `not` defines the combining clause.
        -   **and** clause implies that the results will be filtered by matches from **all** of the associated component states.
        -   **or** clause implies that the results will be filtered by matches from **at least one** of the associated component states.
        -   **not** clause implies that the results will be filtered by an **inverse** match of the associated component states.
    -   **value** `String or Array or Object`
        -   `String` is used for specifying a single component by its `componentId`.
        -   `Array` is used for specifying multiple components by their `componentId`.
        -   `Object` is used for nesting other key clauses.

-   **URLParams** `Boolean` [optional]
    enable creating a URL query string parameter based on the selected value of the list. This is useful for sharing URLs with the component state. Defaults to `false`.

### Examples

<br />

<iframe src="https://codesandbox.io/embed/github/appbaseio/reactivesearch/tree/dev/packages/web/examples/ReactiveComponent" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

See storybook for ReactiveComponent on playground.

<a href="https://opensource.appbase.io/playground/?selectedKind=Base%20components%2FReactiveComponent&selectedStory=A%20custom%20component" target="_blank">A custom component using ReactiveComponent</a>
