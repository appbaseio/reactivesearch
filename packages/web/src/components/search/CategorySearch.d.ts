import * as React from "react";
import { CommonProps } from "../../";
import * as types from "../../types";

export interface CategorySearchProps extends CommonProps {
	autoFocus?: boolean;
	autosuggest?: boolean;
	beforeValueChange?: () => any;
	categoryField?: string;
	customHighlight?: () => any;
	customQuery?: () => any;
	dataField?: types.dataFieldArray;
	debounce?: number;
	defaultSelected?: string;
	defaultSuggestions?: types.suggestions;
	fieldWeights?: types.fieldWeights;
	filterLabel?: string;
	fuzziness?: types.fuzziness;
	highlight?: boolean;
	highlightField?: types.stringOrArray;
	icon?: types.children;
	iconPosition?: types.iconPosition;
	innerClass?: types.style;
	innerRef?: () => any;
	onBlur?: () => any;
	onFocus?: () => any;
	onKeyDown?: () => any;
	onKeyPress?: () => any;
	onKeyUp?: () => any;
	onSuggestion?: () => any;
	onValueChange?: () => any;
	placeholder?: string;
	queryFormat?: types.queryFormatSearch;
	react?: types.react;
	showFilter?: boolean;
	showIcon?: boolean;
	title?: types.title;
	theme?: types.style;
	themePreset?: types.themePreset;
}

declare const CategorySearch: React.ComponentType<CategorySearchProps>;

export default CategorySearch;
