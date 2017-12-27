import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
} from '@appbaseio/reactivecore/lib/actions';
import {
	isEqual,
	checkValueChange,
	checkPropChange,
	getClassName,
} from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';

import Title from '../../styles/Title';
import Button, { toggleButtons } from '../../styles/Button';

class ToggleButton extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentValue: [],
		};
	}

	componentWillMount() {
		this.props.addComponent(this.props.componentId);
		this.setReact(this.props);

		if (this.props.selectedValue) {
			this.handleToggle(this.props.selectedValue, true);
		} else if (this.props.defaultSelected) {
			this.handleToggle(this.props.defaultSelected, true);
		}
	}

	componentWillReceiveProps(nextProps) {
		checkPropChange(this.props.react, nextProps.react, () =>
			this.setReact(nextProps));
		if (!isEqual(this.props.defaultSelected, nextProps.defaultSelected)) {
			this.handleToggle(nextProps.defaultSelected, true, nextProps);
		} else if (!isEqual(this.state.currentValue, nextProps.selectedValue)) {
			this.handleToggle(nextProps.selectedValue || [], true, nextProps);
		}
	}

	componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
	}

	defaultQuery = (value, props) => {
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
		return query;
	};

	handleToggle = (value, isDefaultValue = false, props = this.props) => {
		const { currentValue } = this.state;
		let toggleValue = value;
		let finalValue = [];
		if (isDefaultValue) {
			if (!Array.isArray(toggleValue)) {
				toggleValue = [toggleValue];
			}
			finalValue = toggleValue.reduce((fin, next) => {
				const match = props.data.find(item => item.label === next);
				return match ? fin.concat(match) : fin;
			}, []);
		} else if (this.props.multiSelect) {
			finalValue = currentValue.some(item => item.label === toggleValue.label)
				? currentValue.filter(item => item.label !== toggleValue.label)
				: currentValue.concat(toggleValue);
		} else {
			finalValue = currentValue.some(item => item.label === toggleValue.label)
				? [] : [toggleValue];
		}
		this.setValue(finalValue);
	}

	setReact(props) {
		if (props.react) {
			props.watchComponent(props.componentId, props.react);
		}
	}

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
			props.multiSelect ? value : value[0],
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
			value: props.multiSelect ? value : value[0].label,	// sets a string in URL not array
			label: props.filterLabel,
			showFilter: props.showFilter,
			onQueryChange,
			URLParams: props.URLParams,
		});
	};

	render() {
		return (
			<div style={this.props.style} className={`${toggleButtons} ${this.props.className || ''}`}>
				{
					this.props.title
					&& <Title className={getClassName(this.props.innerClass, 'title') || null}>{this.props.title}</Title>
				}
				{this.props.data.map(item => (
					<Button
						className={getClassName(this.props.innerClass, 'button') || null}
						onClick={() => this.handleToggle(item)}
						key={item.label}
						primary={this.state.currentValue.some(value => value.label === item.label)}
						large
					>
						{item.label}
					</Button>
				))}
			</div>
		);
	}
}

ToggleButton.propTypes = {
	addComponent: types.funcRequired,
	componentId: types.stringRequired,
	data: types.data,
	selectedValue: types.selectedValue,
	defaultSelected: types.stringArray,
	multiSelect: types.bool,
	react: types.react,
	removeComponent: types.funcRequired,
	title: types.title,
	updateQuery: types.funcRequired,
	showFilter: types.bool,
	filterLabel: types.string,
	style: types.style,
	className: types.string,
	innerClass: types.style,
	URLParams: types.bool,
};

ToggleButton.defaultProps = {
	multiSelect: true,
	URLParams: false,
	showFilter: true,
	style: {},
	className: null,
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
	watchComponent: (component, react) =>
		dispatch(watchComponent(component, react)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
});

export default connect(mapStateToProps, mapDispatchtoProps)(ToggleButton);
