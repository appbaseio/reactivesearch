import * as React from 'react';
import { CommonProps } from '../../';
import * as types from '../../types';
import { ReactiveListProps } from './ReactiveList';

export interface ResultCardProps extends ReactiveListProps {
	innerClass?: types.style;
	target: string;
	onData?: (...args: any[]) => any;
}

declare const ResultCard: React.ComponentType<ResultCardProps>;

export default ResultCard;
