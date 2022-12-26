import { Actions, helper, causes } from '@appbaseio/reactivecore';
import VueTypes from 'vue-types';
import hotkeys from 'hotkeys-js';
import {
	componentTypes,
	SEARCH_COMPONENTS_MODES,
} from '@appbaseio/reactivecore/lib/utils/constants';
import { getQueryOptions, suggestionTypes } from '@appbaseio/reactivecore/lib/utils/helper';
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
import Input, { suggestionsContainer, suggestions } from '../../styles/Input';
import IconGroup from '../../styles/IconGroup';
import IconWrapper from '../../styles/IconWrapper';
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

const { updateQuery, setCustomQuery, setDefaultQuery, recordSuggestionClick } = Actions;
const {
	debounce,
	checkValueChange,
	getClassName,
	isEqual,
	getCompositeAggsQuery,
	withClickIds,
	getResultStats,
	normalizeDataField,
} = helper;

const SearchBox = {
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
		const { distinctField, distinctFieldConfig, index, mode } = this.$props;
		if (mode === SEARCH_COMPONENTS_MODES.TAG) {
			this.$options.isTagsMode = true;
		}

		if (this.$options.isTagsMode) {
			console.warn(
				'Warning(ReactiveSearch): The `categoryField` prop is not supported when `mode` prop is set to `tag`',
			);
		}

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

		this.currentValue = decodeHtml(this.selectedValue || this.value || this.defaultValue || '');
		if (this.$options.isTagsMode) {
			this.currentValue = '';
		}
		this.handleTextChange = debounce(this.handleText, this.$props.debounce);

		// Set custom and default queries in store
		this.triggerCustomQuery(this.currentValue, this.selectedCategory);
		this.triggerDefaultQuery(this.currentValue);
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
		theme: types.style,
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
	beforeMount() {
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
	mounted() {
		this.listenForFocusShortcuts();
	},
	watch: {
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
				// if (this.$props.value === undefined) {
				if (this.$options.isTagsMode) {
					// handling reset of tags through SelectedFilters or URL
					this.selectedTags = [];
				}
				let cause = !newVal ? causes.CLEAR_VALUE : undefined;
				if (this.$options.isTagsMode) {
					cause = causes.SUGGESTION_SELECT;
				}
				this.setValue(newVal || '', true, this.$props, cause);
				// }
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
	},
	methods: {
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
		validateDataField() {
			const propName = 'dataField';
			const componentName = SearchBox.name;
			const props = this.$props;
			const requiredError = `${propName} supplied to ${componentName} is required. Validation failed.`;
			const propValue = props[propName];
			if (!this.enableAppbase) {
				if (!propValue) {
					console.error(requiredError);
					return;
				}
				if (
					typeof propValue !== 'string'
					&& typeof propValue !== 'object'
					&& !Array.isArray(propValue)
				) {
					console.error(
						`Invalid ${propName} supplied to ${componentName}. Validation failed.`,
					);
					return;
				}
				if (Array.isArray(propValue) && propValue.length === 0) {
					console.error(requiredError);
				}
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
			};
			return getComponent(data, this);
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
							const mergedArray = Array.from(
								new Set([...this.selectedTags, ...value]),
							);
							this.selectedTags = mergedArray;
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

				if (isDefaultValue) {
					if (this.$props.autosuggest) {
						if (toggleIsOpen) {
							this.isOpen = false;
						}
						if (typeof this.currentValue === 'string')
							this.triggerDefaultQuery(this.currentValue);
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
							);
						} else {
							this.setValue('', true);
						}
					} else if (
						props.value === undefined
						|| cause === causes.SUGGESTION_SELECT
						|| cause === causes.CLEAR_VALUE
					) {
						this.triggerCustomQuery(
							queryHandlerValue,
							this.$options.isTagsMode ? undefined : categoryValue,
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
		triggerDefaultQuery(paramValue) {
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
			this.updateQuery({
				componentId: this.internalComponent,
				query,
				value,
				componentType: componentTypes.searchBox,
			});
		},
		triggerCustomQuery(paramValue, categoryValue = undefined) {
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
			this.updateQuery({
				componentId: this.$props.componentId,
				query,
				value,
				label: filterLabel,
				showFilter,
				URLParams,
				componentType: componentTypes.searchBox,
				category: categoryValue,
			});
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
			this.setValue('', false, this.$props, causes.CLEAR_VALUE, false);
			this.onValueSelectedHandler('', causes.CLEAR_VALUE);
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
					);
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

			const { value } = this.$props;
			if (value === undefined) {
				this.setValue(
					inputValue,
					false,
					this.$props,
					inputValue === '' ? causes.CLEAR_VALUE : undefined,
				);
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

		onSuggestionSelected(suggestion) {
			this.isOpen = false;
			const { value } = this.$props;
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

		renderErrorComponent() {
			const renderError = this.$scopedSlots.renderError || this.$props.renderError;
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
			const { theme, innerClass } = this.$props;
			const renderNoSuggestion
				= this.$scopedSlots.renderNoSuggestion || this.$props.renderNoSuggestion;
			const renderError = this.$scopedSlots.renderError || this.$props.renderError;
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
						theme={theme}
						innerClassName="noSuggestion"
						scopedSlots={{
							default: () =>
								typeof renderNoSuggestion === 'function'
									? renderNoSuggestion(currentValue)
									: renderNoSuggestion,
						}}
					/>
				);
			}
			return null;
		},
		renderInputAddonBefore() {
			const { addonBefore } = this.$scopedSlots;
			if (addonBefore) {
				return <InputAddon class="addon-before">{addonBefore()}</InputAddon>;
			}

			return null;
		},
		renderInputAddonAfter() {
			const { addonAfter } = this.$scopedSlots;
			if (addonAfter) {
				return <InputAddon class="addon-after">{addonAfter()}</InputAddon>;
			}

			return null;
		},
		enterButtonOnClick() {
			this.triggerQuery({ isOpen: false, value: this.currentValue, customQuery: true });
		},
		renderEnterButtonElement() {
			const { enterButton, innerClass } = this.$props;
			const { renderEnterButton } = this.$scopedSlots;

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
		renderIcons() {
			const {
				iconPosition,
				showClear,
				innerClass,
				getMicInstance,
				showVoiceSearch,
				showIcon,
			} = this.$props;
			const renderMic = this.$scopedSlots.renderMic || this.$props.renderMic;
			const { currentValue } = this.$data;
			return (
				<div>
					<IconGroup groupPosition="right" positionType="absolute">
						{currentValue && showClear && (
							<IconWrapper onClick={this.clearValue} showIcon={showIcon} isClearIcon>
								{this.renderCancelIcon()}
							</IconWrapper>
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

					<IconGroup groupPosition="left" positionType="absolute">
						{iconPosition === 'left' && showIcon && (
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

			this.$refs?.[this.$props.innerRef]?.focus(); // eslint-disable-line
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
		renderAutoFill(suggestion) {
			const handleAutoFillClick = (e) => {
				e.stopPropagation();
				this.onAutofillClick(suggestion);
			};
			/* 👇 avoid showing autofill for category suggestions👇 */
			return suggestion._category ? null : <AutofillSvg onClick={handleAutoFillClick} />;
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
				= this.$scopedSlots.renderSelectedTags || this.$props.renderSelectedTags;

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
	},
	render() {
		const { theme, expandSuggestionsContainer } = this.$props;
		const { recentSearchesIcon, popularSearchesIcon } = this.$scopedSlots;
		const hasSuggestions
			= Array.isArray(this.normalizedSuggestions) && this.normalizedSuggestions.length;
		const renderItem = this.$scopedSlots.renderItem || this.$props.renderItem;
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
						scopedSlots={{
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
									const getIcon = (iconType) => {
										switch (iconType) {
											case suggestionTypes.Recent:
												return recentSearchesIcon;
											case suggestionTypes.Popular:
												return popularSearchesIcon;
											default:
												return null;
										}
									};
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
														theme,
													)} ${getClassName(
														this.$props.innerClass,
														'list',
													)}`}
												>
													{this.normalizedSuggestions.map((item, index) =>
														renderItem ? (
															<li
																{...{
																	domProps: getItemProps({
																		item,
																	}),
																}}
																{...{
																	on: getItemEvents({
																		item,
																	}),
																}}
																key={`${index + 1}-${item.value}`}
																style={{
																	backgroundColor:
																		this.getBackgroundColor(
																			highlightedIndex,
																			index,
																		),
																	justifyContent: 'flex-start',
																	alignItems: 'center',
																}}
															>
																{renderItem(item)}
															</li>
														) : (
															<li
																{...{
																	domProps: getItemProps({
																		item,
																	}),
																}}
																{...{
																	on: getItemEvents({
																		item,
																	}),
																}}
																key={`${index + 1}-${item.value}`}
																style={{
																	backgroundColor:
																		this.getBackgroundColor(
																			highlightedIndex,
																			index,
																		),
																	justifyContent: 'flex-start',
																	alignItems: 'center',
																}}
															>
																<div
																	style={{
																		padding: '0 10px 0 0',
																		display: 'flex',
																	}}
																>
																	<CustomSvg
																		className={
																			getClassName(
																				this.$props
																					.innerClass,
																				`${item._suggestion_type}-search-icon`,
																			) || null
																		}
																		icon={getIcon(
																			item._suggestion_type,
																		)}
																		type={`${item._suggestion_type}-search-icon`}
																	/>
																</div>
																<SuggestionItem
																	currentValue={this.currentValue}
																	suggestion={item}
																/>
																{this.renderAutoFill(item)}
															</li>
														),
													)}
												</ul>
											) : (
												this.renderNoSuggestions(this.normalizedSuggestions)
											)}
										</div>
									);
								};
								return (
									<div class={suggestionsContainer}>
										<InputGroup>
											{this.renderInputAddonBefore()}
											<InputWrapper>
												<Input
													id={`${this.$props.componentId}-input`}
													showIcon={this.$props.showIcon}
													showClear={this.$props.showClear}
													iconPosition={this.$props.iconPosition}
													ref={this.$props.innerRef}
													class={getClassName(
														this.$props.innerClass,
														'input',
													)}
													placeholder={this.$props.placeholder}
													autoFocus={this.$props.autoFocus}
													{...{
														on: getInputEvents({
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
																this.handleKeyDown(
																	e,
																	highlightedIndex,
																),
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
														}),
													}}
													{...{
														domProps: getInputProps({
															value:
																this.$data.currentValue === null
																	? ''
																	: this.$data.currentValue,
														}),
													}}
													themePreset={this.themePreset}
													autocomplete="off"
												/>
												{this.renderIcons()}
												{!expandSuggestionsContainer
													&& renderSuggestionsDropdown()}
											</InputWrapper>
											{this.renderInputAddonAfter()}
											{this.renderEnterButtonElement()}
										</InputGroup>
										{expandSuggestionsContainer && renderSuggestionsDropdown()}
										{this.renderTags()}
									</div>
								);
							},
						}}
					/>
				) : (
					<div class={suggestionsContainer}>
						<InputGroup>
							{this.renderInputAddonBefore()}
							<InputWrapper>
								<Input
									class={getClassName(this.$props.innerClass, 'input') || ''}
									placeholder={this.$props.placeholder}
									{...{
										on: {
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
										},
									}}
									{...{
										domProps: {
											autofocus: this.$props.autoFocus,
											value: this.$data.currentValue
												? this.$data.currentValue
												: '',
										},
									}}
									iconPosition={this.$props.iconPosition}
									showIcon={this.$props.showIcon}
									showClear={this.$props.showClear}
									ref={this.$props.innerRef}
									themePreset={this.themePreset}
								/>
								{this.renderIcons()}
							</InputWrapper>
							{this.renderInputAddonAfter()}
							{this.renderEnterButtonElement()}
						</InputGroup>
					</div>
				)}
			</Container>
		);
	},
	destroyed() {
		document.removeEventListener('keydown', this.onKeyDown);
	},
};

SearchBox.defaultQuery = (value, props) => {
	let finalQuery = null;

	const fields = normalizeDataField(props.dataField, props.fieldWeights);
	finalQuery = {
		bool: {
			should: SearchBox.shouldQuery(value, fields, props),
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
SearchBox.shouldQuery = (value, dataFields, props) => {
	const finalQuery = [];
	const phrasePrefixFields = [];
	const fields = dataFields.map((dataField) => {
		const queryField = `${dataField.field}${dataField.weight ? `^${dataField.weight}` : ''}`;
		if (
			!(
				dataField.field.endsWith('.keyword')
				|| dataField.field.endsWith('.autosuggest')
				|| dataField.field.endsWith('.search')
			)
		) {
			phrasePrefixFields.push(queryField);
		}
		return queryField;
	});
	if (props.searchOperators || props.queryString) {
		return {
			query: value,
			fields,
			default_operator: props.queryFormat,
		};
	}

	if (props.queryFormat === 'and') {
		finalQuery.push({
			multi_match: {
				query: value,
				fields,
				type: 'cross_fields',
				operator: 'and',
			},
		});
		finalQuery.push({
			multi_match: {
				query: value,
				fields,
				type: 'phrase',
				operator: 'and',
			},
		});
		if (phrasePrefixFields.length > 0) {
			finalQuery.push({
				multi_match: {
					query: value,
					fields: phrasePrefixFields,
					type: 'phrase_prefix',
					operator: 'and',
				},
			});
		}
		return finalQuery;
	}

	finalQuery.push({
		multi_match: {
			query: value,
			fields,
			type: 'best_fields',
			operator: 'or',
			fuzziness: props.fuzziness ? props.fuzziness : 0,
		},
	});

	finalQuery.push({
		multi_match: {
			query: value,
			fields,
			type: 'phrase',
			operator: 'or',
		},
	});

	if (phrasePrefixFields.length > 0) {
		finalQuery.push({
			multi_match: {
				query: value,
				fields: phrasePrefixFields,
				type: 'phrase_prefix',
				operator: 'or',
			},
		});
	}

	return finalQuery;
};

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
	enableAppbase: state.config.enableAppbase,
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
SBConnected.install = function (Vue) {
	Vue.component(SBConnected.name, SBConnected);
};
// Add componentType for SSR
SBConnected.componentType = componentTypes.searchBox;

export default SBConnected;
