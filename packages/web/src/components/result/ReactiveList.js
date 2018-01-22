import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
	addComponent,
	removeComponent,
	setStreaming,
	watchComponent,
	setQueryOptions,
	updateQuery,
	loadMore,
	setValue,
} from '@appbaseio/reactivecore/lib/actions';
import {
	isEqual,
	getQueryOptions,
	pushToAndClause,
	getClassName,
	parseHits,
} from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';

import Pagination from './addons/Pagination';
import PoweredBy from './addons/PoweredBy';

import Flex from '../../styles/Flex';
import { resultStats, sortOptions } from '../../styles/results';

class ReactiveList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			from: props.currentPage * props.size,
			isLoading: false,
			totalPages: 0,
			currentPage: props.currentPage,
		};
		this.internalComponent = `${props.componentId}__internal`;
	}

	componentDidMount() {
		this.props.addComponent(this.internalComponent);
		this.props.addComponent(this.props.componentId);

		if (this.props.stream) {
			this.props.setStreaming(this.props.componentId, true);
		}

		const options = getQueryOptions(this.props);
		options.from = this.state.from;
		if (this.props.sortOptions) {
			options.sort = [{
				[this.props.sortOptions[0].dataField]: {
					order: this.props.sortOptions[0].sortBy,
				},
			}];
		} else if (this.props.sortBy) {
			options.sort = [{
				[this.props.dataField]: {
					order: this.props.sortBy,
				},
			}];
		}

		// Override sort query with defaultQuery's sort if defined
		this.defaultQuery = null;
		if (this.props.defaultQuery) {
			this.defaultQuery = this.props.defaultQuery();
			if (this.defaultQuery.sort) {
				options.sort = this.defaultQuery.sort;
			}
		}

		this.props.setQueryOptions(this.props.componentId, options);
		this.setReact(this.props);

		if (this.defaultQuery) {
			const { sort, ...query } = this.defaultQuery;
			this.props.updateQuery({
				componentId: this.internalComponent,
				query,
			});
		} else {
			this.props.updateQuery({
				componentId: this.internalComponent,
				query: null,
			});
		}

		if (!this.props.pagination) {
			window.addEventListener('scroll', this.scrollHandler);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (
			!isEqual(this.props.sortOptions, nextProps.sortOptions)
			|| this.props.sortBy !== nextProps.sortBy
			|| this.props.size !== nextProps.size
			|| !isEqual(this.props.dataField, nextProps.dataField)
		) {
			const options = getQueryOptions(nextProps);
			options.from = this.state.from;
			if (nextProps.sortOptions) {
				options.sort = [{
					[nextProps.sortOptions[0].dataField]: {
						order: nextProps.sortOptions[0].sortBy,
					},
				}];
			} else if (nextProps.sortBy) {
				options.sort = [{
					[nextProps.dataField]: {
						order: nextProps.sortBy,
					},
				}];
			}
			this.props.setQueryOptions(this.props.componentId, options);
		}

		if (
			nextProps.defaultQuery
			&& !isEqual(nextProps.defaultQuery(), this.defaultQuery)
		) {
			const options = getQueryOptions(nextProps);
			options.from = this.state.from;
			this.defaultQuery = nextProps.defaultQuery();

			const { sort, ...query } = this.defaultQuery;

			if (sort) {
				options.sort = this.defaultQuery.sort;
				nextProps.setQueryOptions(nextProps.componentId, options);
			}

			this.props.updateQuery({
				componentId: this.internalComponent,
				query,
			});
		}

		if (this.props.stream !== nextProps.stream) {
			this.props.setStreaming(nextProps.componentId, nextProps.stream);
		}

		if (!isEqual(nextProps.react, this.props.react)) {
			this.setReact(nextProps);
		}

		// called when page is changed
		if (this.props.pagination && this.state.isLoading) {
			window.scrollTo(0, 0);
			this.setState({
				isLoading: false,
			});
		}

		if (
			!nextProps.pagination
			&& this.props.hits
			&& nextProps.hits
			&& (
				this.props.hits.length < nextProps.hits.length
				|| nextProps.hits.length === nextProps.total
			)
		) {
			this.setState({
				isLoading: false,
			});
		}

		if (
			!nextProps.pagination
			&& nextProps.hits
			&& this.props.hits
			&& nextProps.hits.length < this.props.hits.length
		) {
			window.scrollTo(0, 0);
			this.setState({
				from: 0,
				isLoading: false,
			});
		}

		if (nextProps.pagination && nextProps.total !== this.props.total) {
			this.setState({
				totalPages: Math.ceil(nextProps.total / nextProps.size),
				currentPage: this.props.total ? 0 : this.state.currentPage,
			});
		}

		if (nextProps.pagination !== this.props.pagination) {
			if (nextProps.pagination) {
				window.addEventListener('scroll', this.scrollHandler);
			} else {
				window.removeEventListener('scroll', this.scrollHandler);
			}
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

	scrollHandler = () => {
		if (
			!this.state.isLoading
			&& (window.innerHeight + window.scrollY + 300) >= document.body.offsetHeight
		) {
			this.loadMore();
		}
	};

	loadMore = () => {
		if (
			this.props.hits
			&& !this.props.pagination
			&& this.props.total !== this.props.hits.length
		) {
			const value = this.state.from + this.props.size;
			const options = getQueryOptions(this.props);

			this.setState({
				from: value,
				isLoading: true,
			});
			this.props.loadMore(this.props.componentId, {
				...options,
				from: value,
			}, true);
		} else if (this.state.isLoading) {
			this.setState({
				isLoading: false,
			});
		}
	};

	setPage = (page) => {
		const value = this.props.size * page;
		const options = getQueryOptions(this.props);
		options.from = this.state.from;
		this.setState({
			from: value,
			isLoading: true,
			currentPage: page,
		});
		this.props.loadMore(this.props.componentId, {
			...options,
			from: value,
		}, false);

		if (this.props.URLParams) {
			this.props.setPageURL(
				`${this.props.componentId}-page`,
				page + 1,
				`${this.props.componentId}-page`,
				false,
				true,
			);
		}
	};

	renderResultStats = () => {
		if (this.props.onResultStats && this.props.total) {
			return this.props.onResultStats(this.props.total, this.props.time);
		} else if (this.props.total) {
			return (
				<p className={`${resultStats} ${getClassName(this.props.innerClass, 'resultStats')}`}>
					{this.props.total} results found in {this.props.time}ms
				</p>
			);
		}
		return null;
	};

	handleSortChange = (e) => {
		const index = e.target.value;
		const options = getQueryOptions(this.props);
		options.from = this.state.from;

		options.sort = [{
			[this.props.sortOptions[index].dataField]: {
				order: this.props.sortOptions[index].sortBy,
			},
		}];
		this.props.setQueryOptions(this.props.componentId, options);
	};

	renderSortOptions = () => (
		<select
			className={`${sortOptions} ${getClassName(this.props.innerClass, 'sortOptions')}`}
			name="sort-options"
			onChange={this.handleSortChange}
		>
			{
				this.props.sortOptions.map((sort, index) => (
					<option key={sort.label} value={index}>{sort.label}</option>
				))
			}
		</select>
	);

	render() {
		const results = parseHits(this.props.hits) || [];
		const streamResults = parseHits(this.props.streamHits) || [];
		let filteredResults = results;

		if (streamResults.length) {
			const ids = streamResults.map(item => item._id);
			filteredResults = filteredResults.filter(item => !ids.includes(item._id));
		}

		return (
			<div style={this.props.style} className={this.props.className}>
				{this.props.isLoading && this.props.pagination && this.props.loader && this.props.loader}
				<Flex
					labelPosition={this.props.sortOptions ? 'right' : 'left'}
					className={getClassName(this.props.innerClass, 'resultsInfo')}
				>
					{
						this.props.sortOptions
							? this.renderSortOptions()
							: null
					}
					{
						this.props.showResultStats
							? this.renderResultStats()
							: null
					}
				</Flex>
				{
					this.props.pagination && this.props.paginationAt === 'top'
						? (<Pagination
							pages={this.props.pages}
							totalPages={this.state.totalPages}
							currentPage={this.state.currentPage}
							setPage={this.setPage}
							innerClass={this.props.innerClass}
						/>)
						: null
				}
				{
					this.props.onAllData
						? (this.props.onAllData(results, streamResults, this.loadMore))
						: (
							<div className={getClassName(this.props.innerClass, 'list')}>
								{
									[...streamResults, ...filteredResults].map(this.props.onData)
								}
							</div>
						)
				}
				{
					this.state.isLoading && !this.props.pagination
						? (<div>Loading...</div>)
						: null
				}
				{
					this.props.pagination && this.props.paginationAt === 'bottom'
						? (<Pagination
							pages={this.props.pages}
							totalPages={this.state.totalPages}
							currentPage={this.state.currentPage}
							setPage={this.setPage}
							innerClass={this.props.innerClass}
						/>)
						: null
				}
				{
					this.props.url.endsWith('appbase.io') && results.length
						? (
							<Flex
								direction="row-reverse"
								className={getClassName(this.props.innerClass, 'poweredBy')}
							>
								<PoweredBy />
							</Flex>
						)
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
	sortOptions: types.sortOptions,
	dataField: types.stringRequired,
	setQueryOptions: types.funcRequired,
	defaultQuery: types.func,
	updateQuery: types.funcRequired,
	size: types.number,
	react: types.react,
	pagination: types.bool,
	paginationAt: types.paginationAt,
	hits: types.hits,
	streamHits: types.hits,
	total: types.number,
	removeComponent: types.funcRequired,
	loadMore: types.funcRequired,
	pages: types.number,
	onAllData: types.func,
	onData: types.func,
	time: types.number,
	showResultStats: types.bool,
	onResultStats: types.func,
	loader: types.title,
	isLoading: types.bool,
	style: types.style,
	className: types.string,
	stream: types.bool,
	setStreaming: types.func,
	innerClass: types.style,
	url: types.string,
	URLParams: types.bool,
	currentPage: types.number,
	setPageURL: types.func,
};

ReactiveList.defaultProps = {
	pagination: false,
	paginationAt: 'bottom',
	pages: 5,
	size: 10,
	showResultStats: true,
	style: {},
	className: null,
	URLParams: false,
};

const mapStateToProps = (state, props) => ({
	hits: state.hits[props.componentId] && state.hits[props.componentId].hits,
	streamHits: state.streamHits[props.componentId] || [],
	total: state.hits[props.componentId] && state.hits[props.componentId].total,
	time: (state.hits[props.componentId] && state.hits[props.componentId].time) || 0,
	isLoading: state.isLoading[props.componentId] || false,
	url: state.config.url,
	currentPage: (
		state.selectedValues[`${props.componentId}-page`]
		&& state.selectedValues[`${props.componentId}-page`].value - 1
	) || 0,
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	setStreaming: (component, stream) => dispatch(setStreaming(component, stream)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	setQueryOptions: (component, props) => dispatch(setQueryOptions(component, props)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	loadMore: (component, options, append) => dispatch(loadMore(component, options, append)),
	setPageURL: (component, value, label, showFilter, URLParams) =>
		dispatch(setValue(component, value, label, showFilter, URLParams)),
});

export default connect(mapStateToProps, mapDispatchtoProps)(ReactiveList);
