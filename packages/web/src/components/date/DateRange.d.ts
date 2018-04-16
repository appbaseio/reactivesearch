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
	defaultSelected?: types.dateObject;
	filterLabel?: string;
	focused?: boolean;
	initialMonth?: types.dateObject;
	innerClass?: types.style;
	numberOfMonths?: number;
	placeholder?: types.rangeLabels;
	queryFormat?: types.queryFormatDate;
	react?: types.react;
	showClear?: boolean;
	showFilter?: boolean;
	theme?: types.style;
	title?: string;
}

declare const DateRange: React.ComponentType<DateRangeProps>;

export default DateRange;
