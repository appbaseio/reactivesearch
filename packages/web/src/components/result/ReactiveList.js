/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { Component } from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { withTheme } from 'emotion-theming';
import {
	setStreaming,
	setQueryOptions,
	updateQuery,
	loadMore,
	recordResultClick,
	setValue,
	updateComponentProps,
	setDefaultQuery,
} from '@appbaseio/reactivecore/lib/actions';
import {
	isEqual,
	getQueryOptions,
	getClassName,
	parseHits,
	checkSomePropChange,
	getOptionsFromQuery,
	getCompositeAggsQuery,
	getResultStats,
	updateDefaultQuery,
} from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import { getInternalComponentID } from '@appbaseio/reactivecore/lib/utils/transform';
import Pagination from './addons/Pagination';
import PoweredBy from './addons/PoweredBy';

import Flex from '../../styles/Flex';
import { resultStats, sortOptions } from '../../styles/results';
import { container } from '../../styles/Card';
import { container as listContainer } from '../../styles/ListItem';
import { connect, isFunction, getComponent, hasCustomRenderer } from '../../utils';
import Results from './addons/Results';
import ComponentWrapper from '../basic/ComponentWrapper';

class ReactiveList extends Component {
	static ResultCardsWrapper = ({ children, ...rest }) => (
		<div css={container} {...rest}>
			{children}
		</div>
	);
	static ResultListWrapper = ({ children, ...rest }) => (
		<div css={listContainer} {...rest}>
			{children}
		</div>
	);
	constructor(props) {
		super(props);

		// no support for pagination and aggregationField together
		if (props.pagination && props.aggregationField) {
			console.warn(
				'Pagination is not supported when aggregationField is present. The list will be rendered with infinite scroll',
			);
		}

		let currentPage = 0;
		if (this.props.defaultPage >= 0) {
			currentPage = this.props.defaultPage;
		} else if (this.props.currentPage) {
			currentPage = Math.max(this.props.currentPage - 1, 0);
		}
		this.initialFrom = currentPage * props.size; // used for page resetting on query change
		this.shouldRenderPagination = props.pagination && !props.aggregationField;
		this.state = {
			from: this.initialFrom,
			currentPage,
		};
		this.internalComponent = getInternalComponentID(props.componentId);
		this.sortOptionIndex = this.props.defaultSortOption
			? this.props.sortOptions.findIndex(s => s.label === this.props.defaultSortOption)
			: 0;
	}

	componentDidMount() {
		if (this.props.stream) {
			this.props.setStreaming(this.props.componentId, true);
		}

		let options = getQueryOptions(this.props);
		options.from = this.state.from;
		if (this.props.sortOptions) {
			const sortField = this.props.sortOptions[this.sortOptionIndex].dataField;
			const sortBy = this.props.sortOptions[this.sortOptionIndex].sortBy;
			options.sort = [
				{
					[sortField]: {
						order: sortBy,
					},
				},
			];
			// To handle sort options for RS API
			this.props.updateComponentProps(
				this.props.componentId,
				Object.assign({}, this.props, { dataField: sortField }, { sortBy }, this.absProps),
				componentTypes.reactiveList,
			);
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

		this.props.setQueryOptions(
			this.props.componentId,
			{ ...options, ...this.getAggsQuery() },
			execute,
		);

		if (this.defaultQuery) {
			this.props.updateQuery(
				{
					componentId: this.internalComponent,
					query,
				},
				execute,
			);
			// Update calculated default query in store
			updateDefaultQuery(this.props.componentId, this.props);
		} else {
			this.props.updateQuery(
				{
					componentId: this.internalComponent,
					query: null,
				},
				execute,
			);
		}

		this.domNode = window;
		if (this.showInfiniteScroll) {
			const { scrollTarget } = this.props;
			if (typeof scrollTarget === 'string' || scrollTarget instanceof String) {
				this.domNode = document.getElementById(scrollTarget);
			} else if (scrollTarget instanceof Element || scrollTarget instanceof HTMLDocument) {
				this.domNode = scrollTarget;
			}
			this.domNode.addEventListener('scroll', this.scrollHandler);
		}
	}

	componentDidUpdate(prevProps) {
		const totalPages = Math.ceil(this.props.total / this.props.size) || 0;
		if (this.props.onData) {
			checkSomePropChange(
				this.props,
				prevProps,
				[
					'hits',
					'streamHits',
					'promotedResults',
					'customData',
					'total',
					'size',
					'time',
					'hidden',
				],
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
			this.props.setQueryOptions(
				this.props.componentId,
				{ ...options, ...this.getAggsQuery() },
				true,
			);
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

			// Update calculated default query in store
			updateDefaultQuery(this.props.componentId, this.props);

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

		if (this.shouldRenderPagination) {
			// called when page is changed
			if (this.props.isLoading && (this.props.hits || prevProps.hits)) {
				if (this.props.onPageChange) {
					this.props.onPageChange(this.state.currentPage + 1, totalPages);
				} else if (this.props.scrollOnChange && this.props.pagination) {
					this.scrollToTop();
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
						this.scrollToTop();
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
		if (this.domNode) {
			this.domNode.removeEventListener('scroll', this.scrollHandler);
		}
	}

	getAggsQuery = () => {
		const { size, aggregationField, afterKey } = this.props;
		const queryOptions = { size };
		if (aggregationField) {
			queryOptions.aggs = getCompositeAggsQuery(
				{},
				this.props,
				afterKey ? { after: afterKey } : null,
				true,
			).aggs;
		}
		return queryOptions;
	};

	// Calculate results
	getAllData = () => {
		const {
			size, promotedResults, aggregationData, customData,
		} = this.props;
		const { currentPage } = this.state;
		const results = parseHits(this.props.hits) || [];
		const streamResults = parseHits(this.props.streamHits) || [];
		const parsedPromotedResults = parseHits(promotedResults) || [];
		let filteredResults = results;
		const base = currentPage * size;
		if (streamResults.length) {
			const ids = streamResults.map(item => item._id);
			filteredResults = filteredResults.filter(item => !ids.includes(item._id));
		}

		if (parsedPromotedResults.length) {
			const ids = parsedPromotedResults.map(item => item._id).filter(Boolean);
			if (ids) {
				filteredResults = filteredResults.filter(item => !ids.includes(item._id));
			}

			filteredResults = [...streamResults, ...parsedPromotedResults, ...filteredResults];
		}
		return {
			results,
			streamResults,
			filteredResults,
			promotedResults: parsedPromotedResults,
			customData: customData || {},
			aggregationData: aggregationData || [],
			loadMore: this.loadMore,
			base,
			triggerClickAnalytics: this.triggerClickAnalytics,
		};
	};
	get stats() {
		const { currentPage } = this.state;
		const { filteredResults } = this.getAllData();
		return {
			...getResultStats(this.props),
			currentPage,
			displayedResults: filteredResults.length,
		};
	}
	// Returns the props without default props to apply search relevancy settings for RS API
	get absProps() {
		const { originalProps: { includeFields, excludeFields, size } } = this.props;
		return {
			includeFields: includeFields || undefined,
			excludeFields: excludeFields || undefined,
			size: size || undefined,
		};
	}

	get showInfiniteScroll() {
		// Pagination has higher priority then infinite scroll
		const { infiniteScroll } = this.props;
		return infiniteScroll && !this.shouldRenderPagination;
	}

	get hasCustomRenderer() {
		return hasCustomRenderer(this.props);
	}

	scrollToTop = () => {
		if (this.domNode === window) {
			document.documentElement.scrollTop = 0;
			document.body.scrollTop = 0;
		} else {
			this.domNode.scrollTop = 0;
		}
	};

	// only used for SSR
	static generateQueryOptions = (props) => {
		// simulate default (includeFields and excludeFields) props to generate consistent query
		const options = getQueryOptions({ includeFields: ['*'], excludeFields: [], ...props });
		const {
			size,
			dataField,
			defaultSortOption,
			sortOptions: sortOptionsNew,
			currentPage,
			sortBy,
		} = props;
		options.from = currentPage ? (currentPage - 1) * (size || 10) : 0;
		options.size = size || 10;

		const getSortOption = () => {
			if (defaultSortOption) {
				const sortOption = sortOptionsNew.find(
					option => option.label === defaultSortOption,
				);
				if (sortOption) {
					return {
						[sortOption.dataField]: {
							order: sortOption.sortBy,
						},
					};
				}
			}
			return {
				[sortOptionsNew[0].dataField]: {
					order: sortOptionsNew[0].sortBy,
				},
			};
		};

		if (sortOptionsNew) {
			options.sort = [getSortOption()];
		} else if (sortBy) {
			options.sort = [
				{
					[dataField]: {
						order: sortBy,
					},
				},
			];
		}

		return options;
	};

	scrollHandler = () => {
		let renderLoader
			= window.innerHeight + window.pageYOffset + 300 >= document.body.scrollHeight;
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
		if (this.props.aggregationField && !this.props.afterKey) return;
		if (this.props.hits && this.props.total !== this.props.hits.length) {
			const value = this.state.from + this.props.size;
			const options = { ...getQueryOptions(this.props), ...this.getAggsQuery() };
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
				!!this.props.aggregationField,
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
		const { hits, promotedResults, total } = this.props;

		const shouldStatsVisible
			= hits && promotedResults && (hits.length || promotedResults.length);
		if (this.props.renderResultStats && shouldStatsVisible) {
			return this.props.renderResultStats(this.stats);
		} else if (total) {
			return (
				<p css={resultStats} className={getClassName(this.props.innerClass, 'resultStats')}>
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

		const sortField = this.props.sortOptions[index].dataField;
		const sortBy = this.props.sortOptions[index].sortBy;
		options.sort = [
			{
				[sortField]: {
					order: sortBy,
				},
			},
		];
		// To handle sortOptions for RS API
		this.props.updateComponentProps(
			this.props.componentId,
			Object.assign({}, this.props, { dataField: sortField }, { sortBy }, this.absProps),
			componentTypes.reactiveList,
		);
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
		this.props.triggerAnalytics(searchPosition);
	};

	renderSortOptions = () => (
		<select
			css={sortOptions}
			className={getClassName(this.props.innerClass, 'sortOptions')}
			name="sort-options"
			onChange={this.handleSortChange}
			value={this.sortOptionIndex}
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
	getData = () => {
		const {
			streamResults,
			filteredResults,
			promotedResults,
			aggregationData,
			customData,
		} = this.getAllData();
		return {
			data: this.withClickIds(filteredResults),
			aggregationData: this.withClickIds(aggregationData || []),
			streamData: this.withClickIds(streamResults),
			promotedData: this.withClickIds(promotedResults),
			customData,
			rawData: this.props.rawData,
			resultStats: this.stats,
		};
	};
	getComponent = () => {
		const { error, isLoading } = this.props;
		const data = {
			error,
			loading: isLoading,
			loadMore: this.loadMore,
			triggerAnalytics: this.triggerClickAnalytics,
			...this.getData(),
		};
		return getComponent(data, this.props);
	};

	render() {
		const {
			renderItem, size, error, renderPagination,
		} = this.props;
		const { currentPage } = this.state;
		const { filteredResults } = this.getAllData();
		const paginationProps = {
			pages: this.props.pages,
			totalPages: Math.ceil(this.props.total / size),
			currentPage: this.state.currentPage,
			setPage: this.setPage,
			showEndPage: this.props.showEndPage,
			innerClass: this.props.innerClass,
			fragmentName: this.props.componentId,
		};
		const paginationElement = renderPagination ? (
			renderPagination(paginationProps)
		) : (
			<Pagination {...paginationProps} />
		);

		const base = currentPage * size;
		return (
			<div style={this.props.style} className={this.props.className}>
				{this.props.isLoading && this.shouldRenderPagination && this.props.loader}
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
				{this.shouldRenderPagination
				&& ['top', 'both'].indexOf(this.props.paginationAt) !== -1
					? paginationElement
					: null}

				<Results
					base={base}
					hasCustomRender={this.hasCustomRenderer}
					getComponent={this.getComponent}
					listClass={this.props.listClass}
					innerClass={this.props.innerClass}
					renderItem={renderItem}
					triggerClickAnalytics={this.triggerClickAnalytics}
					filteredResults={filteredResults}
				/>

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
				{this.shouldRenderPagination
				&& ['bottom', 'both'].indexOf(this.props.paginationAt) !== -1
					? paginationElement
					: null}

				<PoweredBy
					show={
						!!(this.props.config.url.endsWith('appbase.io') && filteredResults.length)
					}
					innerClass={this.props.innerClass}
				/>
			</div>
		);
	}
}

ReactiveList.propTypes = {
	loadMore: types.funcRequired,
	onQueryChange: types.func,
	onError: types.func,
	setPageURL: types.func,
	setQueryOptions: types.funcRequired,
	setDefaultQuery: types.funcRequired,
	updateComponentProps: types.funcRequired,
	setStreaming: types.func,
	searchState: types.dateObject,
	updateQuery: types.funcRequired,
	currentPage: types.number,
	hits: types.hits,
	rawData: types.rawData,
	isLoading: types.bool,
	includeFields: types.includeFields,
	streamHits: types.hits,
	promotedResults: types.hits,
	customData: types.title,
	time: types.number,
	total: types.number,
	hidden: types.number,
	config: types.props,
	analytics: types.props,
	queryLog: types.props,
	error: types.title,
	headers: types.headers,
	// component props
	className: types.string,
	componentId: types.stringRequired,
	children: types.func,
	dataField: types.stringRequired,
	aggregationField: types.string,
	aggregationData: types.aggregationData,
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
	renderPagination: types.func,
	onData: types.func,
	renderNoResults: types.title,
	onPageChange: types.func,
	onPageClick: types.func,
	pages: types.number,
	pagination: types.bool,
	paginationAt: types.paginationAt,
	showEndPage: types.bool,
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
	triggerAnalytics: types.funcRequired,
	URLParams: types.bool,
	defaultSortOption: types.string,
	afterKey: types.props,
	// eslint-disable-next-line
	originalProps: types.any,
};

ReactiveList.defaultProps = {
	className: null,
	currentPage: 0,
	listClass: '',
	pages: 5,
	infiniteScroll: true,
	pagination: false,
	paginationAt: 'bottom',
	showEndPage: false,
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
	originalProps: {},
};

// Add componentType for SSR
ReactiveList.componentType = componentTypes.reactiveList;

const mapStateToProps = (state, props) => ({
	defaultPage:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value - 1)
		|| -1,
	hits: state.hits[props.componentId] && state.hits[props.componentId].hits,
	rawData: state.rawData[props.componentId],
	aggregationData: state.compositeAggregations[props.componentId],
	isLoading: state.isLoading[props.componentId] || false,
	streamHits: state.streamHits[props.componentId],
	time: (state.hits[props.componentId] && state.hits[props.componentId].time) || 0,
	total: state.hits[props.componentId] && state.hits[props.componentId].total,
	hidden: state.hits[props.componentId] && state.hits[props.componentId].hidden,
	config: state.config,
	queryLog: state.queryLog[props.componentId],
	error: state.error[props.componentId],
	promotedResults: state.promotedResults[props.componentId] || [],
	customData: state.customData[props.componentId],
	afterKey:
		state.aggregations[props.componentId]
		&& state.aggregations[props.componentId][props.aggregationField]
		&& state.aggregations[props.componentId][props.aggregationField].after_key,
});

const mapDispatchtoProps = dispatch => ({
	setDefaultQuery: (component, query) => dispatch(setDefaultQuery(component, query)),
	updateComponentProps: (component, options, componentType) =>
		dispatch(updateComponentProps(component, options, componentType)),
	loadMore: (component, options, append, appendAggs) =>
		dispatch(loadMore(component, options, append, appendAggs)),
	setPageURL: (component, value, label, showFilter, URLParams) =>
		dispatch(setValue(component, value, label, showFilter, URLParams)),
	setQueryOptions: (component, props, execute) =>
		dispatch(setQueryOptions(component, props, execute)),
	setStreaming: (component, stream) => dispatch(setStreaming(component, stream)),
	updateQuery: (updateQueryObject, execute) => dispatch(updateQuery(updateQueryObject, execute)),
	triggerAnalytics: searchPosition => dispatch(recordResultClick(searchPosition)),
});

const ConnectedComponent = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(
	withTheme(props => (
		<ComponentWrapper internalComponent componentType={componentTypes.reactiveList} {...props}>
			{() => {
				const { includeFields, excludeFields, size } = props;
				return (<ReactiveList
					ref={props.myForwardedRef}
					{...props}
					originalProps={{
						includeFields, excludeFields, size,
					}}
				/>);
			}}
		</ComponentWrapper>
	)),
);

// eslint-disable-next-line
const ForwardRefComponent = React.forwardRef((props, ref) => (
	<ConnectedComponent {...props} myForwardedRef={ref} />
));
hoistNonReactStatics(ForwardRefComponent, ReactiveList);

ForwardRefComponent.name = 'ReactiveList';
export default ForwardRefComponent;
