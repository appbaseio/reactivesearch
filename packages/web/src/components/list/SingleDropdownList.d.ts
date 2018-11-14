import * as React from 'react';
import { CommonProps } from '../../';
import * as types from '../../types';

export interface SingleDropdownList extends CommonProps {
	beforeValueChange?: (...args: any[]) => any;
	customQuery?: (...args: any[]) => any;
	dataField: string;
	defaultSelected?: string;
	filterLabel?: string;
	innerClass?: types.style;
	onValueChange?: (...args: any[]) => any;
	placeholder?: string;
	react?: types.react;
	renderListItem?: (...args: any[]) => any;
	transformData?: (...args: any[]) => any;
	selectAllLabel?: string;
	showCount?: boolean;
	showFilter?: boolean;
	size?: number;
	sortBy?: types.sortByWithCount;
	title?: types.title;
	themePreset?: types.themePreset;
	showMissing?: boolean;
	missingLabel?: string;
	showLoadMore?: boolean;
	loadMoreLabel?: types.title;
	nestedField?: string;
}

declare const SingleDropdownList: React.ComponentType<SingleDropdownList>;

export default SingleDropdownList;
