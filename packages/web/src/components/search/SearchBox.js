/** @jsx jsx */
import {
	componentTypes,
	SEARCH_COMPONENTS_MODES,
} from '@appbaseio/reactivecore/lib/utils/constants';
import { getInternalComponentID } from '@appbaseio/reactivecore/lib/utils/transform';
import { jsx } from '@emotion/core';
import { withTheme } from 'emotion-theming';
import { oneOf, oneOfType } from 'prop-types';
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
	isEqual,
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
import PreferencesConsumer from '../basic/PreferencesConsumer';
import ComponentWrapper from '../basic/ComponentWrapper';
import InputGroup from '../../styles/InputGroup';
import InputWrapper from '../../styles/InputWrapper';
import InputAddon from '../../styles/InputAddon';
import IconGroup from '../../styles/IconGroup';
import IconWrapper from '../../styles/IconWrapper';
import SearchSvg from '../shared/SearchSvg';
import { TagItem, TagsContainer } from '../../styles/Tags';
import Container from '../../styles/Container';
import Title from '../../styles/Title';
import Input, { searchboxSuggestions, suggestionsContainer } from '../../styles/Input';
import Button from '../../styles/Button';
import SuggestionItem from './addons/SuggestionItem';
import {
	connect,
	decodeHtml,
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
		customEvents,
	} = props;

	const internalComponent = getInternalComponentID(componentId);
	const [currentValue, setCurrentValue] = useState('');
	// eslint-disable-next-line prefer-const
	let [selectedTags, setSelectedTags] = useState([]);
	const [isOpen, setIsOpen] = useState(props.isOpen);
	const _inputRef = useRef(null);
	const isTagsMode = useRef(false);
	const stats = () => getResultStats(props);

	const parsedSuggestions = () => {
		let suggestionsArray = [];
		if (Array.isArray(props.suggestions) && props.suggestions.length) {
			suggestionsArray = [...withClickIds(props.suggestions)];
		}

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
		let value = typeof paramValue !== 'string' ? currentValue : paramValue;
		if (isTagsMode.current) {
			value = paramValue;
		}
		let query = searchBoxDefaultQuery(
			`${value}${!isTagsMode.current && categoryValue ? ` in ${categoryValue}` : ''}`,
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
			...(!isTagsMode.current ? { category: categoryValue } : {}),
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
			if (isTagsMode.current && isEqual(value, selectedTags)) {
				return;
			}
			let newSelectedTags = [];
			let newCurrentValue = decodeHtml(value);
			if (hasMounted) {
				if (isTagsMode.current && cause === causes.SUGGESTION_SELECT) {
					if (Array.isArray(selectedTags) && selectedTags.length) {
						// check if value already present in selectedTags
						if (typeof value === 'string' && selectedTags.includes(value)) {
							setIsOpen(false);
							return;
						}

						if (typeof value === 'string' && !!value) {
							newSelectedTags = [...selectedTags, value];
						} else if (Array.isArray(value) && !isEqual(selectedTags, value)) {
							const mergedArray = Array.from(new Set([...selectedTags, ...value]));
							newSelectedTags = mergedArray;
						}
					} else if (value) {
						newSelectedTags = typeof value !== 'string' ? value : [...value];
					}
					newCurrentValue = '';
					setSelectedTags(newSelectedTags);
				} else {
					newCurrentValue = decodeHtml(value);
				}

				if (toggleIsOpen) setIsOpen(!isOpen);
				setCurrentValue(newCurrentValue);

				let queryHandlerValue = value;
				if (isTagsMode.current && cause === causes.SUGGESTION_SELECT) {
					queryHandlerValue
						= Array.isArray(newSelectedTags) && newSelectedTags.length
							? newSelectedTags
							: undefined;
				}

				if (isDefaultValue) {
					if (props.autosuggest) {
						triggerQuery({
							...(toggleIsOpen && { isOpen: !isOpen }),
							defaultQuery: false,
							value,
						});

						triggerDefaultQuery(newCurrentValue);
					}
					// in case of strict selection only SUGGESTION_SELECT should be able
					// to set the query otherwise the value should reset
					if (setValueProps.strictSelection) {
						if (
							cause === causes.SUGGESTION_SELECT
							|| (isTagsMode.current ? newSelectedTags.length === 0 : value === '')
						) {
							triggerCustomQuery(
								queryHandlerValue,
								isTagsMode.current ? undefined : categoryValue,
							);
						} else {
							setValue('', true);
						}
					} else if (
						props.value === undefined
						|| cause === causes.SUGGESTION_SELECT
						|| cause === causes.CLEAR_VALUE
					) {
						triggerCustomQuery(
							queryHandlerValue,
							isTagsMode.current ? undefined : categoryValue,
						);
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
					categoryValue: isTagsMode.current ? undefined : categoryValue,
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
				func(e, ({ isOpen } = { isOpen: false }) => setValue(props.value, !isOpen, props));
		}
		return undefined;
	};

	const handleFeaturedSuggestionClicked = (suggestion) => {
		try {
			if (suggestion.action === featuredSuggestionsActionTypes.NAVIGATE) {
				const { target = '_self', link = '/' } = JSON.parse(suggestion.subAction);

				if (typeof window !== 'undefined') {
					window.open(link, target);
				}
			}
			if (suggestion.action === featuredSuggestionsActionTypes.FUNCTION) {
				// eslint-disable-next-line no-new-func
				const func = new Function(`return ${suggestion.subAction}`)();
				func(suggestion, currentValue, customEvents);
			}
			// blur is important to close the dropdown
			// on selecting one of featured suggestions
			// else Downshift probably is focusing the dropdown
			// and not letting it close
			_inputRef.current.blur();
		} catch (e) {
			console.error(
				`Error: There was an error parsing the subAction for the featured suggestion with label, "${suggestion.label}"`,
				e,
			);
		}
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
			let emitValue = suggestionValue;
			if (isTagsMode.current) {
				emitValue = Array.isArray(selectedTags) ? [...selectedTags] : [];
				if (selectedTags && selectedTags.includes(suggestionValue)) {
					// avoid duplicates in tags array
					setIsOpen(false);
					return;
				}
				emitValue.push(suggestionValue);
			}
			setValue(
				emitValue,
				true,
				props,
				causes.SUGGESTION_SELECT,
				true,
				false,
				suggestion._category,
			);
			onChange(emitValue, () =>
				triggerQuery({
					customQuery: true,
					value: emitValue,
					isOpen: false,
					...(!isTagsMode.current && { categoryValue: suggestion._category }),
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
				({ isOpen } = {}) => {
					triggerQuery({
						customQuery: true,
						value: inputValue,
						isOpen,
					});
				},
				e,
			);
		}
	};
	const enterButtonOnClick = () =>
		triggerQuery({ isOpen: false, value: currentValue, customQuery: true });

	const handleKeyDown = (event, highlightedIndex = null) => {
		// if a suggestion was selected, delegate the handling
		// to suggestion handler
		if (event.key === 'Enter') {
			if (props.autosuggest === false) {
				enterButtonOnClick();
			} else if (highlightedIndex === null) {
				setValue(
					event.target.value,
					true,
					props,
					isTagsMode.current ? causes.SUGGESTION_SELECT : undefined,
				);
				onValueSelected(event.target.value, causes.ENTER_PRESS);
			}
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
		const { addonBefore, expandSuggestionsContainer } = props;
		if (addonBefore) {
			return (
				<InputAddon isOpen={isOpen} expandSuggestionsContainer={expandSuggestionsContainer}>
					{addonBefore}
				</InputAddon>
			);
		}

		return null;
	};
	const renderInputAddonAfter = () => {
		const { addonAfter, expandSuggestionsContainer } = props;
		if (addonAfter) {
			return (
				<InputAddon isOpen={isOpen} expandSuggestionsContainer={expandSuggestionsContainer}>
					{addonAfter}
				</InputAddon>
			);
		}

		return null;
	};

	const renderEnterButtonElement = () => {
		const { enterButton, renderEnterButton, innerClass } = props;

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
		const { value } = suggestion;
		setIsOpen(true);
		setCurrentValue(decodeHtml(value));
		triggerDefaultQuery(value);
	};

	const hasMounted = useRef();
	useConstructor(() => {
		const { mode } = props;
		if (mode === SEARCH_COMPONENTS_MODES.TAG) {
			isTagsMode.current = true;
		}

		if (isTagsMode.current) {
			console.warn(
				'Warning(ReactiveSearch): The `categoryField` prop is not supported when `mode` prop is set to `tag`',
			);
		}
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
		setCurrentValue(isTagsMode.current ? '' : decodeHtml(currentLocalValue));
		if (isTagsMode.current && Array.isArray(currentLocalValue)) {
			setSelectedTags(currentLocalValue);
		}
		// Set custom and default queries in store
		triggerCustomQuery(currentLocalValue, selectedCategory);
		triggerDefaultQuery(currentLocalValue);
	});
	const clearTag = (tagValue) => {
		const newSelectedTags = [...selectedTags.filter(tag => tag !== tagValue)];
		setSelectedTags(newSelectedTags);
		setCurrentValue('');
		triggerCustomQuery(newSelectedTags);

		if (props.value !== undefined && typeof onChange === 'function') {
			onChange(newSelectedTags, ({ isOpen } = {}) =>
				triggerQuery({
					customQuery: true,
					value: newSelectedTags,
					isOpen,
				}),
			);
		}
	};
	const clearAllTags = () => {
		setSelectedTags([]);

		setValue('', true, props, causes.SUGGESTION_SELECT, hasMounted.current, false);
		if (props.value !== undefined && typeof onChange === 'function') {
			onChange([], ({ isOpen } = {}) =>
				triggerQuery({
					customQuery: true,
					value: [],
					isOpen,
				}),
			);
		}
	};

	const renderTag = (item) => {
		const { innerClass } = props;

		return (
			<TagItem key={item} className={getClassName(innerClass, 'selected-tag') || ''}>
				<span>{item}</span>
				{/* eslint-disable jsx-a11y/no-noninteractive-element-interactions,
				 jsx-a11y/click-events-have-key-events */}
				<span
					role="img"
					aria-label="delete-tag"
					className="close-icon"
					onClick={() => clearTag(item)}
				>
					<CancelSvg />
				</span>
				{/* eslint-enable jsx-a11y/no-noninteractive-element-interactions,
				jsx-a11y/click-events-have-key-events */}
			</TagItem>
		);
	};

	const renderTags = () => {
		if (!Array.isArray(selectedTags)) {
			return null;
		}
		const tagsList = [...selectedTags];
		const shouldRenderClearAllTag = tagsList.length > 1;
		const { renderSelectedTags, innerClass } = props;

		return renderSelectedTags ? (
			renderSelectedTags({
				values: selectedTags,
				handleClear: clearTag,
				handleClearAll: clearAllTags,
			})
		) : (
			<TagsContainer>
				{tagsList.map(item => renderTag(item))}
				{shouldRenderClearAllTag && (
					<TagItem class={getClassName(innerClass, 'selected-tag') || ''}>
						<span>Clear All</span>
						{/* eslint-disable jsx-a11y/no-noninteractive-element-interactions,
				 jsx-a11y/click-events-have-key-events */}
						<span
							role="img"
							aria-label="delete-tag"
							className="close-icon"
							onClick={clearAllTags}
						>
							<CancelSvg />
						</span>{' '}
						{/* eslint-enable jsx-a11y/no-noninteractive-element-interactions,
				jsx-a11y/click-events-have-key-events */}
					</TagItem>
				)}
			</TagsContainer>
		);
	};
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
			if (
				value !== undefined
				&& !isEqual(value, isTagsMode.current ? selectedTags : currentValue)
			) {
				let cause = !value ? causes.CLEAR_VALUE : undefined;
				if (isTagsMode.current) {
					cause = causes.SUGGESTION_SELECT;
				}

				if (isTagsMode.current && typeof value === 'string') {
					setValue(value, false, props, undefined, true, false);
					setCurrentValue(value);
					triggerDefaultQuery();
					return;
				}

				setValue(
					value,
					!isOpen && props.autosuggest && !props.strictSelection,
					props,
					cause,
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
			&& !isEqual(isTagsMode.current ? selectedTags : currentValue, selectedValue)
			&& !(typeof currentValue !== 'string' && !selectedValue)
		) {
			if (!selectedValue && currentValue) {
				// selected value is cleared, call onValueSelected
				onValueSelected('', causes.CLEAR_VALUE, null);
			}
			if (isTagsMode.current && Array.isArray(selectedValue)) {
				selectedTags = []; // reset
			}
			if (value === undefined) {
				setValue(
					!selectedValue || isEmpty(selectedValue) ? '' : selectedValue,
					true,
					props,
					isTagsMode.current ? causes.SUGGESTION_SELECT : undefined,
					hasMounted.current,
					false,
				);
			} else if (onChange) {
				if (
					!isEqual(value, selectedValue)
					&& !isEqual(selectedValue, isTagsMode.current ? selectedTags : currentValue)
				) {
					if (isTagsMode.current && typeof selectedValue !== 'string') {
						setSelectedTags(selectedValue);
					}
					// value prop exists
					onChange(selectedValue || (isTagsMode.current ? [] : ''), ({ isOpen } = {}) =>
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

				setValue(
					isTagsMode.current ? selectedTags : currentValue,
					true,
					props,
					isTagsMode.current ? causes.SUGGESTION_SELECT : undefined,
					true,
					false,
				);
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
										return (
											<img
												style={{ maxHeight: '25px' }}
												src={XSS(item.iconURL)}
												alt={item.value}
											/>
										);

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
															{sectionHtml && (
																<div
																	className={`section-header ${getClassName(
																		props.innerClass,
																		'section-label',
																	)}`}
																	dangerouslySetInnerHTML={{
																		__html: sectionHtml,
																	}}
																/>
															)}
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
																				justifyContent:
																					'flex-start',
																				alignItems:
																					'center',
																			}}
																			className={`${
																				highlightedIndex
																				=== index + sectionIndex
																					? `active-li-item ${getClassName(
																						props.innerClass,
																						'active-suggestion-item',
																					  )}`
																					: `li-item ${getClassName(
																						props.innerClass,
																						'suggestion-item',
																					  )}`
																			}`}
																		>
																			{props.renderItem ? (
																				props.renderItem(
																					sectionItem,
																				)
																			) : (
																				<React.Fragment>
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
																								sectionIndex
																								+ index
																								+ 1
																							}-${
																								sectionItem.value
																							}-icon`}
																							className={
																								getClassName(
																									props.innerClass,
																									`${sectionItem._suggestion_type}-search-icon`,
																								)
																								|| null
																							}
																							icon={getIcon(
																								sectionItem._suggestion_type,
																								sectionItem,
																							)}
																							type={`${sectionItem._suggestion_type}-search-icon`}
																						/>
																					</div>
																					<div className="trim">
																						<Flex direction="column">
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
																					</div>
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
															justifyContent: 'flex-start',
															alignItems: 'center',
														}}
														className={`${
															highlightedIndex === index
																? `active-li-item ${getClassName(
																	props.innerClass,
																	'active-suggestion-item',
																  )}`
																: `li-item ${getClassName(
																	props.innerClass,
																	'suggestion-item',
																  )}`
														}`}
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
											searchBox // a prop specific to Input styled-component
											isOpen={isOpen} // is dropdown open or not
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
								{renderTags()}
							</div>
						);
					}}
					{...props.downShiftProps}
				/>
			) : (
				<div css={suggestionsContainer}>
					<InputGroup isOpen={false}>
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
								onKeyDown={handleKeyDown}
								onKeyUp={withTriggerQuery(props.onKeyUp)}
								autoFocus={props.autoFocus}
								iconPosition={props.iconPosition}
								showIcon={props.showIcon}
								showClear={props.showClear}
								themePreset={props.themePreset}
								searchBox // a prop specific to Input styled-component
								isOpen={false} // is dropdown open or not
								type={props.type}
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
	defaultValue: oneOfType([types.string, types.stringArray]),
	value: oneOfType([types.string, types.stringArray]),
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
	customEvents: types.componentObject,
	searchboxId: types.string,
	mode: oneOf(['select', 'tag']),
	renderSelectedTags: types.func,
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
	type: 'search',
	mode: 'single',
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
	customEvents: state.config.analyticsConfig ? state.config.analyticsConfig.customEvents : {},
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
)(withTheme(props => <SearchBox ref={props.myForwardedRef} {...props} />));

// eslint-disable-next-line
const ForwardRefComponent = React.forwardRef((props, ref) => (
	<PreferencesConsumer userProps={props}>
		{preferenceProps => (
			<ComponentWrapper
				{...preferenceProps}
				internalComponent
				componentType={componentTypes.searchBox}
				mode={preferenceProps.testMode ? 'test' : ''}
			>
				{() => <ConnectedComponent {...preferenceProps} myForwardedRef={ref} />}
			</ComponentWrapper>
		)}
	</PreferencesConsumer>
));
hoistNonReactStatics(ForwardRefComponent, SearchBox);

ForwardRefComponent.displayName = 'SearchBox';
export default ForwardRefComponent;
