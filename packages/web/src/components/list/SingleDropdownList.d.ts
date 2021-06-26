import * as React from 'react';
import { CommonProps } from '../..';
import * as types from '../../types';

export interface SingleDropdownList extends CommonProps {
	beforeValueChange?: (...args: any[]) => any;
	customQuery?: (...args: any[]) => any;
	defaultQuery?: (...args: any[]) => any;
	dataField: string;
	defaultValue?: string;
	value?: string;
	filterLabel?: string;
	innerClass?: types.style;
	loader?: types.title;
	onValueChange?: (...args: any[]) => any;
	onChange?: (...args: any[]) => any;
	onError?: (...args: any[]) => any;
	placeholder?: string;
	searchPlaceholder?: string;
	react?: types.react;
	render?: (...args: any[]) => any;
	renderItem?: (...args: any[]) => any;
	renderLabel?: (...args: any[]) => any;
	renderError?: types.title;
	transformData?: (...args: any[]) => any;
	selectAllLabel?: string;
	showCount?: boolean;
	showFilter?: boolean;
	size?: number;
	aggregationSize?: number;
	sortBy?: types.sortByWithCount;
	title?: types.title;
	themePreset?: types.themePreset;
	showMissing?: boolean;
	missingLabel?: string;
	showLoadMore?: boolean;
	loadMoreLabel?: types.title;
	nestedField?: string;
	renderNoResults?: (...args: any[]) => any;
	showSearch?: boolean;
	index?: string;
}

declare const SingleDropdownList: React.ComponentClass<SingleDropdownList>;

export default SingleDropdownList;
