import * as React from 'react';

import { CommonProps } from '../..';
import * as types from '../../types';

export interface SearchBoxProps extends CommonProps {
	autoFocus?: boolean;
	autosuggest?: boolean;
	beforeValueChange?: (...args: any[]) => any;
	children?: (data: any) => any;
	customHighlight?: (...args: any[]) => any;
	customQuery?: (...args: any[]) => any;
	defaultQuery?: (...args: any[]) => any;
	excludeFields?: Array<string>;
	getMicInstance?: (...args: any[]) => any;
	renderMic?: (...args: any[]) => any;
	dataField?: types.dataFieldArray;
	enableSynonyms?: boolean;
	queryString?: boolean;
	enablePopularSuggestions?: boolean;
	enableRecentSuggestions?: boolean;
	aggregationField?: string;
	aggregationSize?: number;
	size?: number;
	debounce?: number;
	defaultValue?: types.date;
	value?: types.date;
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
	onData?: (...args: any[]) => any;
	onValueChange?: (...args: any[]) => any;
	onChange?: (...args: any[]) => any;
	onValueSelected?: (...args: any[]) => any;
	placeholder?: string;
	queryFormat?: types.queryFormatSearch;
	react?: types.react;
	render?: (data: any) => any;
	renderNoSuggestion?: types.title;
	renderError?: types.title;
	showFilter?: boolean;
	showIcon?: boolean;
	title?: types.title;
	theme?: types.style;
	type?: string;
	loader?: types.title;
	themePreset?: types.themePreset;
	clearIcon?: types.children;
	showClear?: boolean;
	strictSelection?: boolean;
	searchOperators?: boolean;
	showVoiceSearch?: boolean;
	showDistinctSuggestions?: boolean;
	enablePredictiveSuggestions?: boolean;
	distinctField?: string;
	distinctFieldConfig?: object;
	focusShortcuts?: types.focusShortcuts;
	addonBefore?: types.children;
	addonAfter?: types.children;
	expandSuggestionsContainer?: boolean;
	index?: string;
	preferencesPath?: string;
	popularSuggestionsConfig?: types.popularSuggestionsConfig;
	recentSuggestionsConfig?: types.recentSuggestionsConfig;
	indexSuggestionsConfig?: types.indexSuggestionsConfig;
	featuredSuggestionsConfig?: types.featuredSuggestionsConfig;
	enableIndexSuggestions?: boolean;
	enableFeaturedSuggestions?: boolean;
	applyStopwords?: boolean;
	customStopwords?: string[];
	enterButton?: boolean;
	renderEnterButton?: (onClick: any) => types.children;
	searchboxId?: string;
	endpoint?: types.endpointConfig;
	mode?: string;
}

declare const SearchBox: React.ComponentClass<SearchBoxProps>;

export default SearchBox;
