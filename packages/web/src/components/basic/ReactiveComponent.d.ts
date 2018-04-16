import * as React from 'react';
import { CommonProps } from '../../';
import * as types from '../../types';

export interface ReactiveComponentProps {
	children?: types.children;
	componentId: string;
	defaultQuery?: (...args: any[]) => any;
	filterLabel?: string;
	onAllData?: (...args: any[]) => any;
	react?: types.react;
	showFilter?: boolean;
	onQueryChange?: (...args: any[]) => any;
	URLParams?: boolean;
}

declare const ReactiveComponent: React.ComponentType<ReactiveComponentProps>;

export default ReactiveComponent;
