import React, { Component } from 'react';
import { Picker } from 'native-base';

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryOptions,
	setQueryListener,
} from '@appbaseio/reactivecore/lib/actions';
import {
	getQueryOptions,
	pushToAndClause,
	checkValueChange,
	getAggsOrder,
	checkPropChange,
	checkSomePropChange,
	getInnerKey,
} from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';

import withTheme from '../../theme/withTheme';
import { connect } from '../../utils';

class SingleDropdownList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentValue: '',
			options: [],
		};
		this.type = 'term';
		this.internalComponent = `${this.props.componentId}__internal`;
		props.setQueryListener(props.componentId, props.onQueryChange, null);
	}

	componentDidMount() {
		this.props.addComponent(this.internalComponent);
		this.props.addComponent(this.props.componentId);
		this.updateQueryOptions(this.props);

		this.setReact(this.props);

		if (this.props.selectedValue) {
			this.setValue(this.props.selectedValue);
		} else if (this.props.defaultSelected) {
			this.setValue(this.props.defaultSelected);
		}
	}

	componentWillReceiveProps(nextProps) {
		checkPropChange(this.props.react, nextProps.react, () => this.setReact(nextProps));
		checkPropChange(this.props.options, nextProps.options, () => {
			this.setState({
				options: nextProps.options[nextProps.dataField]
					? nextProps.options[nextProps.dataField].buckets
					: [],
			});
		});
		checkSomePropChange(this.props, nextProps, ['size', 'sortBy'], () =>
			this.updateQueryOptions(nextProps),
		);

		checkPropChange(this.props.dataField, nextProps.dataField, () => {
			this.updateQueryOptions(nextProps);
			this.updateQuery(this.state.currentValue, nextProps);
		});

		if (this.props.defaultSelected !== nextProps.defaultSelected) {
			this.setValue(nextProps.defaultSelected);
		} else if (this.state.currentValue !== nextProps.selectedValue) {
			this.setValue(nextProps.selectedValue || '');
		}
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
		if (this.props.selectAllLabel && this.props.selectAllLabel === value) {
			return {
				exists: {
					field: props.dataField,
				},
			};
		} else if (value) {
			return {
				[this.type]: {
					[props.dataField]: value,
				},
			};
		}
		return null;
	};

	setValue = (value, props = this.props) => {
		const performUpdate = () => {
			this.setState(
				{
					currentValue: value,
				},
				() => {
					this.updateQuery(value, props);
					if (props.onValueChange) props.onValueChange(value);
				},
			);
		};

		checkValueChange(props.componentId, value, props.beforeValueChange, performUpdate);
	};

	handleValueChange = (value) => {
		this.setValue(value, this.props);
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

	updateQueryOptions = (props) => {
		const queryOptions = getQueryOptions(props);
		queryOptions.size = 0;
		queryOptions.aggs = {
			[props.dataField]: {
				terms: {
					field: props.dataField,
					size: props.size,
					order: getAggsOrder(props.sortBy || 'count'),
				},
			},
		};
		props.setQueryOptions(this.internalComponent, queryOptions);
	};

	render() {
		let selectAll = [];

		if (this.state.options.length === 0) {
			return null;
		}

		if (this.props.selectAllLabel) {
			selectAll = [
				{
					key: this.props.selectAllLabel,
				},
			];
		}

		return (
			<Picker
				iosHeader="Select one"
				mode="dropdown"
				placeholder={this.props.placeholder}
				selectedValue={this.state.currentValue}
				onValueChange={this.handleValueChange}
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
				{[
					...selectAll,
					...this.state.options
						.filter(item => String(item.key).trim().length)
						.map(item => ({ ...item, key: String(item.key) })),
				].map((item) => {
					const label
						= this.props.showCount && item.doc_count
							? `${item.key} (${item.doc_count})`
							: item.key;

					return (
						<Picker.Item
							key={item.key}
							label={label}
							value={item.key}
							{...getInnerKey(this.props.innerProps, 'pickerItem')}
						/>
					);
				})}
			</Picker>
		);
	}
}

SingleDropdownList.propTypes = {
	componentId: types.stringRequired,
	addComponent: types.funcRequired,
	dataField: types.stringRequired,
	sortBy: types.sortByWithCount,
	setQueryOptions: types.funcRequired,
	updateQuery: types.funcRequired,
	defaultSelected: types.string,
	react: types.react,
	options: types.options,
	removeComponent: types.funcRequired,
	setQueryListener: types.funcRequired,
	beforeValueChange: types.func,
	onValueChange: types.func,
	customQuery: types.func,
	onQueryChange: types.func,
	placeholder: types.string,
	filterLabel: types.string,
	selectedValue: types.selectedValue,
	showFilter: types.bool,
	selectAllLabel: types.string,
	style: types.style,
	showCount: types.bool,
	size: types.number,
	theming: types.style,
	innerStyle: types.style,
	innerProps: types.props,
};

SingleDropdownList.defaultProps = {
	size: 100,
	sortBy: 'count',
	placeholder: 'Select a value',
	showFilter: true,
	style: {},
	showCount: true,
};

const mapStateToProps = (state, props) => ({
	options: state.aggregations[props.componentId],
	selectedValue:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value)
		|| '',
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	setQueryOptions: (component, props) => dispatch(setQueryOptions(component, props)),
	setQueryListener: (component, onQueryChange, beforeQueryChange) =>
		dispatch(setQueryListener(component, onQueryChange, beforeQueryChange)),
});

export default connect(
	mapStateToProps,
	mapDispatchtoProps,
)(withTheme(SingleDropdownList));
