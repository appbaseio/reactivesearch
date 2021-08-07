import configureStore from '@appbaseio/reactivecore';
import { isEqual } from '@appbaseio/reactivecore/lib/utils/helper';
import { updateAnalyticsConfig } from '@appbaseio/reactivecore/lib/actions/analytics';
import VueTypes from 'vue-types';
import Appbase from 'appbase-js';
import 'url-search-params-polyfill';

import Provider from '../Provider';
import { composeThemeObject } from '../../utils/index';
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
		const { analyticsConfig } = this;
		// TODO: Remove in 2.0
		if (analyticsConfig !== undefined) {
			console.warn(
				'Warning(ReactiveSearch): The `analyticsConfig` prop has been marked as deprecated, please use the `appbaseConfig` prop instead.',
			);
		}
	},
	props: {
		app: types.stringRequired,
		analytics: VueTypes.bool,
		analyticsConfig: types.analyticsConfig,
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
		className: types.string,
		initialState: VueTypes.object.def({}),
		transformRequest: types.func,
		transformResponse: types.func,
		as: VueTypes.string.def('div'),
		getSearchParams: types.func,
		setSearchParams: types.func,
	},
	provide() {
		return {
			theme_reactivesearch: composeThemeObject(
				getTheme(this.$props.themePreset),
				this.$props.theme,
			),
			store: this.store,
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
		analyticsConfig(newVal, oldVal) {
			if (!isEqual(newVal, oldVal)) {
				if (this.store) {
					this.store.dispatch(updateAnalyticsConfig(newVal));
				}
			}
		},
		appbaseConfig(newVal, oldVal) {
			if (!isEqual(newVal, oldVal)) {
				if (this.store) {
					this.store.dispatch(updateAnalyticsConfig(newVal));
				}
			}
		},
	},
	methods: {
		updateState(props) {
			this.setStore(props);
			this.key = `${this.state.key}-0`;
		},
		setStore(props) {
			const credentials =
				props.url && props.url.trim() !== '' && !props.credentials
					? null
					: props.credentials;
			const appbaseConfig = {
				...props.analyticsConfig,
				...props.appbaseConfig,
			};
			const config = {
				url:
					props.url && props.url.trim() !== ''
						? props.url
						: 'https://scalr.api.appbase.io',
				app: props.app,
				credentials,
				type: props.type ? props.type : '*',
				transformRequest: props.transformRequest,
				transformResponse: props.transformResponse,
				enableAppbase: props.enableAppbase,
				analytics: props.appbaseConfig
					? props.appbaseConfig.recordAnalytics
					: props.analytics,
				analyticsConfig: appbaseConfig,
			};
			let queryParams = '';

			if (typeof window !== 'undefined') {
				queryParams = window.location.search;
			} else {
				queryParams = props.queryParams || '';
			}

			const params = new URLSearchParams(queryParams);
			let selectedValues = {};

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
					selectedValues = {
						...selectedValues,
						[key]: selectedValue,
					};
				} catch (e) {
					// Do not add to selectedValues if JSON parsing fails.
				}
			});

			const { themePreset } = props;
			const headers = { 'X-Search-Client': 'ReactiveSearch Vue', ...props.headers };
			const appbaseRef = Appbase(config);

			if (this.$props.transformRequest) {
				appbaseRef.transformRequest = this.$props.transformRequest;
			}

			if (this.$props.transformResponse) {
				appbaseRef.transformResponse = this.$props.transformResponse;
			}

			const initialState = {
				config: {
					...config,
					mapKey: props.mapKey,
					themePreset,
				},
				appbaseRef,
				selectedValues,
				headers,
				...this.$props.initialState,
			};
			this.store = configureStore(initialState);
		},
	},
	render() {
		const children = this.$slots.default;
		const { style, className } = this.$props;
		const headers = { 'X-Search-Client': 'ReactiveSearch Vue', ...this.$props.headers };
		return (
			<Provider store={this.store}>
				<URLParamsProvider
					as={this.$props.as}
					headers={headers}
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
