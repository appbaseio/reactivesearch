import * as React from 'react';
import { CommonProps } from '../../';
import * as types from '../../types';

export interface SingleRangeProps extends CommonProps {
	beforeValueChange?: (...args: any[]) => any;
	customQuery?: (...args: any[]) => any;
	data?: types.data;
	dataField: string;
	defaultValue?: string;
	value?: string;
	filterLabel?: string;
	innerClass?: types.style;
	nestedField?: string;
	onValueChange?: (...args: any[]) => any;
	onChange?: (...args: any[]) => any;
	react?: types.react;
	showFilter?: boolean;
	showRadio: boolean;
	title?: types.title;
	includeNullValues?: boolean;
}

declare const SingleRange: React.ComponentClass<SingleRangeProps>;

export default SingleRange;
