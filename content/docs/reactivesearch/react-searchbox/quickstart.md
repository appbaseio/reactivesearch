---
title: 'QuickStart'
meta_title: 'QuickStart to React SearchBox'
meta_description: 'React SearchBox is a lightweight react search library with some common utilities.'
keywords:
    - quickstart
    - react-searchbox
    - search library
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'react-searchbox-reactivesearch'
---

[react-searchbox](https://github.com/appbaseio/react-searchbox) - It offers a lightweight (~30KB: Minified + Gzipped) and performance focused searchbox UI component to query and display results from your ElasticSearch app (aka index) using declarative props. It is an alternative to using the [DataSearch component](/docs/reactivesearch/v3/search/datasearch/) from ReactiveSearch.

##Installation

```js
npm install @appbaseio/react-searchbox
// or
yarn add @appbaseio/react-searchbox
```

##Basic Usage

```js
import React, { Component } from 'react';

import SearchBox from '@appbaseio/react-searchbox';

export default class App extends Component {
	render() {
		return (
			<div>
				<SearchBox
					app="good-books-ds"
					credentials="nY6NNTZZ6:27b76b9f-18ea-456c-bc5e-3a5263ebc63d"
					dataField={['original_title', 'original_title.search']}
				/>
			</div>
		);
	}
}
```

##Demo

<iframe src="https://codesandbox.io/embed/github/appbaseio/searchbox/tree/master/packages/react-searchbox/examples/demo" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

Check the docs for API Reference [here](/docs/reactivesearch/react-searchbox/apireference/)
