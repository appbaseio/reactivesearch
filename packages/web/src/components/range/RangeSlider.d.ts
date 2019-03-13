import * as React from 'react';
import { CommonProps } from '../../';
import * as types from '../../types';

export interface RangeSliderProps extends CommonProps {
	beforeValueChange?: (...args: any[]) => any;
	customQuery?: (...args: any[]) => any;
	histogramQuery?: (props: RangeSliderProps) => any;
	dataField: string;
	defaultSelected?: types.range;
	filterLabel?: string;
	innerClass?: types.style;
	nestedField?: string;
	interval?: number;
	onDrag?: (...args: any[]) => any;
	onValueChange?: (...args: any[]) => any;
	range?: types.range;
	rangeLabels?: types.rangeLabels;
	react?: types.react;
	showHistogram?: boolean;
	showSlider?: boolean;
	snapPoints?: number[] | (start: number, end: number, stepValue: number) => number[];
	algorithm?: {
		getValue: (position: number, min: number max: number) => number;
		getPosition: (position: number, min: number max: number) => number;
	};
	snap?: boolean;
	stepValue?: number;
	title?: types.title;
}

declare const RangeSlider: React.ComponentType<RangeSliderProps>;

export default RangeSlider;
