import * as React from 'react';
import { CommonProps } from '../../';
import * as types from '../../types';

export interface MultiRangeProps extends CommonProps {
	beforeValueChange?: (...args: any[]) => any;
	customQuery?: (...args: any[]) => any;
	data?: types.data;
	dataField: string;
	defaultSelected?: types.stringArray;
	filterLabel?: types.filterLabel;
	innerClass?: types.style;
	onValueChange?: (...args: any[]) => any;
	placeholder?: string;
	react?: types.react;
	showCheckbox: boolean;
	showFilter?: boolean;
	supportedOrientations?: types.supportedOrientations;
	title?: types.title;
}

declare const MultiRange: React.ComponentType<MultiRangeProps>;

export default MultiRange;
