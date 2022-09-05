import * as React from 'react';

import { CommonProps } from '../..';
import * as types from '../../types';

export interface ReactiveChartProps extends CommonProps {
	// UI props
	filterLabel?: string;
	type?: string;
	// events
	onClick?: (...args: any[]) => any;
	onDblClick?: (...args: any[]) => any;
	onMouseDown?: (...args: any[]) => any;
	onMouseUp?: (...args: any[]) => any;
	onMouseMove?: (...args: any[]) => any;
	onMouseOut?: (...args: any[]) => any;
	onGlobalOut?: (...args: any[]) => any;
	onContextMenu?: (...args: any[]) => any;
	onDataZoom?: (...args: any[]) => any;
	beforeValueChange?: (...args: any[]) => any;
	// ---- user props ---
	// props to configure query
	dataField: types.dataFieldArray;
	showFilter?: boolean;
	customQuery?: (...args: any[]) => any;
	defaultQuery?: (...args: any[]) => any;
	react?: types.react;
	size?: number;
	index?: string;
	queryFormat?: types.queryFormatSearch;
	range?: types.range;
	// eslint-disable-next-line
	value?: any;
	// props to configure chart
	chartType: types.chartType;
	setOption: (...args: any[]) => any;
	title: string;
	useAsFilter: boolean;
	labelFormatter: (...args: any[]) => any;
	xAxisName: string;
	yAxisName: string;
	xAxisField: string;
	yAxisField: string;
	// ---------//
	loader: types.title;
	onError: (...args: any[]) => any;
	renderError: types.title;
	onChange: (...args: any[]) => any;
	endpoint?: types.endpointConfig;
}

declare const ReactiveChart: React.ComponentClass<ReactiveChartProps>;

export default ReactiveChart;
