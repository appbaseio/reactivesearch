import { getSearchState } from '@appbaseio/reactivecore/lib/utils/helper';

// eslint-disable-next-line
export const triggerClickAnalytics = ({ config, analytics, headers, searchPosition, context }) => {
	// click analytics would only work client side and after javascript loads
	const { searchId } = analytics;
	const { url, app, credentials } = config;
	const searchState
		= context && context.store ? getSearchState(context.store.getState(), true) : null;
	if (config.analytics && searchId) {
		fetch(`${url}/${app}/_analytics`, {
			method: 'POST',
			headers: {
				...headers,
				'Content-Type': 'application/json',
				Authorization: `Basic ${btoa(credentials)}`,
				'X-Search-Id': searchId,
				'X-Search-Click': true,
				'X-Search-ClickPosition': searchPosition,
				...(config.analyticsConfig.searchStateHeader
					&& searchState && {
					'X-Search-State': JSON.stringify(searchState),
				}),
			},
		});
	}
};
