import * as React from "react";
import { CommonProps } from "../../";
import * as types from "../../types";

export interface ResultListProps {
	innerClass?: types.style;
	target: string;
	onData?: () => any;
}

declare const ResultList: React.ComponentType<ResultListProps>;

export default ResultList;
