import Express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import initReactivesearch from '@appbaseio/reactivesearch/lib/server';
import { SingleRange, ReactiveList } from '@appbaseio/reactivesearch';

import App from '../common/App';
import BookCard from '../common/BookCard';

// settings for the ReactiveBase component
const settings = {
	app:
		'good-books-ds',
	credentials:
		'nY6NNTZZ6:27b76b9f-18ea-456c-bc5e-3a5263ebc63d',
};

// props for ReactiveSearch components
// we need these to run the query and get the results server side
const singleRangeProps = {
	componentId:
		'BookSensor',
	dataField:
		'average_rating',
	data: [
		{
			start: 0,
			end: 3,
			label:
				'Rating < 3',
		},
		{
			start: 3,
			end: 4,
			label:
				'Rating 3 to 4',
		},
		{
			start: 4,
			end: 5,
			label:
				'Rating > 4',
		},
	],
	defaultSelected:
		'Rating 3 to 4',
};

const reactiveListProps = {
	componentId:
		'SearchResult',
	dataField:
		'original_title.raw',
	from: 0,
	size: 10,
	onData: data => (
		<BookCard
			key={
				data._id
			}
			data={
				data
			}
		/>
	),
	react: {
		and: [
			'BookSensor',
		],
	},
};

const app = Express();
const port = 3000;

// Serve static files
// Since we're passing all requests to same handleRenderer
// We need to serve the bundle.js as it is
app.use('/static', Express.static('dist'));

function renderFullPage(html, preloadedState) {
	return `
		<!doctype html>
		<html>
		<head>
			<title>ReactiveSearch SSR Example</title>
		</head>
		<body>
			<div id="root">${html}</div>
			<script>
				window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState)}
			</script>
			<script src="/static/bundle.js"></script>
		</body>
		</html>
    `;
}

function handleRender(req, res) {
	// Create a new store instance
	initReactivesearch(
		[
			{
				...singleRangeProps,
				type:
					'SingleRange',
				source: SingleRange,
			},
			{
				...reactiveListProps,
				type:
					'ReactiveList',
				source: ReactiveList,
			},
		],
		null,
		settings,
	)
		.then((store) => {
			// Render the component to a string
			const html = renderToString(<App
				store={
					store
				}
				settings={
					settings
				}
				singleRangeProps={
					singleRangeProps
				}
				reactiveListProps={
					reactiveListProps
				}
			/>);

			// Send the rendered page back to the client
			res.send(renderFullPage(
				html,
				store,
			));
		});
}

// This is fired every time the server side receives a request
app.use(handleRender);
app.listen(port, (error) => {
	if (
		error
	) {
		console.error(error);
	} else {
		// eslint-disable-next-line
		console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`);
	}
});
