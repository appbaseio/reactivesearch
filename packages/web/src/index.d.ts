import * as React from 'react';
import * as types from './types';

export interface CommonProps {
	componentId: string;
	URLParams?: boolean;
	className?: string;
	onQueryChange?: (...args: any[]) => any;
	style?: types.style;
}

export { default as DataController } from './components/basic/DataController';
export { default as NumberBox } from './components/basic/NumberBox';
export { default as ReactiveBase } from './components/basic/ReactiveBase';
export { default as ReactiveComponent } from './components/basic/ReactiveComponent';
export { default as SelectedFilters } from './components/basic/SelectedFilters';
export { default as TagCloud } from './components/basic/TagCloud';
export { default as TextField } from './components/basic/TextField';
export { default as ToggleButton } from './components/basic/ToggleButton';

export { default as DatePicker } from './components/date/DatePicker';
export { default as DateRange } from './components/date/DateRange';

export { default as MultiDataList } from './components/list/MultiDataList';
export { default as MultiDropdownList } from './components/list/MultiDropdownList';
export { default as MultiList } from './components/list/MultiList';
export { default as SingleDataList } from './components/list/SingleDataList';
export { default as SingleDropdownList } from './components/list/SingleDropdownList';
export { default as SingleList } from './components/list/SingleList';

export { default as DynamicRangeSlider } from './components/range/DynamicRangeSlider';
export { default as MultiDropdownRange } from './components/range/MultiDropdownRange';
export { default as MultiRange } from './components/range/MultiRange';
export { default as RangeInput } from './components/range/RangeInput';
export { default as RangeSlider } from './components/range/RangeSlider';
export { default as RatingsFilter } from './components/range/RatingsFilter';
export { default as SingleDropdownRange } from './components/range/SingleDropdownRange';
export { default as SingleRange } from './components/range/SingleRange';

export { default as ReactiveList } from './components/result/ReactiveList';
export { default as ResultCard } from './components/result/ResultCard';
export { default as ResultList } from './components/result/ResultList';

export { default as CategorySearch } from './components/search/CategorySearch';
export { default as DataSearch } from './components/search/DataSearch';
