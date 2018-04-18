import * as React from 'react';
import { CommonProps } from '../../';
import * as types from '../../types';
import { ReactiveListProps } from './ReactiveList';

export interface ResultListProps extends ReactiveListProps {
	innerClass?: types.style;
	target?: string;
	onData?: (data: any) => any;
}

declare const ResultList: React.ComponentType<ResultListProps>;

export default ResultList;
