import React, { Component } from 'react';
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
	getClassName,
} from '@appbaseio/reactivecore/lib/utils/helper';
import dateFormats from '@appbaseio/reactivecore/lib/utils/dateFormats';
import types from '@appbaseio/reactivecore/lib/utils/types';
import XDate from 'xdate';
import DayPickerInput from 'react-day-picker/DayPickerInput';

import DateContainer from '../../styles/DateContainer';
import Title from '../../styles/Title';
import Flex from '../../styles/Flex';
import { connect } from '../../utils';

import CancelSvg from '../shared/CancelSvg';

class DateRange extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentDate: null,
		};
		this.locked = false;
	}

	componentWillMount() {
		this.props.addComponent(this.props.componentId);
		this.setReact(this.props);

		if (this.props.selectedValue) {
			// parsing string values from selectedValue to date objects for DayPicker
			this.handleDateChange({
				start: new Date(this.props.selectedValue[0]),
				end: new Date(this.props.selectedValue[1]),
			}, false);
		} else if (this.props.defaultSelected) {
			this.handleDateChange(this.props.defaultSelected, false);
		}
	}

	componentWillReceiveProps(nextProps) {
		checkPropChange(this.props.react, nextProps.react, () =>
			this.setReact(nextProps));
		if (!isEqual(this.props.defaultSelected, nextProps.defaultSelected)) {
			this.handleDateChange(nextProps.defaultSelected, false, nextProps);
		} else {
			const { currentDate } = this.state;
			const { selectedValue } = nextProps;
			// comparing array format of selectedValue with object form of the state if not null
			if (
				!isEqual(
					currentDate ? [
						this.formatInputDate(currentDate.start),
						this.formatInputDate(currentDate.end),
					] : null,
					selectedValue,
				)
				&& !isEqual(this.props.selectedValue, selectedValue)
			) {
				this.handleDateChange(selectedValue ? {
					start: nextProps.selectedValue[0],
					end: nextProps.selectedValue[1],
				} : null, true, nextProps);
			}
		}
		checkPropChange(
			this.props.dataField,
			nextProps.dataField,
			() => this.updateQuery(
				this.state.currentDate
					? { // we need the date in correct queryFormat
						start: this.formatDate(this.state.currentDate.start),
						end: this.formatDate(this.state.currentDate.end),
					}
					: this.state.currentDate,
				nextProps,
			),
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

	formatDate = (date, props = this.props) => {
		switch (props.queryFormat) {
			case 'epoch_millis':
				return date.getTime();
			case 'epoch_seconds':
				return Math.floor(date.getTime() / 1000);
			default: {
				if (dateFormats[props.queryFormat]) {
					return date.toString(dateFormats[props.queryFormat]);
				}
				return date;
			}
		}
	};

	formatInputDate = (date) => {
		const xdate = new XDate(date);
		return xdate.valid() ? xdate.toString('yyyy-MM-dd') : '';
	};

	defaultQuery = (value, props) => {
		let query = null;
		if (value) {
			if (Array.isArray(props.dataField) && props.dataField.length === 2) {
				query = {
					bool: {
						must: [{
							range: {
								[props.dataField[0]]: {
									lte: this.formatDate(new XDate(value.start), props),
								},
							},
						}, {
							range: {
								[props.dataField[1]]: {
									gte: this.formatDate(new XDate(value.end), props),
								},
							},
						}],
					},
				};
			} else if (Array.isArray(props.dataField)) {
				query = {
					range: {
						[props.dataField[0]]: {
							gte: this.formatDate(new XDate(value.start), props),
							lte: this.formatDate(new XDate(value.end), props),
						},
					},
				};
			} else {
				query = {
					range: {
						[props.dataField]: {
							gte: this.formatDate(new XDate(value.start), props),
							lte: this.formatDate(new XDate(value.end), props),
						},
					},
				};
			}
		}
		return query;
	};

	getEndDateRef = (ref) => {
		this.endDateRef = ref;
	}

	clearDayPickerStart = () => {
		if (this.state.currentDate && this.state.currentDate.start !== '') {
			this.handleStartDate('', false); // resets the day picker component
		}
	};

	clearDayPickerEnd = () => {
		if (this.state.currentDate && this.state.currentDate.end !== '') {
			this.handleEndDate(''); // resets the day picker component
		}
	};

	handleStartDate = (date, autoFocus = true) => {
		const { currentDate } = this.state;
		const end = currentDate ? currentDate.end : '';
		this.handleDateChange({
			start: date,
			end,
		});
		// focus the end date DayPicker if its empty
		if (this.props.autoFocusEnd && autoFocus) {
			// TODO: replace with a single date component in v2.1.0
			window.setTimeout(() => this.endDateRef.getInput().focus(), 0);
		}
	}

	handleEndDate = (date) => {
		const { currentDate } = this.state;
		this.handleDateChange({
			start: currentDate ? currentDate.start : '',
			end: date,
		});
	}

	handleDateChange = (
		currentDate,
		isDefaultValue = false,
		props = this.props,
	) => {
		// ignore state updates when component is locked
		if (props.beforeValueChange && this.locked) {
			return;
		}

		this.locked = true;
		let value = null;
		if (currentDate && !(currentDate.start === '' && currentDate.end === '')) {
			value = isDefaultValue
				? currentDate
				: {
					start: this.formatInputDate(currentDate.start),
					end: this.formatInputDate(currentDate.end),
				};
		}

		const performUpdate = () => {
			this.setState({
				currentDate,
			}, () => {
				this.updateQuery(value, props);
				this.locked = false;
			});
		};
		checkValueChange(
			props.componentId,
			value,
			props.beforeValueChange,
			props.onValueChange,
			performUpdate,
		);
	};

	updateQuery = (value, props) => {
		if (!value || (value && value.start.length && value.end.length)) {
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
		}
	};

	render() {
		const { currentDate } = this.state;
		const start = currentDate ? currentDate.start : '';
		const end = currentDate ? currentDate.end : '';
		const selectedDays = [
			start, { from: start, to: end },
		];
		const modifiers = { start, end };
		return (
			<DateContainer
				range
				style={this.props.style}
				className={this.props.className}
				showBorder={!this.props.showClear}
			>
				{this.props.title && (
					<Title
						className={getClassName(this.props.innerClass, 'title') || null}
					>
						{this.props.title}
					</Title>
				)}
				<Flex className={getClassName(this.props.innerClass, 'input-container') || null}>
					<Flex flex={2} showBorder={this.props.showClear} iconPosition="right">
						<DayPickerInput
							showOverlay={this.props.focused}
							formatDate={this.formatInputDate}
							value={start}
							placeholder={this.props.placeholder.start}
							dayPickerProps={{
								numberOfMonths: this.props.numberOfMonths,
								initialMonth: this.props.initialMonth,
								selectedDays,
								modifiers,
							}}
							onDayChange={this.handleStartDate}
							inputProps={{
								readOnly: true,
							}}
							classNames={{
								container:
									getClassName(this.props.innerClass, 'daypicker-container')
									|| 'DayPickerInput',
								overlayWrapper:
									getClassName(
										this.props.innerClass,
										'daypicker-overlay-wrapper',
									) || 'DayPickerInput-OverlayWrapper',
								overlay:
									getClassName(this.props.innerClass, 'daypicker-overlay')
									|| 'DayPickerInput-Overlay',
							}}
							{...this.props.dayPickerInputProps}
						/>
						{this.props.showClear
							&& this.state.currentDate
							&& this.state.currentDate.start && (
								<CancelSvg onClick={this.clearDayPickerStart} />
							)}
					</Flex>
					<Flex justifyContent="center" alignItems="center" basis="20px">
						-
					</Flex>
					<Flex flex={2} showBorder={this.props.showClear} iconPosition="right">
						<DayPickerInput
							ref={this.getEndDateRef}
							showOverlay={this.props.focused}
							formatDate={this.formatInputDate}
							value={end}
							placeholder={this.props.placeholder.end}
							dayPickerProps={{
								numberOfMonths: this.props.numberOfMonths,
								initialMonth: this.props.initialMonth,
								disabledDays: { before: this.state.currentDate ? this.state.currentDate.start : '' },
								selectedDays,
								modifiers,
							}}
							onDayChange={this.handleEndDate}
							inputProps={{
								readOnly: true,
							}}
							classNames={{
								container:
									getClassName(this.props.innerClass, 'daypicker-container')
									|| 'DayPickerInput',
								overlayWrapper:
									getClassName(
										this.props.innerClass,
										'daypicker-overlay-wrapper',
									) || 'DayPickerInput-OverlayWrapper',
								overlay:
									getClassName(this.props.innerClass, 'daypicker-overlay')
									|| 'DayPickerInput-Overlay',
							}}
							{...this.props.dayPickerInputProps}
						/>
						{this.props.showClear
							&& this.state.currentDate
							&& this.state.currentDate.end && (
								<CancelSvg onClick={this.clearDayPickerEnd} />
							)}
					</Flex>
				</Flex>
			</DateContainer>
		);
	}
}

DateRange.propTypes = {
	addComponent: types.funcRequired,
	removeComponent: types.funcRequired,
	updateQuery: types.funcRequired,
	watchComponent: types.funcRequired,
	selectedValue: types.selectedValue,
	// component props
	autoFocusEnd: types.bool,
	className: types.string,
	componentId: types.stringRequired,
	dataField: types.stringRequired,
	dayPickerInputProps: types.props,
	defaultSelected: types.dateObject,
	filterLabel: types.string,
	focused: types.bool,
	initialMonth: types.dateObject,
	innerClass: types.style,
	numberOfMonths: types.number,
	onQueryChange: types.func,
	placeholder: types.rangeLabels,
	queryFormat: types.queryFormatDate,
	react: types.react,
	showClear: types.bool,
	showFilter: types.bool,
	style: types.style,
	title: types.string,
};

DateRange.defaultProps = {
	autoFocusEnd: true,
	numberOfMonths: 2,
	placeholder: {
		start: 'Start date',
		end: 'End date',
	},
	showClear: true,
	showFilter: true,
};

const mapStateToProps = (state, props) => ({
	selectedValue: state.selectedValues[props.componentId]
		? state.selectedValues[props.componentId].value
		: null,
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	watchComponent: (component, react) =>
		dispatch(watchComponent(component, react)),
});

export default connect(mapStateToProps, mapDispatchtoProps)(DateRange);
