import * as React from 'react';
import { CommonProps } from '../../';
import * as types from '../../types';

declare namespace ReactiveListTree {
	interface ReactiveListProps extends CommonProps {
		componentId: string;
		URLParams?: boolean;
		className?: string;
		style?: types.style;
		// non-common props
		children?: (data: any) => any;
		dataField: string;
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
		renderError?: types.title;
		onError?: (...args: any[]) => any;
		onNoResults?: types.title;
		pages?: number;
		pagination?: boolean;
		paginationAt?: types.paginationAt;
		react?: types.react;
		showResultStats?: boolean;
		size?: number;
		sortBy?: types.sortBy;
		sortOptions?: types.sortOptions;
		stream?: boolean;
		onPageChange?: (...args: any[]) => any;
		onPageClick?: (...args: any[]) => any;
		defaultPage?: number;
		listClass?: string;
		scrollTarget?: string;
	}

	interface CommonWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
		children: React.ReactNode;
	}

	class ReactiveList extends React.Component<ReactiveListProps, any> {
		static ResultListWrapper: React.ComponentType<CommonWrapperProps>;
		static ResultCardsWrapper: React.ComponentType<CommonWrapperProps>;
	}
}

export default ReactiveListTree.ReactiveList;
