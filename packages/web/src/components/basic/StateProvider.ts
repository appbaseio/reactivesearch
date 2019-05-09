import * as React from 'react';

export interface StateProviderProps {
	children?: (...args: any[]) => any;
	render?: (...args: any[]) => any;
	componentIds?: string | Array<string>;
	strict?: boolean;
}

declare const StateProvider: React.ComponentType<StateProviderProps>;

export default StateProvider;
