import * as React from 'react';
import { CommonProps } from '../../';
import * as types from '../../types';

export interface DateRangeProps extends CommonProps {
	componentId: string;
	className?: string;
	onQueryChange?: (...args: any[]) => any;
	style?: types.style;
	// non-common props
	autoFocusEnd?: boolean;
	dataField: string;
	dayPickerInputProps?: types.props;
	defaultValue?: types.dateObject;
	value?: types.dateObject;
	filterLabel?: string;
	focused?: boolean;
	initialMonth?: types.dateObject;
	innerClass?: types.style;
	nestedField?: string;
	numberOfMonths?: number;
	placeholder?: types.rangeLabels;
	queryFormat?: types.queryFormatDate;
	react?: types.react;
	showClear?: boolean;
	showFilter?: boolean;
	theme?: types.style;
	title?: string;
	onValueChange?: (...args: any[]) => any;
	onChange?: (...args: any[]) => any;
	parseDate?: (...args: any[]) => any;
}

declare const DateRange: React.ComponentType<DateRangeProps>;

export default DateRange;
