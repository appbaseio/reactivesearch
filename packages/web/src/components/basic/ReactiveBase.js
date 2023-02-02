/* eslint-disable global-require */

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import Appbase from 'appbase-js';
import AppbaseAnalytics from '@appbaseio/analytics';
import 'url-search-params-polyfill';
import { ThemeProvider } from 'emotion-theming';

import configureStore from '@appbaseio/reactivecore';
import {
	checkSomePropChange,
	transformRequestUsingEndpoint,
} from '@appbaseio/reactivecore/lib/utils/helper';
import { updateAnalyticsConfig } from '@appbaseio/reactivecore/lib/actions/analytics';
import { setValues } from '@appbaseio/reactivecore/lib/actions/value';
import types from '@appbaseio/reactivecore/lib/utils/types';
import URLParamsProvider from './URLParamsProvider';

import getTheme from '../../styles/theme';
import {
	composeThemeObject,
	ReactReduxContext,
	SearchPreferencesContext,
	ReduxGetStateContext,
	X_SEARCH_CLIENT,
} from '../../utils';

class ReactiveBase extends Component {
	constructor(props) {
		super(props);

		this.state = {
			key: '__REACTIVE_BASE__',
		};

		this.setStore(props);
	}

	componentDidUpdate(prevProps) {
		checkSomePropChange(
			this.props,
			prevProps,
			[
				'app',
				'url',
				'type',
				'credentials',
				'mapKey',
				'mapLibraries',
				'headers',
				'graphQLUrl',
			],
			() => {
				this.setStore(this.props);
				this.setState(state => ({
					key: `${state.key}-0`,
				}));
			},
		);
		checkSomePropChange(this.props, prevProps, ['reactivesearchAPIConfig'], () => {
			if (this.store) {
				this.store.dispatch(updateAnalyticsConfig(this.props.reactivesearchAPIConfig));
			}
		});
	}

	componentDidCatch(error, errorInfo) {
		console.error(
			"An error has occured. You're using Reactivesearch Version:",
			`${process.env.VERSION || require('../../../package.json').version}.`,
			'If you think this is a problem with Reactivesearch, please try updating',
			"to the latest version. If you're already at the latest version, please open",
			'an issue at https://github.com/appbaseio/reactivesearch/issues',
			error,
			errorInfo,
		);
	}

	get headers() {
		const {
			headers, reactivesearchAPIConfig, mongodb, endpoint,
		} = this.props;
		const { enableTelemetry } = reactivesearchAPIConfig || {};
		return {
			...(!mongodb && {
				'X-Search-Client': X_SEARCH_CLIENT,
				...(enableTelemetry === false && { 'X-Enable-Telemetry': false }),
			}),
			...headers,
			...(endpoint
				&& endpoint.headers && {
				...endpoint.headers,
			}),
		};
	}

	setStore = (props) => {
		this.type = props.type ? props.type : '*';

		const credentials
			= props.url && props.url.trim() !== '' && !props.credentials ? null : props.credentials;

		let url = props.url && props.url.trim() !== '' ? props.url : '';
		if (props.endpoint instanceof Object) {
			if (props.endpoint.url) {
				url = props.endpoint.url;
			} else {
				throw Error(
					'Error(ReactiveSearch): The `endpoint` prop object requires `url` property.',
				);
			}
		}
		const config = {
			url,
			app: props.app,
			credentials,
			type: this.type,
			transformRequest: props.transformRequest,
			analytics: props.reactivesearchAPIConfig
				? props.reactivesearchAPIConfig.recordAnalytics
				: true,
			analyticsConfig: props.reactivesearchAPIConfig,
			graphQLUrl: props.graphQLUrl,
			transformResponse: props.transformResponse,
			mongodb: props.mongodb,
			...(props.endpoint instanceof Object && { endpoint: props.endpoint }),
		};

		let queryParams = '';
		if (typeof window !== 'undefined') {
			queryParams = props.getSearchParams ? props.getSearchParams() : window.location.search;
		} else {
			queryParams = props.queryParams || '';
		}

		const params = new URLSearchParams(queryParams);
		let selectedValues = {};
		let urlValues = {};

		Array.from(params.keys()).forEach((key) => {
			try {
				const parsedParams = JSON.parse(params.get(key));
				const selectedValue = {};
				if (parsedParams.value) {
					selectedValue.value = parsedParams.value;
				} else {
					selectedValue.value = parsedParams;
				}
				if (parsedParams.category) selectedValue.category = parsedParams.category;
				selectedValue.reference = 'URL';
				selectedValues = {
					...selectedValues,
					[key]: selectedValue,
				};
				urlValues = {
					...urlValues,
					[key]: selectedValue.value,
				};
			} catch (e) {
				// Do not add to selectedValues if JSON parsing fails.
			}
		});

		const { themePreset, endpoint, reactivesearchAPIConfig } = props;

		const appbaseRef = Appbase(config);

		appbaseRef.transformRequest = (request) => {
			const modifiedRequest = transformRequestUsingEndpoint(request, endpoint);
			if (this.props.transformRequest) return this.props.transformRequest(modifiedRequest);
			return modifiedRequest;
		};

		const analyticsInitConfig = {
			url: url && url.replace(/\/\/.*@/, '//'),
			credentials: appbaseRef.credentials,
			// When endpoint prop is used index is not defined, so we use _default
			index: appbaseRef.app || '_default',
			globalCustomEvents: reactivesearchAPIConfig && reactivesearchAPIConfig.customEvents,
		};

		try {
			if (this.props.endpoint && this.props.endpoint.url) {
				// Remove parts between '//' and first '/' in the url
				analyticsInitConfig.url = this.props.endpoint.url.replace(/\/\/(.*?)\/.*/, '//$1');
				const headerCredentials
					= this.props.endpoint.headers && this.props.endpoint.headers.Authorization;
				analyticsInitConfig.credentials
					= headerCredentials && headerCredentials.replace('Basic ', '');
				// Decode the credentials
				analyticsInitConfig.credentials
					= analyticsInitConfig.credentials && atob(analyticsInitConfig.credentials);
			}
		} catch (e) {
			console.error('Endpoint not set correctly for analytics');
			console.error(e);
		}

		let analyticsRef = null;
		if (config.analytics) {
			analyticsRef = AppbaseAnalytics.init(analyticsInitConfig);
		}

		const initialState = {
			config: {
				...config,
				mapKey: props.mapKey,
				mapLibraries: props.mapLibraries,
				themePreset,
				initialQueriesSyncTime: props.initialQueriesSyncTime,
				initialTimestamp: new Date().getTime(),
			},
			appbaseRef,
			analyticsRef,
			selectedValues,
			urlValues,
			headers: this.headers,
			...this.props.initialState,
		};

		this.store = configureStore(initialState);

		// server side rendered app to collect context
		if (
			typeof window === 'undefined'
			&& props.contextCollector
			&& !this.calledContextCollector
		) {
			this.calledContextCollector = true;
			const res = props.contextCollector({
				ctx: this.store,
			});

			// necessary for supporting SSR of queryParams
			this.store.dispatch(setValues(res.selectedValues));
		}
	};

	getReduxState = () => this.store.getState();

	render() {
		const theme = composeThemeObject(getTheme(this.props.themePreset), this.props.theme);
		return (
			<SearchPreferencesContext.Provider value={this.props.preferences}>
				<ThemeProvider theme={theme} key={this.state.key}>
					<Provider context={ReactReduxContext} store={this.store}>
						<URLParamsProvider
							headers={this.headers}
							style={this.props.style}
							as={this.props.as}
							className={this.props.className}
							getSearchParams={this.props.getSearchParams}
							setSearchParams={this.props.setSearchParams}
						>
							<ReduxGetStateContext.Provider value={this.getReduxState}>
								{this.props.children}
							</ReduxGetStateContext.Provider>
						</URLParamsProvider>
					</Provider>
				</ThemeProvider>
			</SearchPreferencesContext.Provider>
		);
	}
}

ReactiveBase.defaultProps = {
	theme: {},
	themePreset: 'light',
	initialState: {},
	graphQLUrl: '',
	as: 'div',
	endpoint: null,
};

ReactiveBase.propTypes = {
	app: types.string,
	as: types.string,
	children: types.children,
	credentials: types.string,
	headers: types.headers,
	queryParams: types.string,
	theme: types.style,
	themePreset: types.themePreset,
	type: types.string,
	url: types.string,
	transformRequest: types.func,
	initialQueriesSyncTime: types.number,
	mapKey: types.string,
	mapLibraries: types.stringArray,
	style: types.style,
	className: types.string,
	initialState: types.children,
	analytics: types.bool,
	reactivesearchAPIConfig: types.appbaseConfig,
	graphQLUrl: types.string,
	transformResponse: types.func,
	getSearchParams: types.func,
	setSearchParams: types.func,
	mongodb: types.mongodb,
	preferences: types.preferences,
	endpoint: types.endpoint,
	contextCollector: types.func,
};

export default ReactiveBase;
