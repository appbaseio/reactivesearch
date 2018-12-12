import { connect as connectToStore } from 'react-redux';
import { storeKey } from '@appbaseio/reactivecore';

export const connect = (...args) =>
	connectToStore(...args, null, {
		storeKey,
	});

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

export const isFunction = element => typeof element === 'function';
