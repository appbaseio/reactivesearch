---
title: 'Quickstart'
meta_title: 'Quickstart to searchbase'
meta_description: 'searchbase is a lightweight and platform agnostic library that provides scaffolding to create search experiences powered by Elasticsearch.'
keywords:
    - quickstart
    - searchbase
    - search library
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'searchbase-reactivesearch'
---

[searchbase](https://github.com/appbaseio/searchbox/tree/master/packages/searchbase) is a lightweight and platform agnostic library that provides scaffolding to create search experiences powered by Elasticsearch.

## Installation

Run the below command to install `searchbase` in your project.

```js
yarn add @appbaseio/searchbase
```

To use the umd build, add the following script in your `index.html` file.

```js
<script defer src="https://cdn.jsdelivr.net/npm/@appbaseio/searchbase@1.0.0/dist/@appbaseio/searchbase.umd.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/@appbaseio/searchbase@1.0.0/dist/@appbaseio/searchbase.umd.min.js.map"></script>
```

## Basic Usage

You can watch this video for an intro to Searchbase and follow along to build out the example search UI.

[![](https://i.imgur.com/rf2aQDp.png)](https://youtu.be/MYHpBlqigho)

### A simple example

The following example creates a single component of type `search` to render the results based on the input value.

```js
import { SearchComponent } from '@appbaseio/searchbase';

// Instantiate the `SearchComponent`
const searchComponent = new SearchComponent({
	// Elasticsearch index name
	index: 'gitxplore-app',
	// Appbase credentials
	credentials: 'a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61',
	url: 'https://@arc-cluster-appbase-demo-6pjy6z.searchbase.io',
	// Unique identifier for component
	id: 'search-component',
	// initialize with empty value
	value: '',
	// Database fields to perform the search
	dataField: ['name', 'description', 'name.search', 'fullname', 'owner', 'topics'],
});

// Get the input element
const searchElement = document.getElementById('search');

// Bind the searchComponent value to input value
searchElement.value = searchComponent.value;

// Update the search input value to searchComponent to fetch the results
searchElement.addEventListener('input', e => {
	// To fetch the suggestions based on the value changes
	searchComponent.setValue(e.target.value);
});

// Build DOM when search results update
searchComponent.subscribeToStateChanges(
	change => {
		const results = change.results.next;
		const resultsElement = document.getElementById('results');
		resultsElement.innerHTML = '';
		results.data.forEach(element => {
			var node = document.createElement('li'); // Create a <li> node
			var resultNode = document.createTextNode(element.name); // Create a text node
			node.appendChild(resultNode); // Append the text to <li>
			resultsElement.appendChild(node);
		});
	},
	['results'],
);

// Fetch the default results at initial load
searchComponent.triggerDefaultQuery();
```

Add this in your HTML

```html
<input placeholder="type to search" id="search" />

<div id="results"></div>
```

You can play around with this very basic example at [here](https://codesandbox.io/s/hopeful-waterfall-cdy6k?file=/src/index.js).

### An example with a facet

The following example creates three components:

-   a search component to perform the search,
-   a filter component to filter the GitHub repo by languages,
-   a result component to render the results based on the select language filters and search query

The result component watches for changes to the search and language filter components (see the `react` property). It reacts to the inputs and filter selection changes by triggering an `Elasticsearch` query to update results.

The language filter component is also watching for changes to the search. For example, if somebody searches for `angular` then the language filter will show `javascript` as an option.

> Note: This example is using the `SearchBase` class instead of the `SearchComponent`(that we used in the previous example) class because here we're using multiple components that can have dependencies on each other.

```js
import { SearchBase } from '@appbaseio/searchbase';

// Instantiate the `SearchBase`
const searchbase = new SearchBase({
	// Elasticsearch index name
	index: 'gitxplore-app',
	// Appbase credentials
	credentials: 'a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61',
	url: 'https://@arc-cluster-appbase-demo-6pjy6z.searchbase.io',
});

// Register search component => To render the suggestions
const searchComponent = searchbase.register('search-component', {
	// pass this prop as true to enable predictive suggestions
	enablePredictiveSuggestions: true,
	dataField: ['name', 'description', 'name.raw', 'fullname', 'owner', 'topics'],
});

// Register filter component with dependency on search component
const filterComponent = searchbase.register('language-filter', {
	// The type property as `term` is to use the Elasticsearch terms aggregations.
	type: 'term',
	dataField: 'language.keyword',
	react: {
		and: 'search-component',
	},
});

// Register result component with react dependency on search and filter component => To render the results
const resultComponent = searchbase.register('result-component', {
	dataField: 'name',
	react: {
		and: ['search-component', 'language-filter'],
	},
});

/* ---------- Integrate the input element to `search-component` --------------*/
const input = document.getElementById('input');

const handleInput = e => {
	// Set the value to fetch the suggestions
	searchComponent.setValue(e.target.value);
};

input.addEventListener('input', handleInput);

/* ---------- Build the `language-filter` component ----------------------------*/

// To fetch the default options
filterComponent.triggerDefaultQuery();

// Build UI to display language options
filterComponent.subscribeToStateChanges(
	change => {
		const aggregations = change.aggregations.next;
		const container = document.getElementById('language-filter');
		container.innerHTML = '';
		aggregations.data.forEach(i => {
			if (i._key) {
				const checkbox = document.createElement('input');
				checkbox.type = 'checkbox';
				checkbox.name = i._key;
				checkbox.value = i._key;
				checkbox.id = i._key;
				checkbox.onclick = () => {
					const values = filterComponent.value || [];
					if (values && values.includes(i._key)) {
						values.splice(values.indexOf(i._key), 1);
					} else {
						values.push(i._key);
					}
					// Set filter value and trigger custom query
					filterComponent.setValue(values, {
						triggerDefaultQuery: false,
						triggerCustomQuery: true,
					});
				};
				const label = document.createElement('label');
				label.htmlFor = i._key;
				label.innerHTML = `${i._key}(${i._doc_count})`;
				container.appendChild(checkbox);
				container.appendChild(label);
				container.appendChild(document.createElement('br'));
			}
		});
	},
	['aggregationData'],
);

/* ---------- Integrate the result element to `result-component` ---------------*/

const resultElement = document.getElementById('results');

// Fetch default results at initial load
resultComponent.triggerDefaultQuery();

// Build results UI on results updates
resultComponent.subscribeToStateChanges(
	change => {
		const results = change.results.next;
		const items = results.data.map(i => {
			return `
			<div>
				<div>
					<img src=${i.avatar} alt=${i.name} />
				</div>
				<div>
					<h4>${i.name}</h4>
					<p>${i.description}</p>
				</div>
			</div>`;
		});
		resultElement.innerHTML = items.join('<br>');
	},
	['results'],
);
```

Add this in your HTML

```html
<input placeholder="type to search" id="search" />

<div id="results"></div>

<div id="language-filter"></div>
```

## Demo

The following demo explains the `searchbase` integration to build a basic search experience with a facet.

<iframe src="https://codesandbox.io/embed/github/appbaseio/searchbox/tree/next/packages/searchbase/examples/with-facet?fontsize=14&hidenavigation=1&theme=dark&view=preview"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="appbaseio/searchbox: with-facet"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
