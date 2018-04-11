import * as React from "react";
import { CommonProps } from "../../";
import * as types from "../../types";

export interface TextFieldProps extends CommonProps {
	autoFocus?: boolean;
	beforeValueChange?: () => any;
	customQuery?: () => any;
	dataField: string;
	debounce?: number;
	defaultSelected?: string;
	filterLabel?: string;
	innerClass?: types.style;
	innerRef?: () => any;
	onBlur?: () => any;
	onFocus?: () => any;
	onKeyDown?: () => any;
	onKeyPress?: () => any;
	onKeyUp?: () => any;
	onValueChange?: () => any;
	placeholder?: string;
	react?: types.react;
	ref?: () => any;
	showFilter?: boolean;
	themePreset?: types.themePreset;
	title?: types.title;
}

declare const TextField: React.ComponentType<TextFieldProps>;

export default TextField;
