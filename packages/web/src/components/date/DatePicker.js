import React, { Component } from 'react';
import { updateQuery, setQueryOptions, setCustomQuery } from '@appbaseio/reactivecore/lib/actions';
import hoistNonReactStatics from 'hoist-non-react-statics';
import {
	isEqual,
	checkValueChange,
	checkSomePropChange,
	getClassName,
	formatDate,
	getOptionsFromQuery,
	updateCustomQuery,
	unwrapToNativeDate,
} from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import dayjs from 'dayjs';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { withTheme } from 'emotion-theming';

import DateContainer from '../../styles/DateContainer';
import Title from '../../styles/Title';
import Flex from '../../styles/Flex';
import CancelSvg from '../shared/CancelSvg';
import { connect } from '../../utils';
import PreferencesConsumer from '../basic/PreferencesConsumer';
import ComponentWrapper from '../basic/ComponentWrapper';

class DatePicker extends Component {
	constructor(props) {
		super(props);

		const currentDate = props.selectedValue || props.value || props.defaultValue || '';
		this.state = {
			currentDate,
			key: 'on',
		};

		// Set custom query in store
		updateCustomQuery(props.componentId, props, currentDate);
		const hasMounted = false;

		if (currentDate) {
			this.handleDateChange(currentDate, true, props, hasMounted);
		}
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
		checkSomePropChange(this.props, prevProps, ['dataField', 'nestedField', 'aggregationSize'], () =>
			this.updateQuery(
				this.state.currentDate ? this.formatInputDate(this.state.currentDate) : null,
				this.props,
			),
		);

		if (!isEqual(this.props.value, prevProps.value)) {
			this.handleDateChange(this.props.value, true, this.props);
		} else if (
			!isEqual(this.formatInputDate(this.state.currentDate), this.props.selectedValue)
			&& !isEqual(this.props.selectedValue, prevProps.selectedValue)
		) {
			this.handleDateChange(this.props.selectedValue || '', true, this.props);
		}
	}

	formatInputDate = date => dayjs(new Date((date))).format('YYYY-MM-DD');

	static defaultQuery = (value, props) => {
		let query = null;
		if (value && props.queryFormat) {
			query = {
				range: {
					[props.dataField]: {
						gte: formatDate(dayjs(new Date((value))).subtract(24, 'hour'), props),
						lte: formatDate(dayjs(new Date((value))), props),
					},
				},
			};
		}

		if (query && props.nestedField) {
			return {
				nested: {
					path: props.nestedField,
					query,
				},
			};
		}

		return query;
	};

	clearDayPicker = () => {
		if (this.state.currentDate !== '') {
			const { value, onChange } = this.props;

			if (value === undefined) {
				this.setState({
					currentDate: '',
				});
			} else if (onChange) {
				onChange('');
			} else {
				// Since value prop is defined and onChange is not define
				// we keep the same date as in store
				this.setState({
					currentDate: this.state.currentDate,
				});
			}
		}
	};

	handleDayPicker = (selectedDay, _, dayPickerInput) => {
		const { value, onChange } = this.props;

		if (value === undefined) {
			if (dayPickerInput.getInput().value.length === 10) {
				this.handleDateChange(selectedDay || '');
			}
		} else if (onChange) {
			if (dayPickerInput.getInput().value.length === 10) {
				onChange(selectedDay || '');
			}
		} else {
			// this will trigger a remount on the date component
			// since DayPickerInput doesn't respect the controlled behavior setting on its own
			this.setState(state => ({
				key: state.key === 'on' ? 'off' : 'on',
			}));
		}
	};

	handleDateChange = (
		currentDate,
		isDefaultValue = false,
		props = this.props,
		hasMounted = true,
	) => {
		// currentDate should be valid or empty string for resetting the query
		if (isDefaultValue && !dayjs(new Date((currentDate))).isValid() && currentDate.length) {
			console.error(`DatePicker: ${props.componentId} invalid value passed for date`);
		} else {
			let value = null;
			if (currentDate) {
				value = isDefaultValue ? currentDate : this.formatInputDate(currentDate);
			}

			const performUpdate = () => {
				const handleUpdates = () => {
					this.updateQuery(value, props);
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
		}
	};

	updateQuery = (value, props) => {
		const { customQuery } = props;
		let query = DatePicker.defaultQuery(value, props);
		let customQueryOptions;
		if (customQuery) {
			({ query } = customQuery(value, props) || {});
			customQueryOptions = getOptionsFromQuery(customQuery(value, props));
			updateCustomQuery(props.componentId, props, value);
		}
		props.setQueryOptions(props.componentId, customQueryOptions);
		props.updateQuery({
			componentId: props.componentId,
			query,
			value,
			showFilter: props.showFilter,
			label: props.filterLabel,
			URLParams: props.URLParams,
			componentType: componentTypes.datePicker,
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
						value={unwrapToNativeDate(this.state.currentDate)}
						placeholder={this.props.placeholder}
						dayPickerProps={{
							numberOfMonths: this.props.numberOfMonths,
							initialMonth: this.props.initialMonth,
						}}
						inputProps={{
							'aria-label': `${this.props.componentId}-input`,
						}}
						key={this.state.key}
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
	updateQuery: types.funcRequired,
	selectedValue: types.selectedValue,
	setQueryOptions: types.funcRequired,
	setCustomQuery: types.funcRequired,
	enableAppbase: types.bool,
	// component props
	className: types.string,
	clickUnselectsDay: types.bool,
	componentId: types.stringRequired,
	dataField: types.stringRequired,
	dayPickerInputProps: types.props,
	defaultValue: types.date,
	value: types.date,
	filterLabel: types.string,
	focused: types.bool,
	initialMonth: types.dateObject,
	innerClass: types.style,
	numberOfMonths: types.number,
	onQueryChange: types.func,
	onValueChange: types.func,
	onChange: types.func,
	placeholder: types.string,
	parseDate: types.func,
	nestedField: types.string,
	queryFormat: types.queryFormatDate,
	react: types.react,
	showClear: types.bool,
	showFilter: types.bool,
	style: types.style,
	theme: types.style,
	title: types.string,
	index: types.string,
	endpoint: types.endpoint,
};

DatePicker.defaultProps = {
	clickUnselectsDay: true,
	numberOfMonths: 1,
	placeholder: 'Select Date',
	showClear: true,
	showFilter: true,
	queryFormat: 'epoch_millis',
};

// Add componentType for SSR
DatePicker.componentType = componentTypes.datePicker;

const mapStateToProps = (state, props) => ({
	selectedValue: state.selectedValues[props.componentId]
		? state.selectedValues[props.componentId].value
		: null,
	enableAppbase: state.config.enableAppbase,
});

const mapDispatchtoProps = dispatch => ({
	setCustomQuery: (component, query) => dispatch(setCustomQuery(component, query)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	setQueryOptions: (component, props) => dispatch(setQueryOptions(component, props)),
});

const ConnectedComponent = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(withTheme(props => <DatePicker ref={props.myForwardedRef} {...props} />));

// eslint-disable-next-line
const ForwardRefComponent = React.forwardRef((props, ref) => (
	<PreferencesConsumer userProps={props}>
		{preferenceProps => (
			<ComponentWrapper
				{...preferenceProps}
				internalComponent
				componentType={componentTypes.datePicker}
			>
				{
					componentProps =>
						(<ConnectedComponent
							{...preferenceProps}
							{...componentProps}
							myForwardedRef={ref}
						/>)
				}
			</ComponentWrapper>
		)}
	</PreferencesConsumer>
));
hoistNonReactStatics(ForwardRefComponent, DatePicker);

ForwardRefComponent.displayName = 'DatePicker';
export default ForwardRefComponent;
