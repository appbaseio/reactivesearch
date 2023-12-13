import * as types from './types.ts';

export interface CommonProps {
	componentId: string;
	compoundClause: "filter" | "must";
	URLParams?: boolean;
	uRLParams?: boolean;
	className?: string;
	onQueryChange?: (...args: any[]) => any;
	onValueChange?: (...args: any[]) => any;
	beforeValueChange?: (...args: any[]) => any;
	style?: types.style;
}

export { default as ReactiveBase } from './components/ReactiveBase/ReactiveBase';

export { default as ReactiveComponent } from './components/basic/ReactiveComponent';
export { default as ReactiveComponentPrivate } from './components/basic/ReactiveComponentPrivate';
export { default as SelectedFilters } from './components/basic/SelectedFilters';
export { default as StateProvider } from './components/basic/StateProvider';

export { default as MultiDropdownList } from './components/list/MultiDropdownList';
export { default as MultiList } from './components/list/MultiList';
export { default as SingleDropdownList } from './components/list/SingleDropdownList';
export { default as SingleList } from './components/list/SingleList';
export { default as ToggleButton } from './components/list/ToggleButton';
export { default as TreeList } from './components/list/TreeList';

export { default as DynamicRangeSlider } from './components/range/DynamicRangeSlider';
export { default as MultiRange } from './components/range/MultiRange';
export { default as RangeInput } from './components/range/RangeInput';
export { default as RangeSlider } from './components/range/RangeSlider';
export { default as SingleRange } from './components/range/SingleRange';

export { default as ReactiveList } from './components/result/ReactiveList';
export { default as ResultCard } from './components/result/ResultCard';
export { default as ResultList } from './components/result/ResultList';

export { default as SearchBox } from './components/search/SearchBox';
export { default as AIAnswer } from './components/search/AIAnswer';
