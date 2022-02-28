import { Actions, helper } from '@appbaseio/reactivecore';
import VueTypes from 'vue-types';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import { withClickIds } from '@appbaseio/reactivecore/lib/utils/helper';
import Pagination from './addons/Pagination.jsx';
import PoweredBy from './addons/PoweredBy.jsx';
import ComponentWrapper from '../basic/ComponentWrapper.jsx';
import ResultListWrapper from './addons/ResultListWrapper.jsx';
import ResultCardsWrapper from './addons/ResultCardsWrapper.jsx';
import {
	connect,
	isFunction,
	hasCustomRenderer,
	getComponent,
	updateDefaultQuery,
	isQueryIdentical,
} from '../../utils/index';
import Flex from '../../styles/Flex';
import types from '../../utils/vueTypes';
import { resultStats, sortOptions } from '../../styles/results';
import ImpressionTracker from './addons/ImpressionTracker.jsx';

const {
	setQueryOptions,
	updateQuery,
	loadMore,
	setValue,
	updateComponentProps,
	setDefaultQuery,
	recordResultClick,
} = Actions;

const {
	isEqual,
	getQueryOptions,
	getClassName,
	parseHits,
	getOptionsFromQuery,
	getCompositeAggsQuery,
	getResultStats,
} = helper;

const ReactiveList = {
	name: 'ReactiveList',
	components: {
		ResultListWrapper,
		ResultCardsWrapper,
	},
	data() {
		let currentPageState = 0;
		const defaultPage = this.defaultPage || -1;
		if (defaultPage >= 0) {
			currentPageState = defaultPage;
		} else if (this.currentPage) {
			currentPageState = Math.max(this.currentPage - 1, 0);
		}

		this.__state = {
			from: currentPageState * this.size,
			currentPageState,
		};
		return this.__state;
	},
	created() {
		const { distinctField, distinctFieldConfig, index } = this.$props;
		// no support for pagination and aggregationField together
		if (this.pagination && this.aggregationField) {
			console.warn(
				'Pagination is not supported when aggregationField is present. The list will be rendered with infinite scroll',
			);
		}
		if (this.enableAppbase && this.aggregationField && this.aggregationField !== '') {
			console.warn(
				'Warning(ReactiveSearch): The `aggregationField` prop has been marked as deprecated, please use the `distinctField` prop instead.',
			);
		}
		if (!this.enableAppbase && (distinctField || distinctFieldConfig)) {
			console.warn(
				'Warning(ReactiveSearch): In order to use the `distinctField` and `distinctFieldConfig` props, the `enableAppbase` prop must be set to true in `ReactiveBase`.',
			);
		}
		if (!this.enableAppbase && index) {
			console.warn(
				'Warning(ReactiveSearch): In order to use the `index` prop, the `enableAppbase` prop must be set to true in `ReactiveBase`.',
			);
		}
		const defaultPage = this.defaultPage || -1;
		if (defaultPage >= 0) {
			this.currentPageState = defaultPage;
			this.from = this.currentPageState * this.$props.size;
		}
		this.internalComponent = `${this.$props.componentId}__internal`;

		this.sortOptionIndex = 0;
		if (this.defaultSortOption && this.sortOptions && Array.isArray(this.sortOptions)) {
			this.sortOptionIndex = this.sortOptions.findIndex(
				(s) => s.label === this.defaultSortOption,
			);
		}

		this.updateComponentProps(
			this.componentId,
			{ from: this.from },
			componentTypes.reactiveList,
		);
		this.updateComponentProps(
			this.internalComponent,
			{ from: this.from },
			componentTypes.reactiveList,
		);
	},
	props: {
		currentPage: VueTypes.number.def(0),
		includeFields: types.includeFields,
		// component props
		className: types.string,
		componentId: types.stringRequired,
		dataField: types.stringRequired,
		aggregationField: types.string,
		aggregationSize: VueTypes.number,
		defaultQuery: types.func,
		defaultSortOption: types.string,
		excludeFields: types.excludeFields,
		innerClass: types.style,
		listClass: VueTypes.string.def(''),
		loader: types.title,
		render: types.func,
		renderItem: types.func,
		renderNoResults: VueTypes.any.def('No Results found.'),
		renderError: types.title,
		renderResultStats: types.func,
		pages: VueTypes.number.def(5),
		pagination: VueTypes.bool.def(false),
		infiniteScroll: VueTypes.bool.def(true),
		paginationAt: VueTypes.oneOf(['top', 'bottom', 'both']).def('bottom'),
		react: types.react,
		scrollOnChange: VueTypes.bool.def(true),
		showResultStats: VueTypes.bool.def(true),
		showEndPage: VueTypes.bool.def(false),
		size: VueTypes.number.def(10),
		sortBy: types.sortBy,
		sortOptions: types.sortOptions,
		URLParams: VueTypes.bool.def(false),
		prevLabel: types.string,
		nextLabel: types.string,
		distinctField: types.string,
		distinctFieldConfig: types.props,
		index: VueTypes.string,
	},
	computed: {
		shouldRenderPagination() {
			return this.pagination && !this.aggregationField;
		},
		totalPages() {
			return Math.ceil(this.total / this.$props.size) || 0;
		},
		hasPageChangeListener() {
			return this.$listeners && this.$listeners.pageChange;
		},
		hasResultStatsListener() {
			return this.$listeners && this.$listeners.resultStats;
		},
		stats() {
			return {
				...getResultStats(this),
				currentPage: this.currentPageState,
				displayedResults: this.data.length,
			};
		},
		hasCustomRender() {
			return hasCustomRenderer(this);
		},
		showInfiniteScroll() {
			// Pagination has higher priority then infinite scroll
			return this.infiniteScroll && !this.shouldRenderPagination;
		},
		data() {
			const results = parseHits(this.hits) || [];
			const parsedPromotedResults = parseHits(this.promotedResults) || [];
			let filteredResults = results;

			if (parsedPromotedResults.length) {
				const ids = parsedPromotedResults.map((item) => item._id).filter(Boolean);
				if (ids) {
					filteredResults = filteredResults.filter((item) => !ids.includes(item._id));
				}

				filteredResults = [...parsedPromotedResults, ...filteredResults];
			}
			return withClickIds(filteredResults);
		},
	},
	watch: {
		sortOptions(newVal, oldVal) {
			if (!isEqual(oldVal, newVal)) {
				this.updateQueryOptions(this.$props);
			}
		},
		sortBy(newVal, oldVal) {
			if (oldVal !== newVal) {
				this.updateQueryOptions(this.$props);
			}
		},
		size(newVal, oldVal) {
			if (oldVal !== newVal) {
				this.updateQueryOptions(this.$props);
			}
		},
		dataField(newVal, oldVal) {
			if (oldVal !== newVal) {
				this.updateQueryOptions(this.$props);
			}
		},
		includeFields(newVal, oldVal) {
			if (oldVal !== newVal) {
				this.updateQueryOptions(this.$props);
			}
		},
		excludeFields(newVal, oldVal) {
			if (oldVal !== newVal) {
				this.updateQueryOptions(this.$props);
			}
		},
		defaultQuery(newVal, oldVal) {
			if (!isQueryIdentical(newVal, oldVal, null, this.$props)) {
				let options = getQueryOptions(this.$props);
				options.from = 0;
				this.$defaultQuery = newVal(null, this.$props);
				const { sort, query } = this.$defaultQuery || {};

				if (sort) {
					options.sort = this.$defaultQuery.sort;
				}
				const queryOptions = getOptionsFromQuery(this.$defaultQuery);
				if (queryOptions) {
					options = { ...options, ...getOptionsFromQuery(this.$defaultQuery) };
				}
				// Update calculated default query in store
				updateDefaultQuery(this.componentId, this.setDefaultQuery, this.$props);
				this.setQueryOptions(
					this.$props.componentId,
					{ ...options, ...this.getAggsQuery() },
					!query,
				);

				this.updateQuery(
					{
						componentId: this.internalComponent,
						query,
					},
					true,
				); // reset page because of query change
				this.currentPageState = 0;
				this.from = 0;
			}
		},
		promotedResults(newVal, oldVal) {
			if (!isEqual(newVal, oldVal)) {
				this.$emit('data', this.getData());
			}
		},
		hidden(newVal, oldVal) {
			if (!isEqual(newVal, oldVal)) {
				this.$emit('data', this.getData());
			}
		},
		time(newVal, oldVal) {
			if (!isEqual(newVal, oldVal)) {
				this.$emit('data', this.getData());
			}
		},
		hits(newVal, oldVal) {
			this.$emit('data', this.getData());
			if (this.shouldRenderPagination) {
				// called when page is changed
				if (this.isLoading && (oldVal || newVal)) {
					if (this.hasPageChangeListener) {
						this.$emit('pageChange', this.currentPageState + 1, this.totalPages);
						this.$emit('page-change', this.currentPageState + 1, this.totalPages);
					} else if (this.scrollOnChange) {
						window.scrollTo(0, 0);
					}
				}
			} else if (oldVal && newVal) {
				if (oldVal.length !== newVal.length || newVal.length === this.$props.total) {
					if (newVal.length < oldVal.length) {
						// query has changed
						if (this.scrollOnChange) {
							window.scrollTo(0, 0);
						}
						this.from = 0;
					}
				}
			}
		},
		rawData(newVal, oldVal) {
			if (!isEqual(newVal, oldVal)) {
				this.$emit('data', this.getData());
			}
		},
		currentPage(newVal, oldVal) {
			if (oldVal !== newVal && newVal > 0 && newVal <= this.totalPages) {
				this.setPage(newVal - 1);
			}
		},
		infiniteScroll(newVal, oldVal) {
			if (newVal !== oldVal) {
				if (!newVal) {
					window.addEventListener('scroll', this.scrollHandler);
				} else {
					window.removeEventListener('scroll', this.scrollHandler);
				}
			} // handle window url history change (on native back and forth interactions)
		},
		defaultPage(newVal, oldVal) {
			if (this.currentPageState !== newVal && oldVal !== newVal) {
				this.setPage(newVal >= 0 ? newVal : 0);
			}
		},
	},
	mounted() {
		if (this.defaultPage < 0 && this.currentPage > 0) {
			this.setPageURL(
				this.$props.componentId,
				this.currentPage,
				this.$props.componentId,
				false,
				this.URLParams,
			);
		}
		let options = getQueryOptions(this.$props);
		options.from = this.$data.from;

		if (this.sortOptions && this.sortOptions[this.sortOptionIndex]) {
			const sortField = this.sortOptions[this.sortOptionIndex].dataField;
			const { sortBy } = this.sortOptions[this.sortOptionIndex];
			options.sort = [
				{
					[sortField]: {
						order: sortBy,
					},
				},
			];
			// To handle sort options for RS API
			this.updateComponentProps(
				this.componentId,
				{ dataField: sortField, sortBy },
				componentTypes.reactiveList,
			);
		} else if (this.$props.sortBy) {
			options.sort = [
				{
					[this.$props.dataField]: {
						order: this.$props.sortBy,
					},
				},
			];
		} // Override sort query with defaultQuery's sort if defined

		this.$defaultQuery = null;

		if (this.$props.defaultQuery) {
			this.$defaultQuery = this.$props.defaultQuery();
			options = { ...options, ...getOptionsFromQuery(this.$defaultQuery) };

			if (this.$defaultQuery.sort) {
				options.sort = this.$defaultQuery.sort;
			}
			// Update calculated default query in store
			updateDefaultQuery(this.componentId, this.setDefaultQuery, this.$props);
		}
		// execute is set to false at the time of mount
		const { query } = this.$defaultQuery || {};

		const execute = false;
		this.setQueryOptions(
			this.$props.componentId,
			{ ...options, ...this.getAggsQuery() },
			execute,
		);

		if (this.$defaultQuery) {
			this.updateQuery(
				{
					componentId: this.internalComponent,
					query,
				},
				execute,
			);
		} else {
			this.updateQuery(
				{
					componentId: this.internalComponent,
					query: null,
				},
				execute,
			);
		} // query will be executed here

		if (this.showInfiniteScroll) {
			window.addEventListener('scroll', this.scrollHandler);
		}
	},

	beforeDestroy() {
		if (this.showInfiniteScroll) {
			window.removeEventListener('scroll', this.scrollHandler);
		}
	},

	render() {
		const { hits } = this.$data;
		const results = parseHits(hits) || [];
		return (
			<div style={this.$props.style} class={this.$props.className}>
				{this.isLoading
					&& this.shouldRenderPagination
					&& this.showInfiniteScroll
					&& (this.$scopedSlots.loader || this.$props.loader)}
				{this.renderErrorComponent()}
				<Flex
					labelPosition={this.sortOptions ? 'right' : 'left'}
					class={getClassName(this.$props.innerClass, 'resultsInfo')}
				>
					{this.sortOptions ? this.renderSortOptions() : null}
					{this.$props.showResultStats && results.length ? this.renderStats() : null}
				</Flex>
				{!this.isLoading && hits && hits.length === 0 ? this.renderNoResult() : null}
				{this.shouldRenderPagination
				&& (this.$props.paginationAt === 'top' || this.$props.paginationAt === 'both') ? (
						<Pagination
							pages={this.$props.pages}
							totalPages={this.totalPages}
							currentPage={this.currentPageState}
							setPage={this.setPage}
							innerClass={this.$props.innerClass}
							prevLabel={this.$props.prevLabel}
							nextLabel={this.$props.nextLabel}
						/>
					) : null}
				{this.renderResults()}
				{this.isLoading && !this.shouldRenderPagination
					? this.$scopedSlots.loader
					  || this.$props.loader || (
						<div
							style={{
								textAlign: 'center',
								margin: '20px 0',
								color: '#666',
							}}
						>
								Loading...
						</div>
					  )
					: null}
				{this.shouldRenderPagination
				&& (this.$props.paginationAt === 'bottom' || this.$props.paginationAt === 'both') ? (
						<Pagination
							pages={this.$props.pages}
							totalPages={Math.ceil(this.$data.total / this.$props.size)}
							currentPage={this.currentPageState}
							setPage={this.setPage}
							showEndPage={this.$props.showEndPage}
							innerClass={this.$props.innerClass}
							prevLabel={this.$props.prevLabel}
							nextLabel={this.$props.nextLabel}
						/>
					) : null}
				{this.url.endsWith('appbase.io') && results.length ? (
					<Flex
						direction="row-reverse"
						class={getClassName(this.$props.innerClass, 'poweredBy')}
					>
						<PoweredBy />
					</Flex>
				) : null}
			</div>
		);
	},

	methods: {
		renderErrorComponent() {
			const renderError = this.$scopedSlots.renderError || this.$props.renderError;
			if (renderError && this.error && !this.isLoading) {
				return isFunction(renderError) ? renderError(this.error) : renderError;
			}
			return null;
		},
		renderResults() {
			const { size } = this.$props;

			const renderItem = this.$scopedSlots.renderItem || this.$props.renderItem;

			const element = this.hasCustomRender ? (
				this.getComponent()
			) : (
				<div
					class={`${this.$props.listClass} ${getClassName(
						this.$props.innerClass,
						'list',
					)}`}
				>
					{this.data.map((item, index) =>
						renderItem({
							item,
							triggerClickAnalytics: () =>
								this.triggerClickAnalytics(this.currentPageState * size + index),
						}),
					)}
				</div>
			);
			// If analytics is set to true then render with impression tracker
			return this.analytics ? (
				<ImpressionTracker hits={this.data}>{element}</ImpressionTracker>
			) : (
				element
			);
		},
		updateQueryOptions(props) {
			const options = getQueryOptions(props);
			options.from = this.$data.from;

			if (props.sortOptions && Array.isArray(props.sortOptions)) {
				const sortOptionIndex = props.defaultSortOption
					? props.sortOptions.findIndex((s) => s.label === props.defaultSortOption)
					: 0;
				if (props.sortOptions[sortOptionIndex]) {
					options.sort = [
						{
							[props.sortOptions[sortOptionIndex].dataField]: {
								order: props.sortOptions[sortOptionIndex].sortBy,
							},
						},
					];
				}
			} else if (props.sortBy) {
				options.sort = [
					{
						[props.dataField]: {
							order: props.sortBy,
						},
					},
				];
			}
			this.setQueryOptions(
				this.$props.componentId,
				{ ...options, ...this.getAggsQuery() },
				true,
			);
		},
		getAggsQuery() {
			const { size, aggregationField } = this.$props;
			const { afterKey } = this.$data;
			const queryOptions = { size };
			if (aggregationField) {
				queryOptions.aggs = getCompositeAggsQuery({
					props: this.$props,
					after: afterKey || null,
					showTopHits: true,
				}).aggs;
			}
			return queryOptions;
		},

		scrollHandler() {
			if (
				!this.isLoading
				&& window.innerHeight + window.pageYOffset + 300 >= document.body.scrollHeight
			) {
				this.loadMore();
			}
		},

		loadMore() {
			if (this.aggregationField && !this.afterKey) return;
			if (this.hits && !this.shouldRenderPagination && this.total > this.hits.length) {
				const value = this.$data.from + this.$props.size;
				// If current hits length is less than the current from then it means
				// that there are no results present.
				// It can happen because of many reasons some of them are:
				// 1. Using the `collapse` query to remove results
				// 2. Shard failure
				// In above cases infinite scroll should not load more results that can
				// cause the resetting of the `from` value

				if (this.hits.length < value) {
					return;
				}
				const options = { ...getQueryOptions(this.$props), ...this.getAggsQuery() };
				this.from = value;
				// Update default query to support pagination for aggregationField
				updateDefaultQuery(this.componentId, this.setDefaultQuery, this.$props);
				this.loadMoreAction(
					this.$props.componentId,
					{
						...options,
						from: value,
					},
					true,
					!!this.aggregationField,
				);
			}
		},
		setPage(page) {
			// pageClick will be called every time a pagination button is clicked
			if (page !== this.currentPageState) {
				this.$emit('pageClick', page + 1);
				this.$emit('page-click', page + 1);
				const value = this.$props.size * page;
				const options = getQueryOptions(this.$props);
				options.from = this.$data.from;
				this.from = value;
				this.currentPageState = page;
				this.loadMoreAction(
					this.$props.componentId,
					{
						...options,
						from: value,
					},
					false,
				);
				this.setPageURL(
					this.$props.componentId,
					page + 1,
					this.$props.componentId,
					false,
					this.URLParams,
				);
			}
		},

		renderStats() {
			const renderResultStats
				= this.$scopedSlots.renderResultStats || this.$props.renderResultStats;
			if (renderResultStats && this.$data.total) {
				return renderResultStats(this.stats);
			}
			if (this.stats.numberOfResults) {
				return (
					<p
						class={`${resultStats} ${getClassName(
							this.$props.innerClass,
							'resultStats',
						)}`}
					>
						{this.stats.numberOfResults} results found in {this.stats.time || 0}
						ms
					</p>
				);
			}
			return null;
		},

		renderNoResult() {
			const renderNoResults
				= this.$scopedSlots.renderNoResults || this.$props.renderNoResults;
			if (this.$scopedSlots.renderNoResults) {
				return isFunction(renderNoResults) ? renderNoResults() : renderNoResults;
			}
			return (
				<p class={getClassName(this.$props.innerClass, 'noResults') || null}>
					{isFunction(renderNoResults) ? renderNoResults() : renderNoResults}
				</p>
			);
		},

		handleSortChange(e) {
			const index = e.target.value;
			if (this.sortOptions && this.sortOptions[index]) {
				// This fixes issue #371 (where sorting a multi-result page with infinite loader breaks)
				const options = getQueryOptions(this.$props);
				options.from = 0;
				const sortField = this.sortOptions[index].dataField;
				const { sortBy } = this.sortOptions[index];
				options.sort = [
					{
						[sortField]: {
							order: sortBy,
						},
					},
				];
				this.sortOptionIndex = index;
				// To handle sort options for RS API
				this.updateComponentProps(
					this.componentId,
					{ dataField: sortField, sortBy },
					componentTypes.reactiveList,
				);
				this.setQueryOptions(this.$props.componentId, options, true);
				this.currentPageState = 0;
				this.from = 0;
			}
		},
		triggerClickAnalytics(searchPosition, documentId) {
			let docId = documentId;
			if (!docId) {
				const { data } = this.getData();
				const hitData = data.find((hit) => hit._click_id === searchPosition);
				if (hitData && hitData._id) {
					docId = hitData._id;
				}
			}
			this.recordResultClick(searchPosition, docId);
		},
		renderSortOptions() {
			return (
				<select
					class={`${sortOptions} ${getClassName(this.$props.innerClass, 'sortOptions')}`}
					name="sort-options"
					aria-label="Sort options"
					onChange={this.handleSortChange}
					value={this.sortOptionIndex}
				>
					{this.sortOptions.map((sort, index) => (
						<option key={sort.label} value={index}>
							{sort.label}
						</option>
					))}
				</select>
			);
		},
		withClickIds(results) {
			const { base } = this.getAllData();
			return results.map((result, index) => ({
				...result,
				_click_id: base + index,
			}));
		},
		// Shape of the object to be returned in onData & render
		getAllData() {
			const { size, promotedResults, aggregationData, customData, currentPage, hits } = this;
			const results = parseHits(hits) || [];
			const parsedPromotedResults = parseHits(promotedResults) || [];
			const base = currentPage * size;
			return {
				results,
				customData: customData || {},
				promotedResults: parsedPromotedResults,
				aggregationData,
				loadMore: this.loadMore,
				base,
				triggerClickAnalytics: this.triggerClickAnalytics,
			};
		},
		getData() {
			const { promotedResults, aggregationData, customData } = this.getAllData();
			return {
				data: this.data,
				aggregationData: this.withClickIds(aggregationData || []),
				promotedData: this.withClickIds(promotedResults || []),
				rawData: this.rawData,
				resultStats: this.stats,
				customData,
			};
		},
		getComponent() {
			const { error, isLoading } = this;
			const data = {
				error,
				loading: isLoading || false,
				loadMore: this.loadMore,
				// TODO: Remove in v2
				triggerAnalytics: this.triggerClickAnalytics,
				triggerClickAnalytics: this.triggerClickAnalytics,
				setPage: this.setPage,
				...this.getData(),
			};
			return getComponent(data, this);
		},
	},
};
const mapStateToProps = (state, props) => ({
	defaultPage:
		state.selectedValues[props.componentId]
		&& state.selectedValues[props.componentId].value - 1,
	hits: state.hits[props.componentId] && state.hits[props.componentId].hits,
	rawData: state.rawData[props.componentId],
	aggregationData: state.compositeAggregations[props.componentId],
	promotedResults: state.promotedResults[props.componentId],
	customData: state.customData[props.componentId],
	time: state.hits[props.componentId] && state.hits[props.componentId].time,
	total: state.hits[props.componentId] && state.hits[props.componentId].total,
	hidden: state.hits[props.componentId] && state.hits[props.componentId].hidden,
	analytics: state.config && state.config.analytics,
	enableAppbase: state.config.enableAppbase,
	url: state.config.url,
	error: state.error[props.componentId],
	afterKey:
		state.aggregations[props.componentId]
		&& state.aggregations[props.componentId][props.aggregationField]
		&& state.aggregations[props.componentId][props.aggregationField].after_key,
	componentProps: state.props[props.componentId],
	isLoading: state.isLoading[props.componentId],
});
const mapDispatchtoProps = {
	loadMoreAction: loadMore,
	setPageURL: setValue,
	setQueryOptions,
	updateQuery,
	updateComponentProps,
	setDefaultQuery,
	recordResultClick,
};
// Only used for SSR
ReactiveList.generateQueryOptions = (props) => {
	const options = getQueryOptions(props);
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
			const sortOption = sortOptionsNew.find((option) => option.label === defaultSortOption);
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

export const RLConnected = ComponentWrapper(
	connect(mapStateToProps, mapDispatchtoProps)(ReactiveList),
	{
		componentType: componentTypes.reactiveList,
		internalComponent: true,
	},
);

ReactiveList.install = function (Vue) {
	Vue.component(ReactiveList.name, RLConnected);
	Vue.component(ResultListWrapper.name, ResultListWrapper);
	Vue.component(ResultCardsWrapper.name, ResultCardsWrapper);
};
// Add componentType for SSR
ReactiveList.componentType = componentTypes.reactiveList;

export default ReactiveList;
