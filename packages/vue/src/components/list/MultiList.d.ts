import type { CommonProps } from '../../index';
import * as types from '../../types.ts';

export interface MultiListProps extends CommonProps {
	beforeValueChange?: (...args: any[]) => any;
	customQuery?: (...args: any[]) => any;
	defaultQuery?: (...args: any[]) => any;
	dataField: string;
	nestedField?: string;
	defaultValue?: types.stringArray;
	value?: types.stringArray;
	filterLabel?: string;
	innerClass?: types.style;
	onValueChange?: (...args: any[]) => any;
	onChange?: (...args: any[]) => any;
	onError?: (...args: any[]) => any;
	placeholder?: string;
	queryFormat?: types.queryFormatSearch;
	react?: types.react;
	render?: (...args: any[]) => any;
	renderItem?: (...args: any[]) => any;
	renderError?: types.title;
	transformData?: (...args: any[]) => any;
	selectAllLabel?: string;
	showCheckbox?: boolean;
	showCount?: boolean;
	showFilter?: boolean;
	showSearch?: boolean;
	size?: number;
	aggregationSize?: number;
	sortBy?: types.sortByWithCount;
	themePreset?: types.themePreset;
	title?: types.title;
	showMissing?: boolean;
	missingLabel?: string;
	showLoadMore?: boolean;
	loadMoreLabel?: types.title;
	children?: (...args: any[]) => any;
	renderNoResults?: (...args: any[]) => any;
	index?: string;
	preferencesPath?: string;
	endpoint?: types.endpointConfig;
}

declare function MultiList(props: MultiListProps): JSX.Element;

export default MultiList;
