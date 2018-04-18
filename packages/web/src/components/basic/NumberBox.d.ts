import * as React from 'react';
import { CommonProps } from '../../';
import * as types from '../../types';

export interface NumberBoxProps extends CommonProps {
	data?: types.dataNumberBox;
	dataField?: string;
	defaultSelected?: number;
	innerClass?: types.style;
	labelPosition?: types.labelPosition;
	queryFormat?: types.queryFormatNumberBox;
	react?: types.react;
	title?: types.title;
}

declare const NumberBox: React.ComponentType<NumberBoxProps>;

export default NumberBox;
