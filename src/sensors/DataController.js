import React, { Component } from "react";
import { connect } from "react-redux";
import { View } from "react-native";

import { addComponent, removeComponent, updateQuery } from "../actions";

class DataController extends Component {
	componentDidMount() {
		this.props.addComponent(this.props.componentId);

		const query = this.props.customQuery ? this.props.customQuery : this.defaultQuery;
		if (this.props.defaultSelected) {
			this.props.updateQuery(this.props.componentId, query(this.props.defaultSelected));
		} else {
			this.props.updateQuery(this.props.componentId, query());
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.defaultSelected !== nextProps.defaultSelected) {
			this.props.updateQuery(this.props.componentId, query(nextProps.defaultSelected));
		}
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
