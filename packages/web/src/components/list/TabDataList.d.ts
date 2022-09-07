import * as React from 'react';
import { CommonProps } from '../..';
import * as types from '../../types';

export interface TabDataList extends CommonProps {
	displayAsVertical: boolean;
	dataField: string;
	defaultValue?: string;
	value?: string;
	placeholder?: string;
	react?: types.react;
	title?: types.title;
	showCount?: boolean;
	render?: (...args: any[]) => any;
	renderItem?: (...args: any[]) => any;
	children?: (...args: any[]) => any;
	onChange?: (...args: any[]) => any;
	renderNoResults?: (...args: any[]) => any;
	endpoint?: types.endpointConfig;
}

declare const TabDataList: React.ComponentClass<TabDataList>;

export default TabDataList;
