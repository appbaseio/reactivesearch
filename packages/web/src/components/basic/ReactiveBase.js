/* eslint-disable global-require */

import React, { Component } from 'react';
import { createProvider } from 'react-redux';
import Appbase from 'appbase-js';
import { ThemeProvider } from 'emotion-theming';

import configureStore, { storeKey } from '@appbaseio/reactivecore';
import { checkSomePropChange } from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';
import URLParamsProvider from './URLParamsProvider';

import getTheme from '../../styles/theme';
import { composeThemeObject } from '../../utils';

const URLSearchParams = require('url-search-params');

/* use a custom store key so reactivesearch does not interfere
   with a different redux store in a nested context */
const Provider = createProvider(storeKey);

class ReactiveBase extends Component {
	constructor(props) {
		super(props);

		this.state = {
			key: '__REACTIVE_BASE__',
		};

		this.setStore(props);
	}

	componentWillReceiveProps(nextProps) {
		checkSomePropChange(
			this.props,
			nextProps,
			['app', 'url', 'type', 'credentials', 'mapKey', 'headers'],
			() => {
				this.setStore(nextProps);
				this.setState((state => ({
					key: `${state.key}-0`,
				})));
			},
		);
	}

	componentDidCatch() {
		console.error(
			'An error has occured. You\'re using Reactivesearch Version:',
			`${process.env.VERSION || require('../../../package.json').version}.`,
			'If you think this is a problem with Reactivesearch, please try updating',
			'to the latest version. If you\'re already at the latest version, please open',
			'an issue at https://github.com/appbaseio/reactivesearch/issues',
		);
	}

	setStore = (props) => {
		this.type = props.type ? props.type : '*';

		const credentials = props.url && props.url.trim() !== '' && !props.credentials
			? null
			: props.credentials;

		const config = {
			url: props.url && props.url.trim() !== '' ? props.url : 'https://scalr.api.appbase.io',
			app: props.app,
			credentials,
			type: this.type,
			beforeSend: props.beforeSend,
			analytics: props.analytics,
		};

		let queryParams = '';
		if (typeof window !== 'undefined') {
			queryParams = window.location.search;
		} else {
			queryParams = props.queryParams || '';
		}

		this.params = new URLSearchParams(queryParams);
		let selectedValues = {};

		try {
			Array.from(this.params.keys()).forEach((key) => {
				selectedValues = {
					...selectedValues,
					[key]: { value: JSON.parse(this.params.get(key)) },
				};
			});
		} catch (e) {
			console.error('REACTIVESEARCH - An error occured while parsing the URL state.', e);
			selectedValues = {};
		}

		const { headers = {}, themePreset } = props;
		const appbaseRef = Appbase(config);

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
		const theme = composeThemeObject(
			getTheme(this.props.themePreset),
			this.props.theme,
		);

		return (
			<ThemeProvider
				theme={theme}
				key={this.state.key}
			>
				<Provider store={this.store}>
					<URLParamsProvider
						params={this.params}
						headers={this.props.headers}
						style={this.props.style}
						className={this.props.className}
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
};

ReactiveBase.propTypes = {
	app: types.stringRequired,
	children: types.children,
	credentials: types.string,
	headers: types.headers,
	queryParams: types.string,
	theme: types.style,
	themePreset: types.themePreset,
	type: types.string,
	url: types.string,
	beforeSend: types.func,
	mapKey: types.string,
	style: types.style,
	className: types.string,
	initialState: types.children,
	analytics: types.bool,
};

export default ReactiveBase;
