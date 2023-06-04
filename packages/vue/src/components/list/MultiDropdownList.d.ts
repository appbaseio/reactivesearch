import type { CommonProps } from '../../index';
import * as types from '../../types.ts';

export interface MultiDropdownListProps extends CommonProps {
	beforeValueChange?: (...args: any[]) => any;
	customQuery?: (...args: any[]) => any;
	defaultQuery?: (...args: any[]) => any;
	dataField: string;
	defaultValue?: types.stringArray;
	value?: types.stringArray;
	filterLabel?: string;
	innerClass?: types.style;
	onValueChange?: (...args: any[]) => any;
	onChange?: (...args: any[]) => any;
	onError?: (...args: any[]) => any;
	placeholder?: string;
	searchPlaceholder?: string;
	queryFormat?: types.queryFormatSearch;
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
	themePreset?: types.themePreset;
	title?: types.title;
	showMissing?: boolean;
	missingLabel?: string;
	showLoadMore?: boolean;
	loadMoreLabel?: types.title;
	nestedField?: string;
	children?: (...args: any[]) => any;
	renderNoResults?: (...args: any[]) => any;
	showSearch?: boolean;
	index?: string;
	preferencesPath?: string;
	showClear?: boolean;
	endpoint?: types.endpointConfig;
}

declare function MultiDropdownList(props: MultiDropdownListProps): JSX.Element;

export default MultiDropdownList;
