/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/core';
import styled from '@emotion/styled';
import {
	AI_LOCAL_CACHE_KEY,
	AI_TRIGGER_MODES,
	componentTypes,
	SEARCH_COMPONENTS_MODES,
} from '@appbaseio/reactivecore/lib/utils/constants';
import { getInternalComponentID } from '@appbaseio/reactivecore/lib/utils/transform';
import { Remarkable } from 'remarkable';
import { withTheme } from 'emotion-theming';
import { oneOf, oneOfType, string } from 'prop-types';
import causes from '@appbaseio/reactivecore/lib/utils/causes';
import {
	debounce,
	checkValueChange,
	getClassName,
	getResultStats,
	withClickIds,
	updateCustomQuery,
	updateDefaultQuery,
	getComponent as getComponentUtilFunc,
	isFunction,
	hasCustomRenderer,
	suggestionTypes,
	featuredSuggestionsActionTypes,
	isEqual,
	getObjectFromLocalStorage,
} from '@appbaseio/reactivecore/lib/utils/helper';
import Downshift from 'downshift';
import hoistNonReactStatics from 'hoist-non-react-statics';
import React, { useState, useEffect, useRef, Fragment } from 'react';
import types from '@appbaseio/reactivecore/lib/utils/types';
import {
	updateQuery,
	recordSuggestionClick,
	setCustomQuery,
	setDefaultQuery,
} from '@appbaseio/reactivecore/lib/actions';
import { removeAIResponse } from '@appbaseio/reactivecore/lib/actions/misc';
import hotkeys from 'hotkeys-js';
import XSS from 'xss';
import { recordAISessionUsefulness } from '@appbaseio/reactivecore/lib/actions/analytics';
import PreferencesConsumer from '../basic/PreferencesConsumer';
import ComponentWrapper from '../basic/ComponentWrapper';
import InputGroup from '../../styles/InputGroup';
import InputWrapper from '../../styles/InputWrapper';
import InputAddon from '../../styles/InputAddon';
import IconGroup from '../../styles/IconGroup';
import IconWrapper, { ButtonIconWrapper } from '../../styles/IconWrapper';
import SearchSvg from '../shared/SearchSvg';
import { TagItem, TagsContainer } from '../../styles/Tags';
import Container from '../../styles/Container';
import Title from '../../styles/Title';
import { searchboxSuggestions, suggestionsContainer, TextArea } from '../../styles/Input';
import Button from '../../styles/Button';
import SuggestionItem from './addons/SuggestionItem';
import {
	connect,
	decodeHtml,
	extractModifierKeysFromFocusShortcuts,
	isEmpty,
	parseFocusShortcuts,
} from '../../utils';
import Mic from './addons/Mic';
import CancelSvg from '../shared/CancelSvg';
import CustomSvg from '../shared/CustomSvg';
import SuggestionWrapper from './addons/SuggestionWrapper';
import AutofillSvg from '../shared/AutofillSvg';
import Flex from '../../styles/Flex';
import AutosuggestFooterContainer from '../../styles/AutoSuggestFooterContainer';
import HOOKS from '../../utils/hooks';
import { Answer, Footer, SearchBoxAISection, SourceTags } from '../../styles/SearchBoxAI';
import TypingEffect from '../shared/TypingEffect';
import HorizontalSkeletonLoader from '../shared/HorizontalSkeletonLoader';
import AIFeedback from '../shared/AIFeedback';
import { ImageDropdown } from './addons/ImageDropdown';
import { innerText } from '../shared/innerText';
import TextWithTooltip from './addons/TextWithTooltip';

const md = new Remarkable();

md.set({
	html: true,
	breaks: true,
	xhtmlOut: true,
	linkify: true,
	linkTarget: '_blank',
});

const { useConstructor } = HOOKS;

const CameraIcon = ({ onClick, title }) => (
	<IconWrapper onClick={onClick} title={title}>
		<svg fill="currentColor" width="30px" height="30px" viewBox="0 -2 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" >
			<g id="Page-1" stroke="none" strokeWidth="1" fillRule="evenodd" >
				<g id="Icon-Set-Filled" transform="translate(-258.000000, -467.000000)" >
					<path d="M286,471 L283,471 L282,469 C281.411,467.837 281.104,467 280,467 L268,467 C266.896,467 266.53,467.954 266,469 L265,471 L262,471 C259.791,471 258,472.791 258,475 L258,491 C258,493.209 259.791,495 262,495 L286,495 C288.209,495 290,493.209 290,491 L290,475 C290,472.791 288.209,471 286,471 Z M274,491 C269.582,491 266,487.418 266,483 C266,478.582 269.582,475 274,475 C278.418,475 282,478.582 282,483 C282,487.418 278.418,491 274,491 Z M274,477 C270.687,477 268,479.687 268,483 C268,486.313 270.687,489 274,489 C277.313,489 280,486.313 280,483 C280,479.687 277.313,477 274,477 L274,477 Z" id="camera" />
				</g>
			</g>
		</svg>
	</IconWrapper>
);

CameraIcon.propTypes = {
	fill: string,
	title: string,
	onClick: types.func,
};

CameraIcon.defaultProps = {
	fill: 'blue',
};

const Thumbnail = styled.img`
	width: 30px;
	height: 30px;
`;

/**
 * inputValue:
 * The value which is passed to the html input box.
 * The onChange handler(event listener on input box) should directly update inputValue.
 *
 * For uncontrolled components, we maintain the input value(useState - currentValue).
 * Hence, onChange should call setValue to update currentValue directly.
 *
 * For controlled components, we get the input value(props.value).
 * Hence, onChange should call props.onChange,
 * which then updates currentValue by calling setValue in useEffect.
 */

const SearchBox = (props) => {
	const {
		selectedValue,
		selectedImageValue,
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
		showSuggestionsFooter,
		renderSuggestionsFooter,
		isAITyping,
	} = props;

	const currentTriggerMode
		= (props.AIUIConfig && props.AIUIConfig.triggerOn) || AI_TRIGGER_MODES.MANUAL;
	let renderTriggerMessage
		= props.enableAI && props.AIUIConfig && props.AIUIConfig.renderTriggerMessage
			? props.AIUIConfig.renderTriggerMessage
			: null;
	if (
		props.enableAI
		&& !renderTriggerMessage
		&& currentTriggerMode === AI_TRIGGER_MODES.MANUAL
		&& (props.AIUIConfig ? !props.AIUIConfig.askButton : true)
	) {
		renderTriggerMessage = 'Click to trigger AIAnswer';
	}

	const internalComponent = getInternalComponentID(componentId);
	const [currentValue, setCurrentValue] = useState('');
	// eslint-disable-next-line prefer-const
	let [selectedTags, setSelectedTags] = useState([]);
	const [isOpen, setIsOpen] = useState(props.isOpen);
	const _inputRef = useRef(null);
	const _inputGroupRef = useRef(null);
	const _dropdownULRef = useRef(null);
	const isTagsMode = useRef(false);
	const prevPropsRefIsAITyping = useRef(undefined);

	const stats = () => getResultStats(props);

	const [showAIScreen, setShowAIScreen] = useState(false);
	const [faqAnswer, setFAQAnswer] = useState('');
	const [faqQuestion, setFAQQuestion] = useState('');
	const [showAIScreenFooter, setShowAIScreenFooter] = useState(false);
	const [showTypingEffect, setShowTypingEffect] = useState(true);
	const [showFeedbackComponent, setShowFeedbackComponent] = useState(false);
	const [feedbackState, setFeedbackState] = useState(null);
	const [initialHits, setInitialHits] = useState(null);
	const [sourceDocIds, setSourceDocIds] = useState(null);
	const [isUserScrolling, setIsUserScrolling] = useState(false);
	const [lastScrollTop, setLastScrollTop] = useState(0);
	const [showImageDropdown, setShowImageDropdown] = useState(false);
	const [currentImageValue, setCurrentImageValue] = useState('');

	const mergedAIAnswer
		= faqAnswer
		|| (props.AIResponse
			&& props.AIResponse.response
			&& props.AIResponse.response.answer
			&& props.AIResponse.response.answer.text);
	const mergedAIQuestion
		= faqQuestion
		|| (props.AIResponse && props.AIResponse.response && props.AIResponse.response.question);

	const parsedSuggestions = () => {
		let suggestionsArray = [];
		if (Array.isArray(props.suggestions) && props.suggestions.length) {
			suggestionsArray = [...withClickIds(props.suggestions)];
		}
		if (renderTriggerMessage && currentValue) {
			suggestionsArray.unshift({
				label: renderTriggerMessage,
				value: renderTriggerMessage,
				_suggestion_type: '_internal_a_i_trigger',
			});
		}

		suggestionsArray = suggestionsArray.map((suggestion) => {
			if (suggestion._suggestion_type === suggestionTypes.Document) {
				// Document suggestions don't have a meaningful label and value
				const newSuggestion = { ...suggestion };
				newSuggestion.label = 'For document suggestions, please implement a renderItem method to display label.';
				if (typeof props.renderItem === 'function') {
					const jsxEl = props.renderItem(newSuggestion);
					const innerValue = innerText(jsxEl);
					newSuggestion.value = XSS(innerValue);
				}
				return newSuggestion;
			}
			return suggestion;
		});

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

	const handleShowImageDropdown = (e, nextState) => {
		// Image dropdown calls onOutsideClick if below is not stopped
		// which changes the state again and hides the dropdown
		e.stopPropagation();
		if (nextState) {
			setIsOpen(false);
			setShowImageDropdown(true);
		} else {
			setShowImageDropdown(false);
		}
	};
	const handleSuggestionOpen = (nextState) => {
		if (nextState) {
			setIsOpen(true);
			setShowImageDropdown(false);
		} else {
			setIsOpen(false);
		}
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

	const searchBoxDefaultQuery = (value, props) => ({
		query: {
			queryFormat: props.queryFormat,
			dataField: props.dataField,
			value,
			nestedField: props.nestedField,
			queryString: props.queryString,
			searchOperators: props.searchOperators,
		},
	});

	// fires query to fetch suggestion
	const triggerDefaultQuery = (paramValue, meta = {}, shouldExecuteQuery = true) => {
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
		props.updateQuery(
			{
				componentId: internalComponent,
				query,
				value,
				componentType: componentTypes.searchBox,
				meta,
			},
			shouldExecuteQuery,
		);
	};

	// fires query to fetch results(dependent components are affected here)
	const triggerCustomQuery = (
		paramValue,
		categoryValue = undefined,
		shouldExecuteQuery = true,
		meta = {},
	) => {
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
		props.updateQuery(
			{
				componentId,
				value,
				query,
				label: filterLabel,
				showFilter,
				URLParams,
				componentType: componentTypes.searchBox,
				meta,
				...(!isTagsMode.current ? { category: categoryValue } : {}),
			},
			shouldExecuteQuery,
		);
	};

	const triggerQuery = (
		{
			isOpen = undefined,
			customQuery = false,
			defaultQuery = false,
			value = undefined,
			categoryValue = undefined,
			meta = {},
		} = {},
		shouldExecuteQuery = true,
	) => {
		if (typeof isOpen === 'boolean') {
			handleSuggestionOpen(isOpen);
		}

		if (customQuery) {
			triggerCustomQuery(value, categoryValue, shouldExecuteQuery, meta);
		}
		if (defaultQuery) {
			triggerDefaultQuery(value, meta, shouldExecuteQuery);
		}
	};

	const onValueSelected = (valueSelected = currentValue, cause, suggestion = null) => {
		const { onValueSelected } = props;
		if (onValueSelected) {
			onValueSelected(valueSelected, cause, suggestion);
		}
	};
	const handleTextChange = useRef(
		debounce((valueParam = undefined, cause = undefined) => {
			const { enterButton } = props;
			if (cause === causes.CLEAR_VALUE) {
				triggerCustomQuery(valueParam);
				triggerDefaultQuery(valueParam);
			} else if (props.autosuggest) {
				triggerDefaultQuery(valueParam);
			} else if (value === undefined && !onChange && !enterButton) {
				triggerCustomQuery(valueParam);
			}
		}, props.debounce),
	);

	// Make a search query when value is changed
	const setValue = (
		value,
		isDefaultValue = false,
		setValueProps = props,
		cause,
		hasMounted = true,
		toggleIsOpen = true,
		categoryValue = undefined,
		shouldExecuteQuery = true,
		meta = {},
	) => {
		const performUpdate = () => {
			// It may happen that imageValue is passed as an empty string to clear the input
			const imageValue = meta && meta.imageValue !== undefined
				? meta.imageValue : currentImageValue;
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
							handleSuggestionOpen(false);
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

				if (toggleIsOpen) handleSuggestionOpen(!isOpen);
				setCurrentValue(newCurrentValue);
				setCurrentImageValue(imageValue);

				let queryHandlerValue = value;
				if (isTagsMode.current && cause === causes.SUGGESTION_SELECT) {
					queryHandlerValue
						= Array.isArray(newSelectedTags) && newSelectedTags.length
							? newSelectedTags
							: undefined;
				}

				if ((faqAnswer || faqQuestion) && value === '') {
					// Reset state for FAQ answer.
					// If an FAQ suggestion is selected,
					// they can set below values after the setValue call.
					setFAQAnswer('');
					setFAQQuestion('');
					setShowAIScreen(false);
				}
				if (value === '') {
					setShowAIScreen(false);
					props.removeAIResponse(componentId);
				}
				if (isDefaultValue) {
					if (props.autosuggest) {
						triggerQuery(
							{
								...(toggleIsOpen && { isOpen: !isOpen }),
								defaultQuery: false,
								value,
							},
							shouldExecuteQuery,
						);

						triggerDefaultQuery(
							newCurrentValue,
							props.enableAI
								&& currentTriggerMode === AI_TRIGGER_MODES.QUESTION
								&& newCurrentValue.endsWith('?')
								? { enableAI: true }
								: { imageValue },
							shouldExecuteQuery,
						);
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
								shouldExecuteQuery,
								{
									...meta,
									// vectorDataField is passed by the user of SearchBox
									// currentImageValue is stored by the SearchBox component
									imageValue,
								},
							);
						} else {
							setValue('', true);
						}
					} else if (
						props.value === undefined
						|| cause === causes.SUGGESTION_SELECT
						|| cause === causes.CLEAR_VALUE
						|| cause === causes.ENTER_PRESS
						|| cause === causes.SEARCH_ICON_CLICK
					) {
						triggerCustomQuery(
							queryHandlerValue,
							isTagsMode.current ? undefined : categoryValue,
							shouldExecuteQuery,
							{
								...meta,
								// vectorDataField is passed by the user of SearchBox
								// currentImageValue is stored by the SearchBox component
								imageValue,
							},
						);
					}
				} else {
					// debounce for handling text while typing
					handleTextChange.current(value, cause);
				}
				if (setValueProps.onValueChange) setValueProps.onValueChange(value);
			} else {
				triggerQuery(
					{
						defaultQuery: props.autosuggest,
						customQuery: true,
						value,
						categoryValue: isTagsMode.current ? undefined : categoryValue,
					},
					shouldExecuteQuery,
				);
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
			if (suggestion.action === featuredSuggestionsActionTypes.SELECT) {
				setValue(
					suggestion.value,
					true,
					props,
					isTagsMode.current ? causes.SUGGESTION_SELECT : causes.ENTER_PRESS,
				);
				onValueSelected(suggestion.value, causes.SUGGESTION_SELECT);
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

	const askButtonOnClick = () => {
		setShowAIScreen(true);
		handleSuggestionOpen(true);
		triggerDefaultQuery(currentValue, { enableAI: true });
	};

	const onSuggestionSelected = (suggestion) => {
		const suggestionValue = suggestion.value;
		// handle when FAQ suggestion is clicked
		if (suggestion && suggestion._suggestion_type === suggestionTypes.FAQ) {
			setCurrentValue(suggestion.value);
			setFAQAnswer(suggestion._answer);
			setFAQQuestion(suggestion.value);
			setShowAIScreen(true);
			if (onChange) {
				onChange(suggestion.value, () => {});
			}
			if (onValueSelected) {
				onValueSelected(suggestionValue);
			}
			return;
		} else if (suggestion && suggestion._suggestion_type === '_internal_a_i_trigger') {
			setShowAIScreen(true);
			askButtonOnClick();
			return;
		}

		if (!props.enableAI) handleSuggestionOpen(false);
		else if (
			currentTriggerMode === AI_TRIGGER_MODES.QUESTION
			&& suggestion.value.endsWith('?')
		) {
			setShowAIScreen(true);
		}
		// handle featured suggestions click event
		if (suggestion._suggestion_type === suggestionTypes.Featured) {
			handleFeaturedSuggestionClicked(suggestion);
			return;
		}

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
					handleSuggestionOpen(false);
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
	const handleTextAreaHeightChange = () => {
		const textArea = _inputRef.current;
		const inputGroupEle = _inputGroupRef.current;
		if (textArea) {
			textArea.style.height = '42px';
			const lineHeight = parseInt(getComputedStyle(textArea).lineHeight, 10);
			const maxHeight = lineHeight * 4; // max height for 3 lines
			const height = Math.min(textArea.scrollHeight, maxHeight);
			textArea.style.height = `${height}px`;
			textArea.style.overflowY = height === maxHeight ? 'auto' : 'hidden';
			if (inputGroupEle) {
				inputGroupEle.style.height = `${textArea.style.height}`;
			}
			if (_dropdownULRef && _dropdownULRef.current) {
				_dropdownULRef.current.style.top = `${textArea.style.height}`;
			}
		}
	};

	const handleInputChange = (inputValue, e) => {
		if (!isOpen && props.autosuggest) {
			handleSuggestionOpen(true);
		}
		if (showAIScreen) {
			setShowAIScreen(false);
		}
		if (value === undefined) {
			setValue(inputValue, inputValue === '', props, undefined, true, false);
		} else if (onChange) {
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
	const onInputChange = (e) => {
		const { value: inputValue } = e.target;

		handleInputChange(inputValue, e);
	};

	const enterButtonOnClick = () => {
		setShowAIScreen(false);
		triggerQuery({ isOpen: false, value: currentValue, customQuery: true });
	};

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
					isTagsMode.current ? causes.SUGGESTION_SELECT : causes.ENTER_PRESS,
					true,
					!props.enableAI,
				);
				if (props.enableAI) {
					if (currentTriggerMode === AI_TRIGGER_MODES.QUESTION) {
						if (event.target.value.endsWith('?')) {
							setShowAIScreen(true);
							handleSuggestionOpen(true);
						} else {
							setShowAIScreen(false);
							handleSuggestionOpen(false);
						}
					} else {
						setShowAIScreen(false);
						handleSuggestionOpen(false);
					}
				}
				onValueSelected(event.target.value, causes.ENTER_PRESS);
			}
		}

		if (props.onKeyDown) {
			props.onKeyDown(event, this.triggerQuery);
		}
	};

	const clearValue = () => {
		setValue(
			'',
			false,
			props,
			!isTagsMode.current ? causes.CLEAR_VALUE : undefined,
			true,
			true,
		);
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
			handleSuggestionOpen(isOpen);
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
			setValue(currentValue, true, props, causes.SEARCH_ICON_CLICK);
			onValueSelected(currentValue, causes.SEARCH_ICON_CLICK);
		}
	};

	const onVoiceResults = ({ results }) => {
		if (
			results
			&& results[0]
			&& results[0].isFinal
			&& results[0][0]
			&& results[0][0].transcript
			&& results[0][0].transcript.trim()
		) {
			setValue(results[0][0].transcript.trim(), false, props, undefined, true);
			_inputRef.current.focus();
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

	const renderError = (isAIError = false) => {
		const {
			error,
			renderError,
			themePreset,
			theme,
			isLoading,
			innerClass,
			AIResponseError,
			isAIResponseLoading,
		} = props;
		if (isAIError) {
			if (showAIScreen && AIResponseError && !isAIResponseLoading) {
				if (renderError) {
					return (
						<div
							className={`--ai-answer-error-container ${getClassName(
								props.innerClass,
								'ai-error',
							) || ''}`}
						>
							{isFunction(renderError) ? renderError(AIResponseError) : renderError}
						</div>
					);
				}
				return (
					<div
						className={`--ai-answer-error-container ${getClassName(
							props.innerClass,
							'ai-error',
						) || ''}`}
					>
						<div className="--default-error-element">
							<span>
								{AIResponseError.message
									? AIResponseError.message
									: 'There was an error in generating the response.'}{' '}
								{AIResponseError.code
									? `Code:
							${AIResponseError.code}`
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
	const handleFocus = (event) => {
		if (props.autosuggest) {
			handleSuggestionOpen(true);
		}
		if (props.onFocus) {
			props.onFocus(event, triggerQuery);
		}
	};

	const getAISourceObjects = () => {
		const sourceObjects = [];
		if (!props.AIResponse) return sourceObjects;
		const docIds = sourceDocIds || [];
		if (initialHits) {
			docIds.forEach((id) => {
				const foundSourceObj = initialHits.find(hit => hit._id === id) || {};
				if (foundSourceObj) {
					const { _source = {}, ...rest } = foundSourceObj;

					sourceObjects.push({ ...rest, ..._source });
				}
			});
		} else {
			sourceObjects.push(
				...docIds.map(id => ({
					_id: id,
				})),
			);
		}

		return sourceObjects;
	};

	const getComponent = (downshiftProps = {}) => {
		const {
			error, isLoading, rawData, AIResponse,
		} = props;

		const data = {
			error,
			loading: isLoading,
			downshiftProps,
			data: props.suggestions,
			value: currentValue,
			triggerClickAnalytics,
			resultStats: stats(),
			rawData,
			AIData: {
				question: mergedAIQuestion,
				answer: mergedAIAnswer,
				documentIds:
					(AIResponse
						&& AIResponse.response
						&& AIResponse.response.answer
						&& AIResponse.response.answer.documentIds)
					|| [],
				showAIScreen,
				sources: getAISourceObjects(),
				isAILoading: props.isAIResponseLoading,
				AIError: props.AIResponseError,
			},
		};
		return <div ref={_dropdownULRef}>{getComponentUtilFunc(data, props)}</div>;
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

	const renderAskButtonElement = () => {
		const { AIUIConfig, innerClass } = props;
		const { askButton, renderAskButton } = AIUIConfig;
		if (askButton) {
			const getEnterButtonMarkup = () => {
				if (typeof renderAskButton === 'function') {
					return renderAskButton(askButtonOnClick);
				}

				return (
					<Button
						className={`enter-btn ${getClassName(innerClass, 'ask-button')}`}
						info
						onClick={askButtonOnClick}
					>
						Ask
					</Button>
				);
			};

			return <div className="enter-button-wrapper">{getEnterButtonMarkup()}</div>;
		}

		return null;
	};

	const renderIcon = () => {
		if (props.showIcon) {
			if (props.icon) {
				return props.icon;
			}
			if (props.iconURL) {
				return (
					<img style={{ maxHeight: '25px' }} src={XSS(props.iconURL)} alt="search-icon" />
				);
			}
			return <SearchSvg />;
		}
		return null;
	};

	const renderCancelIcon = () => {
		if (props.showClear) {
			return props.clearIcon || <CancelSvg />;
		}
		return null;
	};
	const renderShortcut = () => {
		if (props.focusShortcuts && props.focusShortcuts.length) {
			let shortcut = props.focusShortcuts[0];
			shortcut = shortcut.toLowerCase();
			shortcut = shortcut.replace('shift', '⬆️');
			shortcut = shortcut.replace('command', 'cmd');
			shortcut = shortcut.replace('control', 'ctrl');
			shortcut = shortcut.replace('option', 'alt');
			return shortcut.toUpperCase();
		}
		return '/';
	};

	const ThumbnailOrIcon = props.showImageSearch && currentImageValue ? (
		<Thumbnail
			src={currentImageValue}
			title="Click to view full image"
			onClick={e =>
				handleShowImageDropdown(e, !showImageDropdown)}
		/>
	) : (
		<CameraIcon
			title={props.imageSearchTooltip || 'Search by image'}
			onClick={(e) => {
				handleShowImageDropdown(e, !showImageDropdown);
			}}
		/>);

	const renderIcons = () => {
		const {
			showIcon,
			showClear,
			renderMic,
			getMicInstance,
			showVoiceSearch,
			iconPosition,
			innerClass,
			showFocusShortcutsIcon,
			enableAI,
		} = props;
		return (
			<div>
				<IconGroup enableAI={enableAI} groupPosition="right" positionType="absolute">
					{currentValue && showClear && (
						<IconWrapper
							enableAI={enableAI}
							onClick={clearValue}
							showIcon={showIcon}
							isClearIcon
						>
							{renderCancelIcon()}
						</IconWrapper>
					)}
					{showFocusShortcutsIcon && (
						<ButtonIconWrapper onClick={e => focusSearchBox(e)}>
							{renderShortcut()}
						</ButtonIconWrapper>
					)}
					{shouldMicRender(showVoiceSearch) && (
						<Mic
							getInstance={getMicInstance}
							render={renderMic}
							onResult={onVoiceResults}
							className={getClassName(innerClass, 'mic') || null}
						/>
					)}
					{props.showImageSearch ? (
						ThumbnailOrIcon
					) : null}
					{iconPosition === 'right' && (
						<IconWrapper enableAI={enableAI} onClick={handleSearchIconClick}>
							{renderIcon()}
						</IconWrapper>
					)}
				</IconGroup>

				<IconGroup enableAI={enableAI} groupPosition="left" positionType="absolute">
					{iconPosition === 'left' && (
						<IconWrapper enableAI={enableAI} onClick={handleSearchIconClick}>
							{renderIcon()}
						</IconWrapper>
					)}
				</IconGroup>
			</div>
		);
	};
	const SuggestionsFooter = () =>
		(typeof renderSuggestionsFooter === 'function' ? (
			renderSuggestionsFooter()
		) : (
			<AutosuggestFooterContainer>
				<div>↑↓ Navigate</div>
				<div>↩ Go</div>
			</AutosuggestFooterContainer>
		));

	const onAutofillClick = (suggestion) => {
		const { value } = suggestion;
		handleSuggestionOpen(true);
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
		if (!Array.isArray(selectedTags) || props.mode !== SEARCH_COMPONENTS_MODES.TAG) {
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

	const renderAIScreenFooter = () => {
		const { AIUIConfig = {} } = props;
		const { showSourceDocuments = true, onSourceClick = () => {} } = AIUIConfig || {};

		const renderSourceDocumentLabel = (sourceObj) => {
			if (props.AIUIConfig && props.AIUIConfig.renderSourceDocument) {
				return props.AIUIConfig.renderSourceDocument(sourceObj);
			}

			return sourceObj._id;
		};
		return (showSourceDocuments
			&& (showAIScreenFooter)
			&& Array.isArray(sourceDocIds) && sourceDocIds.length)
			|| (showSourceDocuments && props.testMode) ? (
				<Footer themePreset={props.themePreset}>
					Summary generated using the following sources:{' '}
					<SourceTags>
						{getAISourceObjects().map(el => (
							<Button
								className={`--ai-source-tag ${getClassName(
									props.innerClass,
									'ai-source-tag',
								) || ''}`}
								info
								onClick={() => onSourceClick && onSourceClick(el)}
								key={el._id}
							>
								{renderSourceDocumentLabel(el)}
							</Button>
						))}
					</SourceTags>
				</Footer>
			) : null;
	};

	const renderAIScreenLoader = () => {
		const { AIUIConfig = {} } = props;
		const { loaderMessage } = AIUIConfig || {};
		if (loaderMessage) {
			return loaderMessage;
		}

		return <HorizontalSkeletonLoader />;
	};


	// eslint-disable-next-line consistent-return
	useEffect(() => {
		if (_dropdownULRef.current) {
			const handleScroll = () => {
				const scrollTop = _dropdownULRef.current.scrollTop;
				setLastScrollTop(scrollTop);

				if (scrollTop < lastScrollTop) {
				// User is scrolling up
					setIsUserScrolling(true);
				} else {
				// User is scrolling down
					setIsUserScrolling(false);
				}

				// Update lastScrollTop with the current scroll position
				setLastScrollTop(scrollTop);
			};

			_dropdownULRef.current.addEventListener('scroll', handleScroll);

			return () => {
				if (_dropdownULRef.current)_dropdownULRef.current.removeEventListener('scroll', handleScroll);
			};
		}
	}, [lastScrollTop]);


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
		if (rawData && rawData.hits && rawData.hits.hits) {
			setInitialHits(rawData.hits.hits);
		}
	}, [rawData, aggregationData, isLoading, error]);

	/**
	 * For uncontrolled component,
	 * props.value would be changed directly,
	 * which then needs to update currentValue by calling setValue
	 */
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
			// When value is not controlled by the user
			if (value === undefined) {
				setValue(
					!selectedValue || isEmpty(selectedValue) ? '' : selectedValue,
					true,
					props,
					isTagsMode.current ? causes.SUGGESTION_SELECT : undefined,
					hasMounted.current,
					false,
					undefined,
					true,
					{ imageValue: props.showImageSearch ? selectedImageValue : undefined },
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
	}, [selectedValue, selectedImageValue]);

	useEffect(() => {
		if (showAIScreen) {
			if (_inputRef.current) {
				_inputRef.current.blur();
			}
			setShowTypingEffect(true);
		}
	}, [showAIScreen]);

	useEffect(() => {
		if (prevPropsRefIsAITyping.current === true && !isAITyping) {
			setShowAIScreenFooter(true);
			setShowFeedbackComponent(true);
		} else if (prevPropsRefIsAITyping.current === undefined && isAITyping) {
			prevPropsRefIsAITyping.current = true;
			setShowTypingEffect(false);
			setShowAIScreenFooter(false);
			setShowFeedbackComponent(false);
		}
	}, [isAITyping]);

	useEffect(() => {
		if (!(showAIScreen || props.isAIResponseLoading || props.isLoading) && showAIScreenFooter) {
			setShowAIScreenFooter(false);
			setShowFeedbackComponent(false);
		}
	}, [showAIScreen, props.isAIResponseLoading, props.AIResponse]);

	useEffect(() => {
		if (!isOpen) {
			setShowTypingEffect(false);
		}
	}, [isOpen]);

	useEffect(() => {
		handleTextAreaHeightChange();
	}, [currentValue, props.suggestions]);

	useEffect(() => {
		if (
			props.AIUIConfig
			&& props.AIUIConfig.showSourceDocuments
			&& props.AIResponse
			&& props.AIResponse.response
			&& props.AIResponse.response.answer
			&& Array.isArray(props.AIResponse.response.answer.documentIds)
		) {
			setSourceDocIds(props.AIResponse.response.answer.documentIds);

			const localCache
				= getObjectFromLocalStorage(AI_LOCAL_CACHE_KEY)
				&& getObjectFromLocalStorage(AI_LOCAL_CACHE_KEY)[props.componentId];
			if (
				localCache
				&& localCache.meta
				&& localCache.meta.hits
				&& localCache.meta.hits.hits
			) {
				setInitialHits(localCache.meta.hits.hits);
			}
		}
	}, [props.AIResponse]);

	useEffect(() => {
		if (props.mode !== SEARCH_COMPONENTS_MODES.TAG) {
			setSelectedTags(false);
			isTagsMode.current = false;
		} else { isTagsMode.current = true; }
	}, [props.mode]);

	useEffect(() => {
		hasMounted.current = true;
		// register hotkeys for listening to focusShortcuts' key presses
		listenForFocusShortcuts();
	}, []);

	// Set testing environment
	useEffect(() => {
		if (props.testMode) {
			setIsOpen(true);
			if (props.enableAI) {
				setShowAIScreen(true);
			}
		}
	}, []);

	const hasSuggestions = () => Array.isArray(parsedSuggestions()) && parsedSuggestions().length;
	return (
		<Container style={props.style} className={props.className}>
			{props.title && (
				<Title className={getClassName(props.innerClass, 'title') || ''}>
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

							const isTypingAIAnswer = showTypingEffect
							&& !isAITyping && !props.testMode;

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
									{/* When custom renderer(render prop) is passed,
									 it takes care of rendering the suggestion box. */}
									{isOpen && hasSuggestions() && !hasCustomRenderer(props) ? (
										<ul
											css={searchboxSuggestions(
												props.themePreset,
												props.theme,
											)}
											ref={_dropdownULRef}
											className={`${getClassName(props.innerClass, 'list')}`}
										>
											{showAIScreen ? (
												<SearchBoxAISection themePreset={props.themePreset}>
													{typeof props.renderAIAnswer === 'function' ? (
														props.renderAIAnswer({
															question: mergedAIQuestion,
															answer: mergedAIAnswer,
															documentIds:
																(props.AIResponse
																	&& props.AIResponse.response
																	&& props.AIResponse.response
																		.answer
																	&& props.AIResponse.response.answer
																		.documentIds)
																|| [],
															loading:
																props.isAIResponseLoading
																|| props.isLoading,
															sources: getAISourceObjects(),
															error: props.AIResponseError,
														})
													) : (
														<Fragment>
															{props.isAIResponseLoading
															|| props.isLoading ? (
																	renderAIScreenLoader()
																) : (
																	<Fragment>
																		<Answer>
																			<TypingEffect
																				key={currentValue}
																				message={md.render(
																					mergedAIAnswer,
																				)}
																				speed={5}
																				onTypingComplete={() => {
																					if (
																						prevPropsRefIsAITyping.current
																					=== undefined
																					) {
																						setShowAIScreenFooter(
																							true,
																						);
																					}
																					if (
																						(props.AIUIConfig
																					&& typeof props
																						.AIUIConfig
																						.showFeedback
																						=== 'boolean'
																							? props
																								.AIUIConfig
																								.showFeedback
																							: true)
																					&& showTypingEffect
																					) {
																						setShowFeedbackComponent(
																							true,
																						);
																					}

																					if (
																						mergedAIAnswer
																					) {
																						setShowTypingEffect(
																							false,
																						);
																					}

																					setTimeout(() => {
																						_dropdownULRef.current.scrollTo(
																							{
																								top:
																								_dropdownULRef
																									.current
																									.scrollHeight,
																								behavior:
																								'smooth',
																							},
																						);
																					}, 100);
																				}}
																				onWhileTyping={() => {
																					if (!isUserScrolling) {
																						_dropdownULRef.current.scrollTo({
																							top: _dropdownULRef.current.scrollHeight,
																							behavior: 'smooth',
																						});
																						setLastScrollTop(_dropdownULRef.current.scrollHeight);
																					}
																				}}
																				showTypingEffect={
																					isTypingAIAnswer
																				}
																			/>
																		</Answer>
																		{renderAIScreenFooter()}

																		{showFeedbackComponent && (
																			<div
																				className={`${getClassName(
																					props.innerClass,
																					'ai-feedback',
																				) || ''}`}
																			>
																				{' '}
																				<AIFeedback
																					overrideState={
																						feedbackState
																					}
																					hideUI={
																						props.isAIResponseLoading
																					|| props.isLoading
																					|| !props.sessionIdFromStore
																					}
																					key={
																						props.sessionIdFromStore
																					}
																					onFeedbackSubmit={(
																						useful,
																						reason,
																					) => {
																						setFeedbackState(
																							{
																								isRecorded: true,
																								feedbackType: useful
																									? 'positive'
																									: 'negative',
																							},
																						);
																						props.trackUsefullness(
																							props.sessionIdFromStore,
																							{
																								useful,
																								reason,
																							},
																						);
																					}}
																				/>
																			</div>
																		)}
																	</Fragment>
																)}
														</Fragment>
													)}
													{renderError(true)}
												</SearchBoxAISection>
											) : null}
											{!showAIScreen ? (
												<Fragment>
													{parsedSuggestions().map((item, itemIndex) => {
														const index = indexOffset + itemIndex;
														if (Array.isArray(item)) {
															const sectionHtml = XSS(
																item[0].sectionLabel,
															);
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
																			(
																				sectionItem,
																				sectionIndex,
																			) => (
																				<li
																					{...getItemProps(
																						{
																							item: sectionItem,
																						},
																					)}
																					key={`${sectionItem.sectionId
																						+ sectionIndex}-${
																						sectionItem.value
																					}`}
																					style={{
																						justifyContent:
																							'flex-start',
																						alignItems:
																							'center',
																					}}
																					className={`${
																						highlightedIndex
																						=== index
																							+ sectionIndex
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
																									iconId={`${sectionIndex
																										+ index
																										+ 1}-${
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
																										<TextWithTooltip
																											title={sectionItem.label}
																											className="section-list-item__label"
																											innerHTML={
																												sectionItem.label
																											}
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

														if (
															item._suggestion_type
															=== '_internal_a_i_trigger'
														) {
															return (
																<li
																	{...getItemProps({ item })}
																	key={`${index + 1}-${
																		item.value
																	}`}
																	style={{
																		justifyContent:
																			'flex-start',
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
																			<SuggestionItem
																				currentValue={
																					currentValue
																					|| ''
																				}
																				suggestion={item}
																			/>
																		</React.Fragment>
																	)}
																</li>
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
																				padding:
																					'0 10px 0 0',
																				display: 'flex',
																			}}
																		>
																			<CustomSvg
																				iconId={`${index +
																					1}-${
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

													{showSuggestionsFooter ? (
														<SuggestionsFooter />
													) : null}
												</Fragment>
											) : null}
											{!showAIScreen && !hasSuggestions()
												? renderNoSuggestion(parsedSuggestions()) : null
											}
										</ul>
									) : null}
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
								<InputGroup ref={_inputGroupRef} isOpen={isOpen}>
									{renderInputAddonBefore()}
									<InputWrapper>
										<TextArea
											showFocusShortcutsIcon={props.showFocusShortcutsIcon}
											showVoiceSearch={props.showVoiceSearch}
											aria-label={props.componentId}
											id={`${props.componentId}-input`}
											showIcon={props.showIcon}
											showClear={props.showClear}
											iconPosition={props.iconPosition}
											ref={_inputRef}
											{...getInputProps({
												className: getClassName(props.innerClass, 'input'),
												placeholder: props.placeholder,
												// When props.value is defined,
												// it means SearchBox is used as a controlled component
												value: Object.hasOwn(props, 'value')
													? props.value
													: currentValue || '',
												onChange: onInputChange,
												onBlur: withTriggerQuery(props.onBlur),
												onFocus: handleFocus,
												onClick: () => {
													// clear highlighted index
													setHighlightedIndex(null);
												},
												onKeyPress: withTriggerQuery(props.onKeyPress),
												onKeyDown: e => handleKeyDown(e, highlightedIndex),
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
										{showImageDropdown ? <ImageDropdown
											imageValue={currentImageValue}
											onChange={v => setCurrentImageValue(v)}
											onOutsideClick={(e) => {
												// When the user is clicking on the camera
												// icon which is outside the image modal
												if (showImageDropdown) {
													handleShowImageDropdown(e, false);
												}
											}}
										/> : null}
									</InputWrapper>
									{renderInputAddonAfter()}
									{renderAskButtonElement()}
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
					<InputGroup ref={_inputGroupRef} isOpen={false}>
						{renderInputAddonBefore()}
						<InputWrapper>
							<TextArea
								aria-label={props.componentId}
								className={getClassName(props.innerClass, 'input') || null}
								placeholder={props.placeholder}
								value={
									Object.hasOwn(props, 'value') ? props.value : currentValue || ''
								}
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
								showFocusShortcutsIcon={props.showFocusShortcutsIcon}
								showVoiceSearch={props.showVoiceSearch}
							/>
							{renderIcons()}
						</InputWrapper>

						{renderInputAddonAfter()}
						{renderAskButtonElement()}
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
	selectedImageValue: types.string,
	selectedCategory: types.string,
	suggestions: types.suggestions,
	triggerAnalytics: types.funcRequired,
	error: types.title,
	isLoading: types.bool,
	time: types.number,
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
	compoundClause: types.compoundClause,
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
	iconURL: types.string,
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
	showImageSearch: types.bool,
	imageSearchTooltip: types.string,
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
	showFocusShortcutsIcon: types.bool,
	addonBefore: types.children,
	addonAfter: types.children,
	expandSuggestionsContainer: types.bool,
	popularSuggestionsConfig: types.componentObject,
	recentSuggestionsConfig: types.componentObject,
	showSuggestionsFooter: types.bool,
	renderSuggestionsFooter: types.func,
	applyStopwords: types.bool,
	customStopwords: types.stringArray,
	onData: types.func,
	renderItem: types.func,
	isOpen: types.bool,
	enableIndexSuggestions: types.bool,
	enableFeaturedSuggestions: types.bool,
	enableFAQSuggestions: types.bool,
	enableDocumentSuggestions: types.bool,
	FAQSuggestionsConfig: types.componentObject,
	featuredSuggestionsConfig: types.componentObject,
	indexSuggestionsConfig: types.componentObject,
	documentSuggestionsConfig: types.componentObject,
	enterButton: types.bool,
	renderEnterButton: types.func,
	customEvents: types.componentObject,
	searchboxId: types.string,
	endpoint: types.endpoint,
	mode: oneOf(['select', 'tag']),
	highlightConfig: types.componentObject,
	renderSelectedTags: types.func,
	enableAI: types.bool,
	AIConfig: types.componentObject,
	AIResponse: types.componentObject,
	isAIResponseLoading: types.bool,
	AIResponseError: types.componentObject,
	renderAIAnswer: types.func,
	AIUIConfig: types.componentObject,
	trackUsefullness: types.funcRequired,
	sessionIdFromStore: types.string,
	isAITyping: types.boolRequired,
	removeAIResponse: types.func,
	// This is an internal prop just for testing
	testMode: types.bool,
};

SearchBox.defaultProps = {
	autosuggest: true,
	className: null,
	debounce: 100,
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
	showFocusShortcutsIcon: true,
	showVoiceSearch: false,
	style: {},
	URLParams: false,
	showClear: false,
	showDistinctSuggestions: true,
	showSuggestionsFooter: true,
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
	mode: 'select',
	enableAI: false,
	AIConfig: null,
	AIUIConfig: {},
};

const mapStateToProps = (state, props) => ({
	selectedValue:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value)
		|| null,
	selectedImageValue: (state.selectedValues[props.componentId]
		&& state.selectedValues[props.componentId].meta
		&& state.selectedValues[props.componentId].meta.imageValue) || null,
	selectedCategory:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].category)
		|| null,
	suggestions: state.hits[props.componentId] && state.hits[props.componentId].hits,
	rawData: state.rawData[props.componentId],
	aggregationData: state.compositeAggregations[props.componentId],
	themePreset: state.config.themePreset,
	isLoading: !!state.isLoading[`${props.componentId}`],
	error: state.error[props.componentId],
	time: state.hits[props.componentId] && state.hits[props.componentId].time,
	total: state.hits[props.componentId] && state.hits[props.componentId].total,
	hidden: state.hits[props.componentId] && state.hits[props.componentId].hidden,
	customEvents: state.config.analyticsConfig ? state.config.analyticsConfig.customEvents : {},
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

const mapDispatchtoProps = dispatch => ({
	updateQuery: (updateQueryObject, execute = true) =>
		dispatch(updateQuery(updateQueryObject, execute)),
	triggerAnalytics: (searchPosition, documentId) =>
		dispatch(recordSuggestionClick(searchPosition, documentId)),
	setCustomQuery: (component, query) => dispatch(setCustomQuery(component, query)),
	setDefaultQuery: (component, query) => dispatch(setDefaultQuery(component, query)),
	trackUsefullness: (sessionId, otherInfo) =>
		dispatch(recordAISessionUsefulness(sessionId, otherInfo)),
	removeAIResponse: componentId => dispatch(removeAIResponse(componentId)),
});

// Add componentType for SSR
SearchBox.componentType = componentTypes.searchBox;

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
				{componentProps => (
					<ConnectedComponent
						{...preferenceProps}
						{...componentProps}
						myForwardedRef={ref}
					/>
				)}
			</ComponentWrapper>
		)}
	</PreferencesConsumer>
));
hoistNonReactStatics(ForwardRefComponent, SearchBox);

ForwardRefComponent.displayName = 'SearchBox';
export default ForwardRefComponent;
