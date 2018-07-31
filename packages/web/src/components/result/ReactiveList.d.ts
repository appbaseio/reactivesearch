import * as React from 'react';
import { CommonProps } from '../../';
import * as types from '../../types';

export interface ReactiveListProps extends CommonProps {
	componentId: string;
	URLParams?: boolean;
	className?: string;
	style?: types.style;
	// non-common props
	dataField: string;
	defaultQuery?: (...args: any[]) => any;
	innerClass?: types.style;
	loader?: types.title;
	onAllData?: (data: any) => any;
	onData?: (data: any) => any;
	onError?: (...args: any[]) => any;
	onNoResults?: types.title;
	onResultStats?: (...args: any[]) => any;
	renderResultStats?: (...args: any[]) => any;
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
}

declare const ReactiveList: React.ComponentType<ReactiveListProps>;

export default ReactiveList;
