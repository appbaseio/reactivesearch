import React, { Component } from 'react';
import { View, Platform } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

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
	pushToAndClause,
	getInnerKey,
} from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';

import Histogram from './addons/Histogram';
import withTheme from '../../theme/withTheme';
import { connect } from '../../utils';

class RangeSlider extends Component {
	constructor(props) {
		super(props);

		this.state = {
			width: 0,
			currentValue: [props.range.start, props.range.end],
			stats: [],
		};

		this.locked = false;
		this.internalComponent = `${this.props.componentId}__internal`;
		props.setQueryListener(props.componentId, props.onQueryChange, null);
	}

	componentDidMount() {
		this.props.addComponent(this.props.componentId);
		this.props.addComponent(this.internalComponent);

		this.updateQueryOptions(this.props);
		this.setReact(this.props);

		if (this.props.selectedValue) {
			this.handleChange(this.props.selectedValue);
		} else if (this.props.defaultSelected) {
			this.handleChange([this.props.defaultSelected.start, this.props.defaultSelected.end]);
		}
	}

	componentWillReceiveProps(nextProps) {
		checkPropChange(this.props.react, nextProps.react, () => this.setReact(nextProps));
		checkSomePropChange(this.props, nextProps, ['showHistogram', 'interval'], () =>
			this.updateQueryOptions(nextProps),
		);
		checkPropChange(this.props.options, nextProps.options, () => {
			const { options } = nextProps;
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

		checkPropChange(this.props.dataField, nextProps.dataField, () => {
			this.updateQueryOptions(nextProps);
			this.handleChange(this.state.currentValue, nextProps);
		});

		if (!isEqual(this.props.defaultSelected, nextProps.defaultSelected)) {
			this.handleChange(
				[nextProps.defaultSelected.start, nextProps.defaultSelected.end],
				nextProps,
			);
		} else if (!isEqual(this.state.currentValue, nextProps.selectedValue)) {
			this.handleChange(
				nextProps.selectedValue || [nextProps.range.start, nextProps.range.end],
			);
		}
	}

	shouldComponentUpdate(nextProps) {
		const upperLimit = Math.floor((nextProps.range.end - nextProps.range.start) / 2);
		if (nextProps.stepValue < 1 || nextProps.stepValue > upperLimit) {
			console.warn(
				`stepValue for RangeSlider ${
					nextProps.componentId
				} should be greater than 0 and less than or equal to ${upperLimit}`,
			);
			return false;
		}
		return true;
	}

	componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
		this.props.removeComponent(this.internalComponent);
	}

	setReact = (props) => {
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
						boost: 2.0,
					},
				},
			};
		}
		return null;
	};

	getValidInterval = (props) => {
		const min = Math.ceil((props.range.end - props.range.start) / 100) || 1;
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

	histogramQuery = props => ({
		[props.dataField]: {
			histogram: {
				field: props.dataField,
				interval: this.getValidInterval(props),
				offset: props.range.start,
			},
		},
	});

	setWidth = (width) => {
		const margin = Platform.OS === 'ios' ? 30 : 12;
		this.setState({
			width: width - margin,
		});
	};

	handleChange = (currentValue, props = this.props) => {
		// ignore state updates when component is locked
		if (props.beforeValueChange && this.locked) {
			return;
		}

		this.locked = true;
		const performUpdate = () => {
			this.setState(
				{
					currentValue,
				},
				() => {
					this.updateQuery([currentValue[0], currentValue[1]], props);
					this.locked = false;
					if (props.onValueChange) {
						props.onValueChange({
							start: currentValue[0],
							end: currentValue[1],
						});
					}
				},
			);
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

	updateQuery = (value, props) => {
		const query = props.customQuery || this.defaultQuery;

		props.updateQuery({
			componentId: props.componentId,
			query: query(value, props),
			value,
			label: props.filterLabel,
			showFilter: false,
			URLParams: false,
		});
	};

	updateQueryOptions = (props) => {
		if (props.showHistogram) {
			const queryOptions = {
				size: 0,
				aggs: (props.histogramQuery || this.histogramQuery)(props),
			};

			props.setQueryOptions(this.internalComponent, queryOptions, false);

			const query = props.customQuery || this.defaultQuery;

			props.updateQuery({
				componentId: this.internalComponent,
				query: query([props.range.start, props.range.end], props),
			});
		}
	};

	render() {
		const styles = {
			height: 30,
			...Platform.select({
				ios: {
					paddingHorizontal: 15,
				},
				android: {
					paddingHorizontal: 6,
				},
			}),
		};
		return (
			<View style={{ paddingTop: 25, ...this.props.style }}>
				<View onLayout={e => this.setWidth(e.nativeEvent.layout.width)}>
					{this.state.stats.length && this.props.showHistogram ? (
						<Histogram
							stats={this.state.stats}
							range={this.props.range}
							interval={
								this.props.interval
								|| Math.ceil((this.props.range.end - this.props.range.start) / 10)
							}
							paddingHorizontal={Platform.OS === 'ios' ? 15 : 6}
							barStyle={getInnerKey(this.props.innerStyle, 'histogramBar')}
						/>
					) : null}
					{this.state.width ? (
						<MultiSlider
							values={this.state.currentValue}
							min={this.props.range.start}
							max={this.props.range.end}
							step={this.props.stepValue}
							allowOverlap={false}
							snapped
							containerStyle={styles}
							selectedStyle={{
								backgroundColor: this.props.theming.primaryColor,
							}}
							sliderLength={this.state.width}
							onValuesChangeFinish={this.handleChange}
							{...getInnerKey(this.props.innerProps, 'slider')}
						/>
					) : null}
				</View>
			</View>
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
	setQueryListener: types.funcRequired,
	dataField: types.stringRequired,
	interval: types.number,
	beforeValueChange: types.func,
	onValueChange: types.func,
	customQuery: types.func,
	histogramQuery: types.func,
	onQueryChange: types.func,
	showHistogram: types.bool,
	stepValue: types.number,
	title: types.title,
	filterLabel: types.string,
	rangeLabels: types.rangeLabels,
	selectedValue: types.selectedValue,
	style: types.style,
	theming: types.style,
	innerStyle: types.style,
	innerProps: types.props,
};

RangeSlider.defaultProps = {
	range: {
		start: 0,
		end: 10,
	},
	stepValue: 1,
	showHistogram: true,
};

const mapStateToProps = (state, props) => ({
	options: state.aggregations[props.componentId]
		? state.aggregations[props.componentId][props.dataField]
		  && state.aggregations[props.componentId][props.dataField].buckets // eslint-disable-line
		: [],
	selectedValue: state.selectedValues[props.componentId]
		? state.selectedValues[props.componentId].value
		: null,
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	setQueryOptions: (component, props, execute) =>
		dispatch(setQueryOptions(component, props, execute)),
	setQueryListener: (component, onQueryChange, beforeQueryChange) =>
		dispatch(setQueryListener(component, onQueryChange, beforeQueryChange)),
});

export default connect(
	mapStateToProps,
	mapDispatchtoProps,
)(withTheme(RangeSlider));
