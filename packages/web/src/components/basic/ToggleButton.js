import React, { Component } from "react";
import { connect } from "react-redux";

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery
} from "@appbaseio/reactivecore/lib/actions";
import {
	checkValueChange,
	checkPropChange
} from "@appbaseio/reactivecore/lib/utils/helper";
import types from "@appbaseio/reactivecore/lib/utils/types";

import Title from "../../styles/Title";
import Button from "../../styles/Button";

class ToggleButton extends Component {
	constructor(props) {
		super(props);

		this.type = "term";
		this.state = {
			currentValue: []
		};
	}

	componentDidMount() {
		this.props.addComponent(this.props.componentId);
		this.setReact(this.props);

		if (this.props.selectedValue) {
			this.setValue(this.props.selectedValue);
		} else if (this.props.defaultSelected) {
			this.setValue(this.props.defaultSelected);
		}
	}

	componentWillReceiveProps(nextProps) {
		checkPropChange(this.props.react, nextProps.react, () =>
			this.setReact(nextProps)
		);
		if (this.props.defaultSelected !== nextProps.defaultSelected) {
			this.setValue(nextProps.defaultSelected, nextProps);
		} else if (this.state.currentValue !== nextProps.selectedValue) {
			this.setValue(nextProps.selectedValue || [], nextProps);
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
							[props.dataField]: item
						}
					}))
				}
			}
		}
		return query;
	};

	handleToggle = (value) => {
		const { currentValue } = this.state;
		let finalValue = [];
		if (this.props.multiSelect) {
			finalValue = currentValue.includes(value) ?
				currentValue.filter(item => item !== value) :
				currentValue.concat(value);
		} else {
			finalValue = currentValue.includes(value) ? [] : [value];
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
				currentValue: value
			});
			this.updateQuery(value, props);
		};
		checkValueChange(
			props.componentId,
			value,
			props.beforeValueChange,
			props.onValueChange,
			performUpdate
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
			label: props.filterLabel,
			showFilter: props.showFilter,
			onQueryChange,
			URLParams: props.URLParams
		});
	};

	render() {
		return (
			<div>
				{
					this.props.title &&
					<Title>{this.props.title}</Title>
				}
				{this.props.data.map(item => (
					<Button
						onClick={() => this.handleToggle(item.value)}
						key={item.label}
						primary={this.state.currentValue.includes(item.value)}
					>
						{item.label}
					</Button>
				))}
			</div>
		);
	}
}

ToggleButton.propTypes = {
	addComponent: types.addComponent,
	componentId: types.componentId,
	data: types.data,
	selectedValue: types.selectedValue,
	defaultSelected: types.stringArray,
	multiSelect: types.multiSelect,
	react: types.react,
	removeComponent: types.removeComponent,
	title: types.title,
	updateQuery: types.updateQuery
};

ToggleButton.defaultProps = {
	multiSelect: false,
	URLParams: false
};

const mapStateToProps = (state, props) => ({
	selectedValue:
		(state.selectedValues[props.componentId] &&
			state.selectedValues[props.componentId].value) ||
		null
});

const mapDispatchtoProps = (dispatch, props) => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	watchComponent: (component, react) =>
		dispatch(watchComponent(component, react)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject))
});

export default connect(mapStateToProps, mapDispatchtoProps)(ToggleButton);
