import * as React from 'react';
import { CommonProps } from '../../';
import * as types from '../../types';

export interface DataControllerProps extends CommonProps {
	beforeValueChange?: (...args: any[]) => any;
	children?: types.children;
	customQuery?: (...args: any[]) => any;
	defaultSelected?: any;
	filterLabel?: string;
	onValueChange?: (...args: any[]) => any;
	showFilter?: boolean;
}

declare const DataController: React.ComponentType<DataControllerProps>;

export default DataController;
