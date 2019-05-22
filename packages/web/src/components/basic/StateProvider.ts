import * as React from 'react';

export interface StateProviderProps {
	children?: (...args: any[]) => any;
	render?: (...args: any[]) => any;
	onChange?: (...args: any[]) => any;
	componentIds?: string | Array<string>;
	includeKeys?: Array<string>;
	strict?: boolean;
}

declare const StateProvider: React.ComponentClass<StateProviderProps>;

export default StateProvider;
