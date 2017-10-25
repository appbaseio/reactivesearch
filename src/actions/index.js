import {
	ADD_COMPONENT,
	REMOVE_COMPONENT,
	WATCH_COMPONENT,
	SET_QUERY,
	EXECUTE_QUERY,
	UPDATE_HITS,
	UPDATE_AGGS,
	SET_QUERY_OPTIONS,
	LOG_QUERY
} from "../constants";

import { buildQuery, isEqual } from "../utils/helper";

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

function updateWatchman(component, react) {
	return {
		type: WATCH_COMPONENT,
		component,
		react
	};
}

export function watchComponent(component, react) {
	return (dispatch, getState) => {
		dispatch(updateWatchman(component, react));
		const store = getState();
		const options = store.queryOptions[component];
		const queryObj = buildQuery(component, store.dependencyTree, store.queryList);
		if (queryObj) {
			dispatch(executeQuery(component, queryObj, options));
		}
	}
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

export function logQuery(component, query) {
	return {
		type: LOG_QUERY,
		component,
		query
	};
}

export function executeQuery(component, query, options = {}, appendToHits = false, onQueryChange) {
	return (dispatch, getState) => {
		const { appbaseRef, config, queryOptions, queryLog } = getState();
		let mainQuery = null;

		if (query) {
			mainQuery = {
				query
			}
		}

		const finalQuery = {
			...mainQuery,
			...queryOptions[component],
			...options
		};

		if (!isEqual(finalQuery, queryLog[component])) {
			console.log("Executing for", component, finalQuery);
			if (onQueryChange) {
				onQueryChange(queryLog[component], finalQuery);
			}
			dispatch(logQuery(component, finalQuery));

			appbaseRef.search({
				type: config.type === "*" ? null : config.type,
				body: finalQuery
			})
				.on("data", response => {
					dispatch(updateHits(component, response.hits, appendToHits))
					if ("aggregations" in response) {
						dispatch(updateAggs(component, response.aggregations));
					}
				})
				.on("error", e => {
					console.log(e);
				});
		}
	}
}

export function updateHits(component, hits, append = false) {
	return {
		type: UPDATE_HITS,
		component,
		hits: hits.hits,
		total: hits.total,
		append
	}
}

export function updateAggs(component, aggregations) {
	return {
		type: UPDATE_AGGS,
		component,
		aggregations
	}
}

export function updateQuery(componentId, query, onQueryChange) {
	return (dispatch, getState) => {
		dispatch(setQuery(componentId, query));

		const store = getState();
		const watchList = store.watchMan[componentId];
		const options = store.queryOptions[componentId];
		if (Array.isArray(watchList)) {
			watchList.forEach(component => {
				const queryObj = buildQuery(component, store.dependencyTree, store.queryList);
				dispatch(executeQuery(component, queryObj, options, false, onQueryChange));
			});
		}
	}
}

export function loadMore(component, options, append = true) {
	return (dispatch, getState) => {
		const store = getState();
		const queryObj = buildQuery(component, store.dependencyTree, store.queryList);
		dispatch(executeQuery(component, queryObj, options, append));
	}
}
