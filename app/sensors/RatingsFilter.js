import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import {
	TYPES,
	AppbaseSensorHelper as helper
} from "@appbaseio/reactivemaps";
import ReactStars from "react-stars";

const _ = require("lodash");

export default class RatingsFilter extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: null
		};
		this.type = "range";
		this.urlParams = props.URLParams ? helper.URLParams.get(props.componentId, false, true) : null;
		this.handleChange = this.handleChange.bind(this);
		this.customQuery = this.customQuery.bind(this);
	}

	// Set query information
	componentWillMount() {
		this.previousQuery = null;	// initial value for onQueryChange
		this.setQueryInfo();
		this.checkDefault(this.props);
		this.listenFilter();
	}

	componentWillReceiveProps(nextProps) {
		this.checkDefault(nextProps);
	}

	// stop streaming request and remove listener when component will unmount
	componentWillUnmount() {
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
		const defaultValue = this.urlParams !== null ? this.urlParams : props.defaultSelected;
		this.changeValue(defaultValue);
	}

	changeValue(defaultValue) {
		if (!_.isEqual(this.defaultSelected, defaultValue)) {
			this.defaultSelected = defaultValue;
			if (this.defaultSelected) {
				this.defaultSelected = defaultValue;
				const records = this.props.data.filter(record => (record.start === this.defaultSelected.start &&
							record.end === this.defaultSelected.end));
				if (records && records.length) {
					setTimeout(this.handleChange.bind(this, records[0]), 300);
				}
			} else if (this.defaultSelected === null) {
				this.handleChange(null);
			}
		}
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
				inputData: this.props.dataField,
				customQuery: getQuery,
				reactiveId: this.context.reactiveId,
				showFilter: this.props.showFilter,
				filterLabel: this.props.filterLabel ? this.props.filterLabel : this.props.componentId,
				component: "RatingsFilter",
				defaultSelected: this.urlParams !== null ? this.urlParams : this.props.defaultSelected
			}
		};
		helper.selectedSensor.setSensorInfo(obj);
	}

	// build query for this sensor only
	customQuery(record) {
		if (record) {
			return {
				range: {
					[this.props.dataField]: {
						gte: record.start,
						lte: record.end,
						boost: 2.0
					}
				}
			};
		}
		return null;
	}

	// handle the input change and pass the value inside sensor info
	handleChange(record) {
		this.setState({
			selected: record
		});
		const obj = {
			key: this.props.componentId,
			value: record
		};

		const execQuery = () => {
			if (this.props.onValueChange) {
				this.props.onValueChange(obj.value);
			}
			const isExecuteQuery = true;
			if (this.props.URLParams) {
				helper.URLParams.update(this.props.componentId, record ? JSON.stringify(record) : null, this.props.URLParams);
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

	renderButtons() {
		let buttons;
		const selectedItem = this.state.selected && this.state.selected.start ? this.state.selected.start : this.props.data.start;
		if (this.props.data) {
			let maxEnd = 5;
			this.props.data.forEach((item) => {
				maxEnd = item.end > maxEnd ? item.end : maxEnd;
			});

			buttons = this.props.data.map((record) => {
				const cx = selectedItem === record.start ? "rbc-active" : "";
				return (
					<div className="rbc-list-item row" key={record.label} onClick={() => this.handleChange(record)}>
						<label className={`rbc-label ${cx}`}>
							<ReactStars
								count={maxEnd}
								value={record.start}
								size={20}
								color1={"#bbb"}
								edit={false}
								color2={"#ffd700"}
							/>
							<span>{record.label}</span>
						</label>
					</div>
				);
			});
		}
		return buttons;
	}

	// render
	render() {
		let title = null;
		if (this.props.title) {
			title = (<h4 className="rbc-title col s12 col-xs-12">{this.props.title}</h4>);
		}

		const cx = classNames({
			"rbc-title-active": this.props.title,
			"rbc-title-inactive": !this.props.title
		}, this.props.className);

		return (
			<div className={`rbc rbc-ratingsfilter col s12 col-xs-12 card thumbnail ${cx}`} style={this.props.style}>
				<div className="row">
					{title}
					<div className="col s12 col-xs-12 rbc-list-container">
						{this.renderButtons()}
					</div>
				</div>
			</div>
		);
	}
}

RatingsFilter.propTypes = {
	componentId: PropTypes.string.isRequired,
	dataField: PropTypes.string.isRequired,
	title: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.element
	]),
	data: PropTypes.any.isRequired,
	defaultSelected: PropTypes.object,
	customQuery: PropTypes.func,
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
RatingsFilter.defaultProps = {
	title: null,
	style: {},
	URLParams: false,
	showFilter: true
};

// context type
RatingsFilter.contextTypes = {
	appbaseRef: PropTypes.any.isRequired,
	type: PropTypes.any.isRequired,
	reactiveId: PropTypes.number
};

RatingsFilter.types = {
	componentId: TYPES.STRING,
	dataField: TYPES.STRING,
	dataFieldType: TYPES.NUMBER,
	title: TYPES.STRING,
	data: TYPES.OBJECT,
	defaultSelected: TYPES.OBJECT,
	customQuery: TYPES.FUNCTION,
	URLParams: TYPES.BOOLEAN,
	showFilter: TYPES.BOOLEAN,
	filterLabel: TYPES.STRING,
	className: TYPES.STRING,
	onQueryChange: TYPES.FUNCTION
};
