import { Actions, helper } from '@appbaseio/reactivecore';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import VueTypes from 'vue-types';
import {
	connect,
	updateCustomQuery,
	updateDefaultQuery,
	getValidPropsKeys,
	isQueryIdentical,
} from '../../utils/index';
import types from '../../utils/vueTypes';

const {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryOptions,
	setQueryListener,
	setCustomQuery,
	setDefaultQuery,
	setComponentProps,
	updateComponentProps,
} = Actions;
const {
	pushToAndClause,
	parseHits,
	isEqual,
	getCompositeAggsQuery,
	getOptionsFromQuery,
	getResultStats,
	checkSomePropChange,
} = helper;
const ReactiveComponent = {
	name: 'ReactiveComponent',
	props: {
		componentId: types.stringRequired,
		aggregationField: types.string,
		size: VueTypes.number.def(20),
		defaultQuery: types.func,
		customQuery: types.func,
		filterLabel: types.string,
		react: types.react,
		showFilter: VueTypes.bool.def(true),
		URLParams: VueTypes.bool.def(false),
	},
	created() {
		const props = this.$props;
		this.internalComponent = null;
		this.$defaultQuery = null;
		const onQueryChange = (...args) => {
			this.$emit('queryChange', ...args);
		};
		this.setQueryListener(props.componentId, onQueryChange, e => {
			this.$emit('error', e);
		});

		// Update props in store
		this.setComponentProps(this.componentId, this.$props, componentTypes.reactiveComponent);
		// Set custom query in store
		updateCustomQuery(this.componentId, this.setCustomQuery, this.$props, undefined);

		const { customQuery, componentId, filterLabel, showFilter, URLParams } = props;

		if (customQuery) {
			const calcCustomQuery = customQuery(props);
			const { query } = calcCustomQuery || {};
			const customQueryOptions = calcCustomQuery
				? getOptionsFromQuery(calcCustomQuery)
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
			if (options) {
				this.setQueryOptions(
					props.componentId,
					{ ...options, ...this.getAggsQuery() },
					false,
				);
			}
			// Update customQuery field for RS API
			if ((obj && obj.query) || options) {
				const customQueryCalc = { ...options };
				if (obj && obj.query) {
					customQueryCalc.query = obj.query;
				}
				this.setCustomQuery(props.componentId, customQueryCalc);
			}
			this.updateQuery({
				...obj,
				componentId: props.componentId,
				label: props.filterLabel,
				showFilter: props.showFilter,
				URLParams: props.URLParams,
			});
		};

		if (props.defaultQuery) {
			this.internalComponent = `${props.componentId}__internal`;
		}
	},
	mounted() {
		this.setReact(this.$props); // set query for internal component
	},

	beforeMount() {
		this.addComponent(this.$props.componentId);

		if (this.internalComponent) {
			this.addComponent(this.internalComponent);
			this.setComponentProps(
				this.internalComponent,
				this.$props,
				componentTypes.reactiveComponent,
			);
		}

		if (this.internalComponent && this.$props.defaultQuery) {
			updateDefaultQuery(this.componentId, this.setDefaultQuery, this.$props, undefined);
			this.$defaultQuery = this.$props.defaultQuery();
			const { query, ...queryOptions } = this.$defaultQuery || {};

			if (queryOptions) {
				this.setQueryOptions(
					this.internalComponent,
					{ ...queryOptions, ...this.getAggsQuery() },
					false,
				);
			} else this.setQueryOptions(this.internalComponent, this.getAggsQuery(), false);

			this.updateQuery({
				componentId: this.internalComponent,
				query: query || null,
			});
		}
	},

	beforeDestroy() {
		this.removeComponent(this.$props.componentId);

		if (this.internalComponent) {
			this.removeComponent(this.internalComponent);
		}
	},

	watch: {
		$props: {
			deep: true,
			handler(newVal) {
				const propsKeys = getValidPropsKeys(newVal);
				checkSomePropChange(newVal, this.componentProps, propsKeys, () => {
					this.updateComponentProps(
						this.componentId,
						newVal,
						componentTypes.reactiveComponent,
					);
					if (this.internalComponent) {
						this.updateComponentProps(
							this.internalComponent,
							newVal,
							componentTypes.reactiveComponent,
						);
					}
				});
			},
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
			if (newVal && !isQueryIdentical(newVal, oldVal, undefined, this.$props)) {
				this.$defaultQuery = newVal();
				const { query, ...queryOptions } = this.$defaultQuery || {};

				if (queryOptions) {
					this.setQueryOptions(
						this.internalComponent,
						{ ...queryOptions, ...this.getAggsQuery() },
						false,
					);
				} else this.setQueryOptions(this.internalComponent, this.getAggsQuery(), false);
				// Update default query for RS API
				updateDefaultQuery(this.componentId, this.setDefaultQuery, this.$props, undefined);
				this.updateQuery({
					componentId: this.internalComponent,
					query: query || null,
				});
			}
		},
		customQuery(newVal, oldVal) {
			if (newVal && !isQueryIdentical(newVal, oldVal, undefined, this.$props)) {
				const { componentId } = this.$props;
				this.$customQuery = newVal(this.$props);
				const { query, ...queryOptions } = this.$customQuery || {};

				if (queryOptions) {
					this.setQueryOptions(
						componentId,
						{ ...queryOptions, ...this.getAggsQuery() },
						false,
					);
				} else this.setQueryOptions(componentId, this.getAggsQuery(), false);

				// Update custom query for RS API
				updateCustomQuery(this.componentId, this.setCustomQuery, this.$props, undefined);

				this.updateQuery({
					componentId,
					query: query || null,
				});
			}
		},
		react() {
			this.setReact(this.$props);
		},
	},

	render() {
		try {
			const dom = this.$scopedSlots.default;
			const { error, isLoading, selectedValue } = this;
			const propsToBePassed = {
				error,
				loading: isLoading,
				...this.getData(),
				value: selectedValue,
				setQuery: this.setQuery,
			};
			return <div>{dom(propsToBePassed)}</div>;
		} catch (e) {
			return null;
		}
	},

	methods: {
		setReact(props) {
			const { react } = props;

			if (react) {
				if (this.internalComponent) {
					const newReact = pushToAndClause(react, this.internalComponent);
					this.watchComponent(props.componentId, newReact);
				} else {
					this.watchComponent(props.componentId, react);
				}
			} else if (this.internalComponent) {
				this.watchComponent(props.componentId, {
					and: this.internalComponent,
				});
			}
		},
		getAggsQuery() {
			if (this.aggregationField) {
				return { aggs: getCompositeAggsQuery({}, this.$props, null, true).aggs };
			}
			return {};
		},
		getData() {
			const { hits, aggregations, aggregationData, promotedResults, rawData } = this;
			let filteredResults = parseHits(hits);
			if (promotedResults.length) {
				const ids = promotedResults.map(item => item._id).filter(Boolean);
				if (ids) {
					filteredResults = filteredResults.filter(item => !ids.includes(item._id));
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
});

const mapDispatchtoProps = {
	addComponent,
	removeComponent,
	setQueryOptions,
	setQueryListener,
	updateQuery,
	watchComponent,
	setCustomQuery,
	setDefaultQuery,
	setComponentProps,
	updateComponentProps,
};
const RcConnected = connect(mapStateToProps, mapDispatchtoProps)(ReactiveComponent);

ReactiveComponent.install = function(Vue) {
	Vue.component(ReactiveComponent.name, RcConnected);
};
export default ReactiveComponent;
