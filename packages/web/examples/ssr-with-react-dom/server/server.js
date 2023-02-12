import Express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { renderStylesToString } from 'emotion-server';
import { getServerState } from '@appbaseio/reactivesearch';

import App from '../common/App';

// settings for the ReactiveBase component
const settings = {
	app: 'good-books-ds',
	url: 'https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io',
	enableAppbase: true,
};

const app = Express();
const port = 3000;

// Serve static files
// Since we're passing all requests to same handleRenderer
// We need to serve the bundle.js as it is
// Alternatively you can define your own set of routes
app.use('/dist', Express.static('dist'));

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
			<script src="dist/bundle.js"></script>
		</body>
		</html>
    `;
}

async function handleRender(req, res) {
	try {
		// extracting query params
		const queryParams = { ...req.query };

		Object.keys(queryParams).forEach((paramKey) => {
			try {
				if (JSON.parse(queryParams[paramKey])) {
					queryParams[paramKey] = JSON.parse(queryParams[paramKey]);
				}
			} catch (error) {
				// not JSON parsable, do nothing
			}
		});
		// Create a new store instance and wait for results
		const store = await getServerState(
			props => <App settings={settings} {...props} />,
			queryParams,
		);
		// Render the component to a string
		// renderStylesToString is from emotion
		// ReactiveSearch uses emotion and this will inline the styles
		// so you can get the correct styles for ReactiveSearch's components
		// on the first load
		const html = renderStylesToString(
			renderToString(<App store={store} settings={settings} />),
		);

		// Send the rendered page back to the client
		res.send(renderFullPage(html, store));
	} catch (err) {
		console.error(err);
		res.status(500).end();
	}
}

// This is fired every time the server side receives a request
app.use(handleRender);
app.listen(port, (error) => {
	if (error) {
		console.error(error);
	} else {
		// eslint-disable-next-line
		console.info(
			`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`,
		);
	}
});
