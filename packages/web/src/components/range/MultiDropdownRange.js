import React, { Component } from 'react';

import { updateQuery, setQueryOptions, setCustomQuery } from '@appbaseio/reactivecore/lib/actions';
import hoistNonReactStatics from 'hoist-non-react-statics';
import {
	isEqual,
	checkValueChange,
	getClassName,
	checkSomePropChange,
	updateCustomQuery,
	getOptionsFromQuery,
} from '@appbaseio/reactivecore/lib/utils/helper';

import types from '@appbaseio/reactivecore/lib/utils/types';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import Title from '../../styles/Title';
import Container from '../../styles/Container';
import Dropdown from '../shared/Dropdown';
import { connect, getRangeQueryWithNullValues, parseValueArray } from '../../utils';
import ComponentWrapper from '../basic/ComponentWrapper';

class MultiDropdownRange extends Component {
	constructor(props) {
		super(props);

		const defaultValue = props.defaultValue || props.value;
		const value = props.selectedValue || defaultValue || [];
		const currentValue = MultiDropdownRange.parseValue(value, props);

		// selectedValues hold the selected items as keys for O(1) complexity
		this.selectedValues = {};
		currentValue.forEach((item) => {
			this.selectedValues[item.label] = true;
		});

		this.state = {
			currentValue,
		};

		this.type = 'range';
		// Set custom query in store
		updateCustomQuery(props.componentId, props, currentValue);
		const hasMounted = false;

		if (value.length) {
			this.selectItem({
				item: value,
				isDefaultValue: true,
				props,
				hasMounted,
			});
		}
	}

	componentDidMount() {
		const { enableAppbase, index } = this.props;
		if (!enableAppbase && index) {
			console.warn(
				'Warning(ReactiveSearch): In order to use the `index` prop, the `enableAppbase` prop must be set to true in `ReactiveBase`.',
			);
		}
	}

	componentDidUpdate(prevProps) {
		checkSomePropChange(this.props, prevProps, ['dataField', 'nestedField'], () => {
			this.updateQuery(this.state.currentValue, this.props);
		});

		if (!isEqual(this.props.value, prevProps.value)) {
			this.selectItem({
				item: this.props.value,
				isDefaultValue: true,
			});
		} else if (
			!isEqual(this.state.currentValue, this.props.selectedValue)
			&& !isEqual(this.props.selectedValue, prevProps.selectedValue)
		) {
			const { value, onChange } = this.props;
			if (value === undefined) {
				this.selectItem({ item: this.props.selectedValue || null });
			} else if (onChange) {
				onChange(this.props.selectedValue || null);
			} else {
				const selectedValuesArray = Object.keys(this.selectedValues);
				this.selectItem({
					item: selectedValuesArray,
					isDefaultValue: true,
				});
			}
		}
	}

	// parses range label to get start and end
	static parseValue = (value, props) =>
		(value ? props.data.filter(item => value.includes(item.label)) : null);

	static defaultQuery = (values, props) => {
		const generateRangeQuery = (dataField, items) => {
			if (items.length > 0) {
				return items.map(value =>
					getRangeQueryWithNullValues([value.start, value.end], props),
				);
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
				nested: {
					path: props.nestedField,
					query,
				},
			};
		}

		return query;
	};

	selectItem = ({
		item, isDefaultValue = false, props = this.props, hasMounted = true,
	}) => {
		let { currentValue } = this.state;
		if (!item) {
			currentValue = [];
			this.selectedValues = {};
		} else if (isDefaultValue) {
			// checking if the items in defaultSeleted exist in the data prop
			currentValue = MultiDropdownRange.parseValue(item, props);
			currentValue.forEach((value) => {
				this.selectedValues = {
					...this.selectedValues,
					[value.label]: true,
				};
			});
		} else if (Array.isArray(item) && item.length && typeof item[0] === 'string') {
			currentValue = props.data.filter(dataItem => item.includes(dataItem.label));
			this.selectedValues = {};
			item.forEach((value) => {
				this.selectedValues = {
					...this.selectedValues,
					[value]: true,
				};
				return true;
			});
		} else if (this.selectedValues[item.label]) {
			currentValue = currentValue.filter(value => value.label !== item.label);
			const { [item.label]: del, ...selectedValues } = this.selectedValues;
			this.selectedValues = selectedValues;
		} else if (item.label) {
			currentValue = [...currentValue, item];
			this.selectedValues = {
				...this.selectedValues,
				[item.label]: true,
			};
		}
		const performUpdate = () => {
			const handleUpdates = () => {
				this.updateQuery(currentValue, props);
				if (props.onValueChange) props.onValueChange(currentValue);
			};

			if (hasMounted) {
				this.setState(
					{
						currentValue,
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
		let query = MultiDropdownRange.defaultQuery(value, props);
		let customQueryOptions;
		if (customQuery) {
			({ query } = customQuery(value, props) || {});
			customQueryOptions = getOptionsFromQuery(customQuery(value, props));
			updateCustomQuery(props.componentId, props, value);
		}
		props.setQueryOptions(props.componentId, customQueryOptions);

		props.updateQuery({
			componentId: props.componentId,
			query,
			value,
			label: props.filterLabel,
			showFilter: props.showFilter,
			URLParams: props.URLParams,
			componentType: componentTypes.multiDropdownRange,
		});
	};

	handleChange = (items) => {
		const { value, onChange } = this.props;
		if (value === undefined) {
			this.selectItem({ item: items });
		} else if (onChange) {
			onChange(parseValueArray(this.props.value, items.label));
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
				<Dropdown
					innerClass={this.props.innerClass}
					items={this.props.data}
					onChange={this.handleChange}
					selectedItem={this.state.currentValue}
					placeholder={this.props.placeholder}
					searchPlaceholder={this.props.searchPlaceholder}
					keyField="label"
					multi
					returnsObject
					customLabelRenderer={this.props.renderLabel}
					themePreset={this.props.themePreset}
				/>
			</Container>
		);
	}
}

MultiDropdownRange.propTypes = {
	updateQuery: types.funcRequired,
	selectedValue: types.selectedValue,
	setQueryOptions: types.funcRequired,
	setCustomQuery: types.funcRequired,
	enableAppbase: types.bool,
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
	searchPlaceholder: types.string,
	react: types.react,
	showFilter: types.bool,
	style: types.style,
	title: types.title,
	themePreset: types.themePreset,
	URLParams: types.bool,
	includeNullValues: types.bool,
	renderLabel: types.func,
	index: types.string,
};

MultiDropdownRange.defaultProps = {
	className: null,
	placeholder: 'Select a value',
	showFilter: true,
	style: {},
	URLParams: false,
	includeNullValues: false,
};

// Add componentType for SSR
MultiDropdownRange.componentType = componentTypes.multiDropdownRange;

const mapStateToProps = (state, props) => ({
	selectedValue: state.selectedValues[props.componentId]
		? state.selectedValues[props.componentId].value
		: null,
	themePreset: state.config.themePreset,
	enableAppbase: state.config.enableAppbase,
});

const mapDispatchtoProps = dispatch => ({
	setCustomQuery: (component, query) => dispatch(setCustomQuery(component, query)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	setQueryOptions: (component, props, execute) =>
		dispatch(setQueryOptions(component, props, execute)),
});

const ConnectedComponent = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(props => (
	<ComponentWrapper {...props} componentType={componentTypes.multiDropdownRange}>
		{() => <MultiDropdownRange ref={props.myForwardedRef} {...props} />}
	</ComponentWrapper>
));

// eslint-disable-next-line
const ForwardRefComponent = React.forwardRef((props, ref) => (
	<ConnectedComponent {...props} myForwardedRef={ref} />
));
hoistNonReactStatics(ForwardRefComponent, MultiDropdownRange);

ForwardRefComponent.displayName = 'MultiDropdownRange';
export default ForwardRefComponent;
