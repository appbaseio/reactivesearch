import * as React from 'react';
import { CommonProps } from '../..';
import * as types from '../../types';

export interface TabDataList extends CommonProps {
	displayAsVertical: boolean;
	dataField: string;
	defaultValue?: string;
	value?: string;
	placeholder?: string;
	nestedField?: string;
	react?: types.react;
	selectAllLabel?: string;
	showSearch?: boolean;
	title?: types.title;
	showCount?: boolean;
	render?: (...args: any[]) => any;
	renderItem?: (...args: any[]) => any;
	children?: (...args: any[]) => any;
	onChange?: (...args: any[]) => any;
	renderNoResults?: (...args: any[]) => any;
	enableStrictSelection?: boolean;
}

declare const TabDataList: React.ComponentClass<TabDataList>;

export default TabDataList;
