import * as React from 'react';
import { CommonProps } from '../../';
import * as types from '../../types';

export interface MultiRangeProps extends CommonProps {
	beforeValueChange?: (...args: any[]) => any;
	customQuery?: (...args: any[]) => any;
	data?: types.data;
	dataField: string;
	defaultValue?: types.stringArray;
	value?: types.stringArray;
	filterLabel?: types.filterLabel;
	innerClass?: types.style;
	nestedField?: string;
	onValueChange?: (...args: any[]) => any;
	onChange?: (...args: any[]) => any;
	placeholder?: string;
	react?: types.react;
	showCheckbox: boolean;
	showFilter?: boolean;
	supportedOrientations?: types.supportedOrientations;
	title?: types.title;
	includeNullValues?: boolean;
}

declare const MultiRange: React.ComponentClass<MultiRangeProps>;

export default MultiRange;
