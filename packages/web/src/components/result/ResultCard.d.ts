import * as React from "react";
import { CommonProps } from "../../";
import * as types from "../../types";

export interface ResultCardProps {
	innerClass?: types.style;
	target: string;
	onData?: () => any;
}

declare const ResultCard: React.ComponentType<ResultCardProps>;

export default ResultCard;
