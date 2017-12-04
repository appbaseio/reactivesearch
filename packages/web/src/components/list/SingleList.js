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
	getQueryOptions,
	pushToAndClause,
	checkValueChange,
	getAggsOrder,
	checkPropChange,
	checkSomePropChange
} from "@appbaseio/reactivecore/lib/utils/helper";

import types from "@appbaseio/reactivecore/lib/utils/types";

import Title from "../../styles/Title";
import Input from "../../styles/Input";
import { UL, Radio } from "../../styles/FormControlList";

class SingleList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentValue: "",
			options: [],
			searchTerm: ""
		};
		this.type = "term";
		this.internalComponent = props.componentId + "__internal";
	}

	componentWillMount() {
		this.props.addComponent(this.internalComponent);
		this.props.addComponent(this.props.componentId);
		this.setReact(this.props);

		this.updateQueryOptions(this.props);

		if (this.props.selectedValue) {
			this.setValue(this.props.selectedValue);
		} else if (this.props.defaultSelected) {
			this.setValue(this.props.defaultSelected);
		}
	}

	componentWillReceiveProps(nextProps) {
		checkPropChange(
			this.props.react,
			nextProps.react,
			() => this.setReact(nextProps)
		);
		checkPropChange(
			this.props.options,
			nextProps.options,
			() => {
				this.setState({
					options: nextProps.options[nextProps.dataField].buckets || []
				});
			}
		);
		checkSomePropChange(
			this.props,
			nextProps,
			["size", "sortBy"],
			() => this.updateQueryOptions(nextProps)
		);
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

	defaultQuery = (value, props) => {
		if (this.selectAll) {
			return {
				exists: {
					field: [props.dataField]
				}
			};
		} else if (value) {
			return {
				[this.type]: {
					[props.dataField]: value
				}
			};
		}
		return null;
	}

	setValue = (value, props = this.props) => {
		if (value == this.state.currentValue) {
			value = "";
		}

		const performUpdate = () => {
			this.setState({
				currentValue: value
			}, () => {
				this.updateQuery(value, props);
			});
		}

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
	}

	updateQueryOptions = (props) => {
		const queryOptions = getQueryOptions(props);
		queryOptions.aggs = {
			[props.dataField]: {
				terms: {
					field: props.dataField,
					size: props.size,
					order: getAggsOrder(props.sortBy)
				}
			}
		}
		props.setQueryOptions(this.internalComponent, queryOptions);
		// Since the queryOptions are attached to the internal component,
		// we need to notify the subscriber (parent component)
		// that the query has changed because no new query will be
		// auto-generated for the internal component as its
		// dependency tree is empty
		props.updateQuery({
			componentId: this.internalComponent,
			query: null
		});
	}

	handleInputChange = (e) => {
		const { value } = e.target;
		this.setState({
			searchTerm: value
		});
	}

	renderSearch = () => {
		if (this.props.showSearch) {
			return <Input
				onChange={this.handleInputChange}
				value={this.state.searchTerm}
				placeholder={this.props.placeholder}
				style={{
					margin: "0 0 8px"
				}}
			/>
		}
		return null;
	}

	render() {
		return (
			<div>
				{this.props.title && <Title>{this.props.title}</Title>}
				{this.renderSearch()}
				<UL>
					{
						this.state.options
							.filter(item => {
								if (this.props.showSearch && this.state.searchTerm) {
									return item.key.toLowerCase().includes(this.state.searchTerm.toLowerCase());
								}
								return true;
							})
							.map(item => (
								<li key={item.key}>
									<Radio
										id={item.key}
										name={this.props.componentId}
										value={item.key}
										onClick={e => this.setValue(e.target.value)}
										checked={this.state.currentValue === item.key}
										show={this.props.showRadio}
									/>
									<label htmlFor={item.key}>
										{item.key}
										{
											this.props.showCount &&
											` (${item.doc_count})`
										}
									</label>
								</li>
							))
					}
				</UL>
			</div>
		);
	}
}

SingleList.propTypes = {
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
	URLParams: types.URLParams,
	showFilter: types.showFilter,
	size: types.size,
	showCount: types.showCount,
	showSearch: types.bool,
	placeholder: types.placeholder
}

SingleList.defaultProps = {
	size: 100,
	sortBy: "count",
	showRadio: true,
	URLParams: false,
	showCount: true,
	showFilter: true,
	placeholder: "Search",
	showSearch: true
}

const mapStateToProps = (state, props) => ({
	options: state.aggregations[props.componentId],
	selectedValue: state.selectedValues[props.componentId] && state.selectedValues[props.componentId].value || null
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	updateQuery: (updateQueryObject) => dispatch(updateQuery(updateQueryObject)),
	setQueryOptions: (component, props) => dispatch(setQueryOptions(component, props))
});

export default connect(mapStateToProps, mapDispatchtoProps)(SingleList);
