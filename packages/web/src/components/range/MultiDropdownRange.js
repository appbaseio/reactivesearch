import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
} from '@appbaseio/reactivecore/lib/actions';
import {
	isEqual,
	checkValueChange,
	checkPropChange,
	getClassName,
} from '@appbaseio/reactivecore/lib/utils/helper';

import types from '@appbaseio/reactivecore/lib/utils/types';

import Title from '../../styles/Title';
import Dropdown from '../shared/Dropdown';

class MultiDropdownRange extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentValue: [],
			showModal: false,
		};

		// selectedValues hold the selected items as keys for O(1) complexity
		this.selectedValues = {};
		this.type = 'range';
		this.locked = false;
	}

	componentWillMount() {
		this.props.addComponent(this.props.componentId);
		this.setReact(this.props);

		if (this.props.selectedValue) {
			this.selectItem(this.props.selectedValue, true);
		} else if (this.props.defaultSelected) {
			this.selectItem(this.props.defaultSelected, true);
		}
	}

	componentWillReceiveProps(nextProps) {
		checkPropChange(
			this.props.react,
			nextProps.react,
			() => this.setReact(nextProps),
		);

		checkPropChange(this.props.dataField, nextProps.dataField, () => {
			this.updateQuery(this.state.currentValue, nextProps);
		});

		if (!isEqual(this.props.defaultSelected, nextProps.defaultSelected)) {
			this.selectItem(nextProps.defaultSelected, true);
		} else if (!isEqual(this.state.currentValue, nextProps.selectedValue)
			&& (nextProps.selectedValue || nextProps.selectedValue === null)) {
			this.selectItem(nextProps.selectedValue, true);
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

	defaultQuery = (values, props) => {
		const generateRangeQuery = (dataField, items) => {
			if (items.length > 0) {
				return items.map(value => ({
					range: {
						[dataField]: {
							gte: value.start,
							lte: value.end,
							boost: 2.0,
						},
					},
				}));
			}
			return null;
		};

		if (values && values.length) {
			const query = {
				bool: {
					should: generateRangeQuery(props.dataField, values),
					minimum_should_match: 1,
					boost: 1.0,
				},
			};
			return query;
		}
		return null;
	};

	selectItem = (item, isDefaultValue = false, props = this.props) => {
		// ignore state updates when component is locked
		if (props.beforeValueChange && this.locked) {
			return;
		}

		this.locked = true;
		let { currentValue } = this.state;

		if (!item) {
			currentValue = [];
			this.selectedValues = {};
		} else if (isDefaultValue) {
			// checking if the items in defaultSeleted exist in the data prop
			currentValue = props.data.filter(value => item.includes(value.label));
			currentValue.forEach((value) => {
				this.selectedValues = { ...this.selectedValues, [value.label]: true };
			});
		} else if (this.selectedValues[item.label]) {
			currentValue = currentValue.filter(value => value.label !== item.label);
			const { [item.label]: del, ...selectedValues } = this.selectedValues;
			this.selectedValues = selectedValues;
		} else {
			currentValue = [...currentValue, item];
			this.selectedValues = { ...this.selectedValues, [item.label]: true };
		}
		const performUpdate = () => {
			this.setState({
				currentValue,
			}, () => {
				this.updateQuery(currentValue, props);
				this.locked = false;
			});
		};

		checkValueChange(
			props.componentId,
			currentValue,
			props.beforeValueChange,
			props.onValueChange,
			performUpdate,
		);
	};

	toggleModal = () => {
		this.setState({
			showModal: !this.state.showModal,
		});
	};

	updateQuery = (value, props) => {
		const query = props.customQuery || this.defaultQuery;

		const { onQueryChange = null } = props;

		props.updateQuery({
			componentId: props.componentId,
			query: query(value, props),
			value,
			label: props.filterLabel,
			showFilter: props.showFilter,
			onQueryChange,
			URLParams: props.URLParams,
		});
	};

	render() {
		return (
			<div style={this.props.style} className={this.props.className}>
				{this.props.title && <Title className={getClassName(this.props.innerClass, 'title') || null}>{this.props.title}</Title>}
				<Dropdown
					innerClass={this.props.innerClass}
					items={this.props.data}
					onChange={this.selectItem}
					selectedItem={this.state.currentValue}
					placeholder={this.props.placeholder}
					keyField="label"
					multi
					returnsObject
				/>
			</div>
		);
	}
}

MultiDropdownRange.propTypes = {
	addComponent: types.funcRequired,
	componentId: types.stringRequired,
	defaultSelected: types.stringArray,
	react: types.react,
	removeComponent: types.funcRequired,
	data: types.data,
	dataField: types.stringRequired,
	customQuery: types.func,
	beforeValueChange: types.func,
	onValueChange: types.func,
	onQueryChange: types.func,
	updateQuery: types.funcRequired,
	supportedOrientations: types.supportedOrientations,
	placeholder: types.string,
	selectedValue: types.selectedValue,
	title: types.title,
	URLParams: types.boolRequired,
	showFilter: types.bool,
	filterLabel: types.filterLabel,
	style: types.style,
	className: types.string,
	innerClass: types.style,
};

MultiDropdownRange.defaultProps = {
	placeholder: 'Select a value',
	URLParams: false,
	showFilter: true,
	style: {},
	className: null,
};

const mapStateToProps = (state, props) => ({
	selectedValue: state.selectedValues[props.componentId]
		? state.selectedValues[props.componentId].value
		: null,
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
});

export default connect(mapStateToProps, mapDispatchtoProps)(MultiDropdownRange);
