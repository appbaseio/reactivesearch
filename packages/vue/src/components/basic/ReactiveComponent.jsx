import { Actions, helper } from '@appbaseio/reactivecore';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import VueTypes from 'vue-types';
import { h } from 'vue';
import {
	connect,
	updateCustomQuery,
	updateDefaultQuery,
	isQueryIdentical,
} from '../../utils/index';
import ComponentWrapper from './ComponentWrapper.jsx';
import PreferencesConsumer from './PreferencesConsumer.jsx';
import types from '../../utils/vueTypes';
import { RLConnected as ReactiveList } from '../result/ReactiveList.jsx';
import { SBConnected as SearchBox } from '../search/SearchBox.jsx';
import { ListConnected as SingleList } from '../list/SingleList.jsx';
import { ListConnected as MultiList } from '../list/MultiList.jsx';
import { ListConnected as SingleDropdownList } from '../list/SingleDropdownList.jsx';
import { ListConnected as MultiDropdownList } from '../list/MultiDropdownList.jsx';
import { TBConnected as ToggleButton } from '../list/ToggleButton.jsx';
import { RangeConnected as DynamicRangeSlider } from '../range/DynamicRangeSlider.jsx';
import { RangeConnected as SingleRange } from '../range/SingleRange.jsx';
import { RangeConnected as MultiRange } from '../range/MultiRange.jsx';
import { RangeConnected as RangeSlider } from '../range/RangeSlider.jsx';
import { RangeConnected as RangeInput } from '../range/RangeInput.jsx';

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
	created() {
		const props = this.$props;
		this.internalComponent = null;
		this.$defaultQuery = null;
		// Set custom query in store
		updateCustomQuery(this.componentId, this.setCustomQuery, this.$props, this.selectedValue);

		const { customQuery, componentId, filterLabel, showFilter, URLParams } = props;

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
			const dom = this.$slots.default;
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
	render() {
		let component = ConnectedComponent;
		switch (this.$attrs.componentType) {
			case componentTypes.reactiveList:
				component = ReactiveList;
				break;
			case componentTypes.searchBox:
				component = SearchBox;
				break;
			// list components
			case componentTypes.singleList:
				component = SingleList;
				break;
			case componentTypes.multiList:
				component = MultiList;
				break;
			case componentTypes.singleDropdownList:
				component = SingleDropdownList;
				break;
			case componentTypes.multiDropdownList:
				component = MultiDropdownList;
				break;
			// basic components
			case componentTypes.toggleButton:
				component = ToggleButton;
				break;
			// range components
			case componentTypes.dynamicRangeSlider:
				component = DynamicRangeSlider;
				break;
			case componentTypes.singleRange:
				component = SingleRange;
				break;
			case componentTypes.multiRange:
				component = MultiRange;
				break;
			case componentTypes.rangeSlider:
				component = RangeSlider;
				break;
			case componentTypes.rangeInput:
				component = RangeInput;
				break;
			default:
		}
		return h(component, null, this.$slots);
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
