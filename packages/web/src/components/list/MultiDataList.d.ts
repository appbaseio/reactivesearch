import * as React from "react";
import { CommonProps } from "../../";
import * as types from "../../types";

export interface MultiDataList extends CommonProps {
	beforeValueChange?: () => any;
	customQuery?: () => any;
	data?: types.data;
	dataField: string;
	defaultSelected?: types.stringArray;
	filterLabel?: string;
	innerClass?: types.style;
	onValueChange?: () => any;
	placeholder?: string;
	queryFormat?: types.queryFormatSearch;
	react?: types.react;
	selectAllLabel?: string;
	showCheckbox: boolean;
	showFilter?: boolean;
	showSearch?: boolean;
	themePreset?: types.themePreset;
	title?: types.title;
}

declare const MultiDataList: React.ComponentType<MultiDataList>;

export default MultiDataList;
