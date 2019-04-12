import * as React from 'react';
import { CommonProps } from '../../';
import * as types from '../../types';

export interface ReactiveComponentProps {
	children?: (...args: any[]) => any;
	render?: (...args: any[]) => any;
	componentId: string;
	defaultQuery?: (...args: any[]) => any;
	customQuery?: (...args: any[]) => any;
	defaultValue?: any;
	value?: any;
	filterLabel?: string;
	onAllData?: (...args: any[]) => any;
	onError?: (...args: any[]) => any;
	react?: types.react;
	showFilter?: boolean;
	onQueryChange?: (...args: any[]) => any;
	URLParams?: boolean;
}

declare const ReactiveComponent: React.ComponentType<ReactiveComponentProps>;

export default ReactiveComponent;
