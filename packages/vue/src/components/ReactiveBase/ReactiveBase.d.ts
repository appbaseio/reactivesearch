import * as types from '../../types.ts';

export interface ReactiveBaseProps {
	app?: string;
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
	initialQueriesSyncTime?: number;
	analyticsConfig?: types.analyticsConfig;
	reactivesearchAPIConfig?: types.appbaseConfig;
	initialState?: types.children;
	analytics?: boolean;
	endpoint?: types.endpointConfig;
	contextCollector?: any;
}

declare function ReactiveBase(props: ReactiveBaseProps): JSX.Element;

export default ReactiveBase;
