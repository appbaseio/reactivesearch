import * as React from 'react';

import { CommonProps } from '../..';
import * as types from '../../types';

export interface DataSearchProps extends CommonProps {
	autoFocus?: boolean;
	autosuggest?: boolean;
	beforeValueChange?: (...args: any[]) => any;
	children?: (data: any) => any;
	customHighlight?: (...args: any[]) => any;
	customQuery?: (...args: any[]) => any;
	defaultQuery?: (...args: any[]) => any;
	dataField?: types.dataFieldArray;
	debounce?: number;
	defaultValue?: string;
	value?: string;
	defaultSuggestions?: types.suggestions;
	downShiftProps?: types.props;
	fieldWeights?: types.fieldWeights;
	filterLabel?: string;
	fuzziness?: types.fuzziness;
	highlight?: boolean;
	highlightField?: types.stringOrArray;
	icon?: types.children;
	iconPosition?: types.iconPosition;
	innerClass?: types.style;
	nestedField?: string;
	onBlur?: (...args: any[]) => any;
	onError?: (...args: any[]) => any;
	onFocus?: (...args: any[]) => any;
	onKeyDown?: (...args: any[]) => any;
	onKeyPress?: (...args: any[]) => any;
	onKeyUp?: (...args: any[]) => any;
	onSuggestions?: (...args: any[]) => any;
	onValueChange?: (...args: any[]) => any;
	onChange?: (...args: any[]) => any;
	onValueSelected?: (...args: any[]) => any;
	placeholder?: string;
	queryFormat?: types.queryFormatSearch;
	react?: types.react;
	render?: (data: any) => any;
	parseSuggestion?: (...args: any[]) => any;
	renderNoSuggestion?: types.title;
	renderError?: types.title;
	showFilter?: boolean;
	showIcon?: boolean;
	title?: types.title;
	theme?: types.style;
	loader?: types.title;
	themePreset?: types.themePreset;
}

declare const DataSearch: React.ComponentType<DataSearchProps>;

export default DataSearch;
