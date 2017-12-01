import React, { Component } from "react";
import { connect } from "react-redux";

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery
} from "@appbaseio/reactivecore/lib/actions";
import {
	getQueryOptions,
	pushToAndClause,
	checkValueChange,
	getAggsOrder,
	checkPropChange,
	checkSomePropChange
} from "@appbaseio/reactivecore/lib/utils/helper";

import types from "@appbaseio/reactivecore/lib/utils/types";

import Title from "../../styles/Title";
import { UL, Radio } from "../../styles/FormControlList";

class SingleRange extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentValue: null
		};
		this.type = "range";
	}

	componentWillMount() {
		this.props.addComponent(this.props.componentId);
		this.setReact(this.props);

		if (this.props.selectedValue) {
			this.setValue(this.props.selectedValue, true);
		} else if (this.props.defaultSelected) {
			this.setValue(this.props.defaultSelected, true);
		}
	}

	componentWillReceiveProps(nextProps) {
		checkPropChange(
			this.props.react,
			nextProps.react,
			() => this.setReact(nextProps)
		);

		if (this.props.defaultSelected !== nextProps.defaultSelected) {
			this.setValue(nextProps.defaultSelected, true);
		} else if (this.state.currentValue !== nextProps.selectedValue) {
			this.setValue(nextProps.selectedValue, true);
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

	defaultQuery = (value, props) => {
		if (value) {
			return {
				range: {
					[props.dataField]: {
						gte: value.start,
						lte: value.end,
						boost: 2.0
					}
				}
			};
		}
		return null;
	}

	setValue = (value, isDefaultValue = false, props = this.props) => {
		const currentValue = props.data.find(item => item.label === value) || null;

		const performUpdate = () => {
			this.setState({
				currentValue
			}, () => {
				this.updateQuery(currentValue, props);
			});
		}

		checkValueChange(
			props.componentId,
			currentValue,
			props.beforeValueChange,
			props.onValueChange,
			performUpdate
		);
	}

	updateQuery = (value, props) => {
		const query = props.customQuery || this.defaultQuery;
		let callback = null;

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
	}

	render() {
		return (
			<div>
				{this.props.title && <Title>{this.props.title}</Title>}
				<UL>
					{
						this.props.data.map(item => (
							<li key={item.label}>
								<Radio
									id={item.label}
									name={this.props.componentId}
									value={item.label}
									onClick={e => this.setValue(e.target.value)}
									checked={!!this.state.currentValue && this.state.currentValue.label === item.label}
									show={this.props.showRadio}
								/>
								<label htmlFor={item.label}>
									{item.label}
								</label>
							</li>
						))
					}
				</UL>
			</div>
		);
	}
}

SingleRange.propTypes = {
	addComponent: types.addComponent,
	componentId: types.componentId,
	defaultSelected: types.string,
	react: types.react,
	removeComponent: types.removeComponent,
	dataField: types.dataField,
	data: types.data,
	beforeValueChange: types.beforeValueChange,
	onValueChange: types.onValueChange,
	customQuery: types.customQuery,
	onQueryChange: types.onQueryChange,
	updateQuery: types.updateQuery,
	filterLabel: types.string,
	selectedValue: types.selectedValue,
	title: types.title,
	URLParams: types.URLParams,
	showFilter: types.showFilter,
	showRadio: types.showInputControl
}

SingleRange.defaultProps = {
	URLParams: false,
	showFilter: true,
	showRadio: true
}

const mapStateToProps = (state, props) => ({
	selectedValue: state.selectedValues[props.componentId] && state.selectedValues[props.componentId].value || null
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	updateQuery: (updateQueryObject) => dispatch(updateQuery(updateQueryObject))
});

export default connect(mapStateToProps, mapDispatchtoProps)(SingleRange);
