import React, { Component } from "react";
import { connect } from "react-redux";
import { View } from "react-native";

import {
	addComponent,
	removeComponent,
	updateQuery
} from "@appbaseio/reactivecore/lib/actions";
import { checkValueChange, checkPropChange } from "@appbaseio/reactivecore/lib/utils/helper";

import types from "@appbaseio/reactivecore/lib/utils/types";

class DataController extends Component {
	componentDidMount() {
		this.props.addComponent(this.props.componentId);

		if (this.props.defaultSelected) {
			this.updateQuery(this.props.defaultSelected, this.props);
		} else {
			this.updateQuery();
		}
	}

	componentWillReceiveProps(nextProps) {
		checkPropChange(
			this.props.defaultSelected,
			nextProps.defaultSelected,
			() => this.updateQuery(nextProps.defaultSelected, nextProps)
		);
	}

	componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
	}

	defaultQuery() {
		return {
			"match_all": {}
		}
	}

	updateQuery = (defaultSelected = null, props = this.props) => {
		const query = props.customQuery ? props.customQuery : this.defaultQuery;
		const callback = props.onQueryChange || null;
		const performUpdate = () => {
			props.updateQuery(
				props.componentId,
				query(defaultSelected, props),
				defaultSelected,
				props.filterLabel,
				callback
			);
		}
		checkValueChange(
			props.componentId,
			defaultSelected,
			props.beforeValueChange,
			props.onValueChange,
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

DataController.propTypes = {
	addComponent: types.addComponent,
	componentId: types.componentId,
	// DataController can accept any defaultSelected depending on the query used
	defaultSelected: types.any,	// eslint-disable-line
	removeComponent: types.removeComponent,
	customQuery: types.customQuery,
	onQueryChange: types.onQueryChange,
	updateQuery: types.updateQuery,
	beforeValueChange: types.beforeValueChange,
	onValueChange: types.onValueChange,
	children: types.children,
	filterLabel: types.filterLabel
}

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	updateQuery: (component, query, value, filterLabel, onQueryChange) => dispatch(
		updateQuery(component, query, value, filterLabel, onQueryChange)
	)
});

export default connect(null, mapDispatchtoProps)(DataController);
