import Appbase from 'appbase-js';

import valueReducer from '@appbaseio/reactivecore/lib/reducers/valueReducer';
import queryReducer from '@appbaseio/reactivecore/lib/reducers/queryReducer';
import queryOptionsReducer from '@appbaseio/reactivecore/lib/reducers/queryOptionsReducer';
import dependencyTreeReducer from '@appbaseio/reactivecore/lib/reducers/dependencyTreeReducer';
import { buildQuery, pushToAndClause } from '@appbaseio/reactivecore/lib/utils/helper';

const componentsWithOptions = [
	'ResultList',
	'ResultCard',
	'ReactiveList',
	'ReactiveMap',
	'SingleList',
	'MultiList',
	'TagCloud',
];

const componentsWithoutFilters = [
	'NumberBox',
	'RangeSlider',
	'DynamicRangeSlider',
	'RangeInput',
	'RatingsFilter',
];

const resultComponents = ['ResultCard', 'ResultList', 'ReactiveList', 'ReactiveMap'];

function getValue(state, id, defaultValue) {
	return state ? state[id] : defaultValue;
}

function parseValue(value, component) {
	if (component.source && component.source.parseValue) {
		return component.source.parseValue(value, component);
	}
	return value;
}

function getQuery(component, value) {
	// get default query of result components
	if (resultComponents.includes(component.type)) {
		return component.defaultQuery ? component.defaultQuery() : {};
	}

	// get custom or default query of sensor components
	const currentValue = parseValue(value, component);
	if (component.customQuery) {
		return component.customQuery(currentValue, component);
	}
	return component.source.defaultQuery
		? component.source.defaultQuery(currentValue, component)
		: {};
}

export default function initReactivesearch(componentCollection, searchState, settings) {
	return new Promise((resolve, reject) => {
		const credentials = settings.url && settings.url.trim() !== '' && !settings.credentials
			? null
			: settings.credentials;
		const config = {
			url: settings.url && settings.url.trim() !== '' ? settings.url : 'https://scalr.api.appbase.io',
			app: settings.app,
			credentials,
			type: settings.type ? settings.type : '*',
		};
		const appbaseRef = new Appbase(config);

		let components = [];
		let selectedValues = {};
		let queryList = {};
		let queryLog = {};
		let queryOptions = {};
		let dependencyTree = {};
		let finalQuery = [];
		let orderOfQueries = [];
		let hits = {};
		let aggregations = {};
		let state = {};

		componentCollection.forEach((component) => {
			components = [...components, component.componentId];

			let isInternalComponentPresent = false;
			const isResultComponent = resultComponents.includes(component.type);
			const internalComponent = `${component.componentId}__internal`;
			const label = component.filterLabel || component.componentId;
			const value = getValue(searchState, label, component.defaultSelected);

			// [1] set selected values
			let showFilter = component.showFilter !== undefined ? component.showFilter : true;
			if (componentsWithoutFilters.includes(component.type)) {
				showFilter = false;
			}
			selectedValues = valueReducer(selectedValues, {
				type: 'SET_VALUE',
				component: component.componentId,
				label,
				value,
				showFilter,
				URLParams: component.URLParams || false,
			});

			// [2] set query options - main component query (valid for result components)
			if (componentsWithOptions.includes(component.type)) {
				const options = component.source.generateQueryOptions
					? component.source.generateQueryOptions(component)
					: null;

				if (options && Object.keys(options).length) {
					const { aggs, size, ...otherQueryOptions } = options;

					if (aggs && Object.keys(aggs).length) {
						isInternalComponentPresent = true;

						// query should be applied on the internal component
						// to enable feeding the data to parent component
						queryOptions = queryOptionsReducer(queryOptions, {
							type: 'SET_QUERY_OPTIONS',
							component: internalComponent,
							options: { aggs, size: size || 100 },
						});
					}

					// sort, size, from - query should be applied on the main component
					if (otherQueryOptions && Object.keys(otherQueryOptions).length) {
						let mainQueryOptions = { ...otherQueryOptions, size };
						if (isInternalComponentPresent) {
							mainQueryOptions = { ...otherQueryOptions };
						}
						if (isResultComponent) {
							mainQueryOptions = {
								from: 0,
								size: component.size || 10,
								...mainQueryOptions,
							};
						}
						queryOptions = queryOptionsReducer(queryOptions, {
							type: 'SET_QUERY_OPTIONS',
							component: component.componentId,
							options: { ...mainQueryOptions },
						});
					}
				}
			}

			// [3] set dependency tree
			if (component.react || isInternalComponentPresent || isResultComponent) {
				let { react } = component;
				if (isInternalComponentPresent || isResultComponent) {
					react = pushToAndClause(react, internalComponent);
				}

				dependencyTree = dependencyTreeReducer(dependencyTree, {
					type: 'WATCH_COMPONENT',
					component: component.componentId,
					react,
				});
			}

			// [4] set query list
			if (isResultComponent) {
				const { query } = getQuery(component);
				queryList = queryReducer(queryList, {
					type: 'SET_QUERY',
					component: internalComponent,
					query,
				});
			} else {
				queryList = queryReducer(queryList, {
					type: 'SET_QUERY',
					component: component.componentId,
					query: getQuery(component, value),
				});
			}
		});

		// [5] Generate finalQuery for search
		componentCollection.forEach((component) => {
			// eslint-disable-next-line
			let { queryObj, options } = buildQuery(
				component.componentId,
				dependencyTree,
				queryList,
				queryOptions,
			);

			if (
				(queryObj && Object.keys(queryObj).length)
				|| (options && Object.keys(options).length)
				|| (queryOptions[component.componentId])
			) {
				if (!queryObj || (queryObj && !Object.keys(queryObj).length)) {
					queryObj = { match_all: {} };
				}

				orderOfQueries = [...orderOfQueries, component.componentId];

				const currentQuery = {
					query: { ...queryObj },
					...options,
					...queryOptions[component.componentId],
				};

				queryLog = {
					...queryLog,
					[component.componentId]: currentQuery,
				};

				finalQuery = [
					...finalQuery,
					{
						preference: component.componentId,
					},
					currentQuery,
				];
			}
		});

		state = {
			components,
			dependencyTree,
			queryList,
			queryOptions,
			selectedValues,
			queryLog,
		};

		appbaseRef.msearch({
			type: config.type === '*' ? '' : config.type,
			body: finalQuery,
		})
			.on('data', (res) => {
				orderOfQueries.forEach((component, index) => {
					const response = res.responses[index];
					if (response.aggregations) {
						aggregations = {
							...aggregations,
							[component]: response.aggregations,
						};
					}
					hits = {
						...hits,
						[component]: {
							hits: response.hits.hits,
							total: response.hits.total,
							time: response.took,
						},
					};
				});
				state = {
					...state,
					hits,
					aggregations,
				};
				resolve(state);
			})
			.on('error', err => reject(err));
	});
}
