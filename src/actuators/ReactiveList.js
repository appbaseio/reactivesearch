import React, { Component } from "react";
import { connect } from "react-redux";
import { Text, FlatList } from "react-native";

import { addComponent, removeComponent, watchComponent, setQueryOptions, loadMore } from "../actions";
import { isEqual, getQueryOptions } from "../utils/helper";

class ReactiveList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			from: props.from
		};
	}

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
	}

	componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
	}

	setReact(props) {
		if (props.react) {
			props.watchComponent(props.componentId, props.react);
		}
	}

	loadMore = () => {
		console.log("called");
		const value = this.state.from + this.props.size;
		const options = getQueryOptions(this.props);
		this.setState({
			from: value
		});
		this.props.loadMore(this.props.componentId, {
			...options,
			from: value
		});
	}

	render() {
		return (
			<FlatList
				ref="listRef"
				style={{width: "100%"}}
				data={this.props.hits[this.props.componentId] ? this.props.hits[this.props.componentId] : []}
				keyExtractor={(item) => item._id}
				renderItem={({item}) => this.props.onData(item)}
				onEndReachedThreshold={0.5}
				onEndReached={this.loadMore}
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
	setQueryOptions: (component, props) => dispatch(setQueryOptions(component, props)),
	loadMore: (component, options) => dispatch(loadMore(component, options))
});

export default connect(mapStateToProps, mapDispatchtoProps)(ReactiveList);
