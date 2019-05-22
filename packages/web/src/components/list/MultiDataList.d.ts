import * as React from 'react';
import { CommonProps } from '../../';
import * as types from '../../types';

export interface MultiDataList extends CommonProps {
	beforeValueChange?: (...args: any[]) => any;
	customQuery?: (...args: any[]) => any;
	defaultQuery?: (...args: any[]) => any;
	data?: types.data;
	defaultValue?: types.stringArray;
	value?: types.stringArray;
	dataField: string;
	filterLabel?: string;
	innerClass?: types.style;
	onValueChange?: (...args: any[]) => any;
	placeholder?: string;
	nestedField?: string;
	queryFormat?: types.queryFormatSearch;
	react?: types.react;
	selectAllLabel?: string;
	showCheckbox: boolean;
	showFilter?: boolean;
	showSearch?: boolean;
	themePreset?: types.themePreset;
	title?: types.title;
	showCount?: boolean;
	render?: (...args: any[]) => any;
	renderItem?: (...args: any[]) => any;
	children?: (...args: any[]) => any;
	onChange?: (...args: any[]) => any;
	renderNoResults?: (...args: any[]) => any;
}

declare const MultiDataList: React.ComponentClass<MultiDataList>;

export default MultiDataList;
