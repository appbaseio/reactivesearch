import {
	ADD_COMPONENT,
	REMOVE_COMPONENT,
	WATCH_COMPONENT,
	SET_QUERY,
	EXECUTE_QUERY,
	UPDATE_HITS,
	SET_QUERY_OPTIONS
} from "../constants";

import { buildQuery } from "../utils/helper";

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

export function setQueryOptions(component, options) {
	return {
		type: SET_QUERY_OPTIONS,
		component,
		options
	};
}

export function executeQuery(component, query) {
	return (dispatch, getState) => {
		const { config, queryOptions } = getState();
		fetch(`https://${config.credentials}@${config.url}/${config.app}/${config.type === null ? "" : `${config.type}/`}_search`, {
			method: "POST",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				query: query,
				...queryOptions[component]
			})
		})
		.then(response => response.json())
		.then(response => {
			dispatch(updateHits(component, response.hits.hits))
		})
		.catch(err => {
			console.log(err);
		});
	}
}

export function updateHits(component, hits) {
	return {
		type: UPDATE_HITS,
		component,
		hits
	}
}

export function updateQuery(componentId, query) {
	return (dispatch, getState) => {
		dispatch(setQuery(componentId, query));

		const store = getState();
		const watchList = store.watchMan[componentId];
		if (Array.isArray(watchList)) {
			watchList.forEach(component => {
				const queryObj = buildQuery(component, store.dependencyTree, store.queryList);
				dispatch(executeQuery(component, queryObj));
			});
		}
	}
}
