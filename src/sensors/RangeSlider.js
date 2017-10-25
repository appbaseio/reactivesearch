import React, { Component } from "react";
import { View, Platform } from "react-native";
import { connect } from "react-redux";
import MultiSlider from "@ptomasroos/react-native-multi-slider";

import { addComponent, removeComponent, watchComponent, updateQuery } from "../actions";
import { isEqual } from "../utils/helper";

class RangeSlider extends Component {
	constructor(props) {
		super(props);

		this.state = {
			width: 0,
			currentValue: [props.range.start, props.range.end]
		};
	}

	componentDidMount() {
		this.props.addComponent(this.props.componentId);
		this.setReact(this.props);
	}

	componentWillReceiveProps(nextProps) {
		if (!isEqual(nextProps.react, this.props.react)) {
			this.setReact(nextProps);
		}
	}

	componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
	}

	setReact(props) {
		if (props.react) {
			props.watchComponent(props.componentId, props.react);
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

	setWidth = (width) => {
		this.setState({
			width
		})
	};

	handleChange = (currentValue) => {
		this.setState({
			currentValue
		});

		const query = this.props.customQuery || this.defaultQuery;
		const callback = this.props.onQueryChange || null;
		this.props.updateQuery(this.props.componentId, query(currentValue), callback);
	};

	render() {
		const styles = {
			...Platform.select({
				ios: {
					paddingHorizontal: 15
				},
				android: {
					paddingHorizontal: 6
				},
			})
		}
		return (
			<View style={styles}>
				<View onLayout={(e) => this.setWidth(e.nativeEvent.layout.width)}>
					{
						this.state.width
						? (<MultiSlider
							values={this.state.currentValue}
							min={this.props.range.start}
							max={this.props.range.end}
							step={this.props.stepValue}
							allowOverlap={false}
							snapped
							containerStyle={{
								paddingVertical: 25,
							}}
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
	stepValue: 1
};

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	updateQuery: (component, query, onQueryChange) => dispatch(updateQuery(component, query, onQueryChange))
});

export default connect(null, mapDispatchtoProps)(RangeSlider);
