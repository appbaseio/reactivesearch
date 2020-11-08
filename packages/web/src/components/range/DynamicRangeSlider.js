/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { Component } from 'react';
import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryOptions,
	setQueryListener,
	setComponentProps,
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
	pushToAndClause,
	updateCustomQuery,
	getOptionsFromQuery,
} from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';
import Rheostat from 'rheostat/lib/Slider';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';

import HistogramContainer from './addons/HistogramContainer';
import RangeLabel from './addons/RangeLabel';
import SliderHandle from './addons/SliderHandle';
import Slider from '../../styles/Slider';
import Title from '../../styles/Title';
import { rangeLabelsContainer } from '../../styles/Label';
import { connect, getRangeQueryWithNullValues, getValidPropsKeys } from '../../utils';

const formatRange = (range = {}) => ({
	start: Math.floor(range.start),
	end: Math.ceil(range.end),
});

class DynamicRangeSlider extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentValue: null,
			range: null,
			stats: [],
		};

		// Caution: Don't change the ids unnecessarily.
		// If it's required then you need to update it in reactivecore(transform.js) too.
		this.internalHistogramComponent = `${this.props.componentId}__histogram__internal`;
		this.internalRangeComponent = `${this.props.componentId}__range__internal`;
		this.internalMatchAllComponent = `${this.props.componentId}__match_all__internal`;

		props.addComponent(props.componentId);
		props.addComponent(this.internalHistogramComponent);
		props.addComponent(this.internalRangeComponent);
		props.setQueryListener(props.componentId, props.onQueryChange, null);
		// Update props in store
		props.setComponentProps(props.componentId, props, componentTypes.dynamicRangeSlider);
		props.setComponentProps(
			this.internalHistogramComponent,
			props,
			componentTypes.dynamicRangeSlider,
		);
		props.setComponentProps(
			this.internalRangeComponent,
			props,
			componentTypes.dynamicRangeSlider,
		);
		// Set custom query in store
		updateCustomQuery(props.componentId, props, this.state.currentValue);
		// get range before executing other queries
		this.updateRangeQueryOptions(props);
	}

	static getDerivedStateFromProps(props, state) {
		// Update the current value based on range to avoid the unnecessary API calls
		if (!state.currentValue && props.range) {
			const range = formatRange(props.range);
			if (props.selectedValue) {
				// selected value must be in limit
				if (
					props.selectedValue[0] >= range.start
					&& props.selectedValue[1] <= range.end
				) {
					return {
						currentValue: null,
					};
				}
				return {
					currentValue: [range.start, range.end],
				};
			} else if (!isEqual(state.currentValue, [range.start, range.end])) {
				// Just set the value for visibility don't apply as query or filter
				return {
					currentValue: [range.start, range.end],
				};
			}
		}
		return null;
	}

	componentDidUpdate(prevProps) {
		checkSomePropChange(this.props, prevProps, getValidPropsKeys(this.props), () => {
			this.props.updateComponentProps(
				this.props.componentId,
				this.props,
				componentTypes.dynamicRangeSlider,
			);
			this.props.updateComponentProps(
				this.internalHistogramComponent,
				this.props,
				componentTypes.dynamicRangeSlider,
			);
			this.props.updateComponentProps(
				this.internalRangeComponent,
				this.props,
				componentTypes.dynamicRangeSlider,
			);
		});
		if (
			!isEqual(this.props.range, prevProps.range)
			&& this.props.range
			&& this.props.range.start >= 0
			&& this.props.range.end > 0
		) {
			// when range prop is changed
			// it will happen due to initial mount (or) due to subscription
			this.updateQueryOptions(this.props, this.props.range);
			// floor and ceil to take edge cases into account
			this.updateRange(formatRange(this.props.range));


			// only listen to selectedValue initially, after the
			// component has mounted and range is received
			if (this.props.selectedValue) {
				this.handleChange(this.props.selectedValue);
			} else {
				this.handleChange();
			}
		} else if (
			this.props.range
			&& !isEqual(
				this.props.value && this.props.value(this.props.range.start, this.props.range.end),
				prevProps.value && prevProps.value(this.props.range.start, this.props.range.end),
			)
		) {
			// when value prop is changed
			const { start, end } = this.props.value(this.props.range.start, this.props.range.end);
			this.handleChange([start, end]);
		} else if (
			this.props.range
			&& this.props.selectedValue === null
			&& prevProps.selectedValue
		) {
			// when the filter is reset
			this.handleChange();
		}

		checkPropChange(this.props.react, prevProps.react, () => {
			this.updateRangeQueryOptions(this.props);
			this.setReact(this.props);
		});

		checkSomePropChange(this.props, prevProps, ['dataField', 'nestedField'], () => {
			this.updateRangeQueryOptions(this.props);
		});

		checkSomePropChange(this.props, prevProps, ['showHistogram', 'interval'], () =>
			this.updateQueryOptions(this.props, this.props.range || this.state.range),
		);

		checkPropChange(this.props.options, prevProps.options, () => {
			const { options } = this.props;
			options.sort((a, b) => {
				if (a.key < b.key) return -1;
				if (a.key > b.key) return 1;
				return 0;
			});
			this.setState({
				stats: options,
			});
		});
	}

	componentDidMount() {
		this.setReact(this.props);
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextState.range) {
			const upperLimit = Math.floor((nextState.range.end - nextState.range.start) / 2);
			if (nextProps.stepValue < 1 || nextProps.stepValue > upperLimit) {
				console.warn(
					`stepValue for DynamicRangeSlider ${nextProps.componentId} should be greater than 0 and less than or equal to ${upperLimit}`,
				);
				return false;
			}
			return true;
		}
		return true;
	}

	componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
		this.props.removeComponent(this.internalHistogramComponent);
		this.props.removeComponent(this.internalRangeComponent);
		this.props.removeComponent(this.internalMatchAllComponent);
	}

	setReact = (props) => {
		const { react } = props;
		if (react) {
			props.watchComponent(this.internalRangeComponent, props.react);
			const newReact = pushToAndClause(react, this.internalHistogramComponent);
			props.watchComponent(props.componentId, newReact);
		} else {
			// internalRangeComponent watches internalMatchAll component allowing execution of query
			// in case of no react prop
			this.props.addComponent(this.internalMatchAllComponent);
			props.setQueryOptions(
				this.internalMatchAllComponent,
				{ aggs: { match_all: {} } },
				false,
			);
			props.watchComponent(this.internalRangeComponent, {
				and: this.internalMatchAllComponent,
			});
			props.watchComponent(props.componentId, {
				and: this.internalHistogramComponent,
			});
		}
	};

	// value parser for SSR
	static parseValue = (value) => {
		if (Array.isArray(value)) return value;
		return value ? [value().start, value().end] : null;
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
		const { range } = this.state;

		// limit the number of steps to prevent generating a large number of snapPoints
		if ((range.end - range.start) / stepValue > 100) {
			stepValue = (range.end - range.start) / 100;
		}

		for (let i = range.start; i <= range.end; i += stepValue) {
			snapPoints = snapPoints.concat(i);
		}
		if (snapPoints[snapPoints.length - 1] !== range.end) {
			snapPoints = snapPoints.concat(range.end);
		}
		return snapPoints;
	};

	getValidInterval = (props, range) => {
		const min = Math.ceil((range.end - range.start) / 100) || 1;
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

	histogramQuery = (props, range) => {
		const query = {
			[props.dataField]: {
				histogram: {
					field: props.dataField,
					interval: this.getValidInterval(props, range),
					offset: range.start,
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

	rangeQuery = props => ({
		min: { min: { field: props.dataField } },
		max: { max: { field: props.dataField } },
	});

	handleChange = (currentValue, props = this.props) => {
		let normalizedValue = null;
		if (currentValue) {
			// always keep the values within range
			normalizedValue = [
				currentValue[0] < props.range.start ? props.range.start : currentValue[0],
				currentValue[1] > props.range.end ? props.range.end : currentValue[1],
			];
			if (props.range.start === null) {
				normalizedValue = [currentValue[0], currentValue[1]];
			}
		}
		const normalizedValues = normalizedValue ? [normalizedValue[0], normalizedValue[1]] : null;
		const performUpdate = () => {
			this.setState(
				{
					currentValue: normalizedValue,
				},
				() => {
					// Only update the queries for dependent components when range is changed by input
					this.updateQuery(normalizedValues, props);
					if (props.onValueChange) props.onValueChange(normalizedValues);
				},
			);
		};
		checkValueChange(
			props.componentId,
			normalizedValues,
			props.beforeValueChange,
			performUpdate,
		);
	};

	handleSlider = ({ values }) => {
		if (!isEqual(values, this.state.currentValue)) {
			const { value, onChange } = this.props;
			if (value === undefined) {
				this.handleChange(values);
			} else if (onChange) {
				onChange(values);
			} else {
				this.handleChange(values);
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
		let query = DynamicRangeSlider.defaultQuery(value, props);
		let customQueryOptions;
		if (customQuery) {
			({ query } = customQuery(value, props) || {});
			customQueryOptions = getOptionsFromQuery(customQuery(value, props));
			updateCustomQuery(props.componentId, props, value);
		}
		const {
			showFilter,
		} = props;
		props.setQueryOptions(props.componentId, customQueryOptions);

		props.updateQuery(
			{
				componentId: props.componentId,
				query,
				value,
				label: props.filterLabel,
				showFilter,
				URLParams: props.URLParams,
				componentType: componentTypes.dynamicRangeSlider,
			},
		);
	};

	updateQueryOptions = (props, range) => {
		if (props.showHistogram) {
			const queryOptions = {
				aggs: this.histogramQuery(props, range),
			};
			const { customQuery } = props;

			const query = props.customQuery || DynamicRangeSlider.defaultQuery;
			const value = [range.start, range.end];
			const customQueryOptions = customQuery
				? getOptionsFromQuery(customQuery(value, props))
				: null;
			props.setQueryOptions(
				this.internalHistogramComponent,
				{ ...queryOptions, ...customQueryOptions },
				false,
			);
			props.updateQuery({
				componentId: this.internalHistogramComponent,
				query: query(value, props),
				value,
			});
		}
	};

	updateRange = (range) => {
		this.setState({
			range,
		});
	};

	updateRangeQueryOptions = (props) => {
		let queryOptions = {};
		const { nestedField } = props;
		if (nestedField) {
			queryOptions = {
				aggs: {
					[nestedField]: {
						nested: {
							path: nestedField,
						},
						aggs: this.rangeQuery(props),
					},
				},
			};
		} else {
			queryOptions = {
				aggs: this.rangeQuery(props),
			};
		}

		props.setQueryOptions(this.internalRangeComponent, queryOptions);
	};

	getRangeLabels = () => {
		let { start: startLabel, end: endLabel } = this.state.range;

		if (this.props.rangeLabels) {
			const rangeLabels = this.props.rangeLabels(
				this.props.range.start,
				this.props.range.end,
			);
			startLabel = rangeLabels.start;
			endLabel = rangeLabels.end;
		}

		return {
			startLabel,
			endLabel,
		};
	};

	renderHistogram() {
		if (this.props.isLoading && this.props.loader) {
			return this.props.loader;
		}
		if (this.state.stats.length && this.props.showHistogram) {
			return (
				<HistogramContainer
					stats={this.state.stats}
					range={this.state.range}
					interval={this.getValidInterval(this.props, this.state.range)}
				/>
			);
		}
		return null;
	}

	render() {
		if (!this.state.currentValue || !this.state.range || this.props.range.start === null) {
			return null;
		}

		const { startLabel, endLabel } = this.getRangeLabels();

		return (
			<Slider primary style={this.props.style} className={this.props.className}>
				{this.props.title && (
					<Title className={getClassName(this.props.innerClass, 'title') || null}>
						{this.props.title}
					</Title>
				)}
				{this.renderHistogram()}
				<Rheostat
					min={this.state.range.start}
					max={this.state.range.end}
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
				<div css={rangeLabelsContainer}>
					<RangeLabel
						align="left"
						className={getClassName(this.props.innerClass, 'label') || null}
					>
						{startLabel}
					</RangeLabel>
					<RangeLabel
						align="right"
						className={getClassName(this.props.innerClass, 'label') || null}
					>
						{endLabel}
					</RangeLabel>
				</div>
			</Slider>
		);
	}
}

DynamicRangeSlider.propTypes = {
	addComponent: types.funcRequired,
	removeComponent: types.funcRequired,
	setQueryListener: types.funcRequired,
	setQueryOptions: types.funcRequired,
	updateQuery: types.funcRequired,
	watchComponent: types.funcRequired,
	options: types.options,
	range: types.range,
	selectedValue: types.selectedValue,
	setComponentProps: types.funcRequired,
	updateComponentProps: types.funcRequired,
	isLoading: types.bool,
	setCustomQuery: types.funcRequired,
	// component props
	beforeValueChange: types.func,
	className: types.string,
	componentId: types.stringRequired,
	customQuery: types.func,
	dataField: types.stringRequired,
	defaultValue: types.func,
	value: types.func,
	filterLabel: types.string,
	innerClass: types.style,
	interval: types.number,
	loader: types.title,
	nestedField: types.string,
	onDrag: types.func,
	onQueryChange: types.func,
	onValueChange: types.func,
	onChange: types.func,
	rangeLabels: types.func,
	react: types.react,
	showHistogram: types.bool,
	showFilter: types.bool,
	tooltipTrigger: types.tooltipTrigger,
	renderTooltipData: types.func,
	snap: types.bool,
	stepValue: types.number,
	style: types.style,
	title: types.title,
	URLParams: types.bool,
	includeNullValues: types.bool,
};

DynamicRangeSlider.defaultProps = {
	className: null,
	showHistogram: true,
	tooltipTrigger: 'none',
	snap: true,
	stepValue: 1,
	style: {},
	URLParams: false,
	showFilter: true,
	includeNullValues: false,
};

// Add componentType for SSR
DynamicRangeSlider.componentType = componentTypes.dynamicRangeSlider;

const mapStateToProps = (state, props) => {
	let aggregation = state.aggregations[props.componentId];
	if (props.nestedField) {
		aggregation
			= state.aggregations[props.componentId] && state.aggregations[props.componentId].inner;
	}
	let options = aggregation && aggregation[props.dataField];
	let range = state.aggregations[`${props.componentId}__range__internal`];
	if (props.nestedField) {
		options
			= options && aggregation[props.dataField] && aggregation[props.dataField].buckets
				? aggregation[props.dataField].buckets
				: [];
		range
			= range
			&& state.aggregations[`${props.componentId}__range__internal`][props.nestedField].min
				? {
					start: state.aggregations[`${props.componentId}__range__internal`][props.nestedField].min.value,
					end: state.aggregations[`${props.componentId}__range__internal`][props.nestedField].max.value,
				} // prettier-ignore
				: null;
	} else {
		options
			= options && aggregation[props.dataField].buckets
				? aggregation[props.dataField].buckets
				: [];
		range
			= range && state.aggregations[`${props.componentId}__range__internal`].min
				? {
					start: state.aggregations[`${props.componentId}__range__internal`].min.value,
					end: state.aggregations[`${props.componentId}__range__internal`].max.value,
				} // prettier-ignore
				: null;
	}
	if (range) {
		range = formatRange(range);
	}
	return {
		options,
		isLoading: state.isLoading[props.componentId],
		range,
		selectedValue: state.selectedValues[props.componentId]
			? state.selectedValues[props.componentId].value
			: null,
	};
};

const mapDispatchtoProps = dispatch => ({
	setComponentProps: (component, options, componentType) =>
		dispatch(setComponentProps(component, options, componentType)),
	setCustomQuery: (component, query) => dispatch(setCustomQuery(component, query)),
	updateComponentProps: (component, options, componentType) =>
		dispatch(updateComponentProps(component, options, componentType)),
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	setQueryOptions: (component, props, execute) =>
		dispatch(setQueryOptions(component, props, execute)),
	setQueryListener: (component, onQueryChange, beforeQueryChange) =>
		dispatch(setQueryListener(component, onQueryChange, beforeQueryChange)),
	updateQuery: (updateQueryObject, execute) => dispatch(updateQuery(updateQueryObject, execute)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
});

const ConnectedComponent = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(props => <DynamicRangeSlider ref={props.myForwardedRef} {...props} />);

// eslint-disable-next-line
const ForwardRefComponent = React.forwardRef((props, ref) => (
	<ConnectedComponent {...props} myForwardedRef={ref} />
));
hoistNonReactStatics(ForwardRefComponent, DynamicRangeSlider);

ForwardRefComponent.name = 'DynamicRangeSlider';
export default ForwardRefComponent;
