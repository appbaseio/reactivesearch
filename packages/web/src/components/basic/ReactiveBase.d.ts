import * as React from 'react';
import { CommonProps } from '../../';
import * as types from '../../types';

export interface ReactiveBaseProps {
	app: string;
	children?: types.children;
	credentials?: string;
	as?: string;
	headers?: types.headers;
	queryParams?: string;
	theme?: types.style;
	themePreset?: types.themePreset;
	type?: string;
	url?: string;
	mapKey?: string;
	style?: types.style;
	className?: string;
	graphQLUrl?: string;
	transformResponse?: (...args: any[]) => any;
	transformRequest?: (...args: any[]) => any;
	getSearchParams?: () => string;
	setSearchParams?: (newURL: string) => void;
	searchStateHeader?: boolean;
	analyticsConfig?: types.analyticsConfig;
	appbaseConfig?: types.appbaseConfig;
	enableAppbase?: boolean;
	initialState?: types.children;
	analytics?: boolean;
}

declare const ReactiveBase: React.ComponentClass<ReactiveBaseProps>;

export default ReactiveBase;
