import React, { Component } from "react";
import { TextInput } from "react-native";
import { connect } from "react-redux";

import { addComponent, removeComponent, watchComponent, updateQuery } from "../actions";
import { isEqual } from "../utils/helper";

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
		this.setReact(this.props);
	}

	componentWillReceiveProps(nextProps) {
		if (!isEqual(nextProps.react, this.props.react)) {
			this.setReact(nextProps);
		}
	}

	componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
	}

	setReact(props) {
		if (props.react) {
			props.watchComponent(props.componentId, props.react);
		}
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
			this.props.updateQuery(this.props.componentId, this.defaultQuery(value))
		})
	}

	render() {
		return (
			<TextInput
				placeholder={this.props.placeholder}
				onChangeText={(currentValue) => this.setValue(currentValue)}
				value={this.state.currentValue}
				style={{
					borderWidth: 1
				}}
			/>
		);
	}
}

const mapStateToProps = state => ({
	components: state.components,
	watchMan: state.watchMan,
	queryList: state.queryList
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	updateQuery: (component, query) => dispatch(updateQuery(component, query))
});

export default connect(mapStateToProps, mapDispatchtoProps)(TextField);
