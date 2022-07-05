import React, { Component } from 'react';

import { updateQuery, setQueryOptions, setCustomQuery } from '@appbaseio/reactivecore/lib/actions';
import hoistNonReactStatics from 'hoist-non-react-statics';
import {
	isEqual,
	checkValueChange,
	checkSomePropChange,
	getClassName,
	getOptionsFromQuery,
	updateCustomQuery,
} from '@appbaseio/reactivecore/lib/utils/helper';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';

import types from '@appbaseio/reactivecore/lib/utils/types';
import Title from '../../styles/Title';
import Container from '../../styles/Container';
import Dropdown from '../shared/Dropdown';
import { connect, getRangeQueryWithNullValues } from '../../utils';
import PreferencesConsumer from '../basic/PreferencesConsumer';
import ComponentWrapper from '../basic/ComponentWrapper';

class SingleDropdownRange extends Component {
	constructor(props) {
		super(props);

		const defaultValue = props.defaultValue || props.value;
		const value = props.selectedValue || defaultValue || null;
		const currentValue = SingleDropdownRange.parseValue(value, props);

		this.state = {
			currentValue,
		};
		this.type = 'range';

		// Set custom query in store
		updateCustomQuery(props.componentId, props, currentValue);
		const hasMounted = false;

		if (currentValue) {
			this.setValue(currentValue.label, true, props, hasMounted);
		}
	}

	componentDidMount() {
		const { config, index } = this.props;
		const { enableAppbase } = config;
		if (!enableAppbase && index) {
			console.warn(
				'Warning(ReactiveSearch): In order to use the `index` prop, the `enableAppbase` prop must be set to true in `ReactiveBase`.',
			);
		}
	}

	componentDidUpdate(prevProps) {
		checkSomePropChange(this.props, prevProps, ['dataField', 'nestedField'], () => {
			this.updateQuery(this.state.currentValue, prevProps);
		});

		if (!isEqual(this.props.value, prevProps.value)) {
			this.setValue(this.props.value, true);
		} else if (
			!isEqual(this.state.currentValue, this.props.selectedValue)
			&& !isEqual(this.props.selectedValue, prevProps.selectedValue)
		) {
			const { value, onChange } = this.props;
			if (value === undefined) {
				this.setValue(this.props.selectedValue || null, true);
			} else if (onChange) {
				onChange(this.props.selectedValue || null);
			} else {
				const selectedItem = this.state.currentValue.label;
				this.setValue(selectedItem, true);
			}
		}
	}

	// parses range label to get start and end
	static parseValue = (value, props) => props.data.find(item => item.label === value) || null;

	static defaultQuery = (value, props) => {
		let query = null;
		if (value) {
			query = getRangeQueryWithNullValues([value.start, value.end], props);
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

	setValue = (value, isDefaultValue = false, props = this.props, hasMounted = true) => {
		let currentValue = value;
		if (isDefaultValue) {
			currentValue = SingleDropdownRange.parseValue(value, props);
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
		let query = SingleDropdownRange.defaultQuery(value, props);
		let customQueryOptions;
		if (customQuery) {
			({ query } = customQuery(value, props) || {});
			customQueryOptions = getOptionsFromQuery(customQuery(value, props));
			updateCustomQuery(props.componentId, props, value);
		}
		props.setQueryOptions(props.componentId, customQueryOptions, false);

		props.updateQuery({
			componentId: props.componentId,
			query,
			value,
			label: props.filterLabel,
			showFilter: props.showFilter,
			URLParams: props.URLParams,
			componentType: componentTypes.singleDropdownRange,
		});
	};

	handleChange = (selectedItem) => {
		const { value, onChange } = this.props;

		if (value === undefined) {
			this.setValue(selectedItem);
		} else if (onChange) {
			onChange(selectedItem);
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
					returnsObject
					themePreset={this.props.themePreset}
					customLabelRenderer={this.props.renderLabel}
				/>
			</Container>
		);
	}
}

SingleDropdownRange.propTypes = {
	updateQuery: types.funcRequired,
	selectedValue: types.selectedValue,
	setQueryOptions: types.funcRequired,
	setCustomQuery: types.funcRequired,
	config: types.props,
	// component props
	beforeValueChange: types.func,
	className: types.string,
	componentId: types.stringRequired,
	customQuery: types.func,
	data: types.data,
	dataField: types.stringRequired,
	defaultValue: types.string,
	value: types.string,
	filterLabel: types.string,
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

SingleDropdownRange.defaultProps = {
	className: null,
	placeholder: 'Select a value',
	showFilter: true,
	style: {},
	URLParams: false,
	includeNullValues: false,
};


// Add componentType for SSR
SingleDropdownRange.componentType = componentTypes.singleDropdownRange;

const mapStateToProps = (state, props) => ({
	selectedValue:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value)
		|| null,
	themePreset: state.config.themePreset,
	config: state.config,
});

const mapDispatchtoProps = dispatch => ({
	setCustomQuery: (component, query) => dispatch(setCustomQuery(component, query)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	setQueryOptions: (...args) =>
		dispatch(setQueryOptions(...args)),
});

const ConnectedComponent = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(props => (
	<ComponentWrapper {...props} componentType={componentTypes.singleDropdownRange}>
		{() => <SingleDropdownRange ref={props.myForwardedRef} {...props} />}
	</ComponentWrapper>
));

// eslint-disable-next-line
const ForwardRefComponent = React.forwardRef((props, ref) => (
	<PreferencesConsumer userProps={props} >
		{preferenceProps => <ConnectedComponent {...preferenceProps} myForwardedRef={ref} />}
	</PreferencesConsumer>
));
hoistNonReactStatics(ForwardRefComponent, SingleDropdownRange);

ForwardRefComponent.displayName = 'SingleDropdownRange';
export default ForwardRefComponent;
