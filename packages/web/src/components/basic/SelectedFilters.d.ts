import * as React from 'react';
import { CommonProps } from '../../';
import * as types from '../../types';

export interface SelectedFiltersProps {
	clearValues?: (...args: any[]) => any;
	setValue?: (...args: any[]) => any;
	components?: types.components;
	selectedValues?: types.selectedValues;
	className?: string;
	clearAllLabel?: types.title;
	innerClass?: types.style;
	showClearAll?: types.showClearAll;
	style?: types.style;
	theme?: types.style;
	title?: types.title;
	render?: (...args: any[]) => any;
	onChange?: (...args: any[]) => any;
	onClear?: (...args: any[]) => any;
	resetToDefault?: types.resetToDefault;
}

declare const SelectedFilters: React.ComponentClass<SelectedFiltersProps>;

export default SelectedFilters;
