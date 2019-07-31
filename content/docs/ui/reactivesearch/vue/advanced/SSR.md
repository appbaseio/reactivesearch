---
title: 'Server Side Rendering'
meta_title: 'Server Side Rendering'
meta_description: 'Server Side Rendering enables us to pre-render the results on the server enabling better SEO for the app, and faster delivery of relevant results on an initial render to the users.'
keywords:
    - reactivesearch
    - ssr
    - appbase
    - elasticsearch
sidebar: 'vue-reactivesearch'
---

Server Side Rendering enables us to pre-render the results on the server enabling better SEO for the app, and faster delivery of relevant results on an initial render to the users.

Reactivesearch internally runs on a redux store. With Server Side Rendering, you can handle the intial render when a user (or search engine crawler) first requests your app. To achieve the relevant results on an initial render, we need to pre-populate the redux store of ReactiveSearch.

ReactiveSearch offers SSR via `initReactivesearch()` method which takes three params:

-   an array of all components (with their set of props) we wish to render at the server side
-   url params
-   base component (reactivebase) props

## Usage

This is a three-steps process:

First, import `initReactivesearch`:

```js
<script>import {initReactivesearch} from '@appbaseio/reactivesearch-vue';</script>
```

Then, evaluate the initial state:

```js
const initialState = await initReactivesearch(...);
```

and finally, pass the computed initial state to `ReactiveBase` component.

```js
<template>
	<reactive-base v-bind="settings" :initialState="initialState">
    ...
	</reactive-base>
</template>
```

## Example

We will build a simple booksearch app with `nuxt.js` as an example to get started with:

### Pre-requisites

Set up `nuxt.js` - [Refer docs here](https://nuxtjs.org/guide/installation)

### Installation

Use the package manager of your choice to install `reactivesearch`:

```
yarn add @appbaseio/reactivesearch-vue
```

### Setup

Create an `index.js` file in the `pages` directory, and import `initReactivesearch`:

```js
<script>import {initReactivesearch} from '@appbaseio/reactivesearch-vue';</script>
```

and we will also import the other relevant component from the reactivesearch library:

```js
<script>
	import {
		ReactiveBase,
		DataSearch,
		SelectedFilters,
		ReactiveList,
} from '@appbaseio/reactivesearch';
</script>
```

Set the props for all the components we are going to use:

```js
<script>
	const settings = {
		app: 'good-books-ds',
		credentials: 'nY6NNTZZ6:27b76b9f-18ea-456c-bc5e-3a5263ebc63d',
	};

	const dataSearchProps = {
		dataField: ['original_title', 'original_title.search'],
		categoryField: 'authors.raw',
		componentId: 'BookSensor',
		defaultSelected: 'Harry',
	};

	const reactiveListProps = {
		componentId: 'SearchResult',
		dataField: 'original_title.raw',
		from: 0,
		size: 5,
		renderData: ({ data }) => `<div>${data.original_title}</div>`,
		react: {
			and: ['BookSensor'],
		},
	};
</script>
```

Next step is to evaluate the initial state in the `asyncData` lifecycle method:

```js
<template>
	<reactive-base v-bind="settings" :initialState="initialState">
			<div className="row">
				<div className="col">
					<data-search v-bind="dataSearchProps" />
				</div>

				<div className="col">
					<selected-filters />
					<reactive-list v-bind="reactiveListProps" />
				</div>
			</div>
	</reactive-base>
</template>
<script>
	export default {
		name: 'app',
		data: function() {
			return {
				settings,
				dataSearchProps,
				reactiveListProps
			};
		},
		async asyncData() {
			try {
				const initialState = await initReactivesearch(
					[
						{
							...dataSearchProps,
							source: DataSearch,
						},
						{
							...reactiveListProps,
							source: ReactiveList,
						},
					],
					null,
					settings,
				);
				return {
					initialState,
					error: null,
				};
			} catch (error) {
				return {
					initialState: null,
					error,
				};
			}
		},
	};
</script>
```

Finally, you can now run the dev server and catch the SSR in action.

## Example apps

You can check an example app here:

-   [Components SSR demo with Nuxt.js](https://github.com/appbaseio/reactivesearch/tree/next/packages/vue/examples/with-ssr)
