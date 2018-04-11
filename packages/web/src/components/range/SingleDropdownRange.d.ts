import * as React from "react";
import { CommonProps } from "../../";
import * as types from "../../types";

export interface SingleDropdownRangeProps extends CommonProps {
	beforeValueChange?: () => any;
	customQuery?: () => any;
	data?: types.data;
	dataField: string;
	defaultSelected?: string;
	filterLabel?: string;
	innerClass?: types.style;
	onValueChange?: () => any;
	placeholder?: string;
	react?: types.react;
	showFilter?: boolean;
	title?: types.title;
	themePreset?: types.themePreset;
}

declare const SingleDropdownRange: React.ComponentType<SingleDropdownRangeProps>;

export default SingleDropdownRange;
