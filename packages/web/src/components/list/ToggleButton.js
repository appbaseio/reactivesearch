/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { Component } from 'react';

import { updateQuery, setQueryOptions, setCustomQuery } from '@appbaseio/reactivecore/lib/actions';
import hoistNonReactStatics from 'hoist-non-react-statics';
import {
	isEqual,
	checkValueChange,
	checkSomePropChange,
	getClassName,
	getOptionsFromQuery,
	handleA11yAction,
	updateCustomQuery,
} from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';

import Title from '../../styles/Title';
import Container from '../../styles/Container';
import Button, { toggleButtons } from '../../styles/Button';
import { connect } from '../../utils';
import PreferencesConsumer from '../basic/PreferencesConsumer';
import ComponentWrapper from '../basic/ComponentWrapper';

class ToggleButton extends Component {
	constructor(props) {
		super(props);

		const value = props.selectedValue || props.value || props.defaultValue || [];
		const currentValue = ToggleButton.parseValue(value, props);

		this.state = {
			currentValue,
		};

		// Set custom query in store
		updateCustomQuery(props.componentId, props, currentValue);
		const hasMounted = false;

		if (currentValue.length) {
			this.handleToggle(currentValue, true, props, hasMounted);
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
			this.handleToggle(this.props.value, true, this.props);
		} else if (this.props.multiSelect) {
			// for multiselect selectedValue will be an array
			if (
				!isEqual(this.state.currentValue, this.props.selectedValue)
				&& !isEqual(prevProps.selectedValue, this.props.selectedValue)
			) {
				const { value, onChange } = this.props;
				if (value === undefined) {
					this.handleToggle(this.props.selectedValue || [], true, this.props);
				} else if (onChange) {
					// value prop exists
					onChange(this.props.selectedValue || '');
				} else {
					// value prop exists and onChange is not defined:
					// we need to put the current value back into the store
					// if the clear action was triggered by interacting with
					// selected-filters component
					this.handleToggle(this.state.currentValue, true, this.props);
				}
			}
		} else {
			// else selectedValue will be a string
			const currentValue = this.state.currentValue[0]
				? this.state.currentValue[0].value
				: null;
			if (
				!isEqual(currentValue, this.props.selectedValue)
				&& !isEqual(prevProps.selectedValue, this.props.selectedValue)
			) {
				const { value, onChange } = this.props;
				if (value === undefined) {
					this.handleToggle(this.props.selectedValue || [], true, this.props);
				} else if (onChange) {
					// value prop exists
					onChange(this.props.selectedValue || '');
				} else {
					// value prop exists and onChange is not defined:
					// we need to put the current value back into the store
					// if the clear action was triggered by interacting with
					// selected-filters component
					this.handleToggle(this.state.currentValue, true, this.props);
				}
			}
		}
	}

	static parseValue = (value, props) => {
		if (Array.isArray(value)) {
			if (typeof value[0] === 'string') {
				return props.data.filter(item => value.includes(item.value));
			}
			return value;
		}
		return props.data.filter(item => item.value === value);
	};

	static defaultQuery = (value, props) => {
		let query = null;
		if (value && value.length) {
			query = {
				bool: {
					boost: 1.0,
					minimum_should_match: 1,
					should: value.map(item => ({
						term: {
							[props.dataField]: item.value,
						},
					})),
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

	handleToggle = (value, isDefaultValue = false, props = this.props, hasMounted = true) => {
		const { currentValue } = this.state;
		const toggleValue = value;
		let finalValue = [];

		if (isDefaultValue) {
			finalValue = ToggleButton.parseValue(toggleValue, props);
		} else if (this.props.multiSelect) {
			finalValue = currentValue.some(item => item.value === toggleValue.value)
				? currentValue.filter(item => item.value !== toggleValue.value)
				: currentValue.concat(toggleValue);
		} else {
			finalValue = currentValue.some(item => item.value === toggleValue.value)
				? []
				: [toggleValue];
		}

		this.setValue(finalValue, props, hasMounted);
	};

	setValue = (value, props = this.props, hasMounted = true) => {
		const performUpdate = () => {
			const handleUpdates = () => {
				this.updateQuery(value, props);
				if (props.onValueChange) props.onValueChange(value);
			};

			if (hasMounted) {
				this.setState(
					{
						currentValue: value,
					},
					handleUpdates,
				);
			} else {
				handleUpdates();
			}
		};
		checkValueChange(
			props.componentId,
			props.multiSelect ? value : value[0],
			props.beforeValueChange,
			performUpdate,
		);
	};

	updateQuery = (value, props) => {
		let filterValue = value;
		if (!props.multiSelect) {
			filterValue = value[0] ? value[0].value : null;
		}
		const { customQuery } = props;

		let query = ToggleButton.defaultQuery(value, props);
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
			value: filterValue, // sets a string in URL not array
			label: props.filterLabel,
			showFilter: props.showFilter,
			URLParams: props.URLParams,
			componentType: componentTypes.toggleButton,
		});
	};

	handleClick = (item, e) => {
		e.preventDefault();
		const { enableStrictSelection, multiSelect } = this.props;
		if (
			enableStrictSelection
			&& !multiSelect
			&& this.state.currentValue.find(stateItem => isEqual(item, stateItem))
		) {
			return false;
		}
		const { value, onChange } = this.props;
		if (value === undefined) {
			this.handleToggle(item);
		} else if (onChange) onChange(item);
		return true;
	};

	render() {
		return (
			<Container
				style={this.props.style}
				css={toggleButtons}
				className={`${this.props.className || ''}`}
			>
				{this.props.title && (
					<Title className={getClassName(this.props.innerClass, 'title') || null}>
						{this.props.title}
					</Title>
				)}
				{this.props.data.map((item) => {
					const isSelected = this.state.currentValue.some(
						value => value.value === item.value,
					);
					return (
						<Button
							className={`${getClassName(this.props.innerClass, 'button')} ${
								isSelected ? 'active' : ''
							}`}
							onClick={e => this.handleClick(item, e)}
							onKeyPress={e => handleA11yAction(e, () => this.handleClick(item, e))}
							key={item.value}
							tabIndex="0"
							primary={isSelected}
							large
						>
							{item.label}
						</Button>
					);
				})}
			</Container>
		);
	}
}

ToggleButton.propTypes = {
	updateQuery: types.funcRequired,
	selectedValue: types.selectedValue,
	setQueryOptions: types.funcRequired,
	setCustomQuery: types.funcRequired,
	enableAppbase: types.props.enableAppbase,
	// component props
	className: types.string,
	componentId: types.stringRequired,
	data: types.data,
	dataField: types.stringRequired,
	defaultValue: types.stringOrArray,
	value: types.stringOrArray,
	filterLabel: types.string,
	nestedField: types.string,
	innerClass: types.style,
	multiSelect: types.bool,
	onValueChange: types.func,
	onChange: types.func,
	onQueryChange: types.func,
	react: types.react,
	showFilter: types.bool,
	style: types.style,
	title: types.title,
	URLParams: types.bool,
	index: types.string,
	enableStrictSelection: types.bool,
};

ToggleButton.defaultProps = {
	className: null,
	multiSelect: true,
	showFilter: true,
	style: {},
	URLParams: false,
	enableStrictSelection: false,
};

// Add componentType for SSR
ToggleButton.componentType = componentTypes.toggleButton;

const mapStateToProps = (state, props) => ({
	selectedValue:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value)
		|| null,
	enableAppbase: state.config.enableAppbase,
});

const mapDispatchtoProps = dispatch => ({
	setCustomQuery: (component, query) => dispatch(setCustomQuery(component, query)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	setQueryOptions: (...args) => dispatch(setQueryOptions(...args)),
});

const ConnectedComponent = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(props => (
	<ComponentWrapper {...props} componentType={componentTypes.toggleButton}>
		{() => <ToggleButton ref={props.myForwardedRef} {...props} />}
	</ComponentWrapper>
));

// eslint-disable-next-line
const ForwardRefComponent = React.forwardRef((props, ref) => (
	<PreferencesConsumer userProps={props} >
		{preferenceProps => <ConnectedComponent {...preferenceProps} myForwardedRef={ref} />}
	</PreferencesConsumer>
));
hoistNonReactStatics(ForwardRefComponent, ToggleButton);

ForwardRefComponent.displayName = 'ToggleButton';
export default ForwardRefComponent;
