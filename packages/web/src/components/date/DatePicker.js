import React, { Component } from 'react';
import { connect } from 'react-redux';
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
import CancelSvg from '../shared/CancelSvg';

class DatePicker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentDate: '',
		};
	}

	componentWillMount() {
		this.props.addComponent(this.props.componentId);
		this.setReact(this.props);

		if (this.props.selectedValue) {
			this.handleDateChange(this.props.selectedValue, true);
		} else if (this.props.defaultSelected) {
			this.handleDateChange(this.props.defaultSelected, true);
		}
	}

	componentWillReceiveProps(nextProps) {
		checkPropChange(
			this.props.react,
			nextProps.react,
			() => this.setReact(nextProps),
		);
		if (!isEqual(this.props.defaultSelected, nextProps.defaultSelected)) {
			this.handleDateChange(nextProps.defaultSelected, true, nextProps);
		} else if (
			!isEqual(this.formatInputDate(this.state.currentDate), nextProps.selectedValue)
			&& !isEqual(this.props.selectedValue, nextProps.selectedValue)
		) {
			this.handleDateChange(nextProps.selectedValue || '', true, nextProps);
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

	formatInputDate = date => new XDate(date).toString('yyyy-MM-dd');

	defaultQuery = (value, props) => {
		let query = null;
		if (value && props.queryFormat) {
			query = {
				range: {
					[props.dataField]: {
						gte: this.formatDate(new XDate(value).addHours(-24), props),
						lte: this.formatDate(new XDate(value), props),
					},
				},
			};
		}
		return query;
	};

	clearDayPicker = () => {
		if (this.state.currentDate !== '') {
			this.handleDateChange('');	// resets the day picker component
		}
	}

	handleDayPicker = (date) => {
		this.handleDateChange(date || '');
	}

	handleDateChange = (
		currentDate,
		isDefaultValue = false,
		props = this.props,
	) => {
		// currentDate should be valid or empty string for resetting the query
		if (isDefaultValue && !new XDate(currentDate).valid() && currentDate.length) {
			console.error(`DatePicker: ${props.componentId} invalid value passed for date`);
		} else {
			let value = null;
			if (currentDate) {
				value = isDefaultValue ? currentDate : this.formatInputDate(currentDate);
			}

			const performUpdate = () => {
				this.setState({
					currentDate,
				}, () => {
					this.updateQuery(value, props);
				});
			};
			checkValueChange(
				props.componentId,
				value,
				props.beforeValueChange,
				props.onValueChange,
				performUpdate,
			);
		}
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
			showFilter: props.showFilter,
			label: props.filterLabel,
			onQueryChange,
			URLParams: props.URLParams,
		});
	};

	render() {
		return (
			<DateContainer
				showBorder={!this.props.showClear}
				style={this.props.style}
				className={this.props.className}
			>
				{this.props.title && (
					<Title
						className={getClassName(this.props.innerClass, 'title') || null}
					>
						{this.props.title}
					</Title>
				)}
				<Flex showBorder={this.props.showClear} iconPosition="right">
					<DayPickerInput
						showOverlay={this.props.focused}
						formatDate={this.formatInputDate}
						value={this.state.currentDate}
						placeholder={this.props.placeholder}
						dayPickerProps={{
							numberOfMonths: this.props.numberOfMonths,
							initialMonth: this.props.initialMonth,
						}}
						clickUnselectsDay={this.props.clickUnselectsDay}
						onDayChange={this.handleDayPicker}
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
					{
						this.props.showClear && this.state.currentDate
						&& <CancelSvg onClick={this.clearDayPicker} />
					}
				</Flex>
			</DateContainer>
		);
	}
}

DatePicker.propTypes = {
	addComponent: types.funcRequired,
	componentId: types.stringRequired,
	defaultSelected: types.date,
	react: types.react,
	removeComponent: types.funcRequired,
	queryFormat: types.queryFormatDate,
	selectedValue: types.selectedValue,
	placeholder: types.string,
	focused: types.bool,
	innerClass: types.style,
	title: types.string,
	style: types.style,
	className: types.string,
	numberOfMonths: types.number,
	initialMonth: types.dateObject,
	dayPickerInputProps: types.props,
	showFilter: types.bool,
	filterLabel: types.string,
	showClear: types.bool,
	clickUnselectsDay: types.bool,
};

DatePicker.defaultProps = {
	placeholder: 'Select Date',
	numberOfMonths: 1,
	showFilter: true,
	showClear: true,
	clickUnselectsDay: true,
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
