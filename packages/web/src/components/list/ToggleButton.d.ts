import * as React from 'react';
import { CommonProps } from '../..';
import * as types from '../../types';

export interface ToggleButtonProps extends CommonProps {
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
}

declare const ToggleButton: React.ComponentClass<ToggleButtonProps>;

export default ToggleButton;
