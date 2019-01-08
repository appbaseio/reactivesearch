import * as React from 'react';
import { CommonProps } from '../../';
import * as types from '../../types';

export interface MultiDataList extends CommonProps {
	beforeValueChange?: (...args: any[]) => any;
	customQuery?: (...args: any[]) => any;
	data?: types.data;
	dataField: string;
	defaultSelected?: types.stringArray;
	filterLabel?: string;
	innerClass?: types.style;
	onValueChange?: (...args: any[]) => any;
	nestedField?: string;
	placeholder?: string;
	queryFormat?: types.queryFormatSearch;
	react?: types.react;
	selectAllLabel?: string;
	showCheckbox: boolean;
	showFilter?: boolean;
	showSearch?: boolean;
	themePreset?: types.themePreset;
	title?: types.title;
	showCount?: boolean;
	renderListItem?: (...args: any[]) => any;
}

declare const MultiDataList: React.ComponentType<MultiDataList>;

export default MultiDataList;
