import * as React from "react";
import { CommonProps } from "../../";
import * as types from "../../types";

export interface DataControllerProps extends CommonProps {
	beforeValueChange?: () => any;
	children?: types.children;
	customQuery?: () => any;
	defaultSelected?: any;
	filterLabel?: string;
	onValueChange?: () => any;
	showFilter?: boolean;
}

declare const DataController: React.ComponentType<DataControllerProps>;

export default DataController;
