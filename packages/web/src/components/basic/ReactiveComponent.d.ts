import * as React from "react";
import { CommonProps } from "../../";
import * as types from "../../types";

export interface ReactiveComponentProps {
	children?: types.children;
	componentId: string;
	defaultQuery?: () => any;
	filterLabel?: string;
	onAllData?: () => any;
	react?: types.react;
	showFilter?: boolean;
	onQueryChange?: () => any;
	URLParams: boolean;
}

declare const ReactiveComponent: React.ComponentType<ReactiveComponentProps>;

export default ReactiveComponent;
