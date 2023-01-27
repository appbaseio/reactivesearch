import { renderToString } from 'vue/server-renderer';

import getServerResults from '@appbaseio/reactivecore/src/utils/server';

function getServerState(App, queryString) {
	const renderFunction = renderToString;
	return getServerResults()(App, queryString, renderFunction);
}

export default getServerState;
