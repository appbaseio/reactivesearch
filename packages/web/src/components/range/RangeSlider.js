import React, { Component } from "react";
import { connect } from "react-redux";
import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryOptions
} from "@appbaseio/reactivecore/lib/actions";
import {
	isEqual,
	checkValueChange,
	checkPropChange,
	checkSomePropChange,
	getClassName
} from "@appbaseio/reactivecore/lib/utils/helper";
import types from "@appbaseio/reactivecore/lib/utils/types";
import Rheostat from "rheostat";

import HistogramContainer from "./addons/HistogramContainer";
import RangeLabel from "./addons/RangeLabel";
import Slider from "../../styles/Slider";
import Title from "../../styles/Title";
import { rangeLabelsContainer } from "../../styles/Label";

class RangeSlider extends Component {
	constructor(props) {
		super(props);

		this.state = {
			width: 0,
			currentValue: [props.range.start, props.range.end],
			stats: []
		};
		this.internalComponent = this.props.componentId + "__internal";
	}

	componentWillMount() {
		this.props.addComponent(this.props.componentId);
		this.props.addComponent(this.internalComponent);

		this.updateQueryOptions(this.props);
		this.setReact(this.props);

		if (this.props.selectedValue) {
			this.handleChange(this.props.selectedValue);
		} else if (this.props.defaultSelected) {
			this.handleChange([
				this.props.defaultSelected.start,
				this.props.defaultSelected.end
			]);
		}
	}

	componentWillReceiveProps(nextProps) {
		checkPropChange(this.props.react, nextProps.react, () =>
			this.setReact(nextProps)
		);
		checkSomePropChange(
			this.props,
			nextProps,
			["showHistogram", "interval"],
			() => this.updateQueryOptions(nextProps)
		);
		checkPropChange(this.props.options, nextProps.options, () => {
			const { options } = nextProps;
			options.sort(function(a, b) {
				if (a.key < b.key) return -1;
				if (a.key > b.key) return 1;
				return 0;
			});
			this.setState({
				stats: options
			});
		});
		if (!isEqual(this.props.defaultSelected, nextProps.defaultSelected)) {
			this.handleChange(
				[nextProps.defaultSelected.start, nextProps.defaultSelected.end],
				nextProps
			);
		} else if (!isEqual(this.state.currentValue, nextProps.selectedValue)) {
			this.handleChange(nextProps.selectedValue);
		}
	}

	shouldComponentUpdate(nextProps) {
		const upperLimit = Math.floor((nextProps.range.end - nextProps.range.start) / 2);
		if (nextProps.stepValue < 1 || nextProps.stepValue > upperLimit) {
			console.warn(`stepValue for RangeSlider ${nextProps.componentId} should be greater than 0 and less than or equal to ${upperLimit}`);
			return false;
		}
		return true;
	}

	componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
	}

	setReact = props => {
		const { react } = props;
		if (react) {
			const newReact = pushToAndClause(react, this.internalComponent);
			props.watchComponent(props.componentId, newReact);
		} else {
			props.watchComponent(props.componentId, { and: this.internalComponent });
		}
	};

	defaultQuery = (value, props) => {
		if (Array.isArray(value) && value.length) {
			return {
				range: {
					[props.dataField]: {
						gte: value[0],
						lte: value[1],
						boost: 2.0
					}
				}
			};
		}
		return null;
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
			console.error(`${props.componentId}: interval prop's value should be greater than or equal to ${min}`);
			return min;
		} else {
			return props.interval;
		}
	};

	histogramQuery = (props) => {
		return {
			[props.dataField]: {
				histogram: {
					field: props.dataField,
					interval: this.getValidInterval(props),
					offset: props.range.start
				}
			}
		};
	};

	handleChange = (currentValue, props = this.props) => {
		const performUpdate = () => {
			this.setState({
				currentValue
			}, () => {
				this.updateQuery([currentValue[0], currentValue[1]], props);
			});
		};
		checkValueChange(
			props.componentId,
			{
				start: currentValue[0],
				end: currentValue[1]
			},
			props.beforeValueChange,
			props.onValueChange,
			performUpdate
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
			showFilter: false,	// disable filters for RangeSlider
			URLParams: props.URLParams,
			onQueryChange
		});
	};

	updateQueryOptions = (props) => {
		if (props.showHistogram) {
			const queryOptions = {
				aggs: this.histogramQuery(props)
			};

			props.setQueryOptions(this.internalComponent, queryOptions, false);

			const query = props.customQuery || this.defaultQuery;

			props.updateQuery({
				componentId: this.internalComponent,
				query: query([props.range.start, props.range.end], props)
			});
		}
	};

	render() {
		return (
			<Slider primary style={this.props.style} className={this.props.className}>
				{this.props.title && <Title className={getClassName(this.props.innerClass, "title") || null}>{this.props.title}</Title>}
				{this.state.stats.length && this.props.showHistogram ? (
					<HistogramContainer
						stats={this.state.stats}
						range={this.props.range}
						interval={this.getValidInterval(this.props)}
					/>
				) : null}
				<Rheostat
					min={this.props.range.start}
					max={this.props.range.end}
					values={this.state.currentValue}
					onChange={this.handleSlider}
					snap={this.props.snap}
					snapPoints={this.props.snap ? this.getSnapPoints() : null}
					className={getClassName(this.props.innerClass, "slider")}
				/>
				{
					this.props.rangeLabels &&
					<div className={rangeLabelsContainer}>
						<RangeLabel align="left">{this.props.rangeLabels.start}</RangeLabel>
						<RangeLabel align="right">{this.props.rangeLabels.end}</RangeLabel>
					</div>
				}
			</Slider>
		);
	}
}

RangeSlider.propTypes = {
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
	rangeLabels: types.rangeLabels,
	selectedValue: types.selectedValue,
	style: types.style,
	className: types.string,
	snap: types.bool,
	innerClass: types.style
};

RangeSlider.defaultProps = {
	range: {
		start: 0,
		end: 10
	},
	stepValue: 1,
	showHistogram: true,
	URLParams: false,
	style: {},
	className: null,
	snap: true
};

const mapStateToProps = (state, props) => ({
	options: state.aggregations[props.componentId]
		? state.aggregations[props.componentId][props.dataField].buckets
		: [],
	selectedValue: state.selectedValues[props.componentId] ? state.selectedValues[props.componentId].value : [
		props.range.start,
		props.range.end
	]
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	setQueryOptions: (component, props, execute) => dispatch(setQueryOptions(component, props, execute))
});

export default connect(mapStateToProps, mapDispatchtoProps)(RangeSlider);
