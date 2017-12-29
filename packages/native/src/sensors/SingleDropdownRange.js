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
import { isEqual, checkValueChange, checkPropChange } from '@appbaseio/reactivecore/lib/utils/helper';

import types from '@appbaseio/reactivecore/lib/utils/types';

const Item = Picker.Item;

class SingleDropdownRange extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentValue: null,
		};
		this.type = 'range';
	}

	componentDidMount() {
		this.props.addComponent(this.props.componentId);
		this.setReact(this.props);
		if (this.props.defaultSelected) {
			this.setValue(this.props.defaultSelected, true);
		}
	}

	componentWillReceiveProps(nextProps) {
		checkPropChange(
			this.props.react,
			nextProps.react,
			() => this.setReact(nextProps),
		);
		checkPropChange(
			this.props.defaultSelected,
			nextProps.defaultSelected,
			() => this.setValue(nextProps.defaultSelected, true, nextProps),
		);
	}

	componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
	}

	setReact(props) {
		if (props.react) {
			props.watchComponent(props.componentId, props.react);
		}
	}

	defaultQuery = (value, props) => {
		if (value) {
			return {
				range: {
					[props.dataField]: {
						gte: value.start,
						lte: value.end,
						boost: 2.0,
					},
				},
			};
		}
		return null;
	}

	setValue = (value, isDefaultValue = false, props = this.props) => {
		const currentValue = isDefaultValue
			? props.data.find(item => item.label === value)
			: value;
		const performUpdate = () => {
			this.setState({
				currentValue,
			});
			this.updateQuery(currentValue, props);
		};
		checkValueChange(
			props.componentId,
			currentValue,
			props.beforeValueChange,
			props.onValueChange,
			performUpdate,
		);
	}

	updateQuery = (value, props) => {
		const query = props.customQuery || this.defaultQuery;
		let callback = null;
		if (props.onQueryChange) {
			callback = props.onQueryChange;
		}
		props.updateQuery(props.componentId, query(value, props), value, props.filterLabel, callback);
	}

	render() {
		return (
			<Picker
				iosHeader="Select one"
				mode="dropdown"
				placeholder={this.props.placeholder}
				selectedValue={this.state.currentValue}
				onValueChange={item => this.setValue(item)}
			>
				{
					this.props.data.map(item => (
						<Picker.Item key={item.label} label={item.label} value={item} />
					))
				}
			</Picker>
		);
	}
}

SingleDropdownRange.propTypes = {
	addComponent: types.addComponent,
	componentId: types.componentId,
	defaultSelected: types.string,
	react: types.react,
	removeComponent: types.removeComponent,
	dataField: types.dataField,
	data: types.data,
	beforeValueChange: types.beforeValueChange,
	onValueChange: types.onValueChange,
	customQuery: types.customQuery,
	onQueryChange: types.onQueryChange,
	updateQuery: types.updateQuery,
	placeholder: types.placeholder,
};

SingleDropdownRange.defaultProps = {
	placeholder: 'Select a value',
};

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	updateQuery: (component, query, value, filterLabel, customQuery) => dispatch(updateQuery(component, query, value, filterLabel, customQuery)),
});

export default connect(null, mapDispatchtoProps)(SingleDropdownRange);
