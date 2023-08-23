/* eslint-disable no-nested-ternary */
import { Actions, helper, causes } from '@appbaseio/reactivecore';
import VueTypes from 'vue-types';
import hotkeys from 'hotkeys-js';
import xss from 'xss';
import { Remarkable } from 'remarkable';
import {
	AI_LOCAL_CACHE_KEY,
	AI_TRIGGER_MODES,
	componentTypes,
	SEARCH_COMPONENTS_MODES,
} from '@appbaseio/reactivecore/lib/utils/constants';
import { recordAISessionUsefulness } from '@appbaseio/reactivecore/lib/actions/analytics';
import {
	getQueryOptions,
	suggestionTypes,
	featuredSuggestionsActionTypes,
	getObjectFromLocalStorage,
} from '@appbaseio/reactivecore/lib/utils/helper';
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
import Title from '../../styles/Title';
import InputGroup from '../../styles/InputGroup';
import InputWrapper from '../../styles/InputWrapper';
import InputAddon from '../../styles/InputAddon';
import {
	suggestionsContainer,
	suggestions,
	searchboxSuggestions,
	TextArea,
	Actions as ActionsContainer,
} from '../../styles/Input';
import IconGroup from '../../styles/IconGroup';
import IconWrapper, { ButtonIconWrapper } from '../../styles/IconWrapper';
import Downshift from '../basic/DownShift.jsx';
import Container from '../../styles/Container';
import types from '../../utils/vueTypes';
import ComponentWrapper from '../basic/ComponentWrapper.jsx';
import PreferencesConsumer from '../basic/PreferencesConsumer.jsx';
import SuggestionWrapper from './addons/SuggestionWrapper.jsx';
import SuggestionItem from './addons/SuggestionItem.jsx';
import SearchSvg from '../shared/SearchSvg';
import CancelSvg from '../shared/CancelSvg';
import Mic from './addons/Mic.jsx';
import CustomSvg from '../shared/CustomSvg';
import AutofillSvg from '../shared/AutoFillSvg.jsx';
import Button from '../../styles/Button';
import { TagItem, TagsContainer } from '../../styles/Tags';
import AutosuggestFooterContainer from '../../styles/AutosuggestFooterContainer';
import HorizontalSkeletonLoader from '../shared/HorizontalSkeletonLoader.jsx';
import { Answer, Footer, SearchBoxAISection, SourceTags } from '../../styles/SearchBoxAI';
import AIFeedback from '../shared/AIFeedback.jsx';
import { innerText } from './innerText';

const md = new Remarkable();

md.set({
	html: true,
	breaks: true,
	xhtmlOut: true,
	linkify: true,
	linkTarget: '_blank',
});
const _dropdownULRef = 'dropdownULRef';
const _inputGroupRef = 'inputGroupRef';

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
			showAIScreen: false,
			showAIScreenFooter: false,
			showFeedbackComponent: false,
			feedbackState: null,
			faqAnswer: '',
			faqQuestion: '',
			initialHits: null,
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
		currentTriggerMode() {
			return (
				(this.$props.AIUIConfig && this.$props.AIUIConfig.triggerOn)
				|| AI_TRIGGER_MODES.MANUAL
			);
		},
		hasCustomRenderer() {
			return hasCustomRenderer(this);
		},
		stats() {
			return getResultStats(this);
		},
		mergedAIQuestion() {
			return (
				this.faqQuestion
				|| (this.AIResponse && this.AIResponse.response && this.AIResponse.response.question)
			);
		},
		mergedAIAnswer() {
			return (
				this.faqAnswer
				|| (this.AIResponse
					&& this.AIResponse.response
					&& this.AIResponse.response.answer
					&& this.AIResponse.response.answer.text)
			);
		},
		parsedSuggestions() {
			let suggestionsArray = [];
			if (Array.isArray(this.suggestions) && this.suggestions.length) {
				suggestionsArray = [...withClickIds(this.suggestions)];
			}
			if (this.renderTriggerMessage() && this.currentValue) {
				suggestionsArray.unshift({
					label: this.renderTriggerMessage(),
					value: 'AI_TRIGGER_MESSAGE',
					_suggestion_type: '_internal_a_i_trigger',
				});
			}

			suggestionsArray
			= suggestionsArray
					.map((s) => {
						if (s.sectionId) {
							return s;
						}
						return { ...s, sectionId: s._suggestion_type };
					})
					.map((suggestion) => {
						if (suggestion._suggestion_type === 'document') {
							// Document suggestions don't have a meaningful label and value
							const newSuggestion = { ...suggestion };
							newSuggestion.label = 'For recent document suggestion, please implement a renderItem method to display label.';
							const renderItem = this.$slots.renderItem || this.$props.renderItem;
							if (typeof renderItem === 'function') {
								const jsxEl = renderItem(newSuggestion);
								const innerValue = innerText(jsxEl);
								newSuggestion.value = xss(innerValue);
							}
							return newSuggestion;
						}
						return suggestion;
					});

			const sectionsAccumulated = [];
			const sectionisedSuggestions = suggestionsArray.reduce((acc, d, currentIndex) => {
				if (sectionsAccumulated.includes(d.sectionId)) return acc;
				if (d.sectionId) {
					acc[currentIndex] = suggestionsArray.filter((g) => g.sectionId === d.sectionId);
					sectionsAccumulated.push(d.sectionId);
				} else {
					acc[currentIndex] = d;
				}
				return acc;
			}, {});
			return Object.values(sectionisedSuggestions);
		},
	},
	props: {
		autoFocus: VueTypes.bool,
		autosuggest: VueTypes.bool.def(true),
		beforeValueChange: types.func,
		className: VueTypes.string.def(''),
		clearIcon: types.children,
		componentId: types.stringRequired,
		compoundClause: types.compoundClause,
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
		enableFAQSuggestions: VueTypes.bool.def(false),
		enableDocumentSuggestions: VueTypes.bool.def(false),
		documentSuggestionsConfig: VueTypes.shape({
			size: VueTypes.number,
			from: VueTypes.number,
			maxChars: VueTypes.number
		}),
		FAQSuggestionsConfig: VueTypes.shape({
			sectionLabel: VueTypes.string,
			size: VueTypes.number,
		}),
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
		showFocusShortcutsIcon: VueTypes.bool.def(true),
		addonBefore: VueTypes.any,
		addonAfter: VueTypes.any,
		showSuggestionsFooter: VueTypes.bool.def(true),
		expandSuggestionsContainer: VueTypes.bool.def(true),
		renderSuggestionsFooter: VueTypes.func,
		index: VueTypes.string,
		popularSuggestionsConfig: VueTypes.object,
		recentSuggestionsConfig: VueTypes.object,
		featuredSuggestionsConfig: VueTypes.shape({
			maxSuggestionsPerSection: VueTypes.number,
			sectionsOrder: VueTypes.arrayOf(VueTypes.string),
		}),
		customEvents: VueTypes.object,
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
		enableAI: VueTypes.bool.def(false),
		AIConfig: types.AIConfig,
		AIUIConfig: types.AIUIConfig,
	},
	mounted() {
		this.listenForFocusShortcuts();
		const dropdownEle = this.$refs[_dropdownULRef];
		if (dropdownEle) {
			const handleScroll = () => {
				const { scrollTop } = dropdownEle;
				this.lastScrollTop = scrollTop;

				if (scrollTop < this.lastScrollTop) {
				// User is scrolling up
					clearInterval(this.scrollTimerRef);
					this.isUserScrolling = true;
				}
				// Update lastScrollTop with the current scroll position
				this.lastScrollTop = scrollTop;

			};

			dropdownEle.addEventListener('scroll', handleScroll);


		}
	},
	updated() {
		if (this.$props.mode === SEARCH_COMPONENTS_MODES.SELECT && this.$options.isTagsMode === true) {
			this.$options.isTagsMode = false;
			this.selectedTags = [];
		} else if(this.$props.mode === SEARCH_COMPONENTS_MODES.TAG&& this.$options.isTagsMode === false){
			this.$options.isTagsMode = true;
		}
	},
	watch: {
		AIResponse(newVal) {
			if (newVal) {
				if (
					this.$props.AIUIConfig
					&& this.$props.AIUIConfig.showSourceDocuments
					&& newVal.response
					&& newVal.response.answer
					&& Array.isArray(newVal.response.answer.documentIds)
				) {
					this.sourceDocIds = newVal.response.answer.documentIds;

					const localCache
						= getObjectFromLocalStorage(AI_LOCAL_CACHE_KEY)
						&& getObjectFromLocalStorage(AI_LOCAL_CACHE_KEY)[this.$props.componentId];

					if (localCache && localCache.meta && localCache.meta.hits && localCache.meta.hits.hits) {
						this.initialHits = localCache.meta.hits.hits;
					}

					if (!this.showAIScreenFooter) {
						this.showAIScreenFooter = true;
					}
				}

			}
		},
		dataField(newVal, oldVal) {
			if (!isEqual(newVal, oldVal)) {
				this.triggerCustomQuery(this.$data.currentValue);
			}
		},
		fieldWeights() {
			this.triggerCustomQuery(this.$data.currentValue);
		},
		fuzziness() {
			this.triggerCustomQuery(this.$data.currentValue);
		},
		queryFormat() {
			this.triggerCustomQuery(this.$data.currentValue);
		},
		defaultValue(newVal) {
			this.setValue(newVal, true, this.$props);
		},
		value(newVal, oldVal) {
			if (!isEqual(newVal, oldVal)) {
				this.setValue(
					newVal,
					true,
					this.$props,
					newVal === '' ? causes.CLEAR_VALUE : undefined,
					false,
				);
			}
		},
		defaultQuery(newVal, oldVal) {
			if (!isQueryIdentical(newVal, oldVal, this.$data.currentValue, this.$props)) {
				this.triggerDefaultQuery(this.$data.currentValue);
			}
		},
		customQuery(newVal, oldVal) {
			if (!isQueryIdentical(newVal, oldVal, this.$data.currentValue, this.$props)) {
				this.triggerCustomQuery(this.$data.currentValue);
			}
		},
		suggestions(newVal) {
			let suggestionsList = [];
			if (Array.isArray(newVal) && newVal.length) {
				suggestionsList = [...withClickIds(newVal)];
			} else if (
				Array.isArray(this.$props.defaultSuggestions)
				&& this.$props.defaultSuggestions.length
			) {
				suggestionsList = [...withClickIds(this.$props.defaultSuggestions)];
			}
			this.normalizedSuggestions = suggestionsList;

			this.handleTextAreaHeightChange();
		},
		selectedValue(newVal, oldVal) {
			if (
				!isEqual(newVal, oldVal)
				&& (this.$options.isTagsMode
					? !isEqual(this.$data.selectedTags, newVal)
					: this.$data.currentValue !== newVal)
			) {
				if (!newVal && this.$data.currentValue) {
					// selected value is cleared, call onValueSelected
					this.onValueSelectedHandler('', causes.CLEAR_VALUE);
				}

				if (this.$options.isTagsMode) {
					// handling reset of tags through SelectedFilters or URL
					this.selectedTags = [];
				}
				let cause = !newVal ? causes.CLEAR_VALUE : undefined;
				if (this.$options.isTagsMode) {
					cause = causes.SUGGESTION_SELECT;
				}
				if (this.$props.value === undefined) {
					this.setValue(newVal, newVal === '', this.$props, cause, false);
				} else {
					this.setValue(newVal || '', true, this.$props, cause);
				}
			}
		},
		focusShortcuts() {
			this.listenForFocusShortcuts();
		},
		rawData(newVal) {
			this.$emit('on-data', {
				data: this.normalizedSuggestions,
				rawData: newVal,
				aggregationData: this.aggregationData,
				loading: this.isLoading,
				error: this.isError,
			});
			if (newVal && newVal.hits && newVal.hits.hits) {
				this.initialHits = newVal.hits.hits;
			}
		},
		aggregationData(newVal) {
			this.$emit('on-data', {
				data: this.normalizedSuggestions,
				rawData: this.rawData,
				aggregationData: newVal,
				loading: this.isLoading,
				error: this.isError,
			});
		},
		loading(newVal) {
			this.$emit('on-data', {
				data: this.normalizedSuggestions,
				rawData: this.rawData,
				aggregationData: this.aggregationData,
				loading: newVal,
				error: this.isError,
			});
		},
		error(newVal) {
			this.$emit('on-data', {
				data: this.normalizedSuggestions,
				rawData: this.rawData,
				aggregationData: this.aggregationData,
				loading: this.isLoading,
				error: newVal,
			});
		},
		debounce(newVal, oldVal) {
			if (!isEqual(newVal, oldVal)) {
				this.handleTextChange = debounce(this.handleText, newVal);
			}
		},
		isAITyping(newVal, oldVal) {
			const scrollAIContainer = () => {
				if (this.isUserScrolling) return;
				const dropdownEle = this.$refs[_dropdownULRef];
				if (dropdownEle) {
					dropdownEle.scrollTo({
						top: dropdownEle.scrollHeight,
						behavior: 'smooth',
					});
				}
			};

			if (!newVal && oldVal) {
				clearInterval(this.scrollTimerRef)
				this.showAIScreenFooter = true;
				if (
					this.$props.AIUIConfig
					&& typeof this.$props.AIUIConfig.showFeedback === 'boolean'
						? this.$props.AIUIConfig.showFeedback
						: true
				) {
					this.showFeedbackComponent = true;
				}

				setTimeout(() => {
					scrollAIContainer();
				}, 500);
			} else if (newVal) {
				this.scrollTimerRef = setInterval(() => {
					scrollAIContainer();
				}, 2000);
			}
		},
		showAIScreen(newVal) {
			if (newVal) {
				if (this.$refs?.[this.$props.innerRef] && this.$refs[this.$props.innerRef].$el) {
					this.$refs[this.$props.innerRef].$el.blur();
				}
			} else {
				this.feedbackState = null;
				this.showFeedbackComponent = false;
			}
		},
		currentValue() {
			this.$nextTick(this.handleTextAreaHeightChange)
		},
	},
	methods: {
		renderTriggerMessage() {
			if (this.$props.enableAI) {
				if (this.$props.AIUIConfig && this.$props.AIUIConfig.renderTriggerMessage) {
					return this.$props.AIUIConfig.renderTriggerMessage;
				}
				if (this.$slots.renderTriggerMessage) {
					return this.$slots.renderTriggerMessage();
				}
				if (
					this.currentTriggerMode === AI_TRIGGER_MODES.MANUAL
					&& (this.$props.AIUIConfig ? !this.$props.AIUIConfig.askButton : true)
				) {
					return 'Click to trigger AIAnswer';
				}
			}
			return null;
		},
		handleText(value, cause) {
			if (cause === causes.CLEAR_VALUE) {
				this.triggerCustomQuery(value);
				this.triggerDefaultQuery(value);
			} else if (this.$props.autosuggest) {
				this.triggerDefaultQuery(value);
			} else if (!this.$props.enterButton) {
				this.triggerCustomQuery(value);
			}
		},
		getComponent(downshiftProps = {}) {
			const { currentValue } = this.$data;
			const data = {
				error: this.error,
				loading: this.isLoading,
				downshiftProps,
				data: this.normalizedSuggestions,
				rawData: this.rawData,
				value: currentValue,
				resultStats: this.stats,
				AIData: {
					question: this.mergedAIQuestion,
					answer: this.mergedAIAnswer,
					documentIds:
						(this.AIResponse
							&& this.AIResponse.response
							&& this.AIResponse.response.answer
							&& this.AIResponse.response.answer.documentIds)
						|| [],
					showAIScreen: this.showAIScreen,
					sources: this.getAISourceObjects(),
					isAILoading: this.isAIResponseLoading,
					AIError: this.AIResponseError,
				},
			};
			return <div ref={_dropdownULRef}>{getComponent(data, this)}</div>;
		},
		// returns size and aggs property
		getBasicQueryOptions() {
			const { aggregationField } = this.$props;
			const queryOptions = getQueryOptions(this.$props);
			if (aggregationField) {
				queryOptions.aggs = getCompositeAggsQuery({
					props: this.$props,
					showTopHits: true,
				}).aggs;
			}
			return queryOptions;
		},
		handleSearchIconClick() {
			const { currentValue } = this;
			if (currentValue.trim()) {
				this.setValue(currentValue, true);
				this.onValueSelectedHandler(currentValue, causes.SEARCH_ICON_CLICK);
			}
		},
		setValue(
			value,
			isDefaultValue = false,
			props = this.$props,
			cause,
			toggleIsOpen = true,
			categoryValue = undefined,
			shouldExecuteQuery = true,
		) {
			const performUpdate = () => {
				if (this.$options.isTagsMode && isEqual(value, this.selectedTags)) {
					return;
				}
				if (this.$options.isTagsMode && cause === causes.SUGGESTION_SELECT) {
					if (Array.isArray(this.selectedTags) && this.selectedTags.length) {
						// check if value already present in selectedTags
						if (typeof value === 'string' && this.selectedTags.includes(value)) {
							this.isOpen = false;
							return;
						}
						this.selectedTags = [...this.selectedTags];

						if (typeof value === 'string' && !!value) {
							this.selectedTags.push(value);
						} else if (Array.isArray(value) && !isEqual(this.selectedTags, value)) {
							this.selectedTags = value;
						}
					} else if (value) {
						this.selectedTags = typeof value !== 'string' ? value : [...value];
					}
					this.currentValue = '';
				} else {
					this.currentValue = decodeHtml(value);
				}

				let queryHandlerValue = value;
				if (this.$options.isTagsMode && cause === causes.SUGGESTION_SELECT) {
					queryHandlerValue
						= Array.isArray(this.selectedTags) && this.selectedTags.length
							? this.selectedTags
							: undefined;
				}

				if ((this.faqAnswer || this.faqQuestion) && value === '') {
					// Empty the previous state
					this.faqAnswer = '';
					this.faqQuestion = '';
					this.showAIScreen = false;
				}

				if (isDefaultValue) {
					if (this.$props.autosuggest) {
						if (toggleIsOpen) {
							this.isOpen = false;
						}
						if (typeof this.currentValue === 'string')
							this.triggerDefaultQuery(
								this.currentValue,
								props.enableAI
									&& this.currentTriggerMode === AI_TRIGGER_MODES.QUESTION
									&& this.currentValue.endsWith('?')
									? { enableAI: true }
									: {},
								shouldExecuteQuery,
							);
					} // in case of strict selection only SUGGESTION_SELECT should be able
					// to set the query otherwise the value should reset
					if (props.strictSelection) {
						if (
							cause === causes.SUGGESTION_SELECT
							|| (this.$options.isTagsMode
								? this.selectedTags.length === 0
								: value === '')
						) {
							this.triggerCustomQuery(
								queryHandlerValue,
								this.$options.isTagsMode ? undefined : categoryValue,
								shouldExecuteQuery,
							);
						} else {
							this.setValue('', true);
						}
					} else if (
						props.value === undefined
						|| cause === causes.SUGGESTION_SELECT
						|| cause === causes.CLEAR_VALUE
					) {
						this.showAIScreen = false;
						this.triggerCustomQuery(
							queryHandlerValue,
							this.$options.isTagsMode ? undefined : categoryValue,
							shouldExecuteQuery,
						);
					}
				} else {
					// debounce for handling text while typing
					this.handleTextChange(value, cause);
				}

				this.$emit('valueChange', value);
				this.$emit('value-change', value);
			};

			checkValueChange(props.componentId, value, props.beforeValueChange, performUpdate);
		},
		triggerDefaultQuery(paramValue, meta = {}, shouldExecuteQuery = true) {
			if (!this.$props.autosuggest) {
				return;
			}
			const value = typeof paramValue !== 'string' ? this.currentValue : paramValue;
			let query = SearchBox.defaultQuery(value, this.$props);
			if (this.defaultQuery) {
				const defaultQueryToBeSet = this.defaultQuery(value, this.$props) || {};
				if (defaultQueryToBeSet.query) {
					({ query } = defaultQueryToBeSet);
				}

				// Update calculated default query in store
				updateDefaultQuery(
					this.$props.componentId,
					this.setDefaultQuery,
					this.$props,
					value,
				);
			}
			this.updateQuery(
				{
					componentId: this.internalComponent,
					query,
					value,
					componentType: componentTypes.searchBox,
					meta,
				},
				shouldExecuteQuery,
			);
		},
		triggerCustomQuery(paramValue, categoryValue = undefined, shouldExecuteQuery = true) {
			const { customQuery, filterLabel, showFilter, URLParams } = this.$props;
			let value = typeof paramValue !== 'string' ? this.$data.currentValue : paramValue;
			if (this.$options.isTagsMode) {
				value = paramValue;
			}
			const defaultQueryTobeSet = SearchBox.defaultQuery(
				`${value}${categoryValue ? ` in ${categoryValue}` : ''}`,
				this.$props,
			);
			let query = defaultQueryTobeSet;
			if (customQuery) {
				const customQueryTobeSet = customQuery(value, this.$props);
				const queryTobeSet = customQueryTobeSet.query;
				if (queryTobeSet) {
					query = queryTobeSet;
				}
				updateCustomQuery(this.$props.componentId, this.setCustomQuery, this.$props, value);
			}
			this.updateQuery(
				{
					componentId: this.$props.componentId,
					query,
					value,
					label: filterLabel,
					showFilter,
					URLParams,
					componentType: componentTypes.searchBox,
					category: categoryValue,
				},
				shouldExecuteQuery,
			);
		},
		handleFocus(event) {
			if (this.$props.autosuggest) {
				this.isOpen = true;
			}
			this.$emit('focus', event);
		},
		handleVoiceResults({ results }) {
			if (
				results
				&& results[0]
				&& results[0].isFinal
				&& results[0][0]
				&& results[0][0].transcript
				&& results[0][0].transcript.trim()
			) {
				this.setValue(results[0][0].transcript.trim(), true);
				this.$refs?.[this.$props.innerRef]?.$el?.focus(); // eslint-disable-line
			}
		},
		triggerQuery({
			isOpen = undefined,
			customQuery = true,
			defaultQuery = true,
			value = undefined,
			categoryValue = undefined,
		}) {
			if (typeof isOpen === 'boolean') {
				this.isOpen = isOpen;
			}

			if (customQuery) {
				this.triggerCustomQuery(value, categoryValue);
			}
			if (defaultQuery) {
				this.triggerDefaultQuery(value);
			}
		},
		triggerClickAnalytics(searchPosition, documentId) {
			// click analytics would only work client side and after javascript loads
			let docId = documentId;
			if (!docId) {
				const hitData = this.normalizedSuggestions.find(
					(hit) => hit._click_id === searchPosition,
				);
				if (hitData && hitData.source && hitData.source._id) {
					docId = hitData.source._id;
				}
			}
			this.recordSuggestionClick(searchPosition, docId);
		},

		clearValue() {
			this.setValue(
				'',
				false,
				this.$props,
				!this.$options.isTagsMode ? causes.CLEAR_VALUE : undefined,
				false,
			);
			this.onValueSelectedHandler(
				'',
				!this.$options.isTagsMode ? causes.CLEAR_VALUE : undefined,
			);
			this.showAIScreen = false;
			this.isOpen = false;
		},

		handleKeyDown(event, highlightedIndex = null) {
			// if a suggestion was selected, delegate the handling to suggestion handler
			if (event.key === 'Enter') {
				if (this.$props.autosuggest === false) {
					this.enterButtonOnClick();
				} else if (highlightedIndex === null) {
					this.setValue(
						event.target.value,
						true,
						this.$props,
						this.$options.isTagsMode ? causes.SUGGESTION_SELECT : undefined, // to handle tags
						!(
							this.$props.enableAI
							&& this.currentTriggerMode === AI_TRIGGER_MODES.QUESTION
							&& event.target.value.endsWith('?')
						),
					);
					if (
						this.$props.enableAI
						&& !this.showAIScreen
						&& this.currentTriggerMode === AI_TRIGGER_MODES.QUESTION
						&& event.target.value.endsWith('?')
					) {
						this.showAIScreen = true;
						this.isOpen = true;
					}
					this.onValueSelectedHandler(event.target.value, causes.ENTER_PRESS);
				}
			}

			// Need to review
			this.$emit('keyDown', event, this.triggerQuery);
			this.$emit('key-down', event, this.triggerQuery);
		},

		onInputChange(e) {
			const { value: inputValue } = e.target;

			if (!this.$data.isOpen && this.$props.autosuggest) {
				this.isOpen = true;
			}
			if (this.showAIScreen) {
				this.showAIScreen = false;
			}

			const { value } = this.$props;
			if (value === undefined) {
				this.setValue(inputValue, inputValue === '', this.$props, undefined, false);
			} else {
				this.$emit(
					'change',
					inputValue,
					({ isOpen }) =>
						this.triggerQuery({
							defaultQuery: true,
							customQuery: true,
							value: inputValue,
							isOpen,
						}),
					e,
				);
			}
		},
		handleFeaturedSuggestionClicked(suggestion) {
			try {
				if (suggestion.action === featuredSuggestionsActionTypes.NAVIGATE) {
					const { target = '_self', link = '/' } = JSON.parse(suggestion.subAction);

					if (typeof window !== 'undefined') {
						window.open(link, target);
					}
				}
				if (suggestion.action === featuredSuggestionsActionTypes.FUNCTION) {
					const matchedValues = suggestion.subAction.match(/function\s*\(.*\)(.|\n)*/);
					const functionStr = matchedValues && matchedValues[0];
					// eslint-disable-next-line no-new-func
					const func = new Function(`return ${functionStr}`)();
					func(suggestion, this.$data.currentValue, this.$props.customEvents);
				}
				if (suggestion.action === featuredSuggestionsActionTypes.SELECT) {
					this.setValue(
						suggestion.value,
						true,
						this.$props,
						this.$options.isTagsMode.current
							? causes.SUGGESTION_SELECT
							: causes.ENTER_PRESS,
						false,
					);
					this.onValueSelectedHandler(suggestion.value, causes.SUGGESTION_SELECT);
				}
				// blur is important to close the dropdown
				// on selecting one of featured suggestions
				// else Downshift probably is focusing the dropdown
				// and not letting it close
				// eslint-disable-next-line no-unused-expressions
				this.$refs?.[this.$props.innerRef]?.el?.blur();
			} catch (e) {
				console.error(
					`Error: There was an error parsing the subAction for the featured suggestion with label, "${suggestion.label}"`,
					e,
				);
			}
		},

		onSuggestionSelected(suggestion) {
			const { value } = this.$props;
			// The state of the suggestion is open by the time it reaches here. i.e. isOpen = true
			// handle when FAQ suggestion is clicked
			if (suggestion && suggestion._suggestion_type === suggestionTypes.FAQ) {
				this.currentValue = suggestion.value;
				// Handle AI
				// Independent of enableAI.
				this.faqAnswer = suggestion._answer;
				this.faqQuestion = suggestion.value;
				this.isOpen = true;
				this.showAIScreen = true;
				if (value !== undefined) this.$emit('change', suggestion.value, () => {});
				this.onValueSelectedHandler(suggestion.value);
				return;
			}
			if (suggestion && suggestion._suggestion_type === '_internal_a_i_trigger') {
				this.showAIScreen = true;
				this.askButtonOnClick();
				return;
			}

			// handle featured suggestions click event
			if (suggestion._suggestion_type === suggestionTypes.Featured) {
				this.handleFeaturedSuggestionClicked(suggestion);
				// Handle AI
				if (!this.$props.enableAI) this.isOpen = false;
				else {
					this.showAIScreen = true;
				}
				return;
			}
			// Record analytics for selected suggestions
			this.triggerClickAnalytics(suggestion._click_id);
			if (value === undefined) {
				this.setValue(
					suggestion.value,
					true,
					this.$props,
					causes.SUGGESTION_SELECT,
					false,
					suggestion._category,
				);
			} else {
				let emitValue = suggestion.value;
				if (this.$options.isTagsMode) {
					emitValue = Array.isArray(this.selectedTags) ? [...this.selectedTags] : [];
					if (this.selectedTags.includes(suggestion.value)) {
						// avoid duplicates in tags array
						this.isOpen = false;
						return;
					}
					emitValue.push(suggestion.value);
				}

				this.setValue(
					emitValue,
					true,
					this.$props,
					causes.SUGGESTION_SELECT,
					false,
					suggestion._category,
				);
				this.$emit('change', emitValue, ({ isOpen }) =>
					this.triggerQuery({
						isOpen,
						value: emitValue,
						...(!this.$options.isTagsMode && { categoryValue: suggestion._category }),
					}),
				);
			}
			this.onValueSelectedHandler(
				suggestion.value,
				causes.SUGGESTION_SELECT,
				suggestion.source,
			);

			// Handle AI
			if (!this.$props.enableAI) this.isOpen = false;
			else if (
				this.currentTriggerMode === AI_TRIGGER_MODES.QUESTION
				&& suggestion.value.endsWith('?')
			) {
				this.showAIScreen = true;
			}
		},

		onValueSelectedHandler(currentValue = this.$data.currentValue, ...cause) {
			this.$emit('valueSelected', currentValue, ...cause);
			this.$emit('value-selected', currentValue, ...cause);
		},

		handleStateChange(changes) {
			const { isOpen } = changes;
			this.isOpen = isOpen;
		},

		getBackgroundColor(highlightedIndex, index) {
			const isDark = this.themePreset === 'dark';

			if (isDark) {
				return highlightedIndex === index ? '#555' : '#424242';
			}

			return highlightedIndex === index ? '#eee' : '#fff';
		},

		renderIcon() {
			if (this.$props.showIcon) {
				return this.$props.icon || <SearchSvg />;
			}

			return null;
		},

		renderErrorComponent(isAIError = false) {
			const renderError = this.$slots.renderError || this.$props.renderError;
			if (isAIError) {
				if (this.showAIScreen && this.AIResponseError && !this.isAIResponseLoading) {
					if (renderError) {
						return (
							<div
								class={`--ai-answer-error-container ${
									getClassName(this.$props.innerClass, 'ai-error') || ''
								}`}
							>
								{renderError(this.AIResponseError)}
							</div>
						);
					}
					return (
						<div
							class={`--ai-answer-error-container ${
								getClassName(this.$props.innerClass, 'ai-error') || ''
							}`}
						>
							<div class="--default-error-element">
								<span>
									{typeof this.AIResponseError === 'string'
										? this.AIResponseError
										: this.AIResponseError.message
											? this.AIResponseError.message
											: 'There was an error in generating the response.'}
									{this.AIResponseError.code
										? `Code:
							${this.AIResponseError.code}`
										: ''}
								</span>

								{/* <Button primary onClick={handleRetryRequest}>
								Try again
							</Button> */}
							</div>
						</div>
					);
				}
			}
			if (this.error && renderError && this.$data.currentValue && !this.isLoading) {
				return (
					<SuggestionWrapper
						innerClass={this.$props.innerClass}
						innerClassName="error"
						theme={this.theme}
						themePreset={this.themePreset}
					>
						{isFunction(renderError) ? renderError(this.error) : renderError}
					</SuggestionWrapper>
				);
			}
			return null;
		},

		renderCancelIcon() {
			if (this.$props.showClear) {
				return this.$props.clearIcon || <CancelSvg />;
			}

			return null;
		},
		renderNoSuggestions(finalSuggestionsList = []) {
			const { innerClass } = this.$props;
			const renderNoSuggestion
				= this.$slots.renderNoSuggestion || this.$props.renderNoSuggestion;
			const renderError = this.$slots.renderError || this.$props.renderError;
			const { isOpen, currentValue } = this.$data;
			if (
				renderNoSuggestion
				&& isOpen
				&& !finalSuggestionsList.length
				&& !this.isLoading
				&& currentValue
				&& !(renderError && this.error)
			) {
				return (
					<SuggestionWrapper
						innerClass={innerClass}
						themePreset={this.themePreset}
						theme={this.theme}
						innerClassName="noSuggestion"
					>
						{{
							default: () =>
								typeof renderNoSuggestion === 'function'
									? renderNoSuggestion(currentValue)
									: renderNoSuggestion,
						}}
					</SuggestionWrapper>
				);
			}
			return null;
		},
		renderInputAddonBefore() {
			const { addonBefore } = this.$slots;
			if (addonBefore) {
				return <InputAddon class="addon-before">{addonBefore()}</InputAddon>;
			}

			return null;
		},
		renderInputAddonAfter() {
			const { addonAfter } = this.$slots;
			if (addonAfter) {
				return <InputAddon class="addon-after">{addonAfter()}</InputAddon>;
			}

			return null;
		},
		enterButtonOnClick() {
			this.showAIScreen = false;
			this.triggerQuery({ isOpen: false, value: this.currentValue, customQuery: true });
		},
		suggestionsFooter() {
			return typeof renderSuggestionsFooter === 'function' ? (
				this.$props.renderSuggestionsFooter()
			) : (
				<AutosuggestFooterContainer>
					<div>↑↓ Navigate</div>
					<div>↩ Go</div>
				</AutosuggestFooterContainer>
			);
		},
		renderEnterButtonElement() {
			const { enterButton, innerClass } = this.$props;
			const { renderEnterButton } = this.$slots;

			if (enterButton) {
				const getEnterButtonMarkup = () => {
					if (renderEnterButton) {
						return renderEnterButton(this.enterButtonOnClick);
					}

					return (
						<Button
							class={`enter-btn ${getClassName(innerClass, 'enter-button')}`}
							primary
							onClick={this.enterButtonOnClick}
						>
							Search
						</Button>
					);
				};

				return <div class="enter-button-wrapper">{getEnterButtonMarkup()}</div>;
			}

			return null;
		},
		renderShortcut() {
			if (this.$props.focusShortcuts && this.$props.focusShortcuts.length) {
				let shortcut = this.$props.focusShortcuts[0];
				shortcut = shortcut.toLowerCase();
				shortcut = shortcut.replace('shift', '⬆️');
				shortcut = shortcut.replace('command', 'cmd');
				shortcut = shortcut.replace('control', 'ctrl');
				shortcut = shortcut.replace('option', 'alt');
				return shortcut.toUpperCase();
			}
			return '/';
		},
		renderLeftIcons() {
			const { iconPosition, showIcon } = this.$props;
			return (
				<div>
					<IconGroup groupPosition="left">
						{iconPosition === 'left' && showIcon && (
							<IconWrapper onClick={this.handleSearchIconClick}>
								{this.renderIcon()}
							</IconWrapper>
						)}
					</IconGroup>
				</div>
			);
		},
		renderRightIcons() {
			const {
				iconPosition,
				showClear,
				innerClass,
				getMicInstance,
				showVoiceSearch,
				showIcon,
				showFocusShortcutsIcon,
			} = this.$props;
			const renderMic = this.$slots.renderMic || this.$props.renderMic;
			const { currentValue } = this.$data;
			return (
				<div>
					<IconGroup groupPosition="right">
						{currentValue && showClear && (
							<IconWrapper onClick={this.clearValue} showIcon={showIcon} isClearIcon>
								{this.renderCancelIcon()}
							</IconWrapper>
						)}
						{showFocusShortcutsIcon && (
							<ButtonIconWrapper onClick={(e) => this.focusSearchBox(e)}>
								{this.renderShortcut()}
							</ButtonIconWrapper>
						)}
						{showVoiceSearch && (
							<Mic
								getInstance={getMicInstance}
								render={renderMic}
								handleResult={this.handleVoiceResults}
								className={getClassName(innerClass, 'mic') || null}
							/>
						)}
						{iconPosition === 'right' && showIcon && (
							<IconWrapper onClick={this.handleSearchIconClick}>
								{this.renderIcon()}
							</IconWrapper>
						)}
					</IconGroup>
				</div>
			);
		},
		focusSearchBox(event) {
			const elt = event.target || event.srcElement;
			const { tagName } = elt;
			if (
				elt.isContentEditable
				|| tagName === 'INPUT'
				|| tagName === 'SELECT'
				|| tagName === 'TEXTAREA'
			) {
				// already in an input
				return;
			}

			this.$refs?.[this.$props.innerRef]?.$el?.focus(); // eslint-disable-line
		},
		listenForFocusShortcuts() {
			const { focusShortcuts = ['/'] } = this.$props;

			if (isEmpty(focusShortcuts)) {
				return;
			}
			const shortcutsString = parseFocusShortcuts(focusShortcuts).join(',');

			// handler for alphabets and other key combinations
			hotkeys(
				shortcutsString, // eslint-disable-next-line no-unused-vars
				/* eslint-disable no-shadow */ (event, handler) => {
					// Prevent the default refresh event under WINDOWS system
					event.preventDefault();
					this.focusSearchBox(event);
				},
			);

			// if one of modifier keys are used, they are handled below
			hotkeys('*', (event) => {
				const modifierKeys = extractModifierKeysFromFocusShortcuts(focusShortcuts);

				if (modifierKeys.length === 0) return;

				for (let index = 0; index < modifierKeys.length; index += 1) {
					const element = modifierKeys[index];
					if (hotkeys[element]) {
						this.focusSearchBox(event);
						break;
					}
				}
			});
		},
		onAutofillClick(suggestion) {
			const { value } = suggestion;
			this.isOpen = true;
			this.currentValue = decodeHtml(value);
			this.triggerDefaultQuery(value);
		},
		renderActionIcon(suggestion) {
			const handleAutoFillClick = (e) => {
				e.stopPropagation();
				this.onAutofillClick(suggestion);
			};
			if (suggestion._suggestion_type === suggestionTypes.Featured) {
				if (suggestion.action === featuredSuggestionsActionTypes.FUNCTION) {
					return (
						<AutofillSvg
							style={{
								transform: 'rotate(135deg)',
								pointerEvents: 'none',
							}}
						/>
					);
				}
				return null;
			}
			if (!suggestion._category) {
				/* 👇 avoid showing autofill for category suggestions👇 */

				return <AutofillSvg onClick={handleAutoFillClick} />;
			}
			return null;
		},
		renderTag(item) {
			const { innerClass } = this.$props;

			return (
				<TagItem class={getClassName(innerClass, 'selected-tag') || ''}>
					<span>{item}</span>
					<span
						role="img"
						aria-label="delete-tag"
						class="close-icon"
						onClick={() => this.clearTag(item)}
					>
						<CancelSvg />
					</span>
				</TagItem>
			);
		},
		clearAllTags() {
			this.selectedTags = [];
			this.setValue('', true, this.$props, causes.SUGGESTION_SELECT);
			if (this.$props.value !== undefined) {
				this.$emit('change', this.selectedTags, this.triggerQuery);
			}
		},
		clearTag(tagValue) {
			this.selectedTags = [...this.selectedTags.filter((tag) => tag !== tagValue)];
			this.setValue('', true, this.$props, causes.SUGGESTION_SELECT);
			if (this.$props.value !== undefined) {
				this.$emit('change', this.selectedTags, this.triggerQuery);
			}
		},
		renderTags() {
			if (!Array.isArray(this.selectedTags)) {
				return null;
			}
			const tagsList = [...this.selectedTags];
			const shouldRenderClearAllTag = tagsList.length > 1;
			const renderSelectedTags
				= this.$slots.renderSelectedTags || this.$props.renderSelectedTags;

			return renderSelectedTags ? (
				renderSelectedTags({
					values: this.selectedTags,
					handleClear: this.clearTag,
					handleClearAll: this.clearAllTags,
				})
			) : (
				<TagsContainer>
					{tagsList.map((item) => this.renderTag(item))}
					{shouldRenderClearAllTag && (
						<TagItem class={getClassName(this.$props.innerClass, 'selected-tag') || ''}>
							<span>Clear All</span>
							<span
								role="img"
								aria-label="delete-tag"
								class="close-icon"
								onClick={this.clearAllTags}
							>
								<CancelSvg />
							</span>
						</TagItem>
					)}
				</TagsContainer>
			);
		},
		getAISourceObjects() {
			const sourceObjects = [];
			if (!this.AIResponse) return sourceObjects;
			const docIds
			= (this.AIResponse
				&& this.AIResponse.response
				&& this.AIResponse.response.answer
				&& this.AIResponse.response.answer.documentIds)
				|| [];
			if (
				this.initialHits
			) {
				docIds.forEach((id) => {
					const foundSourceObj
						= this.initialHits.find((hit) => hit._id === id) || {};
					if (foundSourceObj) {
						const { _source = {}, ...rest } = foundSourceObj;

						sourceObjects.push({ ...rest, ..._source });
					}
				});
			} else {
				sourceObjects.push(
					...docIds.map((id) => ({
						_id: id,
					})),
				);
			}

			return sourceObjects;
		},
		renderAIScreenLoader() {
			const { AIUIConfig = {} } = this.$props;
			const { loaderMessage } = AIUIConfig || {};
			if (loaderMessage) {
				return loaderMessage;
			}
			if (this.$slots.AILoaderMessage) {
				return this.$slots.AILoaderMessage();
			}

			return <HorizontalSkeletonLoader />;
		},
		renderAIScreenFooter() {
			const { AIUIConfig = {} } = this.$props;
			const { showSourceDocuments = false, onSourceClick = () => {} } = AIUIConfig || {};

			const renderSourceDocumentLabel = (sourceObj) => {
				if (this.$props.AIUIConfig && this.$props.AIUIConfig.renderSourceDocument) {
					return this.$props.AIUIConfig.renderSourceDocument(sourceObj);
				}
				if (this.$slots.renderSourceDocument) {
					return this.$slots.renderSourceDocument(sourceObj);
				}
				return sourceObj._id;
			};

			return showSourceDocuments
				&& this.showAIScreenFooter
				&& this.AIResponse
				&& this.AIResponse.response
				&& this.AIResponse.response.answer
				&& this.AIResponse.response.answer.documentIds
				&& this.AIResponse.response.answer.documentIds.length ? (
					<Footer themePreset={this.$props.themePreset}>
					Summary generated using the following sources:{' '}
						<SourceTags>
							{this.getAISourceObjects().map((el) => (
								<Button
									class={`--ai-source-tag ${
										getClassName(this.$props.innerClass, 'ai-source-tag') || ''
									}`}
									info
									onClick={() => onSourceClick && onSourceClick(el)}
								>
									{renderSourceDocumentLabel(el)}
								</Button>
							))}
						</SourceTags>
					</Footer>
				) : null;
		},
		renderAIScreen() {
			const customAIRenderer = this.$props.renderAIAnswer || this.$slots.renderAIAnswer;
			if (customAIRenderer) {
				return customAIRenderer({
					question: this.mergedAIQuestion,
					answer: this.mergedAIAnswer,
					documentIds:
						(this.AIResponse
							&& this.AIResponse.response
							&& this.AIResponse.response.answer
							&& this.AIResponse.response.answer.documentIds)
						|| [],
					loading: this.isAIResponseLoading || this.isLoading,
					sources: this.getAISourceObjects(),
					error: this.AIResponseError,
				});
			}

			if (this.isAIResponseLoading || this.isLoading) {
				return this.renderAIScreenLoader();
			}

			return (
				<div>
					<Answer innerHTML={md.render(this.mergedAIAnswer)} />
					{this.renderAIScreenFooter()}
					{this.showFeedbackComponent && (
						<div class={`${getClassName(this.$props.innerClass, 'ai-feedback') || ''}`}>
							<AIFeedback
								overrideState={this.feedbackState}
								hideUI={
									this.isAIResponseLoading
									|| this.isLoading
									|| !this.sessionIdFromStore
								}
								key={this.sessionIdFromStore}
								onFeedbackSubmit={(useful, reason) => {
									this.feedbackState = {
										isRecorded: true,
										feedbackType: useful ? 'positive' : 'negative',
									};
									this.recordAISessionUsefulness(this.sessionIdFromStore, {
										useful,
										reason,
									});
								}}
							/>
						</div>
					)}
				</div>
			);
		},
		handleTextAreaHeightChange() {
			const textArea = this.$refs[this.$props.innerRef]?.$el;
			const inputGroupEle = this.$refs[_inputGroupRef]?.$el;
			if (textArea) {
				textArea.style.height = '42px';
				const lineHeight = parseInt(getComputedStyle(textArea).lineHeight, 10);
				const maxHeight = lineHeight * 4; // max height for 3 lines
				const height = Math.min(textArea.scrollHeight, maxHeight);
				textArea.style.height = `${height}px`;
				textArea.style.overflowY = height === maxHeight ? 'auto' : 'hidden';
				const dropdownEle = this.$refs[_dropdownULRef];
				if (dropdownEle) {
					dropdownEle.style.top = `${textArea.style.height}`;
				}
				if (inputGroupEle) {
					inputGroupEle.style.height = `${textArea.style.height}`;
				}
			}
		},
		askButtonOnClick() {
			this.showAIScreen = true;
			this.isOpen = true;
			this.triggerDefaultQuery(this.currentValue, { enableAI: true });
		},
		renderAskButtonElement() {
			const { AIUIConfig, innerClass } = this.$props;
			const { askButton } = AIUIConfig || {};
			const { renderAskButton } = this.$slots;
			if (askButton) {
				const getEnterButtonMarkup = () => {
					if (renderAskButton) {
						return renderAskButton(this.askButtonOnClick);
					}

					return (
						<Button
							class={`enter-btn ${getClassName(innerClass, 'ask-button')}`}
							info
							onClick={this.askButtonOnClick}
						>
							Ask
						</Button>
					);
				};

				return <div class="enter-button-wrapper">{getEnterButtonMarkup()}</div>;
			}

			return null;
		},
	},
	render() {
		const { expandSuggestionsContainer } = this.$props;
		const { recentSearchesIcon, popularSearchesIcon } = this.$slots;
		const hasSuggestions
			= Array.isArray(this.parsedSuggestions) && this.parsedSuggestions.length;
		const renderItem = this.$slots.renderItem || this.$props.renderItem;

		return (
			<Container class={this.$props.className}>
				{this.$props.title && (
					<Title class={getClassName(this.$props.innerClass, 'title') || ''}>
						{this.$props.title}
					</Title>
				)}
				{this.$props.autosuggest ? (
					<Downshift
						id={`${this.$props.componentId}-downshift`}
						handleChange={this.onSuggestionSelected}
						handleMouseup={this.handleStateChange}
						isOpen={this.$data.isOpen}
					>
						{{
							default: ({
								getInputEvents,
								getInputProps,
								getItemProps,
								getItemEvents,
								isOpen,
								highlightedIndex,
								setHighlightedIndex,
							}) => {
								const renderSuggestionsDropdown = () => {
									const getIcon = (iconType, item, leaveSpaceForIcon) => {
										switch (iconType) {
											case suggestionTypes.Recent:
												return recentSearchesIcon;
											case suggestionTypes.Popular:
												return popularSearchesIcon;
											case suggestionTypes.Featured:
												if (item.icon) {
													return () => (
														<div
															style={{ display: 'flex' }}
															innerHTML={xss(item.icon)}
														/>
													);
												}
												if (item.iconURL) {
													return () => (
														// When you change below also change the empty icon below
														<img
															style={{ maxWidth: '30px' }}
															src={xss(item.iconURL)}
															alt={item.value}
														/>
													);
												}
												// Render an empty icon when no icon is provided from the dashboard
												return () => (
													<span
														style={{
															display: 'inline-block',
															height: '30px',
															width: leaveSpaceForIcon ? '30px' : 0,
														}}
													></span>
												);

											default:
												return null;
										}
									};
									let indexOffset = 0;
									return (
										<div>
											{this.hasCustomRenderer
												&& this.getComponent({
													isOpen,
													getItemProps,
													getItemEvents,
													highlightedIndex,
												})}
											{this.renderErrorComponent()}
											{!this.hasCustomRenderer && isOpen && hasSuggestions ? (
												<ul
													class={`${suggestions(
														this.themePreset,
														this.theme,
													)} ${getClassName(
														this.$props.innerClass,
														'list',
													)} ${searchboxSuggestions(
														this.themePreset,
														this.theme,
													)}
													`}
													ref={_dropdownULRef}
												>
													{this.showAIScreen && (
														<SearchBoxAISection
															themePreset={this.$props.themePreset}
														>
															{this.renderAIScreen()}{' '}
															{this.renderErrorComponent(true)}
														</SearchBoxAISection>
													)}
													{!this.showAIScreen
														&& this.parsedSuggestions.map(
															(item, itemIndex) => {
																const index
																	= indexOffset + itemIndex;
																if (Array.isArray(item)) {
																	const sectionHtml = xss(
																		item[0].sectionLabel,
																	);
																	indexOffset += item.length - 1;
																	return (
																		<div
																			key={`section-${itemIndex}`}
																			class="section-container"
																		>
																			{sectionHtml ? (
																				<div
																					class={`section-header ${getClassName(
																						this.$props
																							.innerClass,
																						'section-label',
																					)}`}
																					key={`${item[0].sectionId}`}
																					innerHTML={
																						sectionHtml
																					}
																				/>
																			) : null}
																			<ul class="section-list">
																				{item.map(
																					(
																						sectionItem,
																						sectionIndex,
																					) => {
																						const suggestionsHaveIcon
																							= item.some(
																								(
																									s,
																								) =>
																									s.icon
																									|| s.iconURL,
																							);

																						if (
																							renderItem
																						) {
																							return (
																								<li
																									{...getItemProps(
																										{
																											item: sectionItem,
																										},
																									)}
																									on={getItemEvents(
																										{
																											item: sectionItem,
																										},
																									)}
																									key={`${sectionItem._id}_${index}_${sectionIndex}`}
																									style={{
																										justifyContent:
																											'flex-start',
																										alignItems:
																											'center',
																									}}
																									class={`${
																										highlightedIndex
																										=== index
																											+ sectionIndex
																											? `active-li-item ${getClassName(
																												this
																													.$props
																													.innerClass,
																												'active-suggestion-item',
																											  )}`
																											: `li-item ${getClassName(
																												this
																													.$props
																													.innerClass,
																												'suggestion-item',
																											  )}`
																									}`}
																								>
																									{renderItem(
																										sectionItem,
																									)}
																								</li>
																							);
																						}

																						if (
																							sectionItem._suggestion_type
																							=== '_internal_a_i_trigger'
																						) {
																							return (
																								<li
																									{...getItemProps(
																										{
																											item: sectionItem,
																										},
																									)}
																									on={getItemEvents(
																										{
																											item: sectionItem,
																										},
																									)}
																									key={`${sectionItem._id}_${index}_${sectionIndex}`}
																									style={{
																										justifyContent:
																											'flex-start',
																										alignItems:
																											'center',
																									}}
																									class={`${
																										highlightedIndex
																										=== index
																											+ sectionIndex
																											? `active-li-item ${getClassName(
																												this
																													.$props
																													.innerClass,
																												'active-suggestion-item',
																											  )}`
																											: `li-item ${getClassName(
																												this
																													.$props
																													.innerClass,
																												'suggestion-item',
																											  )}`
																									}`}
																								>
																									<SuggestionItem
																										currentValue={
																											this
																												.currentValue
																										}
																										suggestion={
																											sectionItem
																										}
																									/>
																								</li>
																							);
																						}
																						return (
																							<li
																								{...getItemProps(
																									{
																										item: sectionItem,
																									},
																								)}
																								on={getItemEvents(
																									{
																										item: sectionItem,
																									},
																								)}
																								key={`${sectionItem._id}_${index}_${sectionIndex}`}
																								style={{
																									justifyContent:
																										'flex-start',
																									alignItems:
																										'center',
																								}}
																								class={`${
																									highlightedIndex
																									=== index
																										+ sectionIndex
																										? `active-li-item ${getClassName(
																											this
																												.$props
																												.innerClass,
																											'active-suggestion-item',
																										  )}`
																										: `li-item ${getClassName(
																											this
																												.$props
																												.innerClass,
																											'suggestion-item',
																										  )}`
																								}`}
																							>
																								<div
																									style={{
																										padding:
																											'0 10px 0 0',
																										display:
																											'flex',
																									}}
																								>
																									<CustomSvg
																										key={`${sectionItem._suggestion_type}-${sectionIndex}`}
																										className={
																											getClassName(
																												this
																													.$props
																													.innerClass,
																												`${sectionItem._suggestion_type}-search-icon`,
																											)
																											|| null
																										}
																										icon={getIcon(
																											sectionItem._suggestion_type,
																											sectionItem,
																											suggestionsHaveIcon,
																										)}
																										type={`${sectionItem._suggestion_type}-search-icon`}
																									/>
																								</div>

																								<SuggestionItem
																									currentValue={
																										this
																											.currentValue
																									}
																									suggestion={
																										sectionItem
																									}
																								/>
																								{this.renderActionIcon(
																									sectionItem,
																								)}
																							</li>
																						);
																					},
																				)}
																			</ul>
																		</div>
																	);
																}
																return <div>No suggestions</div>;
															},
														)}
													{!this.showAIScreen
													&& this.parsedSuggestions.length
													&& this.$props.showSuggestionsFooter
														? this.suggestionsFooter()
														: null}
												</ul>
											) : (
												this.renderNoSuggestions(this.normalizedSuggestions)
											)}
										</div>
									);
								};
								return (
									<div class={suggestionsContainer}>
										<InputGroup
											searchBox
											ref={_inputGroupRef}
											isOpen={this.$data.isOpen}
										>
											<ActionsContainer>
												{this.renderInputAddonBefore()}
												{this.renderLeftIcons()}
											</ActionsContainer>
											<InputWrapper>
												<TextArea
													searchBox
													isOpen={this.$data.isOpen}
													id={`${this.$props.componentId}-input`}
													ref={this.$props.innerRef}
													class={getClassName(
														this.$props.innerClass,
														'input',
													)}
													placeholder={this.$props.placeholder}
													autoFocus={this.$props.autoFocus}
													searchBox
													on={getInputEvents({
														onInput: this.onInputChange,
														onBlur: (e) => {
															this.$emit(
																'blur',
																e,
																this.triggerQuery,
															);
														},
														onFocus: this.handleFocus,
														onKeyPress: (e) => {
															this.$emit(
																'keyPress',
																e,
																this.triggerQuery,
															);
															this.$emit(
																'key-press',
																e,
																this.triggerQuery,
															);
														},
														onKeyDown: (e) =>
															this.handleKeyDown(e, highlightedIndex),
														onKeyUp: (e) => {
															this.$emit(
																'keyUp',
																e,
																this.triggerQuery,
															);
															this.$emit(
																'key-up',
																e,
																this.triggerQuery,
															);
														},
														onClick: () => {
															setHighlightedIndex(null);
														},
													})}
													{...getInputProps({
														value:
															this.$data.currentValue === null
																? ''
																: this.$data.currentValue,
													})}
													themePreset={this.themePreset}
													autocomplete="off"
												/>
												{!expandSuggestionsContainer
													&& renderSuggestionsDropdown()}
											</InputWrapper>
											<ActionsContainer>
												{this.renderRightIcons()}
												{this.renderInputAddonAfter()}
												{this.renderAskButtonElement()}
												{this.renderEnterButtonElement()}
											</ActionsContainer>
										</InputGroup>
										{expandSuggestionsContainer && renderSuggestionsDropdown()}
										{this.renderTags()}
									</div>
								);
							},
						}}
					</Downshift>
				) : (
					<div class={suggestionsContainer}>
						<InputGroup searchBox ref={_inputGroupRef}>
							<ActionsContainer>
								{this.renderInputAddonBefore()}
								{this.renderLeftIcons()}
							</ActionsContainer>
							<InputWrapper>
								<TextArea
									searchBox
									class={getClassName(this.$props.innerClass, 'input') || ''}
									placeholder={this.$props.placeholder}
									on={{
										blur: (e) => {
											this.$emit('blur', e, this.triggerQuery);
										},
										keypress: (e) => {
											this.$emit('keyPress', e, this.triggerQuery);
											this.$emit('key-press', e, this.triggerQuery);
										},
										input: this.onInputChange,
										focus: (e) => {
											this.$emit('focus', e, this.triggerQuery);
										},
										keydown: this.handleKeyDown,
										keyup: (e) => {
											this.$emit('keyUp', e, this.triggerQuery);
											this.$emit('key-up', e, this.triggerQuery);
										},
									}}
									autofocus={this.$props.autoFocus}
									value={this.$data.currentValue ? this.$data.currentValue : ''}
									iconPosition={this.$props.iconPosition}
									showIcon={this.$props.showIcon}
									showClear={this.$props.showClear}
									ref={this.$props.innerRef}
									themePreset={this.themePreset}
								/>
							</InputWrapper>
							<ActionsContainer>
								{this.renderRightIcons()}
								{this.renderInputAddonAfter()}
								{this.renderEnterButtonElement()}
							</ActionsContainer>
						</InputGroup>
					</div>
				)}
			</Container>
		);
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
	isLoading: !!state.isLoading[`${props.componentId}`],
	error: state.error[props.componentId],
	time: (state.hits[props.componentId] && state.hits[props.componentId].time) || 0,
	total: state.hits[props.componentId] && state.hits[props.componentId].total,
	hidden: state.hits[props.componentId] && state.hits[props.componentId].hidden,
	AIResponse:
		(state.AIResponses[props.componentId] && state.AIResponses[props.componentId].response)
		|| null,
	isAIResponseLoading:
		state.AIResponses[props.componentId] && state.AIResponses[props.componentId].isLoading,
	AIResponseError:
		state.AIResponses[props.componentId] && state.AIResponses[props.componentId].error,
	sessionIdFromStore:
		(state.AIResponses[props.componentId]
			&& state.AIResponses[props.componentId].response
			&& state.AIResponses[props.componentId].response.sessionId)
		|| '',
	isAITyping:
		(state.AIResponses[props.componentId]
			&& state.AIResponses[props.componentId].response
			&& state.AIResponses[props.componentId].response.isTyping)
		|| false,
});
const mapDispatchToProps = {
	updateQuery,
	setCustomQuery,
	setDefaultQuery,
	recordSuggestionClick,
	recordAISessionUsefulness,
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
