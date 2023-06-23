import type { CommonProps } from '../../index';
import * as types from '../../types.ts';

export interface SingleDropdownListProps extends CommonProps {
	beforeValueChange?: (...args: any[]) => any;
	customQuery?: (...args: any[]) => any;
	defaultQuery?: (...args: any[]) => any;
	dataField: string;
	defaultValue?: string;
	value?: string;
	filterLabel?: string;
	innerClass?: types.style;
	onValueChange?: (...args: any[]) => any;
	onChange?: (...args: any[]) => any;
	onError?: (...args: any[]) => any;
	placeholder?: string;
	searchPlaceholder?: string;
	react?: types.react;
	render?: (...args: any[]) => any;
	renderItem?: (...args: any[]) => any;
	renderLabel?: (...args: any[]) => any;
	renderError?: types.title;
	transformData?: (...args: any[]) => any;
	selectAllLabel?: string;
	showCount?: boolean;
	showFilter?: boolean;
	size?: number;
	aggregationSize?: number;
	sortBy?: types.sortByWithCount;
	title?: types.title;
	themePreset?: types.themePreset;
	showMissing?: boolean;
	missingLabel?: string;
	showLoadMore?: boolean;
	loadMoreLabel?: types.title;
	nestedField?: string;
	renderNoResults?: (...args: any[]) => any;
	showSearch?: boolean;
	index?: string;
	preferencesPath?: string;
	showClear?: boolean;
	endpoint?: types.endpointConfig;
}

declare function SingleDropdownList(props: SingleDropdownListProps): JSX.Element;

export default SingleDropdownList;
