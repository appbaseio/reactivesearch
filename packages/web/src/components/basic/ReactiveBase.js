/* eslint-disable global-require */

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import Appbase from 'appbase-js';
import { ThemeProvider } from 'emotion-theming';

import configureStore from '@appbaseio/reactivecore';
import types from '@appbaseio/reactivecore/lib/utils/types';
import URLParamsProvider from './URLParamsProvider';

import theme from '../../styles/theme';

const URLSearchParams = require('url-search-params');

class ReactiveBase extends Component {
	constructor(props) {
		super(props);

		this.type = props.type ? props.type : '*';

		const credentials = props.url && props.url.trim() !== '' && !props.credentials
			? 'user:pass'
			: props.credentials;

		const config = {
			url: props.url && props.url.trim() !== '' ? props.url : 'https://scalr.api.appbase.io',
			app: props.app,
			credentials,
			type: this.type,
		};

		this.params = new URLSearchParams(window.location.search);
		let selectedValues = {};

		try {
			Array.from(this.params.keys()).forEach((key) => {
				selectedValues = { ...selectedValues, [key]: { value: JSON.parse(this.params.get(key)) } };
			});
		} catch (e) {
			selectedValues = {};
		}

		const { headers = {} } = props;

		const appbaseRef = new Appbase(config);
		this.store = configureStore({
			config,
			appbaseRef,
			selectedValues,
			headers,
		});
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

	render() {
		return (
			<ThemeProvider theme={{ ...theme, ...this.props.theme }}>
				<Provider store={this.store}>
					<URLParamsProvider params={this.params} headers={this.props.headers}>
						{this.props.children}
					</URLParamsProvider>
				</Provider>
			</ThemeProvider>
		);
	}
}

ReactiveBase.defaultProps = {
	theme: {},
};

ReactiveBase.propTypes = {
	type: types.string,
	url: types.string,
	credentials: types.string,
	app: types.stringRequired,
	children: types.children,
	theme: types.style,
	headers: types.headers,
};

export default ReactiveBase;
