import * as React from 'react';
import { CommonProps } from '../../';
import * as types from '../../types';

export interface SingleDataList extends CommonProps {
	beforeValueChange?: (...args: any[]) => any;
	customQuery?: (...args: any[]) => any;
	data?: types.data;
	dataField: string;
	defaultSelected?: string;
	filterLabel?: string;
	innerClass?: types.style;
	onValueChange?: (...args: any[]) => any;
	placeholder?: string;
	react?: types.react;
	selectAllLabel?: string;
	showFilter?: boolean;
	showRadio: boolean;
	showSearch?: boolean;
	themePreset?: types.themePreset;
	title?: types.title;
}

declare const SingleDataList: React.ComponentType<SingleDataList>;

export default SingleDataList;
