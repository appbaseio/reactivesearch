import React from 'react';
import { connect as connectToStore } from 'react-redux';
import { isEqual, isValidDateRangeQueryFormat } from '@appbaseio/reactivecore/lib/utils/helper';
import { validProps } from '@appbaseio/reactivecore/lib/utils/constants';
import XDate from 'xdate';

export const ReactReduxContext = React.createContext(null);

export const connect = (...args) => connectToStore(...args, null, { context: ReactReduxContext });

export const X_SEARCH_CLIENT = 'ReactiveSearch React';

export const composeThemeObject = (ownTheme = {}, userTheme = {}) => ({
	typography: {
		...ownTheme.typography,
		...userTheme.typography,
	},
	colors: {
		...ownTheme.colors,
		...userTheme.colors,
	},
	component: {
		...ownTheme.component,
		...userTheme.component,
	},
});

/**
 * To determine wether an element is a function
 * @param {any} element
 */
export const isFunction = element => typeof element === 'function';

/**
 * Extracts the render prop from props and returns a valid React element
 * @param {Object} data
 * @param {Object} props
 */
export const getComponent = (data = {}, props = {}) => {
	const { children, render } = props;
	// Render function as child
	if (isFunction(children)) {
		return children(data);
	}
	// Render function as render prop
	if (isFunction(render)) {
		return render(data);
	}
	return null;
};
/**
 * To determine whether a component has render prop defined or not
 * @returns {Boolean}
 */
export const hasCustomRenderer = (props = {}) => {
	const { render, children } = props;
	return isFunction(children) || isFunction(render);
};

export const isEvent = candidate =>
	!!(candidate && candidate.stopPropagation && candidate.preventDefault);
/**
 * To check if two functions are identical
 */
export const isIdentical = (a, b) => {
	if (!a && !b) return true;
	if (typeof a === 'function' && typeof b === 'function') {
		if (isEqual(a(), b())) {
			return true;
		}
		return false;
	}
	return false;
};
export const getValidPropsKeys = (props = {}) =>
	Object.keys(props).filter(i => validProps.includes(i));
/**
 * Handles the caret position for input components
 * @param {HTMLInputElement} e
 */
export const handleCaretPosition = (e) => {
	if (window) {
		const caret = e.target.selectionStart;
		const element = e.target;
		window.requestAnimationFrame(() => {
			element.selectionStart = caret;
			element.selectionEnd = caret;
		});
	}
};
// elastic search query for including null values
export const getNullValuesQuery = fieldName => ({
	bool: {
		must_not: {
			exists: {
				field: fieldName,
			},
		},
	},
});

export const getRangeQueryWithNullValues = (value, props) => {
	let query = null;
	const rangeQuery = {
		range: {
			[props.dataField]: {
				gte: value[0],
				lte: value[1],
				boost: 2.0,
			},
		},
	};
	if (props.includeNullValues) {
		query = {
			bool: {
				should: [rangeQuery, getNullValuesQuery(props.dataField)],
			},
		};
	} else query = rangeQuery;
	return query;
};

// parses current array (i.e. this.props.value) for `onChange` callback for multi-* components
export function parseValueArray(originalArr = [], currentValue) {
	const newValue = Object.assign([], originalArr);
	const currentValueIndex = newValue.indexOf(currentValue);
	if (currentValueIndex > -1) newValue.splice(currentValueIndex, 1);
	else newValue.push(currentValue);
	return newValue;
}

// escapes regex for special characters: \ => \\, $ => \$
export function escapeRegExp(string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

/**
 * @param value
 * @param {Object} props
 * @param {Object} prevProps
 * @param {'defaultQuery' | 'customQuery'} key
 */
export const isQueryIdentical = (value = null, props = {}, prevProps = {}, key) => {
	if (!key) return true;
	if (typeof props[key] !== 'function' || typeof prevProps[key] !== 'function') return true;
	// to not call original defaultQuery and customQuery, as here we are only comparing
	return isEqual(props[key](value, props), prevProps[key](value, prevProps));
};

/**
 * To determine whether a component has renderPopularSuggestions prop defined or not
 * @returns {Boolean}
 */
export const hasPopularSuggestionsRenderer = (props = {}) => {
	// TODO: Remove renderQuerySuggestions in v4
	const { renderQuerySuggestions, renderPopularSuggestions } = props;
	return isFunction(renderPopularSuggestions || renderQuerySuggestions);
};

/**
 * Extracts the renderPopularSuggestions prop from props and returns a valid React element
 * @param {Object} data
 * @param {Object} props
 */
export const getPopularSuggestionsComponent = (data = {}, props = {}) => {
	// TODO: Remove renderQuerySuggestions in v4
	const { renderQuerySuggestions, renderPopularSuggestions } = props;
	const renderFunc = renderPopularSuggestions || renderQuerySuggestions;
	// Render function as render prop
	if (isFunction(renderFunc)) {
		return renderFunc(data);
	}
	return null;
};

export const isEmpty = val => !(val && val.length && Object.keys(val).length);

export function isNumeric(value) {
	return /^-?\d+$/.test(value);
}

// check if passed shortcut a key combination
export function isHotkeyCombination(hotkey) {
	return typeof hotkey === 'string' && hotkey.indexOf('+') !== -1;
}

// used for getting correct string char from keycode passed
// the below algebraic expression is used to get the correct ascii code out of the e.which
// || e.keycode returned value
// since the keyboards doesn't understand ascii but scan codes and they differ for
// certain keys such as '/'
// stackoverflow ref: https://stackoverflow.com/a/29811987/10822996
export function getCharFromCharCode(passedCharCode) {
	const which = passedCharCode;
	const chrCode = which - (48 * Math.floor(which / 48));
	return String.fromCharCode(which >= 96 ? chrCode : which);
}

// used for parsing focusshortcuts for keycodes passed as string, eg: 'ctrl+/' is same as 'ctrl+47'
// returns focusShortcuts containing appropriate key charsas depicted on keyboards
export function parseFocusShortcuts(focusShortcutsArray) {
	if (isEmpty(focusShortcutsArray)) return [];

	const parsedFocusShortcutsArray = [];
	focusShortcutsArray.forEach((element) => {
		if (typeof element === 'string') {
			if (isHotkeyCombination(element)) {
				// splitting the combination into pieces
				const splitCombination = element.split('+');
				const parsedSplitCombination = [];
				// parsedCombination would have all the keycodes converted into chars
				let parsedCombination = '';
				for (let i = 0; i < splitCombination.length; i += 1) {
					if (isNumeric(splitCombination[i])) {
						parsedSplitCombination.push(getCharFromCharCode(+splitCombination[i]));
					} else {
						parsedSplitCombination.push(splitCombination[i]);
					}
				}
				parsedCombination = parsedSplitCombination.join('+');
				parsedFocusShortcutsArray.push(parsedCombination);
			} else if (isNumeric(element)) {
				parsedFocusShortcutsArray.push(getCharFromCharCode(+element));
			} else {
				// single char shortcut, eg: '/'
				parsedFocusShortcutsArray.push(element);
			}
		} else {
			// if not a string the the shortcut is assumed to be a keycode
			parsedFocusShortcutsArray.push(getCharFromCharCode(element));
		}
	});
	return parsedFocusShortcutsArray;
}

export const MODIFIER_KEYS = ['shift', 'ctrl', 'alt', 'control', 'option', 'cmd', 'command'];

// filter out modifierkeys such as ctrl, alt, command, shift from focusShortcuts prop
export function extractModifierKeysFromFocusShortcuts(focusShortcutsArray) {
	return focusShortcutsArray.filter(shortcutKey => MODIFIER_KEYS.includes(shortcutKey));
}

// returns the milliseconds value for RangeSlider/ DynamicRangeSlider for date types
// returns the value as is, if the simple numerics are used
// this pertains to the convention that internally our components uses numerics for local state
export function getNumericRangeValue(value, isDateType) {
	try {
		if (isDateType && value !== undefined && value !== null && new XDate(value).valid()) {
			return new XDate(value).getTime();
		}
		return parseFloat(value);
	} catch (e) {
		console.error(e);
		return parseFloat(value);
	}
}

export const formatDateString = (date, format) => {
	try {
		return new XDate(date).toString(format || "yyyy-MM-dd'T'HH:mm:ss");
	} catch (e) {
		return date;
	}
};

export const getNumericRangeArray = (valueObj, queryFormat) => {
	if (!valueObj) {
		return null;
	}
	return [
		getNumericRangeValue(valueObj.start, isValidDateRangeQueryFormat(queryFormat)),
		getNumericRangeValue(valueObj.end, isValidDateRangeQueryFormat(queryFormat)),
	].filter(val => typeof val === 'number');
};

// takes in arrays of length 2
// returns inrange value array
// where the 2nd argument is the reference of rangelimits

// isFirstValueChanging tells which of the two values in array is undergoing change
export const getValueArrayWithinLimits = (currentValueArray, rangeArray) => {
	try {
		const [currentStart, currentEnd] = currentValueArray;
		const [limitedStart, limitedEnd] = rangeArray;
		let [newStart, newEnd] = [...currentValueArray];
		newStart = currentStart < limitedStart ? limitedStart : currentStart;
		newEnd = currentEnd > limitedEnd ? limitedEnd : currentEnd;

		if (newStart > newEnd) {
			return rangeArray; // we reset the values
		}
		return [newStart, newEnd];
	} catch (e) {
		console.error(e);
		return currentValueArray;
	}
};

