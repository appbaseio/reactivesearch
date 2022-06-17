import React, { Component } from 'react';
import types from '@appbaseio/reactivecore/lib/utils/types';
import {
	isEqual,
	getClassName,
	isValidDateRangeQueryFormat,
} from '@appbaseio/reactivecore/lib/utils/helper';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { oneOf } from 'prop-types';
import dateFormats from '@appbaseio/reactivecore/lib/utils/dateFormats';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import XDate from 'xdate';
import RangeSlider from './RangeSlider';
import Input from '../../styles/Input';
import Flex from '../../styles/Flex';
import Content from '../../styles/Content';
import Container from '../../styles/Container';

import {
	connect,
	formatDateString,
	getNumericRangeArray,
	getNumericRangeValue,
	getValueArrayWithinLimits,
} from '../../utils';
import DateContainer from '../../styles/DateContainer';
import PreferencesConsumer from '../basic/PreferencesConsumer';

const DATE_FORMAT = 'yyyy-MM-dd';
class RangeInput extends Component {
	constructor(props) {
		super(props);

		const { queryFormat, range } = props;
		if (queryFormat) {
			if (!isValidDateRangeQueryFormat(queryFormat)) {
				throw new Error('queryFormat is not supported. Try with a valid queryFormat.');
			}
			if (!XDate(range.start).valid() || !XDate(range.end).valid()) {
				throw new Error(
					'`reactivesearch` uses XDate for processing date-types, Try passing valid value(s) accepted by the XDate constructor. XDate ref: https://arshaw.com/xdate/#Parsing',
				);
			}
		} else if (typeof range.start !== 'number' || typeof range.end !== 'number') {
			throw new Error(
				'`RangeSlider` expects numerics, strings/ objects(date) are exception when dealing with date-types. Provide a valid queryFormat if you intend to use date-types.',
			);
		}

		let value = props.value || props.defaultValue || props.range;
		if (props.selectedValue) {
			value = {
				start: props.selectedValue[0],
				end: props.selectedValue[1],
			};
		}
		if (!this.shouldUpdate(value)) {
			// assign the range if not valid
			value = props.range;
		}
		const [start, end] = getValueArrayWithinLimits(
			getNumericRangeArray(value, props.queryFormat),
			getNumericRangeArray(props.range, props.queryFormat),
		);

		this.state = {
			start,
			end,
			isStartValid: true,
			isEndValid: true,
			// specific to date-range-inputs
			dateHovered: null,
			startKey: 'on-start',
			endKey: 'on-end',
		};
	}

	componentDidMount() {
		const { enableAppbase, index } = this.props;
		if (!enableAppbase && index) {
			console.warn(
				'Warning(ReactiveSearch): In order to use the `index` prop, the `enableAppbase` prop must be set to true in `ReactiveBase`.',
			);
		}
	}
	componentDidUpdate(prevProps) {
		const prevValue
			= prevProps.queryFormat && prevProps.value
				? getNumericRangeArray(prevProps.value, prevProps.queryFormat)
				: null;
		const currentValue
			= this.props.queryFormat && this.props.value
				? getNumericRangeArray(this.props.value, this.props.queryFormat)
				: null;
		if (!isEqual(prevValue, currentValue)) {
			this.handleSlider(this.props.value);
		}
	}

	// for SSR
	static defaultQuery = RangeSlider.defaultQuery;
	static parseValue = RangeSlider.parseValue;

	handleInputChange = (e) => {
		const { name, value } = e.target;
		const parsedValue = getNumericRangeValue(value, !!this.props.queryFormat);
		if (Number.isNaN(parsedValue)) {
			// set errors for invalid inputs
			if (name === 'start') {
				this.setState({
					isStartValid: false,
				});
			} else {
				this.setState({
					isEndValid: false,
				});
			}
		} else {
			// reset error states for valid inputs
			// eslint-disable-next-line
			if (name === 'start' && !this.state.isStartValid) {
				this.setState({
					isStartValid: true,
				});
			} else if (name === 'end' && !this.state.isEndValid) {
				this.setState({
					isEndValid: true,
				});
			}
		}

		const currentValue = {
			...this.value,
			[name]: parsedValue,
		};
		const { value: valueProp, onChange } = this.props;
		if (this.shouldUpdate(currentValue)) {
			if (valueProp === undefined) {
				this.setState({
					[name]: parsedValue,
				});
			} else if (onChange) {
				onChange(currentValue);
			}
		}
	};

	get isControlled() {
		return !!(this.props.value && this.props.onChange);
	}

	get value() {
		const [valueStart, valueEnd] = this.isControlled
			? getNumericRangeArray(this.props.value, this.props.queryFormat)
			: [this.state.start, this.state.end];
		return {
			start: valueStart,
			end: valueEnd,
		};
	}

	shouldUpdate = (value = {}) => {
		const { validateRange } = this.props;
		if (validateRange) {
			return validateRange([value.start, value.end]);
		}
		return true;
	};

	handleSliderChange = (sliderValue) => {
		const [start, end] = sliderValue || [this.props.range.start, this.props.range.end];
		const { value, onChange } = this.props;

		if (value === undefined) {
			this.handleSlider({ start, end });
		} else if (onChange) {
			onChange({ start, end });
		}
	};

	handleSlider = (value) => {
		const [start, end] = getNumericRangeArray(value, this.props.queryFormat);
		if (!this.isControlled) {
			this.setState({
				// we store only numeric
				start,
				end,
			});
		}
		if (this.props.onValueChange) {
			this.props.onValueChange({
				// returning a dateobject in case of date-type usage
				// else return the numeric, which is the default type
				start: this.props.queryFormat ? new Date(start) : start,
				end: this.props.queryFormat ? new Date(end) : end,
			});
		}
	};
	displayNumericInputs() {
		return (
			<Flex className={getClassName(this.props.innerClass, 'input-container') || null}>
				<Flex direction="column" flex={2}>
					<Input
						name="start"
						type="number"
						value={this.value.start}
						step={this.props.stepValue}
						max={this.value.end}
						alert={!this.state.isStartValid}
						onChange={this.handleInputChange}
						className={getClassName(this.props.innerClass, 'input') || null}
						themePreset={this.props.themePreset}
						aria-label={`${this.props.componentId}-start-input`}
					/>
					{!this.state.isStartValid && <Content alert>Input range is invalid</Content>}
				</Flex>
				<Flex justifyContent="center" alignItems="center" flex={1}>
					-
				</Flex>
				<Flex direction="column" flex={2}>
					<Input
						name="end"
						type="number"
						value={this.value.end}
						step={this.props.stepValue}
						min={this.value.start}
						alert={!this.state.isEndValid}
						onChange={this.handleInputChange}
						className={getClassName(this.props.innerClass, 'input') || null}
						themePreset={this.props.themePreset}
						aria-label={`${this.props.componentId}-end-input`}
					/>
					{!this.state.isEndValid && <Content alert>Input range is invalid</Content>}
				</Flex>
			</Flex>
		);
	}

	/* START: handling for date range input */

	getEndDateRef = (ref) => {
		this.endDateRef = ref;
	};

	getStartDateRef = (ref) => {
		this.startDateRef = ref;
	};

	handleStartDate = (date, autoFocus = true) => {
		const { end: currentDateEnd } = this.state;
		const end = currentDateEnd || '';
		const { value, onChange } = this.props;
		if ((!value || (value && !value.start)) && !onChange) {
			if (this.startDateRef.getInput().value.length === 10) {
				this.setState(state => ({
					startKey: state.startKey === 'on-start' ? 'off-start' : 'on-start',
					start: getValueArrayWithinLimits(
						[XDate(date).getTime(), end],
						getNumericRangeArray(this.props.range, this.props.queryFormat),
					)[0],
					end,
				}));
				// focus the end date DayPicker if its empty
				if (autoFocus) {
					this.endDateRef.getInput().focus();
				}
			}
		} else if (onChange) {
			if (this.startDateRef.getInput().value.length === 10) {
				onChange({
					start: getValueArrayWithinLimits(
						[XDate(date).getTime(), currentDateEnd],
						getNumericRangeArray(this.props.range, this.props.queryFormat),
					)[0],
					...(end && XDate(end).valid() ? { end: new Date(end) } : {}),
				});
				// focus the end date DayPicker if its empty
				if (autoFocus) {
					this.endDateRef.getInput().focus();
				}
				// this will trigger a remount on the date component
				// since DayPickerInput doesn't respect the controlled behavior setting on its own
				this.setState(state => ({
					startKey: state.startKey === 'on-start' ? 'off-start' : 'on-start',
				}));
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
		const { start: currentDateStart } = this.state;
		const { value, onChange } = this.props;
		const start = currentDateStart || '';

		if ((value === undefined || (value && !value.end)) && !onChange) {
			if (this.endDateRef.getInput().value.length === 10) {
				this.handleDayMouseEnter(selectedDay);
				this.setState(state => ({
					endKey: state.endKey === 'on-end' ? 'off-end' : 'on-end',
					start,
					end: getValueArrayWithinLimits(
						[start, XDate(selectedDay).getTime()],
						getNumericRangeArray(this.props.range, this.props.queryFormat),
					)[1],
				}));
			}
		} else if (onChange) {
			if (this.endDateRef.getInput().value.length === 10) {
				onChange({
					...(start && new XDate(start).valid() ? { start: new XDate(start) } : {}),
					end: getValueArrayWithinLimits(
						[currentDateStart, XDate(selectedDay).getTime()],
						getNumericRangeArray(this.props.range, this.props.queryFormat),
					)[1],
				});
			}
			// this will trigger a remount on the date component
			// since DayPickerInput doesn't respect the controlled behavior setting on its own
			this.setState(state => ({
				endKey: state.endKey === 'on-end' ? 'off-end' : 'on-end',
			}));
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
			dateHovered: day, // date hovered is stored as is, in date object format
		});
	};

	displayDateInputs() {
		const { start, end, dateHovered } = this.state;
		const startDate = XDate(start) || '';
		const endDate = XDate(end) || '';
		const endDay = start && end ? dateHovered : '';
		const selectedDays = { from: startDate, to: endDay };
		const modifiers = { start: new Date(start), end: endDay };
		return (
			<DateContainer range>
				<Flex className={getClassName(this.props.innerClass, 'input-container') || null}>
					<Flex
						flex={2}
						iconPosition="right"
						showBorder
						style={{
							background: 'transparent',
						}}
					>
						<DayPickerInput
							ref={this.getStartDateRef}
							formatDate={date => formatDateString(date, DATE_FORMAT)}
							value={formatDateString(startDate, DATE_FORMAT)}
							key={this.state.startKey}
							placeholder="yyyy-MM-dd"
							dayPickerProps={{
								initialMonth: new XDate(this.state.start || ''),
								numberOfMonths: 2,
								disabledDays: {
									before:
										(this.props.range.start && XDate(this.props.range.start))
										|| '',
									after:
										(this.props.range.end && XDate(this.props.range.end)) || '',
								},
								selectedDays,
								modifiers,
							}}
							inputProps={{
								'aria-label': `${this.props.componentId}-start-input`,
							}}
							onDayChange={this.handleStartDate}
							classNames={{
								container: 'DayPickerInput',
								overlayWrapper: 'DayPickerInput-OverlayWrapper',
								overlay: 'DayPickerInput-Overlay',
							}}
						/>
					</Flex>
					<Flex justifyContent="center" alignItems="center" basis="20px">
						-
					</Flex>
					<Flex
						flex={2}
						iconPosition="right"
						showBorder
						style={{
							background: 'transparent',
						}}
					>
						<DayPickerInput
							ref={this.getEndDateRef}
							formatDate={date => formatDateString(date, DATE_FORMAT)}
							value={formatDateString(endDate, DATE_FORMAT)}
							key={this.state.endKey}
							placeholder="yyyy-MM-dd"
							dayPickerProps={{
								initialMonth: new XDate(this.state.end || ''),
								numberOfMonths: 2,
								onDayMouseEnter: this.handleDayMouseEnter,
								disabledDays: {
									after:
										(this.props.range.end && XDate(this.props.range.end)) || '',
									before:
										(this.props.range.start && XDate(this.props.range.start))
										|| '',
								},
								selectedDays,
								modifiers,
							}}
							inputProps={{
								'aria-label': `${this.props.componentId}-end-input`,
							}}
							onDayChange={this.handleEndDate}
							classNames={{
								container: 'DayPickerInput',
								overlayWrapper: 'DayPickerInput-OverlayWrapper',
								overlay: 'DayPickerInput-Overlay',
							}}
						/>
					</Flex>
				</Flex>
			</DateContainer>
		);
	}
	/* END: handling for date range input */

	render() {
		const { className, style, ...rest } = this.props;
		const [rangeStart, rangeEnd] = getNumericRangeArray(
			this.props.range,
			this.props.queryFormat,
		);
		const computeSliderRangeValues = {
			...(this.props.queryFormat
				? { start: new XDate(rangeStart), end: new XDate(rangeEnd) }
				: this.props.range),
		};

		return (
			<Container style={style} className={className}>
				<RangeSlider
					{...rest}
					value={{
						start: this.state.isStartValid ? +this.value.start : rangeStart,
						end: this.state.isEndValid ? +this.value.end : rangeEnd,
					}}
					onChange={this.handleSliderChange}
					className={getClassName(this.props.innerClass, 'slider-container') || null}
					range={computeSliderRangeValues}
					_dateFormat={DATE_FORMAT}
				/>
				{isValidDateRangeQueryFormat(this.props.queryFormat)
					? this.displayDateInputs()
					: this.displayNumericInputs()}
			</Container>
		);
	}
}

RangeInput.propTypes = {
	className: types.string,
	defaultValue: types.range,
	validateRange: types.func,
	value: types.range,
	selectedValue: types.selectedValue,
	innerClass: types.style,
	onValueChange: types.func,
	onChange: types.func,
	range: types.range,
	stepValue: types.number,
	style: types.style,
	themePreset: types.themePreset,
	componentId: types.stringRequired,
	includeNullValues: types.bool,
	enableAppbase: types.bool,
	index: types.string,
	queryFormat: oneOf([...Object.keys(dateFormats)]),
	calendarInterval: types.calendarInterval,
};

RangeInput.defaultProps = {
	range: {
		start: 0,
		end: 10,
	},
	stepValue: 1,
	includeNullValues: false,
};

const mapStateToProps = (state, props) => ({
	themePreset: state.config.themePreset,
	selectedValue: state.selectedValues[props.componentId]
		? state.selectedValues[props.componentId].value
		: null,
	enableAppbase: state.config.enableAppbase,
});

const ConnectedComponent = connect(
	mapStateToProps,
	null,
)(props => <RangeInput ref={props.myForwardedRef} {...props} />);

// eslint-disable-next-line
const ForwardRefComponent = React.forwardRef((props, ref) => (
	<PreferencesConsumer userProps={props}>
		{preferenceProps => <ConnectedComponent {...preferenceProps} myForwardedRef={ref} />}
	</PreferencesConsumer>
));
hoistNonReactStatics(ForwardRefComponent, RangeInput);

ForwardRefComponent.displayName = 'RangeInput';
export default ForwardRefComponent;
