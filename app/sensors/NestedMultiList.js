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

export default class NestedMultiList extends Component {
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
			selectedValues: {}
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
		this.urlParams = this.urlParams ? this.urlParams.split("/") : null;
		this.filterBySearch = this.filterBySearch.bind(this);
		this.onItemClick = this.onItemClick.bind(this);
		this.customQuery = this.customQuery.bind(this);
		this.handleSelect = this.handleSelect.bind(this);
		this.nestedAggQuery = this.nestedAggQuery.bind(this);
		this.type = "term";
	}

	// Get the items from Appbase when component is mounted
	componentWillMount() {
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
		if(this.filterListener) {
			this.filterListener.remove();
		}
	}

	listenFilter() {
		this.filterListener = helper.sensorEmitter.addListener("clearFilter", (data) => {
			if(data === this.props.componentId) {
				this.onItemClick(null, 0);
			}
		});
	}

	checkDefault(props) {
		this.urlParams = helper.URLParams.get(props.componentId);
		this.urlParams = this.urlParams ? this.urlParams.split("/") : null;
		if (this.urlParams) {
			this.urlParams = this.urlParams.map(item => {
				const value = item.split("\\");
				if (value.length > 1) {
					return value;
				}
				return value[0];
			});
		}
		const defaultValue = this.urlParams !== null ? this.urlParams : props.defaultSelected;
		this.changeValue(defaultValue);
	}

	changeValue(defaultValue) {
		if (!_.isEqual(this.defaultSelected, defaultValue)) {
			this.defaultSelected = defaultValue;
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
				if (Array.isArray(value)) {
					if (index !== defaultSelected.length - 1) {
						console.error(`${this.props.componentId} - Please check the defaultSelected prop format. Only the last element in the defaultSelected array can be an array`);
					}
					value.map(item => {
						setTimeout(() => {
							this.onItemClick(item, index);
						}, 100);
					});
				} else {
					setTimeout(() => {
						this.onItemClick(value, index);
					}, 100);
				}
			});
		} else if(this.defaultSelected === null) {
			this.onItemClick(null, 0);
		}
	}

	// build query for this sensor only
	customQuery(record) {
		let query = null;
		function generateTermsQuery(dataField) {
			return Object.keys(record).map((key, index) => ({
				terms: {
					[dataField[index]]: Array.isArray(record[key]) ? record[key] : [record[key]]
				}
			}));
		}
		if (record && record[0] !== null) {
			query = {
				bool: {
					must: generateTermsQuery(this.props.dataField)
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
				inputData: this.props.dataField[0],
				customQuery: this.props.customQuery ? this.props.customQuery : this.customQuery,
				reactiveId: this.context.reactiveId,
				showFilter: this.props.showFilter,
				filterLabel: this.props.filterLabel ? this.props.filterLabel : this.props.componentId,
				component: "NestedMultiList",
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
		const level = Object.keys(this.state.selectedValues).length || 0;
		const field = this.props.dataField[level];
		const orderType = this.props.sortBy === "count" ? "_count" : "_term";
		const sortBy = this.props.sortBy === "count" ? "desc" : this.props.sortBy;

		const createTermQuery = (index) => {
			const value = this.state.selectedValues[index];
			if (value.length === 1) {
				return {
					term: {
						[this.props.dataField[index]]: value[0]
					}
				}
			}
			return null;
		};

		const createFilterQuery = (level) => {
			const filterMust = [];
			if(level > 0) {
				for(let i = 0; i <= level-1; i++) {
					const termQuery = createTermQuery(i);
					if (termQuery) {
						filterMust.push(termQuery);
					}
				}
			}
			if (Array.isArray(filterMust) && filterMust.length) {
				return {
					bool: {
						must: filterMust
					}
				};
			}
			return null;
		};

		const init = (field, level) => ({
			[`${field}-${level}`]: {
				filter: createFilterQuery(level) || {},
				aggs: {
					[field]: {
						terms: {
							field: field,
							size: this.props.size,
							order: {
								[orderType]: sortBy
							}
						}
					}
				}
			}
		});

		if(level >= 0 && level < this.props.dataField.length) {
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
		const fieldLevel = `${this.props.dataField[level]}-${level}`;
		if (data && data.aggregations && data.aggregations[fieldLevel] && data.aggregations[fieldLevel][this.props.dataField[level]] && data.aggregations[fieldLevel][this.props.dataField[level]].buckets) {
			this.addItemsToList(data.aggregations[fieldLevel][this.props.dataField[level]].buckets, level);
		}
	}

	addItemsToList(newItems, level) {
		const { selectedValues } = this.state;

		newItems = newItems.map((item) => {
			item.key = item.key.toString();
			return item;
		});
		const { items } = this.state;
		if (newItems) {
			items[level] = newItems;
		} else {
			delete items[level];
		}

		if (selectedValues[level]) {
			const values = [...selectedValues[level]];
			values.forEach(val => {
				if (items[level].filter(item => item.key === val).length !== 1) {
					selectedValues[level] = selectedValues[level].filter(i => i !== val);
				}
			});

			if (selectedValues[level] && !selectedValues[level].length) {
				for (let row in selectedValues) {
					if (row >= level) {
						delete selectedValues[row];
					}
				}
			}
		}

		this.setState({
			selectedValues,
			items,
			storedItems: items
		});
		this.setValue(selectedValues, true, false);
	}

	// set value
	setValue(value, isExecuteQuery = false, changeNestedValue=true) {
		value = Object.keys(value).length ? value : null;
		if (value) {
			value = this.flattenObj(value);
		}
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
			if(this.props.onValueChange) {
				this.props.onValueChange(obj.value);
			}
			let paramValue = [];
			if (value && value.length) {
				paramValue = value.map(item => {
					if (Array.isArray(item)) {
						return item.join("\\");
					}
					return item;
				});
			}
			paramValue = paramValue.length ? paramValue.join("/") : null;
			helper.URLParams.update(this.props.componentId, paramValue, this.props.URLParams);
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

	flattenObj(obj) {
		return Object.keys(obj).map(key => {
			return Array.isArray(obj[key]) && obj[key].length === 1 ? obj[key][0] : obj[key];
		})
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

	onItemClick(selected, level) {
		let { selectedValues, items }  = this.state;

		if (selected === null) {
			selectedValues = {};
		} else if (selectedValues[level] && selectedValues[level].includes(selected)) {
			selectedValues[level] = selectedValues[level].filter(item => item !== selected);
		} else {
			const temp = selectedValues[level] || [];
			selectedValues[level] = [...temp, selected];
		}

		if (selectedValues[level] && !selectedValues[level].length) {
			for (let row in selectedValues) {
				if (row >= level) {
					delete selectedValues[row];
				}
			}
		}

		if (selectedValues[level] && selectedValues[level].length > 1) {
			for (let row in selectedValues) {
				if (row > level) {
					delete selectedValues[row];
				}
			}
		}

		delete items[level+1];

		this.setState({
			items,
			selectedValues
		}, () => {
			this.setValue(selectedValues, true, false);
		});
	}

	renderChevron(level) {
		return level < this.props.dataField.length-1 ? (<i className="fa fa-chevron-right" />) : "";
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
			const active = (Array.isArray(this.state.selectedValues[level]) && this.state.selectedValues[level].includes(item.key));
			const cx = classNames({
				"rbc-item-active": active,
				"rbc-item-inactive": !active,
				"rbc-checkbox-active": this.props.showCheckbox,
				"rbc-checkbox-inactive": !this.props.showCheckbox
			});
			return (
				<li
					key={index}
					className="rbc-list-container col s12 col-xs-12"
				>
					<div className={`rbc-list-item ${cx}`} onClick={() => this.onItemClick(item.key, level)}>
						<input type="checkbox" className="rbc-checkbox-item" checked={active} onChange={() => {}} />
						<label className="rbc-label">{item.key} {this.countRender(item.doc_count)}</label>
						{this.renderChevron(level)}
					</div>
					{
						active && this.state.selectedValues[level].length === 1 && this.state.items[level+1] ? (
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
		if (this.state.selectedValues[level].includes(key) && level === 0) {
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
			<div className={`rbc rbc-nestedmultilist-container card thumbnail col s12 col-xs-12 ${this.props.className ? this.props.className : ""}`} style={this.props.componentStyle}>
				<div className={`rbc rbc-nestedmultilist col s12 col-xs-12 ${cx}`}>
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
		err = new Error("dataField is required prop!");
	}
	else if (!Array.isArray(props[propName])) {
		err = new Error("dataField should be an array!");
	}
	else if (props[propName].length === 0) {
		err = new Error("dataField should not have an empty array.");
	}
	else if (props[propName].length > 9) {
		err = new Error("dataField can have maximum 10 fields.");
	}
	return err;
}

NestedMultiList.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	dataField: NestedingValidation,
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
	beforeValueChange: React.PropTypes.func,
	onValueChange: React.PropTypes.func,
	componentStyle: React.PropTypes.object,
	URLParams: React.PropTypes.bool,
	showFilter: React.PropTypes.bool,
	filterLabel: React.PropTypes.string,
	showCheckbox: React.PropTypes.bool,
	className: React.PropTypes.string
};

// Default props value
NestedMultiList.defaultProps = {
	showCount: true,
	sortBy: "count",
	size: 100,
	showSearch: true,
	title: null,
	placeholder: "Search",
	componentStyle: {},
	URLParams: false,
	showFilter: true,
	showCheckbox: true
};

// context type
NestedMultiList.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired,
	reactiveId: React.PropTypes.number
};

NestedMultiList.types = {
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
	showCheckbox: TYPES.BOOLEAN,
	className: TYPES.STRING
};
