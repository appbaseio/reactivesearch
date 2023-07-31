import { VNode } from 'vue';
import type { CommonProps } from '../../index.d.ts';
import * as types from '../../types.ts';

interface ReactiveListProps extends CommonProps {
	children?: (data: any) => any;
	dataField: string;
	aggregationField?: string;
	aggregationSize?: number;
	defaultQuery?: (...args: any[]) => any;
	defaultSortOption?: string;
	excludeFields?: Array<string>;
	innerClass?: types.style;
	infiniteScroll?: boolean;
	includeFields?: Array<string>;
	loader?: types.title;
	render?: (data: any) => VNode[];
	renderItem?: (data: any) => VNode[];
	renderResultStats?: (...args: any[]) => any;
	renderPagination?: (data: any) => any;
	renderError?: types.title;
	onError?: (...args: any[]) => any;
	onNoResults?: types.title;
	pages?: number;
	pagination?: boolean;
	paginationAt?: types.paginationAt;
	showEndPage?: boolean;
	react?: types.react;
	showResultStats?: boolean;
	showLoader?: boolean;
	size?: number;
	sortBy?: types.sortBy;
	sortOptions?: types.sortOption[];
	onPageChange?: (...args: any[]) => any;
	onPageClick?: (...args: any[]) => any;
	defaultPage?: number;
	listClass?: string;
	scrollTarget?: string | Element | HTMLDocument;
	onData?: (...args: any[]) => any;
	renderNoResults?: types.title;
	scrollOnChange?: boolean;
	distinctField?: string;
	distinctFieldConfig?: object;
	index?: string;
	preferencesPath?: string;
	showExport?: boolean;
	renderExport?: (paramObj?: object) => any;
	endpoint?: types.endpointConfig;
	highlight?: boolean;
	highlightConfig?: Object;
}

declare function ReactiveList(props: ReactiveListProps): JSX.Element;

export default ReactiveList;
