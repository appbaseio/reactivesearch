import React, { Component } from "react";
import { TextInput } from "react-native";
import { connect } from "react-redux";

import { addComponent, removeComponent } from "../actions";
import { updateQuery } from "../utils/helper.js";

class TextField extends Component {
	constructor(props) {
		super(props);

		this.type = "match";
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

	defaultQuery(value) {
		return {
			[this.type]: {
				[this.props.appbaseField]: value
			}
		};
	}

	setValue(value) {
		this.setState({
			currentValue: value
		}, () => {
			updateQuery(this.props.componentId, query)
		})
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
