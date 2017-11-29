import React, { Component } from "react";
import { connect } from "react-redux";

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryOptions
} from "@appbaseio/reactivecore/lib/actions";
import {
	isEqual,
	getQueryOptions,
	pushToAndClause,
	checkValueChange,
	getAggsOrder,
	checkPropChange,
	checkSomePropChange
} from "@appbaseio/reactivecore/lib/utils/helper";

import types from "@appbaseio/reactivecore/lib/utils/types";

import Title from "../../styles/Title";
import Dropdown from "../shared/Dropdown";

class SingleDropdownList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentValue: "",
			options: []
		};
		this.type = "term";
		this.internalComponent = props.componentId + "__internal";
	}

	componentDidMount() {
		this.props.addComponent(this.internalComponent);
		this.props.addComponent(this.props.componentId);
		this.setReact(this.props);

		const queryOptions = getQueryOptions(this.props);
		queryOptions.aggs = {
			[this.props.dataField]: {
				terms: {
					field: this.props.dataField,
					size: 100,
					order: getAggsOrder(this.props.sortBy)
				}
			}
		}
		this.props.setQueryOptions(this.internalComponent, queryOptions);
		// Since the queryOptions are attached to the internal component,
		// we need to notify the subscriber (parent component)
		// that the query has changed because no new query will be
		// auto-generated for the internal component as its
		// dependency tree is empty
		this.props.updateQuery(this.internalComponent, null);

		if (this.props.defaultSelected) {
			this.setValue(this.props.defaultSelected);
		}
	}

	componentWillReceiveProps(nextProps) {
		checkSomePropChange(
			this.props,
			nextProps,
			["highlight", "dataField", "highlightField"],
			() => {
				const queryOptions = this.highlightQuery(nextProps);
				this.props.setQueryOptions(nextProps.componentId, queryOptions);
			}
		);

		if (!isEqual(nextProps.react, this.props.react)) {
			this.setReact(nextProps);
		}
		if (!isEqual(nextProps.options, this.props.options)) {
			this.setState({
				options: nextProps.options[nextProps.dataField].buckets || []
			});
		}
		if (this.props.defaultSelected !== nextProps.defaultSelected) {
			this.setValue(nextProps.defaultSelected);
		} else if (this.state.currentValue !== nextProps.selectedValue) {
			this.setValue(nextProps.selectedValue || "");
		}
	}

	componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
		this.props.removeComponent(this.internalComponent);
	}

	setReact = (props) => {
		const { react } = props;
		if (react) {
			const newReact = pushToAndClause(react, this.internalComponent);
			props.watchComponent(props.componentId, newReact);
		} else {
			props.watchComponent(props.componentId, { and: this.internalComponent });
		}
	};

	defaultQuery = (value) => {
		if (this.selectAll) {
			return {
				exists: {
					field: [this.props.dataField]
				}
			};
		} else if (value) {
			return {
				[this.type]: {
					[this.props.dataField]: value
				}
			};
		}
		return null;
	}

	setValue = (value) => {
		const performUpdate = () => {
			this.setState({
				currentValue: value
			});
			this.updateQuery(value);
		}

		checkValueChange(
			this.props.componentId,
			value,
			this.props.beforeValueChange,
			this.props.onValueChange,
			performUpdate
		);
	};

	updateQuery = (value) => {
		const query = this.props.customQuery || this.defaultQuery;
		let callback = null;
		if (this.props.onQueryChange) {
			callback = this.props.onQueryChange;
		}
		this.props.updateQuery(this.props.componentId, query(value), value, this.props.filterLabel, callback, this.props.URLParams);
	}

	render() {
		return (
			<div>
				{
					this.props.title
						? (<Title>{this.props.title}</Title>)
						: null
				}
				<Dropdown
					items={this.state.options}
					onChange={this.setValue}
					selectedItem={this.state.currentValue}
					placeholder={this.props.placeholder}
				/>
			</div>
		);
	}
}

SingleDropdownList.propTypes = {
	componentId: types.componentId,
	addComponent: types.addComponent,
	dataField: types.dataField,
	sortBy: types.sortByWithCount,
	setQueryOptions: types.setQueryOptions,
	updateQuery: types.updateQuery,
	defaultSelected: types.string,
	react: types.react,
	options: types.options,
	removeComponent: types.removeComponent,
	beforeValueChange: types.beforeValueChange,
	onValueChange: types.onValueChange,
	customQuery: types.customQuery,
	onQueryChange: types.onQueryChange,
	placeholder: types.placeholder,
	title: types.title,
	showRadio: types.showInputControl,
	filterLabel: types.string,
	selectedValue: types.selectedValue,
	URLParams: types.URLParams
}

SingleDropdownList.defaultProps = {
	size: 100,
	sortBy: "count",
	showRadio: true,
	placeholder: "Select a value"
}

const mapStateToProps = (state, props) => ({
	options: state.aggregations[props.componentId],
	selectedValue: state.selectedValues[props.componentId] && state.selectedValues[props.componentId].value || null
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	updateQuery: (component, query, value, label, onQueryChange, URLParams) => dispatch(updateQuery(component, query, value, label, onQueryChange, URLParams)),
	setQueryOptions: (component, props) => dispatch(setQueryOptions(component, props))
});

export default connect(mapStateToProps, mapDispatchtoProps)(SingleDropdownList);
