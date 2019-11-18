import { Actions, helper } from '@appbaseio/reactivecore';
import VueTypes from 'vue-types';
import { connect } from '../../utils/index';
import types from '../../utils/vueTypes';

const {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryOptions,
	setQueryListener,
} = Actions;
const { pushToAndClause, parseHits, isEqual, getCompositeAggsQuery } = helper;
const ReactiveComponent = {
	name: 'ReactiveComponent',
	props: {
		componentId: types.stringRequired,
		aggregationField: types.string,
		size: VueTypes.number.def(20),
		defaultQuery: types.func,
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

		this.setQuery = obj => {
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

	beforeMount() {
		this.addComponent(this.$props.componentId);

		if (this.internalComponent) {
			this.addComponent(this.internalComponent);
		}

		this.setReact(this.$props); // set query for internal component

		if (this.internalComponent && this.$props.defaultQuery) {
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
		hits(newVal, oldVal) {
			if (!isEqual(newVal, oldVal)) {
				this.$emit('allData', parseHits(newVal), oldVal);
			}
		},
		aggregations(newVal, oldVal) {
			if (!isEqual(newVal, oldVal)) {
				this.$emit('allData', parseHits(newVal), oldVal);
			}
		},
		aggregationData(newVal, oldVal) {
			if (!isEqual(newVal, oldVal)) {
				this.$emit('allData', newVal, oldVal);
			}
		},
		defaultQuery(newVal, oldVal) {
			if (newVal && !isEqual(newVal(), oldVal)) {
				this.$defaultQuery = newVal();
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
		react() {
			this.setReact(this.$props);
		},
	},

	render() {
		try {
			const dom = this.$scopedSlots.default;
			const propsToBePassed = {
				aggregations: this.aggregations,
				aggregationData: this.aggregationData,
				hits: this.hits,
				selectedValue: this.selectedValue,
				setQuery: this.setQuery,
				error: this.error,
				isLoading: this.isLoading,
				...this.$props,
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
	},
};

const mapStateToProps = (state, props) => ({
	aggregations:
		(state.aggregations[props.componentId] && state.aggregations[props.componentId]) || null,
	aggregationData: state.compositeAggregations[props.componentId] || [],
	hits: (state.hits[props.componentId] && state.hits[props.componentId].hits) || [],
	error: state.error[props.componentId],
	isLoading: state.isLoading[props.componentId],
	selectedValue:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value)
		|| null,
});

const mapDispatchtoProps = {
	addComponent,
	removeComponent,
	setQueryOptions,
	setQueryListener,
	updateQuery,
	watchComponent,
};
const RcConnected = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(ReactiveComponent);

ReactiveComponent.install = function(Vue) {
	Vue.component(ReactiveComponent.name, RcConnected);
};
export default ReactiveComponent;
