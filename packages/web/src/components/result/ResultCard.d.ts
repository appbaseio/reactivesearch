import * as React from 'react';
import { CommonProps } from '../../';
import * as types from '../../types';
import { ReactiveListProps } from './ReactiveList';

export interface ResultCardProps {
	target?: string;
	children: React.ReactNode;
	href?: string;
}

declare const ResultCard: React.ComponentType<ResultCardProps>;

export default ResultCard;
