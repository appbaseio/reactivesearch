import React from 'react';
import { connect as connectToStore } from 'react-redux';
import { isEqual } from '@appbaseio/reactivecore/lib/utils/helper';
import { validProps } from '@appbaseio/reactivecore/lib/utils/constants';

export const ReactReduxContext = React.createContext(null);

export const connect = (...args) => connectToStore(...args, null, { context: ReactReduxContext });

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
/**
 * Adds click ids in the hits(useful for trigger analytics)
 */
export const withClickIds = (results = []) =>
	results.map((result, index) => ({
		...result,
		_click_id: index,
	}));
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
