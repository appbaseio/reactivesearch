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

export const getInnerKey = (innerStyle, item) => (innerStyle && innerStyle[item]) || {};
