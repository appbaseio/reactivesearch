import { createSSRApp } from 'vue';
import { renderToString } from 'vue/server-renderer';

import getServerResults from '@appbaseio/reactivecore/lib/utils/server';

function getServerState(App, queryString) {
	const renderFunction = renderToString;
	return getServerResults()((props) => createSSRApp(App, props), queryString, renderFunction);
}

export default getServerState;
