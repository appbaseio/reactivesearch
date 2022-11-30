/** @jsx jsx */
import { jsx } from '@emotion/core';


import React, { Component } from 'react';
import XDate from 'xdate';
import {
	updateQuery,
	setQueryOptions,
	setCustomQuery,
	updateComponentProps,
} from '@appbaseio/reactivecore/lib/actions';
import hoistNonReactStatics from 'hoist-non-react-statics';
import {
	isEqual,
	checkValueChange,
	checkPropChange,
	checkSomePropChange,
	getClassName,
	getOptionsFromQuery,
	updateCustomQuery,
	isValidDateRangeQueryFormat,
	queryFormatMillisecondsMap,
	getCalendarIntervalErrorMessage,
} from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';
import Rheostat from '@appbaseio/rheostat/lib/Slider';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import { getInternalComponentID } from '@appbaseio/reactivecore/lib/utils/transform';
import { oneOf } from 'prop-types';
import dateFormats from '@appbaseio/reactivecore/lib/utils/dateFormats';
import HistogramContainer from './addons/HistogramContainer';
import RangeLabel from './addons/RangeLabel';
import SliderHandle from './addons/SliderHandle';
import Slider from '../../styles/Slider';
import Title from '../../styles/Title';
import { rangeLabelsContainer } from '../../styles/Label';
import {
	connect,
	formatDateString,
	getNumericRangeArray,
	getRangeQueryWithNullValues,
	getValueArrayWithinLimits,
} from '../../utils';
import PreferencesConsumer from '../basic/PreferencesConsumer';
import ComponentWrapper from '../basic/ComponentWrapper';

class RangeSlider extends Component {
	constructor(props) {
		super(props);
		const {
			selectedValue, defaultValue, value, range, queryFormat,
		} = props;

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
		const valueToParse = selectedValue || value || defaultValue;
		let currentValue = RangeSlider.parseValue(valueToParse, props);
		if (!this.shouldUpdate(currentValue)) {
			// the standard way to deal with internal state is using numerics
			// to  avoid complications as date type can be an object, string, numeric, etc.
			// thus we convert it to numeric as a standard
			currentValue = getNumericRangeArray(props.range, props.queryFormat);
		}
		const inRangeValueArray = getValueArrayWithinLimits(
			currentValue,
			getNumericRangeArray(props.range, props.queryFormat),
		);
		this.state = {
			currentValue: inRangeValueArray,
			stats: [],
			dateFormat: props._dateFormat || "yyyy-MM-dd'T'HH:mm:ss",
		};

		this.internalComponent = getInternalComponentID(props.componentId);
		// Set custom query in store
		updateCustomQuery(props.componentId, props, currentValue);

		this.updateQueryOptions(props);
		const hasMounted = false;
		if (currentValue) {
			this.handleChange(inRangeValueArray, props, hasMounted);
		}

		props.updateComponentProps(
			props.componentId,
			{
				...props,
				...(props.range && !props.calendarInterval && props.queryFormat
					? {
						calendarInterval: getCalendarIntervalErrorMessage(
							inRangeValueArray[1] - inRangeValueArray[0],
						).calculatedCalendarInterval,
					  }
					: {}),
			},
			componentTypes.rangeSlider,
		);
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
		checkSomePropChange(
			this.props,
			prevProps,
			['showHistogram', 'interval', 'range', 'calendarInterval'],
			() => this.updateQueryOptions(this.props),
		);
		checkPropChange(this.props.options, prevProps.options, () => {
			const { options } = this.props;
			if (Array.isArray(options)) {
				options.sort((a, b) => {
					if (a.key < b.key) return -1;
					if (a.key > b.key) return 1;
					return 0;
				});
			}
			this.setState({
				stats: options || [],
			});
		});

		checkSomePropChange(this.props, prevProps, ['dataField', 'nestedField'], () => {
			this.updateQueryOptions(this.props);
			this.handleChange(this.state.currentValue, this.props);
		});
		if (
			!isEqual(
				getNumericRangeArray(this.props.value, this.props.queryFormat),
				getNumericRangeArray(prevProps.value, this.props.queryFormat),
			)
		) {
			let value = getValueArrayWithinLimits(
				RangeSlider.parseValue(this.props.value, this.props),
				getNumericRangeArray(this.props.range, this.props.queryFormat),
			);

			// when the current value is equal to the range,
			// this implies the component is reset to initial values
			// thus we pass null to handleChange that would fire query
			// to update the dependent result components as well

			value = !isEqual(value, getNumericRangeArray(this.props.range, this.props.queryFormat))
				? getValueArrayWithinLimits(
					value,
					getNumericRangeArray(this.props.range, this.props.queryFormat),
				  )
				: null;

			this.handleChange(value, this.props);
		} else if (
			// cautionary conversion of state and selectedValues from state to numerics
			// in order to make comparison meaningful
			// since support of date-types might use date-object, string or numerics.
			!isEqual(
				this.state.currentValue
					? this.state.currentValue.map(val =>
						formatDateString(new XDate(val), this.state.dateFormat),
					  )
					: null,
				Array.isArray(this.props.selectedValue) ? this.props.selectedValue : null,
			)
			&& !isEqual(
				Array.isArray(this.props.selectedValue) ? this.props.selectedValue : null,
				Array.isArray(prevProps.selectedValue) ? prevProps.selectedValue : null,
			)
		) {
			const { value, onChange } = this.props;

			if (value === undefined) {
				const selectedValue = this.props.selectedValue
					? RangeSlider.parseValue(this.props.selectedValue, this.props)
					: null;

				this.handleChange(selectedValue, this.props);
			} else if (onChange) {
				onChange(this.props.selectedValue || null);
			} else {
				this.handleChange(this.state.currentValue);
			}
		}
	}

	shouldComponentUpdate(nextProps) {
		const upperLimit = Math.floor((nextProps.range.end - nextProps.range.start) / 2);
		if (nextProps.stepValue < 1 || nextProps.stepValue > upperLimit) {
			console.warn(
				`stepValue for RangeSlider ${nextProps.componentId} should be greater than 0 and less than or equal to ${upperLimit}`,
			);
			return false;
		}
		checkSomePropChange(nextProps, this.props, ['queryFormat'], () => {
			// when testing with playround, the queryformat knob changed the queryFormat prop
			// which changed the value incase of date types but the local state didn't update
			// this block of code takes care of updating the local value with optimized rerendering
			this.setState(
				{
					currentValue: RangeSlider.parseValue(nextProps.range, nextProps),
				},
				() => {
					this.updateQueryOptions(nextProps);
					this.handleChange(this.state.currentValue, nextProps);
				},
			);
			// stopping the rerender since setState call above would rerender anyway.
			return false;
		});
		return true;
	}

	static parseValue = (value, props) => {
		if (Array.isArray(value)) {
			return getNumericRangeArray(
				{ start: value[0], end: value[1] },
				props.queryFormat,
			).filter(val => typeof val === 'number');
		}
		return value
			? getNumericRangeArray(value, props.queryFormat)
			: getNumericRangeArray(props.range, props.queryFormat);
	};

	static defaultQuery = (value, props) => {
		let query = null;
		if (Array.isArray(value) && value.length) {
			query = getRangeQueryWithNullValues(value, props);
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

	getSnapPoints = () => {
		let snapPoints = [];
		let { stepValue } = this.props;
		const [startPoint, endPoint] = getNumericRangeArray(
			this.props.range,
			this.props.queryFormat,
		);
		// limit the number of steps to prevent generating a large number of snapPoints
		if ((endPoint - startPoint) / stepValue > 100) {
			stepValue = (endPoint - startPoint) / 100;
		}

		for (let i = startPoint; i <= endPoint; i += stepValue) {
			snapPoints = snapPoints.concat(i);
		}
		if (snapPoints[snapPoints.length - 1] !== endPoint) {
			snapPoints = snapPoints.concat(endPoint);
		}
		return snapPoints;
	};

	getValidInterval = (props) => {
		const [start, end] = getNumericRangeArray(props.range, props.queryFormat);
		if (isValidDateRangeQueryFormat(props.queryFormat)) {
			const calendarInterval
				= props.calendarInterval
				|| getCalendarIntervalErrorMessage(end - start).calculatedCalendarInterval;
			const numberOfIntervals = Math.ceil(
				(end - start) / queryFormatMillisecondsMap[calendarInterval],
			);
			if (numberOfIntervals > 100) {
				console.error(
					`${props.componentId}: ${
						getCalendarIntervalErrorMessage(end - start, calendarInterval).errorMessage
					}`,
				);
			}
			return queryFormatMillisecondsMap[calendarInterval];
		}

		const min = Math.ceil((end - start) / 100) || 1;
		if (!props.interval) {
			return min;
		} else if (props.interval < min) {
			console.error(
				`${props.componentId}: interval prop's value should be greater than or equal to ${min}`,
			);
			return min;
		}
		return props.interval;
	};

	histogramQuery = (props) => {
		const query = {
			[props.dataField]: {
				histogram: {
					field: props.dataField,
					interval: this.getValidInterval(props),
					offset: getNumericRangeArray(props.range, props.queryFormat)[0],
				},
			},
		};
		if (props.nestedField) {
			return {
				inner: {
					aggs: query,
					nested: {
						path: props.nestedField,
					},
				},
			};
		}
		return query;
	};

	handleChange = (currentValue, props = this.props, hasMounted = true) => {
		let normalizedValueArray = null;
		let processedStart;
		let processedEnd;
		if (currentValue) {
			const [start, end] = currentValue;
			processedStart = getNumericRangeArray({ start, end }, props.queryFormat)[0];
			processedEnd = getNumericRangeArray({ start, end }, props.queryFormat)[1];

			normalizedValueArray = [
				isValidDateRangeQueryFormat(props.queryFormat)
					? formatDateString(processedStart, this.state.dateFormat)
					: processedStart,
				isValidDateRangeQueryFormat(props.queryFormat)
					? formatDateString(processedEnd, this.state.dateFormat)
					: processedEnd,
			];
		}
		const performUpdate = () => {
			const { range } = props;
			const [rangeStart, rangeEnd] = getNumericRangeArray(range, props.queryFormat);
			const handleUpdates = () => {
				if (!isEqual(currentValue, [rangeStart, rangeEnd])) {
					this.updateQuery(normalizedValueArray, props);
					if (props.onValueChange) {
						props.onValueChange(normalizedValueArray);
					}
				}
			};

			if (
				hasMounted
				&& (currentValue
					? processedStart <= processedEnd
					  && processedStart >= rangeStart
					  && processedEnd <= rangeEnd
					: true)
			) {
				this.setState(
					{
						currentValue: currentValue ? [processedStart, processedEnd] : null,
					},
					handleUpdates,
				);
			} else {
				handleUpdates();
			}
		};
		checkValueChange(
			props.componentId,
			normalizedValueArray,
			props.beforeValueChange,
			performUpdate,
		);
	};

	handleSlider = ({ values }) => {
		if (this.shouldUpdate(values)) {
			if (!isEqual(values, this.state.currentValue)) {
				const { value, onChange } = this.props;
				if (value === undefined) {
					this.handleChange(values);
				} else if (onChange) {
					// force re-rendering to avail the currentValue
					// in rheostat component since it doesn't respect
					// the controlled behavior properly
					this.forceUpdate();
					onChange(values);
				} else {
					// since value prop is set & onChange is not defined
					// we need to reset the slider position
					// to the original 'value' prop
					this.setState({
						currentValue:
							this.state.currentValue
							|| getNumericRangeArray(this.props.range, this.props.queryFormat),
					});
				}
			}
		}
	};

	handleDrag = (values) => {
		if (this.props.onDrag) {
			const { min, max, values: currentValue } = values;
			this.props.onDrag(currentValue, [min, max]);
		}
	};

	updateQuery = (value, props) => {
		const { customQuery } = props;
		let query = RangeSlider.defaultQuery(value, props);
		let customQueryOptions;
		if (customQuery) {
			({ query } = customQuery(value, props) || {});
			customQueryOptions = getOptionsFromQuery(customQuery(value, props));
			updateCustomQuery(props.componentId, props, value);
		}
		const { showFilter } = props;

		props.setQueryOptions(props.componentId, customQueryOptions, false);
		props.updateQuery({
			componentId: props.componentId,
			query,
			value,
			label: props.filterLabel,
			showFilter,
			URLParams: props.URLParams,
			componentType: componentTypes.rangeSlider,
		});
	};

	updateQueryOptions = (props) => {
		if (props.showHistogram) {
			const { customQuery } = props;
			const queryOptions = {
				size: 0,
				aggs: (props.histogramQuery || this.histogramQuery)(props),
			};
			const value = getNumericRangeArray(props.range, props.queryFormat);
			const query = customQuery || RangeSlider.defaultQuery;

			const customQueryOptions = customQuery
				? getOptionsFromQuery(customQuery(value, props))
				: null;
			props.setQueryOptions(
				this.internalComponent,
				{
					...queryOptions,
					...customQueryOptions,
				},
				false,
			);
			props.updateQuery({
				componentId: this.internalComponent,
				query: query(value, props),
				value,
			});
		}
	};

	shouldUpdate = (value) => {
		const { validateRange } = this.props;
		if (validateRange) {
			return validateRange(value);
		}
		return true;
	};

	render() {
		const [startRangeValue, endRangeValue] = getNumericRangeArray(
			this.props.range,
			this.props.queryFormat,
		);
		return (
			<Slider primary style={this.props.style} className={this.props.className}>
				{this.props.title && (
					<Title className={getClassName(this.props.innerClass, 'title') || null}>
						{this.props.title}
					</Title>
				)}
				{this.state.stats.length && this.props.showHistogram && this.props.showSlider ? (
					<HistogramContainer
						stats={this.state.stats}
						range={{
							start: startRangeValue,
							end: endRangeValue,
						}}
						interval={this.getValidInterval(this.props)}
					/>
				) : null}
				{this.props.showSlider && (
					<Rheostat
						min={startRangeValue}
						max={endRangeValue}
						values={this.state.currentValue || [startRangeValue, endRangeValue]}
						onChange={this.handleSlider}
						onValuesUpdated={this.handleDrag}
						snap={this.props.snap}
						snapPoints={this.props.snap ? this.getSnapPoints() : null}
						className={getClassName(this.props.innerClass, 'slider')}
						handle={({ className, style, ...passProps }) => (
							<SliderHandle
								style={style}
								className={className}
								{...passProps}
								renderTooltipData={this.props.renderTooltipData}
								tooltipTrigger={this.props.tooltipTrigger}
							/>
						)}
					/>
				)}
				{this.props.rangeLabels && this.props.showSlider && (
					<div css={rangeLabelsContainer}>
						<RangeLabel
							align="left"
							className={getClassName(this.props.innerClass, 'label') || null}
						>
							{this.props.rangeLabels.start}
						</RangeLabel>
						<RangeLabel
							align="right"
							className={getClassName(this.props.innerClass, 'label') || null}
						>
							{this.props.rangeLabels.end}
						</RangeLabel>
					</div>
				)}
			</Slider>
		);
	}
}

RangeSlider.propTypes = {
	setQueryOptions: types.funcRequired,
	updateQuery: types.funcRequired,
	options: types.options,
	selectedValue: types.selectedValue,
	setCustomQuery: types.funcRequired,
	enableAppbase: types.bool,
	// component props
	beforeValueChange: types.func,
	className: types.string,
	componentId: types.stringRequired,
	customQuery: types.func,
	dataField: types.stringRequired,
	defaultValue: types.range,
	value: types.range,
	filterLabel: types.string,
	innerClass: types.style,
	interval: types.number,
	nestedField: types.string,
	onDrag: types.func,
	onQueryChange: types.func,
	onValueChange: types.func,
	onChange: types.func,
	range: types.range,
	rangeLabels: types.rangeLabels,
	react: types.react,
	showHistogram: types.bool,
	histogramQuery: types.func,
	showFilter: types.bool,
	showSlider: types.bool,
	tooltipTrigger: types.tooltipTrigger,
	renderTooltipData: types.func,
	snap: types.bool,
	stepValue: types.number,
	style: types.style,
	title: types.title,
	URLParams: types.bool,
	includeNullValues: types.bool,
	validateRange: types.func,
	index: types.string,
	queryFormat: oneOf([...Object.keys(dateFormats)]),
	calendarInterval: types.calendarInterval,
	updateComponentProps: types.func,
	// for internal purpose only
	// introduced specifically to control the
	// dateformat for the RS-components using RangeSlider
	// ex: RangeInput
	// RangeSlider bydefault supports yyyy-MM-dd'T'HH:mm:ss
	// but this is not required for RangeInput
	_dateFormat: types.string,
	endpoint: types.endpoint,
};

RangeSlider.defaultProps = {
	className: null,
	range: {
		start: 0,
		end: 10,
	},
	showHistogram: true,
	showSlider: true,
	tooltipTrigger: 'none',
	snap: true,
	stepValue: 1,
	showFilter: true,
	style: {},
	URLParams: false,
	includeNullValues: false,
};

// Add componentType for SSR
RangeSlider.componentType = componentTypes.rangeSlider;

const mapStateToProps = (state, props) => {
	const aggregation
		= props.nestedField && state.aggregations[props.componentId]
			? state.aggregations[props.componentId].inner
			: state.aggregations[props.componentId];

	return {
		options: aggregation
			? aggregation[props.dataField] && aggregation[props.dataField].buckets
			: [],
		selectedValue: state.selectedValues[props.componentId]
			? state.selectedValues[props.componentId].value
			: null,
		enableAppbase: state.config.enableAppbase,
	};
};

const mapDispatchtoProps = dispatch => ({
	setCustomQuery: (component, query) => dispatch(setCustomQuery(component, query)),
	setQueryOptions: (...args) => dispatch(setQueryOptions(...args)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	updateComponentProps: (component, options, componentType) =>
		dispatch(updateComponentProps(component, options, componentType)),
});

const ConnectedComponent = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(props => <RangeSlider ref={props.myForwardedRef} {...props} />);

// eslint-disable-next-line
const ForwardRefComponent = React.forwardRef((props, ref) => (
	<PreferencesConsumer userProps={props}>
		{preferenceProps => (
			<ComponentWrapper
				{...preferenceProps}
				internalComponent
				componentType={componentTypes.rangeSlider}
			>
				{() => <ConnectedComponent {...preferenceProps} myForwardedRef={ref} />}
			</ComponentWrapper>
		)}
	</PreferencesConsumer>
));
hoistNonReactStatics(ForwardRefComponent, RangeSlider);

ForwardRefComponent.displayName = 'RangeSlider';
export default ForwardRefComponent;
