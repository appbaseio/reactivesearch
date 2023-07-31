import type { CommonProps } from '../..';
import * as types from '../../types.ts';

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
	rangeLabels: types.rangeLabels;
	stepValue?: number;
	style: types.style;
	themePreset?: types.themePreset;
	selectedValue?: types.selectedValue;
	includeNullValues?: boolean;
	showHistogram?: boolean;
	index?: string;
	preferencesPath?: string;
	queryFormat?: types.queryFormatDate;
	calendarInterval?: types.calendarInterval;
	endpoint?: types.endpointConfig;
}

declare function RangeInput(props: RangeInputProps): JSX.Element;

export default RangeInput;
