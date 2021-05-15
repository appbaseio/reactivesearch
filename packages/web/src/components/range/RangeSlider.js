/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { Component } from 'react';
import { updateQuery, setQueryOptions, setCustomQuery } from '@appbaseio/reactivecore/lib/actions';
import hoistNonReactStatics from 'hoist-non-react-statics';
import {
	isEqual,
	checkValueChange,
	checkPropChange,
	checkSomePropChange,
	getClassName,
	getOptionsFromQuery,
	updateCustomQuery,
} from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';
import Rheostat from 'rheostat/lib/Slider';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import { getInternalComponentID } from '@appbaseio/reactivecore/lib/utils/transform';
import HistogramContainer from './addons/HistogramContainer';
import RangeLabel from './addons/RangeLabel';
import SliderHandle from './addons/SliderHandle';
import Slider from '../../styles/Slider';
import Title from '../../styles/Title';
import { rangeLabelsContainer } from '../../styles/Label';
import { connect, getRangeQueryWithNullValues } from '../../utils';
import ComponentWrapper from '../basic/ComponentWrapper';

class RangeSlider extends Component {
	constructor(props) {
		super(props);

		const { selectedValue, defaultValue, value } = props;
		const valueToParse = selectedValue || value || defaultValue;
		let currentValue = RangeSlider.parseValue(valueToParse, props);
		if (!this.shouldUpdate(currentValue)) {
			currentValue = [props.range.start, props.range.end];
		}
		this.state = {
			currentValue,
			stats: [],
		};

		this.internalComponent = getInternalComponentID(props.componentId);
		// Set custom query in store
		updateCustomQuery(props.componentId, props, currentValue);

		this.updateQueryOptions(props);
		const hasMounted = false;

		if (currentValue) {
			this.handleChange(currentValue, props, hasMounted);
		}
	}

	componentDidUpdate(prevProps) {
		checkSomePropChange(this.props, prevProps, ['showHistogram', 'interval'], () =>
			this.updateQueryOptions(this.props),
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

		if (!isEqual(this.props.value, prevProps.value)) {
			const value = RangeSlider.parseValue(this.props.value, this.props);
			this.handleChange(value, this.props);
		} else if (
			!isEqual(this.state.currentValue, this.props.selectedValue)
			&& !isEqual(this.props.selectedValue, prevProps.selectedValue)
		) {
			const { value, onChange } = this.props;

			if (value === undefined) {
				const selectedValue = RangeSlider.parseValue(this.props.selectedValue, this.props);
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
		return true;
	}

	static parseValue = (value, props) => {
		if (Array.isArray(value)) return value;
		return value ? [value.start, value.end] : [props.range.start, props.range.end];
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

		// limit the number of steps to prevent generating a large number of snapPoints
		if ((this.props.range.end - this.props.range.start) / stepValue > 100) {
			stepValue = (this.props.range.end - this.props.range.start) / 100;
		}

		for (let i = this.props.range.start; i <= this.props.range.end; i += stepValue) {
			snapPoints = snapPoints.concat(i);
		}
		if (snapPoints[snapPoints.length - 1] !== this.props.range.end) {
			snapPoints = snapPoints.concat(this.props.range.end);
		}
		return snapPoints;
	};

	getValidInterval = (props) => {
		const min = Math.ceil((props.range.end - props.range.start) / 100) || 1;
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
					offset: props.range.start,
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
		const performUpdate = () => {
			const handleUpdates = () => {
				const [start, end] = currentValue;
				this.updateQuery([start, end], props);
				if (props.onValueChange) {
					props.onValueChange({
						start,
						end,
					});
				}
			};

			const [start, end] = currentValue;
			const { range } = props;
			if (hasMounted && start <= end && start >= range.start && end <= range.end) {
				this.setState(
					{
						currentValue,
					},
					handleUpdates,
				);
			} else {
				handleUpdates();
			}
		};
		checkValueChange(
			props.componentId,
			{
				start: currentValue[0],
				end: currentValue[1],
			},
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
						currentValue: this.state.currentValue,
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
		const {
			showFilter,
			range: { start, end },
		} = props;
		const [currentStart, currentEnd] = value;
		// check if the slider is at its initial position
		const isInitialValue = currentStart === start && currentEnd === end;
		props.setQueryOptions(props.componentId, customQueryOptions);
		props.updateQuery({
			componentId: props.componentId,
			query,
			value,
			label: props.filterLabel,
			showFilter: showFilter && !isInitialValue,
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
			const value = [props.range.start, props.range.end];
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
	}

	render() {
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
						range={this.props.range}
						interval={this.getValidInterval(this.props)}
					/>
				) : null}
				{this.props.showSlider && (
					<Rheostat
						min={this.props.range.start}
						max={this.props.range.end}
						values={this.state.currentValue}
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
	};
};

const mapDispatchtoProps = dispatch => ({
	setCustomQuery: (component, query) => dispatch(setCustomQuery(component, query)),
	setQueryOptions: (component, props, execute) =>
		dispatch(setQueryOptions(component, props, execute)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
});

const ConnectedComponent = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(props => (
	<ComponentWrapper {...props} internalComponent componentType={componentTypes.rangeSlider}>
		{() => <RangeSlider ref={props.myForwardedRef} {...props} />}
	</ComponentWrapper>
));

// eslint-disable-next-line
const ForwardRefComponent = React.forwardRef((props, ref) => (
	<ConnectedComponent {...props} myForwardedRef={ref} />
));
hoistNonReactStatics(ForwardRefComponent, RangeSlider);

ForwardRefComponent.displayName = 'RangeSlider';
export default ForwardRefComponent;
