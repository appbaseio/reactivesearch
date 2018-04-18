import * as React from 'react';
import { CommonProps } from '../../';
import * as types from '../../types';

export interface TagCloudProps extends CommonProps {
	beforeValueChange?: (...args: any[]) => any;
	customQuery?: (...args: any[]) => any;
	dataField: string;
	defaultSelected?: types.stringOrArray;
	filterLabel?: string;
	innerClass?: types.style;
	multiSelect?: boolean;
	onValueChange?: (...args: any[]) => any;
	queryFormat?: types.queryFormatSearch;
	react?: types.react;
	showCount?: boolean;
	showFilter?: boolean;
	size?: number;
	sortBy?: types.sortByWithCount;
	title?: types.title;
}

declare const TagCloud: React.ComponentType<TagCloudProps>;

export default TagCloud;
