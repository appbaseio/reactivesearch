import React, { Component } from 'react';
import { Picker } from 'native-base';

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryListener,
} from '@appbaseio/reactivecore/lib/actions';
import {
	isEqual,
	checkValueChange,
	checkPropChange,
	getInnerKey,
} from '@appbaseio/reactivecore/lib/utils/helper';

import types from '@appbaseio/reactivecore/lib/utils/types';

import withTheme from '../../theme/withTheme';
import { connect } from '../../utils';

class SingleDropdownRange extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentValue: null,
		};
		this.type = 'range';
		props.setQueryListener(props.componentId, props.onQueryChange, null);
	}

	componentWillMount() {
		this.props.addComponent(this.props.componentId);
		this.setReact(this.props);

		if (this.props.selectedValue) {
			this.setValue(this.props.selectedValue, true);
		} else if (this.props.defaultSelected) {
			this.setValue(this.props.defaultSelected, true);
		}
	}

	componentWillReceiveProps(nextProps) {
		checkPropChange(this.props.react, nextProps.react, () => this.setReact(nextProps));

		checkPropChange(this.props.dataField, nextProps.dataField, () => {
			this.updateQuery(this.state.currentValue, nextProps);
		});

		if (!isEqual(this.props.defaultSelected, nextProps.defaultSelected)) {
			this.setValue(nextProps.defaultSelected, true);
		} else if (!isEqual(this.state.currentValue, nextProps.selectedValue)) {
			this.setValue(nextProps.selectedValue, true);
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
	};

	setValue = (value, isDefaultValue = false, props = this.props) => {
		let currentValue = value;
		if (isDefaultValue) {
			currentValue = props.data.find(item => item.label === value) || null;
		}

		const performUpdate = () => {
			this.setState(
				{
					currentValue,
				},
				() => {
					this.updateQuery(currentValue, props);
					if (props.onValueChange) props.onValueChange(currentValue);
				},
			);
		};

		checkValueChange(props.componentId, currentValue, props.beforeValueChange, performUpdate);
	};

	updateQuery = (value, props) => {
		const query = props.customQuery || this.defaultQuery;

		props.updateQuery({
			componentId: props.componentId,
			query: query(value, props),
			value,
			label: props.filterLabel,
			showFilter: props.showFilter,
			URLParams: false,
		});
	};

	render() {
		return (
			<Picker
				iosHeader="Select one"
				mode="dropdown"
				placeholder={this.props.placeholder}
				selectedValue={this.state.currentValue}
				onValueChange={item => this.setValue(item)}
				style={{
					width: '100%',
					borderRadius: 0,
					...this.props.style,
				}}
				textStyle={{
					color: this.props.theming.textColor,
				}}
				headerTitleStyle={getInnerKey(this.props.innerStyle, 'title')}
				itemTextStyle={{
					flexGrow: 1,
					...getInnerKey(this.props.innerStyle, 'label'),
				}}
				{...getInnerKey(this.props.innerProps, 'picker')}
			>
				{this.props.data.map(item => (
					<Picker.Item
						key={item.label}
						label={item.label}
						value={item}
						{...getInnerKey(this.props.innerProps, 'pickerItem')}
					/>
				))}
			</Picker>
		);
	}
}

SingleDropdownRange.propTypes = {
	addComponent: types.funcRequired,
	componentId: types.stringRequired,
	defaultSelected: types.string,
	react: types.react,
	removeComponent: types.funcRequired,
	setQueryListener: types.funcRequired,
	dataField: types.stringRequired,
	data: types.data,
	beforeValueChange: types.func,
	onValueChange: types.func,
	customQuery: types.func,
	onQueryChange: types.func,
	updateQuery: types.funcRequired,
	placeholder: types.string,
	filterLabel: types.string,
	selectedValue: types.selectedValue,
	showFilter: types.bool,
	style: types.style,
	theming: types.style,
	innerStyle: types.style,
	innerProps: types.props,
};

SingleDropdownRange.defaultProps = {
	placeholder: 'Select a value',
	showFilter: true,
	style: {},
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
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	setQueryListener: (component, onQueryChange, beforeQueryChange) =>
		dispatch(setQueryListener(component, onQueryChange, beforeQueryChange)),
});

export default connect(
	mapStateToProps,
	mapDispatchtoProps,
)(withTheme(SingleDropdownRange));
