import {
	ADD_COMPONENT,
	REMOVE_COMPONENT,
	WATCH_COMPONENT,
	SET_QUERY,
	EXECUTE_QUERY
} from "../constants";

export function addComponent(component) {
	return {
		type: ADD_COMPONENT,
		component
	};
}

export function removeComponent(component) {
	return {
		type: REMOVE_COMPONENT,
		component
	};
}

export function watchComponent(component, react) {
	return {
		type: WATCH_COMPONENT,
		component,
		react
	};
}

export function setQuery(component, query) {
	return {
		type: SET_QUERY,
		component,
		query
	};
}

export function executeQuery(component, query) {
	return {
		type: EXECUTE_QUERY,
		component,
		query
	};
}

export function updateQuery(componentId, query) {
	return (dispatch, getState) => {
		dispatch(setQuery(componentId, query));

		const store = getState();
		const watchList = store.watchMan[componentId];

		if (Array.isArray(watchList)) {
			watchList.forEach(component => {
				const queryObj = buildQuery(component, watchList, store.queryList);
				dispatch(executeQuery(component, queryObj));
			});
		}
	}
}

function buildQuery(component, watchList, queryList) {
	// read dependency tree and build query
	return null;
}
