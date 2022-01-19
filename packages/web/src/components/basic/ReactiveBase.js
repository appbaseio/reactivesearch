/* eslint-disable global-require */

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import Appbase from 'appbase-js';
import 'url-search-params-polyfill';
import { ThemeProvider } from 'emotion-theming';

import configureStore from '@appbaseio/reactivecore';
import { checkSomePropChange } from '@appbaseio/reactivecore/lib/utils/helper';
import { updateAnalyticsConfig } from '@appbaseio/reactivecore/lib/actions/analytics';
import types from '@appbaseio/reactivecore/lib/utils/types';
import URLParamsProvider from './URLParamsProvider';

import getTheme from '../../styles/theme';
import { composeThemeObject, ReactReduxContext, X_SEARCH_CLIENT } from '../../utils';

class ReactiveBase extends Component {
	constructor(props) {
		super(props);

		this.state = {
			key: '__REACTIVE_BASE__',
		};

		this.setStore(props);
	}

	componentDidMount() {
		const { analyticsConfig, analytics } = this.props;
		// TODO: Remove in 4.0
		if (analyticsConfig !== undefined) {
			console.warn(
				'Warning(ReactiveSearch): The `analyticsConfig` prop has been marked as deprecated, please use the `appbaseConfig` prop instead.',
			);
		}
		// TODO: Remove in 4.0
		if (analytics !== undefined) {
			console.warn(
				'Warning(ReactiveSearch): The `analytics` prop has been marked as deprecated, please set the `recordAnalytics` property as `true` in `appbaseConfig` prop instead.',
			);
		}
	}

	componentDidUpdate(prevProps) {
		checkSomePropChange(
			this.props,
			prevProps,
			['app', 'url', 'type', 'credentials', 'mapKey', 'headers', 'graphQLUrl'],
			() => {
				this.setStore(this.props);
				this.setState(state => ({
					key: `${state.key}-0`,
				}));
			},
		);
		checkSomePropChange(this.props, prevProps, ['analyticsConfig'], () => {
			if (this.store) {
				this.store.dispatch(updateAnalyticsConfig(this.props.analyticsConfig));
			}
		});
		checkSomePropChange(this.props, prevProps, ['appbaseConfig'], () => {
			if (this.store) {
				this.store.dispatch(updateAnalyticsConfig(this.props.appbaseConfig));
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
			enableAppbase, headers, appbaseConfig, mongodb,
		} = this.props;
		const { enableTelemetry } = appbaseConfig || {};
		return {
			...(enableAppbase
				&& !mongodb && {
				'X-Search-Client': X_SEARCH_CLIENT,
				...(enableTelemetry === false && { 'X-Enable-Telemetry': false }),
			}),
			...headers,
		};
	}

	setStore = (props) => {
		this.type = props.type ? props.type : '*';

		const credentials
			= props.url && props.url.trim() !== '' && !props.credentials ? null : props.credentials;

		const appbaseConfig = {
			...props.analyticsConfig, // TODO: remove in 4.0
			...props.appbaseConfig,
		};
		const config = {
			url: props.url && props.url.trim() !== '' ? props.url : '',
			app: props.app,
			credentials,
			type: this.type,
			transformRequest: props.transformRequest,
			analytics: props.appbaseConfig
				? props.appbaseConfig.recordAnalytics
				: !!props.analytics,
			enableAppbase: props.enableAppbase,
			analyticsConfig: appbaseConfig,
			graphQLUrl: props.graphQLUrl,
			transformResponse: props.transformResponse,
			mongodb: props.mongodb,
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

		const { themePreset } = props;

		const appbaseRef = Appbase(config);
		if (this.props.transformRequest) {
			appbaseRef.transformRequest = this.props.transformRequest;
		}

		const initialState = {
			config: {
				...config,
				mapKey: props.mapKey,
				themePreset,
				initialQueriesSyncTime: props.initialQueriesSyncTime,
				initialTimestamp: new Date().getTime(),
			},
			appbaseRef,
			selectedValues,
			urlValues,
			headers: this.headers,
			...this.props.initialState,
		};
		this.store = configureStore(initialState);
	};

	render() {
		const theme = composeThemeObject(getTheme(this.props.themePreset), this.props.theme);
		return (
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
						{this.props.children}
					</URLParamsProvider>
				</Provider>
			</ThemeProvider>
		);
	}
}

ReactiveBase.defaultProps = {
	theme: {},
	themePreset: 'light',
	initialState: {},
	graphQLUrl: '',
	as: 'div',
	enableAppbase: false,
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
	style: types.style,
	className: types.string,
	initialState: types.children,
	analytics: types.bool,
	enableAppbase: types.bool,
	analyticsConfig: types.analyticsConfig,
	appbaseConfig: types.appbaseConfig,
	graphQLUrl: types.string,
	transformResponse: types.func,
	getSearchParams: types.func,
	setSearchParams: types.func,
	mongodb: types.mongodb,
};

export default ReactiveBase;
