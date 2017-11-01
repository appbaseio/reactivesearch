import React, { Component } from "react";
import { Platform, DatePickerIOS } from "react-native";

export default class DatePicker extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentDate: ""
		};
	}

	handleDateChange = (currentDate) => {
		this.setState({
			currentDate
		});
	};

	render() {
		return null;
	}
}
