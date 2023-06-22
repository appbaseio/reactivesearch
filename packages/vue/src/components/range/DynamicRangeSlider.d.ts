import type { CommonProps } from '../..';
import * as types from '../../types.ts';

export interface DynamicRangeSliderProps extends CommonProps {
	beforeValueChange?: (...args: any[]) => any;
	className?: string;
	customQuery?: (...args: any[]) => any;
	dataField: string;
	defaultValue?: (...args: any[]) => any;
	value?: (...args: any[]) => any;
	filterLabel?: string;
	innerClass?: types.style;
	interval?: number;
	nestedField?: string;
	onDrag?: (...args: any[]) => any;
	onValueChange?: (...args: any[]) => any;
	onChange?: (...args: any[]) => any;
	rangeLabels?: (...args: any[]) => any;
	react?: types.react;
	showHistogram?: boolean;
	snap?: boolean;
	loader?: any;
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

declare function DynamicRange(props: DynamicRangeSliderProps): JSX.Element;

export default DynamicRange;
