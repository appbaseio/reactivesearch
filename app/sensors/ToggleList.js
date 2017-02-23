import React, { Component } from "react";
import classNames from "classnames";
import {
	TYPES,
	AppbaseSensorHelper as helper
} from "@appbaseio/reactivebase";

export default class ToggleList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: []
		};
		this.type = "term";
		this.defaultSelected = this.props.defaultSelected;
		this.handleChange = this.handleChange.bind(this);
		this.customQuery = this.customQuery.bind(this);
	}

	// Set query information
	componentDidMount() {
		this.setQueryInfo();
		if (this.defaultSelected) {
			const records = this.props.data.filter(record => this.defaultSelected.indexOf(record.label) > -1);
			if (records && records.length) {
				records.forEach((singleRecord) => {
					setTimeout(this.handleChange.bind(this, singleRecord), 1000);
				});
			}
		}
	}

	componentWillUpdate() {
		if (this.defaultSelected !== this.props.defaultSelected) {
			this.defaultSelected = this.props.defaultSelected;
			const records = this.props.data.filter(record => this.defaultSelected.indexOf(record.label) > -1);
			if (records && records.length) {
				records.forEach((singleRecord) => {
					setTimeout(this.handleChange.bind(this, singleRecord), 1000);
				});
			}
		}
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
		let query = null;

		function generateRangeQuery(appbaseField) {
			return record.map(singleRecord => ({
				term: {
					[appbaseField]: singleRecord.value
				}
			}));
		}

		if (record && record.length) {
			query = {
				bool: {
					should: generateRangeQuery(this.props.appbaseField),
					minimum_should_match: 1,
					boost: 1.0
				}
			};
			return query;
		}
		return query;
	}

	// handle the input change and pass the value inside sensor info
	handleChange(record) {
		const selected = this.state.selected;
		let newSelection = [];
		let selectedIndex = null;
		selected.forEach((selectedRecord, index) => {
			if (record.label === selectedRecord.label) {
				selectedIndex = index;
				selected.splice(index, 1);
			}
		});
		if (selectedIndex === null) {
			if (this.props.multiSelect) {
				selected.push(record);
				newSelection = selected;
			} else {
				newSelection.push(record);
			}
		} else {
			newSelection = selected;
		}
		this.setState({
			selected: newSelection
		});
		const obj = {
			key: this.props.componentId,
			value: newSelection
		};
		// pass the selected sensor value with componentId as key,
		const isExecuteQuery = true;
		helper.selectedSensor.set(obj, isExecuteQuery);
	}

	renderList() {
		let list;
		const selectedText = this.state.selected.map(record => record.label);
		if (this.props.data) {
			list = this.props.data.map(record => (
				<div key={record.label} className="rbc-list-item">
					<input
						type="checkbox"
						id={record.label}
						className="rbc-checkbox-item"
						checked={selectedText.indexOf(record.label) > -1}
						onChange={() => this.handleChange(record)}
					/>
					<label htmlFor={record.label} className="rbc-label">{record.label}</label>
				</div>
			));
		}
		return list;
	}

	// render
	render() {
		let title = null;
		if (this.props.title) {
			title = (<h4 className="rbc-title col s12 col-xs-12">{this.props.title}</h4>);
		}

		const cx = classNames({
			"rbc-title-active": this.props.title,
			"rbc-title-inactive": !this.props.title,
			"rbc-multiselect-active": this.props.multiSelect,
			"rbc-multiselect-inactive": !this.props.multiSelect
		});

		return (
			<div className={`rbc rbc-togglelist col s12 col-xs-12 card thumbnail ${cx}`}>
				<div className="row">
					{title}
					<div className="col s12 col-xs-12">
						{this.renderList()}
					</div>
				</div>
			</div>
		);
	}
}

ToggleList.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	appbaseField: React.PropTypes.string.isRequired,
	title: React.PropTypes.string,
	data: React.PropTypes.arrayOf(React.PropTypes.shape({
		label: React.PropTypes.string.isRequired,
		value: React.PropTypes.string.isRequired
	})),
	defaultSelected: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.arrayOf(React.PropTypes.string)
	]),
	multiSelect: React.PropTypes.bool,
	customQuery: React.PropTypes.func
};

// Default props value
ToggleList.defaultProps = {
	multiSelect: true
};

// context type
ToggleList.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};

ToggleList.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.STRING,
	title: TYPES.STRING,
	data: TYPES.OBJECT,
	defaultSelected: TYPES.ARRAY,
	multiSelect: TYPES.BOOLEAN,
	customQuery: TYPES.FUNCTION
};
