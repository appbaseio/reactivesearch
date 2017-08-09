import React, { Component } from "react";
import { Provider } from "react-redux";
import { View } from "react-native";

import configureStore from "../store/configureStore";

export default class ReactiveBase extends Component {
	constructor(props) {
		super(props);

		this.store = configureStore();
	}

	render() {
		return (
			<Provider store={this.store}>
				{this.props.children}
			</Provider>
		);
	}
}
