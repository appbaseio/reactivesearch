import React, { Component } from 'react';
import { View } from 'react-native';

import {
	addComponent,
	removeComponent,
	updateQuery,
	setQueryListener,
} from '@appbaseio/reactivecore/lib/actions';
import { isEqual, checkValueChange } from '@appbaseio/reactivecore/lib/utils/helper';

import types from '@appbaseio/reactivecore/lib/utils/types';

import { connect } from '../../utils';

class DataController extends Component {
	componentDidMount() {
		this.locked = false;
		this.props.addComponent(this.props.componentId);
		this.props.setQueryListener(this.props.componentId, this.props.onQueryChange, null);

		if (this.props.defaultSelected) {
			this.updateQuery(this.props.defaultSelected, this.props);
		} else {
			this.updateQuery(null, this.props);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (!this.locked) {
			if (!isEqual(this.props.defaultSelected, nextProps.defaultSelected)) {
				this.updateQuery(nextProps.defaultSelected, nextProps);
			} else if (!isEqual(this.props.selectedValue, nextProps.selectedValue)) {
				this.updateQuery(nextProps.selectedValue, nextProps);
			}
		}
	}

	componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
	}

	defaultQuery() {
		return {
			match_all: {},
		};
	}

	updateQuery = (defaultSelected = null, props) => {
		this.locked = true;
		const query = props.customQuery ? props.customQuery : this.defaultQuery;

		const performUpdate = () => {
			props.updateQuery({
				componentId: props.componentId,
				query: query(defaultSelected, props),
				value: defaultSelected,
				label: props.filterLabel,
				showFilter: props.showFilter,
				URLParams: false,
			});
			this.locked = false;
			if (props.onValueChange) props.onValueChange(defaultSelected);
		};

		checkValueChange(
			props.componentId,
			defaultSelected,
			props.beforeValueChange,
			performUpdate,
		);
	};

	render() {
		return <View style={this.props.style}>{this.props.children}</View>;
	}
}

DataController.defaultProps = {
	showFilter: true,
	style: {},
};

DataController.propTypes = {
	componentId: types.stringRequired,
	addComponent: types.funcRequired,
	// DataController can accept any defaultSelected depending on the query used
	defaultSelected: types.any, // eslint-disable-line
	selectedValue: types.selectedValue,
	removeComponent: types.funcRequired,
	setQueryListener: types.funcRequired,
	beforeValueChange: types.func,
	onValueChange: types.func,
	customQuery: types.func,
	onQueryChange: types.func,
	updateQuery: types.funcRequired,
	filterLabel: types.string,
	showFilter: types.bool,
	children: types.children,
	style: types.style,
};

const mapStateToProps = (state, props) => ({
	selectedValue:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value)
		|| null,
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	setQueryListener: (component, onQueryChange, beforeQueryChange) =>
		dispatch(setQueryListener(component, onQueryChange, beforeQueryChange)),
});

export default connect(
	mapStateToProps,
	mapDispatchtoProps,
)(DataController);
