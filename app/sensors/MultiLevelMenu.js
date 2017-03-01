/* eslint max-lines: 0 */
import React, { Component } from "react";
import classNames from "classnames";
import {
	InitialLoader,
	TYPES,
	AppbaseChannelManager as manager,
	AppbaseSensorHelper as helper
} from "@appbaseio/reactivebase";
import StaticSearch from "../addons/StaticSearch";

const _ = require("lodash");

export default class MultiLevelMenu extends Component {
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
			"nestedChildaggs",
			"nestedGrandChildaggs"
		];
		this.sortObj = {
			aggSort: this.props.sortBy
		};
		this.channelId = null;
		this.channelListener = null;
		this.defaultSelected = this.props.defaultSelected;
		this.filterBySearch = this.filterBySearch.bind(this);
		this.onItemSelect = this.onItemSelect.bind(this);
		this.reset = this.reset.bind(this);
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
		selectedValues[level] = key;
		stateItems = {
			selectedValues
		};
		const obj = {
			key: "subCategory",
			value: key
		};
		helper.selectedSensor.set(obj, true);
		this.setValue(selectedValues, true);
		this.setState(stateItems);
	}

	reset() {
		this.setState({
			selectedValues: []
		});
	}

	renderItems(items, level) {
		const arr = items.map(item => item.key);
		const filteredItems = this.props.data ?
			this.props.data.filter(item => arr.indexOf(item.value) > -1) :
			items.map(item => {
				return {
					label: item.key,
					value: item.key
				}
			});

		return filteredItems.map((item) => {
			const cx = classNames({
				"rbc-item-active": (item.value === this.state.selectedValues[level]),
				"rbc-item-inactive": !(item.value === this.state.selectedValues[level])
			});
			return (
				<li key={item.value}>
					<a className={`rbc-list-item ${cx}`} onMouseEnter={() => this.onItemSelect(item.value, level)}>
						<span className="rbc-label">{item.label}</span>
					</a>
				</li>
			);
		});
	}

	renderList() {
		if (this.state.selectedValues.length) {
			const list = this.state.subItems.map(item => (
				<li key={item.key}>{item.key}</li>
			));

			return (
				<ul className="rbc-sublist-container col s12 col-xs-12">
					{list}
				</ul>
			);
		}
		return "";
	}

	render() {
		const listComponent = (
			<ul className="row rbc-list-container">
				{this.renderItems(this.state.items, 0)}
			</ul>
		);

		const cx = classNames({
			"rbc-initialloader-active": this.props.initialLoader,
			"rbc-initialloader-inactive": !this.props.initialLoader
		});

		return (
			<div className="rbc rbc-multilevelmenu-container card thumbnail col s12 col-xs-12" onMouseLeave={this.reset}>
				<div className={`rbc rbc-multilevelmenu col s12 col-xs-12 ${cx}`}>
					{listComponent}
				</div>
				{this.renderList()}
				{this.props.initialLoader && this.state.queryStart ? (<InitialLoader defaultText={this.props.initialLoader} />) : null}
			</div>
		);
	}
}

MultiLevelMenu.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	appbaseField: React.PropTypes.array.isRequired,
	data: React.PropTypes.arrayOf(React.PropTypes.shape({
		label: React.PropTypes.string.isRequired,
		value: React.PropTypes.string.isRequired,
	})),
	sortBy: React.PropTypes.oneOf(["count", "asc", "desc"]),
	size: helper.sizeValidation,
	defaultSelected: React.PropTypes.array,
	customQuery: React.PropTypes.func,
	initialLoader: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.element
	]),
	react: React.PropTypes.object
};

// Default props value
MultiLevelMenu.defaultProps = {
	sortBy: "count",
	size: 100
};

// context type
MultiLevelMenu.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};

MultiLevelMenu.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.ARRAY,
	react: TYPES.OBJECT,
	size: TYPES.NUMBER,
	sortBy: TYPES.STRING,
	data: TYPES.OBJECT,
	customQuery: TYPES.FUNCTION,
	initialLoader: TYPES.OBJECT
};
