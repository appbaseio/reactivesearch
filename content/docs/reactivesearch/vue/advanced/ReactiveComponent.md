---
title: 'Reactive Component'
meta_title: 'Reactive Component'
meta_description: 'With `ReactiveComponent`, you can convert any React Component into a Reactivesearch component.'
keywords:
    - reactivesearch
    - reactivecomponent
    - appbase
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'vue-reactivesearch'
---

We have built this library keeping you, the developer, in mind. If you're here, it is obvious that you want to create a custom component that is reactive in nature. Perhaps, you already have a component in your design kit and want it to work seamlessly with Reactivesearch.

With `ReactiveComponent`, you can convert any Vue Component into a Reactivesearch component i.e. your vue component will be able to talk to other Reactivesearch components and connect with your elasticsearch cluster seamlessly.

> How does this work?
>
> `ReactiveComponent` is a wrapper component that allows you to connect custom component(s) (passed as children) with the Vue ecosystem.

### Usage with defaultQuery

For example, let's suppose that we are building an e-commerce store where we have a react component called `ColorPicker` which renders the `colors` passed to it as tiles, allowing us to filter the products by their colors.

![ColorPicker](https://i.imgur.com/wuKhCTT.png)

<!-- prettier-ignore -->
```html
<color-picker 
    :colors="['#000', '#666', '#fff']" 
    @change="handleColorChange">
</color-picker>
```

Now, let's assume that we have all these hex-codes stored as `keywords` in an Elasticsearch index. To display each unique color tile, we can run a `terms` aggregations query. The `defaultQuery` prop of ReactiveComponent allows us to do this and pass the results to a child component.

<!-- prettier-ignore -->
```html
<template>
	<reactive-component 
        componentId="myColorPicker" 
        :defaultQuery="defaultQuery"
    >
		<div slot-scope="{ aggregations, hits, setQuery }">
			<color-picker-wrapper 
                :aggregations="aggregations" 
                :hits="hits" 
                :setQuery="setQuery" 
            />
		</div>
	</reactive-component>
</template>
<script>
	export default {
		name: 'app',
		methods: {
			defaultQuery() {
				return {
					aggs: {
						color: {
							terms: {
								field: 'color',
							},
						},
					},
				};
			},
		},
	};
</script>
```

The above snippet runs the `defaultQuery` passed to the ReactiveComponent when the component gets mounted and consequently pass the query results to the `ColorPickerWraper` component (i.e. child component of ReactiveComponent) as the following props: `hits`, `aggregationData` and `aggregations`.

<!-- prettier-ignore -->
```html
<template>
    <div v-if="colors">
        <color-picker 
            colors="colors" 
            @change="handleColorChange" 
        />
    </div>
</template>
<script>
	export default {
		props: {
			aggregations: Object,
		},
        methods: {
            handleColorChange() {...}
        },
		computed: {
			colors: () => {
				let colors = [];
				if (
					// checking for when component gets the aggregation results
					this.$props.aggregations &&
					this.$props.aggregations.colors &&
					this.$props.aggregations.colors.buckets.length
				) {
					colors = this.$props.aggregations.map(color => color.key);
				}
				return colors;
			},
		},
	};
</script>
```

Up until this point, we have figured out how to display the colored tiles by running an Elasticsearch query and passing the results to our `ColorPickerWrapper` component.

But we also need to be able to filter the products by a color tile when selected by the end-user. This is where `setQuery()` prop comes in handy. It takes an object param of shape:

```javascript
    {
        query: {}, // query of the component
		value: '',  // value of the component
		options: {}, // query options for e.g size, timeout & includeFields etc.
    }
```

where,

-   **query** - is the query of the component,
-   **value** - can be an array, string or number (This will be shown in selected filters and URLParams if active. In our case, this is the hex-code of the selected color tile)

In our current example, we would simply have to call `this.$props.setQuery()` with the updated query and value of the component:

<!-- prettier-ignore -->
```html
<template>
	<div v-if="colors">
		<color-picker 
            colors="colors" 
            @change="onChange" 
        />
	</div>
</template>
<script>
	export default {
		props: {
			aggregations: Object,
			setQuery: Function,
		},
		methods: {
			onChange(newColor) {
				// handles color change
				const query = {
					query: {
						term: { color: newColor },
					},
				};

				this.$props.setQuery({
					query,
					value: newColor,
				});
			},
		},
		computed: {
			colors: () => {
				let colors = [];
				if (
					// checking for when component gets the aggregation results
					this.$props.aggregations &&
					this.$props.aggregations.colors &&
					this.$props.aggregations.colors.buckets.length
				) {
					colors = this.$props.aggregations.map(color => color.key);
				}
				return colors;
			},
		},
	};
</script>
```

###Usage with customQuery
Let's suppose - we are building an e-commerce store for cars which displays a list of cars of a particular brand on their separate page as `example.com/cars/Ford`. Now, we want all the filters on that page (like pricing, type of car, model, year, etc) to only show the data relevant to the given brand (i.e. `Ford`). In this case, `ReactiveComponent` can be used with `customQuery` to achieve the desired behavior easily.

We can then use the given ReactiveComponent to be watched by all the filters (via `react` prop) to avail the desired brand based filtering for all the filters.

<!-- prettier-ignore -->
```html
<template>
	<reactive-component
		componentId="CarSensor"
		:defaultQuery="defaultQuery"
		:customQuery="customQuery"
	>
		<div slot-scope="{ aggregations, setQuery }">
			<CustomComponent 
                :aggregations="aggregations" 
                :setQuery="setQuery" 
            />
		</div>
	</reactive-component>
</template>
<script>
	export default {
		name: 'app',
		methods: {
			defaultQuery() {
				return {
					aggs: {
						'brand.keyword': {
							terms: {
								field: 'brand.keyword',
								order: {
									_count: 'desc',
								},
								size: 10,
							},
						},
					},
				};
			},
			customQuery() {
				return { query: { term: { ['brand.keyword']: 'Ford' } } };
			},
		},
	};
</script>
```

### Props

#### Scope Data Object

-   **loading** `boolean`
    indicates that the query is still in progress
-   **error**: `object`
    An object containing the error info
-   **data** `Array`
    `data` prop is an array of parsed results(hits) from the Elasticsearch query of the component.
-   **rawData** `Array`
    `rawData` prop is an array of original results(hits) from the Elasticsearch query of the component.
-   **aggregations** `Object`
    `aggregations` prop contains the results from `aggs` Elasticsearch query of the component.
-   **setQuery** `function`
    `setQuery` function sets the query of the component. It takes an object param of shape:

```javascript
    {
        query: {}, // query of the component
		value: '',  // value of the component
		options: {}, // query options for e.g size, timeout & includeFields etc.
    }
```

-   **selectedValue** `any`
    `selectedValue` contains the current value of the component (which can be set via `setQuery()` function). This is used for URLParams and SelectedFilters.
-   **isLoading** `Boolean`
    `true` means the query is in the execution state.
-   **error** `any`
    contains the error details in case of any error.

#### ReactiveComponent

-   **className** `String`
    CSS class to be injected on the component container.
-   **aggregationField** `String` [optional]
    One of the most important use-cases this enables is showing `DISTINCT` results (useful when you are dealing with sessions, events and logs type data). It utilizes `composite aggregations` which are newly introduced in ES v6 and offer vast performance benefits over a traditional terms aggregation.
    You can read more about it over [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-composite-aggregation.html). You can access `aggregationData` using `slot-scope` as shown:

    <!-- prettier-ignore -->
    ```html
    <reactive-component 
        componentId="myColorPicker" 
        aggregationField="color"
    >
    	<div slot-scope="{ aggregationData, ...rest }">
    		<color-picker-wrapper
    			:aggregationData="aggregationData"
    			:hits="hits"
    			:setQuery="setQuery"
    		/>
    	</div>
    </reactive-component>
    ```

    > If you are using an app with elastic search version less than 6, then defining this prop will result in error and you need to catch this error using **error** event.

    > It is possible to override this query by providing `defaultQuery`.

-   **defaultQuery** `Function`
    **returns** the default query to be applied to the component, as defined in Elasticsearch Query DSL.
-   **react** `Object`
    `react` prop is available in components whose data view should reactively update when on or more dependent components change their states, e.g. [`ReactiveList`](/docs/reactivesearch/vue/result/ReactiveList).

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

## Demo

<br />

<iframe src="https://codesandbox.io/embed/lr707846pl" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Events

-   **queryChange**
    is an event which accepts component's **prevQuery** and **nextQuery** as parameters. It is called everytime the component's query changes. This prop is handy in cases where you want to generate a side-effect whenever the component's query would change.
-   **data** `Function`
    is an event which provides `data`, `rawData`, `aggregationData` and `aggregations` as function params.
-   **error**
    gets triggered in case of an error and provides the `error` object, which can be used for debugging or giving feedback to the user if needed.

## Examples

###With defaultQuery

<iframe src="https://codesandbox.io/embed/lr707846pl" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

###With customQuery

<iframe src="https://codesandbox.io/embed/github/appbaseio/reactivesearch/tree/next/packages/vue/examples/reactive-component-with-custom-query" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

See storybook for ReactiveComponent on playground.

<a href="https://reactivesearch-vue-playground.netlify.com/?selectedKind=Base%20components%2FReactiveComponent&selectedStory=A%20custom%20component&full=0&addons=1&stories=1&panelRight=0" target="_blank">ReactiveComponent with default props</a>
