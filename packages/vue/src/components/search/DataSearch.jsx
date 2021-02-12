import { Actions, helper, causes } from '@appbaseio/reactivecore';
import VueTypes from 'vue-types';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import { getQueryOptions } from '@appbaseio/reactivecore/lib/utils/helper';
import {
	connect,
	getComponent,
	hasCustomRenderer,
	isFunction,
	updateCustomQuery,
	updateDefaultQuery,
	isQueryIdentical,
	getQuerySuggestionsComponent,
	hasQuerySuggestionsRenderer,
} from '../../utils/index';
import Title from '../../styles/Title';
import Input, { suggestionsContainer, suggestions } from '../../styles/Input';
import InputIcon from '../../styles/InputIcon';
import Downshift from '../basic/DownShift.jsx';
import Container from '../../styles/Container';
import types from '../../utils/vueTypes';
import ComponentWrapper from '../basic/ComponentWrapper.jsx'
import SuggestionWrapper from './addons/SuggestionWrapper.jsx';
import SuggestionItem from './addons/SuggestionItem.jsx';
import SearchSvg from '../shared/SearchSvg';
import CancelSvg from '../shared/CancelSvg';
import Mic from './addons/Mic.jsx';

const {
	updateQuery,
	setQueryOptions,
	setCustomQuery,
	setDefaultQuery,
	setCustomHighlightOptions,
	recordSuggestionClick,
	loadPopularSuggestions,
} = Actions;
const {
	debounce,
	checkValueChange,
	getClassName,
	getOptionsFromQuery,
	isEqual,
	getCompositeAggsQuery,
	withClickIds,
	getResultStats,
	handleOnSuggestions,
	getTopSuggestions,
} = helper;

const DataSearch = {
	name: 'DataSearch',
	data() {
		const props = this.$props;
		this.__state = {
			currentValue: '',
			isOpen: false,
			normalizedSuggestions: [],
			isPending: false,
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
		const { enableQuerySuggestions, renderQuerySuggestions } = this.$props;
		// TODO: Remove in 2.0
		if (enableQuerySuggestions) {
			console.warn(
				'Warning(ReactiveSearch): The `enableQuerySuggestions` prop has been marked as deprecated, please use the `enablePopularSuggestions` prop instead.',
			);
		}
		// TODO: Remove in 2.0
		if (renderQuerySuggestions) {
			console.warn(
				'Warning(ReactiveSearch): The `renderQuerySuggestions` prop has been marked as deprecated, please use the `renderPopularSuggestions` prop instead.',
			);
		}
		this.loadPopularSuggestions(this.$props.componentId)
		this.currentValue = this.selectedValue || '';
		this.handleTextChange = debounce(value => {
			if (this.$props.autosuggest) {
				this.updateDefaultQueryHandler(value, this.$props);
			} else {
				this.updateQueryHandler(this.$props.componentId, value, this.$props);
			}
		}, this.$props.debounce);
		// Set custom and default queries in store
		updateCustomQuery(this.componentId, this.setCustomQuery, this.$props, this.currentValue);
		updateDefaultQuery(this.componentId, this.setDefaultQuery, this.$props, this.currentValue);
	},
	computed: {
		suggestionsList() {
			let suggestionsList = [];
			if (
				!this.$data.currentValue
				&& this.$props.defaultSuggestions
				&& this.$props.defaultSuggestions.length
			) {
				suggestionsList = this.$props.defaultSuggestions;
			} else if (this.$data.currentValue) {
				suggestionsList = this.normalizedSuggestions;
			}
			return withClickIds(suggestionsList);
		},
		topSuggestions() {
			const { enableQuerySuggestions, enablePopularSuggestions, showDistinctSuggestions } = this.$props;
			return enableQuerySuggestions || enablePopularSuggestions
				? getTopSuggestions(
					// use default popular suggestions if value is empty
					this.currentValue ? this.querySuggestions : this.defaultPopularSuggestions,
					this.currentValue,
					showDistinctSuggestions,
				  )
				: [];
		},
		hasCustomRenderer() {
			return hasCustomRenderer(this);
		},
		stats() {
			return getResultStats(this);
		},
	},
	props: {
		options: types.options,
		autoFocus: types.bool,
		autosuggest: VueTypes.bool.def(true),
		beforeValueChange: types.func,
		className: VueTypes.string.def(''),
		clearIcon: types.children,
		componentId: types.stringRequired,
		customHighlight: types.func,
		customQuery: types.func,
		defaultQuery: types.func,
		dataField: VueTypes.oneOfType([VueTypes.string, VueTypes.arrayOf(VueTypes.string)]),
		aggregationField: types.string,
		size: VueTypes.number.def(10),
		debounce: VueTypes.number.def(0),
		defaultValue: types.string,
		excludeFields: types.excludeFields.def([]),
		value: types.value,
		defaultSuggestions: types.suggestions,
		enableSynonyms: types.bool.def(true),
		enableQuerySuggestions: VueTypes.bool.def(false),
		enablePopularSuggestions: VueTypes.bool.def(false),
		fieldWeights: types.fieldWeights,
		filterLabel: types.string,
		fuzziness: types.fuzziness,
		highlight: types.bool,
		highlightField: types.stringOrArray,
		icon: types.children,
		iconPosition: VueTypes.oneOf(['left', 'right']).def('left'),
		includeFields: types.includeFields.def(['*']),
		innerClass: types.style,
		innerRef: types.string,
		render: types.func,
		renderQuerySuggestions: types.func,
		renderPopularSuggestions: types.func,
		parseSuggestion: types.func,
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
		//	mic props
		showVoiceSearch: types.bool.def(false),
		getMicInstance: types.func,
		renderMic: types.func,
	},
	beforeMount() {
		if (this.$props.highlight) {
			if (this.customHighlight && typeof this.customHighlight === 'function') {
				this.setCustomHighlightOptions(this.componentId, this.customHighlight(this.$props));
			}
			const queryOptions = DataSearch.highlightQuery(this.$props) || {};
			this.queryOptions = { ...queryOptions, ...this.getBasicQueryOptions() };
			this.setQueryOptions(this.$props.componentId, this.queryOptions);
		} else {
			this.queryOptions = this.getBasicQueryOptions();
			this.setQueryOptions(this.$props.componentId, this.queryOptions);
		}

		if (this.selectedValue) {
			this.setValue(this.selectedValue, true);
		} else if (this.$props.value) {
			this.setValue(this.$props.value, true);
		} else if (this.$props.defaultValue) {
			this.setValue(this.$props.defaultValue, true);
		}
	},
	watch: {
		highlight() {
			this.updateQueryOptions();
		},
		dataField() {
			this.updateQueryOptions();
			this.updateQueryHandler(this.$props.componentId, this.$data.currentValue, this.$props);
		},
		highlightField() {
			this.updateQueryOptions();
		},
		fieldWeights() {
			this.updateQueryHandler(this.$props.componentId, this.$data.currentValue, this.$props);
		},
		fuzziness() {
			this.updateQueryHandler(this.$props.componentId, this.$data.currentValue, this.$props);
		},
		queryFormat() {
			this.updateQueryHandler(this.$props.componentId, this.$data.currentValue, this.$props);
		},
		defaultValue(newVal) {
			this.setValue(newVal, true, this.$props);
		},
		value(newVal, oldVal) {
			if (!isEqual(newVal, oldVal)) {
				this.setValue(newVal, true, this.$props, undefined, false);
			}
		},
		defaultQuery(newVal, oldVal) {
			if (!isQueryIdentical(newVal, oldVal, this.$data.currentValue, this.$props)) {
				this.updateDefaultQueryHandler(this.$data.currentValue, this.$props);
			}
		},
		customQuery(newVal, oldVal) {
			if (!isQueryIdentical(newVal, oldVal, this.$data.currentValue, this.$props)) {
				this.updateQueryHandler(this.componentId, this.$data.currentValue, this.$props);
			}
		},
		suggestions(newVal) {
			if (Array.isArray(newVal) && this.$data.currentValue.trim().length) {
				// shallow check allows us to set suggestions even if the next set
				// of suggestions are same as the current one
				this.$emit('suggestions', newVal);
				this.normalizedSuggestions = this.onSuggestions(newVal);
			}
		},
		selectedValue(newVal, oldVal) {
			if (oldVal !== newVal && this.$data.currentValue !== newVal) {
				this.setValue(newVal || '', true, this.$props);
			}
		},
	},
	methods: {
		validateDataField() {
			const propName = 'dataField';
			const componentName = DataSearch.name;
			const props = this.$props;
			const requiredError = `${propName} supplied to ${componentName} is required. Validation failed.`;
			const propValue = props[propName];
			if (this.config && !this.config.enableAppbase) {
				if (!propValue) {
					console.error(requiredError);
					return;
				}
				if (typeof propValue !== 'string' && !Array.isArray(propValue)) {
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
		updateQueryOptions() {
			if (this.customHighlight && typeof this.customHighlight === 'function') {
				this.setCustomHighlightOptions(this.componentId, this.customHighlight(this.$props));
			}
			const queryOptions = DataSearch.highlightQuery(this.$props) || {};
			this.queryOptions = { ...queryOptions, ...this.getBasicQueryOptions() };
			this.setQueryOptions(this.$props.componentId, this.queryOptions);
		},
		getComponent(downshiftProps = {}, isQuerySuggestionsRender = false) {
			const { currentValue } = this.$data;
			const data = {
				error: this.error,
				loading: this.isLoading,
				downshiftProps,
				data: this.suggestionsList,
				promotedData: this.promotedResults,
				aggregationData: this.aggregationData,
				rawData: this.rawData,
				customData: this.customData,
				value: currentValue,
				triggerClickAnalytics: this.triggerClickAnalytics,
				resultStats: this.stats,
				querySuggestions: this.topSuggestions,
				popularSuggestions: this.topSuggestions,
			};
			if (isQuerySuggestionsRender) {
				return getQuerySuggestionsComponent(
					{
						downshiftProps,
						data: this.topSuggestions,
						value: currentValue,
						loading: this.isLoading,
						error: this.error,
					},
					this,
				);
			}
			return getComponent(data, this);
		},
		// returns size and aggs property
		getBasicQueryOptions() {
			const { aggregationField } = this.$props;
			const queryOptions = getQueryOptions(this.$props);
			if (aggregationField) {
				queryOptions.aggs = getCompositeAggsQuery({
					props: this.$props, showTopHits:  true
				}).aggs;
			}
			return queryOptions;
		},
		onSuggestions(results) {
			return handleOnSuggestions(results, this.$data.currentValue, this);
		},
		handleSearchIconClick() {
			const { currentValue } = this;
			if (currentValue.trim()) {
				this.isPending = false;
				this.setValue(currentValue, true);
				this.onValueSelectedHandler(currentValue, causes.SEARCH_ICON_CLICK);
			}
		},
		setValue(value, isDefaultValue = false, props = this.$props, cause, toggleIsOpen = true) {
			const performUpdate = () => {
				this.currentValue = value;
				if (isDefaultValue) {
					if (this.$props.autosuggest) {
						if (toggleIsOpen) {
							this.isOpen = false;
						}
						this.updateDefaultQueryHandler(value, this.$props);
					} // in case of strict selection only SUGGESTION_SELECT should be able
					// to set the query otherwise the value should reset

					if (props.strictSelection) {
						if (cause === causes.SUGGESTION_SELECT || value === '') {
							this.updateQueryHandler(props.componentId, value, props);
						} else {
							this.setValue('', true);
						}
					} else {
						this.updateQueryHandler(props.componentId, value, props);
					}
				} else {
					// debounce for handling text while typing
					this.handleTextChange(value);
				}

				this.$emit('valueChange', value);
				this.$emit('value-change', value);
				// Set the already fetched suggestions if query is same as used last to fetch the hits
				if (value === this.lastUsedQuery) {
					this.suggestions = this.onSuggestions(this.suggestions);
					// invoke on suggestions
					this.$emit('suggestions', this.suggestions);
				} else if(!value) {
					// reset suggestions
					this.suggestions = [];
					// invoke on suggestions
					this.$emit('suggestions', this.suggestions);
				}
			};

			checkValueChange(props.componentId, value, props.beforeValueChange, performUpdate);
		},
		updateDefaultQueryHandler(value, props) {
			let defaultQueryOptions;
			let query = DataSearch.defaultQuery(value, props);
			if (this.defaultQuery) {
				const defaultQueryToBeSet = this.defaultQuery(value, props) || {};
				if (defaultQueryToBeSet.query) {
					({ query } = defaultQueryToBeSet);
				}
				defaultQueryOptions = getOptionsFromQuery(defaultQueryToBeSet);
				// Update calculated default query in store
				updateDefaultQuery(props.componentId, this.setDefaultQuery, props, value);
			}
			this.setQueryOptions(this.internalComponent, {
				...this.queryOptions,
				...defaultQueryOptions,
			});
			this.updateQuery({
				componentId: this.internalComponent,
				query,
				value,
				componentType: componentTypes.dataSearch,
			});
		},
		updateQueryHandler(componentId, value, props) {
			const { customQuery, filterLabel, showFilter, URLParams } = props;

			let customQueryOptions;
			const defaultQueryTobeSet = DataSearch.defaultQuery(value, props);
			let query = defaultQueryTobeSet;
			if (customQuery) {
				const customQueryTobeSet = customQuery(value, props);
				const queryTobeSet = customQueryTobeSet.query;
				if (queryTobeSet) {
					query = queryTobeSet;
				}
				customQueryOptions = getOptionsFromQuery(customQueryTobeSet);
				updateCustomQuery(props.componentId, this.setCustomQuery, props, value);
				this.setQueryOptions(componentId, {
					...this.queryOptions,
					...customQueryOptions,
				});
			}
			if (!this.isPending) {
				this.updateQuery({
					componentId,
					query,
					value,
					label: filterLabel,
					showFilter,
					URLParams,
					componentType: 'DATASEARCH',
				});
			}
		},
		// need to review
		handleFocus(event) {
			this.isOpen = true;

			if (this.$props.onFocus) {
				this.$emit('focus', event);
			}
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
				this.isPending = false;
				this.setValue(results[0][0].transcript.trim(), true);
				if (this.$props.autosuggest) {
					this.isOpen = true;
				}
			}
		},
		triggerQuery() {
			const { value } = this.$props;
			if (value !== undefined) {
				this.isPending = false;
				this.setValue(this.$props.value, true);
			}
		},
		triggerClickAnalytics(searchPosition, documentId) {
			// click analytics would only work client side and after javascript loads
			let docId = documentId;
			if (!docId) {
				const hitData = this.suggestionsList.find(hit => hit._click_id === searchPosition);
				if (hitData && hitData.source && hitData.source._id) {
					docId = hitData.source._id;
				}
			}
			this.recordSuggestionClick(searchPosition, docId);
		},

		clearValue() {
			this.isPending = false;
			this.setValue('', true);
			this.onValueSelectedHandler(null, causes.CLEAR_VALUE);
		},

		handleKeyDown(event, highlightedIndex) {
			const { value } = this.$props;
			if (value !== undefined) {
				this.isPending = true;
			}

			// if a suggestion was selected, delegate the handling to suggestion handler
			if (event.key === 'Enter' && highlightedIndex === null) {
				this.setValue(event.target.value, true);
				this.onValueSelectedHandler(event.target.value, causes.ENTER_PRESS);
			}
			// Need to review
			if (this.$props.onKeyDown) {
				// TODO: Remove camelCase events in 2.0
				this.$emit('keyDown', event, this.triggerQuery);
				this.$emit('key-down', event, this.triggerQuery);
			}
		},

		onInputChange(e) {
			const { value: inputValue } = e.target;

			if (!this.$data.isOpen) {
				this.isOpen = true;
			}

			const { value } = this.$props;
			if (value === undefined) {
				this.setValue(inputValue);
			} else {
				this.isPending = true;
				this.$emit('change', inputValue, this.triggerQuery, e);
			}
		},

		onSuggestionSelected(suggestion) {
			const { value } = this.$props;
			// Record analytics for selected suggestions
			this.triggerClickAnalytics(suggestion._click_id);
			if (value === undefined) {
				this.setValue(suggestion.value, true, this.$props, causes.SUGGESTION_SELECT);
			} else {
				this.$emit('change', suggestion.value, this.triggerQuery);
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
					{currentValue && showClear && (
						<InputIcon
							onClick={this.clearValue}
							iconPosition="right"
							clearIcon={iconPosition === 'right'}
							showIcon={showIcon}
							isClearIcon
						>
							{this.renderCancelIcon()}
						</InputIcon>
					)}
					{showVoiceSearch && (
						<Mic
							getInstance={getMicInstance}
							render={renderMic}
							iconPosition={iconPosition}
							handleResult={this.handleVoiceResults}
							className={getClassName(innerClass, 'mic') || null}
							applyClearStyle={!!currentValue && showClear}
							showIcon={showIcon}
						/>
					)}
					<InputIcon
						onClick={this.handleSearchIconClick}
						showIcon={showIcon}
						iconPosition={iconPosition}
					>
						{this.renderIcon()}
					</InputIcon>
				</div>
			);
		},
	},
	render() {
		const { theme, size } = this.$props;
		const hasSuggestions = this.suggestionsList.length || this.topSuggestions.length;
		return (
			<Container class={this.$props.className}>
				{this.$props.title && (
					<Title class={getClassName(this.$props.innerClass, 'title') || ''}>
						{this.$props.title}
					</Title>
				)}
				{this.$props.defaultSuggestions || this.$props.autosuggest ? (
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
							}) => (
								<div class={suggestionsContainer}>
									<Input
										id={`${this.$props.componentId}-input`}
										showIcon={this.$props.showIcon}
										showClear={this.$props.showClear}
										iconPosition={this.$props.iconPosition}
										ref={this.$props.innerRef}
										class={getClassName(this.$props.innerClass, 'input')}
										placeholder={this.$props.placeholder}
										{...{
											on: getInputEvents({
												onInput: this.onInputChange,
												onBlur: e => {
													this.$emit('blur', e, this.triggerQuery);
												},
												onFocus: this.handleFocus,
												onKeyPress: e => {
													this.$emit('keyPress', e, this.triggerQuery);
													this.$emit('key-press', e, this.triggerQuery);
												},
												onKeyDown: e =>
													this.handleKeyDown(e, highlightedIndex),
												onKeyUp: e => {
													this.$emit('keyUp', e, this.triggerQuery);
													this.$emit('key-up', e, this.triggerQuery);
												},
												onClick: e => {
													setHighlightedIndex(null);
												}
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
										autocomplete='off'
									/>
									{this.renderIcons()}
									{this.hasCustomRenderer
										&& this.getComponent({
											isOpen,
											getItemProps,
											getItemEvents,
											highlightedIndex,
										})}
									{this.renderErrorComponent()}
									{!this.hasCustomRenderer
									&& isOpen
									&& hasSuggestions ? (
											<ul
												class={`${suggestions(
													this.themePreset,
													theme,
												)} ${getClassName(this.$props.innerClass, 'list')}`}
											>
												{this.suggestionsList
													.slice(0, size)
													.map((item, index) => (
														<li
															{...{
																domProps: getItemProps({ item }),
															}}
															{...{
																on: getItemEvents({
																	item,
																}),
															}}
															key={`${index
															+ 1
															+ this.topSuggestions.length}-${
																item.value
															}`}
															style={{
																backgroundColor: this.getBackgroundColor(
																	highlightedIndex,
																	index + this.topSuggestions.length,
																),
															}}
														>
															<SuggestionItem
																currentValue={this.currentValue}
																suggestion={item}
															/>
														</li>
													))}
												{hasQuerySuggestionsRenderer(this)
													? this.getComponent(
														{
															isOpen,
															getItemProps,
															getItemEvents,
															highlightedIndex,
														},
														true,
												  )
													: this.topSuggestions.map((sugg, index) => (
														<li
															{...{
																domProps: getItemProps({
																	item: sugg,
																}),
															}}
															{...{
																on: getItemEvents({
																	item: sugg,
																}),
															}}
															key={`${index + 1}-${sugg.value}`}
															style={{
																backgroundColor: this.getBackgroundColor(
																	highlightedIndex,
																	index,
																),
															}}
														>
															<SuggestionItem
																currentValue={this.currentValue}
																suggestion={sugg}
															/>
														</li>
												  ))}
											</ul>
										) : (
											this.renderNoSuggestions(this.suggestionsList)
										)}{' '}
								</div>
							),
						}}
					/>
				) : (
					<div class={suggestionsContainer}>
						<Input
							class={getClassName(this.$props.innerClass, 'input') || ''}
							placeholder={this.$props.placeholder}
							{...{
								on: {
									blur: e => {
										this.$emit('blur', e, this.triggerQuery);
									},
									keypress: e => {
										this.$emit('keyPress', e, this.triggerQuery);
										this.$emit('key-press', e, this.triggerQuery);
									},
									input: this.onInputChange,
									focus: e => {
										this.$emit('focus', e, this.triggerQuery);
									},
									keydown: e => {
										this.$emit('keyDown', e, this.triggerQuery);
										this.$emit('key-down', e, this.triggerQuery);
									},
									keyup: e => {
										this.$emit('keyUp', e, this.triggerQuery);
										this.$emit('key-up', e, this.triggerQuery);
									},
								},
							}}
							{...{
								domProps: {
									autofocus: this.$props.autoFocus,
									value: this.$data.currentValue ? this.$data.currentValue : '',
								},
							}}
							iconPosition={this.$props.iconPosition}
							showIcon={this.$props.showIcon}
							showClear={this.$props.showClear}
							innerRef={this.$props.innerRef}
							themePreset={this.themePreset}
						/>
						{this.renderIcons()}
					</div>
				)}
			</Container>
		);
	},
};

DataSearch.defaultQuery = (value, props) => {
	let finalQuery = null;
	let fields;

	if (value) {
		if (Array.isArray(props.dataField)) {
			fields = props.dataField;
		} else {
			fields = [props.dataField];
		}
		finalQuery = {
			bool: {
				should: DataSearch.shouldQuery(value, fields, props),
				minimum_should_match: '1',
			},
		};
	}

	if (value === '') {
		finalQuery = null;
	}

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
DataSearch.shouldQuery = (value, dataFields, props) => {
	const finalQuery = [];
	const phrasePrefixFields = [];
	const fields = dataFields.map((field, index) => {
		const queryField = `${field}${
			Array.isArray(props.fieldWeights) && props.fieldWeights[index]
				? `^${props.fieldWeights[index]}`
				: ''
		}`;
		if (
			!(
				field.endsWith('.keyword')
				|| field.endsWith('.autosuggest')
				|| field.endsWith('.search')
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
DataSearch.highlightQuery = props => {
	if (props.customHighlight) {
		return props.customHighlight(props);
	}
	if (!props.highlight) {
		return null;
	}
	const fields = {};
	const highlightField = props.highlightField ? props.highlightField : props.dataField;

	if (typeof highlightField === 'string') {
		fields[highlightField] = {};
	} else if (Array.isArray(highlightField)) {
		highlightField.forEach(item => {
			fields[item] = {};
		});
	}

	return {
		highlight: {
			pre_tags: ['<mark>'],
			post_tags: ['</mark>'],
			fields,
			...(props.highlightField && { require_field_match: false }),
		},
	};
};

const mapStateToProps = (state, props) => ({
	selectedValue:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value)
		|| null,
	suggestions: state.hits[props.componentId] && state.hits[props.componentId].hits,
	rawData: state.rawData[props.componentId],
	aggregationData: state.compositeAggregations[props.componentId] || [],
	isLoading: !!state.isLoading[`${props.componentId}_active`],
	themePreset: state.config.themePreset,
	error: state.error[props.componentId],
	analytics: state.analytics,
	config: state.config,
	headers: state.appbaseRef.headers,
	promotedResults: state.promotedResults[props.componentId] || [],
	customData: state.customData[props.componentId],
	time: (state.hits[props.componentId] && state.hits[props.componentId].time) || 0,
	total: state.hits[props.componentId] && state.hits[props.componentId].total,
	hidden: state.hits[props.componentId] && state.hits[props.componentId].hidden,
	querySuggestions: state.querySuggestions[props.componentId],
	defaultPopularSuggestions: state.defaultPopularSuggestions[props.componentId],
	componentProps: state.props[props.componentId],
	lastUsedQuery: state.queryToHits[props.componentId],
});
const mapDispatchToProps = {
	setQueryOptions,
	updateQuery,
	setCustomQuery,
	setDefaultQuery,
	setCustomHighlightOptions,
	recordSuggestionClick,
	loadPopularSuggestions
};
const DSConnected = ComponentWrapper(connect(mapStateToProps, mapDispatchToProps)(DataSearch), {
	componentType: componentTypes.dataSearch,
	internalComponent: true
});

DataSearch.install = function(Vue) {
	Vue.component(DataSearch.name, DSConnected);
};
// Add componentType for SSR
DataSearch.componentType = componentTypes.dataSearch;

export default DataSearch;
