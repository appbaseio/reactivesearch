import * as types from './types.ts';

export interface CommonProps {
	componentId: string;
	URLParams?: boolean;
	className?: string;
	onQueryChange?: (...args: any[]) => any;
	onValueChange?: (...args: any[]) => any;
	beforeValueChange?: (...args: any[]) => any;
	style?: types.style;
}

export type { default as ReactiveList } from './components/result/ReactiveList';
export type { default as ReactiveBase } from './components/ReactiveBase/ReactiveBase';
