import * as React from 'react';

import { CommonProps } from '../..';
import * as types from '../../types';

interface categorySearchValue {
	term: string;
	category?: string;
}

export interface CategorySearchProps extends CommonProps {
	autoFocus?: boolean;
	autosuggest?: boolean;
	beforeValueChange?: (...args: any[]) => any;
	categoryField?: string;
	children?: (data: any) => any;
	customHighlight?: (...args: any[]) => any;
	customQuery?: (...args: any[]) => any;
	defaultQuery?: (...args: any[]) => any;
	enableSynonyms?: boolean;
	// TODO: Remove in v4
	enableQuerySuggestions?: boolean;
	enablePopularSuggestions?: boolean;
	enableRecentSearches?: boolean;
	excludeFields?: Array<string>;
	queryString?: boolean;
	getMicInstance?: (...args: any[]) => any;
	renderMic?: (...args: any[]) => any;
	dataField?: types.dataFieldArray;
	aggregationField?: string;
	aggregationSize?: number;
	size?: number;
	debounce?: number;
	defaultValue?: categorySearchValue;
	value?: categorySearchValue;
	defaultSuggestions?: types.suggestions;
	downShiftProps?: types.props;
	fieldWeights?: types.fieldWeights;
	filterLabel?: string;
	fuzziness?: types.fuzziness;
	highlight?: boolean;
	highlightField?: types.stringOrArray;
	icon?: types.children;
	iconPosition?: types.iconPosition;
	includeFields?: Array<string>;
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
	// TODO: Remove in v4
	renderQuerySuggestions?: (data: any) => any;
	renderPopularSuggestions?: (data: any) => any;
	parseSuggestion?: (...args: any[]) => any;
	renderError?: types.title;
	renderNoSuggestion?: types.title;
	showFilter?: boolean;
	showIcon?: boolean;
	title?: types.title;
	loader?: types.title;
	theme?: types.style;
	themePreset?: types.themePreset;
	clearIcon?: types.children;
	showClear?: boolean;
	strictSelection?: boolean;
	showDistinctSuggestions?: boolean;
	searchOperators?: boolean;
	showVoiceSearch?: boolean;
	enablePredictiveSuggestions?: boolean;
	distinctField?: string;
	distinctFieldConfig?: object;
	index?: string;
}

declare const CategorySearch: React.ComponentClass<CategorySearchProps>;

export default CategorySearch;
