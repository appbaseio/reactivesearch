import * as React from 'react';
import { CommonProps } from '../../';
import * as types from '../../types';
import { ReactiveListProps } from './ReactiveList';

export interface ResultListProps {
	target?: string;
	href?: string;
	children: React.ReactNode;
	small?: boolean;
}

declare const ResultList: React.ComponentType<ResultListProps>;

export default ResultList;
