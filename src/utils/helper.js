export function updateQuery(componentId, query) {
	return (dispatch, getState) => {
		dispatch(setQuery(componentId, query));

		const store = getState();
		store.watchMan[componentId].forEach(component => {
			const queryObj = buildQuery(component, store.watchMan[component], store.queryList);
			dispatch(executeQuery(component, queryObj));
		});
	}
}

function buildQuery(component, watchList, queryList) {
	// read dependency tree and build query
	return null;
}
