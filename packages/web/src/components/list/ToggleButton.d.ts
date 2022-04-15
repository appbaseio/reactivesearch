import * as React from 'react';
import { CommonProps } from '../..';
import * as types from '../../types';

export interface ToggleButtonProps extends CommonProps {
	customQuery?: (...args: any[]) => any;
	data?: types.data;
	dataField: string;
	defaultValue?: types.stringOrArray;
	value?: types.stringOrArray;
	onValueChange?: (...args: any[]) => any;
	onChange?: (...args: any[]) => any;
	filterLabel?: string;
	innerClass?: types.style;
	multiSelect?: boolean;
	nestedField?: string;
	react?: types.react;
	showFilter?: boolean;
	title?: types.title;
	index?: string;
	// component props
	className?: string;
	componentId: string;
	onQueryChange?: (...args: any[]) => any;
	style?: types.style;
	URLParams?: boolean;
	enableStrictSelection?: boolean;
}

declare const ToggleButton: React.ComponentClass<ToggleButtonProps>;

export default ToggleButton;
