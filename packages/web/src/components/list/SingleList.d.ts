import * as React from "react";
import { CommonProps } from "../../";
import * as types from "../../types";

export interface SingleList extends CommonProps {
	beforeValueChange?: () => any;
	customQuery?: () => any;
	dataField?: string;
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
	showRadio?: boolean;
	showSearch?: boolean;
	size?: number;
	sortBy?: types.sortByWithCount;
	themePreset?: types.themePreset;
	title?: types.title;
	showMissing?: boolean;
	missingLabel?: string;
}

declare const SingleList: React.ComponentType<SingleList>;

export default SingleList;
