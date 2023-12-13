import type { CommonProps } from '../..';
import * as types from '../../types.ts';

export interface RangeSliderProps extends CommonProps {
	beforeValueChange?: (...args: any[]) => any;
	customQuery?: (...args: any[]) => any;
	histogramQuery?: (props: RangeSliderProps) => any;
	dataField: string;
	defaultValue?: types.range;
	value?: types.range;
	filterLabel?: string;
	innerClass?: types.style;
	interval?: number;
	nestedField?: string;
	onDrag?: (...args: any[]) => any;
	onValueChange?: (...args: any[]) => any;
	onChange?: (...args: any[]) => any;
	validateRange?: (value: Array<number>) => boolean;
	range?: types.range;
	rangeLabels?: types.rangeLabels;
	react?: types.react;
	showHistogram?: boolean;
	showSlider?: boolean;
	snap?: boolean;
	stepValue?: number;
	title?: types.title;
	showFilter?: boolean;
	tooltipTrigger?: types.tooltipTrigger;
	renderTooltipData?: (...args: any[]) => any;
	includeNullValues?: boolean;
	index?: string;
	preferencesPath?: string;
	queryFormat?: types.queryFormatDate;
	calendarInterval?: types.calendarInterval;
	endpoint?: types.endpointConfig;
}

declare function RangeSlider(props: RangeSliderProps): JSX.Element;

export default RangeSlider;
