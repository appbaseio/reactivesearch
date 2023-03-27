import * as React from 'react';

import { CommonProps } from '../..';
import * as types from '../../types';

export interface AIAnswerProps extends CommonProps {
	children?: (data: any) => any;
	getMicInstance?: (...args: any[]) => any;
	renderMic?: (...args: any[]) => any;
	icon?: types.children;
	iconURL?: string;
	iconPosition?: types.iconPosition;
	onData?: (...args: any[]) => any;
	placeholder?: string;
	queryFormat?: types.queryFormatSearch;
	react?: types.react;
	render?: (data: any) => any;
	renderError?: types.title;
	showIcon?: boolean;
	loader?: types.title;
	clearIcon?: types.children;
	showClear?: boolean;
	showVoiceSearch?: boolean;
	AIConfig: types.AiConfig;
}

declare const AIAnswer: React.ComponentClass<AIAnswerProps>;

export default AIAnswer;
