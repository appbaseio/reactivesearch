import * as React from "react";
import { CommonProps } from "../../";
import * as types from "../../types";

export interface SelectedFiltersProps {
	clearValues?: () => any;
	setValue?: () => any;
	components?: types.components;
	selectedValues?: types.selectedValues;
	className?: string;
	clearAllLabel?: types.title;
	innerClass?: types.style;
	showClearAll?: boolean;
	style?: types.style;
	theme?: types.style;
}

declare const SelectedFilters: React.ComponentType<SelectedFiltersProps>;

export default SelectedFilters;
