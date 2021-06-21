/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { Component } from 'react';
import Downshift from 'downshift';
import { withTheme } from 'emotion-theming';
import hoistNonReactStatics from 'hoist-non-react-statics';

import {
	updateQuery,
	setQueryOptions,
	setCustomQuery,
	setDefaultQuery,
	setSuggestionsSearchValue,
	recordSuggestionClick,
	setCustomHighlightOptions,
	loadPopularSuggestions,
	getRecentSearches,
} from '@appbaseio/reactivecore/lib/actions';
import {
	debounce,
	checkValueChange,
	checkSomePropChange,
	getOptionsFromQuery,
	getClassName,
	isEqual,
	getCompositeAggsQuery,
	withClickIds,
	handleOnSuggestions,
	getResultStats,
	updateCustomQuery,
	updateDefaultQuery,
	getTopSuggestions,
	getQueryOptions,
} from '@appbaseio/reactivecore/lib/utils/helper';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import { getInternalComponentID } from '@appbaseio/reactivecore/lib/utils/transform';
import types from '@appbaseio/reactivecore/lib/utils/types';
import causes from '@appbaseio/reactivecore/lib/utils/causes';
import Title from '../../styles/Title';
import InputGroup from '../../styles/InputGroup';
import InputWrapper from '../../styles/InputWrapper';
import InputAddon from '../../styles/InputAddon';
import Input, { suggestionsContainer, suggestions } from '../../styles/Input';
import CancelSvg from '../shared/CancelSvg';
import SearchSvg from '../shared/SearchSvg';
import Container from '../../styles/Container';
import Mic from './addons/Mic';
import CustomSvg from '../shared/CustomSvg';
import {
	connect,
	isFunction,
	getComponent,
	hasCustomRenderer,
	handleCaretPosition,
	isQueryIdentical,
	hasPopularSuggestionsRenderer,
	getPopularSuggestionsComponent,
	isEmpty,
	parseFocusShortcuts,
	isNumeric,
	isHotkeyCombinationUsed,
} from '../../utils';
import SuggestionItem from './addons/SuggestionItem';
import SuggestionWrapper from './addons/SuggestionWrapper';
import ComponentWrapper from '../basic/ComponentWrapper';
import IconWrapper from '../../styles/IconWrapper';
import IconGroup from '../../styles/IconGroup';

const Text = withTheme(props => (
	<span
		className="trim"
		style={{
			color: props.primary ? props.theme.colors.primaryColor : props.theme.colors.textColor,
		}}
	>
		{props.children}
	</span>
));

class CategorySearch extends Component {
	constructor(props) {
		super(props);
		const { focusShortcuts } = props;
		const value = props.value || props.defaultValue || {};
		// eslint-disable-next-line
		let { term: currentValue = '', category: currentCategory = null } = value;
		// add preference to selected-X value from URL/SSR
		currentValue = props.selectedValue || currentValue;
		currentCategory = props.selectedCategory || currentCategory;

		this.state = {
			currentValue,
			currentCategory,
			suggestions: [],
			isOpen: false,
		};
		/**
		 * To regulate the query execution based on the input handler,
		 * the component query will only get executed when it sets to `true`.
		 * */
		this.isPending = false;

		this.internalComponent = getInternalComponentID(props.componentId);
		this.queryOptions = getQueryOptions(props);
		// Set custom and default queries in store
		updateCustomQuery(props.componentId, props, currentValue);
		updateDefaultQuery(props.componentId, props, currentValue);

		if (props.highlight) {
			const queryOptions = CategorySearch.highlightQuery(props) || {};
			if (props.customHighlight && typeof props.customHighlight === 'function') {
				props.setCustomHighlightOptions(props.componentId, props.customHighlight(props));
			}
			queryOptions.size = props.size;
			this.queryOptions = queryOptions;
			props.setQueryOptions(props.componentId, queryOptions);
		} else {
			props.setQueryOptions(props.componentId, this.queryOptions);
		}

		const aggsQuery = this.getCombinedAggsQuery();
		props.setQueryOptions(this.internalComponent, aggsQuery, false);
		const hasMounted = false;
		const cause = null;

		if (currentValue) {
			const calcValue = {
				term: currentValue,
				category: currentCategory,
			};
			if (props.onChange) {
				props.onChange(calcValue, () => this.triggerQuery(calcValue));
			}
			this.setValue(currentValue, true, props, currentCategory, cause, hasMounted);
		}

		// dynamically import hotkey-js
		if (!isEmpty(focusShortcuts)) {
			this.hotKeyCombinationsUsed = isHotkeyCombinationUsed(focusShortcuts);
			if (this.hotKeyCombinationsUsed) {
				try {
					// eslint-disable-next-line global-require
					this.hotkeys = require('hotkeys-js').default;
				} catch (err) {
					// eslint-disable-next-line no-console
					console.warn(
						'Warning(SearchBox): The `hotkeys-js` library seems to be missing, it is required when using key combinations( eg: `ctrl+a`) in focusShortcuts prop.',
					);
				}
			}
		}
	}

	componentDidUpdate(prevProps) {
		checkSomePropChange(
			this.props,
			prevProps,
			['highlight', 'dataField', 'highlightField'],
			() => {
				const queryOptions = CategorySearch.highlightQuery(this.props) || {};
				if (
					this.props.customHighlight
					&& typeof this.props.customHighlight === 'function'
				) {
					this.props.setCustomHighlightOptions(
						this.props.componentId,
						this.props.customHighlight(this.props),
					);
				}
				queryOptions.size = this.props.size;
				this.queryOptions = queryOptions;
				this.props.setQueryOptions(this.props.componentId, queryOptions);
			},
		);

		// Treat defaultQuery and customQuery as reactive props
		if (!isQueryIdentical(this.state.currentValue, this.props, prevProps, 'defaultQuery')) {
			this.updateDefaultQuery(this.state.currentValue, this.props);
			this.updateQuery(this.state.currentValue, this.props);
		}

		if (!isQueryIdentical(this.state.currentValue, this.props, prevProps, 'customQuery')) {
			this.updateQuery(this.state.currentValue, this.props);
		}

		if (Array.isArray(this.props.suggestions) && this.state.currentValue.trim().length) {
			// shallow check allows us to set suggestions even if the next set
			// of suggestions are same as the current one

			if (this.props.suggestions !== prevProps.suggestions) {
				if (this.props.onSuggestions) {
					this.props.onSuggestions(this.props.suggestions);
				}
				// eslint-disable-next-line
				this.setState({
					suggestions: this.onSuggestions(this.props.suggestions),
				});
			}
		}

		checkSomePropChange(
			this.props,
			prevProps,
			[
				'fieldWeights',
				'fuzziness',
				'queryFormat',
				'dataField',
				'categoryField',
				'nestedField',
				'searchOperators',
			],
			() => {
				this.updateQuery(this.state.currentValue, this.props);
			},
		);

		if (!isEqual(this.props.value, prevProps.value)) {
			const { term: currentValue, category: currentCategory = null } = this.props.value;
			this.setValue(
				currentValue,
				true,
				this.props,
				currentCategory,
				undefined,
				undefined,
				false,
			);
		} else if (
			// since, selectedValue will be updated when currentValue changes,
			// we must only check for the changes introduced by
			// clear action from SelectedFilters component in which case,
			// the currentValue will never match the updated selectedValue
			this.props.selectedValue !== prevProps.selectedValue
			&& this.state.currentValue !== this.props.selectedValue
		) {
			if (!this.props.selectedValue && this.state.currentValue) {
				// selected value is cleared, call onValueSelected
				this.onValueSelected('', causes.CLEAR_VALUE, null);
			}
			const { value, onChange } = this.props;
			if (value === undefined) {
				this.setValue(
					this.props.selectedValue || '',
					true,
					this.props,
					this.props.selectedCategory,
				);
			} else if (onChange) {
				const currentValue = {
					term: this.props.selectedValue || '',
					category: this.props.selectedCategory || null,
				};
				// value prop exists
				onChange(currentValue, () => this.triggerQuery(currentValue));
			} else {
				// value prop exists and onChange is not defined:
				// we need to put the current value back into the store
				// if the clear action was triggered by interacting with
				// selected-filters component
				this.isPending = false;
				this.setValue(
					this.state.currentValue,
					true,
					this.props,
					this.state.currentCategory,
				);
			}
		}
	}

	componentDidMount() {
		// listening to keydown events : globally
		document.addEventListener('keydown', this.onKeyDown);
		const {
			enableQuerySuggestions,
			renderQuerySuggestions,
			fetchPopularSuggestions,
			enableRecentSearches,
			fetchRecentSearches,
			componentId,
			aggregationField,
			config,
			distinctField,
			distinctFieldConfig,
		} = this.props;

		const { enableAppbase } = config;

		// TODO: Remove in 4.0
		if (enableQuerySuggestions !== undefined) {
			console.warn(
				'Warning(ReactiveSearch): The `enableQuerySuggestions` prop has been marked as deprecated, please use the `enablePopularSuggestions` prop instead.',
			);
		}
		// TODO: Remove in 4.0
		if (renderQuerySuggestions !== undefined) {
			console.warn(
				'Warning(ReactiveSearch): The `renderQuerySuggestions` prop has been marked as deprecated, please use the `renderPopularSuggestions` prop instead.',
			);
		}
		if (enableAppbase && aggregationField) {
			console.warn(
				'Warning(ReactiveSearch): The `aggregationField` prop has been marked as deprecated, please use the `distinctField` prop instead.',
			);
		}
		if (!enableAppbase && (distinctField || distinctFieldConfig)) {
			console.warn(
				'Warning(ReactiveSearch): In order to use the `distinctField` and `distinctFieldConfig` props, the `enableAppbase` prop must be set to true in `ReactiveBase`.',
			);
		}
		if (enableRecentSearches) {
			fetchRecentSearches();
		}
		fetchPopularSuggestions(componentId);
	}

	componentWillUnmount() {
		document.removeEventListener('keydown', this.onKeyDown);
	}

	getAggsQuery = field => ({
		aggs: {
			[field]: {
				terms: {
					field,
				},
			},
		},
	});

	getCombinedAggsQuery = () => {
		const { categoryField, aggregationField } = this.props;
		const aggsQuery = this.getAggsQuery(categoryField);
		if (aggregationField) {
			const compositeAggsQuery = getCompositeAggsQuery({
				value: null,
				props: this.props,
				showTopHits: true,
			});
			aggsQuery.aggs = { ...aggsQuery.aggs, ...compositeAggsQuery.aggs };
		}
		return aggsQuery;
	};

	static highlightQuery = (props) => {
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
			highlightField.forEach((item) => {
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

	static defaultQuery = (value, props, category) => {
		let finalQuery = null;
		let fields = [];

		if (value) {
			if (Array.isArray(props.dataField)) {
				fields = props.dataField;
			} else if (props.dataField) {
				fields = [props.dataField];
			}

			if (props.queryString) {
				finalQuery = {
					query_string: CategorySearch.shouldQuery(value, fields, props),
				};
			} else if (props.searchOperators) {
				finalQuery = {
					simple_query_string: CategorySearch.shouldQuery(value, fields, props),
				};
			} else {
				finalQuery = {
					bool: {
						should: CategorySearch.shouldQuery(value, fields, props),
						minimum_should_match: '1',
					},
				};
			}

			if (category && category !== '*') {
				finalQuery = [
					finalQuery,
					{
						term: {
							[props.categoryField]: category,
						},
					},
				];
			}
		}

		if (value === '') {
			finalQuery = null;
		}

		if (finalQuery && props.nestedField) {
			finalQuery = {
				nested: {
					path: props.nestedField,
					query: finalQuery,
				},
			};
		}

		return finalQuery;
	};

	static shouldQuery = (value, dataFields, props) => {
		const finalQuery = [];
		const phrasePrefixFields = [];
		const fields = (dataFields || []).map((field, index) => {
			const queryField = `${field}${Array.isArray(props.fieldWeights) && props.fieldWeights[index]
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

	onSuggestions = searchResults =>
		handleOnSuggestions(searchResults, this.state.currentValue, this.props);

	setValue = (
		value,
		isDefaultValue = false,
		props = this.props,
		category,
		cause,
		hasMounted = true,
		toggleIsOpen = true,
	) => {
		const performUpdate = () => {
			if (hasMounted) {
				const { enableRecentSearches, fetchRecentSearches } = this.props;
				// Refresh recent searches when value becomes empty
				if (!value && this.state.currentValue && enableRecentSearches) {
					fetchRecentSearches();
				}
				this.setState(
					{
						currentValue: value || '',
						currentCategory: category || null,
					},
					() => {
						if (isDefaultValue) {
							if (this.props.autosuggest) {
								if (toggleIsOpen) {
									this.setState({
										isOpen: false,
									});
								}
								this.updateDefaultQuery(value, props);
							}
							// in case of strict selection only SUGGESTION_SELECT should be able
							// to set the query otherwise the value should reset
							if (props.strictSelection) {
								if (cause === causes.SUGGESTION_SELECT || value === '') {
									this.updateQuery(value, props, category);
								} else {
									this.setValue('', true);
								}
							} else {
								this.updateQuery(value, props, category);
							}
						} else {
							// debounce for handling text while typing
							this.handleTextChange(value);
						}
						if (props.onValueChange) props.onValueChange(value);
					},
				);
			} else {
				this.updateDefaultQuery(value, props);
				this.updateQuery(value, props, category);
				if (props.onValueChange) props.onValueChange(value);
			}
		};
		checkValueChange(props.componentId, value, props.beforeValueChange, performUpdate);
	};

	handleTextChange = debounce((value) => {
		if (this.props.autosuggest) {
			this.updateDefaultQuery(value, this.props);
		} else {
			this.updateQuery(value, this.props);
		}
	}, this.props.debounce);

	updateDefaultQuery = (value, props, category = this.state.currentCategory) => {
		const { defaultQuery } = props;
		let defaultQueryOptions;
		let query = CategorySearch.defaultQuery(value, props, category);
		if (defaultQuery) {
			const defaultQueryTobeSet = defaultQuery(value, props, category) || {};
			if (defaultQueryTobeSet.query) {
				({ query } = defaultQueryTobeSet);
			}
			defaultQueryOptions = getOptionsFromQuery(defaultQueryTobeSet);
			// Update calculated default query in store
			updateDefaultQuery(props.componentId, props, value);
		}
		props.setSuggestionsSearchValue(value);
		const aggsQuery = this.getCombinedAggsQuery();
		props.setQueryOptions(this.internalComponent, {
			...this.queryOptions,
			...aggsQuery,
			...defaultQueryOptions,
		});
		props.updateQuery({
			componentId: this.internalComponent,
			query,
			value,
			category,
			componentType: componentTypes.categorySearch,
		});
	};

	updateQuery = (value, props, category = this.state.currentCategory) => {
		const {
			customQuery, filterLabel, showFilter, URLParams,
		} = props;

		let customQueryOptions;
		let query = CategorySearch.defaultQuery(value, props, category);
		if (customQuery) {
			const customQueryTobeSet = customQuery(value, props, category) || {};
			if (customQueryTobeSet.query) {
				({ query } = customQueryTobeSet);
			}
			customQueryOptions = getOptionsFromQuery(customQueryTobeSet);
			updateCustomQuery(props.componentId, props, value);
		}

		if (!this.isPending) {
			// execute the query on an uncontrolled component
			// query options should be applied to the source component,
			// not on internal component, hence using `this.props.componentId` here
			props.setQueryOptions(props.componentId, {
				...this.queryOptions,
				...customQueryOptions,
			});
			props.updateQuery({
				componentId: props.componentId,
				query,
				value,
				label: filterLabel,
				showFilter,
				URLParams,
				componentType: componentTypes.categorySearch,
				category,
			});
		}
	};

	handleFocus = (event) => {
		this.setState({
			isOpen: true,
		});
		if (this.props.onFocus) {
			this.props.onFocus(event, this.triggerQuery);
		}
	};

	clearValue = () => {
		this.isPending = false;
		this.setValue('', true);
		this.onValueSelected('', causes.CLEAR_VALUE, null);
	};

	handleKeyDown = (event, highlightedIndex) => {
		const { value, onChange } = this.props;
		if (value !== undefined && onChange) {
			this.isPending = true;
		}
		// if a suggestion was selected, delegate the handling to suggestion handler
		if (event.key === 'Enter' && highlightedIndex === null) {
			this.setValue(event.target.value, true);
			const currentValue = {
				term: event.target.value,
				category: null,
			};
			this.onValueSelected(currentValue, causes.ENTER_PRESS);
		}
		if (this.props.onKeyDown) {
			this.props.onKeyDown(event, this.triggerQuery);
		}
	};

	onInputChange = (e) => {
		const { value: inputValue } = e.target;
		if (!this.state.isOpen) {
			this.setState({
				isOpen: true,
			});
		}

		const { value, onChange } = this.props;
		if (value === undefined) {
			this.setValue(inputValue);
		} else if (onChange) {
			this.isPending = true;
			const currentValue = {
				term: inputValue,
				// category: null,
			};
			// handle caret position in controlled components
			handleCaretPosition(e);
			onChange(currentValue, () => this.triggerQuery(currentValue), e);
		} else {
			this.setValue(inputValue);
		}
	};

	triggerQuery = (value) => {
		const { term: currentValue, category: currentCategory = null } = value;
		this.isPending = false;
		this.setValue(currentValue, true, this.props, currentCategory);
	};

	onSuggestionSelected = (suggestion) => {
		const { value, onChange } = this.props;
		const currentValue = {
			term: suggestion.value,
			category: suggestion.category || null,
		};
		this.setState({
			isOpen: false,
		});
		if (value === undefined) {
			this.setValue(
				currentValue.term,
				true,
				this.props,
				currentValue.category,
				causes.SUGGESTION_SELECT,
			);
		} else if (onChange) {
			this.isPending = false;
			onChange(currentValue, () => this.triggerQuery(currentValue));
		}
		// Record analytics for selected suggestions
		this.triggerClickAnalytics(suggestion._click_id);
		// onValueSelected is user interaction driven:
		// it should be triggered irrespective of controlled (or)
		// uncontrolled component behavior
		this.onValueSelected(currentValue, causes.SUGGESTION_SELECT, suggestion.source);
	};

	onValueSelected = (selectedValue, cause, source) => {
		const { onValueSelected } = this.props;
		if (onValueSelected) {
			onValueSelected(selectedValue, cause, source);
		}
	};

	handleStateChange = (changes) => {
		const { isOpen, type } = changes;
		if (type === Downshift.stateChangeTypes.mouseUp && isOpen !== undefined) {
			this.setState({
				isOpen,
			});
		}
	};

	getBackgroundColor = (highlightedIndex, index) => {
		const isDark = this.props.themePreset === 'dark';
		if (isDark) {
			return highlightedIndex === index ? '#555' : '#424242';
		}
		return highlightedIndex === index ? '#eee' : '#fff';
	};

	handleSearchIconClick = () => {
		const { currentValue } = this.state;
		if (currentValue.trim()) {
			this.isPending = false;
			this.setValue(currentValue, true);
			this.onValueSelected(currentValue, causes.SEARCH_ICON_CLICK);
		}
	};

	handleVoiceResults = ({ results }) => {
		const { autosuggest } = this.props;
		if (
			results
			&& results[0]
			&& results[0].isFinal
			&& results[0][0]
			&& results[0][0].transcript
			&& results[0][0].transcript.trim()
		) {
			this.isPending = false;
			this.setValue(results[0][0].transcript.trim(), !autosuggest);
			if (autosuggest) {
				this._inputRef.focus();
				this.setState({
					isOpen: true,
				});
			}
		}
	};

	renderInputAddonBefore = () => {
		const { addonBefore } = this.props;
		if (addonBefore) {
			return <InputAddon>{addonBefore}</InputAddon>;
		}

		return null;
	};

	renderInputAddonAfter = () => {
		const { addonAfter } = this.props;
		if (addonAfter) {
			return <InputAddon>{addonAfter}</InputAddon>;
		}

		return null;
	};

	renderIcon = () => {
		if (this.props.showIcon) {
			return this.props.icon || <SearchSvg />;
		}
		return null;
	};

	renderCancelIcon = () => {
		if (this.props.showClear) {
			return this.props.clearIcon || <CancelSvg />;
		}
		return null;
	};

	renderIcons = () => {
		const {
			showIcon,
			showClear,
			renderMic,
			getMicInstance,
			showVoiceSearch,
			iconPosition,
			innerClass,
		} = this.props;

		return (
			<div>
				<IconGroup groupPosition="right" positionType="absolute">
					{this.state.currentValue && showClear && (
						<IconWrapper onClick={this.clearValue} showIcon={showIcon} isClearIcon>
							{this.renderCancelIcon()}
						</IconWrapper>
					)}
					{this.shouldMicRender(showVoiceSearch) && (
						<Mic
							getInstance={getMicInstance}
							render={renderMic}
							onResult={this.handleVoiceResults}
							className={getClassName(innerClass, 'mic') || null}
						/>
					)}
					{iconPosition === 'right' && (
						<IconWrapper onClick={this.handleSearchIconClick}>
							{this.renderIcon()}
						</IconWrapper>
					)}
				</IconGroup>

				<IconGroup groupPosition="left" positionType="absolute">
					{iconPosition === 'left' && (
						<IconWrapper onClick={this.handleSearchIconClick}>
							{this.renderIcon()}
						</IconWrapper>
					)}
				</IconGroup>
			</div>
		);
	};

	shouldMicRender(showVoiceSearch) {
		// checks for SSR
		if (typeof window === 'undefined') return false;
		return showVoiceSearch && (window.webkitSpeechRecognition || window.SpeechRecognition);
	}

	renderNoSuggestion = (finalSuggestionsList = []) => {
		const {
			themePreset,
			theme,
			isLoading,
			renderNoSuggestion,
			innerClass,
			renderError,
			error,
		} = this.props;
		const { isOpen, currentValue } = this.state;
		if (
			renderNoSuggestion
			&& isOpen
			&& !finalSuggestionsList.length
			&& !isLoading
			&& currentValue
			&& !(renderError && error)
		) {
			return (
				<SuggestionWrapper
					innerClass={innerClass}
					themePreset={themePreset}
					theme={theme}
					innerClassName="noSuggestion"
				>
					{typeof renderNoSuggestion === 'function'
						? renderNoSuggestion(currentValue)
						: renderNoSuggestion}
				</SuggestionWrapper>
			);
		}
		return null;
	};

	renderLoader = () => {
		const {
			loader, isLoading, themePreset, theme, innerClass,
		} = this.props;
		const { currentValue } = this.state;
		if (isLoading && loader && currentValue) {
			return (
				<SuggestionWrapper
					innerClass={innerClass}
					innerClassName="loader"
					theme={theme}
					themePreset={themePreset}
				>
					{loader}
				</SuggestionWrapper>
			);
		}
		return null;
	};

	renderError = () => {
		const {
			error, renderError, themePreset, theme, isLoading, innerClass,
		} = this.props;
		const { currentValue } = this.state;
		if (error && renderError && currentValue && !isLoading) {
			return (
				<SuggestionWrapper
					innerClass={innerClass}
					innerClassName="error"
					theme={theme}
					themePreset={themePreset}
				>
					{isFunction(renderError) ? renderError(error) : renderError}
				</SuggestionWrapper>
			);
		}
		return null;
	};

	getComponent = (downshiftProps = {}, isQuerySuggestionsRender = false) => {
		const {
			error,
			isLoading,
			aggregationData,
			promotedResults,
			customData,
			rawData,
		} = this.props;
		const { currentValue } = this.state;
		const data = {
			error,
			loading: isLoading,
			downshiftProps,
			data: this.parsedSuggestions,
			promotedData: promotedResults || [],
			customData: customData || {},
			rawData,
			aggregationData: aggregationData || [],
			value: currentValue,
			suggestions: this.state.suggestions,
			rawSuggestions: this.props.suggestions || [],
			categories: this.filteredCategories,
			rawCategories: this.props.categories,
			triggerClickAnalytics: this.triggerClickAnalytics,
			resultStats: this.stats,
			// TODO: Remove in v4
			querySuggestions: this.normalizedPopularSuggestions,
			popularSuggestions: this.normalizedPopularSuggestions,
			recentSearches: this.normalizedRecentSearches,
		};
		if (isQuerySuggestionsRender) {
			return getPopularSuggestionsComponent(
				{
					downshiftProps,
					data: this.normalizedPopularSuggestions,
					value: currentValue,
					loading: isLoading,
					error,
				},
				this.props,
			);
		}
		return getComponent(data, this.props);
	};

	get stats() {
		return getResultStats(this.props);
	}

	get hasCustomRenderer() {
		return hasCustomRenderer(this.props);
	}

	get filteredCategories() {
		const { categories } = this.props;
		return categories.filter(category => Boolean(category.key));
	}

	get parsedSuggestions() {
		let finalSuggestionsList = [];
		let suggestionsList = [];

		// filter out empty categories
		const filteredCategories = this.filteredCategories;

		if (
			!this.state.currentValue
			&& this.props.defaultSuggestions
			&& this.props.defaultSuggestions.length
		) {
			finalSuggestionsList = this.props.defaultSuggestions;
		} else if (this.state.currentValue) {
			suggestionsList = this.state.suggestions;
		}

		if (this.state.currentValue && this.state.suggestions.length && filteredCategories.length) {
			let categorySuggestions = [
				{
					label: `${this.state.currentValue} in all categories`,
					value: this.state.currentValue,
					category: '*',
					// no source object exists for category based suggestions
					source: null,
				},
				{
					label: `${this.state.currentValue} in ${filteredCategories[0].key}`,
					value: this.state.currentValue,
					category: filteredCategories[0].key,
					source: null,
				},
			];

			if (filteredCategories.length > 1) {
				categorySuggestions = [
					...categorySuggestions,
					{
						label: `${this.state.currentValue} in ${filteredCategories[1].key}`,
						value: this.state.currentValue,
						category: filteredCategories[1].key,
						source: null,
					},
				];
			}
			finalSuggestionsList = [...categorySuggestions, ...suggestionsList];
		}
		return withClickIds(finalSuggestionsList);
	}

	get topSuggestions() {
		const { enableQuerySuggestions, enablePopularSuggestions } = this.props;
		const { currentValue } = this.state;
		if (!currentValue) {
			return [];
		}
		return enableQuerySuggestions || enablePopularSuggestions
			? this.normalizedPopularSuggestions
			: [];
	}

	get normalizedRecentSearches() {
		const { recentSearches } = this.props;
		return recentSearches;
	}

	get normalizedPopularSuggestions() {
		const {
			popularSuggestions,
			showDistinctSuggestions,
			defaultPopularSuggestions,
		} = this.props;
		const { currentValue } = this.state;
		return getTopSuggestions(
			// use default popular suggestions if value is empty
			currentValue ? popularSuggestions : defaultPopularSuggestions,
			currentValue,
			showDistinctSuggestions,
		);
	}

	get defaultSuggestions() {
		const {
			enableQuerySuggestions,
			enablePopularSuggestions,
			showDistinctSuggestions,
			defaultPopularSuggestions,
		} = this.props;
		const isPopularSuggestionsEnabled = enableQuerySuggestions || enablePopularSuggestions;
		const { currentValue } = this.state;
		if (currentValue) {
			return [];
		}
		const customDefaultPopularSuggestions = defaultPopularSuggestions.map(suggestion => ({
			...suggestion,
			_popular_suggestion: true,
		}));
		const customNormalizedRecentSearches = this.normalizedRecentSearches.map(search => ({
			...search,
			_recent_search: true,
		}));
		const defaultSuggestions = isPopularSuggestionsEnabled
			? [...customNormalizedRecentSearches, ...customDefaultPopularSuggestions]
			: customNormalizedRecentSearches;
		return getTopSuggestions(
			// use default popular suggestions if value is empty
			defaultSuggestions,
			currentValue,
			showDistinctSuggestions,
		);
	}

	triggerClickAnalytics = (searchPosition, documentId) => {
		let docId = documentId;
		if (!docId) {
			const hitData = this.parsedSuggestions.find(hit => hit._click_id === searchPosition);
			if (hitData && hitData.source && hitData.source._id) {
				docId = hitData.source._id;
			}
		}
		this.props.triggerAnalytics(searchPosition, docId);
	};

	withTriggerQuery = (func) => {
		if (func) {
			return e => func(e, () => this.triggerQuery(this.props.value));
		}
		return undefined;
	};

	focusSearchBox = (event) => {
		const elt = event.target || event.srcElement;
		const tagName = elt.tagName;
		if (
			elt.isContentEditable
			|| tagName === 'INPUT'
			|| tagName === 'SELECT'
			|| tagName === 'TEXTAREA'
		) {
			// already in an input
			return;
		}
		this._inputRef.focus();
	};

	onKeyDown = (event) => {
		if (isEmpty(this.props.focusShortcuts)) {
			return;
		}

		// for hotkeys' combinations such as 'cmd+k', 'ctrl+shft+a', etc, we use hotkeys-js
		if (this.hotKeyCombinationsUsed) {
			this.hotkeys(
				parseFocusShortcuts(this.props.focusShortcuts).join(','),
				/* eslint-disable no-shadow */
				// eslint-disable-next-line no-unused-vars
				(event, handler) => {
					// Prevent the default refresh event under WINDOWS system
					event.preventDefault();
					this.focusSearchBox(event);
				},
			);
			return;
		}
		const shortcuts = this.props.focusShortcuts.map((key) => {
			if (typeof key === 'string') {
				return isNumeric(key) ? parseInt(key, 10) : key.toUpperCase().charCodeAt(0);
			}
			return key;
		});
		// the below algebraic expression is used to get the correct ascii code out of the
		// e.which || e.keycode returned value
		// since the keyboards doesn't understand ascii but scan codes and they differ for
		// certain keys such as '/'
		// stackoverflow ref: https://stackoverflow.com/a/29811987/10822996
		const which = event.which || event.keyCode;
		const chrCode = which - (48 * Math.floor(which / 48));
		if (shortcuts.indexOf(which >= 96 ? chrCode : which) === -1) {
			// not the right shortcut
			return;
		}
		this.focusSearchBox(event);

		event.stopPropagation();
		event.preventDefault();
	};

	render() {
		const { currentValue } = this.state;
		const {
			theme, themePreset, size, recentSearchesIcon, popularSearchesIcon,
		} = this.props;
		const finalSuggestionsList = this.parsedSuggestions;
		const hasSuggestions = currentValue
			? finalSuggestionsList.length || this.topSuggestions.length
			: this.defaultSuggestions.length;
		return (
			<Container style={this.props.style} className={this.props.className}>
				{this.props.title && (
					<Title className={getClassName(this.props.innerClass, 'title') || null}>
						{this.props.title}
					</Title>
				)}
				{this.props.defaultSuggestions || this.props.autosuggest ? (
					<Downshift
						id={`${this.props.componentId}-downshift`}
						onChange={this.onSuggestionSelected}
						onStateChange={this.handleStateChange}
						isOpen={this.state.isOpen}
						itemToString={i => i}
						render={({
							getRootProps,
							getInputProps,
							getItemProps,
							isOpen,
							highlightedIndex,
							setHighlightedIndex,
							...rest
						}) => {
							const renderSuggestionsDropdown = () => (
								<React.Fragment>
									{isOpen && this.renderLoader()}
									{isOpen && this.renderError()}
									{this.hasCustomRenderer
										&& this.getComponent({
											getInputProps,
											getItemProps,
											isOpen,
											highlightedIndex,
											setHighlightedIndex,
											...rest,
										})}

									{!this.hasCustomRenderer && isOpen && hasSuggestions ? (
										<ul
											css={suggestions(themePreset, theme)}
											className={getClassName(this.props.innerClass, 'list')}
										>
											{finalSuggestionsList
												.slice(0, size)
												.map((item, index) => (
													<li
														{...getItemProps({ item })}
														key={`${index + 1}-${item.value}`} // eslint-disable-line
														style={{
															backgroundColor: this.getBackgroundColor(
																highlightedIndex,
																index,
															),
														}}
													>
														<Text primary={!!item.category}>
															<SuggestionItem
																currentValue={currentValue}
																suggestion={item}
															/>
														</Text>
													</li>
												))}
											{this.defaultSuggestions.map((sugg, index) => (
												<li
													{...getItemProps({ item: sugg })}
													key={`${index + 1}-${sugg.value}`}
													style={{
														backgroundColor: this.getBackgroundColor(
															highlightedIndex,
															finalSuggestionsList.length + index,
														),
														justifyContent: 'flex-start',
													}}
												>
													<div style={{ padding: '0 10px 0 0' }}>
														{sugg.source
															&& sugg.source._recent_search && (
															<CustomSvg
																iconId={`${sugg.label}-icon`}
																className={
																	getClassName(
																		this.props.innerClass,
																		'recent-search-icon',
																	) || null
																}
																icon={recentSearchesIcon}
																type="recent-search-icon"
															/>
														)}
														{sugg.source
															&& sugg.source._popular_suggestion && (
															<CustomSvg
																iconId={`${sugg.label}-icon`}
																className={
																	getClassName(
																		this.props.innerClass,
																		'popular-search-icon',
																	) || null
																}
																icon={popularSearchesIcon}
																type="popular-search-icon"
															/>
														)}
													</div>
													<SuggestionItem
														currentValue={currentValue}
														suggestion={sugg}
													/>
												</li>
											))}
											{hasPopularSuggestionsRenderer(this.props)
												? this.getComponent(
													{
														getInputProps,
														getItemProps,
														isOpen,
														highlightedIndex,
														...rest,
													},
													true,
												)
												: this.topSuggestions.map((sugg, index) => (
													<li
														{...getItemProps({ item: sugg })}
														key={`${finalSuggestionsList.length
															+ index
															+ 1}-${sugg.value}`}
														style={{
															backgroundColor: this.getBackgroundColor(
																highlightedIndex,
																finalSuggestionsList.length
																+ index,
															),
															justifyContent: 'flex-start',
														}}
													>
														<div style={{ padding: '0 10px 0 0' }}>
															<CustomSvg
																iconId={`${sugg.label}-icon`}
																className={
																	getClassName(
																		this.props.innerClass,
																		'popular-search-icon',
																	) || null
																}
																icon={popularSearchesIcon}
																type="popular-search-icon"
															/>
														</div>
														<SuggestionItem
															currentValue={currentValue}
															suggestion={sugg}
														/>
													</li>
												))}
										</ul>
									) : (
										this.renderNoSuggestion(finalSuggestionsList)
									)}
								</React.Fragment>
							);

							return (
								<div
									{...getRootProps(
										{ css: suggestionsContainer },
										{ suppressRefError: true },
									)}
								>
									<InputGroup>
										{this.renderInputAddonBefore()}
										<InputWrapper>
											<Input
												ref={(c) => {
													this._inputRef = c;
												}}
												aria-label={this.props.componentId}
												showClear={this.props.showClear}
												id={`${this.props.componentId}-input`}
												showIcon={this.props.showIcon}
												iconPosition={this.props.iconPosition}
												{...getInputProps({
													className: getClassName(
														this.props.innerClass,
														'input',
													),
													placeholder: this.props.placeholder,
													value:
														this.state.currentValue === null
															? ''
															: this.state.currentValue,
													onChange: this.onInputChange,
													onBlur: this.withTriggerQuery(
														this.props.onBlur,
													),
													onFocus: this.handleFocus,
													onKeyPress: this.withTriggerQuery(
														this.props.onKeyPress,
													),
													onKeyDown: e =>
														this.handleKeyDown(e, highlightedIndex),
													onKeyUp: this.withTriggerQuery(
														this.props.onKeyUp,
													),
													onClick: () => {
														// clear highlighted index
														setHighlightedIndex(null);
													},
													autoFocus: this.props.autoFocus,
												})}
												themePreset={themePreset}
											/>
											{this.renderIcons()}
											{!this.props.expandSuggestionsContainer
												&& renderSuggestionsDropdown(
													getRootProps,
													getInputProps,
													getItemProps,
													isOpen,
													highlightedIndex,
													setHighlightedIndex,
													...rest,
												)}
										</InputWrapper>
										{this.renderInputAddonAfter()}
									</InputGroup>
									{this.props.expandSuggestionsContainer
										&& renderSuggestionsDropdown(
											getRootProps,
											getInputProps,
											getItemProps,
											isOpen,
											highlightedIndex,
											setHighlightedIndex,
											...rest,
										)}
								</div>
							);
						}}
						{...this.props.downShiftProps}
					/>
				) : (
					<div css={suggestionsContainer}>
						<InputGroup>
							{this.renderInputAddonBefore()}
							<InputWrapper>
								<Input
									ref={(c) => {
										this._inputRef = c;
									}}
									aria-label={this.props.componentId}
									className={getClassName(this.props.innerClass, 'input')}
									placeholder={this.props.placeholder}
									value={this.state.currentValue ? this.state.currentValue : ''}
									onChange={this.onInputChange}
									onBlur={this.withTriggerQuery(this.props.onBlur)}
									onFocus={this.withTriggerQuery(this.props.onFocus)}
									onKeyPress={this.withTriggerQuery(this.props.onKeyPress)}
									onKeyDown={this.withTriggerQuery(this.props.onKeyDown)}
									onKeyUp={this.withTriggerQuery(this.props.onKeyUp)}
									autoFocus={this.props.autoFocus}
									iconPosition={this.props.iconPosition}
									showClear={this.props.showClear}
									showIcon={this.props.showIcon}
									themePreset={themePreset}
								/>
								{this.renderIcons()}
							</InputWrapper>
							{this.renderInputAddonAfter()}
						</InputGroup>
					</div>
				)}
			</Container>
		);
	}
}

CategorySearch.propTypes = {
	setQueryOptions: types.funcRequired,
	updateQuery: types.funcRequired,
	setSuggestionsSearchValue: types.funcRequired,
	fetchPopularSuggestions: types.funcRequired,
	defaultPopularSuggestions: types.suggestions,
	options: types.options,
	categories: types.data,
	rawData: types.rawData,
	promotedResults: types.hits,
	customData: types.title,
	selectedValue: types.selectedValue,
	selectedCategory: types.selectedValue,
	suggestions: types.suggestions,
	aggregationData: types.aggregationData,
	isLoading: types.bool,
	config: types.props,
	triggerAnalytics: types.funcRequired,
	setCustomQuery: types.funcRequired,
	setDefaultQuery: types.funcRequired,
	time: types.number,
	setCustomHighlightOptions: types.funcRequired,
	fetchRecentSearches: types.funcRequired,
	recentSearches: types.suggestions,
	// eslint-disable-next-line
	error: types.any,
	// component props
	autoFocus: types.bool,
	autosuggest: types.bool,
	enableSynonyms: types.bool,
	enableQuerySuggestions: types.bool,
	distinctField: types.string,
	distinctFieldConfig: types.componentObject,
	// TODO: Remove in v4
	enablePopularSuggestions: types.bool,
	enableRecentSearches: types.bool,
	queryString: types.bool,
	beforeValueChange: types.func,
	categoryField: types.string,
	className: types.string,
	clearIcon: types.children,
	componentId: types.stringRequired,
	customHighlight: types.func,
	customQuery: types.func,
	defaultQuery: types.func,
	dataField: types.dataFieldValidator,
	aggregationField: types.string,
	aggregationSize: types.number,
	size: types.number,
	debounce: types.number,
	defaultValue: types.categorySearchValue,
	value: types.categorySearchValue,
	defaultSuggestions: types.suggestions,
	downShiftProps: types.props,
	excludeFields: types.excludeFields,
	fieldWeights: types.fieldWeights,
	filterLabel: types.string,
	fuzziness: types.fuzziness,
	highlight: types.bool,
	highlightField: types.stringOrArray,
	icon: types.children,
	iconPosition: types.iconPosition,
	includeFields: types.includeFields,
	innerClass: types.style,
	loader: types.title,
	nestedField: types.string,
	onError: types.func,
	onBlur: types.func,
	onFocus: types.func,
	onKeyDown: types.func,
	onKeyPress: types.func,
	onKeyUp: types.func,
	onQueryChange: types.func,
	onSuggestions: types.func,
	onValueChange: types.func,
	onChange: types.func,
	onValueSelected: types.func,
	placeholder: types.string,
	queryFormat: types.queryFormatSearch,
	popularSuggestions: types.hits,
	react: types.react,
	renderError: types.title,
	// TODO: Remove in v4
	renderQuerySuggestions: types.func,
	renderPopularSuggestions: types.func,
	parseSuggestion: types.func,
	renderNoSuggestion: types.title,
	showClear: types.bool,
	showFilter: types.bool,
	showVoiceSearch: types.bool,
	showDistinctSuggestions: types.bool,
	showIcon: types.bool,
	style: types.style,
	title: types.title,
	theme: types.style,
	themePreset: types.themePreset,
	URLParams: types.bool,
	strictSelection: types.bool,
	searchOperators: types.bool,
	recentSearchesIcon: types.componentObject,
	popularSearchesIcon: types.componentObject,
	// Mic props
	getMicInstance: types.func,
	renderMic: types.func,
	enablePredictiveSuggestions: types.bool,
	//
	focusShortcuts: types.focusShortcuts,
	addonBefore: types.children,
	addonAfter: types.children,
	expandSuggestionsContainer: types.bool,
};

CategorySearch.defaultProps = {
	autosuggest: true,
	className: null,
	debounce: 0,
	downShiftProps: {},
	enableSynonyms: true,
	enablePopularSuggestions: false,
	excludeFields: [],
	iconPosition: 'left',
	includeFields: ['*'],
	placeholder: 'Search',
	queryFormat: 'or',
	showClear: false,
	showFilter: true,
	showIcon: true,
	style: {},
	URLParams: false,
	strictSelection: false,
	searchOperators: false,
	showVoiceSearch: false,
	showDistinctSuggestions: true,
	size: 10,
	defaultPopularSuggestions: [],
	recentSearches: [],
	time: 0,
	enablePredictiveSuggestions: false,
	autoFocus: false,
	focusShortcuts: ['/'],
	addonBefore: undefined,
	addonAfter: undefined,
	expandSuggestionsContainer: true,
};

// Add componentType for SSR
CategorySearch.componentType = componentTypes.categorySearch;

const mapStateToProps = (state, props) => ({
	categories:
		(state.aggregations[props.componentId]
			&& state.aggregations[props.componentId][props.categoryField]
			&& state.aggregations[props.componentId][props.categoryField].buckets)
		|| [],
	rawData: state.rawData[props.componentId],
	selectedValue:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value)
		|| null,
	selectedCategory:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].category)
		|| null,
	suggestions: (state.hits[props.componentId] && state.hits[props.componentId].hits) || [],
	aggregationData: state.compositeAggregations[props.componentId] || [],
	themePreset: state.config.themePreset,
	isLoading: !!state.isLoading[`${props.componentId}_active`],
	error: state.error[props.componentId],
	config: state.config,
	promotedResults: state.promotedResults[props.componentId],
	customData: state.customData[props.componentId],
	time: state.hits[props.componentId] && state.hits[props.componentId].time,
	total: state.hits[props.componentId] && state.hits[props.componentId].total,
	hidden: state.hits[props.componentId] && state.hits[props.componentId].hidden,
	defaultPopularSuggestions: state.defaultPopularSuggestions[props.componentId],
	popularSuggestions: state.querySuggestions[props.componentId],
	recentSearches: state.recentSearches.data,
});

const mapDispatchtoProps = dispatch => ({
	setCustomHighlightOptions: (component, options) =>
		dispatch(setCustomHighlightOptions(component, options)),
	setCustomQuery: (component, query) => dispatch(setCustomQuery(component, query)),
	setDefaultQuery: (component, query) => dispatch(setDefaultQuery(component, query)),
	setSuggestionsSearchValue: value => dispatch(setSuggestionsSearchValue(value)),
	setQueryOptions: (component, props, execute) =>
		dispatch(setQueryOptions(component, props, execute)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	triggerAnalytics: (searchPosition, documentId) =>
		dispatch(recordSuggestionClick(searchPosition, documentId)),
	fetchPopularSuggestions: component => dispatch(loadPopularSuggestions(component)),
	fetchRecentSearches: queryOptions => dispatch(getRecentSearches(queryOptions)),
});

const ConnectedComponent = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(
	withTheme(props => (
		<ComponentWrapper
			{...props}
			internalComponent
			componentType={componentTypes.categorySearch}
		>
			{() => <CategorySearch ref={props.myForwardedRef} {...props} />}
		</ComponentWrapper>
	)),
);

// eslint-disable-next-line
const ForwardRefComponent = React.forwardRef((props, ref) => (
	<ConnectedComponent {...props} myForwardedRef={ref} />
));
hoistNonReactStatics(ForwardRefComponent, CategorySearch);

ForwardRefComponent.displayName = 'CategorySearch';
export default ForwardRefComponent;
