import React, { Component } from "react";
import { connect } from "react-redux";
import { View } from "react-native";
import { Text, Spinner, Button, Icon } from "native-base";

import List from "./addons/List";
import {
	addComponent,
	removeComponent,
	watchComponent,
	setQueryOptions,
	updateQuery,
	loadMore
} from "@appbaseio/reactivecore/lib/actions";
import {
	isEqual,
	getQueryOptions,
	pushToAndClause,
	checkPropChange,
	checkSomePropChange
} from "@appbaseio/reactivecore/lib/utils/helper";

import types from "@appbaseio/reactivecore/lib/utils/types";

class ReactiveList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			from: 0,
			isLoading: false,
			totalPages: 0,
			currentPage: 0
		};
		this.listRef = null;
		this.internalComponent = this.props.componentId + "__internal";
	}

	componentDidMount() {
		this.props.addComponent(this.internalComponent);
		this.props.addComponent(this.props.componentId);

		const options = getQueryOptions(this.props);
		if (this.props.sortBy) {
			options.sort = [{
				[this.props.dataField]: {
					order: this.props.sortBy
				}
			}];
		}

		// Override sort query with defaultQuery's sort if defined
		let defaultQuery = null;
		if (this.props.defaultQuery) {
			defaultQuery = this.props.defaultQuery();
			if (defaultQuery.sort) {
				options.sort = defaultQuery.sort;
			}
		}

		this.props.setQueryOptions(this.props.componentId, options);
		this.setReact(this.props);

		if (defaultQuery) {
			let { sort, ...query } = defaultQuery;
			this.props.updateQuery(this.internalComponent, query);
		} else {
			this.props.updateQuery(this.internalComponent, null);
		}
	}

	componentWillReceiveProps(nextProps) {
		checkSomePropChange(
			this.props,
			nextProps,
			["sortBy", "size"],
			() => {
				const options = getQueryOptions(nextProps);
				if (nextProps.sortBy) {
					options.sort = [{
						[nextProps.dataField]: {
							order: nextProps.sortBy
						}
					}];
				}
				nextProps.setQueryOptions(nextProps.componentId, options);
			}
		);

		checkPropChange(
			this.props.react,
			nextProps.react,
			() => this.setReact(nextProps)
		);

		if (!nextProps.pagination && nextProps.hits && this.props.hits && nextProps.hits.length < this.props.hits.length) {
			if (this.listRef) {
				this.listRef.scrollToOffset({ x: 0, y: 0, animated: false });
			}
			this.setState({
				from: 0,
				isLoading: false
			});
		}

		if (nextProps.pagination) {
			checkSomePropChange(
				this.props,
				nextProps,
				["total", "pagination"],
				() => {
					this.setState({
						totalPages: nextProps.total / nextProps.size,
						currentPage: 0
					});
				}
			);
		}
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

	loadMore = () => {
		if (this.props.hits && !this.props.pagination && this.props.total !== this.props.hits.length) {
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
		} else if (this.state.isLoading) {
			this.setState({
				isLoading: false
			});
		}
	};

	setPage = (page) => {
		const value = this.props.size * page;
		const options = getQueryOptions(this.props);
		this.setState({
			from: value,
			isLoading: true,
			currentPage: page
		});
		this.props.loadMore(this.props.componentId, {
			...options,
			from: value
		}, false);
	};

	prevPage = () => {
		if (this.state.currentPage) {
			this.setPage(this.state.currentPage-1);
		}
	};

	nextPage = () => {
		if (this.state.currentPage < this.state.totalPages-1) {
			this.setPage(this.state.currentPage+1);
		}
	};

	getStart = () => {
		const midValue = parseInt(this.props.pages/2, 10);
		const start =  this.state.currentPage - midValue;
		return start > 1 ? start : 2;
	};

	renderPagination = () => {
		let start = this.getStart(),
			pages = [];

		for (let i = start; i < start + this.props.pages - 1; i++) {
			const pageBtn = (
				<Button key={i-1} light primary={this.state.currentPage === i-1} onPress={() => this.setPage(i-1)}>
					<Text>{i}</Text>
				</Button>
			);
			if (i <= this.state.totalPages+1) {
				pages.push(pageBtn);
			}
		}

		if (!this.state.totalPages) {
			return null;
		}

		return (
			<View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20, marginBottom: 20 }}>
				<Button light disabled={this.state.currentPage === 0} onPress={this.prevPage}>
					<Icon name="ios-arrow-back" />
				</Button>
				{
					<Button light primary={this.state.currentPage === 0} onPress={() => this.setPage(0)}>
						<Text>1</Text>
					</Button>
				}
				{
					pages
				}
				<Button light disabled={this.state.currentPage >= this.state.totalPages-1} onPress={this.nextPage}>
					<Icon name="ios-arrow-forward" />
				</Button>
			</View>
		)
	}

	setRef = (node) => {
		this.listRef = node;
	}

	highlightResults = (result) => {
		const data = { ...result };
		if (data.highlight) {
			Object.keys(data.highlight).forEach((highlightItem) => {
				const highlightValue = data.highlight[highlightItem][0];
				data._source = Object.assign({}, data._source, { [highlightItem]: highlightValue });
			});
		}
		return data;
	}

	parseHits = (hits) => {
		let results = null;
		if (hits) {
			results = [...hits].map(this.highlightResults);
		}
		return results;
	}

	render() {
		return (
			<View>
				{
					this.props.pagination
						? this.renderPagination()
						: null
				}
				{
					this.props.onAllData
						? (this.props.onAllData(this.parseHits(this.props.hits), this.loadMore))
						: (<List
							setRef={this.setRef}
							data={this.parseHits(this.props.hits)}
							onData={this.props.onData}
							onEndReached={this.loadMore}
						/>)
				}
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

ReactiveList.propTypes = {
	addComponent: types.addComponent,
	componentId: types.componentId,
	sortBy: types.sortBy,
	dataField: types.dataField,
	setQueryOptions: types.setQueryOptions,
	defaultQuery: types.defaultQuery,
	updateQuery: types.updateQuery,
	size: types.size,
	react: types.react,
	pagination: types.pagination,
	hits: types.hits,
	total: types.total,
	removeComponent: types.removeComponent,
	loadMore: types.loadMore,
	pages: types.pages,
	onAllData: types.onAllData,
	onData: types.onData
}

ReactiveList.defaultProps = {
	pagination: false,
	pages: 5,
	size: 10,
	from: 0
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
	updateQuery: (component, query) => dispatch(updateQuery(component, query)),
	loadMore: (component, options, append) => dispatch(loadMore(component, options, append))
});

export default connect(mapStateToProps, mapDispatchtoProps)(ReactiveList);
