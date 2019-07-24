/* eslint-disable global-require */

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import Appbase from 'appbase-js';
import 'url-search-params-polyfill';
import { ThemeProvider } from 'emotion-theming';

import configureStore from '@appbaseio/reactivecore';
import { checkSomePropChange } from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';
import URLParamsProvider from './URLParamsProvider';

import getTheme from '../../styles/theme';
import { composeThemeObject, ReactReduxContext } from '../../utils';

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
			['app', 'url', 'type', 'credentials', 'mapKey', 'headers', 'graphQLUrl'],
			() => {
				this.setStore(this.props);
				this.setState(state => ({
					key: `${state.key}-0`,
				}));
			},
		);
	}

	componentDidCatch() {
		console.error(
			"An error has occured. You're using Reactivesearch Version:",
			`${process.env.VERSION || require('../../../package.json').version}.`,
			'If you think this is a problem with Reactivesearch, please try updating',
			"to the latest version. If you're already at the latest version, please open",
			'an issue at https://github.com/appbaseio/reactivesearch/issues',
		);
	}

	setStore = (props) => {
		this.type = props.type ? props.type : '*';

		const credentials
			= props.url && props.url.trim() !== '' && !props.credentials ? null : props.credentials;

		const config = {
			url: props.url && props.url.trim() !== '' ? props.url : 'https://scalr.api.appbase.io',
			app: props.app,
			credentials,
			type: this.type,
			transformRequest: props.transformRequest,
			analytics: props.analytics,
			searchStateHeader: props.searchStateHeader,
			graphQLUrl: props.graphQLUrl,
			transformResponse: props.transformResponse,
		};

		let queryParams = '';
		if (typeof window !== 'undefined') {
			queryParams = props.getSearchParams ? props.getSearchParams() : window.location.search;
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

		const { headers = {}, themePreset } = props;
		const appbaseRef = Appbase(config);
		if (this.props.transformRequest) {
			appbaseRef.transformRequest = this.props.transformRequest;
		}

		const initialState = {
			config: { ...config, mapKey: props.mapKey, themePreset },
			appbaseRef,
			selectedValues,
			headers,
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
						headers={this.props.headers}
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
	analytics: false,
	searchStateHeader: false,
	graphQLUrl: '',
	as: 'div',
};

ReactiveBase.propTypes = {
	app: types.stringRequired,
	searchStateHeader: types.bool,
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
	mapKey: types.string,
	style: types.style,
	className: types.string,
	initialState: types.children,
	analytics: types.bool,
	graphQLUrl: types.string,
	transformResponse: types.func,
	getSearchParams: types.func,
	setSearchParams: types.func,
};

export default ReactiveBase;
