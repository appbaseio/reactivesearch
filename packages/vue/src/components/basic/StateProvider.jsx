import { helper } from '@appbaseio/reactivecore';
import VueTypes from 'vue-types';
import { connect } from '../../utils/index';

const { getSearchState } = helper;

const defaultKeys = ['hits', 'value', 'aggregations', 'error'];

const filterProps = props => ({
	...props,
	props: props.componentProps,
});

const filterByComponentIds = (state, props = {}) => {
	const { componentIds } = props;
	if (typeof componentIds === 'string') {
		return {
			[componentIds]: state[componentIds],
		};
	}
	if (componentIds instanceof Array) {
		const filteredState = {};
		componentIds.forEach(componentId => {
			filteredState[componentId] = state[componentId];
		});
		return filteredState;
	}
	return state;
};

const filterByKeys = (state, allowedKeys) =>
	Object.keys(state).reduce(
		(components, componentId) => ({
			...components,
			[componentId]: Object.keys(state[componentId])
				.filter(key => allowedKeys.includes(key))
				.reduce((obj, key) => {
					// eslint-disable-next-line
					obj[key] = state[componentId][key];
					return obj;
				}, {}),
		}),
		{},
	);
const StateProvider = {
	name: 'StateProvider',
	props: {
		onChange: VueTypes.func,
		componentIds: VueTypes.oneOfType([VueTypes.string, VueTypes.arrayOf(VueTypes.string)]),
		includeKeys: VueTypes.arrayOf(VueTypes.string).def(defaultKeys),
		strict: VueTypes.bool.def(true),
	},
	data() {
		this.__state = {
			searchState: null,
		};
		return this.__state;
	},
	mounted() {
		this.searchState = filterByKeys(
			getSearchState(filterProps(this.searchStateProps)),
			this.includeKeys,
		);
	},
	computed: {
		searchStateProps() {
			return {
				selectedValues: this.selectedValues || {},
				queryLog: this.queryLog,
				dependencyTree: this.dependencyTree,
				componentProps: this.componentProps,
				hits: this.hits,
				aggregations: this.aggregations,
				isLoading: this.isLoading,
				error: this.error,
			};
		},
	},
	watch: {
		searchState(newVal, oldVal) {
			if (this.isStateChanged(newVal, oldVal)) {
				this.$emit('change', newVal, oldVal);
			}
		},
		selectedValues(newVal, oldVal) {
			this.calculateSearchState(newVal, oldVal);
		},
		queryLog(newVal, oldVal) {
			this.calculateSearchState(newVal, oldVal);
		},
		dependencyTree(newVal, oldVal) {
			this.calculateSearchState(newVal, oldVal);
		},
		componentProps(newVal, oldVal) {
			this.calculateSearchState(newVal, oldVal);
		},
		hits(newVal, oldVal) {
			this.calculateSearchState(newVal, oldVal);
		},
		aggregations(newVal, oldVal) {
			this.calculateSearchState(newVal, oldVal);
		},
		isLoading(newVal, oldVal) {
			this.calculateSearchState(newVal, oldVal);
		},
		error(newVal, oldVal) {
			this.calculateSearchState(newVal, oldVal);
		},
		componentIds(newVal, oldVal) {
			this.calculateSearchState(newVal, oldVal);
		},
		includeKeys(newVal, oldVal) {
			this.calculateSearchState(newVal, oldVal);
		},
	},
	methods: {
		isStateChanged(prevState, nextState) {
			return JSON.stringify(nextState) !== JSON.stringify(prevState);
		},
		calculateSearchState(newVal, oldVal) {
			if (this.isStateChanged(newVal, oldVal)) {
				this.searchState = filterByKeys(
					getSearchState(filterProps(this.searchStateProps)),
					this.includeKeys,
				);
			}
		},
	},
	render() {
		const { searchState } = this;
		const dom = this.$scopedSlots.default;
		return dom ? dom({ searchState }) : null;
	},
};

const mapStateToProps = (state, props) => ({
	selectedValues: filterByComponentIds(state.selectedValues, props),
	queryLog: filterByComponentIds(state.queryLog, props),
	dependencyTree: filterByComponentIds(state.dependencyTree, props),
	componentProps: filterByComponentIds(state.props, props),
	hits: filterByComponentIds(state.hits, props),
	aggregations: filterByComponentIds(state.aggregations, props),
	isLoading: filterByComponentIds(state.isLoading, props),
	error: filterByComponentIds(state.error, props),
});

const StateProviderConnected = connect(mapStateToProps, {})(StateProvider);

StateProvider.install = function(Vue) {
	Vue.component(StateProvider.name, StateProviderConnected);
};
export default StateProvider;
