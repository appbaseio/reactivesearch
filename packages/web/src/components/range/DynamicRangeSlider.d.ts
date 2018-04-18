import * as React from 'react';
import { CommonProps } from '../../';
import * as types from '../../types';

export interface DynamicRangeSliderProps extends CommonProps {
	beforeValueChange?: (...args: any[]) => any;
	className?: string;
	customQuery?: (...args: any[]) => any;
	dataField: string;
	defaultSelected?: (...args: any[]) => any;
	filterLabel?: string;
	innerClass?: types.style;
	interval?: number;
	onDrag?: (...args: any[]) => any;
	onValueChange?: (...args: any[]) => any;
	rangeLabels?: (...args: any[]) => any;
	react?: types.react;
	showHistogram?: boolean;
	snap?: boolean;
	stepValue?: number;
	title?: types.title;
}

declare const DynamicRange: React.ComponentType<DynamicRangeSliderProps>;

export default DynamicRange;
