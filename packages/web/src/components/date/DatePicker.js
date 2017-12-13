import React, { Component } from "react";
import { connect } from "react-redux";
import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryOptions
} from "@appbaseio/reactivecore/lib/actions";
import {
	isEqual,
	checkValueChange,
	checkPropChange,
	checkSomePropChange,
	getClassName
} from "@appbaseio/reactivecore/lib/utils/helper";
import dateFormats from "@appbaseio/reactivecore/lib/utils/dateFormats";
import types from "@appbaseio/reactivecore/lib/utils/types";
import XDate from "xdate";
import DayPickerInput from "react-day-picker/DayPickerInput";

import { dateContainer } from "../../styles/Input";

class DatePicker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentDate: null,
			showModal: false
		};
	}

	componentDidMount() {
		this.props.addComponent(this.props.componentId);
		this.setReact(this.props);

		if (this.props.defaultSelected) {
			const currentDate = {
				dateString: new XDate(this.props.defaultSelected).toString("yyyy-MM-dd"),
				timestamp: new XDate(this.props.defaultSelected).getTime()
			}
			this.handleDateChange(currentDate);
		}
	}

	componentWillReceiveProps(nextProps) {
		checkPropChange(
			this.props.react,
			nextProps.react,
			() => this.setReact(nextProps)
		);
		checkPropChange(
			this.props.defaultSelected,
			nextProps.defaultSelected,
			() => {
				const currentDate = {
					dateString: new XDate(nextProps.defaultSelected).toString("yyyy-MM-dd"),
					timestamp: new XDate(nextProps.defaultSelected).getTime()
				}
				this.handleDateChange(currentDate, nextProps);
			}
		);
	}

	componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
	}

	setReact(props) {
		if (props.react) {
			props.watchComponent(props.componentId, props.react);
		}
	}

	formatDate = (date) => {
		switch(this.props.queryFormat) {
			case "epoch_millis": return date.getTime();
			case "epoch_seconds": return Math.floor(date.getTime() / 1000);
			default: {
				if (dateFormats[this.props.queryFormat]) {
					return date.toString(dateFormats[this.props.queryFormat]);
				}
				return date;
			}
		}
	};

	defaultQuery = (value, props) => {
		let query = null;
		if (value && props.queryFormat) {
			query = {
				range: {
					[props.dataField]: {
						gte: this.formatDate(new XDate(value).addHours(-24)),
						lte: this.formatDate(new XDate(value))
					}
				}
			};
		}
		return query;
	};

	handleDateChange = (currentDate, props = this.props) => {
		let value = null,
			date = null;
		if (currentDate) {
			value = currentDate;
			date = this.formatDate(new XDate(value));
		}

		const performUpdate = () => {
			this.setState({
				currentDate
			});
			this.updateQuery(value, props);
		}
		checkValueChange(
			props.componentId,
			date,
			props.beforeValueChange,
			props.onValueChange,
			performUpdate
		);
	};

	updateQuery = (value, props) => {
		const query = props.customQuery || this.defaultQuery;
		let onQueryChange = null;
		if (props.onQueryChange) {
			onQueryChange = props.onQueryChange;
		}
		props.updateQuery({
			componentId: props.componentId,
			query: query(value, props),
			value,
			filterLabel: props.filterLabel,
			onQueryChange
		});
	};


	render() {
		return (
			<div className={dateContainer}>
				<DayPickerInput showOverlay onDayChange={d => this.handleDateChange(d)} />
			</div>
		);
	}
}

DatePicker.propTypes = {
	addComponent: types.funcRequired,
	componentId: types.stringRequired,
	defaultSelected: types.date,
	react: types.react,
	removeComponent: types.funcRequired,
	queryFormat: types.queryFormatDate
}

const mapStateToProps = (state, props) => ({
	options: state.aggregations[props.componentId]
		? state.aggregations[props.componentId][props.dataField].buckets
		: [],
	selectedValue: state.selectedValues[props.componentId]
		? state.selectedValues[props.componentId].value
		: null
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	watchComponent: (component, react) =>
		dispatch(watchComponent(component, react)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	setQueryOptions: (component, props, execute) =>
		dispatch(setQueryOptions(component, props, execute))
});

export default connect(mapStateToProps, mapDispatchtoProps)(DatePicker);

