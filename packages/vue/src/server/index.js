import Appbase from 'appbase-js';

import valueReducer from '@appbaseio/reactivecore/lib/reducers/valueReducer';
import queryReducer from '@appbaseio/reactivecore/lib/reducers/queryReducer';
import queryOptionsReducer from '@appbaseio/reactivecore/lib/reducers/queryOptionsReducer';
import compositeAggsReducer from '@appbaseio/reactivecore/lib/reducers/compositeAggsReducer';
import { UPDATE_COMPOSITE_AGGS } from '@appbaseio/reactivecore/lib/constants';
import dependencyTreeReducer from '@appbaseio/reactivecore/lib/reducers/dependencyTreeReducer';
import {
	buildQuery,
	pushToAndClause,
	extractQueryFromCustomQuery,
	getOptionsForCustomQuery,
} from '@appbaseio/reactivecore/lib/utils/helper';
import fetchGraphQL from '@appbaseio/reactivecore/lib/utils/graphQL';
import { componentTypes, validProps } from '@appbaseio/reactivecore/lib/utils/constants';
import {
	getRSQuery,
	extractPropsFromState,
	getDependentQueries,
	isSearchComponent,
} from '@appbaseio/reactivecore/lib/utils/transform';
import { isPropertyDefined } from '@appbaseio/reactivecore/lib/actions/utils';

const X_SEARCH_CLIENT = 'ReactiveSearch Vue';

const componentsWithoutFilters = [componentTypes.numberBox, componentTypes.ratingsFilter];

const resultComponents = [componentTypes.reactiveList, componentTypes.reactiveMap];

function getValue(state, id, defaultValue) {
	if (state && state[id]) {
		try {
			// parsing for next.js - since it uses extra set of quotes to wrap params
			const parsedValue = JSON.parse(state[id]);
			return {
				value: parsedValue,
				reference: 'URL',
			};
		} catch (error) {
			// using react-dom-server for ssr
			return {
				value: state[id],
				reference: 'URL',
			};
		}
	}
	return {
		value: defaultValue,
		reference: 'DEFAULT',
	};
}

function parseValue(value, component) {
	if (component.source && component.source.parseValue) {
		return component.source.parseValue(value, component);
	}
	return value;
}

// Returns query DSL with query property and other options
function getDefaultQuery(component, value) {
	// get custom or default query of sensor components
	const currentValue = parseValue(value, component);
	// get default query of result components
	if (component.defaultQuery) {
		const defaultQuery = component.defaultQuery(currentValue, component);
		return {
			query: extractQueryFromCustomQuery(defaultQuery),
			...getOptionsForCustomQuery(defaultQuery),
		};
	}
	return component.source.defaultQuery
		? { query: component.source.defaultQuery(currentValue, component) }
		: {};
}
// Only results the query part
function getCustomQuery(component, value) {
	// get custom or default query of sensor components
	const currentValue = parseValue(value, component);
	if (component.customQuery) {
		return extractQueryFromCustomQuery(component.customQuery(currentValue, component));
	}
	return component.source.defaultQuery
		? component.source.defaultQuery(currentValue, component)
		: null;
}

export default function initReactivesearch(componentCollection, searchState, settings) {
	return new Promise((resolve, reject) => {
		const credentials
			= settings.url && settings.url.trim() !== '' && !settings.credentials
				? null
				: settings.credentials;
		const enableTelemetry
			= settings.appbaseConfig && settings.appbaseConfig.enableTelemetry !== undefined
				? settings.appbaseConfig.enableTelemetry
				: true;
		const headers = {
			...(settings.enableAppbase && {
				'X-Search-Client': X_SEARCH_CLIENT,
				...(enableTelemetry === false && { 'X-Enable-Telemetry': false }),
			}),
			...settings.headers,
		};
		const config = {
			url:
				settings.url && settings.url.trim() !== ''
					? settings.url
					: 'https://scalr.api.appbase.io',
			app: settings.app,
			credentials,
			transformRequest: settings.transformRequest || null,
			type: settings.type ? settings.type : '*',
			transformResponse: settings.transformResponse || null,
			graphQLUrl: settings.graphQLUrl || '',
			headers,
			analyticsConfig: settings.appbaseConfig || null,
		};
		const appbaseRef = Appbase(config);

		let components = [];
		let selectedValues = {};
		const internalValues = {};
		let queryList = {};
		let queryLog = {};
		let queryOptions = {};
		let dependencyTree = {};
		let finalQuery = [];
		let appbaseQuery = {}; // Use object to prevent duplicate query added by react prop
		let orderOfQueries = [];
		let hits = {};
		let aggregations = {};
		let compositeAggregations = {};
		let state = {};
		const customQueries = {};
		const defaultQueries = {};
		const componentProps = {};
		componentCollection.forEach((component) => {
			const { componentType } = component.source;
			components = [...components, component.componentId];
			// Set component props
			const compProps = {};
			Object.keys(component).forEach((key) => {
				if (validProps.includes(key)) {
					compProps[key] = component[key];
				}
			});
			let isInternalComponentPresent = false;
			if (component.source.hasInternalComponent) {
				isInternalComponentPresent = component.source.hasInternalComponent(component);
			}
			const isResultComponent = resultComponents.includes(componentType);
			const internalComponent = `${component.componentId}__internal`;
			const label = component.filterLabel || component.componentId;
			const { value, reference } = getValue(
				searchState,
				component.componentId,
				component.value || component.defaultValue,
			);
			// [1] set selected values
			let showFilter = component.showFilter !== undefined ? component.showFilter : true;
			if (componentsWithoutFilters.includes(componentType)) {
				showFilter = false;
			}

			selectedValues = valueReducer(selectedValues, {
				type: 'SET_VALUE',
				component: component.componentId,
				label,
				value,
				reference,
				showFilter,
				URLParams: component.URLParams || false,
			});
			// Set custom and default queries
			if (component.customQuery && typeof component.customQuery === 'function') {
				customQueries[component.componentId] = component.customQuery(value, compProps);
			}
			if (component.defaultQuery && typeof component.defaultQuery === 'function') {
				defaultQueries[component.componentId] = component.defaultQuery(value, compProps);
			}
			let componentQueryOptions = {};
			// [2] set query options - main component query (valid for result components)
			if (component && component.source.generateQueryOptions) {
				componentQueryOptions = {
					...componentQueryOptions,
					...component.source.generateQueryOptions(component),
				};
			}
			let highlightQuery = {};

			if (component.source.highlightQuery) {
				highlightQuery = component.source.highlightQuery(component);
			}
			if (
				(componentQueryOptions && Object.keys(componentQueryOptions).length)
				|| (highlightQuery && Object.keys(highlightQuery).length)
			) {
				// eslint-disable-next-line
				let { aggs, size, ...otherQueryOptions } = componentQueryOptions || {};

				if (aggs && Object.keys(aggs).length) {
					isInternalComponentPresent = true;
					componentQueryOptions = {
						...componentQueryOptions,
						...{ aggs, size: typeof size === 'undefined' ? 100 : size },
					};
				}

				// sort, highlight, size, from - query should be applied on the main component
				if (
					(otherQueryOptions && Object.keys(otherQueryOptions).length)
					|| (highlightQuery && Object.keys(highlightQuery).length)
				) {
					if (!otherQueryOptions) otherQueryOptions = {};
					if (!highlightQuery) highlightQuery = {};

					let mainQueryOptions = { ...otherQueryOptions, ...highlightQuery, size };
					if (isInternalComponentPresent) {
						mainQueryOptions = { ...otherQueryOptions, ...highlightQuery };
					}
					if (isResultComponent) {
						let currentPage = component.currentPage ? component.currentPage - 1 : 0;
						if (
							selectedValues[component.componentId]
							&& selectedValues[component.componentId].value
						) {
							currentPage = selectedValues[component.componentId].value - 1 || 0;
						}
						const resultSize = component.size || 10;
						const from = currentPage * resultSize;
						// Update props for RS API
						compProps.from = from;
						mainQueryOptions = {
							...mainQueryOptions,
							...highlightQuery,
							size: resultSize,
							from,
						};
					}
					componentQueryOptions = { ...componentQueryOptions, ...mainQueryOptions };
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
			// Do not set default query for suggestions
			if (isInternalComponentPresent && !isSearchComponent(component.componentType)) {
				const { query: defaultQuery, ...defaultQueryOptions }
					= getDefaultQuery(component, value) || {};
				queryList = queryReducer(queryList, {
					type: 'SET_QUERY',
					component: internalComponent,
					query: defaultQuery,
				});
				queryOptions = queryOptionsReducer(queryOptions, {
					type: 'SET_QUERY_OPTIONS',
					component: internalComponent,
					options: { ...componentQueryOptions, ...defaultQueryOptions },
				});
			}

			const customQuery = getCustomQuery(component, value);
			// set custom query for main component
			queryList = queryReducer(queryList, {
				type: 'SET_QUERY',
				component: component.componentId,
				query: customQuery,
			});
			queryOptions = queryOptionsReducer(queryOptions, {
				type: 'SET_QUERY_OPTIONS',
				component: component.componentId,
				options: { ...componentQueryOptions },
			});
			// Set component type in component props
			compProps.componentType = componentType;
			componentProps[component.componentId] = compProps;
		});

		state = {
			components,
			dependencyTree,
			queryList,
			queryOptions,
			selectedValues,
			internalValues,
			props: componentProps,
			customQueries,
			defaultQueries,
		};
		// [5] Generate finalQuery for search
		componentCollection.forEach((component) => {
			// eslint-disable-next-line
			let { queryObj, options } = buildQuery(
				component.componentId,
				dependencyTree,
				queryList,
				queryOptions,
			);

			const validOptions = ['aggs', 'from', 'sort'];
			// check if query or options are valid - non-empty
			if (
				(queryObj && !!Object.keys(queryObj).length)
				|| (options && Object.keys(options).some((item) => validOptions.includes(item)))
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

				if (settings.enableAppbase) {
					const query = getRSQuery(
						component.componentId,
						extractPropsFromState(
							state,
							component.componentId,
							queryOptions && queryOptions[component.componentId]
								? { from: queryOptions[component.componentId].from }
								: null,
						),
					);
					if (query) {
						// Apply dependent queries
						appbaseQuery = {
							...appbaseQuery,
							...{ [component.componentId]: query },
							...getDependentQueries(state, component.componentId, orderOfQueries),
						};
					}
				} else {
					const preference
						= config && config.analyticsConfig && config.analyticsConfig.userId
							? `${config.analyticsConfig.userId}_${component}`
							: component;
					finalQuery = [
						...finalQuery,
						{
							preference,
						},
						currentQuery,
					];
				}
			}
		});

		state.queryLog = queryLog;

		const handleTransformResponse = (res, component) => {
			if (config.transformResponse && typeof config.transformResponse === 'function') {
				return config.transformResponse(res, component);
			}
			return new Promise((resolveTransformResponse) => resolveTransformResponse(res));
		};

		const handleResponse = (res) => {
			const allPromises = orderOfQueries.map(
				(component, index) =>
					new Promise((responseResolve, responseReject) => {
						handleTransformResponse(res.responses[index], component)
							.then((response) => {
								if (response.aggregations) {
									aggregations = {
										...aggregations,
										[component]: response.aggregations,
									};
									compositeAggregations = compositeAggsReducer(
										compositeAggregations,
										{
											type: UPDATE_COMPOSITE_AGGS,
											aggregations: response.aggregations,
											append: false,
										},
									);
								}
								hits = {
									...hits,
									[component]: {
										hits: response.hits.hits,
										total:
											typeof response.hits.total === 'object'
												? response.hits.total.value
												: response.hits.total,
										time: response.took,
									},
								};
								responseResolve();
							})
							.catch((err) => responseReject(err));
					}),
			);

			Promise.all(allPromises).then(() => {
				state = {
					...state,
					hits,
					aggregations,
				};
				resolve(state);
			});
		};

		const handleRSResponse = (res) => {
			const promotedResults = {};
			const rawData = {};
			const customData = {};
			const settingsResponse = {};
			const timestamp = {};
			const allPromises = orderOfQueries.map(
				(component) =>
					new Promise((responseResolve, responseReject) => {
						handleTransformResponse(res[component], component)
							.then((response) => {
								if (response) {
									if (response.promoted) {
										promotedResults[component] = response.promoted.map(
											(promoted) => ({
												...promoted.doc,
												_position: promoted.position,
											}),
										);
									}
									rawData[component] = response;
									// Update custom data
									if (response.customData) {
										customData[component] = response.customData;
									}

									// Update settings
									if (response.settings) {
										settingsResponse[component] = response.settings;
									}

									if (response.aggregations) {
										aggregations = {
											...aggregations,
											[component]: response.aggregations,
										};
									}
									timestamp[component] = res._timestamp;
									hits = {
										...hits,
										[component]: {
											hits: response.hits.hits,
											total:
												typeof response.hits.total === 'object'
													? response.hits.total.value
													: response.hits.total,
											time: response.took,
										},
									};
									responseResolve();
								}
							})
							.catch((err) => responseReject(err));
					}),
			);

			Promise.all(allPromises).then(() => {
				state = {
					...state,
					hits,
					timestamp,
					aggregations,
					compositeAggregations,
					promotedResults,
					settings: settingsResponse,
					customData,
					rawData,
				};
				resolve(state);
			});
		};

		if (config.graphQLUrl) {
			const handleTransformRequest = (res) => {
				if (config.transformRequest && typeof config.transformRequest === 'function') {
					const transformRequestPromise = config.transformRequest(res);
					return transformRequestPromise instanceof Promise
						? transformRequestPromise
						: Promise.resolve(transformRequestPromise);
				}
				return Promise.resolve(res);
			};
			handleTransformRequest(finalQuery)
				.then((requestQuery) => {
					fetchGraphQL(
						config.graphQLUrl,
						config.url,
						config.credentials,
						config.app,
						requestQuery,
					)
						.then((res) => {
							handleResponse(res);
						})
						.catch((err) => reject(err));
				})
				.catch((err) => reject(err));
		} else if (settings.enableAppbase && Object.keys(appbaseQuery).length) {
			finalQuery = Object.keys(appbaseQuery).map((c) => appbaseQuery[c]);
			// Call RS API
			const rsAPISettings = {};
			if (config.analyticsConfig) {
				rsAPISettings.recordAnalytics = isPropertyDefined(
					config.analyticsConfig.recordAnalytics,
				)
					? config.analyticsConfig.recordAnalytics
					: undefined;
				rsAPISettings.userId = isPropertyDefined(config.analyticsConfig.userId)
					? config.analyticsConfig.userId
					: undefined;
				rsAPISettings.enableQueryRules = isPropertyDefined(
					config.analyticsConfig.enableQueryRules,
				)
					? config.analyticsConfig.enableQueryRules
					: undefined;
				rsAPISettings.customEvents = isPropertyDefined(config.analyticsConfig.customEvents)
					? config.analyticsConfig.customEvents
					: undefined;
			}
			appbaseRef
				.reactiveSearchv3(finalQuery, rsAPISettings)
				.then((res) => {
					handleRSResponse(res);
				})
				.catch((err) => reject(err));
		} else {
			appbaseRef
				.msearch({
					type: config.type === '*' ? '' : config.type,
					body: finalQuery,
				})
				.then((res) => {
					handleResponse(res);
				})
				.catch((err) => reject(err));
		}
	});
}
