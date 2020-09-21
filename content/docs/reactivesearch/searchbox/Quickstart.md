---
title: 'QuickStart'
meta_title: 'QuickStart to SearchBox'
meta_description: 'Searchbox is a lightweight searchbox UI component to query your Elasticsearch app.'
keywords:
    - quickstart
    - searchbox
    - search library
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'searchbox'
---


`searchBox` offers a lightweight and performance focused searchbox UI component to query and display results from your Elasticsearch app (aka index).

## Installation

`searchbox` requires `searchbase` as dependency. It's a framework agnostic JS library containing common utilities for performing search queries that Searchbox builds upon. You can read more about SearchBase over [here](/docs/reactivesearch/searchbase/overview/QuickStart/).

```js
npm install @appbaseio/searchbox @appbaseio/searchbase
// or
yarn add @appbaseio/searchbox @appbaseio/searchbase
```

## Usage

**index.html**
```html
<!-- Head elements -->
<body>
	<!-- Other elements -->
	<input type="text" id="git" placeholder="Search movies..." />
	<script src="./index.js"></script>
</body>
```

**index.js**

```js
import SearchBase from '@appbaseio/searchbase';
import searchbox from '@appbaseio/searchbox';

const instance = new SearchBase({
	index: 'gitxplore-latest-app',
	credentials: 'LsxvulCKp:a500b460-73ff-4882-8d34-9df8064b3b38',
	url: 'https://scalr.api.appbase.io',
	size: 5,
	dataField: [
		'name',
		'description',
		'name.raw',
		'fullname',
		'owner',
		'topics'
	]
});
searchbox('#git', { instance }, [
	{
		templates: {
			suggestion: function(suggestion) {
				return `<p class="is-4">${suggestion.label}</p>`;
			},
			empty: function() {
				return `<div>No Results</div>`;
			},
			loader: function() {
				return `<div>Loader</div>`;
			},
			footer: function({ query, isEmpty }) {
				return `
					<div style="background: #eaeaea; padding: 10px;">Footer</div>
				`;
			},
			header: function({ query, isEmpty }) {
				return `
					<div style="background: #efefef; padding: 10px;">
						Hello From Header
					</div>
				`;
			}
		}
	}
]);
```

## Look and feel

Add the following CSS rules to add a default style:

```css
.appbase-autocomplete {
	width: 100%;
}
.appbase-autocomplete .aa-input,
.appbase-autocomplete .aa-hint {
	width: 100%;
}
.appbase-autocomplete .aa-hint {
	color: #999;
}
.appbase-autocomplete .aa-dropdown-menu {
	width: 100%;
	background-color: #fff;
	border: 1px solid #999;
	border-top: none;
}
.appbase-autocomplete .aa-dropdown-menu .aa-suggestion {
	cursor: pointer;
	padding: 5px 4px;
}
.appbase-autocomplete .aa-dropdown-menu .aa-suggestion.aa-cursor {
	background-color: #b2d7ff;
}
.appbase-autocomplete .aa-dropdown-menu .aa-suggestion em {
	font-weight: bold;
	font-style: normal;
}
```

Custom styles can be added to make the UI sophisticated. Check the below demo which shows the use of custom styles.

## Demo with custom styling

<iframe src="https://codesandbox.io/embed/github/appbaseio/searchbox/tree/master/packages/searchbox/examples/searchbar-with-style?fontsize=14&hidenavigation=1&view=preview" title="autocomplete-example" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
