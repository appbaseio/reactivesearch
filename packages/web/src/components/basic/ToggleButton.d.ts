import * as React from 'react';
import { CommonProps } from '../../';
import * as types from '../../types';

export interface ToggleButtonProps extends CommonProps {
	data?: types.data;
	dataField: string;
	defaultSelected?: types.stringOrArray;
	filterLabel?: string;
	innerClass?: types.style;
	multiSelect?: boolean;
	react?: types.react;
	showFilter?: boolean;
	title?: types.title;
}

declare const ToggleButton: React.ComponentType<ToggleButtonProps>;

export default ToggleButton;
