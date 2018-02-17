import React, { Component } from 'react';

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
} from '@appbaseio/reactivecore/lib/actions';
import {
	checkValueChange,
	checkPropChange,
	getClassName,
} from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';

import Title from '../../styles/Title';
import Button, { numberBoxContainer } from '../../styles/Button';
import Flex from '../../styles/Flex';
import { connect } from '../../utils';

class NumberBox extends Component {
	constructor(props) {
		super(props);

		this.type = 'term';
		this.state = {
			currentValue: this.props.data.start,
		};
		this.locked = false;
	}

	componentWillMount() {
		this.props.addComponent(this.props.componentId);
		this.setReact(this.props);

		if (this.props.selectedValue) {
			this.setValue(this.props.selectedValue);
		} else if (this.props.defaultSelected) {
			this.setValue(this.props.defaultSelected);
		}
	}

	componentWillReceiveProps(nextProps) {
		checkPropChange(this.props.react, nextProps.react, () => {
			this.setReact(nextProps);
		});
		checkPropChange(this.props.defaultSelected, nextProps.defaultSelected, () => {
			this.setValue(nextProps.defaultSelected, nextProps);
		});
		checkPropChange(this.props.queryFormat, nextProps.queryFormat, () => {
			this.updateQuery(this.state.currentValue, nextProps);
		});
		checkPropChange(this.props.dataField, nextProps.dataField, () => {
			this.updateQuery(this.state.currentValue, nextProps);
		});
	}

	componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
	}

	defaultQuery = (value, props) => {
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
			case 'gte':
				return {
					range: {
						[props.dataField]: {
							gte: value,
							boost: 2.0,
						},
					},
				};
			default:
				return null;
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
		this.setValue(currentValue + 1);
	};

	decrementValue = () => {
		if (this.state.currentValue === this.props.data.start) {
			return;
		}
		const { currentValue } = this.state;
		this.setValue(currentValue - 1);
	};

	setValue = (value, props = this.props) => {
		// ignore state updates when component is locked
		if (props.beforeValueChange && this.locked) {
			return;
		}

		this.locked = true;
		const performUpdate = () => {
			this.setState({
				currentValue: value,
			}, () => {
				this.updateQuery(value, props);
				this.locked = false;
			});
		};
		checkValueChange(
			props.componentId,
			value,
			props.beforeValueChange,
			props.onValueChange,
			performUpdate,
		);
	};

	updateQuery = (value, props) => {
		const query = props.customQuery || this.defaultQuery;

		const { onQueryChange = null } = props;

		props.updateQuery({
			componentId: props.componentId,
			query: query(value, props),
			value,
			onQueryChange,
			showFilter: false, // we don't need filters for NumberBox
			URLParams: props.URLParams,
		});
	};

	render() {
		return (
			<div style={this.props.style} className={this.props.className}>
				{this.props.title && (
					<Title className={getClassName(this.props.innerClass, 'title') || null}>
						{this.props.title}
					</Title>
				)}
				<Flex labelPosition={this.props.labelPosition} justifyContent="space-between" className={numberBoxContainer}>
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
			</div>
		);
	}
}

NumberBox.propTypes = {
	addComponent: types.funcRequired,
	removeComponent: types.funcRequired,
	updateQuery: types.funcRequired,
	watchComponent: types.funcRequired,
	selectedValue: types.selectedValue,
	// component props
	className: types.string,
	componentId: types.stringRequired,
	data: types.dataNumberBox,
	dataField: types.stringRequired,
	defaultSelected: types.number,
	innerClass: types.style,
	labelPosition: types.labelPosition,
	onQueryChange: types.func,
	queryFormat: types.queryFormatNumberBox,
	react: types.react,
	style: types.style,
	title: types.title,
	URLParams: types.boolRequired,
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
});

export default connect(mapStateToProps, mapDispatchtoProps)(NumberBox);
