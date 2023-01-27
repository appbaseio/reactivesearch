import { helper, Actions } from '@appbaseio/reactivecore';
import VueTypes from 'vue-types';
import { isInternalComponent } from '@appbaseio/reactivecore/lib/utils/transform';
import { connect } from '../../utils/index';

const { setSearchState } = Actions;

const { getSearchState } = helper;

const defaultKeys = ['hits', 'value', 'aggregations', 'error'];

const filterProps = (props = {}) => ({
	...props,
	props: props.componentProps,
});
const convertArrayLike = (arrayLike) => {
	const arr = [];
	let i = 0;
	while (arrayLike[i]) {
		arr[i] = arrayLike[i];
		i += 1;
	}
	return arr;
};

const filterByComponentIds = (state, props = {}) => {
	const { componentIds, excludeComponentIds } = props;
	if (componentIds) {
		if (typeof componentIds === 'string') {
			return {
				[componentIds]: state[componentIds],
			};
		}
		if (Array.isArray(componentIds) && componentIds.length) {
			const filteredState = {};
			componentIds.forEach((componentId) => {
				filteredState[componentId] = state[componentId];
			});
			return filteredState;
		}
	}
	let filteredState = {};
	if (!props.includeInternalComponents) {
		Object.keys(state).forEach((componentId) => {
			if (
				componentId.endsWith('internal')
				|| componentId.endsWith('active')
				|| componentId.endsWith('timestamp')
			) {
				return;
			}
			filteredState[componentId] = state[componentId];
		});
	} else {
		filteredState = state;
	}
	// Apply exclude component ids
	if (excludeComponentIds) {
		if (typeof excludeComponentIds === 'string') {
			Object.keys(state).forEach((componentId) => {
				if (componentId === excludeComponentIds) {
					// Delete state
					delete filteredState[componentId];
				}
			});
		}
		if (Array.isArray(excludeComponentIds) && excludeComponentIds.length) {
			Object.keys(state).forEach((componentId) => {
				if (excludeComponentIds.includes(componentId)) {
					// Delete state
					delete filteredState[componentId];
				}
			});
		}
	}
	return filteredState;
};

const filterByKeys = (state, allowedKeys) =>
	Object.keys(state).reduce(
		(components, componentId) => ({
			...components,
			[componentId]: Object.keys(state[componentId])
				.filter((key) => allowedKeys.includes(key))
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
		includeInternalComponents: VueTypes.bool.def(false),
		excludeComponentIds: VueTypes.oneOfType([
			VueTypes.string,
			VueTypes.arrayOf(VueTypes.string),
		]),
	},
	data() {
		this.__state = {
			searchState: null,
		};
		return this.__state;
	},
	created() {
		this.searchState = filterByKeys(
			getSearchState(filterProps(this.searchStateProps)),
			this.includeKeys,
		);
	},
	computed: {
		searchStateProps() {
			return {
				selectedValues: this.selectedValues || {},
				queryLog: this.queryLog || {},
				dependencyTree: this.dependencyTree || {},
				componentProps: this.componentProps || {},
				hits: this.hits || {},
				aggregations: this.aggregations || {},
				isLoading: this.isLoading || {},
				error: this.error || {},
				promotedResults: this.promotedResults || {},
				rawData: this.rawData || {},
			};
		},
	},
	watch: {
		searchState(newVal, oldVal) {
			if (oldVal != null && this.isStateChanged(newVal, oldVal)) {
				this.$emit('change', oldVal, newVal);
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
		excludeComponentIds(newVal, oldVal) {
			this.calculateSearchState(newVal, oldVal);
		},
		includeKeys(newVal, oldVal) {
			this.calculateSearchState(newVal, oldVal);
		},
		promotedResults(newVal, oldVal) {
			this.calculateSearchState(newVal, oldVal);
		},
		rawData(newVal, oldVal) {
			this.calculateSearchState(newVal, oldVal);
		},
		customData(newVal, oldVal) {
			this.calculateSearchState(newVal, oldVal);
		},
		settings(newVal, oldVal) {
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
		setSearchState(valuesMap = {}) {
			const { components } = this;

			const computedValuesMap = {};
			convertArrayLike(components)
				.filter((component) => !isInternalComponent(component))
				.forEach((component) => {
					if (component in valuesMap) {
						computedValuesMap[component] = {
							value: valuesMap[component],
							componentProps: this.componentProps[component],
						};
					} else {
						computedValuesMap[component] = {
							value: null,
							componentProps: this.componentProps[component],
						};
					}
				});

			this.setSearchStateFn(computedValuesMap);
		},
	},
	render() {
		const { searchState } = this;
		const dom = this.$slots.default;
		return dom ? dom({ searchState, setSearchState: this.setSearchState }) : null;
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
	promotedResults: filterByComponentIds(state.promotedResults, props),
	customData: filterByComponentIds(state.customData, props),
	settings: filterByComponentIds(state.settings, props),
	rawData: filterByComponentIds(state.rawData, props),
	components: state.components,
});

const mapDispatchtoProps = {
	setSearchStateFn: setSearchState,
};

const StateProviderConnected = connect(mapStateToProps, mapDispatchtoProps)(StateProvider);
StateProviderConnected.name = StateProvider.name;
StateProviderConnected.install = function (Vue) {
	Vue.component(StateProviderConnected.name, StateProviderConnected);
};
export default StateProviderConnected;
