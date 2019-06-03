import React, { Component } from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
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
	setComponentProps,
	updateComponentProps,
} from '@appbaseio/reactivecore/lib/actions';
import {
	isEqual,
	getQueryOptions,
	pushToAndClause,
	getClassName,
	parseHits,
	checkSomePropChange,
	getOptionsFromQuery,
	getSearchState,
} from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';

import Pagination from './addons/Pagination';
import PoweredBy from './addons/PoweredBy';

import Flex from '../../styles/Flex';
import { resultStats, sortOptions } from '../../styles/results';
import { container } from '../../styles/Card';
import { container as listContainer } from '../../styles/ListItem';
import {
	connect,
	isFunction,
	getComponent,
	hasCustomRenderer,
	getValidPropsKeys,
} from '../../utils';

class ReactiveList extends Component {
	static ResultCardsWrapper = ({ children, ...rest }) => (
		<div className={container} {...rest}>
			{children}
		</div>
	);
	static ResultListWrapper = ({ children, ...rest }) => (
		<div className={listContainer} {...rest}>
			{children}
		</div>
	);
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
			currentPage,
		};
		this.internalComponent = `${props.componentId}__internal`;
		this.sortOptionIndex = this.props.defaultSortOption
			? this.props.sortOptions.findIndex(s => s.label === this.props.defaultSortOption)
			: 0;

		props.setQueryListener(props.componentId, props.onQueryChange, props.onError);
	}

	componentDidMount() {
		this.props.addComponent(this.internalComponent);
		this.props.addComponent(this.props.componentId);
		this.props.setComponentProps(this.props.componentId, {
			...this.props,
			componentType: componentTypes.reactiveList,
		});
		if (this.props.stream) {
			this.props.setStreaming(this.props.componentId, true);
		}

		let options = getQueryOptions(this.props);
		options.from = this.state.from;
		if (this.props.sortOptions) {
			options.sort = [
				{
					[this.props.sortOptions[this.sortOptionIndex].dataField]: {
						order: this.props.sortOptions[this.sortOptionIndex].sortBy,
					},
				},
			];
		} else if (this.props.sortBy) {
			options.sort = [
				{
					[this.props.dataField]: {
						order: this.props.sortBy,
					},
				},
			];
		}

		// Override sort query with defaultQuery's sort if defined
		this.defaultQuery = null;
		if (this.props.defaultQuery) {
			this.defaultQuery = this.props.defaultQuery();
			options = { ...options, ...getOptionsFromQuery(this.defaultQuery) };
		}

		const { query } = this.defaultQuery || {};

		// execute is set to false at the time of mount
		// to avoid firing (multiple) partial queries.
		// Hence we are building the query in parts here
		// and only executing it with setReact() at core
		const execute = false;

		this.props.setQueryOptions(this.props.componentId, options, execute);

		if (this.defaultQuery) {
			this.props.updateQuery(
				{
					componentId: this.internalComponent,
					query,
				},
				execute,
			);
		} else {
			this.props.updateQuery(
				{
					componentId: this.internalComponent,
					query: null,
				},
				execute,
			);
		}

		// query will be executed here
		this.setReact(this.props);

		this.domNode = window;
		if (this.showInfiniteScroll) {
			const { scrollTarget } = this.props;
			if (scrollTarget) {
				this.domNode = document.getElementById(scrollTarget);
			}
			this.domNode.addEventListener('scroll', this.scrollHandler);
		}
	}

	componentDidUpdate(prevProps) {
		const totalPages = Math.ceil(this.props.total / this.props.size) || 0;
		checkSomePropChange(this.props, prevProps, getValidPropsKeys(this.props), () => {
			this.props.updateComponentProps(this.props.componentId, this.props);
		});
		if (this.props.onData) {
			checkSomePropChange(
				this.props,
				prevProps,
				['hits', 'streamHits', 'promotedResults', 'total', 'size', 'time'],
				() => {
					this.props.onData(this.getData());
				},
			);
		}
		if (
			!isEqual(this.props.sortOptions, prevProps.sortOptions)
			|| this.props.sortBy !== prevProps.sortBy
			|| this.props.size !== prevProps.size
			|| !isEqual(this.props.dataField, prevProps.dataField)
			|| !isEqual(this.props.includeFields, prevProps.includeFields)
			|| !isEqual(this.props.excludeFields, prevProps.excludeFields)
		) {
			const options = getQueryOptions(this.props);
			options.from = this.state.from;
			if (this.props.sortOptions) {
				options.sort = [
					{
						[this.props.sortOptions[this.sortOptionIndex].dataField]: {
							order: this.props.sortOptions[this.sortOptionIndex].sortBy,
						},
					},
				];
			} else if (this.props.sortBy) {
				options.sort = [
					{
						[this.props.dataField]: {
							order: this.props.sortBy,
						},
					},
				];
			}
			this.props.setQueryOptions(this.props.componentId, options, true);
		}

		if (this.props.defaultQuery && !isEqual(this.props.defaultQuery(), this.defaultQuery)) {
			let options = getQueryOptions(this.props);
			options.from = 0;
			this.defaultQuery = this.props.defaultQuery();

			const { query } = this.defaultQuery;

			const queryOptions = getOptionsFromQuery(this.defaultQuery);
			if (queryOptions) {
				options = { ...options, ...getOptionsFromQuery(this.defaultQuery) };
				this.props.setQueryOptions(this.props.componentId, options, !query);
			}

			this.props.updateQuery(
				{
					componentId: this.internalComponent,
					query,
				},
				true,
			);

			// reset page because of query change
			// eslint-disable-next-line
			this.setState(
				{
					currentPage: 0,
					from: 0,
				},
				() => {
					this.updatePageURL(0);
				},
			);
		}

		if (this.props.stream !== prevProps.stream) {
			this.props.setStreaming(this.props.componentId, this.props.stream);
		}

		if (!isEqual(prevProps.react, this.props.react)) {
			this.setReact(this.props);
		}
		if (this.props.pagination) {
			// called when page is changed
			if (this.props.isLoading && (this.props.hits || prevProps.hits)) {
				if (this.props.onPageChange) {
					this.props.onPageChange(this.state.currentPage + 1, totalPages);
				} else if (this.props.scrollOnChange && this.props.pagination) {
					this.domNode.scrollTo(0, 0);
				}
			}

			if (
				this.props.currentPage !== prevProps.currentPage
				&& this.props.currentPage > 0
				&& this.props.currentPage <= totalPages
			) {
				this.setPage(this.props.currentPage - 1);
			}
		}

		if (this.showInfiniteScroll) {
			if (this.props.hits && prevProps.hits) {
				if (
					// new items are loaded (from: 0)
					this.props.hits.length < prevProps.hits.length
					// new items are loaded and 'from' hasn't changed
					|| (this.props.hits.length === prevProps.hits.length
						&& this.props.hits !== prevProps.hits)
				) {
					// query has changed
					if (this.props.scrollOnChange) {
						this.domNode.scrollTo(0, 0);
					}
					// eslint-disable-next-line
					this.setState({
						from: 0,
					});
				}
			}
		}

		if (
			prevProps.queryLog
			&& this.props.queryLog
			&& prevProps.queryLog !== this.props.queryLog
		) {
			// usecase:
			// - query has changed from non-null prev query

			if (this.props.queryLog.from !== this.state.from) {
				// query's 'from' key doesn't match the state's 'from' key,
				// i.e. this query change was not triggered by the page change (loadMore)
				// eslint-disable-next-line
				this.setState(
					{
						currentPage: 0,
					},
					() => {
						this.updatePageURL(0);
					},
				);

				if (this.props.onPageChange) {
					this.props.onPageChange(1, totalPages);
				}
			} else if (this.initialFrom && this.initialFrom === this.props.queryLog.from) {
				// [non-zero] initialFrom matches the current query's from
				// but the query has changed

				// we need to update the query options in this case
				// because the initial load had set the query 'from' in the store
				// which is not valid anymore because the query has changed
				const options = getQueryOptions(this.props);
				options.from = 0;
				this.initialFrom = 0;

				if (this.props.sortOptions) {
					options.sort = [
						{
							[this.props.sortOptions[this.sortOptionIndex].dataField]: {
								order: this.props.sortOptions[this.sortOptionIndex].sortBy,
							},
						},
					];
				} else if (this.props.sortBy) {
					options.sort = [
						{
							[this.props.dataField]: {
								order: this.props.sortBy,
							},
						},
					];
				}

				this.props.setQueryOptions(this.props.componentId, options, true);
			}
		}

		// handle window url history change (on native back and forth interactions)
		if (
			this.state.currentPage !== this.props.defaultPage
			&& this.props.defaultPage !== prevProps.defaultPage
		) {
			this.setPage(this.props.defaultPage >= 0 ? this.props.defaultPage : 0);
		}
	}

	componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
		this.props.removeComponent(this.internalComponent);

		if (this.domNode) {
			this.domNode.removeEventListener('scroll', this.scrollHandler);
		}
	}
	// Calculate results
	getAllData = () => {
		const { size, promotedResults } = this.props;
		const { currentPage } = this.state;
		const results = parseHits(this.props.hits) || [];
		const streamResults = parseHits(this.props.streamHits) || [];
		let filteredResults = results;
		const base = currentPage * size;
		if (streamResults.length) {
			const ids = streamResults.map(item => item._id);
			filteredResults = filteredResults.filter(item => !ids.includes(item._id));
		}

		if (promotedResults.length) {
			const ids = promotedResults.map(item => item._id).filter(Boolean);
			if (ids) {
				filteredResults = filteredResults.filter(item => !ids.includes(item._id));
			}

			filteredResults = [...streamResults, ...promotedResults, ...filteredResults];
		}
		return {
			results,
			streamResults,
			filteredResults,
			promotedResults,
			loadMore: this.loadMore,
			base,
			triggerClickAnalytics: this.triggerClickAnalytics,
		};
	};
	get stats() {
		const { total, size, time } = this.props;
		const { currentPage } = this.state;
		const { filteredResults } = this.getAllData();
		return {
			numberOfResults: total,
			numberOfPages: Math.ceil(total / size),
			time,
			currentPage,
			displayedResults: filteredResults.length,
		};
	}

	get showInfiniteScroll() {
		// Pagination has higher priority then infinite scroll
		const { pagination, infiniteScroll } = this.props;
		return infiniteScroll && !pagination;
	}

	get hasCustomRenderer() {
		return hasCustomRenderer(this.props);
	}

	setReact = (props) => {
		const { react } = props;
		if (react) {
			const newReact = pushToAndClause(react, this.internalComponent);
			props.watchComponent(props.componentId, newReact);
		} else {
			props.watchComponent(props.componentId, {
				and: this.internalComponent,
			});
		}
	};

	// only used for SSR
	static generateQueryOptions = (props) => {
		// simulate default (includeFields and excludeFields) props to generate consistent query
		const options = getQueryOptions({ includeFields: ['*'], excludeFields: [], ...props });
		options.from = props.currentPage ? (props.currentPage - 1) * (props.size || 10) : 0;
		options.size = props.size || 10;

		if (props.sortOptions) {
			options.sort = [
				{
					[props.sortOptions[this.sortOptionIndex].dataField]: {
						order: props.sortOptions[this.sortOptionIndex].sortBy,
					},
				},
			];
		} else if (props.sortBy) {
			options.sort = [
				{
					[props.dataField]: {
						order: props.sortBy,
					},
				},
			];
		}

		return options;
	};

	scrollHandler = () => {
		let renderLoader
			= window.innerHeight + window.pageYOffset + 300 >= document.body.offsetHeight;
		if (this.props.scrollTarget) {
			renderLoader
				= this.domNode.clientHeight + this.domNode.scrollTop + 300
				>= this.domNode.scrollHeight;
		}
		if (!this.props.isLoading && renderLoader) {
			this.loadMore();
		}
	};

	loadMore = () => {
		if (this.props.hits && this.props.total !== this.props.hits.length) {
			const value = this.state.from + this.props.size;
			const options = getQueryOptions(this.props);

			this.setState({
				from: value,
			});
			this.props.loadMore(
				this.props.componentId,
				{
					...options,
					from: value,
				},
				true,
			);
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
			this.setState(
				{
					from: value,
					currentPage: page,
				},
				() => {
					this.props.loadMore(
						this.props.componentId,
						{
							...options,
							from: value,
						},
						false,
					);

					this.updatePageURL(page);
				},
			);
		}
	};

	renderResultStats = () => {
		if (this.props.renderResultStats && this.props.total) {
			return this.props.renderResultStats(this.stats);
		} else if (this.props.total) {
			return (
				<p
					className={`${resultStats} ${getClassName(
						this.props.innerClass,
						'resultStats',
					)}`}
				>
					{this.props.total} results found in {this.props.time}ms
				</p>
			);
		}
		return null;
	};

	renderNoResults = () => (
		<div className={getClassName(this.props.innerClass, 'noResults') || null}>
			{this.props.renderNoResults()}
		</div>
	);

	handleSortChange = (e) => {
		const index = e.target.value;
		const options = getQueryOptions(this.props);
		// This fixes issue #371 (where sorting a multi-result page with infinite loader breaks)
		options.from = 0;

		options.sort = [
			{
				[this.props.sortOptions[index].dataField]: {
					order: this.props.sortOptions[index].sortBy,
				},
			},
		];
		this.props.setQueryOptions(this.props.componentId, options, true);
		this.sortOptionIndex = index;

		this.setState(
			{
				currentPage: 0,
				from: 0,
			},
			() => {
				this.updatePageURL(0);
			},
		);
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
	};

	triggerClickAnalytics = (searchPosition) => {
		// click analytics would only work client side and after javascript loads
		const {
			config,
			analytics: { searchId },
			searchState,
		} = this.props;
		const { url, app, credentials } = config;
		if (config.analytics && searchId) {
			fetch(`${url}/${app}/_analytics`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Basic ${btoa(credentials)}`,
					'X-Search-Id': searchId,
					'X-Search-Click': true,
					'X-Search-ClickPosition': searchPosition + 1,
					'X-Search-Conversion': true,
					...(config.searchStateHeader && {
						'X-Search-State': JSON.stringify(searchState),
					}),
				},
			});
		}
	};

	renderSortOptions = () => (
		<select
			className={`${sortOptions} ${getClassName(this.props.innerClass, 'sortOptions')}`}
			name="sort-options"
			onChange={this.handleSortChange}
			defaultValue={this.sortOptionIndex}
		>
			{this.props.sortOptions.map((sort, index) => (
				<option key={sort.label} value={index}>
					{sort.label}
				</option>
			))}
		</select>
	);

	renderError = () => {
		const { error, isLoading, renderError } = this.props;
		if (renderError && error && !isLoading) {
			return isFunction(renderError) ? renderError(error) : renderError;
		}
		return null;
	};

	withClickIds = (results) => {
		const { base } = this.getAllData();
		return results.map((result, index) => ({
			...result,
			_click_id: base + index,
		}));
	};
	getData() {
		const {
			results, streamResults, filteredResults, promotedResults,
		} = this.getAllData();
		return {
			data: this.withClickIds(filteredResults),
			streamData: this.withClickIds(streamResults),
			promotedData: this.withClickIds(promotedResults),
			rawData: this.withClickIds(results),
			resultStats: this.stats,
		};
	}
	getComponent() {
		const { error, isLoading } = this.props;
		const data = {
			error,
			loading: isLoading,
			loadMore: this.loadMore,
			triggerAnalytics: this.triggerClickAnalytics,
			...this.getData(),
		};
		return getComponent(data, this.props);
	}

	render() {
		const { renderItem, size, error } = this.props;
		const { currentPage } = this.state;
		const { filteredResults } = this.getAllData();
		return (
			<div style={this.props.style} className={this.props.className}>
				{this.props.isLoading && this.props.pagination && this.props.loader}
				{this.renderError()}
				<Flex
					labelPosition={this.props.sortOptions ? 'right' : 'left'}
					className={getClassName(this.props.innerClass, 'resultsInfo')}
				>
					{this.props.sortOptions ? this.renderSortOptions() : null}
					{this.props.showResultStats ? this.renderResultStats() : null}
				</Flex>
				{!this.props.isLoading && !error && filteredResults.length === 0
					? this.renderNoResults()
					: null}
				{this.props.pagination
				&& (this.props.paginationAt === 'top' || this.props.paginationAt === 'both')
					? (
						<Pagination
							pages={this.props.pages}
							totalPages={Math.ceil(this.props.total / this.props.size)}
							currentPage={this.state.currentPage}
							setPage={this.setPage}
							innerClass={this.props.innerClass}
							fragmentName={this.props.componentId}
						/>
					) : null}
				{this.hasCustomRenderer ? (
					this.getComponent()
				) : (
					<div
						className={`${this.props.listClass} ${getClassName(
							this.props.innerClass,
							'list',
						)}`}
					>
						{filteredResults.map((item, index) =>
							renderItem(item, () => {
								const base = currentPage * size;
								this.triggerClickAnalytics(base + index);
							}),
						)}
					</div>
				)}
				{this.props.showLoader && this.props.isLoading && this.showInfiniteScroll
					? this.props.loader || (
						<div
							style={{
								textAlign: 'center',
								margin: '20px 0',
								color: '#666',
							}}
						>
								Loading...
						</div>
					) // prettier-ignore
					: null}
				{this.props.pagination
				&& (this.props.paginationAt === 'bottom' || this.props.paginationAt === 'both')
					? (
						<Pagination
							pages={this.props.pages}
							totalPages={Math.ceil(this.props.total / this.props.size)}
							currentPage={this.state.currentPage}
							setPage={this.setPage}
							innerClass={this.props.innerClass}
							fragmentName={this.props.componentId}
						/>
					) : null}
				{this.props.config.url.endsWith('appbase.io') && filteredResults.length ? (
					<Flex
						direction="row-reverse"
						className={getClassName(this.props.innerClass, 'poweredBy')}
					>
						<PoweredBy />
					</Flex>
				) : null}
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
	setComponentProps: types.funcRequired,
	updateComponentProps: types.funcRequired,
	setStreaming: types.func,
	searchState: types.dateObject,
	updateQuery: types.funcRequired,
	watchComponent: types.funcRequired,
	currentPage: types.number,
	hits: types.hits,
	isLoading: types.bool,
	includeFields: types.includeFields,
	streamHits: types.hits,
	promotedResults: types.hits,
	time: types.number,
	total: types.number,
	config: types.props,
	analytics: types.props,
	queryLog: types.props,
	error: types.title,
	// component props
	className: types.string,
	componentId: types.stringRequired,
	children: types.func,
	dataField: types.stringRequired,
	defaultPage: types.number,
	defaultQuery: types.func,
	excludeFields: types.excludeFields,
	innerClass: types.style,
	infiniteScroll: types.bool,
	listClass: types.string,
	loader: types.title,
	render: types.func,
	renderItem: types.func,
	renderError: types.title,
	onData: types.func,
	renderNoResults: types.title,
	onPageChange: types.func,
	onPageClick: types.func,
	pages: types.number,
	pagination: types.bool,
	paginationAt: types.paginationAt,
	react: types.react,
	renderResultStats: types.func,
	scrollOnChange: types.bool,
	scrollTarget: types.string,
	showLoader: types.bool,
	showResultStats: types.bool,
	size: types.number,
	sortBy: types.sortBy,
	sortOptions: types.sortOptions,
	stream: types.bool,
	style: types.style,
	URLParams: types.bool,
	defaultSortOption: types.string,
};

ReactiveList.defaultProps = {
	className: null,
	currentPage: 0,
	listClass: '',
	pages: 5,
	infiniteScroll: true,
	pagination: false,
	paginationAt: 'bottom',
	includeFields: ['*'],
	excludeFields: [],
	showResultStats: true,
	size: 10,
	style: {},
	URLParams: false,
	showLoader: true,
	renderNoResults: () => 'No Results found.',
	scrollOnChange: true,
	defaultSortOption: null,
};

const mapStateToProps = (state, props) => ({
	defaultPage:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value - 1)
		|| -1,
	hits: state.hits[props.componentId] && state.hits[props.componentId].hits,
	isLoading: state.isLoading[props.componentId] || false,
	streamHits: state.streamHits[props.componentId],
	time: (state.hits[props.componentId] && state.hits[props.componentId].time) || 0,
	total: state.hits[props.componentId] && state.hits[props.componentId].total,
	analytics: state.analytics,
	config: state.config,
	queryLog: state.queryLog[props.componentId],
	error: state.error[props.componentId],
	promotedResults: state.promotedResults,
	searchState: getSearchState(state, true),
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	setComponentProps: (component, options) => dispatch(setComponentProps(component, options)),
	updateComponentProps: (component, options) =>
		dispatch(updateComponentProps(component, options)),
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

const ConnectedComponent = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(props => <ReactiveList ref={props.myForwardedRef} {...props} />);

// eslint-disable-next-line
const ForwardRefComponent = React.forwardRef((props, ref) => (
	<ConnectedComponent {...props} myForwardedRef={ref} />
));
hoistNonReactStatics(ForwardRefComponent, ReactiveList);

ForwardRefComponent.name = 'ReactiveList';
export default ForwardRefComponent;
