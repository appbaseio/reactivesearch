import * as React from 'react';
import { CommonProps } from '../..';
import * as types from '../../types';

export interface MultiList extends CommonProps {
	beforeValueChange?: (...args: any[]) => any;
	customQuery?: (...args: any[]) => any;
	defaultQuery?: (...args: any[]) => any;
	dataField: string;
	nestedField?: string;
	defaultValue?: types.stringArray;
	value?: types.stringArray;
	filterLabel?: string;
	innerClass?: types.style;
	loader?: types.title;
	onValueChange?: (...args: any[]) => any;
	onChange?: (...args: any[]) => any;
	onError?: (...args: any[]) => any;
	placeholder?: string;
	queryFormat?: types.queryFormatSearch;
	react?: types.react;
	render?: (...args: any[]) => any;
	renderItem?: (...args: any[]) => any;
	renderError?: types.title;
	transformData?: (...args: any[]) => any;
	selectAllLabel?: string;
	showCheckbox: boolean;
	showCount?: boolean;
	showFilter?: boolean;
	showSearch?: boolean;
	size?: number;
	sortBy?: types.sortByWithCount;
	themePreset?: types.themePreset;
	title?: types.title;
	showMissing?: boolean;
	missingLabel?: string;
	showLoadMore?: boolean;
	loadMoreLabel?: types.title;
	children?: (...args: any[]) => any;
	renderNoResults?: (...args: any[]) => any;
}

declare const MultiList: React.ComponentClass<MultiList>;

export default MultiList;
