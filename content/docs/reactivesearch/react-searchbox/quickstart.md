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

[react-searchbox](https://github.com/appbaseio/react-searchbox) - A lightweight react search library with some common utilities.

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
