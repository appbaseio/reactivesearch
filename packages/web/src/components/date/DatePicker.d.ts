import * as React from 'react';
import { CommonProps } from '../../';
import * as types from '../../types';

export interface DatePickerProps extends CommonProps {
	clickUnselectsDay?: boolean;
	dataField: string;
	dayPickerInputProps?: types.props;
	defaultValue?: types.date;
	value?: types.date;
	filterLabel?: string;
	focused?: boolean;
	initialMonth?: types.dateObject;
	innerClass?: types.style;
	numberOfMonths?: number;
	placeholder?: string;
	nestedField?: string;
	queryFormat?: types.queryFormatDate;
	react?: types.react;
	showClear?: boolean;
	showFilter?: boolean;
	theme?: types.style;
	title?: string;
	onChange?: (...args: any[]) => any;
	parseDate?: (...args: any[]) => any;
	customQuery?: (...args: any[]) => any;
}

declare const DatePicker: React.ComponentClass<DatePickerProps>;

export default DatePicker;
