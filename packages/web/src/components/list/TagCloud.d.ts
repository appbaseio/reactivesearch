import * as React from 'react';
import { CommonProps } from '../..';
import * as types from '../../types';

export interface TagCloudProps extends CommonProps {
	beforeValueChange?: (...args: any[]) => any;
	customQuery?: (...args: any[]) => any;
	dataField: string;
	defaultValue?: types.stringOrArray;
	value?: types.stringOrArray;
	filterLabel?: string;
	innerClass?: types.style;
	loader?: any;
	multiSelect?: boolean;
	onValueChange?: (...args: any[]) => any;
	onChange?: (...args: any[]) => any;
	onError?: (...args: any[]) => any;
	nestedField?: string;
	queryFormat?: types.queryFormatSearch;
	react?: types.react;
	renderError?: types.title;
	showCount?: boolean;
	showFilter?: boolean;
	size?: number;
	aggregationSize?: number;
	sortBy?: types.sortByWithCount;
	title?: types.title;
	index?: string;
}

declare const TagCloud: React.ComponentClass<TagCloudProps>;

export default TagCloud;
