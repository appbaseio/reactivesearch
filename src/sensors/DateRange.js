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

import { addComponent, removeComponent, watchComponent, updateQuery } from "../actions";
import { isEqual, checkValueChange } from "../utils/helper";
import { dateFormat } from "../constants";

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
				if (dateFormat[this.props.queryFormat]) {
					return date.toString(dateFormat[this.props.queryFormat]);
				}
				return date;
			}
		}
	};

	defaultQuery = (value) => {
		let query = null;
		if (value && value.startDate && value.endDate) {
			query = this.generateQuery(value);
		}
		return query;
	}

	generateQuery = (value) => {
		let query = null;
		if (Array.isArray(this.props.dataField) && this.props.dataField.length === 2) {
			query = {
				bool: {
					must: [{
						range: {
							[this.props.dataField[0]]: {
								lte: this.formatDate(new XDate(value.startDate))
							}
						}
					}, {
						range: {
							[this.props.dataField[1]]: {
								gte: this.formatDate(new XDate(value.endDate))
							}
						}
					}]
				}
			};
		} else if (Array.isArray(this.props.dataField)) {
			query = {
				range: {
					[this.props.dataField[0]]: {
						gte: this.formatDate(new XDate(value.startDate)),
						lte: this.formatDate(new XDate(value.endDate))
					}
				}
			};
		} else {
			query = {
				range: {
					[this.props.dataField]: {
						gte: this.formatDate(new XDate(value.startDate)),
						lte: this.formatDate(new XDate(value.endDate))
					}
				}
			};
		}
		return query;
	}

	handleDateChange = (selectedDate) => {
		let value = null,
			date = null;
		let { currentDate } = this.state;

		const performUpdate = () => {
			this.setState({
				currentDate
			});
			this.updateQuery(value);
		}

		if (selectedDate) {
			if (!currentDate) {
				currentDate = {
					startDate: selectedDate
				}
				this.setState({ currentDate });
			} else if (currentDate.startDate && !currentDate.endDate &&
				currentDate.startDate.timestamp < selectedDate.timestamp) {
				currentDate.endDate = selectedDate;

				value = {
					startDate: currentDate.startDate.timestamp,
					endDate: currentDate.endDate.timestamp
				};

				date = {
					startDate: this.formatDate(new XDate(value.startDate)),
					endDate: this.formatDate(new XDate(value.endDate))
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
					startDate: selectedDate
				};
				this.setState({ currentDate });
			}
		} else {
			this.setState({
				currentDate: null
			});

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
		return `${date.startDate.dateString} to ${date.endDate ? date.endDate.dateString : ""}`;
	}

	render() {
		let markedDates = {};

		if (this.state.currentDate) {
			markedDates = {
				[this.state.currentDate.startDate.dateString]: [{
					startingDay: true,
					textColor: "#fff",
					color: "#0B6AFF"
				}]
			};
			if (this.state.currentDate.endDate) {
				const range = this.getDateRange(
					new XDate(this.state.currentDate.startDate.timestamp),
					new XDate(this.state.currentDate.endDate.timestamp)
				);
				range.forEach(date => {
					markedDates[date] = [{
						textColor: "#fff",
						color: "#0B6AFF"
					}];
				});
				markedDates[this.state.currentDate.endDate.dateString] = [{
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

DateRange.defaultProps = {
	queryFormat: "epoch_millis",
	placeholder: "Select a date"
}

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	updateQuery: (component, query, onQueryChange) => dispatch(updateQuery(component, query, onQueryChange))
});

export default connect(null, mapDispatchtoProps)(DateRange);
