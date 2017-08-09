import React, { Component } from "react";
import { TextInput } from "react-native";
import { connect } from "react-redux";

import { addComponent, removeComponent } from "../actions";

class TextField extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentValue: ""
		};
	}

	componentDidMount() {
		this.props.addComponent(this.props.componentId);
	}

	componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
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

const mapStateToProps = state => ({
	components: state.components
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component))
});

export default connect(mapStateToProps, mapDispatchtoProps)(TextField);
