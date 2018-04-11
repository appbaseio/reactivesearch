import * as React from "react";
import { CommonProps } from "../../";
import * as types from "../../types";

export interface MultiDropdownRangeProps extends CommonProps {
	beforeValueChange?: () => any;
	customQuery?: () => any;
	data?: types.data;
	dataField: string;
	defaultSelected?: types.stringArray;
	filterLabel?: types.filterLabel;
	innerClass?: types.style;
	onValueChange?: () => any;
	placeholder?: string;
	react?: types.react;
	showFilter?: boolean;
	title?: types.title;
	themePreset?: types.themePreset;
}

declare const MultiDropdownRange: React.ComponentType<MultiDropdownRangeProps>;

export default MultiDropdownRange;
