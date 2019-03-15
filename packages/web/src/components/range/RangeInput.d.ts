import * as React from 'react';
import { CommonProps } from '../../';
import * as types from '../../types';

export interface RangeInputProps extends CommonProps {
	className: string;
	defaultSelected: types.range;
	innerClass: types.style;
	onValueChange: (...args: any[]) => any;
	range: types.range;
	stepValue: number;
	style: types.style;
	themePreset: types.themePreset;
	snapPoints?: (start: number, end: number, stepValue: number) => number[];
	algorithm?: {
		getValue: (position: number, min: number max: number) => number;
		getPosition: (position: number, min: number max: number) => number;
	};
	snap?: boolean;
}

declare const RangeInput: React.ComponentType<RangeInputProps>;

export default RangeInput;
