import * as React from 'react';
import { CommonProps } from '../../';
import * as types from '../../types';

export interface DynamicRangeSliderProps extends CommonProps {
	beforeValueChange?: (...args: any[]) => any;
	className?: string;
	customQuery?: (...args: any[]) => any;
	dataField: string;
	defaultValue?: (...args: any[]) => any;
	value?: (...args: any[]) => any;
	filterLabel?: string;
	innerClass?: types.style;
	interval?: number;
	nestedField?: string;
	onDrag?: (...args: any[]) => any;
	onValueChange?: (...args: any[]) => any;
	onChange?: (...args: any[]) => any;
	rangeLabels?: (...args: any[]) => any;
	react?: types.react;
	showHistogram?: boolean;
	snap?: boolean;
	loader?: any;
	stepValue?: number;
	title?: types.title;
	showFilter?: boolean;
	tooltipTrigger?: types.tooltipTrigger;
	renderTooltipData?: (...args: any[]) => any;
	includeNullValues?: boolean;
}

declare const DynamicRange: React.ComponentClass<DynamicRangeSliderProps>;

export default DynamicRange;
