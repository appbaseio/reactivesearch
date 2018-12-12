import * as React from 'react';
import { CommonProps } from '../../';
import * as types from '../../types';

export interface SingleList extends CommonProps {
	beforeValueChange?: (...args: any[]) => any;
	customQuery?: (...args: any[]) => any;
	dataField?: string;
	defaultValue?: string;
	value?: string;
	filterLabel?: string;
	innerClass?: types.style;
	loader?: types.title;
	nestedField?: string;
	onValueChange?: (...args: any[]) => any;
	onChange?: (...args: any[]) => any;
	onError?: (...args: any[]) => any;
	placeholder?: string;
	react?: types.react;
	renderItem?: (...args: any[]) => any;
	renderError?: types.title;
	transformData?: (...args: any[]) => any;
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
	showLoadMore?: boolean;
	loadMoreLabel?: types.title;
}

declare const SingleList: React.ComponentType<SingleList>;

export default SingleList;
