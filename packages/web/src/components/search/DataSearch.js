/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { Component } from 'react';
import Downshift from 'downshift';
import { withTheme } from 'emotion-theming';

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
import hoistNonReactStatics from 'hoist-non-react-statics';
import {
	debounce,
	checkValueChange,
	checkSomePropChange,
	getClassName,
	getOptionsFromQuery,
	getCompositeAggsQuery,
	withClickIds,
	handleOnSuggestions,
	getResultStats,
	updateCustomQuery,
	updateDefaultQuery,
	getTopSuggestions,
	getQueryOptions,
} from '@appbaseio/reactivecore/lib/utils/helper';
import { getInternalComponentID } from '@appbaseio/reactivecore/lib/utils/transform';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';

import types from '@appbaseio/reactivecore/lib/utils/types';
import causes from '@appbaseio/reactivecore/lib/utils/causes';
import Title from '../../styles/Title';
import Input, { suggestionsContainer, suggestions } from '../../styles/Input';
import SearchSvg from '../shared/SearchSvg';
import CancelSvg from '../shared/CancelSvg';
import Container from '../../styles/Container';
import CustomSvg from '../shared/CustomSvg';
import {
	connect,
	isFunction,
	getComponent,
	getPopularSuggestionsComponent,
	handleCaretPosition,
	hasCustomRenderer,
	hasPopularSuggestionsRenderer,
	isQueryIdentical,
	isEmpty,
	isNumeric,
	parseFocusShortcuts,
	isHotkeyCombinationUsed,
} from '../../utils';
import SuggestionItem from './addons/SuggestionItem';
import SuggestionWrapper from './addons/SuggestionWrapper';
import Mic from './addons/Mic';
import ComponentWrapper from '../basic/ComponentWrapper';
import InputGroup from '../../styles/InputGroup';
import InputWrapper from '../../styles/InputWrapper';
import InputAddon from '../../styles/InputAddon';
import IconGroup from '../../styles/IconGroup';
import IconWrapper from '../../../lib/styles/IconWrapper';

class DataSearch extends Component {
	constructor(props) {
		super(props);
		const { focusShortcuts } = props;
		const currentValue = props.selectedValue || props.value || props.defaultValue || '';

		this.state = {
			currentValue,
			suggestions: [],
			isOpen: false,
		};
		this.internalComponent = getInternalComponentID(props.componentId);
		/**
		 * To regulate the query execution based on the input handler,
		 * the component query will only get executed when it sets to `true`.
		 * */
		this.isPending = false;
		this.queryOptions = this.getBasicQueryOptions();
		// Set custom and default queries in store
		updateCustomQuery(props.componentId, props, currentValue);
		updateDefaultQuery(props.componentId, props, currentValue);
		if (props.highlight) {
			const queryOptions = DataSearch.highlightQuery(props) || {};
			if (props.customHighlight && typeof props.customHighlight === 'function') {
				props.setCustomHighlightOptions(props.componentId, props.customHighlight(props));
			}
			this.queryOptions = { ...queryOptions, ...this.getBasicQueryOptions() };
			props.setQueryOptions(props.componentId, queryOptions);
		} else {
			props.setQueryOptions(props.componentId, this.queryOptions);
		}

		const hasMounted = false;
		const cause = null;

		if (currentValue) {
			if (props.onChange) {
				props.onChange(currentValue, this.triggerQuery);
			}
			this.setValue(currentValue, true, props, cause, hasMounted);
		}

		// dynamically import hotkey-js
		if (!isEmpty(focusShortcuts)) {
			this.hotKeyCombinationsUsed = isHotkeyCombinationUsed(focusShortcuts);
			if (this.hotKeyCombinationsUsed) {
				try { // eslint-disable-next-line global-require
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
		fetchPopularSuggestions(componentId);
		if (enableRecentSearches) {
			fetchRecentSearches();
		}
	}

	componentDidUpdate(prevProps) {
		checkSomePropChange(
			this.props,
			prevProps,
			['highlight', 'dataField', 'highlightField', 'aggregationField'],
			() => {
				const queryOptions = DataSearch.highlightQuery(this.props) || {};
				if (
					this.props.customHighlight
					&& typeof this.props.customHighlight === 'function'
				) {
					this.props.setCustomHighlightOptions(
						this.props.componentId,
						this.props.customHighlight(this.props),
					);
				}
				this.queryOptions = { ...queryOptions, ...this.getBasicQueryOptions() };
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
				'nestedField',
				'searchOperators',
			],
			() => {
				this.updateQuery(this.state.currentValue, this.props);
			},
		);
		if (this.props.value !== prevProps.value) {
			this.setValue(this.props.value, true, this.props, undefined, undefined, false);
		} else if (
			// since, selectedValue will be updated when currentValue changes,
			// we must only check for the changes introduced by
			// clear action from SelectedFilters component in which case,
			// the currentValue will never match the updated selectedValue
			this.props.selectedValue !== prevProps.selectedValue
			&& this.state.currentValue !== this.props.selectedValue
		) {
			const { value, onChange } = this.props;
			if (!this.props.selectedValue && this.state.currentValue) {
				// selected value is cleared, call onValueSelected
				this.onValueSelected('', causes.CLEAR_VALUE, null);
			}
			if (value === undefined) {
				this.setValue(this.props.selectedValue || '', true, this.props);
			} else if (onChange) {
				// value prop exists
				onChange(this.props.selectedValue || '', this.triggerQuery);
			} else {
				// value prop exists and onChange is not defined:
				// we need to put the current value back into the store
				// if the clear action was triggered by interacting with
				// selected-filters component
				this.isPending = false;
				this.setValue(this.state.currentValue, true, this.props);
			}
		}
	}

	componentWillUnmount() {
		document.removeEventListener('keydown', this.onKeyDown);
	}

	// returns size and aggs property
	getBasicQueryOptions = () => {
		const { aggregationField } = this.props;
		const { currentValue } = this.state;
		const queryOptions = getQueryOptions(this.props);
		if (aggregationField) {
			queryOptions.aggs = getCompositeAggsQuery({
				value: currentValue,
				props: this.props,
				showTopHits: true,
			}).aggs;
		}
		return queryOptions;
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

	static defaultQuery = (value, props) => {
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
					query_string: DataSearch.shouldQuery(value, fields, props),
				};
			} else if (props.searchOperators) {
				finalQuery = {
					simple_query_string: DataSearch.shouldQuery(value, fields, props),
				};
			} else {
				finalQuery = {
					bool: {
						should: DataSearch.shouldQuery(value, fields, props),
						minimum_should_match: '1',
					},
				};
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

	onSuggestions = results => handleOnSuggestions(results, this.state.currentValue, this.props);

	setValue = (
		value,
		isDefaultValue = false,
		props = this.props,
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
						currentValue: value,
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
									this.updateQuery(value, props);
								} else {
									this.setValue('', true);
								}
							} else {
								this.updateQuery(value, props);
							}
						} else {
							// debounce for handling text while typing
							this.handleTextChange(value);
						}
						if (props.onValueChange) props.onValueChange(value);
						const suggestionChangeHandler = () => {
							// invoke on suggestions
							if (this.props.onSuggestions) {
								this.props.onSuggestions(this.props.suggestions);
							}
						};
						// Set the already fetched suggestions if query is same as used last to fetch the hits
						if (value === props.lastUsedQuery) {
							this.setState(
								{
									suggestions: this.onSuggestions(this.props.suggestions),
								},
								suggestionChangeHandler,
							);
						} else if (!value) {
							// reset suggestions
							this.setState(
								{
									suggestions: [],
								},
								suggestionChangeHandler,
							);
						}
					},
				);
			} else {
				if (this.props.autosuggest) {
					this.updateDefaultQuery(value, props);
				}
				this.updateQuery(value, props);
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

	updateDefaultQuery = (value, props) => {
		const { defaultQuery } = props;
		let defaultQueryOptions;
		let query = DataSearch.defaultQuery(value, props);
		if (defaultQuery) {
			const defaultQueryTobeSet = defaultQuery(value, props) || {};
			if (defaultQueryTobeSet.query) {
				({ query } = defaultQueryTobeSet);
			}
			defaultQueryOptions = getOptionsFromQuery(defaultQueryTobeSet);
			// Update calculated default query in store
			updateDefaultQuery(props.componentId, props, value);
		}
		props.setSuggestionsSearchValue(value);
		props.setQueryOptions(this.internalComponent, {
			...this.queryOptions,
			...defaultQueryOptions,
		});
		props.updateQuery({
			componentId: this.internalComponent,
			query,
			value,
			componentType: componentTypes.dataSearch,
		});
	};

	updateQuery = (value, props) => {
		const {
			customQuery, filterLabel, showFilter, URLParams,
		} = props;

		let customQueryOptions;
		let query = DataSearch.defaultQuery(value, props);
		if (customQuery) {
			const customQueryTobeSet = customQuery(value, props) || {};
			const queryTobeSet = customQueryTobeSet.query;
			if (queryTobeSet) {
				query = queryTobeSet;
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
				componentType: componentTypes.dataSearch,
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
		const { onChange } = this.props;
		this.setValue('', true);
		if (onChange) {
			onChange('', this.triggerQuery);
		}
		this.onValueSelected('', causes.CLEAR_VALUE, null);
	};

	handleKeyDown = (event, highlightedIndex) => {
		const { value, onChange } = this.props;
		if (value !== undefined && onChange) {
			this.isPending = true;
		}
		// if a suggestion was selected, delegate the handling
		// to suggestion handler
		if (event.key === 'Enter' && highlightedIndex === null) {
			this.setValue(event.target.value, true);
			this.onValueSelected(event.target.value, causes.ENTER_PRESS);
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
			// handle caret position in controlled components
			handleCaretPosition(e);
			onChange(inputValue, this.triggerQuery, e);
		}
	};

	triggerQuery = () => {
		this.isPending = false;
		this.setValue(this.props.value, true, this.props);
	};

	onSuggestionSelected = (suggestion) => {
		const { value, onChange } = this.props;
		this.setState({
			isOpen: false,
		});
		if (value === undefined) {
			this.setValue(suggestion.value, true, this.props, causes.SUGGESTION_SELECT);
		} else if (onChange) {
			this.isPending = false;
			onChange(suggestion.value, this.triggerQuery);
		}
		// Record analytics for selected suggestions
		this.triggerClickAnalytics(suggestion._click_id);
		// onValueSelected is user interaction driven:
		// it should be triggered irrespective of controlled (or)
		// uncontrolled component behavior
		this.onValueSelected(suggestion.value, causes.SUGGESTION_SELECT, suggestion.source);
	};

	onValueSelected = (currentValue = this.state.currentValue, ...cause) => {
		const { onValueSelected } = this.props;
		if (onValueSelected) {
			onValueSelected(currentValue, ...cause);
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
			error,
			renderError,
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

	getComponent = (downshiftProps = {}, isPopularSuggestionsRender = false) => {
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
			aggregationData: aggregationData || [],
			rawData,
			value: currentValue,
			triggerClickAnalytics: this.triggerClickAnalytics,
			resultStats: this.stats,
			// TODO: Remove in v4
			querySuggestions: this.normalizedPopularSuggestions,
			popularSuggestions: this.normalizedPopularSuggestions,
			recentSearches: this.normalizedRecentSearches,
		};
		if (isPopularSuggestionsRender) {
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

	get parsedSuggestions() {
		let suggestionsList = [];
		const { currentValue } = this.state;
		const { defaultSuggestions } = this.props;
		if (!currentValue && defaultSuggestions && defaultSuggestions.length) {
			suggestionsList = defaultSuggestions;
		} else if (currentValue) {
			suggestionsList = this.state.suggestions;
		}
		return withClickIds(suggestionsList);
	}

	get hasCustomRenderer() {
		return hasCustomRenderer(this.props);
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
		return recentSearches || [];
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
			return e => func(e, this.triggerQuery);
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
				return isNumeric(key)
					? parseInt(key, 10)
					: key.toUpperCase().charCodeAt(0);
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
		const suggestionsList = this.parsedSuggestions;
		const {
			theme, themePreset, size, recentSearchesIcon, popularSearchesIcon,
		} = this.props;
		const hasSuggestions = currentValue
			? suggestionsList.length || this.topSuggestions.length
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
									{this.hasCustomRenderer
										&& this.getComponent({
											getInputProps,
											getItemProps,
											isOpen,
											highlightedIndex,
											setHighlightedIndex,
											...rest,
										})}
									{isOpen && this.renderLoader()}
									{isOpen && this.renderError()}
									{!this.hasCustomRenderer && isOpen && hasSuggestions ? (
										<ul
											css={suggestions(themePreset, theme)}
											className={getClassName(this.props.innerClass, 'list')}
										>
											{suggestionsList.slice(0, size).map((item, index) => (
												<li
													{...getItemProps({ item })}
													key={`${index + 1}-${item.value}`}
													style={{
														backgroundColor: this.getBackgroundColor(
															highlightedIndex,
															index,
														),
													}}
												>
													<SuggestionItem
														currentValue={currentValue}
														suggestion={item}
													/>
												</li>
											))}
											{this.defaultSuggestions.map((sugg, index) => (
												<li
													{...getItemProps({ item: sugg })}
													key={`${index + 1}-${sugg.value}`}
													style={{
														backgroundColor: this.getBackgroundColor(
															highlightedIndex,
															index,
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
														key={`${suggestionsList.length
																+ index
																+ 1}-${sugg.value}`}
														style={{
															backgroundColor: this.getBackgroundColor(
																highlightedIndex,
																suggestionsList.length + index,
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
										this.renderNoSuggestion(suggestionsList)
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
												aria-label={this.props.componentId}
												id={`${this.props.componentId}-input`}
												showIcon={this.props.showIcon}
												showClear={this.props.showClear}
												iconPosition={this.props.iconPosition}
												ref={(c) => {
													this._inputRef = c;
												}}
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
													onClick: () => {
														// clear highlighted index
														setHighlightedIndex(null);
													},
													onKeyPress: this.withTriggerQuery(
														this.props.onKeyPress,
													),
													onKeyDown: e =>
														this.handleKeyDown(e, highlightedIndex),
													onKeyUp: this.withTriggerQuery(
														this.props.onKeyUp,
													),
													autoFocus: this.props.autoFocus,
												})}
												themePreset={themePreset}
												type={this.props.type}
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
									aria-label={this.props.componentId}
									className={getClassName(this.props.innerClass, 'input') || null}
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
									showIcon={this.props.showIcon}
									showClear={this.props.showClear}
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

DataSearch.propTypes = {
	setQueryOptions: types.funcRequired,
	updateQuery: types.funcRequired,
	fetchPopularSuggestions: types.funcRequired,
	fetchRecentSearches: types.funcRequired,
	recentSearches: types.suggestions,
	options: types.options,
	selectedValue: types.selectedValue,
	suggestions: types.suggestions,
	defaultPopularSuggestions: types.suggestions,
	rawData: types.rawData,
	aggregationData: types.aggregationData,
	setCustomQuery: types.funcRequired,
	setDefaultQuery: types.funcRequired,
	setCustomHighlightOptions: types.funcRequired,
	setSuggestionsSearchValue: types.funcRequired,
	triggerAnalytics: types.funcRequired,
	error: types.title,
	isLoading: types.bool,
	config: types.props,
	lastUsedQuery: types.string,
	time: types.number,
	// component props
	autoFocus: types.bool,
	autosuggest: types.bool,
	enableSynonyms: types.bool,
	distinctField: types.string,
	distinctFieldConfig: types.componentObject,
	// TODO: Remove in v4
	enableQuerySuggestions: types.bool,
	enablePopularSuggestions: types.bool,
	enableRecentSearches: types.bool,
	queryString: types.bool,
	beforeValueChange: types.func,
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
	defaultValue: types.string,
	value: types.string,
	defaultSuggestions: types.suggestions,
	promotedResults: types.hits,
	customData: types.title,
	downShiftProps: types.props,
	children: types.func,
	excludeFields: types.excludeFields,
	fieldWeights: types.fieldWeights,
	filterLabel: types.string,
	fuzziness: types.fuzziness,
	highlight: types.bool,
	highlightField: types.stringOrArray,
	icon: types.children,
	iconPosition: types.iconPosition,
	innerClass: types.style,
	includeFields: types.includeFields,
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
	render: types.func,
	// TODO: Remove in v4
	renderQuerySuggestions: types.func,
	renderPopularSuggestions: types.func,
	renderError: types.title,
	parseSuggestion: types.func,
	renderNoSuggestion: types.title,
	showClear: types.bool,
	showDistinctSuggestions: types.bool,
	showFilter: types.bool,
	showIcon: types.bool,
	showVoiceSearch: types.bool,
	style: types.style,
	title: types.title,
	theme: types.style,
	themePreset: types.themePreset,
	type: types.string,
	URLParams: types.bool,
	strictSelection: types.bool,
	searchOperators: types.bool,
	enablePredictiveSuggestions: types.bool,
	recentSearchesIcon: types.componentObject,
	popularSearchesIcon: types.componentObject,
	// Mic props
	getMicInstance: types.func,
	renderMic: types.func,
	//
	focusShortcuts: types.focusShortcuts,
	addonBefore: types.children,
	addonAfter: types.children,
	expandSuggestionsContainer: types.bool,
};

DataSearch.defaultProps = {
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
	showFilter: true,
	showIcon: true,
	showVoiceSearch: false,
	style: {},
	URLParams: false,
	showClear: false,
	showDistinctSuggestions: true,
	strictSelection: false,
	searchOperators: false,
	size: 10,
	enablePredictiveSuggestions: false,
	recentSearches: [],
	defaultPopularSuggestions: [],
	time: 0,
	focusShortcuts: ['/'],
	addonBefore: undefined,
	addonAfter: undefined,
	expandSuggestionsContainer: true,
};

// Add componentType for SSR
DataSearch.componentType = componentTypes.dataSearch;

const mapStateToProps = (state, props) => ({
	selectedValue:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value)
		|| null,
	suggestions: state.hits[props.componentId] && state.hits[props.componentId].hits,
	rawData: state.rawData[props.componentId],
	aggregationData: state.compositeAggregations[props.componentId],
	themePreset: state.config.themePreset,
	isLoading: !!state.isLoading[`${props.componentId}_active`],
	error: state.error[props.componentId],
	config: state.config,
	promotedResults: state.promotedResults[props.componentId],
	customData: state.customData[props.componentId],
	time: state.hits[props.componentId] && state.hits[props.componentId].time,
	total: state.hits[props.componentId] && state.hits[props.componentId].total,
	hidden: state.hits[props.componentId] && state.hits[props.componentId].hidden,
	popularSuggestions: state.querySuggestions[props.componentId],
	defaultPopularSuggestions: state.defaultPopularSuggestions[props.componentId],
	recentSearches: state.recentSearches.data,
	lastUsedQuery: state.queryToHits[props.componentId],
});

const mapDispatchtoProps = dispatch => ({
	setCustomHighlightOptions: (component, options) =>
		dispatch(setCustomHighlightOptions(component, options)),
	setCustomQuery: (component, query) => dispatch(setCustomQuery(component, query)),
	setDefaultQuery: (component, query) => dispatch(setDefaultQuery(component, query)),
	setSuggestionsSearchValue: value => dispatch(setSuggestionsSearchValue(value)),
	setQueryOptions: (component, props) => dispatch(setQueryOptions(component, props)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	triggerAnalytics: (searchPosition, documentId) =>
		dispatch(recordSuggestionClick(searchPosition, documentId)),
	fetchRecentSearches: queryOptions => dispatch(getRecentSearches(queryOptions)),
	fetchPopularSuggestions: component => dispatch(loadPopularSuggestions(component)),
});

const ConnectedComponent = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(
	withTheme(props => (
		<ComponentWrapper {...props} internalComponent componentType={componentTypes.dataSearch}>
			{() => <DataSearch ref={props.myForwardedRef} {...props} />}
		</ComponentWrapper>
	)),
);

// eslint-disable-next-line
const ForwardRefComponent = React.forwardRef((props, ref) => (
	<ConnectedComponent {...props} myForwardedRef={ref} />
));
hoistNonReactStatics(ForwardRefComponent, DataSearch);

ForwardRefComponent.displayName = 'DataSearch';
export default ForwardRefComponent;
