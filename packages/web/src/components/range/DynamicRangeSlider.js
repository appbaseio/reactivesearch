import React, { Component } from 'react';
import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryOptions,
	setQueryListener,
} from '@appbaseio/reactivecore/lib/actions';
import {
	isEqual,
	checkValueChange,
	checkPropChange,
	checkSomePropChange,
	getClassName,
	pushToAndClause,
} from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';
import Rheostat from 'rheostat/lib/Slider';

import HistogramContainer from './addons/HistogramContainer';
import RangeLabel from './addons/RangeLabel';
import SliderHandle from './addons/SliderHandle';
import Slider from '../../styles/Slider';
import Title from '../../styles/Title';
import { rangeLabelsContainer } from '../../styles/Label';
import { connect } from '../../utils';

class DynamicRangeSlider extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentValue: null,
			range: null,
			stats: [],
		};
		this.internalHistogramComponent = `${this.props.componentId}__histogram__internal`;
		this.internalRangeComponent = `${this.props.componentId}__range__internal`;
		this.internalMatchAllComponent = `${this.props.componentId}__match_all__internal`;
		this.locked = false;
		props.setQueryListener(props.componentId, props.onQueryChange, null);
	}

	componentWillMount() {
		this.props.addComponent(this.props.componentId);
		this.props.addComponent(this.internalHistogramComponent);
		this.props.addComponent(this.internalRangeComponent);

		// get range before executing other queries
		this.updateRangeQueryOptions(this.props);
		this.setReact(this.props);
	}

	componentWillReceiveProps(nextProps) {
		if (!isEqual(this.props.range, nextProps.range) && nextProps.range) {
			this.updateQueryOptions(nextProps, nextProps.range);
			// floor and ceil to take edge cases into account
			this.updateRange({
				start: Math.floor(nextProps.range.start),
				end: Math.ceil(nextProps.range.end),
			});

			// only listen to selectedValue initially, after the
			// component has mounted and range is received
			if (nextProps.selectedValue && !this.state.currentValue) {
				this.handleChange(nextProps.selectedValue, nextProps);
			} else if (nextProps.defaultSelected) {
				const { start, end } = nextProps.defaultSelected(
					nextProps.range.start,
					nextProps.range.end,
				);
				this.handleChange([start, end], nextProps);
			} else {
				this.handleChange(
					[Math.floor(nextProps.range.start), Math.ceil(nextProps.range.end)],
					nextProps,
				);
			}
		} else if (
			nextProps.range
			&& !isEqual(
				this.props.defaultSelected
					&& this.props.defaultSelected(nextProps.range.start, nextProps.range.end),
				nextProps.defaultSelected
					&& nextProps.defaultSelected(nextProps.range.start, nextProps.range.end),
			)
		) {
			const { start, end } = nextProps.defaultSelected(
				nextProps.range.start,
				nextProps.range.end,
			);
			this.handleChange([start, end], nextProps);
		} else if (nextProps.range && nextProps.selectedValue === null) {
			// when the filter is reset
			this.handleChange([nextProps.range.start, nextProps.range.end], nextProps);
		}

		checkPropChange(this.props.react, nextProps.react, () => {
			this.updateRangeQueryOptions(nextProps);
			this.setReact(nextProps);
		});
		checkPropChange(this.props.dataField, nextProps.dataField, () => {
			this.updateRangeQueryOptions(nextProps);
		});
		checkSomePropChange(this.props, nextProps, ['showHistogram', 'interval'], () =>
			this.updateQueryOptions(nextProps, nextProps.range || this.state.range),
		);
		checkPropChange(this.props.options, nextProps.options, () => {
			const { options } = nextProps;
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

	shouldComponentUpdate(nextProps, nextState) {
		if (nextState.range) {
			const upperLimit = Math.floor((nextState.range.end - nextState.range.start) / 2);
			if (nextProps.stepValue < 1 || nextProps.stepValue > upperLimit) {
				console.warn(
					`stepValue for DynamicRangeSlider ${
						nextProps.componentId
					} should be greater than 0 and less than or equal to ${upperLimit}`,
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
	static parseValue = value => (value ? [value().start, value().end] : null);

	static defaultQuery = (value, props) => {
		let query = null;
		if (Array.isArray(value) && value.length) {
			query = {
				range: {
					[props.dataField]: {
						gte: value[0],
						lte: value[1],
						boost: 2.0,
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
				`${
					props.componentId
				}: interval prop's value should be greater than or equal to ${min}`,
			);
			return min;
		}
		return props.interval;
	};

	histogramQuery = (props, range) => ({
		[props.dataField]: {
			histogram: {
				field: props.dataField,
				interval: this.getValidInterval(props, range),
				offset: range.start,
			},
		},
	});

	rangeQuery = props => ({
		min: { min: { field: props.dataField } },
		max: { max: { field: props.dataField } },
	});

	handleChange = (currentValue, props = this.props) => {
		// ignore state updates when component is locked
		if (props.beforeValueChange && this.locked) {
			return;
		}
		// always keep the values within range
		const normalizedValue = [
			currentValue[0] < props.range.start ? props.range.start : currentValue[0],
			currentValue[1] > props.range.end ? props.range.end : currentValue[1],
		];
		this.locked = true;
		const performUpdate = () => {
			this.setState(
				{
					currentValue: normalizedValue,
				},
				() => {
					const normalizedValues = [normalizedValue[0], normalizedValue[1]];
					this.updateQuery(normalizedValues, props);
					this.locked = false;
					if (props.onValueChange) props.onValueChange(normalizedValues);
				},
			);
		};
		checkValueChange(
			props.componentId,
			{
				start: normalizedValue[0],
				end: normalizedValue[1],
			},
			props.beforeValueChange,
			performUpdate,
		);
	};

	handleSlider = ({ values }) => {
		this.handleChange(values);
	};

	handleDrag = (values) => {
		if (this.props.onDrag) {
			const { min, max, values: currentValue } = values;
			this.props.onDrag(currentValue, [min, max]);
		}
	};

	updateQuery = (value, props) => {
		const query = props.customQuery || DynamicRangeSlider.defaultQuery;
		const {
			showFilter,
			range: { start, end },
		} = props;
		const [currentStart, currentEnd] = value;
		// check if the slider is at its initial position
		const isInitialValue = currentStart === start && currentEnd === end;

		props.updateQuery({
			componentId: props.componentId,
			query: query(value, props),
			value,
			label: props.filterLabel,
			showFilter: showFilter && !isInitialValue,
			URLParams: props.URLParams,
			componentType: 'DYNAMICRANGESLIDER',
		});
	};

	updateQueryOptions = (props, range) => {
		if (props.showHistogram) {
			const queryOptions = {
				aggs: this.histogramQuery(props, range),
			};

			props.setQueryOptions(this.internalHistogramComponent, queryOptions, false);

			const query = props.customQuery || DynamicRangeSlider.defaultQuery;

			props.updateQuery({
				componentId: this.internalHistogramComponent,
				query: query([range.start, range.end], props),
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
		if (!this.state.currentValue || !this.state.range) {
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
				<div className={rangeLabelsContainer}>
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
	// component props
	beforeValueChange: types.func,
	className: types.string,
	componentId: types.stringRequired,
	customQuery: types.func,
	dataField: types.stringRequired,
	defaultSelected: types.func,
	filterLabel: types.string,
	innerClass: types.style,
	interval: types.number,
	nestedField: types.string,
	isLoading: types.bool,
	loader: types.title,
	onDrag: types.func,
	onQueryChange: types.func,
	onValueChange: types.func,
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
};

const mapStateToProps = (state, props) => {
	let options
		= state.aggregations[props.componentId]
		&& state.aggregations[props.componentId][props.dataField];
	let range = state.aggregations[`${props.componentId}__range__internal`];
	if (props.nestedField) {
		options
			= options
			&& state.aggregations[props.componentId][props.dataField].nested
			&& state.aggregations[props.componentId][props.dataField].nested.buckets
				? state.aggregations[props.componentId][props.dataField].nested.buckets
				: [];
		range
			= range && state.aggregations[`${props.componentId}__range__internal`].nested.min
				? {
					start: state.aggregations[`${props.componentId}__range__internal`].nested.min.value,
					end: state.aggregations[`${props.componentId}__range__internal`].nested.max.value,
				} // prettier-ignore
				: null;
	} else {
		options
			= options && state.aggregations[props.componentId][props.dataField].buckets
				? state.aggregations[props.componentId][props.dataField].buckets
				: [];
		range
			= range && state.aggregations[`${props.componentId}__range__internal`].min
				? {
					start: state.aggregations[`${props.componentId}__range__internal`].min.value,
					end: state.aggregations[`${props.componentId}__range__internal`].max.value,
				} // prettier-ignore
				: null;
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
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	setQueryOptions: (component, props, execute) =>
		dispatch(setQueryOptions(component, props, execute)),
	setQueryListener: (component, onQueryChange, beforeQueryChange) =>
		dispatch(setQueryListener(component, onQueryChange, beforeQueryChange)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
});

export default connect(
	mapStateToProps,
	mapDispatchtoProps,
)(DynamicRangeSlider);
