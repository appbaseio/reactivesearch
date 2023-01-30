import Appbase from 'appbase-js';

import valueReducer from '@appbaseio/reactivecore/lib/reducers/valueReducer';
import queryReducer from '@appbaseio/reactivecore/lib/reducers/queryReducer';
import dependencyTreeReducer from '@appbaseio/reactivecore/lib/reducers/dependencyTreeReducer';
import {
	buildQuery,
	pushToAndClause,
	transformRequestUsingEndpoint,
} from '@appbaseio/reactivecore/lib/utils/helper';
import fetchGraphQL from '@appbaseio/reactivecore/lib/utils/graphQL';
import {
	componentTypes,
	validProps,
	queryTypes,
} from '@appbaseio/reactivecore/lib/utils/constants';
import {
	getRSQuery,
	extractPropsFromState,
	getDependentQueries,
	componentToTypeMap,
} from '@appbaseio/reactivecore/lib/utils/transform';
import { isPropertyDefined } from '@appbaseio/reactivecore/lib/actions/utils';
import { X_SEARCH_CLIENT } from '../utils';

const componentsWithInternalComponent = {
	// search components
	[componentTypes.reactiveList]: true,
	[componentTypes.searchBox]: true,
	// term components
	[componentTypes.singleList]: true,
	[componentTypes.multiList]: true,
	[componentTypes.singleDropdownList]: true,
	[componentTypes.singleDataList]: false,
	[componentTypes.multiDataList]: false,
	[componentTypes.multiDropdownList]: true,
	[componentTypes.tagCloud]: true,
	[componentTypes.toggleButton]: false,
	[componentTypes.reactiveChart]: true,
	[componentTypes.treeList]: true,
	// basic components
	[componentTypes.numberBox]: false,

	// range components
	[componentTypes.datePicker]: false,
	[componentTypes.dateRange]: false,
	[componentTypes.dynamicRangeSlider]: true,
	[componentTypes.singleDropdownRange]: true,
	[componentTypes.multiDropdownRange]: true,
	[componentTypes.singleRange]: false,
	[componentTypes.multiRange]: false,
	[componentTypes.rangeSlider]: true,
	[componentTypes.ratingsFilter]: false,
	[componentTypes.rangeInput]: true,

	// map components
	[componentTypes.geoDistanceDropdown]: true,
	[componentTypes.geoDistanceSlider]: true,
	[componentTypes.reactiveMap]: true,
};

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

function getQuery(component, value, componentType) {
	// get default query of result components
	if (resultComponents.includes(componentType)) {
		return component.defaultQuery ? component.defaultQuery() : {};
	}

	// get custom or default query of sensor components
	const currentValue = parseValue(value, component);
	if (component.customQuery) {
		const customQuery = component.customQuery(currentValue, component);
		return customQuery && customQuery.query;
	}
	return component.source.defaultQuery
		? component.source.defaultQuery(currentValue, component)
		: {};
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
			'X-Search-Client': X_SEARCH_CLIENT,
			...(enableTelemetry === false && { 'X-Enable-Telemetry': false }),
			...settings.headers,
			...(settings.endpoint && settings.endpoint.headers ? settings.endpoint.headers : {}),
		};
		let url
			= settings.url && settings.url.trim() !== ''
				? settings.url
				: 'https://scalr.api.appbase.io';

		let transformRequest = settings.transformRequest || null;
		if (settings.endpoint && settings.endpoint instanceof Object) {
			if (settings.endpoint.url) url = settings.endpoint.url;
			transformRequest = (request) => {
				const modifiedRequest = transformRequestUsingEndpoint(request, settings.endpoint);

				if (settings.transformRequest) {
					return settings.transformRequest(modifiedRequest);
				}
				return modifiedRequest;
			};
		}
		const config = {
			url,
			app: settings.app,
			credentials,
			transformRequest,
			type: settings.type ? settings.type : '*',
			transformResponse: settings.transformResponse || null,
			graphQLUrl: settings.graphQLUrl || '',
			headers,
			analyticsConfig: settings.appbaseConfig || null,
			endpoint: settings.endpoint,
		};
		const appbaseRef = Appbase(config);

		if (config.transformRequest) {
			appbaseRef.transformRequest = config.transformRequest;
		}

		if (config.transformResponse) {
			appbaseRef.transformResponse = config.transformResponse;
		}

		let components = [];
		let selectedValues = {};
		const internalValues = {};
		let queryList = {};
		let queryLog = {};
		const queryOptions = {};
		let dependencyTree = {};
		let finalQuery = [];
		let appbaseQuery = {}; // Use object to prevent duplicate query added by react prop
		let orderOfQueries = [];
		let hits = {};
		let aggregations = {};
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
			let isInternalComponentPresent = componentsWithInternalComponent[componentType];
			if (componentType === componentTypes.reactiveComponent && compProps.defaultQuery) {
				isInternalComponentPresent = true;
			}
			const isResultComponent = resultComponents.includes(componentType);
			const internalComponent = `${component.componentId}__internal`;
			const label = component.filterLabel || component.componentId;
			const { value, reference } = getValue(
				searchState,
				component.componentId,
				component.value || component.defaultValue,
			);

			// Set custom and default queries
			if (component.customQuery && typeof component.customQuery === 'function') {
				customQueries[component.componentId] = component.customQuery(value, compProps);
			}
			if (component.defaultQuery && typeof component.defaultQuery === 'function') {
				defaultQueries[component.componentId] = component.defaultQuery(value, compProps);
			}

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
				const { query } = getQuery(component, value, componentType);
				queryList = queryReducer(queryList, {
					type: 'SET_QUERY',
					component: internalComponent,
					query,
				});
			} else {
				queryList = queryReducer(queryList, {
					type: 'SET_QUERY',
					component: component.componentId,
					query: getQuery(component, value, componentType),
				});
			}
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
			config,
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
			if (!queryObj && !options) {
				return;
			}

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

			// check if query or options are valid - non-empty
			if (query && !!Object.keys(query).length) {
				const currentQuery = query;
				const cProps = componentProps[component.componentId];
				const dependentQueries = getDependentQueries(
					state,
					component.componentId,
					orderOfQueries,
				);
				let queryToLog = {
					...{ [component.componentId]: currentQuery },
					...Object.keys(dependentQueries).reduce(
						(acc, q) => ({
							...acc,
							[q]: { ...dependentQueries[q], execute: false },
						}),
						{},
					),
				};
				if (
					[queryTypes.range, queryTypes.term].includes(
						componentToTypeMap[cProps && cProps.componentType],
					)
				) {
					// Avoid logging `value` for term type of components
					// eslint-disable-next-line
					const { value, ...rest } = currentQuery;

					queryToLog = {
						...{ [component.componentId]: rest },
						...Object.keys(dependentQueries).reduce(
							(acc, q) => ({
								...acc,
								[q]: { ...dependentQueries[q], execute: false },
							}),
							{},
						),
					};
				}

				orderOfQueries = [...orderOfQueries, component.componentId];

				queryLog = {
					...queryLog,
					[component.componentId]: queryToLog,
				};

				if (query) {
					// Apply dependent queries
					appbaseQuery = {
						...appbaseQuery,
						...{ [component.componentId]: query },
						...getDependentQueries(state, component.componentId, orderOfQueries),
					};
				}
			}
		});

		state.queryLog = queryLog;

		const handleTransformResponse = (res, component) => {
			if (config.transformResponse && typeof config.transformResponse === 'function') {
				return config.transformResponse(res, component);
			}
			return new Promise(resolveTransformResponse => resolveTransformResponse(res));
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
							.catch(err => responseReject(err));
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
			const allPromises = orderOfQueries.map(
				component =>
					new Promise((responseResolve, responseReject) => {
						handleTransformResponse(res[component], component)
							.then((response) => {
								if (response) {
									if (response.promoted) {
										promotedResults[component] = response.promoted.map(
											promoted => ({
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

									if (response.aggregations) {
										aggregations = {
											...aggregations,
											[component]: response.aggregations,
										};
									}
									const hitsObj = response.hits
										? response.hits
										: response[component].hits;
									hits = {
										...hits,
										[component]: {
											hits: hitsObj.hits,
											total:
												typeof hitsObj.total === 'object'
													? hitsObj.total.value
													: hitsObj.total,
											time: response.took,
										},
									};
									responseResolve();
								}
							})
							.catch((err) => {
								responseReject(err);
							});
					}),
			);

			Promise.all(allPromises).then(() => {
				state = {
					...state,
					hits,
					aggregations,
					promotedResults,
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
						.catch(err => reject(err));
				})
				.catch(err => reject(err));
		} else if (Object.keys(appbaseQuery).length) {
			finalQuery = Object.keys(appbaseQuery).map(c => appbaseQuery[c]);
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
				.catch((err) => {
					reject(err);
				});
		}
	});
}
