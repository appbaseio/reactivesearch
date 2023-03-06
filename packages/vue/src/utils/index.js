import { validProps } from '@appbaseio/reactivecore/lib/utils/constants';
import { helper } from '@appbaseio/reactivecore';
import connectToStore from './connector';

const {
	updateDefaultQuery: defaultQueryUtil,
	updateCustomQuery: customQueryUtil,
	isEqual,
} = helper;

// TODO
// import { storeKey } from '@appbaseio/reactivecore';

export const connect = (...args) => connectToStore(...args);

export const X_SEARCH_CLIENT = 'ReactiveSearch Vue';

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
export const isFunction = (element) => typeof element === 'function';

// parses current array (i.e. this.$props.value) for `onChange` callback for multi-* components
export function parseValueArray(objectValues, currentValue) {
	let selectedValues;
	if (Array.isArray(objectValues)) {
		selectedValues = [...objectValues];
	} else {
		const keys = Object.keys(objectValues);
		selectedValues = keys.map((key) => (objectValues[key] ? key : null));
	}

	if (selectedValues.includes(currentValue)) {
		return selectedValues.filter((item) => item !== currentValue);
	}
	return [...selectedValues, currentValue];
}

/**
 * Extracts the render prop from props or slot and returns a valid JSX element
 * @param {Object} data
 * @param _ref
 */
export const getComponent = (data = {}, _ref = {}) => {
	const { render } = _ref.$slots || _ref.$props;
	if (render) return render(data);
	return null;
};
/**
 * To determine whether a component has render prop or slot defined or not
 * @returns {Boolean}
 */
export const hasCustomRenderer = (_ref = {}) => {
	const { render } = _ref.$slots || _ref.$props;
	return Boolean(render);
};

export const getValidPropsKeys = (props = {}) =>
	Object.keys(props).filter((i) => validProps.includes(i));

export const isEvent = (candidate) =>
	!!(candidate && candidate.stopPropagation && candidate.preventDefault);

export const updateDefaultQuery = (componentId, setDefaultQuery, props, value) => {
	defaultQueryUtil(componentId, { ...props, setDefaultQuery }, value);
};

export const updateCustomQuery = (componentId, setCustomQuery, props, value) => {
	customQueryUtil(componentId, { ...props, setCustomQuery }, value);
};

/**
 * @param {Function} newVal
 * @param {Function} oldVal
 * @param {any} value
 * @param {Object} props
 */
export const isQueryIdentical = (newVal, oldVal, value, props) => {
	if (typeof newVal !== 'function' || typeof oldVal !== 'function') return true;
	// to not call original defaultQuery and customQuery, as here we are only comparing
	return isEqual(oldVal(value, props), newVal(value, props));
};
/**
 * Extracts the renderPopularSuggestions prop from props or slot and returns a valid JSX element
 * @param {Object} data
 * @param _ref
 */
export const getQuerySuggestionsComponent = (data = {}, _ref = {}) => {
	const { renderQuerySuggestions, renderPopularSuggestions } = _ref.$slots || _ref.$props;
	const render = renderPopularSuggestions || renderQuerySuggestions;
	if (render) return render(data);
	return null;
};
/**
 * To determine whether a component has renderQuerySuggestions prop or slot defined or not
 * @returns {Boolean}
 */
export const hasQuerySuggestionsRenderer = (_ref = {}) => {
	const { renderQuerySuggestions, renderPopularSuggestions } = _ref.$slots || _ref.$props;
	return Boolean(renderPopularSuggestions) || Boolean(renderQuerySuggestions);
};

/**
 * To get the camel case string from kebab case
 * @returns {string}
 */
export const getCamelCase = (str = '') => {
	const propsWhichRequirePascalCase = ['u-r-l-params']
	const arr = str.split('-');
	const capital = arr.map((item, index) =>
		index ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase() : item,
	);
	// ^-- change here.
	let capitalString = capital.join('');
	if(propsWhichRequirePascalCase.includes(str))
		capitalString = capitalString[0].toUpperCase() + capitalString.substring(1)
	return capitalString || '';
};

export const isEmpty = (val) => !(val && val.length && Object.keys(val).length);

export function isNumeric(value) {
	return /^-?\d+$/.test(value);
}

// check if passed shortcut a key combination
export function isHotkeyCombination(hotkey) {
	return typeof hotkey === 'string' && hotkey.indexOf('+') !== -1;
}

// used for getting correct string char from keycode passed
// the below algebraic expression is used to get the correct ascii code out of the e.which || e.keycode returned value
// since the keyboards doesn't understand ascii but scan codes and they differ for certain keys such as '/'
// stackoverflow ref: https://stackoverflow.com/a/29811987/10822996
export function getCharFromCharCode(passedCharCode) {
	const which = passedCharCode;
	const chrCode = which - 48 * Math.floor(which / 48);
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
	return focusShortcutsArray.filter((shortcutKey) => MODIFIER_KEYS.includes(shortcutKey));
}

export const debounce = (method, delay) => {
	clearTimeout(method._tId);
	// eslint-disable-next-line
	method._tId = setTimeout(() => {
		method();
	}, delay);
};
export function decodeHtml(str) {
	if (typeof str !== 'string') {
		return str;
	}
	return str.replace(/&#([0-9]{1,3});/gi, (match, numStr) => {
		const num = parseInt(numStr, 10); // read num as normal number
		return String.fromCharCode(num);
	});
}
