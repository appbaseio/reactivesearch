import React from 'react';
import ReactECharts from 'echarts-for-react';
import types from '@appbaseio/reactivecore/lib/utils/types';
import { any, func, oneOf } from 'prop-types';
import hoistNonReactStatics from 'hoist-non-react-statics';
import {
	updateQuery,
	setQueryOptions,
	setCustomQuery,
	setDefaultQuery,
	watchComponent,
} from '@appbaseio/reactivecore/lib/actions';
import { getInternalComponentID } from '@appbaseio/reactivecore/lib/utils/transform';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import {
	isEqual,
	getQueryOptions,
	checkValueChange,
	getOptionsFromQuery,
	getAggsQuery,
	updateInternalQuery,
	updateCustomQuery,
	updateDefaultQuery,
	pushToAndClause,
	isFunction,
	debounce,
	parseHits,
	checkSomePropChange,
} from '@appbaseio/reactivecore/lib/utils/helper';
import {
	connect,
	isQueryIdentical,
	getNumericRangeArray,
	getRangeQueryWithNullValues,
} from '../../utils';
import PreferencesConsumer from '../basic/PreferencesConsumer';
import ComponentWrapper from '../basic/ComponentWrapper';

const ChartTypes = {
	Pie: 'pie',
	Scatter: 'scatter',
	Histogram: 'histogram',
	Line: 'line',
	Bar: 'bar',
	Custom: 'custom',
};

class ReactiveChart extends React.Component {
	constructor(props) {
		super(props);

		const defaultValue = props.value;
		const currentValue = props.selectedValue || defaultValue;
		const options = this.transformOptions(props.options, props);

		this.state = {
			currentValue,
			options,
		};
		this.internalComponent = getInternalComponentID(props.componentId);
		// Set custom and default queries in store
		updateCustomQuery(props.componentId, props, currentValue);
		updateDefaultQuery(this.internalComponent, props, currentValue);

		this.updateQueryOptions(props, false);
		if (currentValue) {
			this.setValue(currentValue, true, props);
		}
		this.setReact(props, this.internalComponent);
		this.handleRange = debounce(this.handleRange, 100);

		if (props.chartType === ChartTypes.Custom) {
			if (typeof props.defaultQuery !== 'function' || typeof props.setOption !== 'function') {
				throw new Error(
					'defaultQuery and setOption should be defined when chartType is custom',
				);
			}
			if (props.useAsFilter && typeof props.customQuery !== 'function') {
				throw new Error(
					'customQuery should be defined when chartType is custom and useAsFilter is true',
				);
			}
		}
	}
	componentDidUpdate(prevProps) {
		if (!isEqual(prevProps.options, this.props.options)) {
			// set options in state
			// eslint-disable-next-line
			this.setState({
				options: this.transformOptions(this.props.options, this.props),
			});
		}
		checkSomePropChange(this.props, prevProps, ['dataField', 'aggregationSize'], () => {
			this.updateDefaultQuery();
			this.updateQuery(this.state.currentValue, this.props);
		});
		if (!isQueryIdentical(this.state.currentValue, this.props, prevProps, 'defaultQuery')) {
			this.updateDefaultQuery();
			// Clear the component value
			this.updateQuery('', this.props);
		}

		if (!isQueryIdentical(this.state.currentValue, this.props, prevProps, 'customQuery')) {
			this.updateQuery(this.state.currentValue, this.props);
		}

		if (this.props.value !== prevProps.value) {
			this.setValue(this.props.value);
		} else if (
			this.state.currentValue !== this.props.selectedValue
			&& this.props.selectedValue !== prevProps.selectedValue
		) {
			const { value, onChange } = this.props;
			if (value === undefined) {
				this.setValue(this.props.selectedValue);
			} else if (onChange) {
				onChange(this.props.selectedValue);
			} else {
				this.setValue(this.state.currentValue, true);
			}
		}
	}

	setReact = (props, componentId) => {
		const { react } = props;
		if (react) {
			const newReact = pushToAndClause(react, this.internalComponent);
			props.watchComponent(componentId, newReact);
		} else {
			props.watchComponent(componentId, {
				and: this.internalComponent,
			});
		}
	};

	transformOptions(options, props) {
		return (
			props.options && props.options[props.dataField]
				? props.options[props.dataField].buckets
				: []
		).filter(item => !!String(item.key).length);
	}
	updateDefaultQuery = (queryOptions) => {
		const props = this.props;
		let value;
		if (props.type === 'range') {
			value = getNumericRangeArray(props.range, props.queryFormat);
		}
		updateInternalQuery(
			this.internalComponent,
			queryOptions,
			value,
			this.props,
			ReactiveChart.generateQueryOptions(this.props, this.state.prevAfter, value),
			null,
		);
	};
	updateQueryOptions = (props, addAfterKey = false) => {
		const queryOptions = ReactiveChart.generateQueryOptions(
			props,
			addAfterKey ? this.state.after : {},
			this.state.currentValue,
		);

		this.updateDefaultQuery(queryOptions);
	};
	handleClick = (...args) => {
		const {
			onClick, useAsFilter, chartType, type,
		} = this.props;
		if (onClick) {
			onClick(...args);
		}
		if (useAsFilter && type !== 'range') {
			const item = args[0];
			let value;
			if (item.data && item.data.name) {
				value = item.data.name;
			} else {
				value = item.data;
			}
			if (!Number.isNaN(parseInt(value, 10))) {
				value = parseInt(value, 10);
			}
			if (chartType === ChartTypes.Custom) {
				value = {
					mainLabel: item.name,
					secondaryLabel: item.seriesName,
					data: item.data,
				};
			}
			this.setValue(value);
		}
	};
	updateQuery = (value, props, execute = true) => {
		const { customQuery } = props;
		let query = ReactiveChart.defaultQuery(value, props);
		let customQueryOptions;
		if (customQuery) {
			({ query } = customQuery(value, props) || {});
			customQueryOptions = getOptionsFromQuery(customQuery(value, props));
			updateCustomQuery(props.componentId, props, value);
		}
		props.setQueryOptions(
			props.componentId,
			{
				...ReactiveChart.generateQueryOptions(
					props,
					this.state.prevAfter,
					this.state.currentValue,
				),
				...customQueryOptions,
			},
			false,
		);
		props.updateQuery(
			{
				componentId: props.componentId,
				query,
				value,
				label: props.filterLabel,
				showFilter: props.showFilter,
				URLParams: props.URLParams,
				componentType: componentTypes.reactiveChart,
			},
			execute,
			false,
		);
	};
	setValue = (value, isDefault = false, props = this.props) => {
		const performUpdate = () => {
			const handleUpdates = () => {
				this.updateQuery(value, props);
			};
			this.setState(
				{
					currentValue: value,
				},
				handleUpdates,
			);
		};
		if (isDefault) {
			this.updateQuery(value, props, false, false);
		} else {
			checkValueChange(props.componentId, value, props.beforeValueChange, performUpdate);
		}
	};
	getChartOptions = () => {
		const {
			chartType,
			title,
			labelFormatter,
			xAxisName,
			yAxisName,
			rawData,
			hits,
			xAxisField,
			yAxisField,
			type,
		} = this.props;
		const { options, currentValue } = this.state;
		const { setOption } = this.props;
		const results = parseHits(hits) || [];
		const chartOptions = {
			aggregationData: options,
			rawData,
			value: currentValue,
			data: results,
			xAxisField,
			yAxisField,
			chartType,
			title,
			labelFormatter,
			xAxisName,
			yAxisName,
			type,
		};
		if (setOption) {
			return setOption(chartOptions);
		}
		return ReactiveChart.getOption(chartOptions);
	};
	handleRange = (...args) => {
		const { useAsFilter, onDataZoom } = this.props;
		if (useAsFilter) {
			const echartInstance = args[1];
			const axis = echartInstance.getModel().option.xAxis[0];
			const option = echartInstance.getOption();
			const start = option.dataZoom[0].startValue;
			const end = option.dataZoom[0].endValue;
			const startRangeValue = axis.data[start];
			const endRangeValue = axis.data[end];
			const rangeValue = [
				startRangeValue.value !== undefined ? startRangeValue.value : startRangeValue,
				endRangeValue.value !== undefined ? endRangeValue.value : endRangeValue,
			];
			this.setValue(rangeValue);
		}
		if (onDataZoom) {
			onDataZoom(...args);
		}
	};
	render() {
		const {
			onDblClick,
			onMouseDown,
			onMouseUp,
			onMouseMove,
			onMouseOut,
			onGlobalOut,
			onContextMenu,
			isLoading,
			error,
			loader,
			renderError,
		} = this.props;
		if (isLoading) {
			return loader || null;
		}
		if (error) {
			if (renderError) {
				if (isFunction(renderError)) {
					return renderError(error);
				}
				return renderError;
			}
			return null;
		}
		return (
			<ReactECharts
				option={this.getChartOptions()}
				onEvents={{
					click: this.handleClick,
					dblclick: onDblClick,
					mousedown: onMouseDown,
					mouseup: onMouseUp,
					mousemove: onMouseMove,
					mouseout: onMouseOut,
					globalout: onGlobalOut,
					contextmenu: onContextMenu,
					datazoom: this.handleRange,
				}}
				notMerge
			/>
		);
	}
}

ReactiveChart.generateQueryOptions = (props, after, value = {}) => {
	const queryOptions = getQueryOptions(props);
	return getAggsQuery(value, queryOptions, props);
};

ReactiveChart.defaultQuery = (value, props) => {
	let query = null;
	const type = props.queryFormat === 'or' ? 'terms' : 'term';

	if (value) {
		let listQuery;
		if (props.queryFormat === 'or') {
			const should = [
				{
					[type]: {
						[props.dataField]: value,
					},
				},
			];
			listQuery = {
				bool: {
					should,
				},
			};
		} else {
			const currentValue = Array.isArray(value) ? value : [value];
			// adds a sub-query with must as an array of objects for each term/value
			const queryArray = currentValue.map(item => ({
				[type]: {
					[props.dataField]: item,
				},
			}));
			listQuery = {
				bool: {
					must: queryArray,
				},
			};
		}

		query = value ? listQuery : null;
	}

	if (query && props.nestedField) {
		return {
			nested: {
				path: props.nestedField,
				query,
			},
		};
	}

	return query;
};

ReactiveChart.GetScatterChartOptions = `({
	data,
	title,
	xAxisName,
	yAxisName,
	xAxisField,
	yAxisField,
}) => {
	let chartTitle;
	if (title) {
		if (typeof title === 'string') {
			chartTitle = {
				text: title,
			};
		} else {
			chartTitle = title;
		}
	}
	return {
		title: chartTitle,
		tooltip: {
			trigger: 'item',
		},
		xAxis: {
			name: xAxisName,
		},
		yAxis: {
			name: yAxisName,
		},
		series: [
			{
				symbolSize: 20,
				data: data.map(d => [d[xAxisField], d[yAxisField]]),
				type: 'scatter',
			},
		],
	};
}`;

ReactiveChart.GetPieChartOptions = `({ title, aggregationData }) => {
	let chartTitle;
	if (title) {
		if (typeof title === 'string') {
			chartTitle = {
				text: title,
				left: 'center',
			};
		} else {
			chartTitle = title;
		}
	}
	return {
		title: chartTitle,
		tooltip: {
			trigger: 'item',
		},
		series: [
			{
				type: 'pie',
				radius: '50%',
				data: aggregationData.map(item => ({
					value: item.doc_count,
					name: item.key,
				})),
				emphasis: {
					itemStyle: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)',
					},
				},
			},
		],
	};
}`;

ReactiveChart.GetHistogramChartOptions = `({
	title,
	xAxisName,
	yAxisName,
	aggregationData,
	value,
	labelFormatter,
}) => {
	let chartTitle;
	if (title) {
		if (typeof title === 'string') {
			chartTitle = {
				text: title,
			};
		} else {
			chartTitle = title;
		}
	}
	const xAxisData = aggregationData.map(item => ({
		value: item.key,
		name: item.key,
	}));
	let startIndex = -1;
	let endIndex = -1;
	if (value && Array.isArray(value)) {
		startIndex = xAxisData.findIndex(i => i.value === value[0]);
		endIndex = xAxisData.findIndex(i => i.value === value[1]);
	}
	return {
		title: chartTitle,
		toolbox: {
			feature: {
				dataZoom: {
					yAxisIndex: false,
					labelFormatter,
				},
				saveAsImage: {
					pixelRatio: 2,
				},
			},
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow',
			},
		},
		grid: {
			bottom: 90,
		},
		dataZoom: [
			{
				type: 'inside',
				startValue: startIndex > -1 ? startIndex : undefined,
				endValue: endIndex > -1 ? endIndex : undefined,
			},
			{
				type: 'slider',
				startValue: startIndex > -1 ? startIndex : undefined,
				endValue: endIndex > -1 ? endIndex : undefined,
			},
		],
		xAxis: {
			data: xAxisData,
			name: xAxisName,
			silent: false,
			splitLine: {
				show: false,
			},
			splitArea: {
				show: false,
			},
		},
		yAxis: {
			splitArea: {
				show: false,
			},
			name: yAxisName,
		},
		series: [
			{
				type: 'bar',
				data: aggregationData.map(item => ({
					value: item.doc_count,
				})),
				// Set 'large' for large data amount
				large: true,
			},
		],
	};
}`;

ReactiveChart.GetBarChartOptions = `({
	title, xAxisName, yAxisName, aggregationData,
}) => {
	let chartTitle;
	if (title) {
		if (typeof title === 'string') {
			chartTitle = {
				text: title,
			};
		} else {
			chartTitle = title;
		}
	}
	return {
		title: chartTitle,
		tooltip: {
			trigger: 'item',
		},
		xAxis: {
			type: 'category',
			name: xAxisName,
			data: aggregationData.map(item => ({
				value: item.key,
				name: item.key,
			})),
		},
		yAxis: {
			type: 'value',
			name: yAxisName,
		},
		series: [
			{
				data: aggregationData.map(item => ({
					value: item.doc_count,
					name: item.key,
				})),
				type: 'bar',
				showBackground: true,
				backgroundStyle: {
					color: 'rgba(180, 180, 180, 0.2)',
				},
			},
		],
	};
}`;

ReactiveChart.GetLineChartOptions = `({
	title,
	type,
	value,
	xAxisName,
	yAxisName,
	aggregationData,
	labelFormatter,
}) => {
	let chartTitle;

	if (title) {
		if (typeof title === 'string') {
			chartTitle = {
				text: title,
			};
		} else {
			chartTitle = title;
		}
	}
	const xAxisData = aggregationData.map(item => ({
		value: item.key,
		name: item.key,
	}));

	let startIndex = -1;
	let endIndex = -1;
	const isValueArray = value && Array.isArray(value);
	const isRangeType = type === 'range';
	if (isValueArray && isRangeType) {
		startIndex = xAxisData.findIndex(i => i.value === value[0]);
		endIndex = xAxisData.findIndex(i => i.value === value[1]);
	}

	return {
		title: chartTitle,
		toolbox: isRangeType ? {
			feature: {
				dataZoom: {
					yAxisIndex: false,
					labelFormatter,
				},
			},
		}: undefined,
		xAxis: {
			name: xAxisName,
			type: 'category',
			data: xAxisData
		},
		yAxis: {
			type: 'value',
			name: yAxisName,
		},
		dataZoom: isRangeType ? [
			{
				type: 'inside',
				startValue: startIndex > -1 ? startIndex : undefined,
				endValue: endIndex > -1 ? endIndex : undefined,
			},
			{
				type: 'slider',
				startValue: startIndex > -1 ? startIndex : undefined,
				endValue: endIndex > -1 ? endIndex : undefined,
			},
		]: undefined,
		series: [
			{
				data: aggregationData.map(item => ({
					value: item.doc_count,
					name: item.key,
				})),
				type: 'line',
			},
		],
	};
}`;

ReactiveChart.getOption = ({ chartType, ...chartConfig }) => {
	// eslint-disable-next-line
	const chartConfigMethod = eval(ReactiveChart.getOptionAsString(chartType));
	if (chartConfig) {
		return chartConfigMethod(chartConfig);
	}
	return null;
};

ReactiveChart.getOptionAsString = (chartType) => {
	switch (chartType) {
		case ChartTypes.Scatter:
			return ReactiveChart.GetScatterChartOptions;
		case ChartTypes.Line:
			return ReactiveChart.GetLineChartOptions;
		case ChartTypes.Bar:
			return ReactiveChart.GetBarChartOptions;
		case ChartTypes.Pie:
			return ReactiveChart.GetPieChartOptions;
		case ChartTypes.Histogram:
			return ReactiveChart.GetHistogramChartOptions;
		default:
			return null;
	}
};

ReactiveChart.defaultRangeQuery = (value, props) => {
	let query = null;
	if (Array.isArray(value) && value.length) {
		query = getRangeQueryWithNullValues(value, props);
	}

	if (query && props.nestedField) {
		return {
			nested: {
				path: props.nestedField,
				query,
			},
		};
	}

	return query;
};
ReactiveChart.propTypes = {
	// UI props
	filterLabel: types.string,
	// events
	onClick: func,
	onDblClick: func,
	onMouseDown: func,
	onMouseUp: func,
	onMouseMove: func,
	onMouseOut: func,
	onGlobalOut: func,
	onContextMenu: func,
	beforeValueChange: func,
	onDataZoom: func,
	// ---- user props ---
	// props to configure query
	componentId: types.stringRequired,
	URLParams: types.bool,
	dataField: types.stringRequired,
	showFilter: types.bool,
	customQuery: types.func,
	defaultQuery: types.func,
	react: types.react,
	size: types.number,
	index: types.string,
	queryFormat: types.queryFormatSearch,
	range: types.range,
	type: oneOf(['term', 'range', 'search', 'geo', 'suggestion']),
	// eslint-disable-next-line
	value: any,
	// props to configure chart
	chartType: oneOf(Object.values(ChartTypes)),
	setOption: func,
	title: types.string,
	useAsFilter: types.bool,
	labelFormatter: types.func,
	xAxisName: types.string,
	yAxisName: types.string,
	xAxisField: types.string,
	yAxisField: types.string,
	// ---------//
	loader: types.title,
	onError: types.func,
	renderError: types.title,
	onChange: types.func,
	// redux props
	setQueryOptions: types.funcRequired,
	watchComponent: types.funcRequired,
	updateQuery: types.funcRequired,
	options: types.options,
	rawData: types.rawData,
	hits: types.hits,
	selectedValue: types.selectedValue,
	setCustomQuery: types.funcRequired,
	isLoading: types.bool,
	error: types.title,
	endpoint: types.endpoint,
};

ReactiveChart.defaultProps = {
	useAsFilter: true,
	chartType: 'custom',
};

// Add componentType for SSR
ReactiveChart.componentType = componentTypes.multiList;

const mapStateToProps = (state, props) => ({
	options:
		props.nestedField && state.aggregations[getInternalComponentID(props.componentId)]
			? state.aggregations[getInternalComponentID(props.componentId)].reactivesearch_nested
			: state.aggregations[getInternalComponentID(props.componentId)],
	hits:
		state.hits[getInternalComponentID(props.componentId)]
		&& state.hits[getInternalComponentID(props.componentId)].hits,
	rawData: state.rawData[getInternalComponentID(props.componentId)],
	selectedValue:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value)
		|| null,
	isLoading: state.isLoading[getInternalComponentID(props.componentId)],
	error: state.error[getInternalComponentID(props.componentId)],
});

const mapDispatchtoProps = dispatch => ({
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	setCustomQuery: (component, query) => dispatch(setCustomQuery(component, query)),
	setDefaultQuery: (component, query) => dispatch(setDefaultQuery(component, query)),
	setQueryOptions: (component, props, execute) =>
		dispatch(setQueryOptions(component, props, execute)),
	updateQuery: (updateQueryObject, execute, setInternalValue) =>
		dispatch(updateQuery(updateQueryObject, execute, setInternalValue)),
});

const ConnectedComponent = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(props => <ReactiveChart ref={props.myForwardedRef} {...props} />);

// eslint-disable-next-line
const ForwardRefComponent = React.forwardRef((props, ref) => (
	<PreferencesConsumer userProps={props}>
		{(preferenceProps) => {
			let type = preferenceProps.type;
			if (!type) {
				if (preferenceProps.chartType === ChartTypes.Scatter) {
					type = 'range';
				}
			}
			let aggregationSize = preferenceProps.aggregationSize;
			if (!aggregationSize) {
				if (!type || type === 'term') {
					aggregationSize = preferenceProps.size;
				}
			}

			let size = preferenceProps.size;
			if (preferenceProps.chartType === ChartTypes.Scatter) {
				size = 10;
			}
			let dataField = preferenceProps.dataField;
			if (preferenceProps.chartType === ChartTypes.Scatter) {
				if (!dataField) {
					dataField = '_default';
				}
			}
			return (
				<ComponentWrapper
					{...preferenceProps}
					type={type}
					internalComponent
					componentType={componentTypes.reactiveChart}
					showHistogram={
						preferenceProps.chartType === ChartTypes.Scatter ? false : type === 'range'
					}
					setReact={false}
					aggregationSize={aggregationSize}
					size={size}
					dataField={dataField}
				>
					{componentProps => (
						<ConnectedComponent
							{...preferenceProps}
							size={size}
							type={type}
							aggregationSize={aggregationSize}
							dataField={dataField}
							myForwardedRef={ref}
							{...componentProps}
						/>
					)}
				</ComponentWrapper>
			);
		}}
	</PreferencesConsumer>
));
hoistNonReactStatics(ForwardRefComponent, ReactiveChart);

ForwardRefComponent.displayName = 'ReactiveChart';
export default ForwardRefComponent;
