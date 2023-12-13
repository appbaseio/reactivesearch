import type { CommonProps } from '../..';
import * as types from '../../types.ts';

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
	index?: string;
	preferencesPath?: string;
	endpoint?: types.endpointConfig;
}

declare function MultiRange(props: MultiRangeProps): JSX.Element;

export default MultiRange;
