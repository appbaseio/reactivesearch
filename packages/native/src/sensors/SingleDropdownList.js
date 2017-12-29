import React, { Component } from 'react';
import { Picker } from 'native-base';
import { connect } from 'react-redux';

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryOptions,
} from '@appbaseio/reactivecore/lib/actions';
import {
	isEqual,
	getQueryOptions,
	pushToAndClause,
	checkValueChange,
	getAggsOrder,
	checkPropChange,
} from '@appbaseio/reactivecore/lib/utils/helper';

import types from '@appbaseio/reactivecore/lib/utils/types';

const Item = Picker.Item;

class SingleDropdownList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentValue: '',
			options: [],
		};
		this.type = 'Term';
		this.internalComponent = `${this.props.componentId}__internal`;
	}

	componentDidMount() {
		this.props.addComponent(this.internalComponent);
		this.props.addComponent(this.props.componentId);
		this.setReact(this.props);

		this.updateQueryOptions(this.props);

		if (this.props.defaultSelected) {
			this.setValue(this.props.defaultSelected);
		}
	}

	componentWillReceiveProps(nextProps) {
		checkPropChange(
			this.props.react,
			nextProps.react,
			() => this.setReact(nextProps),
		);
		checkPropChange(
			this.props.options,
			nextProps.options,
			() => {
				this.setState({
					options: nextProps.options[nextProps.dataField].buckets || [],
				});
			},
		);
		checkPropChange(
			this.props.defaultSelected,
			nextProps.defaultSelected,
			() => this.setValue(nextProps.defaultSelected, nextProps),
		);
		checkPropChange(
			this.props.sortBy,
			nextProps.sortBy,
			() => this.updateQueryOptions(nextProps),
		);
	}

	componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
		this.props.removeComponent(this.internalComponent);
	}

	setReact = (props) => {
		const { react } = props;
		if (react) {
			const newReact = pushToAndClause(react, this.internalComponent);
			props.watchComponent(props.componentId, newReact);
		} else {
			props.watchComponent(props.componentId, { and: this.internalComponent });
		}
	};

	defaultQuery = (value, props) => {
		if (this.selectAll) {
			return {
				exists: {
					field: [props.dataField],
				},
			};
		} else if (value) {
			return {
				[this.type]: {
					[props.dataField]: value,
				},
			};
		}
	}

	setValue = (value, props = this.props) => {
		const performUpdate = () => {
			this.setState({
				currentValue: value,
			});
			this.updateQuery(value, props);
		};
		checkValueChange(
			props.componentId,
			value,
			props.beforeValueChange,
			props.onValueChange,
			performUpdate,
		);
	};

	handleValueChange = (value) => {
		this.setValue(value, this.props);
	}

	updateQuery = (value, props) => {
		const query = props.customQuery || this.defaultQuery;
		let callback = null;
		if (props.onQueryChange) {
			callback = props.onQueryChange;
		}
		props.updateQuery(props.componentId, query(value, props), value, props.filterLabel, callback);
	}

	updateQueryOptions = (props) => {
		const queryOptions = getQueryOptions(props);
		queryOptions.aggs = {
			[props.dataField]: {
				terms: {
					field: props.dataField,
					size: 100,
					order: getAggsOrder(props.sortBy),
				},
			},
		};
		props.setQueryOptions(this.internalComponent, queryOptions);
		// Since the queryOptions are attached to the internal component,
		// we need to notify the subscriber (parent component)
		// that the query has changed because no new query will be
		// auto-generated for the internal component as its
		// dependency tree is empty
		props.updateQuery(this.internalComponent, null);
	}

	render() {
		return (
			<Picker
				iosHeader="Select one"
				mode="dropdown"
				placeholder={this.props.placeholder}
				selectedValue={this.state.currentValue}
				onValueChange={this.handleValueChange}
			>
				{
					this.state.options.map(item => (
						<Picker.Item key={item.key} label={item.key} value={item.key} />
					))
				}
			</Picker>
		);
	}
}

SingleDropdownList.propTypes = {
	componentId: types.componentId,
	addComponent: types.addComponent,
	dataField: types.dataField,
	sortBy: types.sortByWithCount,
	setQueryOptions: types.setQueryOptions,
	updateQuery: types.updateQuery,
	defaultSelected: types.string,
	react: types.react,
	options: types.options,
	removeComponent: types.removeComponent,
	beforeValueChange: types.beforeValueChange,
	onValueChange: types.onValueChange,
	customQuery: types.customQuery,
	onQueryChange: types.onQueryChange,
	placeholder: types.placeholder,
};

SingleDropdownList.defaultProps = {
	size: 100,
	placeholder: 'Select a value',
	sortBy: 'count',
};

const mapStateToProps = (state, props) => ({
	options: state.aggregations[props.componentId],
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	updateQuery: (component, query, value, filterLabel, onQueryChange) => dispatch(updateQuery(component, query, value, filterLabel, onQueryChange)),
	setQueryOptions: (component, props) => dispatch(setQueryOptions(component, props)),
});

export default connect(mapStateToProps, mapDispatchtoProps)(SingleDropdownList);
