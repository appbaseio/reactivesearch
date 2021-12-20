import React from 'react';
import XDate from 'xdate';
import { connect as connectToStore } from 'react-redux';
import { isEqual } from '@appbaseio/reactivecore/lib/utils/helper';
import { validProps } from '@appbaseio/reactivecore/lib/utils/constants';
import dateFormats from '@appbaseio/reactivecore/lib/utils/dateFormats';

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
export function isValidDateRangeQueryFormat(queryFormat) {
	return Object.keys(dateFormats).includes(queryFormat);
}

export function getNumericRangeValue(value, props, avoidEpochSecondDivision = false) {
	// eslint-disable-next-line
	if (
		typeof value !== 'number'
		&& isValidDateRangeQueryFormat(props.queryFormat)
		&& new XDate(value, true).valid()
	) {
		if (props.queryFormat === 'epoch_second' && avoidEpochSecondDivision === false) {
			return Math.floor(new XDate(value, true).getTime() / 1000);
		}
		return new XDate(value, true).getTime();
	}
	return parseFloat(value);
}

export function getRangeValueString(value, props) {
	if (typeof value !== 'string') {
		switch (props.queryFormat) {
			case 'epoch_millis':
				return new XDate(value, true).getTime();
			case 'epoch_second':
				return Math.floor(new XDate(value, true).getTime() / 1000);
			// we fallback to `date` format since, only-time is lossy for converting back to date object
			// we would need to convert back from rangestring to date object for feeding to rangeslider
			// post numeric conversion of date object
			case 'basic_time_no_millis':
				return new XDate(value, true).toString(dateFormats.date);
			case 'basic_time':
				return new XDate(value, true).toString(dateFormats.date);
			default: {
				if (dateFormats[props.queryFormat]) {
					return new XDate(value, true).toString(dateFormats[props.queryFormat]);
				}
				return value.toString();
			}
		}
	}

	return value;
}

export function formatDateStringToStandard(value, props) {
	const queryFormat = dateFormats[props.queryFormat];
	let formattedValue = value;
	let offSetSign = '';
	if (typeof formattedValue === 'string') {
		// eslint-disable-next-line
		offSetSign = // eslint-disable-next-line
			formattedValue.indexOf('+') != -1
				? '+'
				: formattedValue.indexOf('-') !== -1
					? '-'
					: null;

		const offsetComponent = offSetSign ? offSetSign + formattedValue.split(offSetSign)[1] : '';
		switch (queryFormat) {
			case dateFormats.date:
				return formattedValue;
			case dateFormats.basic_date:
				formattedValue = [
					formattedValue.slice(0, 4),
					'-',
					formattedValue.slice(4, 6),
					'-',
					formattedValue.slice(6),
				].join('');

				return formattedValue;
			case dateFormats.basic_date_time || dateFormats.basic_date_time_no_millis:
				formattedValue = [
					formattedValue.slice(0, 4),
					'-',
					formattedValue.slice(4, 6),
					'-',
					formattedValue.slice(6, 8),
					'T',
					formattedValue.slice(9, 11),
					':',
					formattedValue.slice(11, 13),
					':',
					formattedValue.slice(13, 15),
					offsetComponent,
				].join('');
				return formattedValue;
			case dateFormats.date_time_no_millis:
				formattedValue = [
					formattedValue.slice(0, 10),
					'T',
					formattedValue.slice(11, 13),
					':',
					formattedValue.slice(14, 16),
					':',
					formattedValue.slice(17, 19),
					offsetComponent,
				].join('');
				return formattedValue;
			case dateFormats.epoch_millis:
				return formattedValue;
			case dateFormats.epoch_second:
				return formattedValue * 1000;
			default:
				return formattedValue;
		}
	}
	if (props.queryFormat === 'epoch_second') {
		return value * 1000;
	}
	return formattedValue;
}
