import React, { Component } from "react";
import { connect } from "react-redux";

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
	pushToAndClause
} from "@appbaseio/reactivecore/lib/utils/helper";
import types from "@appbaseio/reactivecore/lib/utils/types";

import Button, { pagination } from "../../styles/Button";

class ReactiveList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			from: 0,
			isLoading: false,
			totalPages: 0,
			currentPage: 0
		};
		this.internalComponent = props.componentId + "__internal";
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
			this.props.updateQuery({
				componentId: this.internalComponent,
				query
			});
		} else {
			this.props.updateQuery({
				componentId: this.internalComponent,
				query: null
			});
		}

		if (!this.props.pagination) {
			window.addEventListener("scroll", this.scrollHandler);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.sortBy !== nextProps.sortBy || this.props.size !== nextProps.size) {
			const options = getQueryOptions(nextProps);
			if (this.props.sortBy) {
				options.sort = [{
					[this.props.dataField]: {
						order: this.props.sortBy
					}
				}];
			}
			this.props.setQueryOptions(this.props.componentId, options);
		}

		if (!isEqual(nextProps.react, this.props.react)) {
			this.setReact(nextProps);
		}

		// called when page is changed
		if (this.props.pagination && this.state.isLoading) {
			window.scrollTo(0,0);
			this.setState({
				isLoading: false
			});
		}

		if (!nextProps.pagination && this.props.hits && nextProps.hits && (this.props.hits.length < nextProps.hits.length || nextProps.hits.length === nextProps.total)) {
			this.setState({
				isLoading: false
			});
		}

		if (!nextProps.pagination && nextProps.hits && this.props.hits && nextProps.hits.length < this.props.hits.length) {
			window.scrollTo(0,0);
			this.setState({
				from: 0,
				isLoading: false
			});
		}

		if (nextProps.pagination && nextProps.total !== this.props.total) {
			this.setState({
				totalPages: nextProps.total / nextProps.size,
				currentPage: 0
			});
		}

		if (nextProps.pagination !== this.props.pagination) {
			if (nextProps.pagination) {
				window.addEventListener("scroll", this.scrollHandler);
			} else {
				window.removeEventListener("scroll", this.scrollHandler);
			}
		}
	}

	componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
	}

	setReact = (props) => {
		const { react } = props;
		if (react) {
			const newReact = pushToAndClause(react, this.internalComponent)
			props.watchComponent(props.componentId, newReact);
		} else {
			props.watchComponent(props.componentId, { and: this.internalComponent });
		}
	};

	scrollHandler = () => {
		if (!this.state.isLoading && (window.innerHeight + window.scrollY + 300) >= document.body.offsetHeight) {
			this.loadMore();
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
				<Button primary={this.state.currentPage === i-1} key={i-1} onClick={() => this.setPage(i-1)}>
					{i}
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
			<div className={pagination}>
				<Button disabled={this.state.currentPage === 0} onClick={this.prevPage}>
					Prev
				</Button>
				{
					<Button primary={this.state.currentPage === 0} onClick={() => this.setPage(0)}>
						1
					</Button>
				}
				{
					pages
				}
				<Button disabled={this.state.currentPage >= this.state.totalPages-1} onClick={this.nextPage}>
					Next
				</Button>
			</div>
		)
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
		const results = this.parseHits(this.props.hits) || [];
		return (
			<div>
				{
					this.props.pagination && this.props.paginationAt !== "bottom"
						? this.renderPagination()
						: null
				}
				{
					this.props.onAllData
						? (this.props.onAllData(this.parseHits(this.props.hits), this.loadMore))
						: (<div>
							{
								results.map(item => this.props.onData(item))
							}
						</div>)
				}
				{
					this.state.isLoading && !this.props.pagination
						? (<div>
							Loading...
						</div>)
						: null
				}
				{
					this.props.pagination && this.props.paginationAt !== "top"
						? this.renderPagination()
						: null
				}
			</div>
		);
	}
}

ReactiveList.propTypes = {
	addComponent: types.funcRequired,
	componentId: types.stringRequired,
	sortBy: types.sortBy,
	dataField: types.stringRequired,
	setQueryOptions: types.funcRequired,
	defaultQuery: types.func,
	updateQuery: types.funcRequired,
	size: types.number,
	react: types.react,
	pagination: types.bool,
	paginationAt: types.paginationAt,
	hits: types.hits,
	total: types.number,
	removeComponent: types.funcRequired,
	loadMore: types.funcRequired,
	pages: types.number,
	onAllData: types.func,
	onData: types.func
}

ReactiveList.defaultProps = {
	pagination: false,
	paginationAt: "bottom",
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
	updateQuery: (updateQueryObject) => dispatch(updateQuery(updateQueryObject)),
	loadMore: (component, options, append) => dispatch(loadMore(component, options, append))
});

export default connect(mapStateToProps, mapDispatchtoProps)(ReactiveList);
