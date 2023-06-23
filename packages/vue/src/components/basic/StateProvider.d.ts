export interface StateProviderProps {
	children?: (...args: any[]) => any;
	render?: (...args: any[]) => any;
	onChange?: (...args: any[]) => any;
	componentIds?: string | Array<string>;
	includeKeys?: Array<string>;
	strict?: boolean;
}

declare function StateProvider(props: StateProviderProps): JSX.Element;

export default StateProvider;
