import * as types from '../../types.ts';

export interface ReactiveComponentProps {
	children?: (...args: any[]) => any;
	render?: (...args: any[]) => any;
	componentId: string;
	aggregationField?: string;
	aggregationSize?: number;
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
	distinctField?: string;
	distinctFieldConfig?: object;
	index?: string;
	preferencesPath?: string;
	endpoint?: types.endpointConfig;
}

declare function ReactiveComponent(props: ReactiveComponentProps): JSX.Element;

export default ReactiveComponent;
