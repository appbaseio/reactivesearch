/* eslint max-lines: 0 */
import React, { Component } from "react";
import classNames from "classnames";
import {
	InitialLoader,
	TYPES,
	AppbaseChannelManager as manager,
	AppbaseSensorHelper as helper
} from "@appbaseio/reactivemaps";

const _ = require("lodash");

export default class TagCloud extends Component {
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
			queryStart: false
		};
		this.sortObj = {
			aggSort: "asc"
		};
		this.highestCount = 0;
		this.previousSelectedSensor = {};
		this.channelId = null;
		this.channelListener = null;
		this.urlParams = helper.URLParams.get(this.props.componentId, this.props.multiSelect);
		this.type = this.props.multiSelect ? "Terms" : "Term";
		this.customQuery = this.customQuery.bind(this);
		this.defaultCustomQuery = this.defaultCustomQuery.bind(this);
	}

	// Get the items from Appbase when component is mounted
	componentWillMount() {
		this.previousQuery = null;	// initial value for onQueryChange
		this.size = this.props.size;
		this.setReact(this.props);
		this.setQueryInfo(this.props);
		this.createChannel();
		setTimeout(this.checkDefault.bind(this, this.props), 300);
		this.listenFilter();
	}

	componentWillReceiveProps(nextProps) {
		if (!_.isEqual(this.props.react, nextProps.react) || this.props.size !== nextProps.size) {
			this.setReact(nextProps);
			manager.update(this.channelId, this.react, nextProps.size, 0, false);
		}
		if (this.props.multiSelect !== nextProps.multiSelect) {
			this.type = nextProps.multiSelect ? "Terms" : "Term";
		}
		if (this.props.showFilter !== nextProps.showFilter || this.props.filterLabel !== nextProps.filterLabel) {
			this.setQueryInfo(nextProps);
			this.changeValue(this.defaultSelected, true);
		}
		if (this.props.defaultSelected !== nextProps.defaultSelected) {
			this.checkDefault(nextProps);
		}
	}

	componentWillUnmount() {
		this.removeChannel();
	}

	listenFilter() {
		this.filterListener = helper.sensorEmitter.addListener("clearFilter", (data) => {
			if(data === this.props.componentId) {
				this.changeValue(null);
			}
		});
	}

	checkDefault(props) {
		if(this.state.items.length) {
			const defaultValue = this.urlParams !== null ? this.urlParams : props.defaultSelected;
			this.changeValue(defaultValue);
		}
	}

	changeValue(defaultValue, executeQuery = false) {
		if (this.props.multiSelect && (!_.isEqual(this.defaultSelected, defaultValue) || executeQuery)) {
			this.defaultSelected = defaultValue;
			const items = this.state.items.map((item) => {
				item.status = (this.defaultSelected && this.defaultSelected.indexOf(item.key) > -1);
				item.status = this.defaultSelected === null ? false : item.status;
				return item;
			});

			this.selectedValue = this.defaultSelected === null ? null : items.filter(item => item.status).map(item => item.key);

			this.setState({ items });
			const obj = {
				key: this.props.componentId,
				value: this.selectedValue
			};

			const execQuery = () => {
				if(this.props.onValueChange) {
					this.props.onValueChange(obj.value);
				}
				helper.URLParams.update(this.props.componentId, obj.value, this.props.URLParams);
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
		} else if (!this.props.multiSelect && (this.defaultSelected !== defaultValue || executeQuery)) {
			this.defaultSelected = defaultValue;
			const items = this.state.items.map((item) => {
				if (this.defaultSelected && this.defaultSelected === item.key) {
					item.status = !item.status;
				} else {
					item.status = false;
				}
				return item;
			});

			this.selectedValue = this.selectedValue === this.defaultSelected ? "" : this.defaultSelected;

			this.setState({ items });
			const obj = {
				key: this.props.componentId,
				value: this.selectedValue
			};

			const execQuery = () => {
				if(this.props.onValueChange) {
					this.props.onValueChange(obj.value);
				}
				helper.URLParams.update(this.props.componentId, obj.value, this.props.URLParams);
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
	}

	customQuery(value) {
		const defaultQuery = this.props.customQuery ? this.props.customQuery : this.defaultCustomQuery;
		return defaultQuery(value);
	}

	defaultCustomQuery(value) {
		let query = null;
		if (value) {
			query = {
				[this.type]: {
					[this.props.dataField]: value
				}
			};
		}
		return query;
	}

	removeChannel() {
		if (this.channelId) {
			manager.stopStream(this.channelId);
		}
		if (this.channelListener) {
			this.channelListener.remove();
		}
		if (this.loadListener) {
			this.loadListener.remove();
		}
		if(this.filterListener) {
			this.filterListener.remove();
		}
	}

	setQueryInfo(props) {
		const getQuery = (value) => {
			const currentQuery = this.props.customQuery ? this.props.customQuery(value) : this.customQuery(value);
			if (this.props.onQueryChange && JSON.stringify(this.previousQuery) !== JSON.stringify(currentQuery)) {
				this.props.onQueryChange(this.previousQuery, currentQuery);
			}
			this.previousQuery = currentQuery;
			return currentQuery;
		};
		const obj = {
			key: props.componentId,
			value: {
				queryType: this.type,
				inputData: props.dataField,
				customQuery: getQuery,
				reactiveId: this.context.reactiveId,
				showFilter: props.showFilter,
				filterLabel: props.filterLabel ? props.filterLabel : props.componentId,
				component: "TagCloud",
				defaultSelected: this.urlParams !== null ? this.urlParams : props.defaultSelected
			}
		};
		helper.selectedSensor.setSensorInfo(obj);
	}

	includeAggQuery() {
		const obj = {
			key: `${this.props.componentId}-sort`,
			value: this.sortObj
		};
		helper.selectedSensor.setSortInfo(obj);
	}

	setReact(props) {
		const react = Object.assign({}, props.react);
		react.aggs = {
			key: props.dataField,
			sort: "asc",
			size: props.size,
			sortRef: `${props.componentId}-sort`
		};
		const reactAnd = [`${props.componentId}-sort`, "tagCloudChanges"];
		this.react = helper.setupReact(react, reactAnd);
	}

	createChannel() {
		this.includeAggQuery();
		// create a channel and listen the changes
		const channelObj = manager.create(this.context.appbaseRef, this.context.type, this.react);
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
				this.setData(rawData);
			}
		});
		this.listenLoadingChannel(channelObj);
	}

	listenLoadingChannel(channelObj) {
		this.loadListener = channelObj.emitter.addListener(`${channelObj.channelId}-query`, (res) => {
			if (res.appliedQuery) {
				this.setState({
					queryStart: res.queryState
				});
			}
		});
	}

	setData(data) {
		if (data.aggregations && data.aggregations[this.props.dataField] && data.aggregations[this.props.dataField].buckets) {
			this.addItemsToList(data.aggregations[this.props.dataField].buckets);
		}
	}

	addItemsToList(newItems) {
		newItems = newItems.map((item) => {
			this.highestCount = item.doc_count > this.highestCount ? item.doc_count : this.highestCount;
			item.key = item.key.toString();
			if (this.props.multiSelect) {
				item.status = !!((this.selectedValue && this.selectedValue.indexOf(item.key) > -1));
			} else {
				item.status = this.selectedValue === item.key;
			}
			return item;
		});
		this.setState({
			items: newItems,
			storedItems: newItems
		}, () => {
			this.checkDefault(this.props);
			// if (this.props.multiSelect && this.defaultSelected) {
			// 	this.defaultSelected.forEach((item) => {
			// 		this.setValue(item);
			// 	});
			// } else if (!this.props.multiSelect && this.defaultSelected) {
			// 	this.setValue(this.defaultSelected);
			// }
		});
	}

	setValue(value) {
		let items;
		if (this.props.multiSelect) {
			items = this.state.items.map((item) => {
				if (value && value === item.key) {
					item.status = !item.status;
				}
				return item;
			});

			this.selectedValue = items.filter(item => item.status).map(item => item.key);
		} else {
			items = this.state.items.map((item) => {
				if (value && value === item.key) {
					item.status = !item.status;
				} else {
					item.status = false;
				}
				return item;
			});

			this.selectedValue = this.selectedValue === value ? "" : value;
		}

		this.setState({ items });
		const obj = {
			key: this.props.componentId,
			value: this.selectedValue
		};

		const execQuery = () => {
			if(this.props.onValueChange) {
				this.props.onValueChange(obj.value);
			}
			this.defaultSelected = this.selectedValue;
			helper.URLParams.update(this.props.componentId, obj.value, this.props.URLParams);
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

	renderTags() {
		const min = 0.8,
			max = 3;

		return this.state.items.map((item) => {
			const size = ((item.doc_count / this.highestCount) * (max - min)) + min;
			const cx = item.status ? "active" : "";

			return (
				<a
					className={`rbc-list-item ${cx}`}
					onClick={() => this.setValue(item.key)}
					key={item.key}
					style={{ fontSize: `${size}em` }}
				>
					{item.key} {this.props.showCount ? (<span className="rbc-count">{item.doc_count}</span>) : ""}
				</a>
			);
		});
	}

	render() {
		let title = null;

		if (this.state.items.length === 0) {
			return null;
		}

		if (this.props.title) {
			title = (<h4 className="rbc-title col s12 col-xs-12">{this.props.title}</h4>);
		}

		const cx = classNames({
			"rbc-title-active": this.props.title,
			"rbc-title-inactive": !this.props.title,
			"rbc-count-active": this.props.showCount,
			"rbc-count-inactive": !this.props.showCount,
			"rbc-multiSelect-active": this.props.multiSelect,
			"rbc-multiSelect-inactive": !this.props.multiSelect,
			"rbc-initialloader-active": this.props.initialLoader,
			"rbc-initialloader-inactive": !this.props.initialLoader
		}, this.props.className);

		return (
			<div className={`rbc rbc-tagcloud col s12 col-xs-12 card thumbnail ${cx}`} style={this.props.style}>
				{title}
				<div className="rbc-list-container">
					{this.renderTags()}
				</div>
				{this.props.initialLoader && this.state.queryStart ? (<InitialLoader defaultText={this.props.initialLoader} />) : null}
			</div>
		);
	}
}

TagCloud.propTypes = {
	dataField: React.PropTypes.string.isRequired,
	componentId: React.PropTypes.string.isRequired,
	title: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.element
	]),
	size: React.PropTypes.number,
	showCount: React.PropTypes.bool,
	multiSelect: React.PropTypes.bool,
	customQuery: React.PropTypes.func,
	initialLoader: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.element
	]),
	defaultSelected: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.number,
		React.PropTypes.array
	]),
	react: React.PropTypes.object,
	beforeValueChange: React.PropTypes.func,
	onValueChange: React.PropTypes.func,
	style: React.PropTypes.object,
	URLParams: React.PropTypes.bool,
	showFilter: React.PropTypes.bool,
	filterLabel: React.PropTypes.string,
	className: React.PropTypes.string,
	onQueryChange: React.PropTypes.func
};

TagCloud.defaultProps = {
	showCount: true,
	multiSelect: false,
	size: 100,
	title: null,
	style: {},
	URLParams: false,
	showFilter: true
};

TagCloud.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired,
	reactiveId: React.PropTypes.number
};

TagCloud.types = {
	componentId: TYPES.STRING,
	dataField: TYPES.STRING,
	dataFieldType: TYPES.KEYWORD,
	title: TYPES.STRING,
	size: TYPES.NUMBER,
	showCount: TYPES.BOOLEAN,
	multiSelect: TYPES.BOOLEAN,
	customQuery: TYPES.FUNCTION,
	initialLoader: TYPES.STRING,
	defaultSelected: TYPES.STRING,
	react: TYPES.OBJECT,
	URLParams: TYPES.BOOLEAN,
	showFilter: TYPES.BOOLEAN,
	filterLabel: TYPES.STRING,
	className: TYPES.STRING,
	onQueryChange: TYPES.FUNCTION
};
