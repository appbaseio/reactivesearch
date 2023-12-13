import type { CommonProps } from '../..';
import * as types from '../../types.ts';

export interface SingleRangeProps extends CommonProps {
	beforeValueChange?: (...args: any[]) => any;
	customQuery?: (...args: any[]) => any;
	data?: types.data;
	dataField: string;
	defaultValue?: string;
	value?: string;
	filterLabel?: string;
	innerClass?: types.style;
	nestedField?: string;
	onValueChange?: (...args: any[]) => any;
	onChange?: (...args: any[]) => any;
	react?: types.react;
	showFilter?: boolean;
	showRadio: boolean;
	title?: types.title;
	includeNullValues?: boolean;
	index?: string;
	preferencesPath?: string;
	endpoint?: types.endpointConfig;
}

declare function SingleRange(props: SingleRangeProps): JSX.Element;

export default SingleRange;
