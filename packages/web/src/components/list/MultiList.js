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
	getAggsOrder
} from "@appbaseio/reactivecore/lib/utils/helper";

import types from "@appbaseio/reactivecore/lib/utils/types";

import Title from "../../styles/Title";
import { FormControlList, Checkbox } from "../../styles/FormControlList";

class MultiList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentValue: {},
			options: []
		};
		this.type = props.queryFormat === "or" ? "terms" : "term";
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
		if (!isEqual(nextProps.react, this.props.react)) {
			this.setReact(nextProps);
		}
		if (!isEqual(nextProps.options, this.props.options)) {
			this.setState({
				options: nextProps.options[nextProps.dataField].buckets || []
			});
		}

		const selectedValue = Object.keys(this.state.currentValue)
			.filter(item => this.state.currentValue[item]);

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

	defaultQuery = (value) => {
		let query = null;
		if (this.selectAll) {
			query = {
				exists: {
					field: [this.props.dataField]
				}
			};
		} else if (value) {
			let listQuery;
			if (this.props.queryFormat === "or") {
				listQuery = {
					[this.type]: {
						[this.props.dataField]: value
					}
				};
			} else {
				// adds a sub-query with must as an array of objects for each term/value
				const queryArray = value.map(item => (
					{
						[this.type]: {
							[this.props.dataField]: item
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
	}

	setValue = (value, isDefaultValue = false) => {
		let { currentValue } = this.state;
		let finalValues = null;

		if (isDefaultValue) {
			finalValues = value;
			currentValue = {};
			value && value.forEach(item => {
				currentValue[item] = true;
			});
		} else {
			currentValue[value] = currentValue[value] ? false : true;
			finalValues = Object.keys(currentValue).filter(item => currentValue[item]);
		}

		const performUpdate = () => {
			this.setState({
				currentValue
			});
			this.updateQuery(finalValues);
		}

		checkValueChange(
			this.props.componentId,
			finalValues,
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
				<ul className={FormControlList}>
					{
						this.state.options.map(item => (
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
								<label htmlFor={item.key}>{item.key}</label>
							</li>
						))
					}
				</ul>
			</div>
		);
	}
}

MultiList.propTypes = {
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
	showCheckbox: types.showInputControl,
	filterLabel: types.string,
	selectedValue: types.selectedValue,
	queryFormat: types.queryFormatSearch,
	URLParams: types.URLParams
}

MultiList.defaultProps = {
	size: 100,
	sortBy: "count",
	showCheckbox: true,
	queryFormat: "or"
}

const mapStateToProps = (state, props) => ({
	options: state.aggregations[props.componentId],
	selectedValue: state.selectedValues[props.componentId] && state.selectedValues[props.componentId].value || []
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	updateQuery: (component, query, value, label, onQueryChange, URLParams) => dispatch(updateQuery(component, query, value, label, onQueryChange, URLParams)),
	setQueryOptions: (component, props) => dispatch(setQueryOptions(component, props))
});

export default connect(mapStateToProps, mapDispatchtoProps)(MultiList);
