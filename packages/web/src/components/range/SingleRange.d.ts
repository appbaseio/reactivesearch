import * as React from 'react';
import { CommonProps } from '../../';
import * as types from '../../types';

export interface SingleRangeProps extends CommonProps {
	beforeValueChange?: (...args: any[]) => any;
	customQuery?: (...args: any[]) => any;
	data?: types.data;
	dataField: string;
	defaultSelected?: string;
	filterLabel?: string;
	innerClass?: types.style;
	onValueChange?: (...args: any[]) => any;
	react?: types.react;
	showFilter?: boolean;
	showRadio: boolean;
	title?: types.title;
}

declare const SingleRange: React.ComponentType<SingleRangeProps>;

export default SingleRange;
