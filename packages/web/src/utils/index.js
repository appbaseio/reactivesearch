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
