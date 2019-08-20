import React, { Component } from 'react';

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryListener,
	setQueryOptions,
	setComponentProps,
	updateComponentProps,
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
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';

import Title from '../../styles/Title';
import Container from '../../styles/Container';
import { UL, Radio } from '../../styles/FormControlList';
import { connect, getRangeQueryWithNullValues, getValidPropsKeys } from '../../utils';

class SingleRange extends Component {
	constructor(props) {
		super(props);

		const defaultValue = props.defaultValue || props.value;
		const value = props.selectedValue || defaultValue || null;
		const currentValue = SingleRange.parseValue(value, props);

		this.state = {
			currentValue,
		};
		this.type = 'range';
		this.locked = false;

		props.addComponent(props.componentId);
		props.setComponentProps(props.componentId, {
			...props,
			componentType: componentTypes.singleRange,
		});
		props.setQueryListener(props.componentId, props.onQueryChange, null);

		this.setReact(props);
		const hasMounted = false;

		if (currentValue) {
			this.setValue(currentValue, props, hasMounted);
		}
	}

	componentDidUpdate(prevProps) {
		checkSomePropChange(this.props, prevProps, getValidPropsKeys(this.props), () => {
			this.props.updateComponentProps(this.props.componentId, this.props);
		});
		checkPropChange(this.props.react, prevProps.react, () => this.setReact(this.props));

		checkSomePropChange(this.props, prevProps, ['dataField', 'nestedField'], () => {
			this.updateQuery(this.state.currentValue, this.props);
		});

		if (!isEqual(this.props.value, prevProps.value)) {
			this.setValue(this.props.value);
		} else if (
			!isEqual(this.state.currentValue, this.props.selectedValue)
			&& !isEqual(this.props.selectedValue, prevProps.selectedValue)
		) {
			const { value, onChange } = this.props;
			if (value === undefined) {
				this.setValue(this.props.selectedValue || null);
			} else if (onChange) {
				onChange(this.props.selectedValue || null);
			} else {
				this.setValue(this.state.currentValue);
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
	static parseValue = (value, props) => props.data.find(item => item.label === value) || null;

	static defaultQuery = (value, props) => {
		let query = null;
		if (value) {
			query = getRangeQueryWithNullValues([value.start, value.end], props);
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

	setValue = (value, props = this.props, hasMounted = true) => {
		// ignore state updates when component is locked
		if (props.beforeValueChange && this.locked) {
			return;
		}

		this.locked = true;
		const currentValue
			= typeof value === 'string' ? SingleRange.parseValue(value, props) : value;

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
		let query = SingleRange.defaultQuery(value, props);
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
			componentType: componentTypes.singleRange,
		});
	};

	handleClick = (e) => {
		const { value, onChange } = this.props;
		const { value: rangeValue } = e.target;

		if (value === undefined) {
			this.setValue(rangeValue);
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
				<UL
					className={getClassName(this.props.innerClass, 'list') || null}
					aria-label={`${this.props.componentId}-items`}
					role="radiogroup"
				>
					{this.props.data.map((item) => {
						const selected
							= !!this.state.currentValue
							&& this.state.currentValue.label === item.label;
						return (
							<li
								key={item.label}
								className={`${selected ? 'active' : ''}`}
								role="radio"
								aria-checked={selected}
							>
								<Radio
									className={getClassName(this.props.innerClass, 'radio')}
									id={`${this.props.componentId}-${item.label}`}
									tabIndex={selected ? '-1' : '0'}
									value={item.label}
									onChange={this.handleClick}
									checked={selected}
									show={this.props.showRadio}
								/>
								<label
									className={getClassName(this.props.innerClass, 'label') || null}
									htmlFor={`${this.props.componentId}-${item.label}`}
								>
									<span>{item.label}</span>
								</label>
							</li>
						);
					})}
				</UL>
			</Container>
		);
	}
}

SingleRange.propTypes = {
	addComponent: types.funcRequired,
	removeComponent: types.funcRequired,
	setQueryListener: types.funcRequired,
	updateQuery: types.funcRequired,
	watchComponent: types.funcRequired,
	selectedValue: types.selectedValue,
	setComponentProps: types.funcRequired,
	updateComponentProps: types.funcRequired,
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
	react: types.react,
	showFilter: types.bool,
	showRadio: types.boolRequired,
	style: types.style,
	title: types.title,
	URLParams: types.bool,
	includeNullValues: types.bool,
};

SingleRange.defaultProps = {
	className: null,
	showFilter: true,
	showRadio: true,
	style: {},
	URLParams: false,
	includeNullValues: false,
};

const mapStateToProps = (state, props) => ({
	selectedValue:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value)
		|| null,
});

const mapDispatchtoProps = dispatch => ({
	setComponentProps: (component, options) => dispatch(setComponentProps(component, options)),
	updateComponentProps: (component, options) =>
		dispatch(updateComponentProps(component, options)),
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
)(props => <SingleRange ref={props.myForwardedRef} {...props} />);

// eslint-disable-next-line
const ForwardRefComponent = React.forwardRef((props, ref) => (
	<ConnectedComponent {...props} myForwardedRef={ref} />
));
hoistNonReactStatics(ForwardRefComponent, SingleRange);

ForwardRefComponent.name = 'SingleRange';
export default ForwardRefComponent;
