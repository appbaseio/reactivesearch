import React, { Component } from 'react';
import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryListener,
	setQueryOptions,
	setComponentProps,
	updateComponentProps,
} from '@appbaseio/reactivecore/lib/actions';
import hoistNonReactStatics from 'hoist-non-react-statics';
import {
	isEqual,
	checkValueChange,
	checkPropChange,
	getClassName,
	getOptionsFromQuery,
	formatDate,
	checkSomePropChange,
} from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';
import XDate from 'xdate';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { withTheme } from 'emotion-theming';

import DateContainer from '../../styles/DateContainer';
import Title from '../../styles/Title';
import Flex from '../../styles/Flex';
import { connect, getValidPropsKeys } from '../../utils';

import CancelSvg from '../shared/CancelSvg';

class DateRange extends Component {
	constructor(props) {
		super(props);

		let currentDate = props.defaultValue || props.value || null;
		if (props.selectedValue) {
			if (Array.isArray(props.selectedValue)) {
				currentDate = {
					start: new Date(props.selectedValue[0]),
					end: new Date(props.selectedValue[1]),
				};
			} else {
				const { start, end } = props.selectedValue;
				currentDate = {
					start: new Date(start),
					end: new Date(end),
				};
			}
		}

		this.state = {
			currentDate,
			dateHovered: null,
			startKey: 'on-start',
			endKey: 'on-end',
		};
		this.locked = false;
		const hasMounted = false;

		props.addComponent(props.componentId);
		props.setComponentProps(props.componentId, props);
		props.setQueryListener(props.componentId, props.onQueryChange, null);
		this.setReact(props);

		if (currentDate) {
			this.handleDateChange(currentDate, false, props, hasMounted);
		}
	}

	componentDidUpdate(prevProps) {
		checkSomePropChange(this.props, prevProps, getValidPropsKeys(this.props), () => {
			this.props.updateComponentProps(this.props.componentId, this.props);
		});
		checkPropChange(this.props.react, prevProps.react, () => this.setReact(this.props));

		if (!isEqual(this.props.value, prevProps.value)) {
			this.handleDateChange(this.props.value, false, this.props);
		} else {
			const { currentDate } = this.state;
			const { selectedValue } = this.props;
			// comparing array format of selectedValue with object form of the state if not null
			if (
				!isEqual(
					currentDate
						? [
							this.formatInputDate(currentDate.start),
							this.formatInputDate(currentDate.end),
						] // prettier-ignore
						: null,
					selectedValue,
				)
				&& !isEqual(prevProps.selectedValue, selectedValue)
			) {
				this.handleDateChange(
					selectedValue
						? {
							start: this.props.selectedValue[0] || '',
							end: this.props.selectedValue[1] || '',
						} // prettier-ignore
						: null,
					true,
					this.props,
				);
			}
		}

		checkSomePropChange(this.props, prevProps, ['dataField', 'nestedField'], () =>
			this.updateQuery(
				this.state.currentDate
					? {
						// we need the date in correct queryFormat
						start: formatDate(this.state.currentDate.start, this.props),
						end: formatDate(this.state.currentDate.end, this.props),
					} // prettier-ignore
					: this.state.currentDate,
				this.props,
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

	formatInputDate = (date) => {
		const xdate = new XDate(date);
		return xdate.valid() ? xdate.toString('yyyy-MM-dd') : '';
	};

	static defaultQuery = (value, props) => {
		let query = null;
		if (value) {
			if (Array.isArray(props.dataField) && props.dataField.length === 2) {
				query = {
					bool: {
						must: [
							{
								range: {
									[props.dataField[0]]: {
										lte: formatDate(new XDate(value.start), props),
									},
								},
							},
							{
								range: {
									[props.dataField[1]]: {
										gte: formatDate(new XDate(value.end), props),
									},
								},
							},
						],
					},
				};
			} else if (Array.isArray(props.dataField)) {
				query = {
					range: {
						[props.dataField[0]]: {
							gte: formatDate(new XDate(value.start), props),
							lte: formatDate(new XDate(value.end), props),
						},
					},
				};
			} else {
				query = {
					range: {
						[props.dataField]: {
							gte: formatDate(new XDate(value.start), props),
							lte: formatDate(new XDate(value.end), props),
						},
					},
				};
			}
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

	getEndDateRef = (ref) => {
		this.endDateRef = ref;
	};

	getStartDateRef = (ref) => {
		this.startDateRef = ref;
	};

	clearDayPickerStart = () => {
		if (this.state.currentDate && this.state.currentDate.start !== '') {
			const { value, onChange } = this.props;

			if (value === undefined) {
				this.handleStartDate('', false); // resets the day picker component
			} else if (onChange) {
				onChange({ start: '', end: this.state.currentDate.end });
			} else {
				// Since value prop is defined and onChange is not define
				// we keep the same date as in store
				this.setState({
					currentDate: this.state.currentDate,
				});
			}
		}
	};

	clearDayPickerEnd = () => {
		if (this.state.currentDate && this.state.currentDate.end !== '') {
			this.handleEndDate(''); // resets the day picker component
			const { value, onChange } = this.props;

			if (value === undefined) {
				this.handleEndDate('', false); // resets the day picker component
			} else if (onChange) {
				onChange({ start: this.state.currentDate.start, end: '' });
			} else {
				// Since value prop is defined and onChange is not define
				// we keep the same date as in store
				this.setState({
					currentDate: this.state.currentDate,
				});
			}
		}
	};

	handleStartDate = (date, autoFocus = true) => {
		const { currentDate } = this.state;
		const end = currentDate ? currentDate.end : '';
		const { value, onChange } = this.props;
		if (value === undefined) {
			if (this.startDateRef.getInput().value.length === 10) {
				this.handleDateChange({
					start: date,
					end,
				});
				// focus the end date DayPicker if its empty
				if (this.props.autoFocusEnd && autoFocus) {
					this.endDateRef.getInput().focus();
				}
			}
		} else if (onChange) {
			if (this.startDateRef.getInput().value.length === 10) {
				onChange({
					start: date,
					end,
				});
				// focus the end date DayPicker if its empty
				if (this.props.autoFocusEnd && autoFocus) {
					this.endDateRef.getInput().focus();
				}
			}
		} else {
			// this will trigger a remount on the date component
			// since DayPickerInput doesn't respect the controlled behavior setting on its own
			this.setState(state => ({
				startKey: state.startKey === 'on-start' ? 'off-start' : 'on-start',
			}));
		}
	};

	handleEndDate = (selectedDay) => {
		const { currentDate } = this.state;
		const { value, onChange } = this.props;
		const start = currentDate ? currentDate.start : '';

		if (value === undefined) {
			if (this.endDateRef.getInput().value.length === 10) {
				this.handleDayMouseEnter(selectedDay);
				this.handleDateChange({
					start: currentDate ? currentDate.start : '',
					end: selectedDay,
				});
			}
		} else if (onChange) {
			if (this.endDateRef.getInput().value.length === 10) {
				onChange({
					start,
					end: selectedDay,
				});
			}
		} else {
			// this will trigger a remount on the date component
			// since DayPickerInput doesn't respect the controlled behavior setting on its own
			this.setState(state => ({
				endKey: state.endKey === 'on-end' ? 'off-end' : 'on-end',
			}));
		}
	};

	handleDayMouseEnter = (day) => {
		this.setState({
			dateHovered: day,
		});
	};

	handleDateChange = (
		currentDate,
		isDefaultValue = false,
		props = this.props,
		hasMounted = true,
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
				}; // prettier-ignore
		}

		const performUpdate = () => {
			const handleUpdates = () => {
				this.updateQuery(value, props);
				this.locked = false;
				if (props.onValueChange) props.onValueChange(value);
			};

			if (hasMounted) {
				this.setState(
					{
						currentDate,
					},
					handleUpdates,
				);
			} else {
				handleUpdates();
			}
		};
		checkValueChange(props.componentId, value, props.beforeValueChange, performUpdate);
	};

	updateQuery = (value, props) => {
		if (!value || (value && value.start.length && value.end.length)) {
			const { customQuery } = props;
			let query = DateRange.defaultQuery(value, props);
			let customQueryOptions;
			if (customQuery) {
				const customQueryObject = customQuery(value, props);
				query = customQueryObject && customQueryObject.query;
				customQueryOptions = getOptionsFromQuery(customQuery(value, props));
			}
			props.setQueryOptions(props.componentId, customQueryOptions);
			props.updateQuery({
				componentId: props.componentId,
				query,
				value: value ? [value.start, value.end] : null,
				showFilter: props.showFilter,
				label: props.filterLabel,
				URLParams: props.URLParams,
				componentType: 'DATERANGE',
			});
		}
	};

	render() {
		const { currentDate, dateHovered } = this.state;
		const start = currentDate ? currentDate.start : '';
		const end = currentDate ? currentDate.end : '';
		const endDay = currentDate ? dateHovered : '';
		const selectedDays = [start, { from: start, to: endDay }];
		const modifiers = { start, end: endDay };
		return (
			<DateContainer
				range
				style={this.props.style}
				className={this.props.className}
				showBorder={!this.props.showClear}
			>
				{this.props.title && (
					<Title className={getClassName(this.props.innerClass, 'title') || null}>
						{this.props.title}
					</Title>
				)}
				<Flex className={getClassName(this.props.innerClass, 'input-container') || null}>
					<Flex
						flex={2}
						showBorder={this.props.showClear}
						iconPosition="right"
						style={{
							background: this.props.theme.colors.backgroundColor || 'transparent',
						}}
					>
						<DayPickerInput
							ref={this.getStartDateRef}
							showOverlay={this.props.focused}
							formatDate={this.formatInputDate}
							value={start}
							key={this.state.startKey}
							placeholder={this.props.placeholder.start}
							dayPickerProps={{
								numberOfMonths: this.props.numberOfMonths,
								initialMonth: this.props.initialMonth,
								disabledDays: {
									after: this.state.currentDate ? this.state.currentDate.end : '',
								},
								selectedDays,
								modifiers,
							}}
							onDayChange={this.handleStartDate}
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
					<Flex
						flex={2}
						showBorder={this.props.showClear}
						iconPosition="right"
						style={{
							background: this.props.theme.colors.backgroundColor || 'transparent',
						}}
					>
						<DayPickerInput
							ref={this.getEndDateRef}
							showOverlay={this.props.focused}
							formatDate={this.formatInputDate}
							value={end}
							key={this.state.endKey}
							placeholder={this.props.placeholder.end}
							dayPickerProps={{
								numberOfMonths: this.props.numberOfMonths,
								initialMonth: this.props.initialMonth,
								onDayMouseEnter: this.handleDayMouseEnter,
								disabledDays: {
									before: this.state.currentDate
										? this.state.currentDate.start
										: '',
								},
								selectedDays,
								modifiers,
							}}
							onDayChange={this.handleEndDate}
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
	setQueryListener: types.funcRequired,
	updateQuery: types.funcRequired,
	watchComponent: types.funcRequired,
	selectedValue: types.selectedValue,
	setQueryOptions: types.funcRequired,
	setComponentProps: types.funcRequired,
	updateComponentProps: types.funcRequired,
	// component props
	autoFocusEnd: types.bool,
	className: types.string,
	componentId: types.stringRequired,
	dataField: types.dataFieldArray,
	dayPickerInputProps: types.props,
	defaultValue: types.dateObject,
	value: types.dateObject,
	filterLabel: types.string,
	focused: types.bool,
	initialMonth: types.dateObject,
	innerClass: types.style,
	numberOfMonths: types.number,
	onQueryChange: types.func,
	onValueChange: types.func,
	onChange: types.func,
	placeholder: types.rangeLabels,
	nestedField: types.string,
	queryFormat: types.queryFormatDate,
	parseDate: types.func,
	react: types.react,
	showClear: types.bool,
	showFilter: types.bool,
	style: types.style,
	theme: types.style,
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
	queryFormat: 'epoch_millis',
};

const mapStateToProps = (state, props) => ({
	selectedValue: state.selectedValues[props.componentId]
		? state.selectedValues[props.componentId].value
		: null,
});

const mapDispatchtoProps = dispatch => ({
	setComponentProps: (component, options) => dispatch(setComponentProps(component, options)),
	updateComponentProps: (component, options) =>
		dispatch(updateComponentProps(component, options)),
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	setQueryListener: (component, onQueryChange, beforeQueryChange) =>
		dispatch(setQueryListener(component, onQueryChange, beforeQueryChange)),
	setQueryOptions: (component, props) => dispatch(setQueryOptions(component, props)),
});

const ConnectedComponent = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(withTheme(props => <DateRange ref={props.myForwardedRef} {...props} />));

// eslint-disable-next-line
const ForwardRefComponent = React.forwardRef((props, ref) => (
	<ConnectedComponent {...props} myForwardedRef={ref} />
));
hoistNonReactStatics(ForwardRefComponent, DateRange);

ForwardRefComponent.name = 'DateRange';
export default ForwardRefComponent;
