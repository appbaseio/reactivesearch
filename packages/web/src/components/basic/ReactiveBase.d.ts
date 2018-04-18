import * as React from 'react';
import { CommonProps } from '../../';
import * as types from '../../types';

export interface ReactiveBaseProps {
	app: string;
	children?: types.children;
	credentials?: string;
	headers?: types.headers;
	queryParams?: string;
	theme?: types.style;
	themePreset?: types.themePreset;
	type?: string;
	url?: string;
	mapKey?: string;
	style?: types.style;
	className?: string;
}

declare const ReactiveBase: React.ComponentType<ReactiveBaseProps>;

export default ReactiveBase;
