import React, { Component } from 'react';
import { connect } from 'react-redux';

import { addComponent, removeComponent, updateQuery } from '@appbaseio/reactivecore/lib/actions';
import { isEqual, checkValueChange } from '@appbaseio/reactivecore/lib/utils/helper';

import types from '@appbaseio/reactivecore/lib/utils/types';

class DataController extends Component {
	componentDidMount() {
		this.locked = false;
		this.props.addComponent(this.props.componentId);

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

		const { onQueryChange = null } = props;

		const performUpdate = () => {
			props.updateQuery({
				componentId: props.componentId,
				query: query(defaultSelected, props),
				value: defaultSelected,
				label: props.filterLabel,
				showFilter: props.showFilter,
				onQueryChange,
				URLParams: props.URLParams,
			});
			this.locked = false;
		};

		checkValueChange(
			props.componentId,
			defaultSelected,
			props.beforeValueChange,
			props.onValueChange,
			performUpdate,
		);
	};

	render() {
		return (
			<div style={this.props.style} className={this.props.className}>
				{this.props.children}
			</div>
		);
	}
}

DataController.defaultProps = {
	URLParams: false,
	showFilter: true,
	style: {},
	className: null,
};

DataController.propTypes = {
	componentId: types.stringRequired,
	addComponent: types.funcRequired,
	// DataController can accept any defaultSelected depending on the query used
	defaultSelected: types.any, // eslint-disable-line
	selectedValue: types.selectedValue,
	removeComponent: types.funcRequired,
	beforeValueChange: types.func,
	onValueChange: types.func,
	customQuery: types.func,
	onQueryChange: types.func,
	updateQuery: types.funcRequired,
	filterLabel: types.string,
	URLParams: types.boolRequired,
	showFilter: types.bool,
	children: types.children,
	style: types.style,
	className: types.string,
};

const mapStateToProps = (state, props) => ({
	selectedValue: (
		state.selectedValues[props.componentId]
		&& state.selectedValues[props.componentId].value
	) || null,
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
});

export default connect(mapStateToProps, mapDispatchtoProps)(DataController);
