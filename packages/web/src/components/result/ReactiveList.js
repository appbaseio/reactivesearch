import React, { Component } from 'react';

import {
	addComponent,
	removeComponent,
	setStreaming,
	watchComponent,
	setQueryOptions,
	updateQuery,
	loadMore,
	setValue,
	setQueryListener,
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
import { connect } from '../../utils';

class ReactiveList extends Component {
	constructor(props) {
		super(props);

		let currentPage = 0;
		if (this.props.defaultPage >= 0) {
			currentPage = this.props.defaultPage;
		} else if (this.props.currentPage) {
			currentPage = Math.max(this.props.currentPage - 1, 0);
		}
		this.initialFrom = currentPage * props.size; // used for page resetting on query change
		this.state = {
			from: this.initialFrom,
			isLoading: true,
			currentPage,
		};
		this.internalComponent = `${props.componentId}__internal`;
		props.setQueryListener(props.componentId, props.onQueryChange, props.onError);
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

		const { sort, ...query } = this.defaultQuery || {};

		// execute is set to false at the time of mount
		// to avoid firing (multiple) partial queries.
		// Hence we are building the query in parts here
		// and only executing it with setReact() at core
		const execute = false;

		this.props.setQueryOptions(
			this.props.componentId,
			options,
			execute,
		);

		if (this.defaultQuery) {
			this.props.updateQuery({
				componentId: this.internalComponent,
				query,
			}, execute);
		} else {
			this.props.updateQuery({
				componentId: this.internalComponent,
				query: null,
			}, execute);
		}

		// query will be executed here
		this.setReact(this.props);

		if (!this.props.pagination) {
			window.addEventListener('scroll', this.scrollHandler);
		}
	}

	componentWillReceiveProps(nextProps) {
		const totalPages = Math.ceil(nextProps.total / nextProps.size) || 0;

		if (
			!isEqual(this.props.sortOptions, nextProps.sortOptions)
			|| this.props.sortBy !== nextProps.sortBy
			|| this.props.size !== nextProps.size
			|| !isEqual(this.props.dataField, nextProps.dataField)
			|| !isEqual(this.props.includeFields, nextProps.includeFields)
			|| !isEqual(this.props.excludeFields, nextProps.excludeFields)
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
			this.props.setQueryOptions(this.props.componentId, options, true);
		}

		if (
			nextProps.defaultQuery
			&& !isEqual(nextProps.defaultQuery(), this.defaultQuery)
		) {
			const options = getQueryOptions(nextProps);
			options.from = 0;
			this.defaultQuery = nextProps.defaultQuery();

			const { sort, ...query } = this.defaultQuery;

			if (sort) {
				options.sort = this.defaultQuery.sort;
				nextProps.setQueryOptions(nextProps.componentId, options, !query);
			}

			this.props.updateQuery({
				componentId: this.internalComponent,
				query,
			}, true);

			// reset page because of query change
			this.setState({
				currentPage: 0,
				from: 0,
			}, () => {
				this.updatePageURL(0);
			});
		}

		if (this.props.stream !== nextProps.stream) {
			this.props.setStreaming(nextProps.componentId, nextProps.stream);
		}

		if (!isEqual(nextProps.react, this.props.react)) {
			this.setReact(nextProps);
		}

		if (this.props.pagination) {
			// called when page is changed
			if (this.state.isLoading && (this.props.hits || nextProps.hits)) {
				if (nextProps.onPageChange) {
					nextProps.onPageChange(this.state.currentPage + 1, totalPages);
				} else {
					window.scrollTo(0, 0);
				}
				this.setState({
					isLoading: false,
				});
			}

			if (
				this.props.currentPage !== nextProps.currentPage
				&& nextProps.currentPage > 0
				&& nextProps.currentPage <= totalPages
			) {
				this.setPage(nextProps.currentPage - 1);
			}
		}

		if (!nextProps.pagination) {
			if (this.props.hits && nextProps.hits) {
				if (
					this.props.hits.length !== nextProps.hits.length
					|| nextProps.hits.length === nextProps.total
				) {
					this.setState({
						isLoading: false,
					});

					if (nextProps.hits.length < this.props.hits.length) {
						// query has changed
						window.scrollTo(0, 0);
						this.setState({
							from: 0,
						});
					}
				}
			} else if ((!this.props.hits || !this.props.hits.length) && nextProps.hits) {
				this.setState({
					isLoading: false,
				});
			}
		}

		if (this.props.queryLog && nextProps.queryLog !== this.props.queryLog) {
			// usecase:
			// - query has changed from non-null prev query

			if (nextProps.queryLog.from !== this.state.from) {
				// query's 'from' key doesn't match the state's 'from' key,
				// i.e. this query change was not triggered by the page change (loadMore)
				this.setState({
					currentPage: 0,
				}, () => {
					this.updatePageURL(0);
				});

				if (nextProps.onPageChange) {
					nextProps.onPageChange(1, totalPages);
				}
			} else if (
				this.initialFrom
				&& this.initialFrom === nextProps.queryLog.from
			) {
				// [non-zero] initialFrom matches the current query's from
				// but the query has changed

				// we need to update the query options in this case
				// because the initial load had set the query 'from' in the store
				// which is not valid anymore because the query has changed
				const options = getQueryOptions(nextProps);
				options.from = 0;
				this.initialFrom = 0;

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

				this.props.setQueryOptions(this.props.componentId, options, true);
			}
		}

		if (nextProps.pagination !== this.props.pagination) {
			if (nextProps.pagination) {
				window.addEventListener('scroll', this.scrollHandler);
			} else {
				window.removeEventListener('scroll', this.scrollHandler);
			}
		}

		// handle window url history change (on native back and forth interactions)
		if (
			this.state.currentPage !== nextProps.defaultPage
			&& this.props.defaultPage !== nextProps.defaultPage
		) {
			this.setPage(nextProps.defaultPage >= 0 ? nextProps.defaultPage : 0);
		}
	}

	componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
		this.props.removeComponent(this.internalComponent);
		window.removeEventListener('scroll', this.scrollHandler);
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

	// only used for SSR
	static generateQueryOptions = (props) => {
		const options = {};
		options.from = props.currentPage ? (props.currentPage - 1) * (props.size || 10) : 0;
		options.size = props.size || 10;

		if (props.sortOptions) {
			options.sort = [{
				[props.sortOptions[0].dataField]: {
					order: props.sortOptions[0].sortBy,
				},
			}];
		} else if (props.sortBy) {
			options.sort = [{
				[props.dataField]: {
					order: props.sortBy,
				},
			}];
		}

		return options;
	};

	scrollHandler = () => {
		if (
			!this.state.isLoading
			&& (window.innerHeight + window.pageYOffset + 300) >= document.body.offsetHeight
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
		// onPageClick will be called everytime a pagination button is clicked
		if (page !== this.state.currentPage) {
			const { onPageClick } = this.props;
			if (onPageClick) {
				onPageClick(page + 1);
			}
			const value = this.props.size * page;
			const options = getQueryOptions(this.props);
			options.from = this.state.from;
			this.setState({
				from: value,
				isLoading: true,
				currentPage: page,
			}, () => {
				this.props.loadMore(this.props.componentId, {
					...options,
					from: value,
				}, false);

				this.updatePageURL(page);
			});
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

	renderNoResults = () => (
		<p className={getClassName(this.props.innerClass, 'noResults') || null}>
			{ this.props.onNoResults }
		</p>
	);

	handleSortChange = (e) => {
		const index = e.target.value;
		const options = getQueryOptions(this.props);
		// This fixes issue #371 (where sorting a multi-result page with infinite loader breaks)
		options.from = 0;

		options.sort = [{
			[this.props.sortOptions[index].dataField]: {
				order: this.props.sortOptions[index].sortBy,
			},
		}];
		this.props.setQueryOptions(this.props.componentId, options, true);

		this.setState({
			currentPage: 0,
			from: 0,
		}, () => {
			this.updatePageURL(0);
		});
	};

	updatePageURL = (page) => {
		if (this.props.URLParams) {
			this.props.setPageURL(
				this.props.componentId,
				page + 1,
				this.props.componentId,
				false,
				true,
			);
		}
	}

	triggerClickAnalytics = (searchPosition) => {
		// click analytics would only work client side and after javascript loads
		const { config, analytics: { searchId } } = this.props;
		const { url, app, credentials } = config;
		if (config.analytics && url.endsWith('scalr.api.appbase.io') && searchId) {
			fetch(`${url}/${app}/analytics`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Basic ${btoa(credentials)}`,
					'X-Search-Id': searchId,
					'X-Search-Click': true,
					'X-Search-Click-Position': searchPosition + 1,
				},
			});
		}
	}

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
		const { onData, size } = this.props;
		const { currentPage } = this.state;
		const results = parseHits(this.props.hits) || [];
		const streamResults = parseHits(this.props.streamHits) || [];
		let filteredResults = results;

		if (streamResults.length) {
			const ids = streamResults.map(item => item._id);
			filteredResults = filteredResults.filter(item => !ids.includes(item._id));
		}

		return (
			<div style={this.props.style} className={this.props.className}>
				{this.state.isLoading && this.props.pagination && this.props.loader}
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
					(
						!this.state.isLoading
						&& (results.length === 0 && streamResults.length === 0)
					)
						? this.renderNoResults()
						: null
				}
				{
					this.props.pagination && (
						this.props.paginationAt === 'top'
						|| this.props.paginationAt === 'both'
					)
						? (<Pagination
							pages={this.props.pages}
							totalPages={Math.ceil(this.props.total / this.props.size)}
							currentPage={this.state.currentPage}
							setPage={this.setPage}
							innerClass={this.props.innerClass}
							fragmentName={this.props.componentId}
						/>)
						: null
				}
				{
					this.props.onAllData
						? (this.props.onAllData(
							results,
							streamResults,
							this.loadMore,
							{ base: (currentPage * size), triggerClickAnalytics: this.triggerClickAnalytics },
						))
						: (
							<div className={`${this.props.listClass} ${getClassName(this.props.innerClass, 'list')}`}>
								{
									[...streamResults, ...filteredResults]
										.map((item, index) =>
											onData(item, () => this.triggerClickAnalytics((currentPage * size) + index)))
								}
							</div>
						)
				}
				{
					this.state.isLoading && !this.props.pagination
						? this.props.loader || (
							<div style={{ textAlign: 'center', margin: '20px 0', color: '#666' }}>
								Loading...
							</div>
						)
						: null
				}
				{
					this.props.pagination && (
						this.props.paginationAt === 'bottom'
						|| this.props.paginationAt === 'both'
					)
						? (<Pagination
							pages={this.props.pages}
							totalPages={Math.ceil(this.props.total / this.props.size)}
							currentPage={this.state.currentPage}
							setPage={this.setPage}
							innerClass={this.props.innerClass}
							fragmentName={this.props.componentId}
						/>)
						: null
				}
				{
					this.props.config.url.endsWith('appbase.io') && results.length
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
	loadMore: types.funcRequired,
	removeComponent: types.funcRequired,
	setQueryListener: types.funcRequired,
	onQueryChange: types.func,
	onError: types.func,
	setPageURL: types.func,
	setQueryOptions: types.funcRequired,
	setStreaming: types.func,
	updateQuery: types.funcRequired,
	watchComponent: types.funcRequired,
	currentPage: types.number,
	hits: types.hits,
	isLoading: types.bool,
	includeFields: types.includeFields,
	streamHits: types.hits,
	time: types.number,
	total: types.number,
	config: types.props,
	analytics: types.props,
	queryLog: types.props,
	// component props
	className: types.string,
	componentId: types.stringRequired,
	dataField: types.stringRequired,
	defaultPage: types.number,
	defaultQuery: types.func,
	excludeFields: types.excludeFields,
	innerClass: types.style,
	listClass: types.string,
	loader: types.title,
	onAllData: types.func,
	onData: types.func,
	onNoResults: types.title,
	onPageChange: types.func,
	onPageClick: types.func,
	onResultStats: types.func,
	pages: types.number,
	pagination: types.bool,
	paginationAt: types.paginationAt,
	react: types.react,
	showResultStats: types.bool,
	size: types.number,
	sortBy: types.sortBy,
	sortOptions: types.sortOptions,
	stream: types.bool,
	style: types.style,
	URLParams: types.bool,
};

ReactiveList.defaultProps = {
	className: null,
	currentPage: 0,
	listClass: '',
	pages: 5,
	pagination: false,
	paginationAt: 'bottom',
	includeFields: ['*'],
	excludeFields: [],
	showResultStats: true,
	size: 10,
	style: {},
	URLParams: false,
	onNoResults: 'No Results found.',
};

const mapStateToProps = (state, props) => ({
	defaultPage: (
		state.selectedValues[props.componentId]
		&& state.selectedValues[props.componentId].value - 1
	) || -1,
	hits: state.hits[props.componentId] && state.hits[props.componentId].hits,
	isLoading: state.isLoading[props.componentId] || false,
	streamHits: state.streamHits[props.componentId],
	time: (state.hits[props.componentId] && state.hits[props.componentId].time) || 0,
	total: state.hits[props.componentId] && state.hits[props.componentId].total,
	analytics: state.analytics,
	config: state.config,
	queryLog: state.queryLog[props.componentId],
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	loadMore: (component, options, append) => dispatch(loadMore(component, options, append)),
	removeComponent: component => dispatch(removeComponent(component)),
	setPageURL: (component, value, label, showFilter, URLParams) =>
		dispatch(setValue(component, value, label, showFilter, URLParams)),
	setQueryOptions: (component, props, execute) =>
		dispatch(setQueryOptions(component, props, execute)),
	setQueryListener: (component, onQueryChange, beforeQueryChange) =>
		dispatch(setQueryListener(component, onQueryChange, beforeQueryChange)),
	setStreaming: (component, stream) => dispatch(setStreaming(component, stream)),
	updateQuery: (updateQueryObject, execute) => dispatch(updateQuery(updateQueryObject, execute)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
});

export default connect(mapStateToProps, mapDispatchtoProps)(ReactiveList);
