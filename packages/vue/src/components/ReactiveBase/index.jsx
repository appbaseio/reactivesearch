import configureStore from '@appbaseio/reactivecore';
import VueTypes from 'vue-types';
import Appbase from 'appbase-js';
import Provider from '../Provider';
import { composeThemeObject } from '../../utils/index';
import types from '../../utils/vueTypes';
import URLParamsProvider from '../URLParamsProvider.jsx';
import getTheme from '../../styles/theme';

const URLSearchParams = require('url-search-params');

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
	props: {
		app: types.stringRequired,
		analytics: VueTypes.bool.def(false),
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
	},
	provide() {
		return {
			theme: composeThemeObject(getTheme(this.$props.themePreset), this.$props.theme),
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
	},
	methods: {
		updateState(props) {
			this.setStore(props);
			this.key = `${state.key}-0`;
		},
		setStore(props) {
			const credentials
				= props.url && props.url.trim() !== '' && !props.credentials
					? null
					: props.credentials;
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
				analytics: props.analytics,
			};
			let queryParams = '';

			if (typeof window !== 'undefined') {
				queryParams = window.location.search;
			} else {
				queryParams = props.queryParams || '';
			}

			const params = new URLSearchParams(queryParams);
			let selectedValues = {};

			Array.from(params.keys()).forEach(key => {
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

			const { headers = {}, themePreset } = props;
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
		const { headers, style, className } = this.$props;
		return (
			<Provider store={this.store}>
				<URLParamsProvider headers={headers} style={style} className={className}>
					{children}
				</URLParamsProvider>
			</Provider>
		);
	},
};
ReactiveBase.install = function(Vue) {
	Vue.component(ReactiveBase.name, ReactiveBase);
};

export default ReactiveBase;
