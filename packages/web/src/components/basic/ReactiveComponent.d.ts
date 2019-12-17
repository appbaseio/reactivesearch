import * as React from 'react';
import { CommonProps } from '../../';
import * as types from '../../types';

export interface ReactiveComponentProps {
	children?: (...args: any[]) => any;
	render?: (...args: any[]) => any;
	componentId: string;
	aggregationField?: string;
	size?: number;
	defaultQuery?: (...args: any[]) => any;
	customQuery?: (...args: any[]) => any;
	defaultValue?: any;
	value?: any;
	filterLabel?: string;
	onData?: (...args: any[]) => any;
	onError?: (...args: any[]) => any;
	react?: types.react;
	showFilter?: boolean;
	onQueryChange?: (...args: any[]) => any;
	URLParams?: boolean;
}

declare const ReactiveComponent: React.ComponentClass<ReactiveComponentProps>;

export default ReactiveComponent;
