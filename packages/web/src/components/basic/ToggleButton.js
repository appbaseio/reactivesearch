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
import Button, { toggleButtons } from '../../styles/Button';
import { connect } from '../../utils';

class ToggleButton extends Component {
	constructor(props) {
		super(props);

		const value = props.selectedValue || props.value || props.defaultValue || [];
		const currentValue = ToggleButton.parseValue(value, props);

		this.state = {
			currentValue,
		};
		this.locked = false;

		props.addComponent(props.componentId);
		props.setQueryListener(props.componentId, props.onQueryChange, null);
		this.setReact(props);
		const hasMounted = false;

		if (currentValue.length) {
			this.handleToggle(currentValue, true, props, hasMounted);
		}
	}

	componentDidUpdate(prevProps) {
		checkPropChange(this.props.react, prevProps.react, () => {
			this.setReact(this.props);
		});

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
				this.handleToggle(this.props.selectedValue || [], true, this.props);
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
				this.handleToggle(this.props.selectedValue || [], true, this.props);
			}
		}
	}

	componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
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

	setReact(props) {
		if (props.react) {
			props.watchComponent(props.componentId, props.react);
		}
	}

	setValue = (value, props = this.props, hasMounted = true) => {
		// ignore state updates when component is locked
		if (props.beforeValueChange && this.locked) {
			return;
		}

		this.locked = true;
		const performUpdate = () => {
			const handleUpdates = () => {
				this.updateQuery(value, props);
				this.locked = false;
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
			({ query } = customQuery(value, props));
			customQueryOptions = getOptionsFromQuery(customQuery(value, props));
		}

		this.queryOptions = {
			...this.queryOptions,
			...customQueryOptions,
		};
		props.setQueryOptions(props.componentId, this.queryOptions);
		props.updateQuery({
			componentId: props.componentId,
			query,
			value: filterValue, // sets a string in URL not array
			label: props.filterLabel,
			showFilter: props.showFilter,
			URLParams: props.URLParams,
			componentType: 'TOGGLEBUTTON',
		});
	};

	handleClick = (item) => {
		const { value, onChange } = this.props;
		if (value) {
			if (onChange) onChange(item);
		} else {
			this.handleToggle(item);
		}
	};

	render() {
		return (
			<Container
				style={this.props.style}
				className={`${toggleButtons} ${this.props.className || ''}`}
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
							onClick={() => this.handleClick(item)}
							key={item.value}
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
	addComponent: types.funcRequired,
	removeComponent: types.funcRequired,
	setQueryListener: types.funcRequired,
	updateQuery: types.funcRequired,
	watchComponent: types.funcRequired,
	selectedValue: types.selectedValue,
	setQueryOptions: types.funcRequired,
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
};

ToggleButton.defaultProps = {
	className: null,
	multiSelect: true,
	showFilter: true,
	style: {},
	URLParams: false,
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
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	setQueryListener: (component, onQueryChange, beforeQueryChange) =>
		dispatch(setQueryListener(component, onQueryChange, beforeQueryChange)),
	setQueryOptions: (component, props) => dispatch(setQueryOptions(component, props)),
});

const ConnectedComponent = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(props => <ToggleButton ref={props.myForwardedRef} {...props} />);

// eslint-disable-next-line
const ForwardRefComponent = React.forwardRef((props, ref) => (
	<ConnectedComponent {...props} myForwardedRef={ref} />
));
hoistNonReactStatics(ForwardRefComponent, ToggleButton);

ForwardRefComponent.name = 'ToggleButton';
export default ForwardRefComponent;
