import React, { Component } from 'react';

import {
	addComponent,
	removeComponent,
	updateQuery,
	setQueryListener
} from '@appbaseio/reactivecore/lib/actions';
import { isEqual, checkValueChange } from '@appbaseio/reactivecore/lib/utils/helper';

import types from '@appbaseio/reactivecore/lib/utils/types';

import Container from '../../styles/Container';
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

	static defaultQuery() {
		return {
			match_all: {},
		};
	}

	updateQuery = (defaultSelected = null, props) => {
		this.locked = true;
		const query = props.customQuery || DataController.defaultQuery;

		const performUpdate = () => {
			props.updateQuery({
				componentId: props.componentId,
				query: query(defaultSelected, props),
				value: defaultSelected,
				label: props.filterLabel,
				showFilter: props.showFilter,
				URLParams: props.URLParams,
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
		return (
			<Container style={this.props.style} className={this.props.className}>
				{this.props.children}
			</Container>
		);
	}
}

DataController.defaultProps = {
	className: null,
	showFilter: true,
	style: {},
	URLParams: false,
};

DataController.propTypes = {
	addComponent: types.funcRequired,
	removeComponent: types.funcRequired,
	setQueryListener: types.funcRequired,
	updateQuery: types.funcRequired,
	selectedValue: types.selectedValue,
	// component props
	componentId: types.stringRequired,
	beforeValueChange: types.func,
	children: types.children,
	className: types.string,
	customQuery: types.func,
	// DataController can accept any defaultSelected depending on the query used
	defaultSelected: types.any, // eslint-disable-line
	filterLabel: types.string,
	onQueryChange: types.func,
	onValueChange: types.func,
	showFilter: types.bool,
	style: types.style,
	URLParams: types.boolRequired,
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
	setQueryListener: (component, onQueryChange, beforeQueryChange) =>
		dispatch(setQueryListener(component, onQueryChange, beforeQueryChange)),
});

export default connect(mapStateToProps, mapDispatchtoProps)(DataController);
