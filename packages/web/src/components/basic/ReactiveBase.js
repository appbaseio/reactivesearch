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

		const appbaseRef = new Appbase(config);
		this.store = configureStore({ config, appbaseRef, selectedValues });
	}

	render() {
		return (
			<ThemeProvider theme={{ ...theme, ...this.props.theme }}>
				<Provider store={this.store}>
					<URLParamsProvider params={this.params}>
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
};

export default ReactiveBase;
