import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import { getServerResults } from '@appbaseio/reactivecore/lib/utils/server';

function getServerState(App, queryString) {
	const AppHOC = props => <App {...props} />;

	return getServerResults()(AppHOC, queryString, renderToStaticMarkup);
}

export default getServerState;
