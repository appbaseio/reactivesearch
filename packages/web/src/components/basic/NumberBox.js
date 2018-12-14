import React, { Component } from 'react';

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryListener,
	setQueryOptions,
} from '@appbaseio/reactivecore/lib/actions';
import {
	checkValueChange,
	checkPropChange,
	getClassName,
	getOptionsFromQuery,
} from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';

import Title from '../../styles/Title';
import Button, { numberBoxContainer } from '../../styles/Button';
import Flex from '../../styles/Flex';
import Container from '../../styles/Container';
import { connect } from '../../utils';

class NumberBox extends Component {
	constructor(props) {
		super(props);

		this.type = 'term';
		const currentValue
			= props.selectedValue || props.defaultValue || props.value || props.data.start;
		this.state = {
			currentValue,
		};
		this.locked = false;

		props.addComponent(props.componentId);
		props.setQueryListener(props.componentId, props.onQueryChange, null);
		this.setReact(props);
		const hasMounted = false;

		if (currentValue) {
			this.setValue(currentValue, this.props, hasMounted);
		}
	}

	componentDidUpdate(prevProps) {
		checkPropChange(this.props.react, prevProps.react, () => {
			this.setReact(this.props);
		});
		checkPropChange(this.props.value, prevProps.value, () => {
			this.setValue(this.props.value, this.props);
		});
		checkPropChange(this.props.queryFormat, this.props.queryFormat, () => {
			this.updateQuery(this.state.currentValue, this.props);
		});
		checkPropChange(this.props.dataField, this.props.dataField, () => {
			this.updateQuery(this.state.currentValue, this.props);
		});
	}

	componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
	}

	static defaultQuery = (value, props) => {
		switch (props.queryFormat) {
			case 'exact':
				return {
					term: {
						[props.dataField]: value,
					},
				};
			case 'lte':
				return {
					range: {
						[props.dataField]: {
							lte: value,
							boost: 2.0,
						},
					},
				};
			default:
				return {
					range: {
						[props.dataField]: {
							gte: value,
							boost: 2.0,
						},
					},
				};
		}
	};

	setReact(props) {
		if (props.react) {
			props.watchComponent(props.componentId, props.react);
		}
	}

	incrementValue = () => {
		if (this.state.currentValue === this.props.data.end) {
			return;
		}
		const { currentValue } = this.state;
		const { value, onChange } = this.props;
		if (value) {
			if (onChange) onChange(currentValue + 1);
		} else {
			this.setValue(currentValue + 1);
		}
	};

	decrementValue = () => {
		if (this.state.currentValue === this.props.data.start) {
			return;
		}
		const { currentValue } = this.state;
		const { value, onChange } = this.props;
		if (value) {
			if (onChange) onChange(currentValue - 1);
		} else {
			this.setValue(currentValue - 1);
		}
	};

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
		checkValueChange(props.componentId, value, props.beforeValueChange, performUpdate);
	};

	updateQuery = (value, props) => {
		const { customQuery } = props;
		const query = customQuery || this.defaultQuery;

		const customQueryOptions = customQuery
			? getOptionsFromQuery(customQuery(value, props))
			: null;
		props.setQueryOptions(props.componentId, customQueryOptions);

		props.updateQuery({
			componentId: props.componentId,
			query: query(value, props),
			value,
			showFilter: false, // we don't need filters for NumberBox
			URLParams: props.URLParams,
			componentType: 'NUMBERBOX',
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
					className={numberBoxContainer}
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
	data: types.dataNumberBox,
	dataField: types.stringRequired,
	defaultValue: types.number,
	value: types.number,
	innerClass: types.style,
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
)(props => <NumberBox ref={props.myForwardedRef} {...props} />);

export default React.forwardRef((props, ref) => (
	<ConnectedComponent {...props} myForwardedRef={ref} />
));
