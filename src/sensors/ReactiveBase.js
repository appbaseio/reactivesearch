import React, { Component } from "react";
import { Provider } from "react-redux";
import { View } from "react-native";
import { Container } from "native-base";

import configureStore from "../store/configureStore";

export default class ReactiveBase extends Component {
	constructor(props) {
		super(props);

		this.type = props.type ? props.type : null;
		const config = {
			url: "scalr.api.appbase.io",
			app: props.app,
			credentials: props.credentials,
			type: this.type
		};
		this.store = configureStore({ config });
	}

	render() {
		return (
			<Provider store={this.store}>
				<Container>
					<View style={{...this.props.style, flex: 1}}>
						{this.props.children}
					</View>
				</Container>
			</Provider>
		);
	}
}
