import { VNode } from 'vue';
import type { CommonProps } from '../..';
import * as types from '../../types.ts';

export interface SearchBoxProps extends CommonProps {
	autoFocus?: boolean;
	autosuggest?: boolean;
	beforeValueChange?: (...args: any[]) => any;
	children?: (data: any) => any;
	customHighlight?: (...args: any[]) => any;
	highlightConfig?: Object;
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
	iconURL?: string;
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
	render?: (data: object) => VNode[];
	renderNoSuggestion?: types.title;
	renderError?: types.title;
	showFilter?: boolean;
	showIcon?: boolean;
	title?: types.title;
	theme?: types.style;
	type?: string;
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
	showFocusShortcutsIcon?: boolean;
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
	showSuggestionsFooter?: boolean;
	renderSuggestionsFooter?: ()=>types.children;
	applyStopwords?: boolean;
	customStopwords?: string[];
	enterButton?: boolean;
	renderEnterButton?: (onClick: any) => types.children;
	searchboxId?: string;
	endpoint?: types.endpointConfig;
	mode?: string;
	renderSelectedTags?: (paramObject: {
		values: Array<string>;
		handleClear: (val: string) => void;
		handleClearAll: () => void;
	}) => any;
}

declare function SearchBox(props: SearchBoxProps): JSX.Element;

export default SearchBox;
