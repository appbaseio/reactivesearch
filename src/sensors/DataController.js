import React, { Component } from "react";
import { connect } from "react-redux";
import { View } from "react-native";

import { addComponent, removeComponent, updateQuery } from "../actions";

class DataController extends Component {
	componentDidMount() {
		this.props.addComponent(this.props.componentId);

		const query = this.props.customQuery ? this.props.customQuery : this.defaultQuery;
		this.props.updateQuery(this.props.componentId, query());
	}

	componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
	}

	defaultQuery() {
		return {
			"match_all": {}
		}
	}

	render() {
		return (
			<View>
				{this.props.children}
			</View>
		);
	}
}

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	updateQuery: (component, query) => dispatch(updateQuery(component, query))
});

export default connect(null, mapDispatchtoProps)(DataController);
