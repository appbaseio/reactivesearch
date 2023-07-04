export type components = string[];

export type children = any;

export type data = any[];

export type dataFieldArray = string | string[];

export interface dataNumberBox {
	label?: string;
	start: number;
	end: number;
}

export type date = string | string[];

export type dateObject = object;

export type fieldWeights = number[];

export type filterLabel = string;

export type fuzziness = 0 | 1 | 2 | 'AUTO';

export type headers = object;

export type hits = object[];

export type iconPosition = 'left' | 'right';

export type labelPosition = 'left' | 'right' | 'top' | 'bottom';

export type options = object | object[];

export type paginationAt = 'top' | 'bottom' | 'both';

export type tooltipTrigger = 'hover' | 'none' | 'focus' | 'always';

export type chartType = 'pie' | 'scatter' | 'histogram' | 'bar' | 'line';

export interface range {
	start: number;
	end: number;
}

export interface rangeLabels {
	start: string;
	end: string;
}

type reactKeyType = string | string[] | object;

export interface react {
	and?: reactKeyType;
	or?: reactKeyType;
	not?: reactKeyType;
}

export type selectedValues = object;

export type selectedValue = string | string[] | object[] | object | number | number[];

export type suggestions = object[];

export type supportedOrientations =
	| 'portrait'
	| 'portrait-upside-down'
	| 'landscape'
	| 'landscape-left'
	| 'landscape-right';

export type sortBy = 'asc' | 'desc';

export interface sortOption {
	label: string;
	dataField: string;
	sortBy: string;
}

export type sortByWithCount = 'asc' | 'desc' | 'count';

export type stats = object[];

export type stringArray = string[];

export type stringOrArray = string | string[];

export type style = object;

export type themePreset = 'light' | 'dark';

export type queryFormatDate =
	| 'date'
	| 'basic_date'
	| 'basic_date_time'
	| 'basic_date_time_no_millis'
	| 'date_time_no_millis'
	| 'basic_time'
	| 'basic_time_no_millis'
	| 'epoch_millis'
	| 'epoch_second';

export type queryFormatSearch = 'and' | 'or';

export type queryFormatNumberBox = 'exact' | 'lte' | 'gte';

export type params = object;

export type props = object;

export type rangeLabelsAlign = 'left' | 'right';

export type title = string | any;

export type focusShortcuts = string[] | number[];

export interface location {
	lat: number;
	lng: number;
}

export type unit =
	| 'mi'
	| 'miles'
	| 'yd'
	| 'yards'
	| 'ft'
	| 'feet'
	| 'in'
	| 'inch'
	| 'km'
	| 'kilometers'
	| 'm'
	| 'meters'
	| 'cm'
	| 'centimeters'
	| 'mm'
	| 'millimeters'
	| 'NM'
	| 'nmi'
	| 'nauticalmiles';

export interface analyticsConfig {
	emptyQuery: boolean;
	suggestionAnalytics: boolean;
	userId: string;
	customEvents: object;
}

export interface appbaseConfig {
	recordAnalytics: boolean;
	emptyQuery: boolean;
	suggestionAnalytics: boolean;
	enableQueryRules: boolean;
	enableSearchRelevancy: boolean;
	userId: string;
	useCache: boolean;
	customEvents: object;
	enableTelemetry: boolean;
}

export type showClearAll = 'never' | 'always' | 'default' | true | false;

export type resetToDefault = boolean;

export type calendarInterval = 'month' | 'day' | 'year' | 'week' | 'quarter' | 'hour' | 'minute';

export interface popularSuggestionsConfig {
	size?: number;
	minCount?: number;
	minChars?: number;
	showGlobal?: boolean;
	index?: string;
	preferencesPath?: string;
	sectionLabel?: string;
}

export interface recentSuggestionsConfig {
	size?: number;
	minHits?: number;
	minChars?: number;
	index?: string;
	preferencesPath?: string;
	sectionLabel?: string;
}

export interface indexSuggestionsConfig {
	sectionLabel?: string;
	size?: number;
	index?: string;
	preferencesPath?: string;
}
export interface featuredSuggestionsConfig {
	featuredSuggestionsGroupId: string;
	maxSuggestionsPerSection?: number;
	sectionsOrder?: stringArray;
}

export interface FAQSuggestionsConfig {
	sectionLabel?: string;
	size?: number;
}

export interface endpointConfig {
	url: string;
	headers?: object;
	body?: object;
	method?: string;
}

export interface AiConfig {
	systemPrompt?: string;
	topDocsForContext?: number;
	maxTokens?: number;
	docTemplate?: string;
	queryTemplate?: string;
	temperature?: number;
}

export interface AIUIConfig {
	loaderMessage?: string | children;
	showSourceDocuments?: boolean;
	renderSourceDocument?: (sourceObject: object) => string | children;
	onSourceClick?: (sourceObject: object) => void;
	renderAskButton?: (onAskButtonClick: any) => children;
	askButton?: boolean;
	showFeedback?: boolean;
}
