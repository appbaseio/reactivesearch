import React, { Component } from "react";
import { connect } from "react-redux";
import { FlatList, View } from "react-native";
import { Text, Spinner } from "native-base";

import { addComponent, removeComponent, watchComponent, setQueryOptions, loadMore } from "../actions";
import { isEqual, getQueryOptions } from "../utils/helper";

class ReactiveList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			from: 0,
			isLoading: false
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
		if (nextProps.hits && this.props.hits && nextProps.hits.length < this.props.hits.length) {
			this.refs.listRef.scrollToOffset({ x: 0, y: 0, animated: false });
			this.setState({
				from: 0,
				isLoading: false
			});
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
		if (this.props.hits) {
			const value = this.state.from + this.props.size;
			const options = getQueryOptions(this.props);
			this.setState({
				from: value,
				isLoading: true
			});
			this.props.loadMore(this.props.componentId, {
				...options,
				from: value
			});
		}
	};

	render() {
		return (
			<View>
				<FlatList
					ref="listRef"
					style={{ width: "100%" }}
					data={this.props.hits ? this.props.hits : []}
					keyExtractor={(item) => item._id}
					renderItem={({ item }) => this.props.onData(item)}
					onEndReachedThreshold={0.5}
					onEndReached={this.loadMore}
				/>
				{
					this.state.isLoading
						? (<View>
							<Spinner />
						</View>)
						: null
				}
			</View>
		);
	}
}

const mapStateToProps = (state, props) => ({
	hits: state.hits[props.componentId]
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	setQueryOptions: (component, props) => dispatch(setQueryOptions(component, props)),
	loadMore: (component, options) => dispatch(loadMore(component, options))
});

export default connect(mapStateToProps, mapDispatchtoProps)(ReactiveList);
