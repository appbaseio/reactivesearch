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
		this.channelObj = [];
		this.channelId = [];
		this.channelListener = [];
		this.defaultSelected = this.props.defaultSelected;
		this.customQuery = this.customQuery.bind(this);
		this.firstLevelAggCustomQuery = this.firstLevelAggCustomQuery.bind(this);
		this.secondLevelAggCustomQuery = this.secondLevelAggCustomQuery.bind(this);
		this.type = "Term";
	}

	// Get the items from Appbase when component is mounted
	componentWillMount() {
		this.setQueryInfo();
		this.createChannel();
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
		}, 300);
	}

	// stop streaming request and remove listener when component will unmount
	componentWillUnmount() {
		this.channelId.forEach((channelId) => {
			manager.stopStream(channelId);
		});
		this.channelListener.forEach((channelListener) => {
			channelListener.remove();
		});
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
		function setInternalQuery(key, level) {
			const obj = {
				key: key,
				value: {
					queryType: "term",
					inputData: this.props.appbaseField[level],
					customQuery: function() {
						return null;
					}
				}
			};
			helper.selectedSensor.setSensorInfo(obj);
		}
		setInternalQuery.call(this, "subCategory", 0);
		setInternalQuery.call(this, "lastCategory", 1);
	}

	getReact(level) {
		let react = {
			aggs: {
				key: this.props.appbaseField[level],
				size: this.props.size
			},
			and: []
		};
		if(level === 1) {
			react.aggs.customQuery = this.firstLevelAggCustomQuery
			react.and.push('subCategory');
		}
		else if(level === 2) {
			react.aggs.customQuery = this.secondLevelAggCustomQuery
			react.and.push('lastCategory');
		}
		return react;
	}

	// Create a channel which passes the react and receive results whenever react changes
	createChannel() {
		let level = 0;
		for(let level = 1; level < this.props.appbaseField.length; level++) {
			const react = this.getReact(level);
			// create a channel and listen the changes
			this.channelObj[level] = manager.create(this.context.appbaseRef, this.context.type, react);
			this.channelId[level] = this.channelObj[level].channelId;
			this.channelListener[level] = this.localChannel(level, react);
			// this.listenLoadingChannel(channelObj, "loadListenerParent");
		}
		this.setInitialData();
	}

	setInitialData() {
		setTimeout(() => {
			const data = {
				aggregations: this.props.data
			};
			this.setSensorData(data, 0);
		}, 100);
	}

	localChannel(level, react) {
		return this.channelObj[level].emitter.addListener(this.channelId[level], (res) => {
			if(res.appliedQuery) {
				if(level === 1) {
					this.setSensorData(res.data, level);
				}
				else if(level === 2) {
					this.setData(res.data);
				}
			}
		});
	}

	setSensorData(data, level) {
		let obj = {
			levelName: "firstLevelMenu",
			key: "subCategory"
		};
		if(level === 1) {
			obj.levelName = "secondLevelMenu";
			obj.key = "lastCategory";
		}
		if (data && data.aggregations && data.aggregations) {
			if(level === 0) {
				this[obj.levelName] = data.aggregations.map(item => item.value);
			} else if(level === 1) {
				this[obj.levelName] = data.aggregations;
			}
		}

		let sensorObj = {
			key: obj.key,
			value: this[obj.levelName]
		};
		helper.selectedSensor.set(sensorObj, true);
	}

	firstLevelAggCustomQuery() {
		let query = null;
		if (this.firstLevelMenu) {
			query = {};
			this.firstLevelMenu.forEach((item) => {
				let aggQuery = this.createAggquery(item, 0, [item]);
				query[aggQuery.key] = aggQuery.value;
			});
		}
		return query;
	}

	secondLevelAggCustomQuery() {
		let query = null;
		if (this.secondLevelMenu) {
			query = {};
			Object.keys(this.secondLevelMenu).forEach((item) => {
				let combineItems = [item];
				this.secondLevelMenu[item][this.props.appbaseField[1]].buckets.forEach((nestedItem) => {
					let aggQuery = this.createAggquery(item+'@rbc-level-rbc@'+nestedItem.key, 1, [item, nestedItem.key]);
					query[aggQuery.key] = aggQuery.value;
				});
			});
		}
		return query;
	}

	createAggquery(label, level, items) {
		let obj = {
			key: label
		};
		obj.value = {
			"filter": this.getAggFilterQuery(items),
			"aggs": {
				[this.props.appbaseField[level + 1]]: {
					"terms": {
						"field": this.props.appbaseField[level + 1]
					}
				}
			}
		}
		return obj;
	}

	getAggFilterQuery(items) {
		let query = {
			bool: {
				must: []
			}
		};
		items.forEach((item, index) => {
			let obj = {
				"term": {
					[this.props.appbaseField[index]]: item
				}
			};
			query.bool.must.push(obj);
		});
		return query;
	}

	setData(data) {
		const finalData = {};
		Object.keys(data.aggregations).forEach((level1) => {
			let menu = level1.split('@rbc-level-rbc@');
			let finalMenu = data.aggregations[level1][this.props.appbaseField[2]].buckets.map((item) => item.key);
			if(Object.keys(finalData).indexOf(menu[0]) < 0) {
				finalData[menu[0]] = {
					[menu[1]]: finalMenu
				}
			} else {
				finalData[menu[0]][menu[1]] = finalMenu
			}
		});
		this.setState({
			finalData: finalData
		});
	}

	addItemsToList(newItems, level) {
		newItems = newItems.map((item) => {
			item.key = item.key.toString();
			item.status = !!(this.defaultSelected && this.defaultSelected.indexOf(item.key) > -1);
			return item;
		});
		let itemVar;
		if (level === 0) {
			itemVar = "items"
		} else if (level === 1) {
			itemVar = "subItems"
		} else if (level === 2) {
			itemVar = "lastItems"
		}
		this.setState({
			[itemVar]: newItems,
			storedItems: newItems
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
				<li key={item.key}>
					<a onMouseEnter={() => this.onItemSelect(item.key, 1)}>
						{item.key}
					</a>
				</li>
			));

			return (
				<ul className="rbc-sublist-container col s12 col-xs-12">
					{list}
				</ul>
			);
		}
		return "";
	}

	renderLastList() {
		if (this.state.selectedValues.length && this.state.lastItems && this.state.lastItems.length) {
			const list = this.state.lastItems.map(item => (
				<li key={item.key}>
					<a>
						{item.key}
					</a>
				</li>
			));

			return (
				<ul className="rbc-lastlist-container col s12 col-xs-12">
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
				{this.renderLastList()}
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
