import { Actions, helper, causes } from '@appbaseio/reactivecore';
import VueTypes from 'vue-types';
import {
	componentTypes,
	SEARCH_COMPONENTS_MODES,
} from '@appbaseio/reactivecore/lib/utils/constants';
import { defineComponent } from 'vue';
import {
	connect,
	getComponent,
	hasCustomRenderer,
	isFunction,
	updateCustomQuery,
	updateDefaultQuery,
	isQueryIdentical,
	isEmpty,
	parseFocusShortcuts,
	extractModifierKeysFromFocusShortcuts,
	decodeHtml,
} from '../../utils/index';
import Container from '../../styles/Container';
import types from '../../utils/vueTypes';
import ComponentWrapper from '../basic/ComponentWrapper.jsx';
import PreferencesConsumer from '../basic/PreferencesConsumer.jsx';

const { updateQuery, setCustomQuery, setDefaultQuery, recordSuggestionClick } = Actions;
const {
	debounce,
	checkValueChange,
	getClassName,
	isEqual,
	getCompositeAggsQuery,
	withClickIds,
	getResultStats,
} = helper;

const SearchBox = defineComponent({
	name: 'SearchBox',
	isTagsMode: false,
	data() {
		const props = this.$props;
		this.__state = {
			currentValue: '',
			selectedTags: [],
			isOpen: false,
			normalizedSuggestions: [],
		};
		this.internalComponent = `${props.componentId}__internal`;
		return this.__state;
	},
	inject: {
		theme: {
			from: 'theme_reactivesearch',
		},
	},
	created() {
		const { mode } = this.$props;
		if (mode === SEARCH_COMPONENTS_MODES.TAG) {
			this.$options.isTagsMode = true;
		}

		if (this.$options.isTagsMode) {
			console.warn(
				'Warning(ReactiveSearch): The `categoryField` prop is not supported when `mode` prop is set to `tag`',
			);
		}

		this.currentValue = decodeHtml(this.selectedValue || this.value || this.defaultValue || '');
		if (this.$options.isTagsMode) {
			this.currentValue = '';
		}
		this.handleTextChange = debounce(this.handleText, this.$props.debounce);

		// Set custom and default queries in store
		this.triggerCustomQuery(this.currentValue, this.selectedCategory);
		this.triggerDefaultQuery(this.currentValue);
		if (this.selectedValue) {
			this.setValue(
				this.selectedValue,
				true,
				this.$props,
				this.$options.isTagsMode ? causes.SUGGESTION_SELECT : undefined,
			);
		} else if (this.$props.value) {
			this.setValue(
				this.$props.value,
				true,
				this.$props,
				this.$options.isTagsMode ? causes.SUGGESTION_SELECT : undefined,
			);
		} else if (this.$props.defaultValue) {
			this.setValue(
				this.$props.defaultValue,
				true,
				this.$props,
				this.$options.isTagsMode ? causes.SUGGESTION_SELECT : undefined,
			);
		}
	},

	computed: {
		hasCustomRenderer() {
			return hasCustomRenderer(this);
		},
		stats() {
			return getResultStats(this);
		},
	},
	props: {
		autoFocus: VueTypes.bool,
		autosuggest: VueTypes.bool.def(true),
		beforeValueChange: types.func,
		className: VueTypes.string.def(''),
		clearIcon: types.children,
		componentId: types.stringRequired,
		customHighlight: types.func,
		customQuery: types.func,
		defaultQuery: types.func,
		dataField: VueTypes.oneOfType([
			VueTypes.string,
			VueTypes.shape({
				field: VueTypes.string,
				weight: VueTypes.number,
			}),
			VueTypes.arrayOf(VueTypes.string),
			VueTypes.arrayOf({
				field: VueTypes.string,
				weight: VueTypes.number,
			}),
		]),
		aggregationField: types.string,
		aggregationSize: VueTypes.number,
		size: VueTypes.number,
		debounce: VueTypes.number.def(0),
		defaultValue: types.string,
		excludeFields: types.excludeFields,
		value: VueTypes.oneOfType([VueTypes.arrayOf(VueTypes.string), types.value]),
		defaultSuggestions: types.suggestions,
		enableSynonyms: VueTypes.bool.def(true),
		enableQuerySuggestions: VueTypes.bool.def(false),
		enablePopularSuggestions: VueTypes.bool.def(false),
		enableRecentSuggestions: VueTypes.bool.def(false),
		fieldWeights: types.fieldWeights,
		filterLabel: types.string,
		fuzziness: types.fuzziness,
		highlight: VueTypes.bool,
		highlightField: types.stringOrArray,
		icon: types.children,
		iconPosition: VueTypes.oneOf(['left', 'right']).def('left'),
		includeFields: types.includeFields,
		innerClass: types.style,
		innerRef: VueTypes.string.def('searchInputField'),
		render: types.func,
		renderNoSuggestion: types.title,
		renderError: types.title,
		placeholder: VueTypes.string.def('Search'),
		queryFormat: VueTypes.oneOf(['and', 'or']).def('or'),
		react: types.react,
		showClear: VueTypes.bool.def(true),
		showDistinctSuggestions: VueTypes.bool.def(true),
		showFilter: VueTypes.bool.def(true),
		showIcon: VueTypes.bool.def(true),
		title: types.title,
		URLParams: VueTypes.bool.def(false),
		strictSelection: VueTypes.bool.def(false),
		nestedField: types.string,
		enablePredictiveSuggestions: VueTypes.bool.def(false),
		recentSearchesIcon: VueTypes.any,
		popularSearchesIcon: VueTypes.any,
		//	mic props
		showVoiceSearch: VueTypes.bool.def(false),
		getMicInstance: types.func,
		renderMic: types.func,
		distinctField: types.string,
		distinctFieldConfig: types.props,
		//
		focusShortcuts: VueTypes.arrayOf(
			VueTypes.oneOfType([VueTypes.string, VueTypes.number]),
		).def(['/']),
		addonBefore: VueTypes.any,
		addonAfter: VueTypes.any,
		expandSuggestionsContainer: VueTypes.bool.def(true),
		index: VueTypes.string,
		popularSuggestionsConfig: VueTypes.object,
		recentSuggestionsConfig: VueTypes.object,
		applyStopwords: VueTypes.bool,
		customStopwords: types.stringArray,
		onData: types.func,
		renderItem: types.func,
		enterButton: VueTypes.bool.def(false),
		renderEnterButton: VueTypes.any,
		mode: VueTypes.oneOf(['select', 'tag']).def('select'),
		renderSelectedTags: VueTypes.any,
		searchboxId: VueTypes.string,
		endpoint: types.endpointConfig,
	},
	mounted() {
		this.listenForFocusShortcuts();
	},
	watch: {},
	methods: {},
	render() {
		const { expandSuggestionsContainer } = this.$props;
		const { recentSearchesIcon, popularSearchesIcon } = this.$slots;
		const hasSuggestions
			= Array.isArray(this.normalizedSuggestions) && this.normalizedSuggestions.length;
		const renderItem = this.$slots.renderItem || this.$props.renderItem;

		return <Container class={this.$props.className}></Container>;
	},
	destroyed() {
		document.removeEventListener('keydown', this.onKeyDown);
	},
});

SearchBox.hasInternalComponent = () => true;

SearchBox.defaultQuery = (value, props) => {
	let finalQuery = null;

	finalQuery = {
		bool: {
			should: SearchBox.shouldQuery(value, props),
			minimum_should_match: '1',
		},
	};

	if (finalQuery && props.nestedField) {
		return {
			query: {
				nested: {
					path: props.nestedField,
					query: finalQuery,
				},
			},
		};
	}

	return finalQuery;
};
SearchBox.shouldQuery = (value, props) => ({
	query: {
		queryFormat: props.queryFormat,
		dataField: props.dataField,
		value,
		nestedField: props.nestedField,
		queryString: props.queryString,
		searchOperators: props.searchOperators,
	},
});

const mapStateToProps = (state, props) => ({
	selectedValue:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value)
		|| null,
	selectedCategory:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].category)
		|| null,
	suggestions: state.hits[props.componentId] && state.hits[props.componentId].hits,
	rawData: state.rawData[props.componentId],
	aggregationData: state.compositeAggregations[props.componentId] || [],
	themePreset: state.config.themePreset,
	isLoading: !!state.isLoading[`${props.componentId}_active`],
	error: state.error[props.componentId],

	time: (state.hits[props.componentId] && state.hits[props.componentId].time) || 0,
	total: state.hits[props.componentId] && state.hits[props.componentId].total,
	hidden: state.hits[props.componentId] && state.hits[props.componentId].hidden,
});
const mapDispatchToProps = {
	updateQuery,
	setCustomQuery,
	setDefaultQuery,
	recordSuggestionClick,
};
export const SBConnected = PreferencesConsumer(
	ComponentWrapper(connect(mapStateToProps, mapDispatchToProps)(SearchBox), {
		componentType: componentTypes.searchBox,
		internalComponent: true,
	}),
);
SBConnected.name = SearchBox.name;

SBConnected.defaultQuery = SearchBox.defaultQuery;
SBConnected.shouldQuery = SearchBox.shouldQuery;
SBConnected.hasInternalComponent = SearchBox.hasInternalComponent;

SBConnected.install = function (Vue) {
	Vue.component(SBConnected.name, SBConnected);
};
// Add componentType for SSR
SBConnected.componentType = componentTypes.searchBox;

export default SBConnected;
