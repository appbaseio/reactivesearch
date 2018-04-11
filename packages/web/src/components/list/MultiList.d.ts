import * as React from "react";
import { CommonProps } from "../../";
import * as types from "../../types";

export interface MultiList extends CommonProps {
	beforeValueChange?: () => any;
	customQuery?: () => any;
	dataField: string;
	defaultSelected?: types.stringArray;
	filterLabel?: string;
	innerClass?: types.style;
	onValueChange?: () => any;
	placeholder?: string;
	queryFormat?: types.queryFormatSearch;
	react?: types.react;
	renderListItem?: () => any;
	selectAllLabel?: string;
	showCheckbox: boolean;
	showCount?: boolean;
	showSearch?: boolean;
	size?: number;
	sortBy?: types.sortByWithCount;
	themePreset?: types.themePreset;
	title?: types.title;
	showMissing?: boolean;
	missingLabel?: string;
}

declare const MultiList: React.ComponentType<MultiList>;

export default MultiList;
