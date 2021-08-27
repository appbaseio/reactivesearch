import * as React from 'react';
import { CommonProps } from '../../';
import * as types from '../../types';

declare namespace ReactiveListTree {
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
		render?: (data: any) => any;
		renderItem?: (data: any) => any;
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
	}

	interface CommonWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
		children: React.ReactNode;
	}

	class ReactiveList extends React.Component<ReactiveListProps, any> {
		static ResultListWrapper: React.ComponentClass<CommonWrapperProps>;
		static ResultCardsWrapper: React.ComponentClass<CommonWrapperProps>;
	}
}

export default ReactiveListTree.ReactiveList;
