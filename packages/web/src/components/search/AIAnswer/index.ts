import * as React from 'react';

import { CommonProps } from '../..';
import * as types from '../../types';

export interface AIAnswerProps extends CommonProps {
	children?: (data: any) => any;
	getMicInstance?: (...args: any[]) => any;
	renderMic?: (...args: any[]) => any;
	icon?: types.children;
	iconURL?: string;
	placeholder?: string;
	iconPosition?: types.iconPosition;
	onData?: (...args: any[]) => any;
	queryFormat?: types.queryFormatSearch;
	react?: types.react;
	render?: (data: any) => any;
	renderError?: types.title;
	showIcon?: boolean;
	loader?: types.title;
	showInput?: boolean;
	showVoiceInput?: boolean;
	AIConfig: types.AiConfig;
	enterButton?: boolean;
	renderEnterButton?: (onClick: any) => types.children;
}

declare const AIAnswer: React.ComponentClass<AIAnswerProps>;

export default AIAnswer;
