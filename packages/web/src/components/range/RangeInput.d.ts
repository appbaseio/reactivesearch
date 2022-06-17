import * as React from 'react';
import { CommonProps } from '../../';
import * as types from '../../types';

export interface RangeInputProps extends CommonProps {
	className?: string;
	dataField: string;
	defaultValue?: types.range;
	value?: types.range;
	innerClass?: types.style;
	onValueChange?: (...args: any[]) => any;
	validateRange?: (value: Array<number>) => boolean;
	onChange?: (...args: any[]) => any;
	range: types.range;
	stepValue?: number;
	style: types.style;
	themePreset?: types.themePreset;
	selectedValue?: types.selectedValue;
	includeNullValues?: boolean;
	index?: string;
	preferencesPath?: string;
	queryFormat?: types.queryFormatDate;
	calendarInterval?: types.calendarInterval;
}

declare const RangeInput: React.ComponentClass<RangeInputProps>;

export default RangeInput;
