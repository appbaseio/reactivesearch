import React, { Component } from "react";
import { connect } from "react-redux";
import { View } from "react-native";

import { addComponent, removeComponent, updateQuery } from "../actions";
import { checkValueChange } from "../utils/helper";

class DataController extends Component {
	componentDidMount() {
		this.props.addComponent(this.props.componentId);

		if (this.props.defaultSelected) {
			this.updateQuery(this.props.defaultSelected);
		} else {
			this.updateQuery();
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.defaultSelected !== nextProps.defaultSelected) {
			this.updateQuery(nextProps.defaultSelected);
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

	updateQuery = (defaultSelected = null) => {
		const query = this.props.customQuery ? this.props.customQuery : this.defaultQuery;
		const callback = this.props.onQueryChange || null;
		const performUpdate = () => {
			this.props.updateQuery(this.props.componentId, query(defaultSelected), callback);
		}
		checkValueChange(
			this.props.componentId,
			defaultSelected,
			this.props.beforeValueChange,
			this.props.onValueChange,
			performUpdate
		);
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
	updateQuery: (component, query, onQueryChange) => dispatch(updateQuery(component, query, onQueryChange))
});

export default connect(null, mapDispatchtoProps)(DataController);
