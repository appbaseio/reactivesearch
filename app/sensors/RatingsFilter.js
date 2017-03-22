import React, { Component } from "react";
import classNames from "classnames";
import {
	TYPES,
	AppbaseSensorHelper as helper
} from "@appbaseio/reactivemaps";
import ReactStars from "react-stars";

export default class RatingsFilter extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: null
		};
		this.type = "range";
		this.defaultSelected = props.defaultSelected;
		this.handleChange = this.handleChange.bind(this);
		this.customQuery = this.customQuery.bind(this);
	}

	// Set query information
	componentDidMount() {
		this.setQueryInfo();
		if (this.defaultSelected && this.defaultSelected.start) {
			const records = this.props.data.filter(record => (record.start === this.defaultSelected.start &&
						record.end === this.defaultSelected.end));
			if (records && records.length) {
				setTimeout(this.handleChange.bind(this, records[0]), 300);
			}
		}
	}

	componentWillUpdate() {
		setTimeout(() => {
			if (this.defaultSelected && this.defaultSelected.start !== this.props.defaultSelected.start) {
				this.defaultSelected = this.props.defaultSelected;
				const records = this.props.data.filter(record => (record.start === this.defaultSelected.start &&
							record.end === this.defaultSelected.end));
				if (records && records.length) {
					setTimeout(this.handleChange.bind(this, records[0]), 300);
				}
			}
		}, 300);
	}

	// set the query type and input data
	setQueryInfo() {
		const obj = {
			key: this.props.componentId,
			value: {
				queryType: this.type,
				inputData: this.props.appbaseField,
				customQuery: this.props.customQuery ? this.props.customQuery : this.customQuery
			}
		};
		helper.selectedSensor.setSensorInfo(obj);
	}

	// build query for this sensor only
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

	// handle the input change and pass the value inside sensor info
	handleChange(record) {
		this.setState({
			selected: record
		});
		const obj = {
			key: this.props.componentId,
			value: record
		};
		if(this.props.onValueChange) {
			this.props.onValueChange(obj.value);
		}
		// pass the selected sensor value with componentId as key,
		const isExecuteQuery = true;
		helper.selectedSensor.set(obj, isExecuteQuery);
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
		});

		return (
			<div className={`rbc rbc-ratingsfilter col s12 col-xs-12 card thumbnail ${cx}`}>
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
	componentId: React.PropTypes.string.isRequired,
	appbaseField: React.PropTypes.string.isRequired,
	title: React.PropTypes.string,
	data: React.PropTypes.any.isRequired,
	defaultSelected: React.PropTypes.object,
	customQuery: React.PropTypes.func,
	onValueChange: React.PropTypes.func
};

// Default props value
RatingsFilter.defaultProps = {
	title: null
};

// context type
RatingsFilter.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};

RatingsFilter.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.STRING,
	title: TYPES.STRING,
	data: TYPES.OBJECT,
	defaultSelected: TYPES.OBJECT,
	customQuery: TYPES.FUNCTION
};
