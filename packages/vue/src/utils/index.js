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
// connectToStore(...args, null, {
//   storeKey,
// });

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

// parses current array (i.e. this.props.value) for `onChange` callback for multi-* components
export function parseValueArray(objectValues, currentValue) {
	const keys = Object.keys(objectValues);
	const selectedValues = keys.map(key => (objectValues[key] ? key : null));

	if (selectedValues.includes(currentValue)) {
		return selectedValues.filter(item => item !== currentValue);
	}
	return [...selectedValues, currentValue];
}

/**
 * Extracts the render prop from props or slot and returns a valid JSX element
 * @param {Object} data
 * @param _ref
 */
export const getComponent = (data = {}, _ref = {}) => {
	const { render } = _ref.$scopedSlots || _ref.$props;
	if (render) return render(data);
	return null;
};
/**
 * To determine whether a component has render prop or slot defined or not
 * @returns {Boolean}
 */
export const hasCustomRenderer = (_ref = {}) => {
	const { render } = _ref.$scopedSlots || _ref.$props;
	return Boolean(render);
};

export const getValidPropsKeys = (props = {}) =>
	Object.keys(props).filter(i => validProps.includes(i));

export const isEvent = candidate =>
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
	const { renderQuerySuggestions, renderPopularSuggestions } = _ref.$scopedSlots || _ref.$props;
	const render = renderPopularSuggestions || renderQuerySuggestions
	if (render) return render(data);
	return null;
};
/**
 * To determine whether a component has renderQuerySuggestions prop or slot defined or not
 * @returns {Boolean}
 */
export const hasQuerySuggestionsRenderer = (_ref = {}) => {
	const { renderQuerySuggestions, renderPopularSuggestions } = _ref.$scopedSlots || _ref.$props;
	return Boolean(renderPopularSuggestions) || Boolean(renderQuerySuggestions);
};

/**
 * To get the camel case string from kebab case
 * @returns {string}
 */
export const getCamelCase = (str = '') => {
	const arr = str.split('-');
	const capital = arr.map((item, index) =>
		index ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase() : item,
	);
	// ^-- change here.
	const capitalString = capital.join('');
	return capitalString || '';
};

export const debounce = (method, delay) => {
	clearTimeout(method._tId);
	// eslint-disable-next-line
	method._tId = setTimeout(() => {
		method();
	}, delay);
};
