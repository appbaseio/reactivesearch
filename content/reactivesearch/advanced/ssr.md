---
title: 'Server Side Rendering'
meta_title: 'Server Side Rendering'
meta_description: 'Server Side Rendering enables us to pre-render the results on the server enabling better SEO for the app, and faster delivery of relevant results on an initial render to the users.'
keywords:
    - reactivesearch
    - ssr
    - appbase
    - elasticsearch
sidebar: 'web-reactivesearch'
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
import initReactivesearch from '@appbaseio/reactivesearch/lib/server';
```

Then, evaluate the initial state:

```js
const initialState = await initReactivesearch(...);
```

and finally, pass the computed initial state to `ReactiveBase` component.

```js
<ReactiveBase {...props} initialState={initialState}>
	...
</ReactiveBase>
```

## Example

We will build a simple booksearch app with `next.js` as an example to get started with:

> Note that you can also use `react-dom/server` to implement SSR. We are using `next.js` here for simplicity.

### Pre-requisites

Set up `next.js` - [Refer docs here](https://github.com/zeit/next.js)

### Installation

Use the package manager of your choice to install `reactivesearch`:

```
yarn add @appbaseio/reactivesearch
```

Since reactivesearch internally uses `emotion-js` for styling, we will also need to install `emotion-server`:

```
yarn add emotion-server
```

We will also utilise `babel-plugin-direct-import` and `babel-plugin-emotion` primarily to generate an optimised build for our app. So make sure that you install:

```
yarn add -D babel-cli babel-core babel-loader babel-plugin-direct-import babel-plugin-emotion babel-plugin-transform-class-properties babel-plugin-transform-object-rest-spread babel-preset-env babel-preset-next babel-preset-react
```

### Setup

Create `.babelrc` with the following configuration to generate an optimised build for your react app:

```js
{
	"presets": ["next/babel"],
	"plugins": [
		"emotion",
		"transform-class-properties",
		"transform-object-rest-spread",
		[
			"direct-import",
			[
			  "@appbaseio/reactivesearch",
			  {
				"name": "@appbaseio/reactivesearch",
				"indexFile": "@appbaseio/reactivesearch/lib/index.es.js"
			  }
			]
		]
	]
}
```

Create an `index.js` file in the `pages` directory:

```js
import initReactivesearch from '@appbaseio/reactivesearch/lib/server';
```

and we will also import the other relevant component from the reactivesearch library:

```js
import { ReactiveBase, DataSearch, SelectedFilters, ReactiveList } from '@appbaseio/reactivesearch';
```

Set the props for all the components we are going to use:

```js
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
	className: 'result-list-container',
	from: 0,
	size: 5,
	renderItem: data => <BookCard key={data._id} data={data} />,
	react: {
		and: ['BookSensor'],
	},
};
```

Next step is to evaluate the initial state in the `getInitialProps` lifecycle method:

```js
export default class Main extends Component {
	static async getInitialProps() {
		return {
			store: await initReactivesearch(
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
			),
		};
	}

	render() {
		return (
			<ReactiveBase {...settings} initialState={this.props.store}>
				<div className="row">
					<div className="col">
						<DataSearch {...dataSearchProps} />
					</div>

					<div className="col">
						<SelectedFilters />
						<ReactiveList {...reactiveListProps} />
					</div>
				</div>
			</ReactiveBase>
		);
	}
}
```

Since ReactiveSearch runs on emotion-js internally, we will need to extract and inject styles properly by creating a `_document.js`:

```js
import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { extractCritical } from 'emotion-server';

export default class MyDocument extends Document {
	static getInitialProps({ renderPage }) {
		// for emotion-js
		const page = renderPage();
		const styles = extractCritical(page.html);
		return { ...page, ...styles };
	}

	constructor(props) {
		// for emotion-js
		super(props);
		const { __NEXT_DATA__, ids } = props;
		if (ids) {
			__NEXT_DATA__.ids = ids;
		}
	}

	render() {
		return (
			<html lang="en">
				<Head>
					<link rel="stylesheet" href="/_next/static/style.css" />
					<meta charSet="utf-8" />
					<meta name="viewport" content="initial-scale=1.0, width=device-width" />
					{/* for emotion-js */}
					<style dangerouslySetInnerHTML={{ __html: this.props.css }} />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</html>
		);
	}
}
```

Finally, you can now run the dev server and catch the SSR in action.

## Using with react-dom

You can also use ReactiveSearch with [react-dom/server](https://reactjs.org/docs/react-dom-server.html). Check out the [example app](https://github.com/appbaseio/reactivesearch/tree/dev/packages/web/examples/ssr-with-react-dom) for a detailed setup.

The concept remains the same, after gettting a request, we'll use `initReactiveSearch` to compute the results and populate ReactiveSearch's redux store. We'll use [renderToString](https://reactjs.org/docs/react-dom-server.html#rendertostring) from `react-dom/server` and [renderStylesToString](https://emotion.sh/docs/ssr#renderstylestostring) from `emotion-server` to generate a html paint for our app. For example:

```js
const html = renderStylesToString(
	renderToString(
		<App
			store={store}
			settings={settings}
			singleRangeProps={singleRangeProps}
			reactiveListProps={reactiveListProps}
		/>,
	),
);
```

We'll send this markup along with the computed `store` object so that it can be pre-loaded in client side while hydrating the app.

## Example apps

We've covered all the existing components as an example app here:

-   [Components SSR demo with Next.js](https://github.com/appbaseio/reactivesearch/tree/dev/packages/web/examples/ssr)
-   [SSR demo with react-dom](https://github.com/appbaseio/reactivesearch/tree/dev/packages/web/examples/ssr-with-react-dom)
