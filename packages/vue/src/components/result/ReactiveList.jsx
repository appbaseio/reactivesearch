import { Actions, helper } from '@appbaseio/reactivecore';
import VueTypes from 'vue-types';
import Pagination from './addons/Pagination.jsx';
import PoweredBy from './addons/PoweredBy.jsx';
import { connect } from '../../utils/index';
import Flex from '../../styles/Flex';
import types from '../../utils/vueTypes';
import { resultStats, sortOptions } from '../../styles/results';

const {
	addComponent,
	removeComponent,
	setStreaming,
	watchComponent,
	setQueryOptions,
	updateQuery,
	loadMore,
	setValue,
	setQueryListener,
} = Actions;

const { isEqual, getQueryOptions, pushToAndClause, getClassName, parseHits } = helper;

const ReactiveList = {
	name: 'ReactiveList',
	data() {
		const props = this.$props;
		let $currentPage = 0;

		if (this.defaultPage >= 0) {
			$currentPage = this.defaultPage;
		} else if (props.currentPage) {
			$currentPage = Math.max(props.currentPage - 1, 0);
		}

		this.__state = {
			from: $currentPage * props.size,
			isLoading: true,
			$currentPage,
		};
		return this.__state;
	},
	created() {
		this.isLoading = true;
		this.internalComponent = `${this.$props.componentId}__internal`;
		const onQueryChange = (...args) => {
			this.$emit('queryChange', ...args);
		};
		const onError = (...args) => {
			this.$emit('error', ...args);
		};
		this.setQueryListener(this.$props.componentId, onQueryChange, onError);
	},
	props: {
		currentPage: VueTypes.number.def(0),
		includeFields: types.includeFields.def(['*']),
		// component props
		className: types.string,
		componentId: types.stringRequired,
		dataField: types.stringRequired,
		defaultQuery: types.func,
		excludeFields: types.excludeFields.def([]),
		innerClass: types.style,
		listClass: VueTypes.string.def(''),
		loader: types.title,
		onAllData: types.func,
		onData: types.func,
		onResultStats: types.func,
		onNoResults: VueTypes.string.def('No Results found.'),
		pages: VueTypes.number.def(5),
		pagination: VueTypes.bool.def(false),
		paginationAt: types.paginationAt.def('bottom'),
		react: types.react,
		showResultStats: VueTypes.bool.def(true),
		size: VueTypes.number.def(10),
		sortBy: types.sortBy,
		sortOptions: types.sortOptions,
		stream: types.bool,
		URLParams: VueTypes.bool.def(false),
	},
	computed: {
		totalPages() {
			return Math.ceil(this.total / this.$props.size) || 0;
		},
		hasPageChangeListener() {
			return this.$listeners && this.$listeners.pageChange;
		},
		hasResultStatsListener() {
			return this.$listeners && this.$listeners.resultStats;
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
			if (newVal && !isEqual(newVal(), oldVal)) {
				const options = getQueryOptions(this.$props);
				options.from = 0;
				this.$defaultQuery = newVal();
				const { sort, ...query } = this.$defaultQuery;

				if (sort) {
					options.sort = this.$defaultQuery.sort;
					this.setQueryOptions(this.$props.componentId, options, !query);
				}

				this.updateQuery(
					{
						componentId: this.internalComponent,
						query,
					},
					true,
				); // reset page because of query change

				this.$currentPage = 0;
				this.from = 0;
			}
		},
		stream(newVal, oldVal) {
			if (oldVal !== newVal) {
				this.setStreaming(this.$props.componentId, newVal);
			}
		},
		react(newVal, oldVal) {
			if (!isEqual(newVal, oldVal)) {
				this.setReact(this.$props);
			}
		},
		hits(newVal, oldVal) {
			if (this.$props.pagination) {
				// called when page is changed
				if (this.isLoading && (oldVal || newVal)) {
					if (this.hasPageChangeListener) {
						this.$emit('pageChange', this.$currentPage + 1, this.totalPages);
					} else {
						window.scrollTo(0, 0);
					}
					this.isLoading = false;
				}
			} else if (oldVal && newVal) {
				if (oldVal.length !== newVal.length || newVal.length === this.$props.total) {
					this.isLoading = false;

					if (newVal.length < oldVal.length) {
						// query has changed
						window.scrollTo(0, 0);
						this.from = 0;
					}
				}
			} else if ((!oldVal || !oldVal.length) && newVal) {
				this.isLoading = false;
			}
		},
		total(newVal, oldVal) {
			if (this.$props.pagination && newVal !== oldVal) {
				const currentPage = this.$data.total ? 0 : this.$currentPage;
				this.$currentPage = currentPage;
				this.$emit('pageChange', currentPage + 1, this.totalPages);
			}
		},
		currentPage(newVal, oldVal) {
			if (oldVal !== newVal && newVal > 0 && newVal <= this.totalPages) {
				this.setPage(newVal - 1);
			}
		},
		pagination(newVal, oldVal) {
			if (newVal !== oldVal) {
				if (newVal) {
					window.addEventListener('scroll', this.scrollHandler);
				} else {
					window.removeEventListener('scroll', this.scrollHandler);
				}
			} // handle window url history change (on native back and forth interactions)
		},
		defaultPage(newVal) {
			if (this.$currentPage !== newVal && this.defaultPage !== newVal) {
				this.setPage(newVal >= 0 ? newVal : 0);
			}
		},
	},
	mounted() {
		this.addComponent(this.internalComponent);
		this.addComponent(this.$props.componentId);

		if (this.$props.stream) {
			this.setStreaming(this.$props.componentId, true);
		}

		const options = getQueryOptions(this.$props);
		options.from = this.$data.from;

		if (this.$props.sortOptions) {
			options.sort = [
				{
					[this.$props.sortOptions[0].dataField]: {
						order: this.$props.sortOptions[0].sortBy,
					},
				},
			];
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

			if (this.$defaultQuery.sort) {
				options.sort = this.$defaultQuery.sort;
			}
		}
		// execute is set to false at the time of mount
		const { sort, ...query } = this.$defaultQuery || {};
		// to avoid firing (multiple) partial queries.
		// Hence we are building the query in parts here
		// and only executing it with setReact() at core

		const execute = false;
		this.setQueryOptions(this.$props.componentId, options, execute);

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

		this.setReact(this.$props);

		if (!this.$props.pagination) {
			window.addEventListener('scroll', this.scrollHandler);
		}
	},

	beforeDestroy() {
		this.removeComponent(this.$props.componentId);
		this.removeComponent(this.internalComponent);
		window.removeEventListener('scroll', this.scrollHandler);
	},

	render() {
		const { size } = this.$props;
		const { hits } = this.$data;
		const results = parseHits(hits) || [];
		const streamResults = parseHits(this.$data.streamHits) || [];
		let filteredResults = results;

		const onData = this.$scopedSlots.onData || this.$props.onData;

		if (streamResults.length) {
			const ids = streamResults.map(item => item._id);
			filteredResults = filteredResults.filter(item => !ids.includes(item._id));
		}

		return (
			<div style={this.$props.style} class={this.$props.className}>
				{this.isLoading
					&& this.$props.pagination
					&& (this.$scopedSlots.loader || this.$props.loader)}
				<Flex
					labelPosition={this.$props.sortOptions ? 'right' : 'left'}
					class={getClassName(this.$props.innerClass, 'resultsInfo')}
				>
					{this.$props.sortOptions ? this.renderSortOptions() : null}
					{this.$props.showResultStats ? this.renderResultStats() : null}
				</Flex>
				{!this.isLoading && results.length === 0 && streamResults.length === 0
					? this.renderNoResults()
					: null}
				{this.$props.pagination
				&& (this.$props.paginationAt === 'top' || this.$props.paginationAt === 'both') ? (
						<Pagination
							pages={this.$props.pages}
							totalPages={this.totalPages}
							currentPage={this.$currentPage}
							setPage={this.setPage}
							innerClass={this.$props.innerClass}
						/>
					) : null}
				{this.$scopedSlots.onAllData ? (
					this.$scopedSlots.onAllData({
						results,
						streamResults,
						loadMore: this.loadMore,
						analytics: {
							base: this.$currentPage * size,
							triggerClickAnalytics: this.triggerClickAnalytics,
						},
					})
				) : (
					<div
						class={`${this.$props.listClass} ${getClassName(
							this.$props.innerClass,
							'list',
						)}`}
					>
						{[...streamResults, ...filteredResults].map((item, index) =>
							onData({
								item,
								triggerClickAnalytics: () =>
									this.triggerClickAnalytics(this.$currentPage * size + index),
							}),
						)}
					</div>
				)}
				{this.isLoading && !this.$props.pagination
					? this.$props.loader || (
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
				{this.$props.pagination
				&& (this.$props.paginationAt === 'bottom' || this.$props.paginationAt === 'both') ? (
						<Pagination
							pages={this.$props.pages}
							totalPages={Math.ceil(this.$data.total / this.$props.size)}
							currentPage={this.$currentPage}
							setPage={this.setPage}
							innerClass={this.$props.innerClass}
						/>
					) : null}
				{this.config.url.endsWith('appbase.io') && results.length ? (
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
		updateQueryOptions(props) {
			const options = getQueryOptions(props);
			options.from = this.$data.from;

			if (props.sortOptions) {
				options.sort = [
					{
						[props.sortOptions[0].dataField]: {
							order: props.sortOptions[0].sortBy,
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
			this.setQueryOptions(this.$props.componentId, options, true);
		},
		setReact(props) {
			const { react } = props;

			if (react) {
				const newReact = pushToAndClause(react, this.internalComponent);
				this.watchComponent(props.componentId, newReact);
			} else {
				this.watchComponent(props.componentId, {
					and: this.internalComponent,
				});
			}
		},

		scrollHandler() {
			if (
				!this.isLoading
				&& window.innerHeight + window.pageYOffset + 300 >= document.body.offsetHeight
			) {
				this.loadMore();
			}
		},

		loadMore() {
			if (this.hits && !this.$props.pagination && this.total !== this.hits.length) {
				const value = this.$data.from + this.$props.size;
				const options = getQueryOptions(this.$props);
				this.from = value;
				this.isLoading = true;
				this.loadMoreAction(
					this.$props.componentId,
					{
						...options,
						from: value,
					},
					true,
				);
			} else if (this.isLoading) {
				this.isLoading = false;
			}
		},
		setPage(page) {
			// pageClick will be called everytime a pagination button is clicked
			if (page !== this.$currentPage) {
				this.$emit('pageClick', page + 1);
				const value = this.$props.size * page;
				const options = getQueryOptions(this.$props);
				options.from = this.$data.from;
				this.from = value;
				this.isLoading = true;
				this.$currentPage = page;
				this.loadMoreAction(
					this.$props.componentId,
					{
						...options,
						from: value,
					},
					false,
				);

				if (this.$props.URLParams) {
					this.setPageURL(
						this.$props.componentId,
						page + 1,
						this.$props.componentId,
						false,
						true,
					);
				}
			}
		},

		renderResultStats() {
			const onResultStats = this.$props.onResultStats || this.$scopedSlots.onResultStats;
			if (onResultStats) {
				return onResultStats({
					total: this.$data.total,
					time: this.$data.time,
				});
			}
			if (this.$data.total) {
				return (
					<p
						class={`${resultStats} ${getClassName(
							this.$props.innerClass,
							'resultStats',
						)}`}
					>
						{this.$data.total} results found in {this.$data.time}
						ms
					</p>
				);
			}

			return null;
		},

		renderNoResults() {
			return (
				<p class={getClassName(this.$props.innerClass, 'noResults') || null}>
					{this.$props.onNoResults}
				</p>
			);
		},

		handleSortChange(e) {
			const index = e.target.value;
			// This fixes issue #371 (where sorting a multi-result page with infinite loader breaks)
			const options = getQueryOptions(this.$props);
			options.from = 0;
			options.sort = [
				{
					[this.$props.sortOptions[index].dataField]: {
						order: this.$props.sortOptions[index].sortBy,
					},
				},
			];
			this.setQueryOptions(this.$props.componentId, options, true);
			this.$currentPage = 0;
			this.from = 0;
		},
		triggerClickAnalytics(searchPosition) {
			// click analytics would only work client side and after javascript loads
			const {
				config,
				analytics: { searchId },
			} = this;
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
		},

		renderSortOptions() {
			return (
				<select
					class={`${sortOptions} ${getClassName(this.$props.innerClass, 'sortOptions')}`}
					name="sort-options"
					onChange={this.handleSortChange}
				>
					{this.$props.sortOptions.map((sort, index) => (
						<option key={sort.label} value={index}>
							{sort.label}
						</option>
					))}
				</select>
			);
		},
	},
};
const mapStateToProps = (state, props) => ({
	defaultPage:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value - 1)
		|| -1,
	hits: state.hits[props.componentId] && state.hits[props.componentId].hits,
	streamHits: state.streamHits[props.componentId],
	time: (state.hits[props.componentId] && state.hits[props.componentId].time) || 0,
	total: state.hits[props.componentId] && state.hits[props.componentId].total,
	analytics: state.analytics,
	config: state.config,
});
const mapDispatchtoProps = {
	addComponent,
	loadMoreAction: loadMore,
	removeComponent,
	setPageURL: setValue,
	setQueryOptions,
	setQueryListener,
	setStreaming,
	updateQuery,
	watchComponent,
};
export const RLConnected = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(ReactiveList);

ReactiveList.install = function(Vue) {
	Vue.component(ReactiveList.name, RLConnected);
};
export default ReactiveList;
