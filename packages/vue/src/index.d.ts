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

export type { default as ReactiveBase } from './components/ReactiveBase/ReactiveBase';

export type { default as ReactiveComponent } from './components/basic/ReactiveComponent';
export type { default as ReactiveComponentPrivate } from './components/basic/ReactiveComponentPrivate';
export type { default as SelectedFilters } from './components/basic/SelectedFilters';
export type { default as StateProvider } from './components/basic/StateProvider';

export type { default as MultiDropdownList } from './components/list/MultiDropdownList';
export type { default as MultiList } from './components/list/MultiList';
export type { default as SingleDropdownList } from './components/list/SingleDropdownList';
export type { default as SingleList } from './components/list/SingleList';
export type { default as ToggleButton } from './components/list/ToggleButton';
export type { default as TreeList } from './components/list/TreeList';

export type { default as DynamicRangeSlider } from './components/range/DynamicRangeSlider';
export type { default as MultiRange } from './components/range/MultiRange';
export type { default as RangeInput } from './components/range/RangeInput';
export type { default as RangeSlider } from './components/range/RangeSlider';
export type { default as SingleRange } from './components/range/SingleRange';

export type { default as ReactiveList } from './components/result/ReactiveList';
export type { default as ResultCard } from './components/result/ResultCard';
export type { default as ResultList } from './components/result/ResultList';

export type { default as SearchBox } from './components/search/SearchBox';
