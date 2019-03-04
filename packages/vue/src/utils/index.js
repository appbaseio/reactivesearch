import connectToStore from './connector';

// TODO
// import { storeKey } from '@appbaseio/reactivecore';

export const connect = (...args) => connectToStore(...args);
// connectToStore(...args, null, {
//   storeKey,
// });

export const composeThemeObject = (ownTheme = {}, userTheme = {}) => ({
	typography: {
		...ownTheme.typography,
		...userTheme.typography
	},
	colors: {
		...ownTheme.colors,
		...userTheme.colors
	},
	component: {
		...ownTheme.component,
		...userTheme.component
	}
});
