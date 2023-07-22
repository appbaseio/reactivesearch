/* eslint-disable no-undef */
import { VNode } from 'vue';
import type { CommonProps } from '../..';
import * as types from '../../types.ts';

export interface AIAnswerProps extends CommonProps {
	showVoiceInput?: boolean;
	showFeedback?: boolean;
	showIcon?: boolean;
	onData?: (...args: any[]) => any;
	react?: types.react;
	enableAI?: boolean;
	AIConfig?: types.AIConfig;
	icon?: types.children;
	iconURL?: string;
	iconPosition?: types.iconPosition;
	theme?: types.style;
	themePreset?: types.themePreset;
	renderMic?: (...args: any[]) => any;
	getMicInstance?: (...args: any[]) => any;
	innerClass?: types.style;
	title?: types.title;
	AIResponse?: types.style;
	isAIResponseLoading?: boolean;
	AIResponseError?: types.style;
	enterButton?: boolean;
	renderEnterButton?: (onClick: any) => types.children;
	showInput?: boolean;
	clearSessionOnDestroy?: boolean;
	render?: (data: object) => VNode[];
	onError?: (...args: any[]) => any;
	renderError?: (data: object) => VNode[];
	isLoading?: boolean;
	style?: types.style;
	showSourceDocuments?: boolean;
	triggerOn?: 'manual' | 'question';
	renderTriggerMessage?: types.children | string;
	renderSourceDocument?: (obj: any) => types.children;
	onSourceClick?: (sourceObject: object) => void;
}

declare function AIAnswer(props: AIAnswerProps): JSX.Element;

export default AIAnswer;
