import { connect as connectToStore } from 'react-redux';
import { storeKey } from '@appbaseio/reactivecore';

// eslint-disable-next-line
export const connect = (...args) => connectToStore(
	...args,
	null,
	{
		storeKey,
	},
);

const isEmptyObject = obj => !Object.keys(obj).length > 0;

const objectChecker = (innerStyle, item) => (innerStyle && innerStyle[item]) || {};

const checkboxStyleChecker = (style) => {
	// trimming color value
	const { color, ...filteredStyle } = style;
	return filteredStyle;
};

export const getInnerStyle = (innerStyle, item) => {
	let style = objectChecker(innerStyle, item);

	if (!isEmptyObject(style) && item === 'checkbox') style = checkboxStyleChecker(style);

	return style;
};

export const getCheckboxInnerStyle = (primaryColor, innerStyle, item) => {
	const { color = null } = objectChecker(innerStyle, item);
	return color || primaryColor;
};
