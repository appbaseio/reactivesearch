import React, { Component } from 'react';
import { createProvider } from 'react-redux';
import { Container } from 'native-base';
import Appbase from 'appbase-js';

import configureStore, { storeKey } from '@appbaseio/reactivecore';

import types from '@appbaseio/reactivecore/lib/utils/types';

import ThemeProvider from '../../theme/ThemeProvider';
import theme from '../../theme';

/* use a custom store key so reactivesearch does not interfere
   with a different redux store in a nested context */
const Provider = createProvider(storeKey);

// for network debugging while development
// GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;

class ReactiveBase extends Component {
	constructor(props) {
		super(props);

		this.type = props.type ? props.type : '*';

		const credentials
			= props.url && props.url.trim() !== '' && !props.credentials ? null : props.credentials;

		const config = {
			url: props.url && props.url.trim() !== '' ? props.url : 'https://scalr.api.appbase.io',
			app: props.app,
			credentials,
			type: this.type,
		};

		const { headers = {} } = props;
		const appbaseRef = Appbase(config);
		this.store = configureStore({ config, appbaseRef, headers });
	}

	render() {
		return (
			<ThemeProvider theming={{ ...theme, ...this.props.theme }}>
				<Provider store={this.store}>
					<Container>{this.props.children}</Container>
				</Provider>
			</ThemeProvider>
		);
	}
}

ReactiveBase.propTypes = {
	type: types.string,
	url: types.string,
	credentials: types.string,
	headers: types.headers,
	app: types.stringRequired,
	theme: types.style,
	children: types.children,
};

export default ReactiveBase;
