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
			"nestedParentaggs",
			"nestedChildaggs"
		];
		this.sortObj = {
			aggSort: this.props.sortBy
		};
		this.channelId = null;
		this.channelListener = null;
		this.defaultSelected = props.defaultSelected;
		this.filterBySearch = this.filterBySearch.bind(this);
		this.onItemSelect = this.onItemSelect.bind(this);
		this.customQuery = this.customQuery.bind(this);
		this.handleSelect = this.handleSelect.bind(this);
		this.type = "Term";
	}

	// Get the items from Appbase when component is mounted
	componentWillMount() {
		this.setQueryInfo();
		this.createChannel();
		this.createSubChannel();
	}

	componentDidMount() {
		if (this.props.defaultSelected) {
			this.defaultSelected = this.props.defaultSelected;
			setTimeout(this.handleSelect.bind(this), 100);
		}
	}

	componentWillUpdate() {
		setTimeout(() => {
			if (!_.isEqual(this.defaultSelected, this.props.defaultSelected)) {
				this.defaultSelected = this.props.defaultSelected;
				let items = this.state.items;
				items = items.map((item) => {
					item.key = item.key.toString();
					item.status = !!(this.defaultSelected.length && this.defaultSelected.indexOf(item.key) > -1);
					return item;
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
		}, 300);
	}

	// stop streaming request and remove listener when component will unmount
	componentWillUnmount() {
		if (this.channelId) {
			manager.stopStream(this.channelId);
		}
		if (this.subChannelId) {
			manager.stopStream(this.subChannelId);
		}
		if (this.channelListener) {
			this.channelListener.remove();
		}
		if (this.subChannelListener) {
			this.subChannelListener.remove();
		}
		if (this.loadListenerParent) {
			this.loadListenerParent.remove();
		}
		if (this.loadListenerChild) {
			this.loadListenerChild.remove();
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
		if (record) {
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

	// Create a channel which passes the react and receive results whenever react changes
	createChannel() {
		// Set the react - add self aggs query as well with react
		const react = this.props.react ? this.props.react : {};
		react.aggs = {
			key: this.props.appbaseField[0],
			sort: this.props.sortBy,
			size: this.props.size,
			sortRef: this.nested[0]
		};
		if (react && react.and && typeof react.and === "string") {
			react.and = [react.and];
		} else {
			react.and = react.and ? react.and : [];
		}
		react.and.push(this.nested[0]);
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
			if (res.appliedQuery) {
				const data = res.data;
				let rawData;
				if (res.mode === "streaming") {
					rawData = this.state.rawData;
					rawData.hits.hits.push(res.data);
				} else if (res.mode === "historic") {
					rawData = data;
				}
				this.setState({
					queryStart: false,
					rawData
				});
				this.setData(rawData, 0);
			}
		});
		this.listenLoadingChannel(channelObj, "loadListenerParent");
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

	// Create a channel for sub category
	createSubChannel() {
		this.setSubCategory();
		const react = {
			aggs: {
				key: this.props.appbaseField[1],
				sort: this.props.sortBy,
				size: this.props.size,
				sortRef: this.nested[1]
			},
			and: ["subCategory", this.nested[1]]
		};
		// create a channel and listen the changes
		const subChannelObj = manager.create(this.context.appbaseRef, this.context.type, react);
		this.subChannelId = subChannelObj.channelId;
		this.subChannelListener = subChannelObj.emitter.addListener(this.subChannelId, (res) => {
			if (res.error) {
				this.setState({
					queryStart: false
				});
			}
			if (res.appliedQuery) {
				const data = res.data;
				let rawData;
				if (res.mode === "streaming") {
					rawData = this.state.subRawData;
					rawData.hits.hits.push(res.data);
				} else if (res.mode === "historic") {
					rawData = data;
				}
				if (this.state.selectedValues.length) {
					this.setState({
						queryStart: false,
						subRawData: rawData
					});
					this.setData(rawData, 1);
				}
			}
		});
		this.listenLoadingChannel(subChannelObj, "loadListenerChild");
		const obj = {
			key: "subCategory",
			value: ""
		};
		helper.selectedSensor.set(obj, true);
	}

	// set the query type and input data
	setSubCategory() {
		const obj = {
			key: "subCategory",
			value: {
				queryType: "term",
				inputData: this.props.appbaseField[0]
			}
		};

		helper.selectedSensor.setSensorInfo(obj);
	}

	setData(data, level) {
		if (data && data.aggregations && data.aggregations[this.props.appbaseField[level]] && data.aggregations[this.props.appbaseField[level]].buckets) {
			this.addItemsToList(data.aggregations[this.props.appbaseField[level]].buckets, level);
		}
	}

	addItemsToList(newItems, level) {
		newItems = newItems.map((item) => {
			item.key = item.key.toString();
			item.status = !!(this.defaultSelected && this.defaultSelected.indexOf(item.key) > -1);
			return item;
		});
		const itemVar = level === 0 ? "items" : "subItems";
		this.setState({
			[itemVar]: newItems,
			storedItems: newItems
		});
	}

	// set value
	setValue(value, isExecuteQuery = false) {
		const obj = {
			key: this.props.componentId,
			value
		};
		helper.selectedSensor.set(obj, isExecuteQuery);
	}

	handleSelect() {
		if (this.props.defaultSelected) {
			this.props.defaultSelected.forEach((value, index) => {
				this.onItemSelect(value, index);
			});
		}
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

	onItemSelect(key, level) {
		const selectedValues = this.state.selectedValues;
		let stateItems = {};
		if (selectedValues[level] === key) {
			delete selectedValues[level];
			stateItems = {
				selectedValues
			};
		} else {
			selectedValues[level] = key;
			stateItems = {
				selectedValues
			};
			if (level === 0) {
				selectedValues.splice(1, 1);
				if (key !== selectedValues[0]) {
					stateItems.subItems = [];
				}
				const obj = {
					key: "subCategory",
					value: key
				};
				helper.selectedSensor.set(obj, true);
			}
		}
		this.setValue(selectedValues, true);
		this.setState(stateItems);
	}

	renderChevron(level) {
		return level === 0 ? (<i className="fa fa-chevron-right" />) : "";
	}

	countRender(docCount) {
		let count;
		if (this.props.showCount) {
			count = (<span className="rbc-count"> {docCount}</span>);
		}
		return count;
	}

	renderItems(items, level) {
		return items.map((item) => {
			const cx = classNames({
				"rbc-item-active": (item.key === this.state.selectedValues[level]),
				"rbc-item-inactive": !(item.key === this.state.selectedValues[level])
			});
			return (
				<li
					key={item.key}
					className="rbc-list-container col s12 col-xs-12"
				>
					<button className={`rbc-list-item ${cx}`} onClick={() => this.onItemSelect(item.key, level)}>
						<span className="rbc-label">{item.key} {this.countRender(item.doc_count)}</span>
						{this.renderChevron(level)}
					</button>
					{this.renderList(item.key, level)}
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

		const listComponent = (
			<ul className="row rbc-list-container">
				{this.renderItems(this.state.items, 0)}
			</ul>
		);

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
			<div className="rbc rbc-nestedlist-container card thumbnail col s12 col-xs-12">
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

NestedList.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	appbaseField: React.PropTypes.array.isRequired,
	title: React.PropTypes.string,
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
	react: React.PropTypes.object
};

// Default props value
NestedList.defaultProps = {
	showCount: true,
	sortBy: "count",
	size: 100,
	showSearch: false,
	title: null,
	placeholder: "Search"
};

// context type
NestedList.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};

NestedList.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.ARRAY,
	title: TYPES.STRING,
	react: TYPES.OBJECT,
	size: TYPES.NUMBER,
	sortBy: TYPES.STRING,
	showCount: TYPES.BOOLEAN,
	showSearch: TYPES.BOOLEAN,
	defaultSelected: TYPES.ARRAY,
	customQuery: TYPES.FUNCTION,
	initialLoader: TYPES.OBJECT
};

