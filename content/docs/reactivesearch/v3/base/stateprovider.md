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

```js
<StateProvider
	render={({ searchState }) => <div>Search State: ${JSON.stringify(searchState)}</div>}
/>
```

or

```js
<StateProvider>
	{({ searchState }) => <div>Search State: ${JSON.stringify(searchState)}</div>}
</StateProvider>
```

### Props

-   **componentIds** `string|string[]` [optional]
    By default `StateProvider` watches the state of all the components, you can restrict this behavior by defining the component id(ids) for which you want to listen for.

> Note
>
> You can avoid the unnecessary re-renders of `StateProvider` component by defining the componentIds.

-   **strict** `boolean` [optional] (defaults to `true`)
    `StateProvider` uses the `shouldComponentUpdate` internally to avoid the extra re-renders, you can always by pass it by setting the value of `strict` prop as `false`.

> Note
>
> This props is important when someone is using the React `state` inside the `StateProvider`.

-   **render** [optional]
    A function returning the UI you want to render based on your results. This function receives a list of parameters and expects to return a `JSX`.

It accepts an object with these properties:<br/>

**`searchState`**: `object`<br/>
It returns an object with component id as key and state as value.<br/>
For example:

```js
 {
  	BooksSearch: {
		value: 'A song of Ice and Fire',
		hits: [],
		error: null,
  	},
  	RatingsFilter: {
		value: {
			start: 4,
			end: 5,
			label: "★★★★ & up"
		},
		aggregations: [],
		hits: [],
		error: null
  	}
 }
```

-   **includeKeys** `string[]` [optional]
    defaults set to `['value', 'hits', 'aggregations', 'error']` which means that by default your search state for a particular component will only contains these keys. Although the default search state fulfills most of your common use cases but you can also control it by defining your custom keys with the help of `includeKeys` prop.<br/><br/>
    For example:

        	```js
        		<StateProvider
        			includeKeys={['value']}
        			render={({ searchState }) => {
        				console.log(searchState);
        				return null;
        			}}
        		/>
        	```
        	Returned State:

        	```js
        	{
        			BooksSearch: {
        					value: 'A song of Ice and Fire',
        			},
        			RatingsFilter: {
        					value: {
        						start: 4,
        						end: 5,
        						label: "★★★★ & up"
        					},
        			}
        	}
        	```

        	Here is a list of all the valid keys:

        	- **isLoading** `true` if the component's query is in executing mode
        	- **error** returns the error
        	- **hits** An array of hits obtained from the applied query.
        	- **aggregations** An array of aggregations obtained from the applied query.
        	- **query** returns the component's query in Elaticsearch Query DSL format.
        	- **react** returns the `react` property of the components
        	- **componentType** string constant to tell the type of the reactivesearch component is being used.
        	- **dataField** data field to be connected to the component’s UI view.
        	- **includeFields** query option
        	- **excludeFields** query option
        	- **size** query option
        	- **sortBy** query option
        	- **sortOptions** query option
        	- **pagination** `true` means result components are using pagination in UI
        	- **autoFocus** property of search components
        	- **autosuggest** property of search components
        	- **debounce** property of search components
        	- **defaultValue** default value of components
        	- **defaultSuggestions** default suggestions set by user
        	- **fieldWeights** property of search components
        	- **filterLabel** filter label set for components
        	- **fuzziness** property of search components
        	- **highlight** property of search components
        	- **highlightField** property of search components
        	- **nestedField** returns the `nestedField` prop set by user
        	- **placeholder** placeholder set for search components
        	- **queryFormat** returns the `queryFormat` set for the components
        	- **categoryField** property of search components
        	- **strictSelection** property of search components
        	- **selectAllLabel** property of list components
        	- **showCheckbox** property of list components
        	- **showFilter** property of list components
        	- **showSearch** property of list components
        	- **showCount** property of list components
        	- **showLoadMore** property of list components
        	- **loadMoreLabel** property of list components
        	- **showMissing** property of list components
        	- **missingLabel** property of list components
        	- **data** property of list components
        	- **showRadio** property of list components
        	- **multiSelect** property of list components
        	- **interval** property of range components
        	- **showHistogram** property of range components
        	- **snap** property of range components
        	- **stepValue** property of range components
        	- **range** property of range components
        	- **showSlider** property of range components

> Note
>
> The existence of a key in component's search state depends on the type of component is being used.

-   **onChange** `function` [optional]
    is a callback function called when the search state changes and accepts the previous and next search state as arguments.
    <br/><br/>
    For example:

        	```js
        		<StateProvider
        			onChange={(prevState, nextState) => {
        				console.log("Old State", prevState);
        				console.log("New State", nextState);
        			}}
        		/>
        	```
