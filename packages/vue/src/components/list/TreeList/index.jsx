import { Actions, helper } from '@appbaseio/reactivecore';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';

import VueTypes from 'vue-types';
import ComponentWrapper from '../../basic/ComponentWrapper.jsx';
import PreferencesConsumer from '../../basic/PreferencesConsumer.jsx';

import Container from '../../../styles/Container';
import { connect } from '../../../utils/index';
import types from '../../../utils/vueTypes';

const { updateQuery, setQueryOptions } = Actions;
const {} = helper;

const TreeList = {
	name: 'TreeList',
	props: {
		selectedValue: types.selectedValue,
		error: types.title,
		rawData: types.rawData,
		aggregationData: types.rawData,
		themePreset: types.themePreset,
		updateQuery: types.funcRequired,
		setQueryOptions: types.funcRequired,
		// component props
		componentId: types.string.isRequired,
		className: types.string,
		style: types.style,
		showRadio: types.bool,
		showCheckbox: types.bool,
		mode: VueTypes.oneOf(['single', 'multiple']),
		showCount: types.bool,
		showSearch: types.bool,
		showIcon: types.bool,
		icon: types.children,
		showLeafIcon: types.bool,
		leafIcon: types.children,
		showLine: types.bool,
		switcherIcon: types.func,
		render: types.func,
		renderItem: types.func,
		innerClass: types.style,
		placeholder: types.string,
		title: types.title,
		isLoading: types.bool,
		dataField: types.stringArray.isRequired,
		onQueryChange: types.func,
		defaultValue: types.stringArray,
		value: types.stringArray,
		customQuery: types.func,
		defaultQuery: types.func,
		enableAppbase: types.bool,
		index: types.string,
		showFilter: types.bool,
		URLParams: types.bool,
		filterLabel: types.string,
		onChange: types.func,
		onValueChange: types.func,
		beforeValueChange: types.func,
		sortBy: types.sortByWithCount,
		onError: types.func,
		showSwitcherIcon: types.bool,
		renderError: types.title,
		renderNoResults: types.func,
		loader: types.title,
		aggergationSize: types.number,
		endpoint: types.endpoint,
		queryFormat: types.queryFormatSearch,
		size: types.number,
		nestedField: types.string,
		react: types.react,
		transformData: types.func,
		selectAllLabel: types.string,
		showMissing: VueTypes.bool.def(false),
		missingLabel: VueTypes.string.def('N/A'),
	},
	data() {
		const props = this.$props;
		this.__state = {};
		this.internalComponent = `${props.componentId}__internal`;
		return this.__state;
	},
	created() {
		// const props = this.$props;
	},
	beforeMount() {},
	mounted() {},
	watch: {},
	render() {
		return <Container class={this.$props.className}>hey from treelist</Container>;
	},

	methods: {},
	computed: {},
};

const mapStateToProps = (state, props) => ({
	selectedValue:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value)
		|| null,
	rawData: state.rawData[props.componentId] || {},
	aggregationData:
		props.nestedField && state.aggregations[props.componentId]
			? state.aggregations[props.componentId].reactivesearch_nested
			: state.aggregations[props.componentId] || {},
	themePreset: state.config.themePreset,
	error: state.error[props.componentId],
	isLoading: state.isLoading[props.componentId],
	enableAppbase: state.config.enableAppbase,
});

const mapDispatchtoProps = {
	setQueryOptions,
	updateQuery,
};

TreeList.hasInternalComponent = () => true;

export const TreeListConnected = PreferencesConsumer(
	ComponentWrapper(connect(mapStateToProps, mapDispatchtoProps)(TreeList), {
		componentType: componentTypes.treeList,
		internalComponent: TreeList.hasInternalComponent(),
	}),
);
TreeListConnected.name = TreeList.name;
TreeListConnected.install = function (Vue) {
	Vue.component(TreeListConnected.name, TreeListConnected);
};

// Add componentType for SSR
TreeListConnected.componentType = componentTypes.treeList;

export default TreeListConnected;
