import React, { Component } from 'react';
import { View, Modal, TouchableWithoutFeedback, Platform } from 'react-native';
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

import withTheme from '../../theme/withTheme';
import { connect, getInnerKey } from '../../utils';

const XDate = require('xdate');

class DateRange extends Component {
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

		let startDate = null;
		let endDate = null;

		if (this.props.selectedValue) {
			startDate = this.props.selectedValue.start;
			endDate = this.props.selectedValue.end || null;
		} else if (this.props.defaultSelected) {
			startDate = this.props.defaultSelected.start;
			endDate = this.props.defaultSelected.end || null;
		}

		if (startDate) {
			this.handleDateChange({
				dateString: new XDate(startDate).toString('yyyy-MM-dd'),
				timestamp: new XDate(startDate).getTime(),
			}, () => {
				if (this.props.defaultSelected.end) {
					this.handleDateChange({
						dateString: new XDate(endDate).toString('yyyy-MM-dd'),
						timestamp: new XDate(endDate).getTime(),
					});
				}
			});
		}
	}

	componentWillReceiveProps(nextProps) {
		checkPropChange(
			this.props.react,
			nextProps.react,
			() => this.setReact(nextProps),
		);

		let startDate = null;
		let endDate = null;

		if (!isEqual(this.props.defaultSelected, nextProps.defaultSelected)) {
			startDate = nextProps.defaultSelected.start;
			endDate = nextProps.defaultSelected.end || null;
		} else if (
			!isEqual(this.props.selectedValue, nextProps.selectedValue)
			&& !isEqual(this.state.currentDate, nextProps.selectedValue)
		) {
			startDate = nextProps.selectedValue ? nextProps.selectedValue.start : null;
			endDate = nextProps.selectedValue ? nextProps.selectedValue.end : null;
		}

		if (startDate) {
			this.handleDateChange({
				dateString: new XDate(startDate).toString('yyyy-MM-dd'),
				timestamp: new XDate(startDate).getTime(),
			}, () => {
				if (this.props.defaultSelected.end) {
					this.handleDateChange({
						dateString: new XDate(endDate).toString('yyyy-MM-dd'),
						timestamp: new XDate(endDate).getTime(),
					});
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
		if (value && value.start && value.end) {
			query = this.generateQuery(value, props);
		}
		return query;
	};

	generateQuery = (value, props) => {
		let query = null;
		if (Array.isArray(props.dataField) && props.dataField.length === 2) {
			query = {
				bool: {
					must: [{
						range: {
							[props.dataField[0]]: {
								lte: this.formatDate(new XDate(value.start)),
							},
						},
					}, {
						range: {
							[props.dataField[1]]: {
								gte: this.formatDate(new XDate(value.end)),
							},
						},
					}],
				},
			};
		} else if (Array.isArray(props.dataField)) {
			query = {
				range: {
					[props.dataField[0]]: {
						gte: this.formatDate(new XDate(value.start)),
						lte: this.formatDate(new XDate(value.end)),
					},
				},
			};
		} else {
			query = {
				range: {
					[props.dataField]: {
						gte: this.formatDate(new XDate(value.start)),
						lte: this.formatDate(new XDate(value.end)),
					},
				},
			};
		}
		return query;
	};

	handleDateChange = (selectedDate, cb, props = this.props) => {
		let value = null;
		let date = null;
		let { currentDate } = this.state;

		const performUpdate = () => {
			this.setState({
				currentDate,
			}, () => {
				if (cb) cb();
			});
			this.updateQuery(value, props);
		};

		if (selectedDate) {
			if (currentDate && currentDate.start && !currentDate.end
				&& currentDate.start.timestamp < selectedDate.timestamp) {
				currentDate.end = selectedDate;

				value = {
					start: currentDate.start.timestamp,
					end: currentDate.end.timestamp,
				};

				date = {
					start: this.formatDate(new XDate(value.start)),
					end: this.formatDate(new XDate(value.end)),
				};

				checkValueChange(
					props.componentId,
					date,
					props.beforeValueChange,
					props.onValueChange,
					performUpdate,
				);
			} else {
				currentDate = {
					start: selectedDate,
				};
				this.setState({ currentDate }, () => {
					if (cb) cb();
				});
			}
		} else {
			currentDate = null;
			value = null;

			checkValueChange(
				props.componentId,
				null,
				props.beforeValueChange,
				props.onValueChange,
				performUpdate,
			);
		}
	};

	updateQuery = (value, props) => {
		const query = props.customQuery || this.defaultQuery;

		const { onQueryChange = null } = props;

		props.updateQuery({
			componentId: props.componentId,
			query: query(value, props),
			value: value ? [value.start, value.end] : null,
			showFilter: props.showFilter,
			label: props.filterLabel,
			onQueryChange,
			URLParams: props.URLParams,
		});
	};

	toggleModal = () => {
		this.setState({
			showModal: !this.state.showModal,
		});
	};

	getDateRange = (start, end) => {
		const range = [];
		const endTime = end.getTime();
		for (let current = start.addHours(24); current.getTime() < endTime; current.addHours(24)) {
			range.push(current.toString('yyyy-MM-dd'));
		}
		return range;
	};

	getDateString = date => `${date.start.dateString} to ${date.end ? date.end.dateString : ''}`;

	render() {
		let markedDates = {};
		const current = this.state.currentDate
			? this.state.currentDate.start.dateString
			: this.props.startDate || Date();

		if (this.state.currentDate) {
			markedDates = {
				[this.state.currentDate.start.dateString]: {
					startingDay: true,
					color: (this.props.innerProps && this.props.innerProps.calendar
						&& this.props.innerProps.calendar.theme
						&& this.props.innerProps.calendar.theme.selectedDayBackgroundColor)
						? this.props.innerProps.calendar.theme.selectedDayBackgroundColor
						: this.props.theming.primaryColor,
					textColor: (this.props.innerProps && this.props.innerProps.calendar
						&& this.props.innerProps.calendar.theme
						&& this.props.innerProps.calendar.theme.selectedDayTextColor)
						? this.props.innerProps.calendar.theme.selectedDayTextColor
						: this.props.theming.primaryTextColor,
				},
			};
			if (this.state.currentDate.end) {
				const range = this.getDateRange(
					new XDate(this.state.currentDate.start.timestamp),
					new XDate(this.state.currentDate.end.timestamp),
				);
				range.forEach((date) => {
					markedDates[date] = {
						color: (this.props.innerProps && this.props.innerProps.calendar
							&& this.props.innerProps.calendar.theme
							&& this.props.innerProps.calendar.theme.selectedDayBackgroundColor)
							? this.props.innerProps.calendar.theme.selectedDayBackgroundColor
							: this.props.theming.primaryColor,
						textColor: (this.props.innerProps && this.props.innerProps.calendar
							&& this.props.innerProps.calendar.theme
							&& this.props.innerProps.calendar.theme.selectedDayTextColor)
							? this.props.innerProps.calendar.theme.selectedDayTextColor
							: this.props.theming.primaryTextColor,
					};
				});
				markedDates[this.state.currentDate.end.dateString] = {
					endingDay: true,
					color: (this.props.innerProps && this.props.innerProps.calendar
						&& this.props.innerProps.calendar.theme
						&& this.props.innerProps.calendar.theme.selectedDayBackgroundColor)
						? this.props.innerProps.calendar.theme.selectedDayBackgroundColor
						: this.props.theming.primaryColor,
					textColor: (this.props.innerProps && this.props.innerProps.calendar
						&& this.props.innerProps.calendar.theme
						&& this.props.innerProps.calendar.theme.selectedDayTextColor)
						? this.props.innerProps.calendar.theme.selectedDayTextColor
						: this.props.theming.primaryTextColor,
				};
			}
		}

		const resetButtonStyles = {};
		if (Platform.OS === 'android') {
			resetButtonStyles.color = this.props.theming.primaryTextColor;
		}

		return (
			<View>
				<Item
					regular
					style={{ marginLeft: 0, ...this.props.style }}
					{...getInnerKey(this.props.innerProps, 'item')}
				>
					<TouchableWithoutFeedback
						onPress={this.toggleModal}
					>
						<Text
							style={{
								flex: 1,
								alignItems: 'center',
								color: this.state.currentDate ? this.props.theming.textColor : '#555',
								fontSize: 17,
								height: 50,
								lineHeight: 24,
								paddingLeft: 8,
								paddingRight: 5,
								paddingTop: 12,
								...getInnerKey(this.props.innerStyle, 'label'),
							}}
							{...getInnerKey(this.props.innerProps, 'text')}
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
					{...getInnerKey(this.props.innerProps, 'modal')}
				>
					<Header {...getInnerKey(this.props.innerProps, 'header')}>
						<Left style={getInnerKey(this.props.innerStyle, 'left')}>
							<Button
								transparent
								onPress={this.toggleModal}
								style={getInnerKey(this.props.innerStyle, 'button')}
							>
								<Icon
									name="arrow-back"
									color={this.props.theming.primaryColor}
									style={getInnerKey(this.props.innerStyle, 'icon')}
									{...getInnerKey(this.props.innerProps, 'icon')}
								/>
							</Button>
						</Left>
						<Body style={getInnerKey(this.props.innerStyle, 'body')}>
							<Title
								style={getInnerKey(this.props.innerStyle, 'title')}
								{...getInnerKey(this.props.innerProps, 'title')}
							>
								{this.props.placeholder}
							</Title>
						</Body>
						<Right style={getInnerKey(this.props.innerStyle, 'right')}>
							{
								this.state.currentDate
									? (
										<Button
											style={{
												paddingRight: 0,
												...getInnerKey(this.props.innerStyle, 'button'),
											}}
											transparent
											onPress={() => {
												this.handleDateChange(null);
												this.toggleModal();
											}}
										>
											<Text
												style={{
													...resetButtonStyles,
													...getInnerKey(this.props.innerStyle, 'label'),
												}}
												{...getInnerKey(this.props.innerProps, 'text')}
											>
												Reset
											</Text>
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
							...getInnerKey(this.props.innerStyle, 'calendar'),
						}}
						{...getInnerKey(this.props.innerProps, 'calendar')}
					/>
					{
						this.state.currentDate && this.state.currentDate.end
							? (
								<Button
									onPress={this.toggleModal}
									style={{
										width: '100%',
										borderRadius: 0,
										alignItems: 'center',
										justifyContent: 'center',
										backgroundColor: this.props.theming.primaryColor,
										...getInnerKey(this.props.innerStyle, 'button'),
									}}
									{...getInnerKey(this.props.innerProps, 'button')}
								>
									<Text
										style={{
											color: this.props.theming.primaryTextColor,
											...getInnerKey(this.props.innerStyle, 'label'),
										}}
										{...getInnerKey(this.props.innerProps, 'text')}
									>
										View Results
									</Text>
								</Button>
							)
							: null
					}
				</Modal>
			</View>
		);
	}
}

DateRange.propTypes = {
	addComponent: types.funcRequired,
	componentId: types.stringRequired,
	defaultSelected: types.dateObject,
	react: types.react,
	startDate: types.date,
	removeComponent: types.funcRequired,
	queryFormat: types.queryFormatDate,
	selectedValue: types.selectedValue,
	placeholder: types.string,
	style: types.style,
	showFilter: types.bool,
	filterLabel: types.string,
	beforeValueChange: types.func,
	onValueChange: types.func,
	customQuery: types.func,
	onQueryChange: types.func,
	updateQuery: types.funcRequired,
	supportedOrientations: types.supportedOrientations,
	theming: types.style,
	innerStyle: types.style,
	innerProps: types.props,
};

DateRange.defaultProps = {
	queryFormat: 'epoch_millis',
	placeholder: 'Select a range of dates',
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

export default connect(mapStateToProps, mapDispatchtoProps)(withTheme(DateRange));
