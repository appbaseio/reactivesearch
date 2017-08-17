import React, { Component } from "react";
import { connect } from "react-redux";
import { Text, FlatList } from "react-native";

import { addComponent, removeComponent, watchComponent, setQueryOptions } from "../actions";
import { isEqual, getQueryOptions } from "../utils/helper";

class ReactiveList extends Component {
	componentDidMount() {
		this.props.addComponent(this.props.componentId);
		this.setReact(this.props);
		const options = getQueryOptions(this.props);
		this.props.setQueryOptions(this.props.componentId, options);
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
		return (
			<FlatList
				data={this.props.hits[this.props.componentId] ? this.props.hits[this.props.componentId] : []}
				keyExtractor={(item) => item._id}
				renderItem={({item}) => <Text>{item._source.name}</Text>}
			/>
		);
	}
}

const mapStateToProps = state => ({
	components: state.components,
	hits: state.hits
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	setQueryOptions: (component, props) => dispatch(setQueryOptions(component, props))
});

export default connect(mapStateToProps, mapDispatchtoProps)(ReactiveList);
