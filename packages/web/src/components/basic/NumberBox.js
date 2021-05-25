/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { Component } from 'react';

import { updateQuery, setQueryOptions, setCustomQuery } from '@appbaseio/reactivecore/lib/actions';
import hoistNonReactStatics from 'hoist-non-react-statics';
import {
	checkValueChange,
	checkPropChange,
	checkSomePropChange,
	getClassName,
	getOptionsFromQuery,
	updateCustomQuery,
} from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';

import Title from '../../styles/Title';
import Button, { numberBoxContainer } from '../../styles/Button';
import Flex from '../../styles/Flex';
import Container from '../../styles/Container';
import { connect } from '../../utils';
import ComponentWrapper from '../basic/ComponentWrapper';

class NumberBox extends Component {
	constructor(props) {
		super(props);

		this.type = 'term';
		const currentValue
			= props.selectedValue || props.defaultValue || props.value || props.data.start;
		this.state = {
			currentValue,
		};

		// Set custom query in store
		updateCustomQuery(props.componentId, props, currentValue);
		const hasMounted = false;

		if (currentValue) {
			this.setValue(currentValue, this.props, hasMounted);
		}
	}

	componentDidUpdate(prevProps) {
		checkPropChange(this.props.value, prevProps.value, () => {
			this.setValue(this.props.value, this.props);
		});
		checkPropChange(this.props.queryFormat, this.props.queryFormat, () => {
			this.updateQuery(this.state.currentValue, this.props);
		});
		checkSomePropChange(this.props, prevProps, ['dataField', 'nestedField'], () => {
			this.updateQuery(this.state.currentValue, this.props);
		});
	}

	static defaultQuery = (value, props) => {
		let query = null;
		switch (props.queryFormat) {
			case 'exact':
				query = {
					term: {
						[props.dataField]: value,
					},
				};
				break;
			case 'lte':
				query = {
					range: {
						[props.dataField]: {
							lte: value,
							boost: 2.0,
						},
					},
				};
				break;
			default:
				query = {
					range: {
						[props.dataField]: {
							gte: value,
							boost: 2.0,
						},
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

	incrementValue = () => {
		if (this.state.currentValue === this.props.data.end) {
			return;
		}
		const { currentValue } = this.state;
		const { value, onChange } = this.props;

		if (value === undefined) {
			this.setValue(currentValue + 1);
		} else if (onChange) {
			onChange(currentValue + 1);
		}
	};

	decrementValue = () => {
		if (this.state.currentValue === this.props.data.start) {
			return;
		}
		const { currentValue } = this.state;
		const { value, onChange } = this.props;

		if (value === undefined) {
			this.setValue(currentValue - 1);
		} else if (onChange) {
			onChange(currentValue - 1);
		}
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
		checkValueChange(props.componentId, value, props.beforeValueChange, performUpdate);
	};

	updateQuery = (value, props) => {
		const { customQuery } = props;
		let query = NumberBox.defaultQuery(value, props);
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
			showFilter: false, // we don't need filters for NumberBox
			URLParams: props.URLParams,
			componentType: componentTypes.numberBox,
		});
	};

	render() {
		return (
			<Container style={this.props.style} className={this.props.className}>
				{this.props.title && (
					<Title className={getClassName(this.props.innerClass, 'title') || null}>
						{this.props.title}
					</Title>
				)}
				<Flex
					labelPosition={this.props.labelPosition}
					justifyContent="space-between"
					css={numberBoxContainer}
				>
					<span className={getClassName(this.props.innerClass, 'label') || null}>
						{this.props.data.label}
					</span>
					<div>
						<Button
							className={getClassName(this.props.innerClass, 'button') || null}
							onClick={this.decrementValue}
							disabled={this.state.currentValue === this.props.data.start}
						>
							<b>-</b>
						</Button>
						{this.state.currentValue}
						<Button
							className={getClassName(this.props.innerClass, 'button') || null}
							onClick={this.incrementValue}
							disabled={this.state.currentValue === this.props.data.end}
						>
							<b>+</b>
						</Button>
					</div>
				</Flex>
			</Container>
		);
	}
}

NumberBox.propTypes = {
	updateQuery: types.funcRequired,
	selectedValue: types.selectedValue,
	setQueryOptions: types.funcRequired,
	setCustomQuery: types.funcRequired,
	// component props
	className: types.string,
	componentId: types.stringRequired,
	data: types.dataNumberBox,
	dataField: types.stringRequired,
	defaultValue: types.number,
	value: types.number,
	innerClass: types.style,
	nestedField: types.string,
	labelPosition: types.labelPosition,
	onQueryChange: types.func,
	onValueChange: types.func,
	onChange: types.func,
	queryFormat: types.queryFormatNumberBox,
	react: types.react,
	style: types.style,
	title: types.title,
	URLParams: types.bool,
};

NumberBox.defaultProps = {
	className: null,
	labelPosition: 'left',
	queryFormat: 'gte',
	style: {},
	URLParams: false,
};

// Add componentType for SSR
NumberBox.componentType = componentTypes.numberBox;

const mapStateToProps = (state, props) => ({
	selectedValue: state.selectedValues[props.componentId]
		? state.selectedValues[props.componentId].value
		: null,
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
	<ComponentWrapper {...props} componentType={componentTypes.numberBox}>
		{() => <NumberBox ref={props.myForwardedRef} {...props} />}
	</ComponentWrapper>
));

// eslint-disable-next-line
const ForwardRefComponent = React.forwardRef((props, ref) => (
	<ConnectedComponent {...props} myForwardedRef={ref} />
));

hoistNonReactStatics(ForwardRefComponent, NumberBox);

ForwardRefComponent.displayName = 'NumberBox';
export default ForwardRefComponent;
