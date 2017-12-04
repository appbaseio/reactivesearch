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
		if (this.props.selectAllLabel && this.props.selectAllLabel === value) {
			return {
				exists: {
					field: props.dataField
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
	};

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
	};

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
	};

	handleInputChange = (e) => {
		const { value } = e.target;
		this.setState({
			searchTerm: value
		});
	};

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
	};

	render() {
		const { selectAllLabel } = this.props;

		if (this.state.options.length === 0) {
			return null;
		}

		return (
			<div>
				{this.props.title && <Title>{this.props.title}</Title>}
				{this.renderSearch()}
				<UL>
					{
						selectAllLabel
							? (<li key={selectAllLabel}>
								<Radio
									id={selectAllLabel}
									name={this.props.componentId}
									value={selectAllLabel}
									onClick={e => this.setValue(e.target.value)}
									checked={this.state.currentValue === selectAllLabel}
									show={this.props.showRadio}
								/>
								<label htmlFor={selectAllLabel}>
									{selectAllLabel}
								</label>
							</li>)
							: null
					}
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
	componentId: types.stringRequired,
	addComponent: types.funcRequired,
	dataField: types.stringRequired,
	sortBy: types.sortByWithCount,
	setQueryOptions: types.funcRequired,
	updateQuery: types.funcRequired,
	defaultSelected: types.string,
	react: types.react,
	options: types.options,
	removeComponent: types.funcRequired,
	beforeValueChange: types.func,
	onValueChange: types.func,
	customQuery: types.func,
	onQueryChange: types.func,
	placeholder: types.string,
	title: types.title,
	showRadio: types.boolRequired,
	filterLabel: types.string,
	selectedValue: types.selectedValue,
	URLParams: types.boolRequired,
	showFilter: types.bool,
	size: types.number,
	showCount: types.bool,
	showSearch: types.bool,
	selectAllLabel: types.string
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
