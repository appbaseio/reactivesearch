import * as React from "react";
import { CommonProps } from "../../";
import * as types from "../../types";

export interface ReactiveListProps extends CommonProps {
	componentId: string;
	URLParams: boolean;
	className?: string;
	style?: types.style;
	// non-common props
	dataField: string;
	defaultQuery?: () => any;
	innerClass?: types.style;
	loader?: types.title;
	onAllData?: () => any;
	onData?: () => any;
	onResultStats?: () => any;
	pages?: number;
	pagination?: boolean;
	paginationAt?: types.paginationAt;
	react?: types.react;
	showResultStats?: boolean;
	size?: number;
	sortBy?: types.sortBy;
	sortOptions?: types.sortOptions;
	stream?: boolean;
	onPageChange?: () => any;
	defaultPage?: number;
	listClass?: string;
}

declare const ReactiveList: React.ComponentType<ReactiveListProps>;

export default ReactiveList;
