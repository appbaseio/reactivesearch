import React, { Component } from 'react';
import { View, Platform } from 'react-native';
import { connect } from 'react-redux';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryOptions,
	pushToAndClause,
} from '@appbaseio/reactivecore/lib/actions';
import { checkValueChange, checkPropChange } from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';

import Histogram from './addons/Histogram';

class RangeSlider extends Component {
	constructor(props) {
		super(props);

		this.state = {
			width: 0,
			currentValue: [props.range.start, props.range.end],
			stats: [],
		};
		this.internalComponent = `${this.props.componentId}__internal`;
	}

	componentDidMount() {
		this.props.addComponent(this.props.componentId);
		this.props.addComponent(this.internalComponent);
		this.setReact(this.props);

		const queryOptions = {
			aggs: this.histogramQuery(),
		};

		this.props.setQueryOptions(this.internalComponent, queryOptions);
		// Since the queryOptions are attached to the internal component,
		// we need to notify the subscriber (parent component)
		// that the query has changed because no new query will be
		// auto-generated for the internal component as its
		// dependency tree is empty
		this.props.updateQuery(this.internalComponent, null);

		if (this.props.defaultSelected) {
			this.handleChange([this.props.defaultSelected.start, this.props.defaultSelected.end]);
		}
	}

	componentWillReceiveProps(nextProps) {
		checkPropChange(
			this.props.react,
			nextProps.react,
			() => this.setReact(nextProps),
		);
		checkPropChange(
			this.props.options,
			nextProps.options,
			() => {
				const { options } = nextProps;
				options.sort((a, b) => {
					if (a.key < b.key) return -1;
					if (a.key > b.key) return 1;
					return 0;
				});
				this.setState({
					stats: options,
				});
			},
		);
		checkPropChange(
			this.props.defaultSelected,
			nextProps.defaultSelected,
			() => this.handleChange([
				nextProps.defaultSelected.start, nextProps.defaultSelected.end,
			], nextProps),
		);
	}

	componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
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

	histogramQuery = () => ({
		[this.props.dataField]: {
			histogram: {
				field: this.props.dataField,
				interval: this.props.interval
				|| Math.ceil((this.props.range.end - this.props.range.start) / 10),
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
		const performUpdate = () => {
			this.setState({
				currentValue,
			});
			this.updateQuery(currentValue, props);
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

	updateQuery = (value, props) => {
		const query = props.customQuery || this.defaultQuery;
		let callback = null;
		if (props.onQueryChange) {
			callback = props.onQueryChange;
		}
		props.updateQuery(props.componentId, query(value, props), value, props.filterLabel, callback);
	}

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
			<View style={{ paddingTop: 25 }}>
				<View onLayout={e => this.setWidth(e.nativeEvent.layout.width)}>
					{
						this.state.stats.length && this.props.showHistogram
							? (<Histogram
								stats={this.state.stats}
								range={this.props.range}
								interval={this.props.interval
									|| Math.ceil((this.props.range.end - this.props.range.start) / 10)}
								paddingHorizontal={Platform.OS === 'ios' ? 15 : 6}
							/>)
							: null
					}
					{
						this.state.width
							? (<MultiSlider
								values={this.state.currentValue}
								min={this.props.range.start}
								max={this.props.range.end}
								step={this.props.stepValue}
								allowOverlap={false}
								snapped
								containerStyle={styles}
								sliderLength={this.state.width}
								onValuesChangeFinish={this.handleChange}
							/>)
							: null
					}
				</View>
			</View>
		);
	}
}

RangeSlider.propTypes = {
	range: types.range,
	componentId: types.componentId,
	addComponent: types.addComponent,
	setQueryOptions: types.setQueryOptions,
	updateQuery: types.updateQuery,
	defaultSelected: types.range,
	react: types.react,
	options: types.options,
	removeComponent: types.removeComponent,
	dataField: types.dataField,
	interval: types.interval,
	beforeValueChange: types.beforeValueChange,
	onValueChange: types.onValueChange,
	customQuery: types.customQuery,
	onQueryChange: types.onQueryChange,
	showHistogram: types.showHistogram,
	stepValue: types.stepValue,
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
		? state.aggregations[props.componentId][props.dataField].buckets : [],
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	updateQuery: (component, query, value, filterLabel, onQueryChange) =>
		dispatch(updateQuery(component, query, value, filterLabel, onQueryChange)),
	setQueryOptions: (component, props, onQueryChange) =>
		dispatch(setQueryOptions(component, props, onQueryChange)),
});

export default connect(mapStateToProps, mapDispatchtoProps)(RangeSlider);
