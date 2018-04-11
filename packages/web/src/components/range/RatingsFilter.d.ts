import * as React from "react";
import { CommonProps } from "../../";
import * as types from "../../types";

export interface RatingsFilterProps extends CommonProps {
	beforeValueChange?: () => any;
	customQuery?: () => any;
	data?: types.data;
	dataField: string;
	defaultSelected?: types.range;
	filterLabel?: string;
	innerClass?: types.style;
	onValueChange?: () => any;
	react?: types.react;
	title?: types.title;
}

declare const RatingsFilter: React.ComponentType<RatingsFilterProps>;

export default RatingsFilter;
