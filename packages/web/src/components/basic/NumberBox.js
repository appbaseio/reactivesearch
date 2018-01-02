import React, { Component } from 'react';
import { connect } from 'react-redux';

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

class NumberBox extends Component {
	constructor(props) {
		super(props);

		this.type = 'term';
		this.state = {
			currentValue: this.props.data.start,
		};
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
		const performUpdate = () => {
			this.setState({
				currentValue: value,
			}, () => {
				this.updateQuery(value, props);
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
		let onQueryChange = null;
		if (props.onQueryChange) {
			onQueryChange = props.onQueryChange;
		}
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
	componentId: types.stringRequired,
	defaultSelected: types.number,
	data: types.dataNumberBox,
	react: types.react,
	removeComponent: types.funcRequired,
	title: types.title,
	queryFormat: types.queryFormatNumberBox,
	labelPosition: types.labelPosition,
	URLParams: types.boolRequired,
	selectedValue: types.selectedValue,
	style: types.style,
	className: types.string,
	innerClass: types.style,
};

NumberBox.defaultProps = {
	queryFormat: 'gte',
	labelPosition: 'left',
	URLParams: false,
	style: {},
	className: null,
};

const mapStateToProps = (state, props) => ({
	selectedValue: state.selectedValues[props.componentId]
		? state.selectedValues[props.componentId].value
		: null,
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
});

export default connect(mapStateToProps, mapDispatchtoProps)(NumberBox);
