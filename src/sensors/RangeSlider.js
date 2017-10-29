import React, { Component } from "react";
import { View, Platform } from "react-native";
import { connect } from "react-redux";
import MultiSlider from "@ptomasroos/react-native-multi-slider";

import Histogram from "./addons/Histogram";
import { addComponent, removeComponent, watchComponent, updateQuery, setQueryOptions } from "../actions";
import { isEqual, checkValueChange } from "../utils/helper";

class RangeSlider extends Component {
	constructor(props) {
		super(props);

		this.state = {
			width: 0,
			currentValue: [props.range.start, props.range.end]
		};
		this.internalComponent = this.props.componentId + "__internal";
	}

	componentDidMount() {
		this.props.addComponent(this.props.componentId);
		this.props.addComponent(this.internalComponent);
		this.setReact(this.props);

		const queryOptions = {
			aggs: this.histogramQuery()
		};
		this.props.setQueryOptions(this.internalComponent, queryOptions);
		this.props.updateQuery(this.internalComponent, null);
		if (this.props.defaultSelected) {
			this.handleChange([ this.props.defaultSelected.start, this.props.defaultSelected.end ]);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (!isEqual(nextProps.react, this.props.react)) {
			this.setReact(nextProps);
		}
		if (!isEqual(this.props.options, nextProps.options)) {
			const { options } = nextProps;
			options.sort(function(a, b){
				if(a.key < b.key) return -1;
				if(a.key > b.key) return 1;
				return 0;
			});
			this.setState({
				stats: options
			});
		}
		if (this.props.defaultSelected !== nextProps.defaultSelected) {
			this.handleChange([ nextProps.defaultSelected.start, nextProps.defaultSelected.end ]);
		}
	}

	componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
	}

	setReact(props) {
		const { react } = props;
		if (react) {
			newReact = pushToAndClause(react, this.internalComponent)
			props.watchComponent(props.componentId, newReact);
		} else {
			props.watchComponent(props.componentId, { and: this.internalComponent });
		}
	}

	defaultQuery = (value) => {
		if (Array.isArray(value) && value.length) {
			return {
				range: {
					[this.props.dataField]: {
						gte: value[0],
						lte: value[1],
						boost: 2.0
					}
				}
			};
		}
		return null;
	};

	histogramQuery = () => {
		return {
			[this.props.dataField]: {
				histogram: {
					field: this.props.dataField,
					interval: this.props.interval || Math.ceil((this.props.range.end - this.props.range.start) / 10)
				}
			}
		};
	};

	setWidth = (width) => {
		const margin = Platform.OS === "ios" ? 30 : 12;
		this.setState({
			width: width - margin
		})
	};

	handleChange = (currentValue) => {
		const performUpdate = () => {
			this.setState({
				currentValue
			});
			this.updateQuery(currentValue);
		}
		checkValueChange(
			this.props.componentId,
			{
				start: currentValue[0],
				end: currentValue[1]
			},
			this.props.beforeValueChange,
			this.props.onValueChange,
			performUpdate
		);
	};

	updateQuery = (value) => {
		const query = this.props.customQuery || this.defaultQuery;
		let callback = null;
		if (this.props.onQueryChange) {
			callback = this.props.onQueryChange;
		}
		this.props.updateQuery(this.props.componentId, query(value), callback);
	}

	render() {
		const styles = {
			height: 30,
			...Platform.select({
				ios: {
					paddingHorizontal: 15
				},
				android: {
					paddingHorizontal: 6
				}
			})
		};
		return (
			<View style={{ paddingTop: 25 }}>
				<View onLayout={(e) => this.setWidth(e.nativeEvent.layout.width)}>
					{
						this.state.stats && this.props.showHistogram
							? <Histogram stats={this.state.stats} range={this.props.range} paddingHorizontal={Platform.OS === "ios" ? 15 : 6} />
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

RangeSlider.defaultProps = {
	range: {
		start: 0,
		end: 10
	},
	stepValue: 1,
	showHistogram: true
};

const mapStateToProps = (state, props) => ({
	options: state.aggregations[props.componentId] ? state.aggregations[props.componentId][props.dataField].buckets : []
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	updateQuery: (component, query, onQueryChange) => dispatch(updateQuery(component, query, onQueryChange)),
	setQueryOptions: (component, props, onQueryChange) => dispatch(setQueryOptions(component, props, onQueryChange))
});

export default connect(mapStateToProps, mapDispatchtoProps)(RangeSlider);
