/* eslint max-lines: 0 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import {
	InitialLoader,
	TYPES,
	AppbaseChannelManager as manager,
	AppbaseSensorHelper as helper
} from "@appbaseio/reactivemaps";
import StaticSearch from "../addons/StaticSearch";

const _ = require("lodash");

export default class NestedList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			items: [],
			storedItems: [],
			rawData: {
				hits: {
					hits: []
				}
			},
			subItems: [],
			selectedValues: []
		};
		this.nested = [
			"nestedParentaggs"
		];
		this.sortObj = {
			aggSort: this.props.sortBy
		};
		this.channelId = null;
		this.channelListener = null;
		this.urlParams = props.URLParams ? helper.URLParams.get(props.componentId) : null;
		this.urlParams = this.urlParams ? this.urlParams.split("/") : null;
		this.filterBySearch = this.filterBySearch.bind(this);
		this.onItemSelect = this.onItemSelect.bind(this);
		this.onItemClick = this.onItemClick.bind(this);
		this.customQuery = this.customQuery.bind(this);
		this.handleSelect = this.handleSelect.bind(this);
		this.nestedAggQuery = this.nestedAggQuery.bind(this);
		this.type = "term";
	}

	// Get the items from Appbase when component is mounted
	componentWillMount() {
		this.previousQuery = null;	// initial value for onQueryChange
		this.setReact(this.props);
		this.setQueryInfo();
		this.createChannel();
	}

	componentDidMount() {
		setTimeout(this.checkDefault.bind(this, this.props), 100);
		this.listenFilter();
	}

	componentWillReceiveProps(nextProps) {
		if (!_.isEqual(this.props.defaultSelected, nextProps.defaultSelected)) {
			this.changeValue(nextProps.defaultSelected);
		}
		if (!_.isEqual(this.props.react, nextProps.react)) {
			this.setReact(nextProps);
			manager.update(this.channelId, this.react, nextProps.size, 0, false);
		}
	}

	// stop streaming request and remove listener when component will unmount
	componentWillUnmount() {
		if (this.channelId) {
			manager.stopStream(this.channelId);
		}
		if (this.channelListener) {
			this.channelListener.remove();
		}
		if (this.loadListenerParent) {
			this.loadListenerParent.remove();
		}
		if (this.loadListenerChild) {
			this.loadListenerChild.remove();
		}
		if (this.filterListener) {
			this.filterListener.remove();
		}
	}

	listenFilter() {
		this.filterListener = helper.sensorEmitter.addListener("clearFilter", (data) => {
			if (data === this.props.componentId) {
				this.changeValue(null);
			}
		});
	}

	checkDefault(props) {
		this.urlParams = props.URLParams ? helper.URLParams.get(props.componentId) : null;
		this.urlParams = this.urlParams ? this.urlParams.split("/") : null;
		const defaultValue = this.urlParams !== null ? this.urlParams : props.defaultSelected;
		this.changeValue(defaultValue);
	}

	changeValue(defaultValue) {
		if (!_.isEqual(this.defaultSelected, defaultValue)) {
			this.defaultSelected = defaultValue;
			let items = this.state.items;
			items = items.map((subitems) => {
				subitems = Array.isArray(subitems) ? subitems.map((item) => {
					item.key = item && item.key ? item.key.toString() : null;
					item.status = !!(this.defaultSelected && this.defaultSelected.length && this.defaultSelected.indexOf(item.key) > -1);
					return item;
				}) : null;
				return subitems;
			});
			this.setState({
				items,
				storedItems: items
			});
			this.handleSelect(this.defaultSelected);
		}
		if (this.sortBy !== this.props.sortBy) {
			this.sortBy = this.props.sortBy;
			this.handleSortSelect();
		}
	}

	handleSelect(defaultSelected) {
		if (defaultSelected) {
			this.defaultSelected.forEach((value, index) => {
				const customValue = defaultSelected.filter((item, subindex) => subindex <= index);
				this.onItemSelect(customValue);
			});
			// this.onItemSelect(this.defaultSelected);
		} else if (this.defaultSelected === null) {
			this.onItemSelect(null);
		}
	}

	// build query for this sensor only
	customQuery(record) {
		let query = null;
		function generateRangeQuery(dataField) {
			return record.map((singleRecord, index) => ({
				term: {
					[dataField[index]]: singleRecord
				}
			}));
		}
		if (Array.isArray(record) && record.length) {
			query = {
				bool: {
					must: generateRangeQuery(this.props.dataField)
				}
			};
		}
		return query;
	}

	// set the query type and input data
	setQueryInfo() {
		const getQuery = (value) => {
			const currentQuery = this.props.customQuery ? this.props.customQuery(value) : this.customQuery(value);
			if (this.props.onQueryChange && JSON.stringify(this.previousQuery) !== JSON.stringify(currentQuery)) {
				this.props.onQueryChange(this.previousQuery, currentQuery);
			}
			this.previousQuery = currentQuery;
			return currentQuery;
		};
		const obj = {
			key: this.props.componentId,
			value: {
				queryType: this.type,
				inputData: this.props.dataField[0],
				customQuery: getQuery,
				reactiveId: this.context.reactiveId,
				showFilter: this.props.showFilter,
				filterLabel: this.props.filterLabel ? this.props.filterLabel : this.props.componentId,
				component: "NestedList",
				defaultSelected: this.urlParams !== null ? this.urlParams : this.props.defaultSelected
			}
		};
		helper.selectedSensor.setSensorInfo(obj);
		const nestedObj = {
			key: `nestedSelectedValues-${this.props.componentId}`,
			value: {
				queryType: this.type,
				inputData: this.props.dataField[0],
				customQuery: () => { }
			}
		};
		helper.selectedSensor.setSensorInfo(nestedObj);
	}

	includeAggQuery() {
		this.nested.forEach((name) => {
			const obj = {
				key: name,
				value: this.sortObj
			};
			helper.selectedSensor.setSortInfo(obj);
		});
	}

	handleSortSelect() {
		this.sortObj = {
			aggSort: this.props.sortBy
		};
		this.nested.forEach((name) => {
			const obj = {
				key: name,
				value: this.sortObj
			};
			helper.selectedSensor.set(obj, true, "sortChange");
		});
	}

	nestedAggQuery() {
		let query = null;
		const level = Array.isArray(this.state.selectedValues) && this.state.selectedValues.length ? this.state.selectedValues.length : 0;
		const field = this.props.dataField[level];
		const orderType = this.props.sortBy === "count" ? "_count" : "_term";
		const sortBy = this.props.sortBy === "count" ? "desc" : this.props.sortBy;
		const createtermQuery = index => ({
			term: {
				[this.props.dataField[index]]: this.state.selectedValues[index]
			}
		});
		const createFilterQuery = (level) => {
			const filterMust = [];
			if (level > 0) {
				for (let i = 0; i <= level - 1; i++) {
					filterMust.push(createtermQuery(i));
				}
			}
			return {
				bool: {
					must: filterMust
				}
			};
		};
		const init = (field, level) => ({
			[`${field}-${level}`]: {
				filter: createFilterQuery(level),
				aggs: {
					[field]: {
						terms: {
							field,
							size: this.props.size,
							order: {
								[orderType]: sortBy
							}
						}
					}
				}
			}
		});
		if (Array.isArray(this.state.selectedValues) && this.state.selectedValues.length < this.props.dataField.length) {
			query = init(field, level);
		}
		return query;
	}

	setReact(props) {
		const react = Object.assign({}, props.react);
		react.aggs = {
			key: props.dataField[0],
			sort: props.sortBy,
			size: props.size,
			customQuery: this.nestedAggQuery
		};
		const reactAnd = [this.nested[0], `nestedSelectedValues-${props.componentId}`];
		this.react = helper.setupReact(react, reactAnd);
	}

	// Create a channel which passes the react and receive results whenever react changes
	createChannel() {
		this.includeAggQuery();
		// create a channel and listen the changes
		const channelObj = manager.create(this.context.appbaseRef, this.context.type, this.react, 100, 0, false, this.props.componentId);
		this.channelId = channelObj.channelId;
		this.channelListener = channelObj.emitter.addListener(this.channelId, (res) => {
			if (res.error) {
				this.setState({
					queryStart: false
				});
			}
			if (res.appliedQuery && Object.keys(res.appliedQuery).length) {
				this.queryLevel = this.getQueryLevel(res.appliedQuery);
				this.setState({
					queryStart: false,
					rawData: res.data
				});
				this.setData(res.data, this.queryLevel);
			}
		});
		this.listenLoadingChannel(channelObj, "loadListenerParent");
	}

	getQueryLevel(appliedQuery) {
		let level = 0;
		try {
			const field = Object.keys(appliedQuery.body.aggs)[0];
			if (field) {
				const appliedField = (field.split("-"))[0];
				level = this.props.dataField.indexOf(appliedField);
				level = level > -1 ? level : 0;
			}
		} catch (e) {
			console.log(e);
		}
		return level;
	}

	listenLoadingChannel(channelObj, listener) {
		this[listener] = channelObj.emitter.addListener(`${channelObj.channelId}-query`, (res) => {
			if (res.appliedQuery) {
				this.setState({
					queryStart: res.queryState
				});
			}
		});
	}

	setData(data, level) {
		const fieldLevel = `${this.props.dataField[level]}-${level}`;
		if (data && data.aggregations && data.aggregations[fieldLevel] && data.aggregations[fieldLevel][this.props.dataField[level]] && data.aggregations[fieldLevel][this.props.dataField[level]].buckets) {
			this.addItemsToList(data.aggregations[fieldLevel][this.props.dataField[level]].buckets, level);
		}
	}

	addItemsToList(newItems, level) {
		newItems = newItems.map((item) => {
			item.key = item.key.toString();
			item.status = !!(this.defaultSelected && this.defaultSelected.indexOf(item.key) > -1);
			return item;
		});
		const { items } = this.state;
		items[level] = newItems;
		this.setState({
			items,
			storedItems: items
		});
	}

	// set value
	setValue(value, isExecuteQuery = false, changeNestedValue = true) {
		value = value && value.length ? value : null;
		const obj = {
			key: this.props.componentId,
			value
		};
		const nestedObj = {
			key: `nestedSelectedValues-${this.props.componentId}`,
			value
		};
		helper.selectedSensor.set(nestedObj, changeNestedValue);

		const execQuery = () => {
			if (this.props.onValueChange) {
				this.props.onValueChange(obj.value);
			}
			const paramValue = value && value.length ? value.join("/") : null;
			if (this.props.URLParams) {
				helper.URLParams.update(this.props.componentId, paramValue, this.props.URLParams);
			}
			helper.selectedSensor.set(obj, isExecuteQuery);
		};

		if (this.props.beforeValueChange) {
			this.props.beforeValueChange(obj.value)
			.then(() => {
				execQuery();
			})
			.catch((e) => {
				console.warn(`${this.props.componentId} - beforeValueChange rejected the promise with`, e);
			});
		} else {
			execQuery();
		}
	}

	// filter
	filterBySearch(value) {
		if (value) {
			const items = this.state.storedItems[0].filter(item => item.key && item.key.toLowerCase().indexOf(value.toLowerCase()) > -1);
			this.setState({
				items: [items]
			});
		} else {
			this.setState({
				items: this.state.storedItems
			});
		}
	}

	onItemClick(selectedValues, level) {
		selectedValues = selectedValues.split("@rbc@");
		if (this.state.selectedValues && selectedValues[level] === this.state.selectedValues[level]) {
			selectedValues = this.state.selectedValues.filter((item, index) => index < level);
			const items = this.state.items;
			items[level + 1] = null;
			this.setState({
				items,
				selectedValues
			}, this.setValue.bind(this, selectedValues, true, false));
		} else {
			this.onItemSelect(selectedValues);
		}
	}

	onItemSelect(selectedValues) {
		let items = this.state.items;
		if (selectedValues === null) {
			items = [items[0]];
		} else {
			items[selectedValues.length] = null;
		}
		this.defaultSelected = selectedValues;
		this.setState({
			selectedValues,
			items
		}, this.setValue.bind(this, selectedValues, true));
	}

	renderChevron(level) {
		return level < this.props.dataField.length - 1 ? (<i className="fa fa-chevron-right" />) : "";
	}

	countRender(docCount) {
		let count;
		if (this.props.showCount) {
			count = (<span className="rbc-count"> {docCount}</span>);
		}
		return count;
	}

	renderItems(items, prefix = []) {
		const level = prefix.length;
		items = items.filter(item => item.key);
		return items.map((item, index) => {
			item.value = prefix.concat([item.key]);
			const cx = classNames({
				"rbc-item-active": (Array.isArray(this.state.selectedValues) && item.key === this.state.selectedValues[level]),
				"rbc-item-inactive": !(Array.isArray(this.state.selectedValues) && item.key === this.state.selectedValues[level])
			});
			if (Array.isArray(this.state.selectedValues) && this.state.selectedValues.length) {
				if (item.key === this.state.selectedValues[level] || this.state.selectedValues.length === level) {
					return (<li
						key={index}
						className="rbc-list-container col s12 col-xs-12"
					>
						<button className={`rbc-list-item ${cx}`} onClick={() => this.onItemClick(item.value.join("@rbc@"), level)}>
							<span className="rbc-label">{item.key} {this.countRender(item.doc_count)}</span>
							{this.renderChevron(level)}
						</button>
						{
							Array.isArray(this.state.selectedValues) && this.state.selectedValues[level] === item.key && this.state.items[level + 1] ? (
								<ul className="rbc-list-container col s12 col-xs-12">
									{this.renderItems(this.state.items[level + 1], item.value)}
								</ul>
							) : null
						}
					</li>);
				}
				return null;
			}
			return (
				<li
					key={index}
					className="rbc-list-container col s12 col-xs-12"
				>
					<button className={`rbc-list-item ${cx}`} onClick={() => this.onItemClick(item.value.join("@rbc@"), level)}>
						<span className="rbc-label">{item.key} {this.countRender(item.doc_count)}</span>
						{this.renderChevron(level)}
					</button>
					{
							Array.isArray(this.state.selectedValues) && this.state.selectedValues[level] === item.key && this.state.items[level + 1] ? (
								<ul className="rbc-list-container col s12 col-xs-12">
									{this.renderItems(this.state.items[level + 1], item.value)}
								</ul>
							) : null
						}
				</li>
			);
		});
	}

	renderList(key, level) {
		let list;
		if (key === this.state.selectedValues[level] && level === 0) {
			list = (
				<ul className="rbc-sublist-container rbc-indent col s12 col-xs-12">
					{this.renderItems(this.state.subItems, 1)}
				</ul>
			);
		}
		return list;
	}

	render() {
		let searchComponent = null,
			title = null;

		if (this.state.storedItems.length === 0 ||
			(this.state.storedItems.length && Array.isArray(this.state.storedItems[0]) && this.state.storedItems[0].length === 0)) {
			return null;
		}

		const listComponent = this.state.items[0] ? (
			<ul className="row rbc-list-container">
				{this.renderItems(this.state.items[0], [])}
			</ul>
		) : null;

		// set static search
		if (this.props.showSearch) {
			searchComponent = (<StaticSearch
				placeholder={this.props.placeholder}
				changeCallback={this.filterBySearch}
			/>);
		}

		if (this.props.title) {
			title = (<h4 className="rbc-title col s12 col-xs-12">{this.props.title}</h4>);
		}

		const cx = classNames({
			"rbc-search-active": this.props.showSearch,
			"rbc-search-inactive": !this.props.showSearch,
			"rbc-title-active": this.props.title,
			"rbc-title-inactive": !this.props.title,
			"rbc-placeholder-active": this.props.placeholder,
			"rbc-placeholder-inactive": !this.props.placeholder,
			"rbc-count-active": this.props.showCount,
			"rbc-count-inactive": !this.props.showCount,
			"rbc-initialloader-active": this.props.initialLoader,
			"rbc-initialloader-inactive": !this.props.initialLoader
		});

		return (
			<div className={`rbc rbc-nestedlist-container card thumbnail col s12 col-xs-12 ${this.props.className ? this.props.className : ""}`} style={this.props.style}>
				<div className={`rbc rbc-nestedlist col s12 col-xs-12 ${cx}`}>
					{title}
					{searchComponent}
					{listComponent}
				</div>
				{this.props.initialLoader && this.state.queryStart ? (<InitialLoader defaultText={this.props.initialLoader} />) : null}
			</div>
		);
	}
}

const NestedingValidation = (props, propName) => {
	let err = null;
	if (!props[propName]) {
		err = new Error("dataField is required prop!");
	}	else if (!Array.isArray(props[propName])) {
		err = new Error("dataField should be an array!");
	}	else if (props[propName].length === 0) {
		err = new Error("dataField should not have an empty array.");
	}	else if (props[propName].length > 9) {
		err = new Error("dataField can have maximum 10 fields.");
	}
	return err;
};

NestedList.propTypes = {
	componentId: PropTypes.string.isRequired,
	dataField: NestedingValidation,
	title: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.element
	]),
	showCount: PropTypes.bool,
	showSearch: PropTypes.bool,
	sortBy: PropTypes.oneOf(["count", "asc", "desc"]),
	size: helper.sizeValidation,
	defaultSelected: PropTypes.array,
	customQuery: PropTypes.func,
	placeholder: PropTypes.string,
	initialLoader: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.element
	]),
	react: PropTypes.object,
	beforeValueChange: PropTypes.func,
	onValueChange: PropTypes.func,
	style: PropTypes.object,
	URLParams: PropTypes.bool,
	showFilter: PropTypes.bool,
	filterLabel: PropTypes.string,
	className: PropTypes.string,
	onQueryChange: PropTypes.func
};

// Default props value
NestedList.defaultProps = {
	showCount: true,
	sortBy: "count",
	size: 100,
	showSearch: true,
	title: null,
	placeholder: "Search",
	style: {},
	URLParams: false,
	showFilter: true
};

// context type
NestedList.contextTypes = {
	appbaseRef: PropTypes.any.isRequired,
	type: PropTypes.any.isRequired,
	reactiveId: PropTypes.number
};

NestedList.types = {
	componentId: TYPES.STRING,
	dataField: TYPES.ARRAY,
	dataFieldType: TYPES.STRING,
	title: TYPES.STRING,
	placeholder: TYPES.STRING,
	react: TYPES.OBJECT,
	size: TYPES.NUMBER,
	sortBy: TYPES.STRING,
	showCount: TYPES.BOOLEAN,
	showSearch: TYPES.BOOLEAN,
	defaultSelected: TYPES.ARRAY,
	customQuery: TYPES.FUNCTION,
	initialLoader: TYPES.OBJECT,
	URLParams: TYPES.BOOLEAN,
	showFilter: TYPES.BOOLEAN,
	filterLabel: TYPES.STRING,
	className: TYPES.STRING,
	onQueryChange: TYPES.FUNCTION
};
