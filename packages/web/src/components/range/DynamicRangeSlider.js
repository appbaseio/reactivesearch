import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryOptions,
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
import Rheostat from 'rheostat';

import HistogramContainer from './addons/HistogramContainer';
import RangeLabel from './addons/RangeLabel';
import Slider from '../../styles/Slider';
import Title from '../../styles/Title';
import { rangeLabelsContainer } from '../../styles/Label';

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

			if (nextProps.selectedValue) {
				this.handleChange(nextProps.selectedValue);
			} else if (nextProps.defaultSelected) {
				this.handleChange([
					nextProps.defaultSelected.start,
					nextProps.defaultSelected.end,
				]);
			} else {
				this.handleChange([
					Math.floor(nextProps.range.start),
					Math.ceil(nextProps.range.end),
				]);
			}
		} else if (!isEqual(this.props.defaultSelected, nextProps.defaultSelected)) {
			this.handleChange(
				[nextProps.defaultSelected.start, nextProps.defaultSelected.end],
				nextProps,
			);
		} else if (!isEqual(this.state.currentValue, nextProps.selectedValue)) {
			this.handleChange(nextProps.selectedValue || [nextProps.range.start, nextProps.range.end]);
		}
		checkPropChange(this.props.react, nextProps.react, () => {
			this.updateRangeQueryOptions(nextProps);
			this.setReact(nextProps);
		});
		checkPropChange(this.props.dataField, nextProps.dataField, () => {
			this.updateRangeQueryOptions(nextProps);
		});
		checkSomePropChange(
			this.props,
			nextProps,
			['showHistogram', 'interval'],
			() => this.updateQueryOptions(nextProps, nextProps.range || this.state.range),
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
				console.warn(`stepValue for DynamicRangeSlider ${nextProps.componentId} should be greater than 0 and less than or equal to ${upperLimit}`);
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
			const newReact = pushToAndClause(
				react,
				this.internalHistogramComponent,
			);
			props.watchComponent(props.componentId, newReact);
		} else {
			// internalRangeComponent watches internalMatchAll component allowing execution of query
			// in case of no react prop
			this.props.addComponent(this.internalMatchAllComponent);
			props.setQueryOptions(this.internalMatchAllComponent, { aggs: { match_all: {} } }, false);
			props.watchComponent(this.internalRangeComponent, { and: this.internalMatchAllComponent });
			props.watchComponent(props.componentId, { and: this.internalHistogramComponent });
		}
	};

	defaultQuery = (value, props) => {
		if (Array.isArray(value) && value.length) {
			return {
				range: {
					[props.dataField]: {
						gte: value[0],
						lte: value[1],
						boost: 2.0,
					},
				},
			};
		}
		return null;
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
			console.error(`${props.componentId}: interval prop's value should be greater than or equal to ${min}`);
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
		const performUpdate = () => {
			this.setState({
				currentValue,
			}, () => {
				this.updateQuery([currentValue[0], currentValue[1]], props);
			});
		};
		checkValueChange(
			props.componentId,
			{
				start: currentValue[0],
				end: currentValue[1],
			},
			props.beforeValueChange,
			props.onValueChange,
			performUpdate,
		);
	};

	handleSlider = ({ values }) => {
		this.handleChange(values);
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
			label: props.filterLabel,
			showFilter: false, // disable filters for DynamicRangeSlider
			URLParams: props.URLParams,
			onQueryChange,
		});
	};

	updateQueryOptions = (props, range) => {
		if (props.showHistogram) {
			const queryOptions = {
				aggs: this.histogramQuery(props, range),
			};

			props.setQueryOptions(this.internalHistogramComponent, queryOptions, false);

			const query = props.customQuery || this.defaultQuery;

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
	}

	updateRangeQueryOptions = (props) => {
		const queryOptions = {
			aggs: this.rangeQuery(props),
		};

		props.setQueryOptions(this.internalRangeComponent, queryOptions);
	};

	render() {
		if (!this.state.currentValue || !this.state.range) {
			return null;
		}
		return (
			<Slider primary style={this.props.style} className={this.props.className}>
				{this.props.title && (
					<Title
						className={getClassName(this.props.innerClass, 'title') || null}
					>
						{this.props.title}
					</Title>
				)}
				{this.state.stats.length && this.props.showHistogram ? (
					<HistogramContainer
						stats={this.state.stats}
						range={this.state.range}
						interval={this.getValidInterval(this.props, this.state.range)}
					/>
				) : null}
				<Rheostat
					min={this.state.range.start}
					max={this.state.range.end}
					values={this.state.currentValue}
					onChange={this.handleSlider}
					snap={this.props.snap}
					snapPoints={this.props.snap ? this.getSnapPoints() : null}
					className={getClassName(this.props.innerClass, 'slider')}
				/>
				<div className={rangeLabelsContainer}>
					<RangeLabel
						align="left"
						className={getClassName(this.props.innerClass, 'label') || null}
					>
						{this.state.range.start}
					</RangeLabel>
					<RangeLabel
						align="right"
						className={getClassName(this.props.innerClass, 'label') || null}
					>
						{this.state.range.end}
					</RangeLabel>
				</div>
			</Slider>
		);
	}
}

DynamicRangeSlider.propTypes = {
	range: types.range,
	componentId: types.stringRequired,
	addComponent: types.funcRequired,
	setQueryOptions: types.funcRequired,
	updateQuery: types.funcRequired,
	defaultSelected: types.range,
	react: types.react,
	options: types.options,
	removeComponent: types.funcRequired,
	dataField: types.stringRequired,
	interval: types.number,
	beforeValueChange: types.func,
	onValueChange: types.func,
	customQuery: types.func,
	onQueryChange: types.func,
	showHistogram: types.bool,
	stepValue: types.number,
	URLParams: types.boolRequired,
	title: types.title,
	filterLabel: types.string,
	selectedValue: types.selectedValue,
	style: types.style,
	className: types.string,
	snap: types.bool,
	innerClass: types.style,
};

DynamicRangeSlider.defaultProps = {
	stepValue: 1,
	showHistogram: true,
	URLParams: false,
	style: {},
	className: null,
	snap: true,
};

const mapStateToProps = (state, props) => ({
	options:
		(state.aggregations[props.componentId]
		&& state.aggregations[props.componentId][props.dataField]
		&& state.aggregations[props.componentId][props.dataField].buckets)
			? state.aggregations[props.componentId][props.dataField].buckets
			: [],
	range: state.aggregations[`${props.componentId}__range__internal`]
		&& state.aggregations[`${props.componentId}__range__internal`].min
		? {
			start: state.aggregations[`${props.componentId}__range__internal`].min.value,
			end: state.aggregations[`${props.componentId}__range__internal`].max.value,
		}
		: null,
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
	setQueryOptions: (component, props, execute) =>
		dispatch(setQueryOptions(component, props, execute)),
});

export default connect(mapStateToProps, mapDispatchtoProps)(DynamicRangeSlider);
