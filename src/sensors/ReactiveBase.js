import React, { Component } from "react";
import { Provider } from "react-redux";
import { Container } from "native-base";
import Appbase from "appbase-js";

import configureStore from "@appbaseio/reactivecore";

export default class ReactiveBase extends Component {
	constructor(props) {
		super(props);

		this.type = props.type ? props.type : "*";

		const credentials = props.url && props.url.trim() !== "" && !props.credentials
			? "user:pass"
			: props.credentials;

		const config = {
			url: props.url && props.url.trim() !== "" ? props.url : "https://scalr.api.appbase.io",
			app: props.app,
			credentials: props.credentials,
			type: this.type
		};

		const appbaseRef = new Appbase(config);
		this.store = configureStore({ config, appbaseRef });
	}

	render() {
		return (
			<Provider store={this.store}>
				<Container>
					{this.props.children}
				</Container>
			</Provider>
		);
	}
}
