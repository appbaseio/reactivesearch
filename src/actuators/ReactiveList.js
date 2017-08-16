import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Text } from "react-native";

import { addComponent, removeComponent, watchComponent } from "../actions";
import { isEqual } from "../utils/helper";

class ReactiveList extends Component {
	componentDidMount() {
		this.props.addComponent(this.props.componentId);
		this.setReact(this.props);
	}

	componentWillReceiveProps(nextProps) {
		if (!isEqual(nextProps.react, this.props.react)) {
			this.setReact(nextProps);
		}
		console.log(nextProps.hits[nextProps.componentId]);
	}

	componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
	}

	setReact(props) {
		if (props.react) {
			props.watchComponent(props.componentId, props.react);
		}
	}

	render() {
		return <View><Text>This is ReactiveList</Text></View>
	}
}

const mapStateToProps = state => ({
	components: state.components,
	hits: state.hits
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react))
});

export default connect(mapStateToProps, mapDispatchtoProps)(ReactiveList);
