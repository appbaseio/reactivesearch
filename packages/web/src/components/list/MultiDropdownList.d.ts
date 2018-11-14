import * as React from 'react';
import { CommonProps } from '../../';
import * as types from '../../types';

export interface MultiDropdownList extends CommonProps {
	beforeValueChange?: (...args: any[]) => any;
	customQuery?: (...args: any[]) => any;
	dataField: string;
	defaultSelected?: types.stringArray;
	filterLabel?: string;
	innerClass?: types.style;
	onValueChange?: (...args: any[]) => any;
	placeholder?: string;
	queryFormat?: types.queryFormatSearch;
	react?: types.react;
	renderListItem?: (...args: any[]) => any;
	transformData?: (...args: any[]) => any;
	selectAllLabel?: string;
	showCount?: boolean;
	showFilter?: boolean;
	size?: number;
	sortBy?: types.sortByWithCount;
	themePreset?: types.themePreset;
	title?: types.title;
	showMissing?: boolean;
	missingLabel?: string;
	showLoadMore?: boolean;
	loadMoreLabel?: types.title;
	nestedField?: string;
}

declare const MultiDropdownList: React.ComponentType<MultiDropdownList>;

export default MultiDropdownList;
