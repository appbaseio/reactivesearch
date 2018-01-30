import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Modal, TouchableWithoutFeedback } from 'react-native';
import { Calendar } from 'react-native-calendars';
import {
	Text,
	Body,
	Item,
	Header,
	Left,
	Button,
	Icon,
	Title,
	Right,
} from 'native-base';

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
} from '@appbaseio/reactivecore/lib/actions';
import {
	isEqual,
	checkValueChange,
	checkPropChange,
} from '@appbaseio/reactivecore/lib/utils/helper';
import dateFormats from '@appbaseio/reactivecore/lib/utils/dateFormats';
import types from '@appbaseio/reactivecore/lib/utils/types';

const XDate = require('xdate');

class DatePicker extends Component {
	constructor(props) {
		super(props);

		this.type = 'range';
		this.state = {
			currentDate: null,
			showModal: false,
		};
	}

	componentDidMount() {
		this.props.addComponent(this.props.componentId);
		this.setReact(this.props);

		if (this.props.selectedValue) {
			const currentDate = {
				dateString: new XDate(this.props.selectedValue).toString('yyyy-MM-dd'),
				timestamp: new XDate(this.props.selectedValue).getTime(),
			};
			this.handleDateChange(currentDate);
		} else if (this.props.defaultSelected) {
			const currentDate = {
				dateString: new XDate(this.props.defaultSelected).toString('yyyy-MM-dd'),
				timestamp: new XDate(this.props.defaultSelected).getTime(),
			};
			this.handleDateChange(currentDate);
		}
	}

	componentWillReceiveProps(nextProps) {
		checkPropChange(
			this.props.react,
			nextProps.react,
			() => this.setReact(nextProps),
		);

		if (!isEqual(this.props.defaultSelected, nextProps.defaultSelected)) {
			const currentDate = {
				dateString: new XDate(nextProps.defaultSelected).toString('yyyy-MM-dd'),
				timestamp: new XDate(nextProps.defaultSelected).getTime(),
			};
			this.handleDateChange(currentDate, nextProps);
		}

		// TODO: add dynamic selected value logic here
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
		switch (this.props.queryFormat) {
			case 'epoch_millis': return date.getTime();
			case 'epoch_seconds': return Math.floor(date.getTime() / 1000);
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
						lte: this.formatDate(new XDate(value)),
					},
				},
			};
		}
		return query;
	};

	handleDateChange = (currentDate, props = this.props) => {
		let value = null;
		let date = null;
		if (currentDate) {
			value = currentDate.timestamp;
			date = this.formatDate(new XDate(value));
		}

		const performUpdate = () => {
			this.setState({
				currentDate,
			});
			this.updateQuery(value, props);
		};
		checkValueChange(
			props.componentId,
			date,
			props.beforeValueChange,
			props.onValueChange,
			performUpdate,
		);
	};

	updateQuery = (value, props) => {
		const query = props.customQuery || this.defaultQuery;

		const { onQueryChange = null } = props;

		props.updateQuery({
			componentId: props.componentId,
			query: query(value, props),
			value,
			showFilter: props.showFilter,
			label: props.filterLabel,
			onQueryChange,
			URLParams: false,
		});
	};

	toggleModal = () => {
		this.setState({
			showModal: !this.state.showModal,
		});
	};

	render() {
		let markedDates = {};
		const current = this.state.currentDate
			? this.state.currentDate.dateString
			: this.props.initialMonth || Date();

		if (this.state.currentDate) {
			markedDates = {
				[this.state.currentDate.dateString]: {
					startingDay: true,
					endingDay: true,
					color: '#0b6aff',
					textColor: '#fff',
				},
			};
		}

		return (
			<View>
				<Item regular style={{ marginLeft: 0, ...this.props.style }}>
					<TouchableWithoutFeedback
						onPress={this.toggleModal}
					>
						<Text
							style={{
								flex: 1,
								alignItems: 'center',
								color: this.state.currentDate ? '#000' : '#555',
								fontSize: 17,
								height: 50,
								lineHeight: 24,
								paddingLeft: 8,
								paddingRight: 5,
								paddingTop: 12,
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
									? (
										<Button
											style={{ paddingRight: 0 }}
											transparent
											onPress={() => {
												this.handleDateChange(null);
												this.toggleModal();
											}}
										>
											<Text>Reset</Text>
										</Button>
									)
									: null
							}
						</Right>
					</Header>
					<Calendar
						current={current}
						onDayPress={this.handleDateChange}
						markedDates={markedDates}
						markingType="period"
						style={{
							marginTop: 10,
						}}
					/>
					{
						this.state.currentDate
							? (
								<Button
									primary
									onPress={this.toggleModal}
									style={{
										width: '100%',
										borderRadius: 0,
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<Text>View Results</Text>
								</Button>
							)
							: null
					}
				</Modal>
			</View>
		);
	}
}

DatePicker.propTypes = {
	addComponent: types.funcRequired,
	componentId: types.stringRequired,
	defaultSelected: types.date,
	react: types.react,
	initialMonth: types.date,
	removeComponent: types.funcRequired,
	queryFormat: types.queryFormatDate,
	selectedValue: types.selectedValue,
	placeholder: types.string,
	style: types.style,
	showFilter: types.bool,
	filterLabel: types.string,
	supportedOrientations: types.supportedOrientations,
	onQueryChange: types.func,
};

DatePicker.defaultProps = {
	queryFormat: 'epoch_millis',
	placeholder: 'Select a date',
};

const mapStateToProps = (state, props) => ({
	selectedValue: state.selectedValues[props.componentId]
		? state.selectedValues[props.componentId].value
		: null,
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	watchComponent: (component, react) =>
		dispatch(watchComponent(component, react)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
});

export default connect(mapStateToProps, mapDispatchtoProps)(DatePicker);
