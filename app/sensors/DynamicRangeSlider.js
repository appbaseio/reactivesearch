/* eslint max-lines: 0 */
import React, { Component } from "react";
import classNames from "classnames";
import Slider from "rc-slider";
import {
	InitialLoader,
	TYPES,
	AppbaseChannelManager as manager,
	AppbaseSensorHelper as helper
} from "@appbaseio/reactivebase";
import HistoGramComponent from "../addons/HistoGram";

const _ = require("lodash");

export default class DynamicRangeSlider extends Component {
	constructor(props) {
		super(props);
		this.state = {
			range: {
				min: null,
				max: null
			},
			values: {
				min: null,
				max: null
			},
			counts: [],
			rawData: {
				hits: {
					hits: []
				}
			}
		};
		this.type = "range";
		this.channelId = null;
		this.channelListener = null;
		this.handleValuesChange = this.handleValuesChange.bind(this);
		this.handleResults = this.handleResults.bind(this);
		this.customQuery = this.customQuery.bind(this);
	}

	// Get the items from Appbase when component is mounted
	componentDidMount() {
		this.setQueryInfo();
		this.createChannel();
	}

	componentWillReceiveProps(nextProps) {
		this.updateValues(nextProps.defaultSelected);
	}

	// stop streaming request and remove listener when component will unmount
	componentWillUnmount() {
		if (this.channelId) {
			manager.stopStream(this.channelId);
		}
		if (this.channelListener) {
			this.channelListener.remove();
		}
		if (this.loadListener) {
			this.loadListener.remove();
		}
	}

	// set the query type and input data
	setQueryInfo() {
		const obj = {
			key: this.props.componentId,
			value: {
				queryType: this.type,
				inputData: this.props.appbaseField
			}
		};
		const obj1 = {
			key: `${this.props.componentId}-internal`,
			value: {
				queryType: "range",
				inputData: this.props.appbaseField,
				customQuery: this.props.customQuery ? this.props.customQuery : this.customQuery
			}
		};
		helper.selectedSensor.setSensorInfo(obj);
		helper.selectedSensor.setSensorInfo(obj1);
		this.setRangeValue();
	}

	setRangeValue() {
		const objValue = {
			key: `${this.props.componentId}-internal`,
			value: this.state.range
		};
		helper.selectedSensor.set(objValue, true);
	}

	// Create a channel which passes the react and receive results whenever react changes
	createChannel() {
		// Set the react - add self aggs query as well with react
		const react = this.props.react ? this.props.react : {};
		react.aggs = {
			key: this.props.appbaseField,
			sort: "asc",
			size: 1000
		};
		if (react && react.and && typeof react.and === "string") {
			react.and = [react.and];
		} else {
			react.and = react.and ? react.and : [];
		}
		react.and.push(`${this.props.componentId}-internal`);
		// create a channel and listen the changes
		const channelObj = manager.create(this.context.appbaseRef, this.context.type, react);
		this.channelId = channelObj.channelId;
		this.channelListener = channelObj.emitter.addListener(channelObj.channelId, (res) => {
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
				this.setData(data);
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
		try {
			this.addItemsToList(data.aggregations[this.props.appbaseField].buckets);
		} catch (e) {
			console.log(e);
		}
	}

	customQuery(record) {
		if (record) {
			return {
				range: {
					[this.props.appbaseField]: {
						gte: record.start,
						lte: record.end,
						boost: 2.0
					}
				}
			};
		}
		return null;
	}

	// Generating count for histogram
	countCalc(min, max, newItems) {
		const counts = [];
		const storeItems = {};
		newItems.forEach((item) => {
			item.key = Math.floor(item.key);
			if (!(item.key in storeItems)) {
				storeItems[item.key] = item.doc_count;
			} else {
				storeItems[item.key] += item.doc_count;
			}
		});
		for (let i = min; i <= max; i += 1) {
			const val = storeItems[i] ? storeItems[i] : 0;
			counts.push(val);
		}
		return counts;
	}

	// Handle function when value slider option is changing
	handleValuesChange(component, values) {
		this.setState({
			values
		});
	}

	addItemsToList(newItems) {
		newItems = _.orderBy(newItems, ["key"], ["asc"]);
		const itemLength = newItems.length;
		const min = newItems[0].key;
		const max = newItems[itemLength - 1].key;
		if (itemLength > 1) {
			this.setState({
				counts: this.countCalc(min, max, newItems),
				range: { min, max },
				values: { min, max }
			}, () => {
				this.handleResults(null, { min, max });
			});
		}
		this.updateValues(this.props.defaultSelected);
	}

	updateValues(defaultSelected) {
		if (defaultSelected) {
			const { min, max } = this.state.range;
			const { start, end } = defaultSelected(min, max);

			if (start >= min && end <= max) {
				this.setState({
					values: {
						min: start,
						max: end
					}
				});
			} else {
				console.error(`defaultSelected values must lie between ${min} and ${max}`);
			}
		}
	}

	// Handle function when slider option change is completed
	handleResults(textVal, value) {
		let values;
		if (textVal) {
			values = {
				min: textVal[0],
				max: textVal[1]
			};
		} else {
			values = value;
		}
		const realValues = {
			from: values.min,
			to: values.max
		};
		const obj = {
			key: this.props.componentId,
			value: realValues
		};
		helper.selectedSensor.set(obj, true);
		this.setState({
			values
		});
	}

	render() {
		let title = null,
			histogram = null,
			marks = {};

		const { min, max } = this.state.range;

		if (this.props.title) {
			title = (<h4 className="rbc-title col s12 col-xs-12">{this.props.title}</h4>);
		}

		if (this.state.counts && this.state.counts.length && this.props.showHistogram) {
			histogram = (<HistoGramComponent data={this.state.counts} />);
		}

		if (this.props.rangeLabels && min !== null && max !== null) {
			const labels = this.props.rangeLabels(min, max);
			marks = {
				[min]: labels.start,
				[max]: labels.end
			};
		}

		const cx = classNames({
			"rbc-title-active": this.props.title,
			"rbc-title-inactive": !this.props.title,
			"rbc-rangelabels-active": this.props.rangeLabels,
			"rbc-rangelabels-inactive": !this.props.rangeLabels,
			"rbc-histogram-active": this.props.showHistogram,
			"rbc-histogram-inactive": !this.props.showHistogram,
			"rbc-initialloader-active": this.props.initialLoader,
			"rbc-initialloader-inactive": !this.props.initialLoader
		});

		return (
			<div className={`rbc rbc-dynamicrangeslider card thumbnail col s12 col-xs-12 ${cx}`}>
				{title}
				{histogram}
				<div className="rbc-rangeslider-container col s12 col-xs-12">
					<Slider
						range
						value={[this.state.values.min, this.state.values.max]}
						min={min}
						max={max}
						onChange={this.handleResults}
						step={this.props.stepValue}
						marks={marks}
					/>
				</div>
				{this.props.initialLoader && this.state.queryStart ? (<InitialLoader defaultText={this.props.initialLoader} />) : null}
			</div>
		);
	}
}

DynamicRangeSlider.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	appbaseField: React.PropTypes.string.isRequired,
	title: React.PropTypes.string,
	stepValue: React.PropTypes.number,
	showHistogram: React.PropTypes.bool,
	rangeLabels: React.PropTypes.func,
	defaultSelected: React.PropTypes.func,
	customQuery: React.PropTypes.func,
	initialLoader: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.element
	]),
	react: React.PropTypes.object
};

DynamicRangeSlider.defaultProps = {
	title: null,
	stepValue: 1,
	showHistogram: true
};

// context type
DynamicRangeSlider.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};

DynamicRangeSlider.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.STRING,
	title: TYPES.STRING,
	rangeLabels: TYPES.FUNCTION,
	defaultSelected: TYPES.FUNCTION,
	react: TYPES.OBJECT,
	stepValue: TYPES.NUMBER,
	showHistogram: TYPES.BOOLEAN,
	customQuery: TYPES.FUNCTION,
	initialLoader: TYPES.OBJECT
};
