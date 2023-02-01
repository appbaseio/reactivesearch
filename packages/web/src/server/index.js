import { renderToStaticMarkup } from 'react-dom/server';

import getServerResults from '@appbaseio/reactivecore/lib/utils/server';

function getServerState(App, queryString) {
	const renderFunction = renderToStaticMarkup;
	return getServerResults()(App, queryString, renderFunction);
}

export default getServerState;
