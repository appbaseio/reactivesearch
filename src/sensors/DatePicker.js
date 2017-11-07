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

class DatePicker extends Component {
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
			const currentDate = {
				dateString: new XDate(this.props.defaultSelected).toString("yyyy-MM-dd"),
				timestamp: new XDate(this.props.defaultSelected).getTime()
			}
			this.handleDateChange(currentDate);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (!isEqual(nextProps.react, this.props.react)) {
			this.setReact(nextProps);
		}

		if (nextProps.defaultSelected !== this.props.defaultSelected) {
			const currentDate = {
				dateString: new XDate(nextProps.defaultSelected).toString("yyyy-MM-dd"),
				timestamp: new XDate(nextProps.defaultSelected).getTime()
			}
			this.handleDateChange(currentDate);
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
				if (dateFormat[this.props.queryFormat]) {
					return date.toString(dateFormat[this.props.queryFormat]);
				}
				return date;
			}
		}
	};

	defaultQuery = (value) => {
		let query = null;
		if (value && this.props.queryFormat) {
			query = {
				range: {
					[this.props.dataField]: {
						gte: this.formatDate(new XDate(value).addHours(-24)),
						lte: this.formatDate(new XDate(value))
					}
				}
			};
		}
		return query;
	};

	handleDateChange = (currentDate) => {
		let value = null,
			date = null;
		if (currentDate) {
			value = currentDate.timestamp;
			date = this.formatDate(new XDate(value));
		}

		const performUpdate = () => {
			this.setState({
				currentDate
			});
			this.updateQuery(value);
		}
		checkValueChange(
			this.props.componentId,
			date,
			this.props.beforeValueChange,
			this.props.onValueChange,
			performUpdate
		);
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

	render() {
		let markedDates = {};
		const current = this.state.currentDate
			? this.state.currentDate.dateString
			: this.props.startDate || Date();

		if (this.state.currentDate) {
			markedDates = {
				[this.state.currentDate.dateString]: [{
					startingDay: true,
					endingDay: true,
					textColor: "#fff",
					color: "#0B6AFF"
				}]
			};
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
								? this.state.currentDate.dateString
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

DatePicker.defaultProps = {
	queryFormat: "epoch_millis",
	placeholder: "Select a date"
}

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	updateQuery: (component, query, onQueryChange) => dispatch(updateQuery(component, query, onQueryChange))
});

export default connect(null, mapDispatchtoProps)(DatePicker);
