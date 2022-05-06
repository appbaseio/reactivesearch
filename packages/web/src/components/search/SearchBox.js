/** @jsx jsx */
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import { getInternalComponentID } from '@appbaseio/reactivecore/lib/utils/transform';
import { jsx } from '@emotion/core';
import { withTheme } from 'emotion-theming';
import causes from '@appbaseio/reactivecore/lib/utils/causes';
import {
	debounce,
	checkValueChange,
	getClassName,
	getResultStats,
	withClickIds,
	updateCustomQuery,
	updateDefaultQuery,
	normalizeDataField,
	getComponent as getComponentUtilFunc,
	isFunction,
	hasCustomRenderer,
	suggestionTypes,
	featuredSuggestionsActionTypes,
} from '@appbaseio/reactivecore/lib/utils/helper';
import Downshift from 'downshift';
import hoistNonReactStatics from 'hoist-non-react-statics';
import React, { useState, useEffect, useRef } from 'react';
import types from '@appbaseio/reactivecore/lib/utils/types';
import {
	updateQuery,
	recordSuggestionClick,
	setCustomQuery,
	setDefaultQuery,
} from '@appbaseio/reactivecore/lib/actions';
import hotkeys from 'hotkeys-js';
import XSS from 'xss';
import ComponentWrapper from '../basic/ComponentWrapper';
import InputGroup from '../../styles/InputGroup';
import InputWrapper from '../../styles/InputWrapper';
import InputAddon from '../../styles/InputAddon';
import IconGroup from '../../styles/IconGroup';
import IconWrapper from '../../styles/IconWrapper';
import SearchSvg from '../shared/SearchSvg';
import Container from '../../styles/Container';
import Title from '../../styles/Title';
import Input, { searchboxSuggestions, suggestionsContainer } from '../../styles/Input';
import Button from '../../styles/Button';
import SuggestionItem from './addons/SuggestionItem';
import {
	connect,
	extractModifierKeysFromFocusShortcuts,
	handleCaretPosition,
	isEmpty,
	parseFocusShortcuts,
} from '../../utils';
import Mic from './addons/Mic';
import CancelSvg from '../shared/CancelSvg';
import CustomSvg from '../shared/CustomSvg';
import SuggestionWrapper from './addons/SuggestionWrapper';
import AutofillSvg from '../shared/AutofillSvg';
import Flex from '../../styles/Flex';

const useConstructor = (callBack = () => {}) => {
	const [hasBeenCalled, setHasBeenCalled] = useState(false);
	if (hasBeenCalled) return;
	callBack();
	setHasBeenCalled(true);
};

const MOCK_SUGGESTIONS = [
	{
		value: 'home page',
		label: 'Go to <mark>Home</mark>',
		description: 'Blazing fast search with Appbase',
		url: null,
		_suggestion_type: 'featured',
		sectionId: 'navigation',
		sectionLabel: 'Navigation Links',
		action: 'navigate',
		subAction: '{"link":"/home"}',
		icon: "<img src='data:image/png;base64,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'/>",
		iconURL: null,
		_category: null,
		_count: null,
		_rs_score: 0,
		_matched_tokens: null,
		_id: '',
		_index: null,
		_score: 0,
		_source: {},
	},
	{
		value: 'SearchBox: Tutorial',
		label: 'Go to <mark>SearchBox</mark> getting started guide',
		description: 'Headless API to build search interface, easy to use and understand',
		url: null,
		_suggestion_type: 'featured',
		sectionId: 'tutorials',
		sectionLabel: 'Tutorbals 🪲',
		action: 'function',
		subAction:
			'function(currentSuggestion, value, customEvents) { console.log("function invoked", value)}',
		icon: null,
		iconURL:
			'https://camo.githubusercontent.com/95874e325a752e6ffb604991feb719c6e8bae6a552ed23d4a566bc4d518bc090/68747470733a2f2f692e696d6775722e636f6d2f696952397741732e706e67',
		_category: null,
		_count: null,
		_rs_score: 0,
		_matched_tokens: null,
		_id: '',
		_index: null,
		_score: 0,
		_source: {},
	},
	{
		value: 'chasing harry ',
		label: 'chasing harry winston',
		url: null,
		_suggestion_type: 'recent',
		_category: null,
		_count: 1,
		_rs_score: 0,
		_matched_tokens: null,
		_id: '',
		_index: null,
		_score: 0,
		_source: {},
		sectionId: 'recents',
		sectionLabel: 'Recent Suggestions',
	},
	{
		value: 'harry',
		label: 'harry',
		url: null,
		_suggestion_type: 'recent',
		_category: null,
		_count: 10,
		_rs_score: 0,
		_matched_tokens: null,
		_id: '',
		_index: null,
		_score: 0,
		_source: {},
		sectionId: 'recents',
		sectionLabel: 'Recent Suggestions',
	},
	{
		value: 'harry pott',
		label: 'harry pott',
		url: null,
		_suggestion_type: 'recent',
		_category: null,
		_count: 9,
		_rs_score: 0,
		_matched_tokens: null,
		_id: '',
		_index: null,
		_score: 0,
		_source: {},
		sectionId: 'recents',
		sectionLabel: 'Recent Suggestions',
	},
];
const SearchBox = (props) => {
	const {
		selectedValue,
		selectedCategory,
		value,
		defaultValue,
		componentId,
		rawData,
		aggregationData,
		isLoading,
		error,
		onData,
		onChange,
		focusShortcuts,
		defaultQuery,
		filterLabel,
		showFilter,
		URLParams,
		customQuery,
	} = props;

	const internalComponent = getInternalComponentID(componentId);
	const [currentValue, setCurrentValue] = useState('');
	const [isOpen, setIsOpen] = useState(props.isOpen);
	const _inputRef = useRef(null);
	const stats = () => getResultStats(props);

	const parsedSuggestions = () => {
		let suggestionsArray = [];
		if (Array.isArray(props.suggestions) && props.suggestions.length) {
			suggestionsArray = [...withClickIds(props.suggestions)];
		}
		suggestionsArray = [...MOCK_SUGGESTIONS, ...suggestionsArray];

		const sectionsAccumulated = [];
		const sectionisedSuggestions = suggestionsArray.reduce((acc, d, currentIndex) => {
			if (sectionsAccumulated.includes(d.sectionId)) return acc;
			if (d.sectionId) {
				acc[currentIndex] = suggestionsArray.filter(g => g.sectionId === d.sectionId);
				sectionsAccumulated.push(d.sectionId);
			} else {
				acc[currentIndex] = d;
			}
			return acc;
		}, {});
		return Object.values(sectionisedSuggestions);
	};
	const focusSearchBox = (event) => {
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

		if (_inputRef.current) {
			_inputRef.current.focus();
		}
	};
	const listenForFocusShortcuts = () => {
		if (isEmpty(focusShortcuts)) {
			return;
		}

		// for single press keys (a-z, A-Z) &, hotkeys' combinations such as 'cmd+k', 'ctrl+shft+a', etc
		hotkeys(
			parseFocusShortcuts(focusShortcuts).join(','),
			/* eslint-disable no-shadow */
			// eslint-disable-next-line no-unused-vars
			(event, handler) => {
				// Prevent the default refresh event under WINDOWS system
				event.preventDefault();
				focusSearchBox(event);
			},
		);

		// if one of modifier keys are used, they are handled below
		hotkeys('*', (event) => {
			const modifierKeys = extractModifierKeysFromFocusShortcuts(focusShortcuts);

			if (modifierKeys.length === 0) return;

			for (let index = 0; index < modifierKeys.length; index += 1) {
				const element = modifierKeys[index];
				if (hotkeys[element]) {
					focusSearchBox(event);
					break;
				}
			}
		});
	};
	const triggerClickAnalytics = (searchPosition, documentId) => {
		let docId = documentId;
		if (!docId) {
			const hitData = parsedSuggestions().find(hit => hit._click_id === searchPosition);
			if (hitData && hitData.source && hitData.source._id) {
				docId = hitData.source._id;
			}
		}
		props.triggerAnalytics(searchPosition, docId);
	};

	const shouldQuery = (value, dataFields, props) => {
		const finalQuery = [];
		const phrasePrefixFields = [];
		const fields = dataFields.map((dataField) => {
			const queryField = `${dataField.field}${
				dataField.weight ? `^${dataField.weight}` : ''
			}`;
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

	const searchBoxDefaultQuery = (value, props) => {
		let finalQuery = null;

		const fields = normalizeDataField(props.dataField, props.fieldWeights);
		if (value) {
			if (props.queryString) {
				finalQuery = {
					query_string: shouldQuery(value, fields, props),
				};
			} else if (props.searchOperators) {
				finalQuery = {
					simple_query_string: shouldQuery(value, fields, props),
				};
			} else {
				finalQuery = {
					bool: {
						should: shouldQuery(value, fields, props),
						minimum_should_match: '1',
					},
				};
			}
		}

		if (value === '') {
			finalQuery = {
				bool: {
					should: shouldQuery(value, fields, props),
					minimum_should_match: '1',
				},
			};
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

	// fires query to fetch suggestion
	const triggerDefaultQuery = (paramValue) => {
		if (!props.autosuggest) {
			return;
		}
		const value = typeof paramValue !== 'string' ? currentValue : paramValue;
		let query = searchBoxDefaultQuery(value, props);
		if (defaultQuery) {
			const defaultQueryTobeSet = defaultQuery(value, props) || {};
			if (defaultQueryTobeSet.query) {
				({ query } = defaultQueryTobeSet);
			}
			// Update calculated default query in store
			updateDefaultQuery(componentId, props, value);
		}
		props.updateQuery({
			componentId: internalComponent,
			query,
			value,
			componentType: componentTypes.searchBox,
		});
	};

	// fires query to fetch results(dependent components are affected here)
	const triggerCustomQuery = (paramValue, categoryValue = undefined) => {
		const value = typeof paramValue !== 'string' ? currentValue : paramValue;
		let query = searchBoxDefaultQuery(
			`${value}${categoryValue ? ` in ${categoryValue}` : ''}`,
			props,
		);
		if (customQuery) {
			const customQueryTobeSet = customQuery(value, props) || {};
			const queryTobeSet = customQueryTobeSet.query;
			if (queryTobeSet) {
				query = queryTobeSet;
			}
			updateCustomQuery(componentId, props, value);
		}
		props.updateQuery({
			componentId,
			value,
			query,
			label: filterLabel,
			showFilter,
			URLParams,
			componentType: componentTypes.searchBox,
			category: categoryValue,
		});
	};

	const triggerQuery = ({
		isOpen = undefined,
		customQuery = false,
		defaultQuery = false,
		value = undefined,
		categoryValue = undefined,
	} = {}) => {
		if (typeof isOpen === 'boolean') {
			setIsOpen(isOpen);
		}

		if (customQuery) {
			triggerCustomQuery(value, categoryValue);
		}
		if (defaultQuery) {
			triggerDefaultQuery(value);
		}
	};

	const onValueSelected = (valueSelected = currentValue, cause, suggestion = null) => {
		const { onValueSelected } = props;
		if (onValueSelected) {
			onValueSelected(valueSelected, cause, suggestion);
		}
	};
	const handleTextChange = debounce((valueParam = undefined, cause = undefined) => {
		const { enterButton } = props;
		if (cause === causes.CLEAR_VALUE) {
			triggerCustomQuery(valueParam);
			triggerDefaultQuery(valueParam);
		} else if (props.autosuggest) {
			triggerDefaultQuery(valueParam);
		} else if (value === undefined && !onChange && !enterButton) {
			triggerCustomQuery(valueParam);
		}
	}, props.debounce);

	const setValue = (
		value,
		isDefaultValue = false,
		setValueProps = props,
		cause,
		hasMounted = true,
		toggleIsOpen = true,
		categoryValue = undefined,
	) => {
		const performUpdate = () => {
			if (hasMounted) {
				if (toggleIsOpen) setIsOpen(!isOpen);
				setCurrentValue(value);
				if (isDefaultValue) {
					if (props.autosuggest) {
						triggerQuery({
							...(toggleIsOpen && { isOpen: !isOpen }),
							defaultQuery: true,
							value,
						});
					}
					// in case of strict selection only SUGGESTION_SELECT should be able
					// to set the query otherwise the value should reset
					if (setValueProps.strictSelection) {
						if (cause === causes.SUGGESTION_SELECT || value === '') {
							triggerCustomQuery(value, categoryValue);
						} else {
							setValue('', true);
						}
					} else {
						triggerCustomQuery(value, categoryValue);
					}
				} else {
					// debounce for handling text while typing
					handleTextChange(value, cause);
				}
				if (setValueProps.onValueChange) setValueProps.onValueChange(value);
			} else {
				triggerQuery({
					defaultQuery: props.autosuggest,
					customQuery: true,
					value,
					categoryValue,
				});
				if (setValueProps.onValueChange) setValueProps.onValueChange(value);
			}
		};
		checkValueChange(
			setValueProps.componentId,
			value,
			setValueProps.beforeValueChange,
			performUpdate,
		);
	};
	const withTriggerQuery = (func) => {
		if (func) {
			return e =>
				func(e, ({ isOpen }: { isOpen: false }) => setValue(props.value, !isOpen, props));
		}
		return undefined;
	};

	const handleFeaturedSuggestionClicked = (suggestion) => {
		if (suggestion.action === featuredSuggestionsActionTypes.NAVIGATE) {
			const { target = '_blank', link = '/' } = JSON.parse(suggestion.subAction);

			if (typeof window !== 'undefined') {
				window.open(link, target);
			}
		}
		if (suggestion.action === featuredSuggestionsActionTypes.FUNCTION) {
			// eslint-disable-next-line no-new-func
			const func = new Function(`return ${suggestion.subAction}`)();
			func(suggestion, currentValue);
		}
		// blur is important to close the dropdown
		// on selecting one of featured suggestions
		// else Downshift probably is focusing the dropdown
		// and not letting it close
		_inputRef.current.blur();
	};

	const onSuggestionSelected = (suggestion) => {
		setIsOpen(false);
		// handle featured suggestions click event
		if (suggestion._suggestion_type === suggestionTypes.Featured) {
			handleFeaturedSuggestionClicked(suggestion);
			return;
		}

		const suggestionValue = suggestion.value;

		if (value === undefined) {
			setValue(
				suggestionValue,
				true,
				props,
				causes.SUGGESTION_SELECT,
				true,
				false,
				suggestion._category,
			);
		} else if (onChange) {
			onChange(suggestionValue, ({ isOpen } = {}) =>
				triggerQuery({
					customQuery: true,
					value: suggestionValue,
					categoryValue: suggestion._category,
					isOpen,
				}),
			);
		}
		// Record analytics for selected suggestions
		triggerClickAnalytics(suggestion._click_id);
		// onValueSelected is user interaction driven:
		// it should be triggered irrespective of controlled (or)
		// uncontrolled component behavior
		onValueSelected(suggestionValue, causes.SUGGESTION_SELECT, suggestion);
	};

	const onInputChange = (e) => {
		const { value: inputValue } = e.target;
		if (!isOpen && props.autosuggest) {
			setIsOpen(true);
		}
		if (value === undefined) {
			setValue(
				inputValue,
				false,
				props,
				inputValue === '' ? causes.CLEAR_VALUE : undefined,
				true,
				false,
			);
		} else if (onChange) {
			// handle caret position in controlled components
			handleCaretPosition(e);
			onChange(
				inputValue,
				({ isOpen } = {}) =>
					triggerQuery({
						customQuery: true,
						value: inputValue,
						isOpen,
					}),
				e,
			);
		}
	};

	const handleKeyDown = (event, highlightedIndex) => {
		// if a suggestion was selected, delegate the handling
		// to suggestion handler
		if (event.key === 'Enter' && highlightedIndex === null) {
			setValue(event.target.value, true);
			onValueSelected(event.target.value, causes.ENTER_PRESS);
		}
		if (props.onKeyDown) {
			props.onKeyDown(event, this.triggerQuery);
		}
	};

	const clearValue = () => {
		setValue('', false, props, causes.CLEAR_VALUE, true, false);
		if (onChange) {
			onChange('', ({ isOpen } = {}) =>
				triggerQuery({
					customQuery: true,
					value: '',
					isOpen,
				}),
			);
		}
		onValueSelected('', causes.CLEAR_VALUE, null);
	};

	const shouldMicRender = (showVoiceSearch) => {
		// checks for SSR
		if (typeof window === 'undefined') return false;
		return showVoiceSearch && (window.webkitSpeechRecognition || window.SpeechRecognition);
	};

	const handleStateChange = (changes, stateAndHelpers) => {
		const { isOpen, type } = changes;
		const { selectedItem } = stateAndHelpers;
		if (type === Downshift.stateChangeTypes.mouseUp && isOpen !== undefined) {
			setIsOpen(isOpen);
		}

		// allow invoking click event repeatedly on featured suggestions
		if (
			!changes.selectedItem
			&& (type === Downshift.stateChangeTypes.clickItem
				|| type === Downshift.stateChangeTypes.keyDownEnter)
			&& selectedItem
			&& selectedItem._suggestion_type === suggestionTypes.Featured
		) {
			onSuggestionSelected(selectedItem);
		}
	};

	const getBackgroundColor = (highlightedIndex, index) => {
		const isDark = props.themePreset === 'dark';
		if (isDark) {
			return highlightedIndex === index ? '#555' : '#424242';
		}
		return highlightedIndex === index ? '#eee' : '#fff';
	};

	const handleSearchIconClick = () => {
		if (currentValue.trim()) {
			setValue(currentValue, true);
			onValueSelected(currentValue, causes.SEARCH_ICON_CLICK);
		}
	};

	const handleVoiceResults = ({ results }) => {
		if (
			results
			&& results[0]
			&& results[0].isFinal
			&& results[0][0]
			&& results[0][0].transcript
			&& results[0][0].transcript.trim()
		) {
			setValue(results[0][0].transcript.trim(), true, props, undefined, true, isOpen);
		}
	};

	const renderNoSuggestion = (finalSuggestionsList = []) => {
		const {
			themePreset,
			theme,
			isLoading,
			renderNoSuggestion,
			innerClass,
			error,
			renderError,
		} = props;
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

	const renderLoader = () => {
		const {
			loader, isLoading, themePreset, theme, innerClass,
		} = props;
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

	const renderError = () => {
		const {
			error, renderError, themePreset, theme, isLoading, innerClass,
		} = props;
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

	const getComponent = (downshiftProps = {}) => {
		const { error, isLoading, rawData } = props;

		const data = {
			error,
			loading: isLoading,
			downshiftProps,
			data: props.suggestions,
			value: currentValue,
			triggerClickAnalytics,
			resultStats: stats(),
			rawData,
		};
		return getComponentUtilFunc(data, props);
	};
	const renderInputAddonBefore = () => {
		const { addonBefore } = props;
		if (addonBefore) {
			return <InputAddon>{addonBefore}</InputAddon>;
		}

		return null;
	};
	const renderInputAddonAfter = () => {
		const { addonAfter } = props;
		if (addonAfter) {
			return <InputAddon>{addonAfter}</InputAddon>;
		}

		return null;
	};

	const renderEnterButtonElement = () => {
		const { enterButton, renderEnterButton, innerClass } = props;
		const enterButtonOnClick = () =>
			triggerQuery({ isOpen: false, value: currentValue, customQuery: true });

		if (enterButton) {
			const getEnterButtonMarkup = () => {
				if (typeof renderEnterButton === 'function') {
					return renderEnterButton(enterButtonOnClick);
				}

				return (
					<Button
						className={`enter-btn ${getClassName(innerClass, 'enter-button')}`}
						primary
						onClick={enterButtonOnClick}
					>
						Search
					</Button>
				);
			};

			return <div className="enter-button-wrapper">{getEnterButtonMarkup()}</div>;
		}

		return null;
	};

	const renderIcon = () => {
		if (props.showIcon) {
			return props.icon || <SearchSvg />;
		}
		return null;
	};

	const renderCancelIcon = () => {
		if (props.showClear) {
			return props.clearIcon || <CancelSvg />;
		}
		return null;
	};

	const renderIcons = () => {
		const {
			showIcon,
			showClear,
			renderMic,
			getMicInstance,
			showVoiceSearch,
			iconPosition,
			innerClass,
		} = props;
		return (
			<div>
				<IconGroup groupPosition="right" positionType="absolute">
					{currentValue && showClear && (
						<IconWrapper onClick={clearValue} showIcon={showIcon} isClearIcon>
							{renderCancelIcon()}
						</IconWrapper>
					)}
					{shouldMicRender(showVoiceSearch) && (
						<Mic
							getInstance={getMicInstance}
							render={renderMic}
							onResult={handleVoiceResults}
							className={getClassName(innerClass, 'mic') || null}
						/>
					)}
					{iconPosition === 'right' && (
						<IconWrapper onClick={handleSearchIconClick}>{renderIcon()}</IconWrapper>
					)}
				</IconGroup>

				<IconGroup groupPosition="left" positionType="absolute">
					{iconPosition === 'left' && (
						<IconWrapper onClick={handleSearchIconClick}>{renderIcon()}</IconWrapper>
					)}
				</IconGroup>
			</div>
		);
	};

	const handleFocus = (event) => {
		if (props.autosuggest) {
			setIsOpen(true);
		}
		if (props.onFocus) {
			props.onFocus(event, triggerQuery);
		}
	};

	const onAutofillClick = (suggestion) => {
		const value = suggestion.value;
		setIsOpen(true);
		setCurrentValue(value);
		triggerDefaultQuery(value);
	};

	const hasMounted = useRef();
	useConstructor(() => {
		if (!props.enableAppbase) {
			throw new Error('enableAppbase is required to be true when using SearchBox component.');
		}
		const currentLocalValue = selectedValue || value || defaultValue || '';

		hasMounted.current = false;
		if (currentLocalValue) {
			if (props.onChange) {
				props.onChange(currentLocalValue, ({ isOpen } = {}) =>
					triggerQuery({
						customQuery: true,
						value: currentLocalValue,
						isOpen,
					}),
				);
			}
		}
		setCurrentValue(currentLocalValue);

		// Set custom and default queries in store
		triggerCustomQuery(currentLocalValue, selectedCategory);
		triggerDefaultQuery(currentLocalValue);
	});

	useEffect(() => {
		if (onData) {
			onData({
				data: parsedSuggestions(),
				rawData,
				aggregationData,
				loading: isLoading,
				error,
			});
		}
	}, [rawData, aggregationData, isLoading, error]);

	useEffect(() => {
		if (hasMounted.current) {
			if (value !== undefined && currentValue !== value) {
				setValue(
					value,
					!isOpen && props.autosuggest && !props.strictSelection,
					props,
					undefined,
					undefined,
					false,
				);
			}
		}
	}, [value]);

	useEffect(() => {
		if (
			// since, selectedValue will be updated when currentValue changes,
			// we must only check for the changes introduced by
			// clear action from SelectedFilters component in which case,
			// the currentValue will never match the updated selectedValue
			// currentValue !== props.defaultValue &&
			hasMounted.current
			&& currentValue !== selectedValue
			&& !(typeof currentValue !== 'string' && !selectedValue)
		) {
			if (!selectedValue && currentValue) {
				// selected value is cleared, call onValueSelected
				onValueSelected('', causes.CLEAR_VALUE, null);
			}
			if (value === undefined) {
				setValue(selectedValue || '', true, props, undefined, hasMounted.current, false);
			} else if (onChange) {
				if (value !== selectedValue && selectedValue !== currentValue) {
					// value prop exists
					onChange(selectedValue || '', ({ isOpen } = {}) =>
						triggerQuery({
							customQuery: true,
							value: selectedValue || '',
							isOpen,
						}),
					);
				}
			} else {
				// value prop exists and onChange is not defined:
				// we need to put the current value back into the store
				// if the clear action was triggered by interacting with
				// selected-filters component

				setValue(currentValue, true, props, undefined, true, false);
			}
		}
	}, [selectedValue]);

	useEffect(() => {
		hasMounted.current = true;
		// register hotkeys for listening to focusShortcuts' key presses
		listenForFocusShortcuts();
	}, []);

	const hasSuggestions = () => Array.isArray(parsedSuggestions()) && parsedSuggestions().length;
	return (
		<Container style={props.style} className={props.className}>
			{props.title && (
				<Title className={getClassName(props.innerClass, 'title') || null}>
					{props.title}
				</Title>
			)}
			{props.autosuggest ? (
				<Downshift
					id={`${props.componentId}-downshift`}
					onChange={onSuggestionSelected}
					onStateChange={handleStateChange}
					isOpen={isOpen}
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
						const renderSuggestionsDropdown = () => {
							const getIcon = (iconType, item) => {
								switch (iconType) {
									case suggestionTypes.Recent:
										return props.recentSearchesIcon;
									case suggestionTypes.Popular:
										return props.popularSearchesIcon;
									case suggestionTypes.Featured:
										if (item.icon) {
											return (
												<div
													style={{ display: 'flex' }}
													dangerouslySetInnerHTML={{
														__html: XSS(item.icon),
													}}
												/>
											);
										}
										return <img src={XSS(item.iconURL)} alt={item.value} />;

									default:
										return null;
								}
							};

							// action icon is dispkayed on right of the suggestion item
							const getActionIcon = (item) => {
								if (item._suggestion_type === suggestionTypes.Featured) {
									if (item.action === featuredSuggestionsActionTypes.FUNCTION) {
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
								} else if (!item._category) {
									/* 👇 avoid showing autofill for category suggestions👇 */

									return (
										<AutofillSvg
											onClick={(e) => {
												e.stopPropagation();
												onAutofillClick(item);
											}}
										/>
									);
								}
								return null;
							};

							let indexOffset = 0;
							return (
								<React.Fragment>
									{hasCustomRenderer(props)
										&& getComponent({
											getInputProps,
											getItemProps,
											isOpen,
											highlightedIndex,
											setHighlightedIndex,
											...rest,
										})}
									{isOpen && renderLoader()}
									{isOpen && renderError()}
									{!hasCustomRenderer(props) && isOpen && hasSuggestions() ? (
										<ul
											css={searchboxSuggestions(
												props.themePreset,
												props.theme,
											)}
											className={`${getClassName(props.innerClass, 'list')}`}
										>
											{parsedSuggestions().map((item, itemIndex) => {
												const index = indexOffset + itemIndex;
												if (Array.isArray(item)) {
													const sectionHtml = XSS(item[0].sectionLabel);
													indexOffset += item.length - 1;
													return (
														<div
															className="section-container"
															key={`${item[0].sectionId}`}
														>
															<div
																className={`section-header ${getClassName(
																	props.innerClass,
																	'section-label',
																)}`}
																dangerouslySetInnerHTML={{
																	__html: sectionHtml,
																}}
															/>
															<ul className="section-list">
																{item.map(
																	(sectionItem, sectionIndex) => (
																		<li
																			{...getItemProps({
																				item: sectionItem,
																			})}
																			key={`${
																				sectionItem.sectionId
																				+ sectionIndex
																			}-${sectionItem.value}`}
																			style={{
																				backgroundColor:
																					getBackgroundColor(
																						highlightedIndex,
																						index
																							+ sectionIndex,
																					),
																				justifyContent:
																					'flex-start',
																				alignItems:
																					'center',
																			}}
																		>
																			{props.renderItem ? (
																				props.renderItem(
																					sectionItem,
																				)
																			) : (
																				<React.Fragment>
																					{/* eslint-disable */}

																					<div
																						style={{
																							padding:
																								'0 10px 0 0',
																							display:
																								'flex',
																						}}
																					>
																						<CustomSvg
																							iconId={`${
																								sectionIndex +
																								index +
																								1
																							}-${
																								sectionItem.value
																							}-icon`}
																							className={
																								getClassName(
																									props.innerClass,
																									`${sectionItem._suggestion_type}-search-icon`,
																								) ||
																								null
																							}
																							icon={getIcon(
																								sectionItem._suggestion_type,
																								sectionItem,
																							)}
																							type={`${sectionItem._suggestion_type}-search-icon`}
																						/>
																					</div>
																					{/* eslint-enable */}

																					<Flex
																						direction="column"
																						css={{
																							width: '85%',
																						}}
																					>
																						{sectionItem.label && (
																							<div
																								className="section-list-item__label"
																								dangerouslySetInnerHTML={{
																									__html: XSS(
																										sectionItem.label,
																									),
																								}}
																							/>
																						)}
																						{sectionItem.description && (
																							<div
																								className="section-list-item__description"
																								dangerouslySetInnerHTML={{
																									__html: XSS(
																										sectionItem.description,
																									),
																								}}
																							/>
																						)}
																					</Flex>

																					{getActionIcon(
																						sectionItem,
																					)}
																				</React.Fragment>
																			)}
																		</li>
																	),
																)}
															</ul>
														</div>
													);
												}

												return (
													<li
														{...getItemProps({ item })}
														key={`${index + 1}-${item.value}`}
														style={{
															backgroundColor: getBackgroundColor(
																highlightedIndex,
																index,
															),
															justifyContent: 'flex-start',
															alignItems: 'center',
														}}
													>
														{props.renderItem ? (
															props.renderItem(item)
														) : (
															<React.Fragment>
																{/* eslint-disable */}

																<div
																	style={{
																		padding: '0 10px 0 0',
																		display: 'flex',
																	}}
																>
																	<CustomSvg
																		iconId={`${index + 1}-${
																			item.value
																		}-icon`}
																		className={
																			getClassName(
																				props.innerClass,
																				`${item._suggestion_type}-search-icon`,
																			) || null
																		}
																		icon={getIcon(
																			item._suggestion_type,
																			item,
																		)}
																		type={`${item._suggestion_type}-search-icon`}
																	/>
																</div>
																{/* eslint-enable */}
																<SuggestionItem
																	currentValue={
																		currentValue || ''
																	}
																	suggestion={item}
																/>

																{getActionIcon(item)}
															</React.Fragment>
														)}
													</li>
												);
											})}
										</ul>
									) : (
										renderNoSuggestion(parsedSuggestions())
									)}
								</React.Fragment>
							);
						};

						return (
							<div
								{...getRootProps(
									{ css: suggestionsContainer },
									{ suppressRefError: true },
								)}
							>
								<InputGroup isOpen={isOpen}>
									{renderInputAddonBefore()}
									<InputWrapper>
										<Input
											aria-label={props.componentId}
											id={`${props.componentId}-input`}
											showIcon={props.showIcon}
											showClear={props.showClear}
											iconPosition={props.iconPosition}
											ref={_inputRef}
											{...getInputProps({
												className: getClassName(props.innerClass, 'input'),
												placeholder: props.placeholder,
												value: currentValue === null ? '' : currentValue,
												onChange: onInputChange,
												onBlur: withTriggerQuery(props.onBlur),
												onFocus: handleFocus,
												onClick: () => {
													// clear highlighted index
													setHighlightedIndex(null);
												},
												onKeyPress: withTriggerQuery(props.onKeyPress),
												onKeyDown: e =>
													handleKeyDown(e, highlightedIndex),
												onKeyUp: withTriggerQuery(props.onKeyUp),
												autoFocus: props.autoFocus,
											})}
											themePreset={props.themePreset}
											type={props.type}
										/>
										{renderIcons()}
										{!props.expandSuggestionsContainer
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
									{renderInputAddonAfter()}
									{renderEnterButtonElement()}
								</InputGroup>

								{props.expandSuggestionsContainer
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
					{...props.downShiftProps}
				/>
			) : (
				<div css={suggestionsContainer}>
					<InputGroup isOpen={isOpen}>
						{renderInputAddonBefore()}
						<InputWrapper>
							<Input
								aria-label={props.componentId}
								className={getClassName(props.innerClass, 'input') || null}
								placeholder={props.placeholder}
								value={currentValue || ''}
								onChange={onInputChange}
								onBlur={withTriggerQuery(props.onBlur)}
								onFocus={withTriggerQuery(props.onFocus)}
								onKeyPress={withTriggerQuery(props.onKeyPress)}
								onKeyDown={withTriggerQuery(props.onKeyDown)}
								onKeyUp={withTriggerQuery(props.onKeyUp)}
								autoFocus={props.autoFocus}
								iconPosition={props.iconPosition}
								showIcon={props.showIcon}
								showClear={props.showClear}
								themePreset={props.themePreset}
							/>
							{renderIcons()}
						</InputWrapper>
						{renderInputAddonAfter()}
						{renderEnterButtonElement()}
					</InputGroup>
				</div>
			)}
		</Container>
	);
};
SearchBox.propTypes = {
	updateQuery: types.funcRequired,
	selectedValue: types.selectedValue,
	selectedCategory: types.string,
	suggestions: types.suggestions,
	triggerAnalytics: types.funcRequired,
	error: types.title,
	isLoading: types.bool,
	time: types.number,
	enableAppbase: types.bool,
	rawData: types.rawData,
	aggregationData: types.aggregationData,
	// component props
	autoFocus: types.bool,
	autosuggest: types.bool,
	enableSynonyms: types.bool,
	distinctField: types.string,
	distinctFieldConfig: types.componentObject,
	index: types.string,
	enablePopularSuggestions: types.bool,
	enableRecentSuggestions: types.bool,
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
	onValueChange: types.func,
	onChange: types.func,
	onValueSelected: types.func,
	placeholder: types.string,
	queryFormat: types.queryFormatSearch,
	react: types.react,
	render: types.func,
	renderError: types.title,
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
	popularSuggestionsConfig: types.componentObject,
	recentSuggestionsConfig: types.componentObject,
	applyStopwords: types.bool,
	customStopwords: types.stringArray,
	onData: types.func,
	renderItem: types.func,
	isOpen: types.bool,
	enableIndexSuggestions: types.bool,
	enableFeaturedSuggestions: types.bool,
	featuredSuggestionsConfig: types.componentObject,
	indexSuggestionsConfig: types.componentObject,
	enterButton: types.bool,
	renderEnterButton: types.func,
};

SearchBox.defaultProps = {
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
	time: 0,
	focusShortcuts: ['/'],
	addonBefore: undefined,
	addonAfter: undefined,
	expandSuggestionsContainer: true,
	suggestions: [],
	isOpen: false,
	enterButton: false,
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
	aggregationData: state.compositeAggregations[props.componentId],
	themePreset: state.config.themePreset,
	isLoading: !!state.isLoading[`${props.componentId}_active`],
	error: state.error[props.componentId],
	enableAppbase: state.config.enableAppbase,
	time: state.hits[props.componentId] && state.hits[props.componentId].time,
	total: state.hits[props.componentId] && state.hits[props.componentId].total,
	hidden: state.hits[props.componentId] && state.hits[props.componentId].hidden,
});

const mapDispatchtoProps = dispatch => ({
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	triggerAnalytics: (searchPosition, documentId) =>
		dispatch(recordSuggestionClick(searchPosition, documentId)),
	setCustomQuery: (component, query) => dispatch(setCustomQuery(component, query)),
	setDefaultQuery: (component, query) => dispatch(setDefaultQuery(component, query)),
});

const ConnectedComponent = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(
	withTheme(props => (
		<ComponentWrapper {...props} internalComponent componentType={componentTypes.searchBox}>
			{() => <SearchBox ref={props.myForwardedRef} {...props} />}
		</ComponentWrapper>
	)),
);

// eslint-disable-next-line
const ForwardRefComponent = React.forwardRef((props, ref) => (
	<ConnectedComponent {...props} myForwardedRef={ref} />
));
hoistNonReactStatics(ForwardRefComponent, SearchBox);

ForwardRefComponent.displayName = 'SearchBox';
export default ForwardRefComponent;
