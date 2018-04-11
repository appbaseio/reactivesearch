import * as React from "react";
import { CommonProps } from "../../";
import * as types from "../../types";

export interface DynamicRangeSliderProps extends CommonProps {
	beforeValueChange?: () => any;
	className?: string;
	customQuery?: () => any;
	dataField: string;
	defaultSelected?: () => any;
	filterLabel?: string;
	innerClass?: types.style;
	interval?: number;
	onDrag?: () => any;
	onValueChange?: () => any;
	rangeLabels?: () => any;
	react?: types.react;
	showHistogram?: boolean;
	snap?: boolean;
	stepValue?: number;
	title?: types.title;
}

declare const DynamicRange: React.ComponentType<DynamicRangeSliderProps>;

export default DynamicRange;
