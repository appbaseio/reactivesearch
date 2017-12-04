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
import Input from "../../styles/Input";
import { UL, Checkbox } from "../../styles/FormControlList";

class MultiList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentValue: {},
			options: [],
			searchTerm: ""
		};
		this.internalComponent = props.componentId + "__internal";
	}

	componentWillMount() {
		this.props.addComponent(this.internalComponent);
		this.props.addComponent(this.props.componentId);
		this.setReact(this.props);

		this.updateQueryOptions(this.props);

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

		let selectedValue = Object.keys(this.state.currentValue);

		if (this.props.selectAllLabel) {
			selectedValue = selectedValue.filter(val => val !== this.props.selectAllLabel);

			if (!!this.state.currentValue[this.props.selectAllLabel]) {
				selectedValue = [this.props.selectAllLabel];
			}
		}

		if (this.props.defaultSelected !== nextProps.defaultSelected) {
			this.setValue(nextProps.defaultSelected, true);
		} else if (!isEqual(selectedValue, nextProps.selectedValue)) {
			this.setValue(nextProps.selectedValue, true);
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
		let query = null;
		const type = props.queryFormat === "or" ? "terms" : "term";
		if (this.props.selectAllLabel && value.includes(this.props.selectAllLabel)) {
			query = {
				exists: {
					field: props.dataField
				}
			};
		} else if (value) {
			let listQuery;
			if (props.queryFormat === "or") {
				listQuery = {
					[type]: {
						[props.dataField]: value
					}
				};
			} else {
				// adds a sub-query with must as an array of objects for each term/value
				const queryArray = value.map(item => (
					{
						[type]: {
							[props.dataField]: item
						}
					}
				));
				listQuery = {
					bool: {
						must: queryArray
					}
				};
			}

			query = value.length ? listQuery : null;
		}
		return query;
	};

	setValue = (value, isDefaultValue = false, props = this.props) => {
		const { selectAllLabel } = this.props;
		let { currentValue } = this.state;
		let finalValues = null;

		if (selectAllLabel &&
			((Array.isArray(value) && value.includes(selectAllLabel)) ||
			(typeof value === "string" && value === selectAllLabel))) {
			if (!!currentValue[selectAllLabel]) {
				currentValue = {};
				finalValues = [];
			} else {
				this.state.options.forEach(item => {
					currentValue[item.key] = true;
				});
				currentValue[selectAllLabel] = true;
				finalValues = [selectAllLabel];
			}
		} else if (isDefaultValue) {
			finalValues = value;
			currentValue = {};
			value && value.forEach(item => {
				currentValue[item] = true;
			});

			if (selectAllLabel && selectAllLabel in currentValue) {
				const { [selectAllLabel]: del, ...obj } = currentValue;
				currentValue = { ...obj };
			}
		} else {
			if (currentValue[value]) {
				const { [value]: del, ...rest } = currentValue;
				currentValue = { ...rest };
			} else {
				currentValue[value] = true;
			}

			if (selectAllLabel && selectAllLabel in currentValue) {
				const { [selectAllLabel]: del, ...obj } = currentValue;
				currentValue = { ...obj };
			}
			finalValues = Object.keys(currentValue);
		}

		const performUpdate = () => {
			this.setState({
				currentValue
			}, () => {
				this.updateQuery(finalValues, props);
			});
		}

		checkValueChange(
			props.componentId,
			finalValues,
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
			<div style={this.props.style} className={this.props.className}>
				{this.props.title && <Title>{this.props.title}</Title>}
				{this.renderSearch()}
				<UL>
					{
						selectAllLabel
							? (<li key={selectAllLabel}>
								<Checkbox
									id={selectAllLabel}
									name={selectAllLabel}
									value={selectAllLabel}
									onClick={e => this.setValue(e.target.value)}
									checked={!!this.state.currentValue[selectAllLabel]}
									show={this.props.showCheckbox}
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
									<Checkbox
										id={item.key}
										name={this.props.componentId}
										value={item.key}
										onClick={e => this.setValue(e.target.value)}
										checked={!!this.state.currentValue[item.key]}
										onChange={() => {}}
										show={this.props.showCheckbox}
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

MultiList.propTypes = {
	componentId: types.stringRequired,
	addComponent: types.funcRequired,
	dataField: types.stringRequired,
	sortBy: types.sortByWithCount,
	setQueryOptions: types.funcRequired,
	updateQuery: types.funcRequired,
	defaultSelected: types.stringArray,
	react: types.react,
	options: types.options,
	removeComponent: types.funcRequired,
	beforeValueChange: types.func,
	onValueChange: types.func,
	customQuery: types.func,
	onQueryChange: types.func,
	placeholder: types.string,
	title: types.title,
	showCheckbox: types.boolRequired,
	filterLabel: types.string,
	selectedValue: types.selectedValue,
	queryFormat: types.queryFormatSearch,
	URLParams: types.boolRequired,
	showCount: types.bool,
	size: types.number,
	showSearch: types.bool,
	selectAllLabel: types.string,
	style: types.style,
	className: types.string
}

MultiList.defaultProps = {
	size: 100,
	sortBy: "count",
	showCheckbox: true,
	queryFormat: "or",
	URLParams: false,
	showCount: true,
	placeholder: "Search",
	showSearch: true,
	style: {},
	className: null
}

const mapStateToProps = (state, props) => ({
	options: state.aggregations[props.componentId],
	selectedValue: state.selectedValues[props.componentId] && state.selectedValues[props.componentId].value || []
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	updateQuery: (updateQueryObject) => dispatch(updateQuery(updateQueryObject)),
	setQueryOptions: (component, props) => dispatch(setQueryOptions(component, props))
});

export default connect(mapStateToProps, mapDispatchtoProps)(MultiList);
