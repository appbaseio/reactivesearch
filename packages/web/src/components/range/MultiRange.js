import React, { Component } from 'react';

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryListener,
	setQueryOptions,
} from '@appbaseio/reactivecore/lib/actions';
import hoistNonReactStatics from 'hoist-non-react-statics';
import {
	isEqual,
	checkValueChange,
	checkPropChange,
	checkSomePropChange,
	getClassName,
	getOptionsFromQuery,
} from '@appbaseio/reactivecore/lib/utils/helper';

import types from '@appbaseio/reactivecore/lib/utils/types';

import Title from '../../styles/Title';
import Container from '../../styles/Container';
import { UL, Checkbox } from '../../styles/FormControlList';
import { connect } from '../../utils';

class MultiRange extends Component {
	constructor(props) {
		super(props);

		const defaultValue = props.defaultValue || props.value;
		const value = props.selectedValue || defaultValue || [];
		const currentValue = MultiRange.parseValue(value, props);

		const selectedValues = {};
		currentValue.forEach((item) => {
			selectedValues[item.label] = true;
		});

		this.state = {
			currentValue,
			// selectedValues hold the selected items as keys for O(1) complexity
			selectedValues,
		};

		this.type = 'range';
		this.locked = false;

		props.addComponent(props.componentId);
		props.setQueryListener(props.componentId, props.onQueryChange, null);
		this.setReact(props);
		const hasMounted = false;

		if (value.length) {
			this.selectItem(value, true, props, hasMounted);
		}
	}

	componentDidUpdate(prevProps) {
		checkPropChange(this.props.react, prevProps.react, () => this.setReact(this.props));

		checkSomePropChange(this.props, prevProps, ['dataField', 'nestedField'], () => {
			this.updateQuery(this.state.currentValue, this.props);
		});

		if (!isEqual(this.props.value, prevProps.value)) {
			this.selectItem(this.props.value, true);
		} else if (
			!isEqual(this.state.currentValue, this.props.selectedValue)
			&& !isEqual(this.props.selectedValue, prevProps.selectedValue)
		) {
			const { value, onChange } = this.props;

			if (value === undefined) {
				this.selectItem(this.props.selectedValue || null);
			} else if (onChange) {
				onChange(this.props.selectedValue || null);
			} else {
				const selectedValuesArray = Object.keys(this.state.selectedValues);
				this.selectItem(selectedValuesArray, true);
			}
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

	// parses range label to get start and end
	static parseValue = (value, props) =>
		(value ? props.data.filter(item => value.includes(item.label)) : null);

	static defaultQuery = (values, props) => {
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

		let query = null;

		if (values && values.length) {
			query = {
				bool: {
					should: generateRangeQuery(props.dataField, values),
					minimum_should_match: 1,
					boost: 1.0,
				},
			};
		}

		if (query && props.nestedField) {
			return {
				query: {
					nested: {
						path: props.nestedField,
						query,
					},
				},
			};
		}

		return query;
	};

	selectItem = (item, isDefaultValue = false, props = this.props, hasMounted = true) => {
		// ignore state updates when component is locked
		if (props.beforeValueChange && this.locked) {
			return;
		}

		this.locked = true;
		let { currentValue, selectedValues } = this.state;
		if (!item) {
			currentValue = [];
			selectedValues = {};
		} else if (isDefaultValue) {
			// checking if the items in defaultSeleted exist in the data prop
			currentValue = MultiRange.parseValue(item, props);
			currentValue.forEach((value) => {
				selectedValues = { ...selectedValues, [value.label]: true };
			});
		} else if (selectedValues[item]) {
			currentValue = currentValue.filter(value => value.label !== item);
			const { [item]: del, ...selected } = selectedValues;
			selectedValues = selected;
		} else {
			const currentItem = props.data.find(value => item === value.label);
			currentValue = [...currentValue, currentItem];
			selectedValues = { ...selectedValues, [item]: true };
		}

		const performUpdate = () => {
			const handleUpdates = () => {
				this.updateQuery(currentValue, props);
				this.locked = false;
				if (props.onValueChange) props.onValueChange(currentValue);
			};

			if (hasMounted) {
				this.setState(
					{
						currentValue,
						selectedValues,
					},
					handleUpdates,
				);
			} else {
				handleUpdates();
			}
		};

		checkValueChange(props.componentId, currentValue, props.beforeValueChange, performUpdate);
	};

	updateQuery = (value, props) => {
		const { customQuery } = props;
		let query = MultiRange.defaultQuery(value, props);
		let customQueryOptions;
		if (customQuery) {
			({ query } = customQuery(value, props) || {});
			customQueryOptions = getOptionsFromQuery(customQuery(value, props));
		}

		props.setQueryOptions(props.componentId, customQueryOptions);

		props.updateQuery({
			componentId: props.componentId,
			query,
			value,
			label: props.filterLabel,
			showFilter: props.showFilter,
			URLParams: props.URLParams,
			componentType: 'MULTIRANGE',
		});
	};

	handleClick = (e) => {
		const { value, onChange } = this.props;

		const { value: rangeValue } = e.target;
		if (value === undefined) {
			this.selectItem(rangeValue);
		} else if (onChange) {
			onChange(rangeValue);
		}
	};

	render() {
		return (
			<Container style={this.props.style} className={this.props.className}>
				{this.props.title && (
					<Title className={getClassName(this.props.innerClass, 'title') || null}>
						{this.props.title}
					</Title>
				)}
				<UL className={getClassName(this.props.innerClass, 'list') || null}>
					{this.props.data.map(item => (
						<li
							key={item.label}
							className={`${this.state.selectedValues[item.label] ? 'active' : ''}`}
						>
							<Checkbox
								className={getClassName(this.props.innerClass, 'checkbox') || null}
								id={`${this.props.componentId}-${item.label}`}
								name={this.props.componentId}
								value={item.label}
								onChange={this.handleClick}
								checked={!!this.state.selectedValues[item.label]}
								show={this.props.showCheckbox}
							/>
							<label
								className={getClassName(this.props.innerClass, 'label') || null}
								htmlFor={`${this.props.componentId}-${item.label}`}
							>
								<span>{item.label}</span>
							</label>
						</li>
					))}
				</UL>
			</Container>
		);
	}
}

MultiRange.propTypes = {
	addComponent: types.funcRequired,
	removeComponent: types.funcRequired,
	setQueryListener: types.funcRequired,
	updateQuery: types.funcRequired,
	watchComponent: types.funcRequired,
	selectedValue: types.selectedValue,
	setQueryOptions: types.funcRequired,
	// component props
	beforeValueChange: types.func,
	className: types.string,
	componentId: types.stringRequired,
	customQuery: types.func,
	data: types.data,
	dataField: types.stringRequired,
	defaultValue: types.stringArray,
	value: types.stringArray,
	filterLabel: types.filterLabel,
	innerClass: types.style,
	nestedField: types.string,
	onQueryChange: types.func,
	onValueChange: types.func,
	onChange: types.func,
	placeholder: types.string,
	react: types.react,
	showCheckbox: types.boolRequired,
	showFilter: types.bool,
	style: types.style,
	supportedOrientations: types.supportedOrientations,
	title: types.title,
	URLParams: types.bool,
};

MultiRange.defaultProps = {
	className: null,
	showCheckbox: true,
	showFilter: true,
	style: {},
	URLParams: false,
};

const mapStateToProps = (state, props) => ({
	selectedValue: state.selectedValues[props.componentId]
		? state.selectedValues[props.componentId].value
		: null,
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	setQueryListener: (component, onQueryChange, beforeQueryChange) =>
		dispatch(setQueryListener(component, onQueryChange, beforeQueryChange)),
	setQueryOptions: (component, props, execute) =>
		dispatch(setQueryOptions(component, props, execute)),
});

const ConnectedComponent = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(props => <MultiRange ref={props.myForwardedRef} {...props} />);

// eslint-disable-next-line
const ForwardRefComponent = React.forwardRef((props, ref) => (
	<ConnectedComponent {...props} myForwardedRef={ref} />
));
hoistNonReactStatics(ForwardRefComponent, MultiRange);

ForwardRefComponent.name = 'MultiRange';
export default ForwardRefComponent;
