import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Modal, TouchableWithoutFeedback } from "react-native";
import { Calendar } from "react-native-calendars";
import {
	Text,
	Body,
	Item,
	Header,
	Left,
	Button,
	Icon,
	Title,
	Right
} from "native-base";

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery
} from "@appbaseio/reactivecore/lib/actions";
import { isEqual, checkValueChange } from "@appbaseio/reactivecore/lib/utils/helper";
import dateFormats from "@appbaseio/reactivecore/lib/utils/dateFormats";

import types from "../utils/propTypesHelper";

const XDate = require("xdate");

class DateRange extends Component {
	constructor(props) {
		super(props);

		this.type = "range";
		this.state = {
			currentDate: null,
			showModal: false
		};
	}

	componentDidMount() {
		this.props.addComponent(this.props.componentId);
		this.setReact(this.props);

		if (this.props.defaultSelected) {
			const startDate = {
				dateString: new XDate(this.props.defaultSelected.start).toString("yyyy-MM-dd"),
				timestamp: new XDate(this.props.defaultSelected.start).getTime()
			}
			this.handleDateChange(startDate, () => {
				if (this.props.defaultSelected.end) {
					const endDate = {
						dateString: new XDate(this.props.defaultSelected.end).toString("yyyy-MM-dd"),
						timestamp: new XDate(this.props.defaultSelected.end).getTime()
					}
					this.handleDateChange(endDate);
				}
			});
		}
	}

	componentWillReceiveProps(nextProps) {
		if (!isEqual(nextProps.react, this.props.react)) {
			this.setReact(nextProps);
		}

		if (!isEqual(nextProps.defaultSelected !== this.props.defaultSelected)) {
			const startDate = {
				dateString: new XDate(nextProps.defaultSelected.start).toString("yyyy-MM-dd"),
				timestamp: new XDate(nextProps.defaultSelected.start).getTime()
			}
			this.handleDateChange(startDate, () => {
				if (nextProps.defaultSelected.end) {
					const endDate = {
						dateString: new XDate(nextProps.defaultSelected.end).toString("yyyy-MM-dd"),
						timestamp: new XDate(nextProps.defaultSelected.end).getTime()
					}
					this.handleDateChange(endDate);
				}
			});
		}
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

	defaultQuery = (value) => {
		let query = null;
		if (value && value.start && value.end) {
			query = this.generateQuery(value);
		}
		return query;
	};

	generateQuery = (value) => {
		let query = null;
		if (Array.isArray(this.props.dataField) && this.props.dataField.length === 2) {
			query = {
				bool: {
					must: [{
						range: {
							[this.props.dataField[0]]: {
								lte: this.formatDate(new XDate(value.start))
							}
						}
					}, {
						range: {
							[this.props.dataField[1]]: {
								gte: this.formatDate(new XDate(value.end))
							}
						}
					}]
				}
			};
		} else if (Array.isArray(this.props.dataField)) {
			query = {
				range: {
					[this.props.dataField[0]]: {
						gte: this.formatDate(new XDate(value.start)),
						lte: this.formatDate(new XDate(value.end))
					}
				}
			};
		} else {
			query = {
				range: {
					[this.props.dataField]: {
						gte: this.formatDate(new XDate(value.start)),
						lte: this.formatDate(new XDate(value.end))
					}
				}
			};
		}
		return query;
	};

	handleDateChange = (selectedDate, cb) => {
		let value = null,
			date = null;
		let { currentDate } = this.state;

		const performUpdate = () => {
			this.setState({
				currentDate
			}, () => {
				if (cb) cb();
			});
			this.updateQuery(value);
		}

		if (selectedDate) {
			if (currentDate && currentDate.start && !currentDate.end &&
				currentDate.start.timestamp < selectedDate.timestamp) {
				currentDate.end = selectedDate;

				value = {
					start: currentDate.start.timestamp,
					end: currentDate.end.timestamp
				};

				date = {
					start: this.formatDate(new XDate(value.start)),
					end: this.formatDate(new XDate(value.end))
				};

				checkValueChange(
					this.props.componentId,
					date,
					this.props.beforeValueChange,
					this.props.onValueChange,
					performUpdate
				);
			} else {
				currentDate = {
					start: selectedDate
				};
				this.setState({ currentDate }, () => {
					if (cb) cb();
				});
			}
		} else {
			currentDate = null;
			value = null;

			checkValueChange(
				this.props.componentId,
				null,
				this.props.beforeValueChange,
				this.props.onValueChange,
				performUpdate
			);
		}
	};

	updateQuery = (value) => {
		const query = this.props.customQuery || this.defaultQuery;
		let callback = null;
		if (this.props.onQueryChange) {
			callback = this.props.onQueryChange;
		}
		this.props.updateQuery(this.props.componentId, query(value), callback);
	};

	toggleModal = () => {
		this.setState({
			showModal: !this.state.showModal
		})
	};

	getDateRange = (start, end) => {
		const range = [];
		const endTime = end.getTime();
		for (let current = start.addHours(24); current.getTime() < endTime; current.addHours(24)) {
			range.push(current.toString("yyyy-MM-dd"));
		}
		return range;
	};

	getDateString = (date) => {
		return `${date.start.dateString} to ${date.end ? date.end.dateString : ""}`;
	};

	render() {
		let markedDates = {};
		const current = this.state.currentDate
			? this.state.currentDate.start.dateString
			: this.props.startDate || Date();

		if (this.state.currentDate) {
			markedDates = {
				[this.state.currentDate.start.dateString]: [{
					startingDay: true,
					textColor: "#fff",
					color: "#0B6AFF"
				}]
			};
			if (this.state.currentDate.end) {
				const range = this.getDateRange(
					new XDate(this.state.currentDate.start.timestamp),
					new XDate(this.state.currentDate.end.timestamp)
				);
				range.forEach(date => {
					markedDates[date] = [{
						textColor: "#fff",
						color: "#0B6AFF"
					}];
				});
				markedDates[this.state.currentDate.end.dateString] = [{
					endingDay: true,
					textColor: "#fff",
					color: "#0B6AFF"
				}];
			}
		}

		return (<View>
			<Item regular style={{ marginLeft: 0 }}>
				<TouchableWithoutFeedback
					onPress={this.toggleModal}
				>
					<Text
						style={{
							flex: 1,
							alignItems: "center",
							color: this.state.currentDate ? "#000" : "#555",
							flex: 1,
							fontSize: 17,
							height: 50,
							lineHeight: 24,
							paddingLeft: 8,
							paddingRight: 5,
							paddingTop: 12
						}}
					>
						{
							this.state.currentDate
								? this.getDateString(this.state.currentDate)
								: this.props.placeholder
						}
					</Text>
				</TouchableWithoutFeedback>
			</Item>
			<Modal
				supportedOrientations={this.props.supportedOrientations || null}
				transparent={false}
				visible={this.state.showModal}
				onRequestClose={this.toggleModal}
			>
				<Header>
					<Left>
						<Button transparent onPress={this.toggleModal}>
							<Icon name="arrow-back" />
						</Button>
					</Left>
					<Body>
						<Title>{this.props.placeholder}</Title>
					</Body>
					<Right>
						{
							this.state.currentDate
								? (<Button
									style={{ paddingRight: 0 }}
									transparent
									onPress={() => { this.handleDateChange(null); this.toggleModal(); }}
								>
									<Text>Reset</Text>
								</Button>)
								: null
						}
					</Right>
				</Header>
				<Calendar
					current={current}
					onDayPress={this.handleDateChange}
					markedDates={markedDates}
					markingType={"interactive"}
					style={{
						marginTop: 10
					}}
				/>
			</Modal>
		</View>)
	}
}

DateRange.propTypes = {
	addComponent: types.addComponent,
	componentId: types.componentId,
	defaultSelected: types.dateRange,
	react: types.react,
	removeComponent: types.removeComponent,
	queryFormat: types.queryFormatDate,
	dataField: types.dataField,
	beforeValueChange: types.beforeValueChange,
	onValueChange: types.onValueChange,
	customQuery: types.customQuery,
	onQueryChange: types.onQueryChange,
	updateQuery: types.updateQuery,
	startDate: types.date,
	placeholder: types.placeholder,
	supportedOrientations: types.supportedOrientations
}

DateRange.defaultProps = {
	queryFormat: "epoch_millis",
	placeholder: "Select a range of dates"
}

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	updateQuery: (component, query, onQueryChange) => dispatch(updateQuery(component, query, onQueryChange))
});

export default connect(null, mapDispatchtoProps)(DateRange);
