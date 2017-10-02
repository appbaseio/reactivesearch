import React, { Component } from "react";
import { connect } from "react-redux";
import { FlatList, View } from "react-native";
import { Text, Spinner, Button } from "native-base";

import { addComponent, removeComponent, watchComponent, setQueryOptions, loadMore } from "../actions";
import { isEqual, getQueryOptions } from "../utils/helper";

class ReactiveList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			from: 0,
			isLoading: false,
			totalPages: 0,
			currentPage: 0
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
		if (!nextProps.pagination && nextProps.hits && this.props.hits && nextProps.hits.length < this.props.hits.length) {
			this.refs.listRef.scrollToOffset({ x: 0, y: 0, animated: false });
			this.setState({
				from: 0,
				isLoading: false
			});
		}
		if (nextProps.pagination && nextProps.total !== this.props.total) {
			this.setState({
				totalPages: nextProps.total / nextProps.pages,
				currentPage: 0
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
		if (this.props.hits && !this.props.pagination) {
			const value = this.state.from + this.props.size;
			const options = getQueryOptions(this.props);
			this.setState({
				from: value,
				isLoading: true
			});
			this.props.loadMore(this.props.componentId, {
				...options,
				from: value
			}, true);
		}
	};

	prevPage = () => {
		if (this.state.currentPage) {
			const value = this.state.from - this.props.size;
			const options = getQueryOptions(this.props);
			this.setState({
				from: value,
				isLoading: true,
				currentPage: this.state.currentPage - 1
			});
			this.props.loadMore(this.props.componentId, {
				...options,
				from: value
			}, false);
		}
	}

	nextPage = () => {
		if (this.state.currentPage < this.state.totalPages) {
			const value = this.state.from + this.props.size;
			const options = getQueryOptions(this.props);
			this.setState({
				from: value,
				isLoading: true,
				currentPage: this.state.currentPage + 1
			});
			this.props.loadMore(this.props.componentId, {
				...options,
				from: value
			}, false);
		}
	}

	renderPagination = () => {
		return (
			<View style={{flexDirection: "row", justifyContent: "space-between", marginTop: 20, marginBottom: 20}}>
				<Button light disabled={this.state.currentPage === 0} onPress={this.prevPage}>
					<Text>Prev</Text>
				</Button>
				<Button light disabled={this.state.currentPage >= this.state.totalPages} onPress={this.nextPage}>
					<Text>Next</Text>
				</Button>
			</View>
		)
	}

	render() {
		return (
			<View>
				{
					this.props.pagination
						? this.renderPagination()
						: null
				}
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
					this.state.isLoading && !this.props.pagination
						? (<View>
							<Spinner />
						</View>)
						: null
				}
			</View>
		);
	}
}

ReactiveList.defaultProps = {
	pagination: false,
	pages: 10
}

const mapStateToProps = (state, props) => ({
	hits: state.hits[props.componentId] && state.hits[props.componentId].hits,
	total: state.hits[props.componentId] && state.hits[props.componentId].total
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	setQueryOptions: (component, props) => dispatch(setQueryOptions(component, props)),
	loadMore: (component, options, append) => dispatch(loadMore(component, options, append))
});

export default connect(mapStateToProps, mapDispatchtoProps)(ReactiveList);
