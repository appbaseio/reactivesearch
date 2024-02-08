import { Actions, helper } from '@appbaseio/reactivecore';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import VueTypes from 'vue-types';
import {
	connect,
	updateCustomQuery,
	updateDefaultQuery,
	isQueryIdentical,
} from '../../utils/index';
import ComponentWrapper from './ComponentWrapper.jsx';
import PreferencesConsumer from './PreferencesConsumer.jsx';
import types from '../../utils/vueTypes';

const { updateQuery, setQueryOptions, setCustomQuery, setDefaultQuery } = Actions;
const {
	parseHits,
	isEqual,
	getCompositeAggsQuery,
	getResultStats,
	extractQueryFromCustomQuery,
	getOptionsForCustomQuery,
} = helper;
const ReactiveComponent = {
	name: 'ReactiveComponent',
	props: {
		componentId: types.stringRequired,
		compoundClause: types.compoundClause,
		aggregationField: types.string,
		aggregationSize: VueTypes.number,
		size: VueTypes.number,
		defaultQuery: types.func,
		customQuery: types.func,
		filterLabel: types.string,
		react: types.react,
		showFilter: VueTypes.bool.def(true),
		URLParams: VueTypes.bool.def(false),
		distinctField: types.string,
		distinctFieldConfig: types.props,
		index: VueTypes.string,
		endpoint: types.endpointConfig,
	},
	data() {
		return {
			currentValue: this.selectedValue,
		};
	},
	created() {
		const props = this.$props;
		this.internalComponent = null;
		this.$defaultQuery = null;
		this.currentValue = this.selectedValue;
		// Set custom query in store
		updateCustomQuery(this.componentId, this.setCustomQuery, this.$props, this.selectedValue);

		const {
			customQuery,
			componentId,
			filterLabel,
			showFilter,
			URLParams,
			distinctField,
			distinctFieldConfig,
			index,
		} = props;

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

		if (customQuery) {
			const calcCustomQuery = customQuery(this.selectedValue, props);

			const query = extractQueryFromCustomQuery(calcCustomQuery);
			const customQueryOptions = calcCustomQuery
				? getOptionsForCustomQuery(calcCustomQuery)
				: null;
			if (customQueryOptions) {
				this.setQueryOptions(
					componentId,
					{ ...customQueryOptions, ...this.getAggsQuery() },
					false,
				);
			} else this.setQueryOptions(componentId, this.getAggsQuery(), false);

			this.updateQuery({
				componentId,
				query,
				value: this.selectedValue || null,
				label: filterLabel,
				showFilter,
				URLParams,
			});
		}

		this.setQuery = ({ options, ...obj }) => {
			let queryToBeSet = obj.query;

			// when enableAppbase is true, Backend throws error because of repeated query in request body
			if (queryToBeSet && queryToBeSet.query) {
				queryToBeSet = queryToBeSet.query;
			}

			const customQueryCalc = {
				...options,
				query: queryToBeSet,
			};
			let rsAPIQuery = customQueryCalc;
			// handle stored queries
			if (queryToBeSet && queryToBeSet.id) {
				rsAPIQuery = queryToBeSet;
			}
			// Update customQuery field for RS API
			this.setCustomQuery(props.componentId, rsAPIQuery);
			if (options) {
				this.setQueryOptions(
					props.componentId,
					{ ...this.getAggsQuery(), ...options },
					false,
				);
			}
			this.updateQuery({
				...obj,
				query: customQueryCalc.query,
				componentId: props.componentId,
				label: props.filterLabel,
				showFilter: props.showFilter,
				URLParams: props.URLParams,
			});
		};

		if (props.defaultQuery) {
			this.internalComponent = `${props.componentId}__internal`;
		}

		if (this.internalComponent && this.$props.defaultQuery) {
			updateDefaultQuery(
				this.componentId,
				this.setDefaultQuery,
				this.$props,
				this.selectedValue,
			);
			this.$defaultQuery = this.$props.defaultQuery(this.selectedValue, this.$props);
			const query = extractQueryFromCustomQuery(this.$defaultQuery);
			const queryOptions = getOptionsForCustomQuery(this.$defaultQuery);
			if (queryOptions) {
				this.setQueryOptions(
					this.internalComponent,
					{ ...queryOptions, ...this.getAggsQuery() },
					false,
				);
			} else this.setQueryOptions(this.internalComponent, this.getAggsQuery(), false);

			this.updateQuery({
				componentId: this.internalComponent,
				query,
			});
		}
	},
	watch: {
		selectedValue(newVal, oldVal) {
			if (!isEqual(newVal, oldVal) || !isEqual(newVal, this.currentValue)) {
				this.$emit('data', this.getData());
				this.currentValue = newVal;
			}
		},
		hits(newVal, oldVal) {
			if (!isEqual(newVal, oldVal)) {
				this.$emit('data', this.getData());
			}
		},
		rawData(newVal, oldVal) {
			if (!isEqual(newVal, oldVal)) {
				this.$emit('data', this.getData());
			}
		},
		aggregations(newVal, oldVal) {
			if (!isEqual(newVal, oldVal)) {
				this.$emit('data', this.getData());
			}
		},
		aggregationData(newVal, oldVal) {
			if (!isEqual(newVal, oldVal)) {
				this.$emit('data', this.getData());
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
		total(newVal, oldVal) {
			if (!isEqual(newVal, oldVal)) {
				this.$emit('data', this.getData());
			}
		},
		time(newVal, oldVal) {
			if (!isEqual(newVal, oldVal)) {
				this.$emit('data', this.getData());
			}
		},
		defaultQuery(newVal, oldVal) {
			if (newVal && !isQueryIdentical(newVal, oldVal, this.selectedValue, this.$props)) {
				this.$defaultQuery = newVal(this.selectedValue, this.$props);
				const query = extractQueryFromCustomQuery(this.$defaultQuery);
				const queryOptions = getOptionsForCustomQuery(this.$defaultQuery);
				if (queryOptions) {
					this.setQueryOptions(
						this.internalComponent,
						{ ...queryOptions, ...this.getAggsQuery() },
						false,
					);
				} else this.setQueryOptions(this.internalComponent, this.getAggsQuery(), false);
				// Update default query for RS API
				updateDefaultQuery(
					this.componentId,
					this.setDefaultQuery,
					this.$props,
					this.selectedValue,
				);

				this.updateQuery({
					componentId: this.internalComponent,
					query,
				});
			}
		},
		customQuery(newVal, oldVal) {
			if (newVal && !isQueryIdentical(newVal, oldVal, this.selectedValue, this.$props)) {
				const { componentId } = this.$props;
				this.$customQuery = newVal(this.selectedValue, this.$props);
				const query = extractQueryFromCustomQuery(this.$customQuery);
				const queryOptions = getOptionsForCustomQuery(this.$customQuery);
				if (queryOptions) {
					this.setQueryOptions(
						componentId,
						{ ...queryOptions, ...this.getAggsQuery() },
						false,
					);
				} else this.setQueryOptions(componentId, this.getAggsQuery(), false);

				// Update custom query for RS API
				updateCustomQuery(
					this.componentId,
					this.setCustomQuery,
					this.$props,
					this.selectedValue,
				);

				this.updateQuery({
					componentId,
					query,
				});
			}
		},
	},

	render() {
		try {
			const dom = this.$scopedSlots.default;
			const { error, isLoading } = this;
			const propsToBePassed = {
				error,
				loading: isLoading,
				...this.getData(),
				setQuery: this.setQuery,
				value: this.currentValue,
			};
			return <div>{dom(propsToBePassed)}</div>;
		} catch (e) {
			return null;
		}
	},

	methods: {
		getAggsQuery() {
			if (this.aggregationField) {
				return {
					aggs: getCompositeAggsQuery({
						props: this.$props,
						showTopHits: true,
						value: this.selectedValue,
					}).aggs,
				};
			}
			return {};
		},
		getData() {
			const { hits, aggregations, aggregationData, promotedResults, rawData } = this;
			let filteredResults = parseHits(hits);
			if (promotedResults.length) {
				const ids = promotedResults.map((item) => item._id).filter(Boolean);
				if (ids) {
					filteredResults = filteredResults.filter((item) => !ids.includes(item._id));
				}
				filteredResults = [...promotedResults, ...filteredResults];
			}
			return {
				data: filteredResults,
				aggregationData,
				rawData,
				aggregations,
				promotedData: promotedResults,
				resultStats: this.stats,
			};
		},
	},
	computed: {
		stats() {
			return getResultStats(this);
		},
	},
};

ReactiveComponent.hasInternalComponent = (props) => !!props.defaultQuery;

const mapStateToProps = (state, props) => ({
	aggregations:
		(state.aggregations[props.componentId] && state.aggregations[props.componentId]) || null,
	aggregationData: state.compositeAggregations[props.componentId] || [],
	hits: (state.hits[props.componentId] && state.hits[props.componentId].hits) || [],
	rawData: state.rawData[props.componentId],
	error: state.error[props.componentId],
	isLoading: state.isLoading[props.componentId],
	selectedValue:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value)
		|| null,
	promotedResults: state.promotedResults[props.componentId] || [],
	time: (state.hits[props.componentId] && state.hits[props.componentId].time) || 0,
	total: state.hits[props.componentId] && state.hits[props.componentId].total,
	hidden: state.hits[props.componentId] && state.hits[props.componentId].hidden,
	componentProps: state.props[props.componentId],
	enableAppbase: state.config.enableAppbase,
});

const mapDispatchtoProps = {
	setQueryOptions,
	updateQuery,
	setCustomQuery,
	setDefaultQuery,
};
const ConnectedComponent = ComponentWrapper(
	connect(mapStateToProps, mapDispatchtoProps)(ReactiveComponent),
	{
		componentType: componentTypes.reactiveComponent,
	},
);

const RcConnected = PreferencesConsumer({
	name: 'RcConnected',
	render(h) {
		return h(ConnectedComponent, {
			attrs: this.$attrs,
			on: this.$listeners,
			scopedSlots: this.$scopedSlots,
			slots: this.$slots,
		});
	},
});
RcConnected.name = ReactiveComponent.name;
RcConnected.hasInternalComponent = ReactiveComponent.hasInternalComponent;
// Add componentType for SSR
RcConnected.componentType = componentTypes.reactiveComponent;
RcConnected.install = function (Vue) {
	Vue.component(RcConnected.name, RcConnected);
};
export default RcConnected;
