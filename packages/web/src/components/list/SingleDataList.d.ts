import * as React from 'react';
import { CommonProps } from '../../';
import * as types from '../../types';

export interface SingleDataList extends CommonProps {
	beforeValueChange?: (...args: any[]) => any;
	customQuery?: (...args: any[]) => any;
	defaultQuery?: (...args: any[]) => any;
	data?: types.data;
	dataField: string;
	defaultValue?: string;
	value?: string;
	filterLabel?: string;
	innerClass?: types.style;
	onValueChange?: (...args: any[]) => any;
	placeholder?: string;
	nestedField?: string;
	react?: types.react;
	selectAllLabel?: string;
	showFilter?: boolean;
	showRadio: boolean;
	showSearch?: boolean;
	themePreset?: types.themePreset;
	title?: types.title;
	showCount?: boolean;
	render?: (...args: any[]) => any;
	renderItem?: (...args: any[]) => any;
	children?: (...args: any[]) => any;
	onChange?: (...args: any[]) => any;
	renderNoResults?: (...args: any[]) => any;
	index?: string;
	enableStrictSelection?: boolean;
}

declare const SingleDataList: React.ComponentClass<SingleDataList>;

export default SingleDataList;
