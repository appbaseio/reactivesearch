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
	nestedField?: string;
	onDrag?: (...args: any[]) => any;
	onValueChange?: (...args: any[]) => any;
	rangeLabels?: (...args: any[]) => any;
	react?: types.react;
	showHistogram?: boolean;
	snapPoints?: number[] | (start: number, end: number, stepValue: number) => number[];
	algorithm?: {
		getValue: (position: number, min: number max: number) => number;
		getPosition: (position: number, min: number max: number) => number;
	};
	snap?: boolean;
	loader?: any;
	stepValue?: number;
	title?: types.title;
}

declare const DynamicRange: React.ComponentType<DynamicRangeSliderProps>;

export default DynamicRange;
