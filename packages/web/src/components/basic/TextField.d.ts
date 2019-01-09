import * as React from 'react';
import { CommonProps } from '../../';
import * as types from '../../types';

export interface TextFieldProps extends CommonProps {
	autoFocus?: boolean;
	beforeValueChange?: (...args: any[]) => any;
	customQuery?: (...args: any[]) => any;
	dataField: string;
	debounce?: number;
	defaultValue?: string;
	value?: string;
	filterLabel?: string;
	innerClass?: types.style;
	onBlur?: (...args: any[]) => any;
	onFocus?: (...args: any[]) => any;
	onKeyDown?: (...args: any[]) => any;
	onKeyPress?: (...args: any[]) => any;
	onKeyUp?: (...args: any[]) => any;
	onValueChange?: (...args: any[]) => any;
	onChange?: (...args: any[]) => any;
	placeholder?: string;
	nestedField?: string;
	react?: types.react;
	ref?: (...args: any[]) => any;
	showFilter?: boolean;
	themePreset?: types.themePreset;
	title?: types.title;
}

declare const TextField: React.ComponentType<TextFieldProps>;

export default TextField;
