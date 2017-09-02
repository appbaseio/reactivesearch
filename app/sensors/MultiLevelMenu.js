/* eslint max-lines: 0 */
import React, { Component } from "react";
import classNames from "classnames";
import {
	TYPES,
	AppbaseChannelManager as manager,
	AppbaseSensorHelper as helper
} from "@appbaseio/reactivemaps";

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
			selectedValue: null
		};
		this.channelObj = [];
		this.channelId = [];
		this.channelListener = [];
		this.customQuery = this.customQuery.bind(this);
		this.firstLevelAggCustomQuery = this.firstLevelAggCustomQuery.bind(this);
		this.secondLevelAggCustomQuery = this.secondLevelAggCustomQuery.bind(this);
		this.type = "Term";
	}

	// Get the items from Appbase when component is mounted
	componentWillMount() {
		this.initialize();
	}

	componentWillUpdate() {
		setTimeout(() => {
			if (!_.isEqual(this.defaultData, this.props.data)) {
				this.defaultData = this.props.data;
				this.removeChannels();
				this.initialize();
			}
		}, 300);
	}

	// stop streaming request and remove listener when component will unmount
	componentWillUnmount() {
		this.removeChannels();
	}

	removeChannels() {
		this.channelId.forEach((channelId) => {
			manager.stopStream(channelId);
		});
		this.channelListener.forEach((channelListener) => {
			channelListener.remove();
		});
	}

	initialize() {
		this.setQueryInfo();
		this.createChannel();
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
		if (record) {
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
		const ob = {
			key: this.props.componentId,
			value: {
				queryType: this.type,
				inputData: this.props.dataField[0],
				customQuery: this.props.customQuery ? this.props.customQuery : this.customQuery,
				defaultSelected: this.urlParams !== null ? this.urlParams : this.props.defaultSelected
			}
		};
		helper.selectedSensor.setSensorInfo(ob);
		function setInternalQuery(key, level) {
			const obj = {
				key,
				value: {
					queryType: "term",
					inputData: this.props.dataField[level],
					customQuery() {
						return null;
					}
				}
			};
			helper.selectedSensor.setSensorInfo(obj);
			const obj1 = {
				key,
				value: ""
			};
			helper.selectedSensor.set(obj1);
		}
		setInternalQuery.call(this, "subCategory", 0);
		setInternalQuery.call(this, "lastCategory", 1);
	}

	getReact(level) {
		const react = {
			aggs: {
				key: this.props.dataField[level],
				size: 10
			},
			and: []
		};
		if (level === 1) {
			react.aggs.customQuery = this.firstLevelAggCustomQuery;
			react.and.push("subCategory");
		}		else if (level === 2) {
			react.aggs.customQuery = this.secondLevelAggCustomQuery;
			react.and.push("lastCategory");
		}
		return react;
	}

	// Create a channel which passes the react and receive results whenever react changes
	createChannel() {
		for (let level = 1; level < this.props.dataField.length; level += 1) {
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

	localChannel(level) {
		return this.channelObj[level].emitter.addListener(this.channelId[level], (res) => {
			if (res.appliedQuery) {
				if (level === 1) {
					this.setSensorData(res.data, level);
				}				else if (level === 2) {
					this.setData(res.data);
				}
			}
		});
	}

	setSensorData(data, level) {
		const obj = {
			levelName: "firstLevelMenu",
			key: "subCategory"
		};
		if (level === 1) {
			obj.levelName = "secondLevelMenu";
			obj.key = "lastCategory";
		}
		if (data && data.aggregations && data.aggregations) {
			if (level === 0) {
				this[obj.levelName] = data.aggregations.map(item => item.value);
			} else if (level === 1) {
				this[obj.levelName] = data.aggregations;
			}
		}

		const sensorObj = {
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
				const aggQuery = this.createAggquery(item, 0, [item]);
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
				this.secondLevelMenu[item][this.props.dataField[1]].buckets.forEach((nestedItem) => {
					const aggQuery = this.createAggquery(`${item}@rbc-level-rbc@${nestedItem.key}`, 1, [item, nestedItem.key]);
					query[aggQuery.key] = aggQuery.value;
				});
			});
		}
		return query;
	}

	createAggquery(label, level, items) {
		const obj = {
			key: label
		};
		obj.value = {
			filter: this.getAggFilterQuery(items),
			aggs: {
				[this.props.dataField[level + 1]]: {
					terms: {
						field: this.props.dataField[level + 1]
					}
				}
			}
		};
		return obj;
	}

	getAggFilterQuery(items) {
		const query = {
			bool: {
				must: []
			}
		};
		items.forEach((item, index) => {
			const obj = {
				term: {
					[this.props.dataField[index]]: item
				}
			};
			query.bool.must.push(obj);
		});
		return query;
	}

	setData(data) {
		const finalData = {};
		Object.keys(data.aggregations).forEach((level1) => {
			const menu = level1.split("@rbc-level-rbc@");
			const finalMenu = data.aggregations[level1][this.props.dataField[2]].buckets.map(item => item.key);
			if (Object.keys(finalData).indexOf(menu[0]) < 0) {
				finalData[menu[0]] = {
					[menu[1]]: finalMenu
				};
			} else {
				finalData[menu[0]][menu[1]] = finalMenu;
			}
		});
		this.setState({
			finalData
		});
	}

	addItemsToList(newItems, level) {
		newItems = newItems.map((item) => {
			item.key = item.key.toString();
			return item;
		});
		let itemVar;
		if (level === 0) {
			itemVar = "items";
		} else if (level === 1) {
			itemVar = "subItems";
		} else if (level === 2) {
			itemVar = "lastItems";
		}
		this.setState({
			[itemVar]: newItems,
			storedItems: newItems
		});
	}

	handleHover(selectedValue) {
		this.setState({
			selectedValue
		});
	}

	renderItems() {
		if (this.state.finalData) {
			return this.props.data.map((item) => {
				const cx = classNames({
					"rbc-item-active": (item.value === this.state.selectedValue),
					"rbc-item-inactive": !(item.value === this.state.selectedValue)
				});
				return (
					<li key={item.value}>
						<a className={`rbc-list-item ${cx}`} onMouseEnter={() => this.handleHover(item.value)}>
							<span className="rbc-label">{item.label}</span>
						</a>
					</li>
				);
			});
		}
	}

	selectItem(item, list) {
		const obj = {
			key: this.props.componentId,
			value: [this.state.selectedValue, list, item]
		};

		const execQuery = () => {
			if(this.props.onValueChange) {
				this.props.onValueChange(obj.value);
			}
			helper.selectedSensor.set(obj, true);
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

	filterBlackList(list) {
		return list.filter(item => this.notInBlackListed(item));
	}

	notInBlackListed(item) {
		return this.props.blacklist.indexOf(item) === -1;
	}

	renderList() {
		if (this.state.selectedValue) {
			const data = this.state.finalData[this.state.selectedValue];
			const markup = [];
			let count = 0;
			for (const list in data) {
				count += 1;
				if (this.notInBlackListed(list) && count <= this.props.maxCategories) {
					markup.push(
						(
							<div key={list} className="rbc-sublist-container">
								<h3 className="rbc-list-title">{list}</h3>
								<ul>
									{this.filterBlackList(data[list]).slice(0, this.props.maxItems).map(item => (
										<li key={`${list}-${item}`}><a onClick={() => this.selectItem(item, list)}>{item}</a></li>
									))}
								</ul>
							</div>
						)
					);
				}
			}

			return (<div className="rbc-list-container">{markup}</div>);
		}
	}

	render() {
		const listComponent = (
			<ul className="row rbc-list-container">
				{this.renderItems()}
			</ul>
		);

		return (
			<div className="rbc rbc-multilevelmenu-container card thumbnail col s12 col-xs-12" style={this.props.componentStyle} onMouseLeave={() => this.handleHover(null)}>
				<div className="rbc-multilevelmenu col s12 col-xs-12">
					{listComponent}
				</div>
				{this.renderList()}
			</div>
		);
	}
}

MultiLevelMenu.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	dataField: React.PropTypes.array.isRequired,
	data: React.PropTypes.arrayOf(React.PropTypes.shape({
		label: React.PropTypes.string.isRequired,
		value: React.PropTypes.string.isRequired
	})),
	maxCategories: React.PropTypes.number,
	maxItems: React.PropTypes.number,
	blacklist: React.PropTypes.arrayOf(React.PropTypes.string),
	customQuery: React.PropTypes.func,
	react: React.PropTypes.object,
	beforeValueChange: React.PropTypes.func,
	onValueChange: React.PropTypes.func,
	componentStyle: React.PropTypes.object
};

// Default props value
MultiLevelMenu.defaultProps = {
	blacklist: [],
	maxCategories: 10,
	maxItems: 4,
	componentStyle: {}
};

// context type
MultiLevelMenu.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};

MultiLevelMenu.types = {
	componentId: TYPES.STRING,
	dataField: TYPES.ARRAY,
	dataFieldType: TYPES.STRING,
	react: TYPES.OBJECT,
	maxCategories: TYPES.NUMBER,
	maxItems: TYPES.NUMBER,
	blacklist: TYPES.ARRAY,
	data: TYPES.OBJECT,
	customQuery: TYPES.FUNCTION
};
