import configureStore from '@appbaseio/reactivecore';
import { isEqual, transformRequestUsingEndpoint } from '@appbaseio/reactivecore/lib/utils/helper';
import { updateAnalyticsConfig } from '@appbaseio/reactivecore/lib/actions/analytics';
import VueTypes from 'vue-types';
import Appbase from 'appbase-js';
import AppbaseAnalytics from '@appbaseio/analytics'
import 'url-search-params-polyfill';

import Provider from '../Provider';
import { composeThemeObject, X_SEARCH_CLIENT } from '../../utils/index';
import types from '../../utils/vueTypes';
import URLParamsProvider from '../URLParamsProvider.jsx';
import getTheme from '../../styles/theme';

const ReactiveBase = {
	name: 'ReactiveBase',
	data() {
		this.state = {
			key: '__REACTIVE_BASE__',
		};
		return this.state;
	},
	created() {
		this.setStore(this.$props);
	},
	mounted() {
		const { enableAppbase, endpoint } = this;
		if (!enableAppbase && endpoint) {
			console.warn(
				'Warning(ReactiveSearch): The `endpoint` prop works only when `enableAppbase` prop is set to true.',
			);
		}
	},
	props: {
		app: types.string,
		analytics: VueTypes.bool,
		appbaseConfig: types.appbaseConfig,
		enableAppbase: VueTypes.bool.def(false),
		credentials: types.string,
		headers: types.headers,
		queryParams: types.string,
		theme: VueTypes.object.def({}),
		themePreset: VueTypes.string.def('light'),
		type: types.string,
		url: types.string,
		mapKey: types.string,
		initialQueriesSyncTime: types.number,
		className: types.string,
		initialState: VueTypes.object.def({}),
		transformRequest: types.func,
		transformResponse: types.func,
		as: VueTypes.string.def('div'),
		getSearchParams: types.func,
		setSearchParams: types.func,
		mongodb: types.mongodb,
		endpoint: types.endpointConfig,
		preferences: VueTypes.object,
	},
	provide() {
		return {
			theme_reactivesearch: composeThemeObject(
				getTheme(this.$props.themePreset),
				this.$props.theme,
			),
			store: this.store,
			$searchPreferences: this.preferences,
		};
	},
	watch: {
		app() {
			this.updateState(this.$props);
		},
		url() {
			this.updateState(this.$props);
		},
		type() {
			this.updateState(this.$props);
		},
		credentials() {
			this.updateState(this.$props);
		},
		mapKey() {
			this.updateState(this.$props);
		},
		headers() {
			this.updateState(this.$props);
		},
		appbaseConfig(newVal, oldVal) {
			if (!isEqual(newVal, oldVal)) {
				if (this.store) {
					this.store.dispatch(updateAnalyticsConfig(newVal));
				}
			}
		},
		mongodb() {
			this.updateState(this.$props);
		},
	},
	computed: {
		getHeaders() {
			const { enableAppbase, headers, appbaseConfig, mongodb, endpoint } = this.$props;
			const { enableTelemetry } = appbaseConfig || {};
			return {
				...(enableAppbase
					&& !mongodb && {
					'X-Search-Client': X_SEARCH_CLIENT,
					...(enableTelemetry === false && { 'X-Enable-Telemetry': false }),
				}),
				...headers,
				...(enableAppbase
					&& endpoint
					&& endpoint.headers && {
					...endpoint.headers,
				}),
			};
		},
	},
	methods: {
		updateState(props) {
			this.setStore(props);
			this.key = `${this.state.key}-0`;
		},
		setStore(props) {
			const credentials
				= props.url && props.url.trim() !== '' && !props.credentials
					? null
					: props.credentials;
			let url = props.url && props.url.trim() !== '' ? props.url : '';
			if (props.enableAppbase && props.endpoint) {
				if (props.endpoint.url) {
					// eslint-disable-next-line prefer-destructuring
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
				type: props.type ? props.type : '*',
				transformRequest: props.transformRequest,
				transformResponse: props.transformResponse,
				enableAppbase: props.enableAppbase,
				analytics: props.appbaseConfig
					? props.appbaseConfig.recordAnalytics
					: props.analytics,
				analyticsConfig: props.appbaseConfig,
				mongodb: props.mongodb,
				endpoint: props.endpoint,
			};
			let queryParams = '';

			if (typeof window !== 'undefined') {
				queryParams = window.location.search;
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

			const { themePreset, enableAppbase, endpoint } = props;

			const appbaseRef = Appbase(config);

			appbaseRef.transformRequest = (request) => {
				const modifiedRequest = enableAppbase
					? transformRequestUsingEndpoint(request, endpoint)
					: request;
				if (props.transformRequest) return props.transformRequest(modifiedRequest);
				return modifiedRequest;
			};

			if (this.$props.transformResponse) {
				appbaseRef.transformResponse = this.$props.transformResponse;
			}
			const analyticsInitConfig = {
				url: url && url.replace(/\/\/.*@/, '//'),
				credentials: appbaseRef.credentials,
				// When endpoint prop is used index is not defined, so we use _default
				index: appbaseRef.app || '_default',
				globalCustomEvents: this.$props.appbaseConfig && this.$props.appbaseConfig.customEvents,
			};

			try {
				if (this.$props.endpoint && this.$props.endpoint.url) {
					// Remove parts between '//' and first '/' in the url
					analyticsInitConfig.url = this.$props.endpoint.url.replace(
						/\/\/(.*?)\/.*/,
						'//$1',
					);
					const headerCredentials = this.$props.endpoint.headers && this.$props.endpoint.headers.Authorization;
					analyticsInitConfig.credentials = headerCredentials && headerCredentials.replace('Basic ', '');
					// Decode the credentials
					analyticsInitConfig.credentials = analyticsInitConfig.credentials && atob(analyticsInitConfig.credentials);
				}
			} catch (e) {
				console.error('Endpoint not set correctly for analytics');
				console.error(e);
			}

			const analyticsRef = AppbaseAnalytics.init(analyticsInitConfig);

			const initialState = {
				config: {
					...config,
					initialQueriesSyncTime: props.initialQueriesSyncTime,
					initialTimestamp: new Date().getTime(),
					mapKey: props.mapKey,
					themePreset,
				},
				appbaseRef,
				analyticsRef,
				selectedValues,
				urlValues,
				headers: this.getHeaders,
				...this.$props.initialState,
			};
			this.store = configureStore(initialState);
			this.analyticsRef = analyticsRef;
		},
	},
	render() {
		const children = this.$slots.default;
		const { style, className } = this.$props;
		return (
			<Provider store={this.store} analyticsRef={this.analyticsRef}>
				<URLParamsProvider
					as={this.$props.as}
					headers={this.getHeaders}
					style={style}
					className={className}
					getSearchParams={this.getSearchParams}
					setSearchParams={this.setSearchParams}
				>
					{children}
				</URLParamsProvider>
			</Provider>
		);
	},
};
ReactiveBase.install = function (Vue) {
	Vue.component(ReactiveBase.name, ReactiveBase);
};

export default ReactiveBase;
