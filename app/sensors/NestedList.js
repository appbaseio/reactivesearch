/* eslint max-lines: 0 */
import React, { Component } from "react";
import classNames from "classnames";
import {
	InitialLoader,
	TYPES,
	AppbaseChannelManager as manager,
	AppbaseSensorHelper as helper
} from "@appbaseio/reactivemaps";
import StaticSearch from "../addons/StaticSearch";

const _ = require("lodash");
const $ = require("jquery");

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
		this.urlParams = helper.URLParams.get(this.props.componentId);
		this.urlParams = this.urlParams ? this.urlParams.split("@rbc@") : null;
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
		this.setQueryInfo();
		this.createChannel();
	}

	componentDidMount() {
		setTimeout(this.checkDefault.bind(this, this.props), 100);
		this.listenFilter();
	}

	componentWillReceiveProps(nextProps) {
		this.checkDefault(nextProps);
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
		if(this.filterListener) {
			this.filterListener.remove();
		}
	}

	listenFilter() {
		this.filterListener = helper.sensorEmitter.addListener("clearFilter", (data) => {
			if(data === this.props.componentId) {
				this.changeValue(null);
			}
		});
	}

	checkDefault(props) {
		this.urlParams = helper.URLParams.get(props.componentId);
		this.urlParams = this.urlParams ? this.urlParams.split("@rbc@") : null;
		const defaultValue = this.urlParams !== null ? this.urlParams : props.defaultSelected;
		this.changeValue(defaultValue);
	}

	changeValue(defaultValue) {
		if (!_.isEqual(this.defaultSelected, defaultValue)) {
			this.defaultSelected = defaultValue;
			let items = this.state.items;
			items = items.map((subitems) => {
				subitems = _.isArray(subitems) ? subitems.map((item) => {
					item.key = item && item.key ? item.key.toString() : null;
					item.status = !!(this.defaultSelected && this.defaultSelected.length && this.defaultSelected.indexOf(item.key) > -1);
					return item;
				}) : null;
				return subitems;
			})
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

	handleSelect() {
		if (this.defaultSelected) {
			this.defaultSelected.forEach((value, index) => {
				const customValue = this.defaultSelected.filter((item, subindex) => subindex <= index );
				this.onItemSelect(customValue);
			});
		} else if(this.defaultSelected === null) {
			this.onItemSelect(null);
		}
	}

	// build query for this sensor only
	customQuery(record) {
		let query = null;
		function generateRangeQuery(appbaseField) {
			return record.map((singleRecord, index) => ({
				term: {
					[appbaseField[index]]: singleRecord
				}
			}));
		}
		if (record && record[0] !== null) {
			query = {
				bool: {
					must: generateRangeQuery(this.props.appbaseField)
				}
			};
		}
		return query;
	}

	// set the query type and input data
	setQueryInfo() {
		const obj = {
			key: this.props.componentId,
			value: {
				queryType: this.type,
				inputData: this.props.appbaseField[0],
				customQuery: this.props.customQuery ? this.props.customQuery : this.customQuery
			}
		};
		helper.selectedSensor.setSensorInfo(obj);
		const nestedObj = {
			key: "nestedSelectedValues",
			value: {
				queryType: this.type,
				inputData: this.props.appbaseField[0],
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
		const level = _.isArray(this.state.selectedValues) && this.state.selectedValues.length ? this.state.selectedValues.length : 0;
		const field = this.props.appbaseField[level];
		const orderType = this.props.sortBy === "count" ? "_count" : "_term";
		const sortBy = this.props.sortBy === "count" ? "desc" : this.props.sortBy;
		const createTermQuery = (index) => ({
			term: {
				[this.props.appbaseField[index]]: this.state.selectedValues[index]
			}
		});
		const createFilterQuery = (level) => {
			const filterMust = [];
			if(level > 0) {
				for(let i = 0; i <= level-1; i++) {
					filterMust.push(createTermQuery(i));
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
							field: field
							,
							size: this.props.size,
							order: {
								[orderType]: sortBy
							}
						}
					}
				}
			}
		});
		if(_.isArray(this.state.selectedValues) && this.state.selectedValues.length < this.props.appbaseField.length) {
			query = init(field, level);
		}
		return query;
	}

	// Create a channel which passes the react and receive results whenever react changes
	createChannel() {
		// Set the react - add self aggs query as well with react
		const react = this.props.react ? JSON.parse(JSON.stringify(this.props.react)) : {};
		react.aggs = {
			key: this.props.appbaseField[0],
			sort: this.props.sortBy,
			size: this.props.size,
			customQuery: this.nestedAggQuery
		};
		if (react && react.and && typeof react.and === "string") {
			react.and = [react.and];
		} else {
			react.and = react.and ? react.and : [];
		}
		react.and.push(this.nested[0], "nestedSelectedValues");
		this.includeAggQuery();

		// create a channel and listen the changes
		const channelObj = manager.create(this.context.appbaseRef, this.context.type, react);
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
			const appliedField = ((Object.keys(appliedQuery.body.aggs)[0]).split("-"))[0];
			level = this.props.appbaseField.indexOf(appliedField);
			level = level > -1 ? level : 0;
		} catch(e) {
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
		const fieldLevel = `${this.props.appbaseField[level]}-${level}`;
		if (data && data.aggregations && data.aggregations[fieldLevel] && data.aggregations[fieldLevel][this.props.appbaseField[level]] && data.aggregations[fieldLevel][this.props.appbaseField[level]].buckets) {
			this.addItemsToList(data.aggregations[fieldLevel][this.props.appbaseField[level]].buckets, level);
		}
	}

	addItemsToList(newItems, level) {
		newItems = newItems.map((item) => {
			item.key = item.key.toString();
			item.status = !!(this.defaultSelected && this.defaultSelected.indexOf(item.key) > -1);
			return item;
		});
		// const itemVar = level === 0 ? "items" : "subItems";
		// this.setState({
		// 	[itemVar]: newItems,
		// 	storedItems: newItems
		// });
		const items = this.state.items;
		items[level] = newItems;
		this.setState({
			items
		});
	}

	// set value
	setValue(value, isExecuteQuery = false, changeNestedValue=true) {
		value = value && value.length ? value : null;
		const obj = {
			key: this.props.componentId,
			value
		};
		// if(changeNestedValue) {
			const nestedObj = {
				key: "nestedSelectedValues",
				value
			};
			helper.selectedSensor.set(nestedObj, changeNestedValue);
		// }
		if(this.props.onValueChange) {
			this.props.onValueChange(obj.value);
		}
		helper.URLParams.update(this.props.componentId, value, this.props.URLParams);
		helper.selectedSensor.set(obj, isExecuteQuery);
	}

	// filter
	filterBySearch(value) {
		if (value) {
			const items = this.state.storedItems.filter(item => item.key && item.key.toLowerCase().indexOf(value.toLowerCase()) > -1);
			this.setState({
				items
			});
		} else {
			this.setState({
				items: this.state.storedItems
			});
		}
	}

	onItemClick(event) {
		let selectedValues = ($(event.currentTarget).data("value")).split("@rbc@");
		const level = Number($(event.currentTarget).data("level"));
		event.stopPropagation();
		if(selectedValues[level] === this.state.selectedValues[level]) {
			selectedValues = this.state.selectedValues.filter((item, index) => index < level);
			const items = this.state.items;
			items[level+1] = null;
			this.setState({
				items,
				selectedValues: selectedValues
			}, this.setValue(selectedValues, true, false));
		} else {
			this.onItemSelect(selectedValues);
		}
	}

	onItemSelect(selectedValues) {
		let items = this.state.items;
		if(selectedValues === null) {
			items = [items[0]];
		} else {
			items[selectedValues.length] = null;
		}
		this.setState({
			selectedValues,
			items: items
		}, this.setValue.bind(this, selectedValues, true));
	}

	renderChevron(level) {
		return level < this.props.appbaseField.length-1 ? (<i className="fa fa-chevron-right" />) : "";
	}

	countRender(docCount) {
		let count;
		if (this.props.showCount) {
			count = (<span className="rbc-count"> {docCount}</span>);
		}
		return count;
	}

	renderItems(items, prefix =[]) {
		const level = prefix.length;
		items = items.filter(item => item.key);
		return items.map((item, index) => {
			item.value = prefix.concat([item.key]);
			const cx = classNames({
				"rbc-item-active": (_.isArray(this.state.selectedValues) && item.key === this.state.selectedValues[level]),
				"rbc-item-inactive": !(_.isArray(this.state.selectedValues) && item.key === this.state.selectedValues[level])
			});
			return (
				<li
					key={index}
					className="rbc-list-container col s12 col-xs-12"
				>
					<button className={`rbc-list-item ${cx}`} data-value={item.value.join("@rbc@")} data-level={level} onClick={this.onItemClick}>
						<span className="rbc-label">{item.key} {this.countRender(item.doc_count)}</span>
						{this.renderChevron(level)}
					</button>
					{
						_.isArray(this.state.selectedValues) && this.state.selectedValues[level] === item.key && this.state.items[level+1] ? (
							<ul className="rbc-sublist-container rbc-indent col s12 col-xs-12">
								{this.renderItems(this.state.items[level+1], item.value)}
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

		if (this.state.items.length === 0 ||
			(this.state.items.length && Array.isArray(this.state.items[0]) && this.state.items[0].length === 0)) {
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
			<div className="rbc rbc-nestedlist-container card thumbnail col s12 col-xs-12" style={this.props.componentStyle}>
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
	var err = null;
	if (!props[propName]) {
		err = new Error("appbaseField is required prop!");
	}
	else if (!_.isArray(props[propName])) {
		err = new Error("appbaseField should be an array!");
	}
	else if (props[propName].length === 0) {
		err = new Error("appbaseField should not have an empty array.");
	}
	else if (props[propName].length > 9) {
		err = new Error("appbaseField can have maximum 10 fields.");
	}
	return err;
}

NestedList.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	appbaseField: NestedingValidation,
	title: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.element
	]),
	showCount: React.PropTypes.bool,
	showSearch: React.PropTypes.bool,
	sortBy: React.PropTypes.oneOf(["count", "asc", "desc"]),
	size: helper.sizeValidation,
	defaultSelected: React.PropTypes.array,
	customQuery: React.PropTypes.func,
	placeholder: React.PropTypes.string,
	initialLoader: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.element
	]),
	react: React.PropTypes.object,
	onValueChange: React.PropTypes.func,
	componentStyle: React.PropTypes.object,
	URLParams: React.PropTypes.bool,
	allowFilter: React.PropTypes.bool
};

// Default props value
NestedList.defaultProps = {
	showCount: true,
	sortBy: "count",
	size: 100,
	showSearch: false,
	title: null,
	placeholder: "Search",
	componentStyle: {},
	URLParams: false,
	allowFilter: true
};

// context type
NestedList.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};

NestedList.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.ARRAY,
	appbaseFieldType: TYPES.STRING,
	title: TYPES.STRING,
	react: TYPES.OBJECT,
	size: TYPES.NUMBER,
	sortBy: TYPES.STRING,
	showCount: TYPES.BOOLEAN,
	showSearch: TYPES.BOOLEAN,
	defaultSelected: TYPES.ARRAY,
	customQuery: TYPES.FUNCTION,
	initialLoader: TYPES.OBJECT,
	URLParams: TYPES.BOOLEAN,
	allowFilter: TYPES.BOOLEAN
};
