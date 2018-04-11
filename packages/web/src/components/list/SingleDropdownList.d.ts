import * as React from "react";
import { CommonProps } from "../../";
import * as types from "../../types";

export interface SingleDropdownList extends CommonProps {
	beforeValueChange?: () => any;
	customQuery?: () => any;
	dataField: string;
	defaultSelected?: string;
	filterLabel?: string;
	innerClass?: types.style;
	onValueChange?: () => any;
	placeholder?: string;
	react?: types.react;
	renderListItem?: () => any;
	selectAllLabel?: string;
	showCount?: boolean;
	showFilter?: boolean;
	size?: number;
	sortBy?: types.sortByWithCount;
	title?: types.title;
	themePreset?: types.themePreset;
	showMissing?: boolean;
	missingLabel?: string;
}

declare const SingleDropdownList: React.ComponentType<SingleDropdownList>;

export default SingleDropdownList;
