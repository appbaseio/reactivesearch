import React, { Component } from 'react';
import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryListener,
} from '@appbaseio/reactivecore/lib/actions';
import {
	isEqual,
	checkValueChange,
	checkPropChange,
	getClassName,
	formatDate,
} from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';
import XDate from 'xdate';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { withTheme } from 'emotion-theming';

import DateContainer from '../../styles/DateContainer';
import Title from '../../styles/Title';
import Flex from '../../styles/Flex';
import CancelSvg from '../shared/CancelSvg';
import { connect } from '../../utils';

class DatePicker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentDate: '',
		};
		this.locked = false;
		props.setQueryListener(props.componentId, props.onQueryChange, null);
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
		checkPropChange(this.props.react, nextProps.react, () => this.setReact(nextProps));
		checkPropChange(this.props.dataField, nextProps.dataField, () =>
			this.updateQuery(
				this.state.currentDate ? this.formatInputDate(this.state.currentDate) : null,
				nextProps,
			),
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

	formatInputDate = date => new XDate(date).toString('yyyy-MM-dd');

	static defaultQuery = (value, props) => {
		let query = null;
		if (value) {
			query = {
				range: {
					[props.dataField]: {
						gte: formatDate(new XDate(value).addHours(-24), props),
						lte: formatDate(new XDate(value), props),
					},
				},
			};
		}

		if (query && props.nestedField) {
			return {
				query: {
					nested: {
						path: props.nestedField,
						query,
					},
				},
			};
		}
		return query;
	};

	clearDayPicker = () => {
		if (this.state.currentDate !== '') {
			this.setState({
				currentDate: '',
			});
		}
	};

	handleDayPicker = (selectedDay, modifiers, dayPickerInput) => {
		// Check no of characters in input and than fire the query
		if (dayPickerInput.getInput().value.length === 10) {
			this.handleDateChange(selectedDay || '');
		}
	};

	handleDateChange = (currentDate, isDefaultValue = false, props = this.props) => {
		// currentDate should be valid or empty string for resetting the query
		if (isDefaultValue && !new XDate(currentDate).valid() && currentDate.length) {
			console.error(`DatePicker: ${props.componentId} invalid value passed for date`);
		} else {
			// ignore state updates when component is locked
			if (props.beforeValueChange && this.locked) {
				return;
			}

			this.locked = true;
			let value = null;
			if (currentDate) {
				value = isDefaultValue ? currentDate : this.formatInputDate(currentDate);
			}

			const performUpdate = () => {
				this.setState(
					{
						currentDate,
					},
					() => {
						this.updateQuery(value, props);
						this.locked = false;
						if (props.onValueChange) props.onValueChange(value);
					},
				);
			};
			checkValueChange(props.componentId, value, props.beforeValueChange, performUpdate);
		}
	};

	updateQuery = (value, props) => {
		const query = props.customQuery || DatePicker.defaultQuery;

		props.updateQuery({
			componentId: props.componentId,
			query: query(value, props),
			value,
			showFilter: props.showFilter,
			label: props.filterLabel,
			URLParams: props.URLParams,
			componentType: 'DATEPICKER',
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
					<Title className={getClassName(this.props.innerClass, 'title') || null}>
						{this.props.title}
					</Title>
				)}
				<Flex
					showBorder={this.props.showClear}
					iconPosition="right"
					style={{
						background: this.props.theme.colors.backgroundColor || 'transparent',
					}}
				>
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
						classNames={{
							container:
								getClassName(this.props.innerClass, 'daypicker-container')
								|| 'DayPickerInput',
							overlayWrapper:
								getClassName(this.props.innerClass, 'daypicker-overlay-wrapper')
								|| 'DayPickerInput-OverlayWrapper',
							overlay:
								getClassName(this.props.innerClass, 'daypicker-overlay')
								|| 'DayPickerInput-Overlay',
						}}
						{...this.props.dayPickerInputProps}
					/>
					{this.props.showClear && this.state.currentDate && (
						<CancelSvg onClick={this.clearDayPicker} />
					)}
				</Flex>
			</DateContainer>
		);
	}
}

DatePicker.propTypes = {
	addComponent: types.funcRequired,
	removeComponent: types.funcRequired,
	setQueryListener: types.funcRequired,
	updateQuery: types.funcRequired,
	watchComponent: types.funcRequired,
	selectedValue: types.selectedValue,
	// component props
	className: types.string,
	clickUnselectsDay: types.bool,
	componentId: types.stringRequired,
	dataField: types.stringRequired,
	dayPickerInputProps: types.props,
	defaultSelected: types.date,
	filterLabel: types.string,
	focused: types.bool,
	initialMonth: types.dateObject,
	innerClass: types.style,
	nestedField: types.string,
	numberOfMonths: types.number,
	onQueryChange: types.func,
	parseDate: types.func,
	placeholder: types.string,
	queryFormat: types.queryFormatDate,
	react: types.react,
	showClear: types.bool,
	showFilter: types.bool,
	style: types.style,
	theme: types.style,
	title: types.string,
};

DatePicker.defaultProps = {
	clickUnselectsDay: true,
	numberOfMonths: 1,
	placeholder: 'Select Date',
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
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	setQueryListener: (component, onQueryChange, beforeQueryChange) =>
		dispatch(setQueryListener(component, onQueryChange, beforeQueryChange)),
});

export default connect(
	mapStateToProps,
	mapDispatchtoProps,
)(withTheme(DatePicker));
