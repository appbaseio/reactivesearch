import * as React from 'react';
import { CommonProps } from '../../';
import * as types from '../../types';

export interface RangeInputProps extends CommonProps {
	className: string;
	defaultValue: types.range;
	value: types.range;
	innerClass: types.style;
	onValueChange: (...args: any[]) => any;
	onChange: (...args: any[]) => any;
	range: types.range;
	stepValue: number;
	style: types.style;
	themePreset: types.themePreset;
}

declare const RangeInput: React.ComponentType<RangeInputProps>;

export default RangeInput;
