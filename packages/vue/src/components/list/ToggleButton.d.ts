import type { CommonProps } from '../../index';
import * as types from '../../types.ts';

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
	preferencesPath?: string;
	// component props
	className?: string;
	componentId: string;
	onQueryChange?: (...args: any[]) => any;
	style?: types.style;
	URLParams?: boolean;
	enableStrictSelection?: boolean;
	endpoint?: types.endpointConfig;
}

declare function ToggleButton(props: ToggleButtonProps): JSX.Element;

export default ToggleButton;
