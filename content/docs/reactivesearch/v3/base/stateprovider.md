---
title: 'StateProvider'
meta_title: 'StateProvider'
meta_description: 'StateProvider allows you to access the current state of your components along with the search results.'
keywords:
    - reactivesearch
    - stateprovider
    - appbase
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'web-reactivesearch'
---

`StateProvider` component allows you to access the current state of your components along with the search results. For instance, you can use this component to create results/no results or query/no query pages.

## Usage

### Basic Usage

```jsx
<StateProvider
	render={({ searchState }) => <div>Search State: ${JSON.stringify(searchState)}</div>}
/>
```

or

```jsx
<StateProvider>
	{({ searchState }) => <div>Search State: ${JSON.stringify(searchState)}</div>}
</StateProvider>
```

### Props

-   **componentIds** `string|string[]` [optional]
    By default `StateProvider` watches the state of all the components, you can restrict this behavior by defining the component id(ids) for which you want to listen for.

<div class="warning">

> Note
>
> You can avoid the unnecessary re-renders of `StateProvider` component by defining the componentIds.

</div>

-   **strict** `boolean` [optional] (defaults to `true`)
    `StateProvider` uses the `shouldComponentUpdate` internally to avoid the extra re-renders, you can always by pass it by setting the value of `strict` prop as `false`.

> Note
>
> This props is important when someone is using the React `state` inside the `StateProvider`.

-   **render**
    A function returning the UI you want to render based on your results. This function receives a list of parameters and expects to return a `JSX`.

It accepts an object with these properties:<br/>

**`searchState`**: `object`<br/>
It returns an object with component id as key and state as value.<br/>
For example:

```json
 {
  	BooksSearch: {
		title: 'Search',
		value: 'A song of Ice and Fire',
		dataField: ["original_title", "original_title.search"],
		URLParams: false,
		autosuggest: false,
		componentType: "DATASEARCH",
		filterLabel: "search",
		placeholder: "Search for a book title or an author",
		queryFormat: "and",
		hits: [],
		isLoading: false,
		error: null,
  	},
  	RatingsFilter: {
		URLParams: false,
		componentType: "SINGLERANGE",
		dataField: "average_rating_rounded",
		filterLabel: "Ratings",
		query: {
			bool: {
				… // query
			}
		},
		react: {
			and: "BooksSearch"
		},
		showFilter: true,
		showRadio: true,
		size: 20,
		title: "Ratings",
		value: {
			start: 4,
			end: 5,
			label: "★★★★ & up"
		},
		aggregations: [],
		hits: [],
		isLoading: false,
		error: null
  	}
 }
```
