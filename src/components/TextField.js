import React, { Component } from "react";
import { TextInput } from "react-native";

export default class TextField extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentValue: ""
		};
	}

	render() {
		return (
			<TextInput
				placeholder={this.props.placeholder}
				onChangeText={(currentValue) => this.setState({ currentValue })}
				value={this.state.currentValue}
			/>
		);
	}
}
