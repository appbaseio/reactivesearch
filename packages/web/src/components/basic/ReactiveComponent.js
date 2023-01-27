import React, { Component } from 'react';

import {
	updateQuery,
	setQueryOptions,
	setCustomQuery,
	setDefaultQuery,
} from '@appbaseio/reactivecore/lib/actions';
import {
	parseHits,
	isEqual,
	checkPropChange,
	checkSomePropChange,
	getOptionsFromQuery,
	getCompositeAggsQuery,
	getResultStats,
	updateCustomQuery,
	updateDefaultQuery,
	getComponent,
	hasCustomRenderer,
} from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';
import { getInternalComponentID } from '@appbaseio/reactivecore/lib/utils/transform';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import { connect } from '../../utils';
import PreferencesConsumer from '../basic/PreferencesConsumer';
import ComponentWrapper from '../basic/ComponentWrapper';
import SingleList from '../list/SingleList';
import ReactiveList from '../result/ReactiveList';
import SearchBox from '../search/SearchBox';
import MultiList from '../list/MultiList';
import SingleDataList from '../list/SingleDataList';
import TabDataList from '../list/TabDataList';
import MultiDataList from '../list/MultiDataList';
import SingleDropdownList from '../list/SingleDropdownList';
import MultiDropdownList from '../list/MultiDropdownList';
import SingleDropdownRange from '../range/SingleDropdownRange';
import MultiDropdownRange from '../range/MultiDropdownRange';
import NumberBox from './NumberBox';
import TagCloud from '../list/TagCloud';
import ToggleButton from '../list/ToggleButton';
import DatePicker from '../date/DatePicker';
import DateRange from '../date/DateRange';
import SingleRange from '../range/SingleRange';
import MultiRange from '../range/MultiRange';
import RangeSlider from '../range/RangeSlider';
import DynamicRangeSlider from '../range/DynamicRangeSlider';
import RatingsFilter from '../range/RatingsFilter';
import RangeInput from '../range/RangeInput';
import ReactiveChart from '../chart/ReactiveChart';
import TreeList from '../list/TreeList';

class ReactiveComponent extends Component {
	constructor(props) {
		super(props);
		this.internalComponent = null;
		this.defaultQuery = null;
		this.setQuery = (data) => {
			if (!data) {
				console.error('setQuery accepts the arguments of shape { query, options, value }.');
				return;
			}

			const { options, ...obj } = data;
			if (options) {
				props.setQueryOptions(
					props.componentId,
					{ ...options, ...this.getAggsQuery() },
					false,
				);
			}

			let queryToBeSet = obj.query;

			if (obj && obj.query && obj.query.query) {
				queryToBeSet = obj.query.query;
			}

			// Update customQuery field for RS API
			if ((obj && obj.query) || options) {
				let customQuery = { ...options };
				if (obj && obj.query) {
					if (obj.query.id) {
						customQuery = queryToBeSet;
					} else {
						customQuery.query = queryToBeSet;
					}
				}
				props.setCustomQuery(props.componentId, customQuery);
			}
			if (!queryToBeSet && data && data.id) {
				queryToBeSet = data;
			}

			this.props.updateQuery({
				...obj,
				query: queryToBeSet,
				componentId: props.componentId,
				label: props.filterLabel,
				showFilter: props.showFilter,
				URLParams: props.URLParams,
			});
		};

		if (props.defaultQuery) {
			this.internalComponent = getInternalComponentID(props.componentId);
		}

		// Set custom and default queries in store
		updateCustomQuery(props.componentId, props, this.props.selectedValue);
		updateDefaultQuery(props.componentId, props, this.props.selectedValue);

		if (this.internalComponent && props.defaultQuery) {
			this.defaultQuery = props.defaultQuery(this.props.selectedValue, this.props);
			const { query } = this.defaultQuery || {};
			const defaultQueryOptions = this.defaultQuery
				? getOptionsFromQuery(this.defaultQuery)
				: null;

			if (defaultQueryOptions) {
				props.setQueryOptions(
					this.internalComponent,
					{ ...defaultQueryOptions, ...this.getAggsQuery() },
					false,
				);
			} else this.props.setQueryOptions(this.internalComponent, this.getAggsQuery());

			let queryToSet = query || null;
			if (!queryToSet && this.defaultQuery && this.defaultQuery.id) {
				queryToSet = this.defaultQuery;
			}
			props.updateQuery({
				componentId: this.internalComponent,
				query: queryToSet,
			});
		}
	}

	componentDidMount() {
		const {
			customQuery,
			selectedValue,
			value,
			defaultValue,
			componentId,
			filterLabel,
			showFilter,
			URLParams,
		} = this.props;
		const initialValue = selectedValue || value || defaultValue || null;

		if (customQuery) {
			const calcCustomQuery = customQuery(this.props.selectedValue, this.props);
			const { query } = calcCustomQuery || {};
			const customQueryOptions = calcCustomQuery
				? getOptionsFromQuery(calcCustomQuery)
				: null;
			if (customQueryOptions) {
				this.props.setQueryOptions(
					componentId,
					{ ...customQueryOptions, ...this.getAggsQuery() },
					false,
				);
			} else this.props.setQueryOptions(componentId, this.getAggsQuery(), false);
			this.props.updateQuery({
				componentId,
				query,
				value: initialValue,
				label: filterLabel,
				showFilter,
				URLParams,
			});
		}
	}

	componentDidUpdate(prevProps) {
		// only consider hits and defaultQuery when customQuery is absent
		if (this.props.onData) {
			checkSomePropChange(
				this.props,
				prevProps,
				['hits', 'aggregations', 'promotedResults', 'total', 'time', 'hidden'],
				() => {
					this.props.onData(this.getData());
				},
			);
		}

		checkPropChange(this.props.selectedValue, prevProps.selectedValue, () => {
			/*
				Reset query when SelectedFilters are clicked. Note: `selectedValue` becomes null.
			*/

			if (this.props.selectedValue === null) {
				this.props.updateQuery({
					componentId: this.props.componentId,
					query: null,
					URLParams: this.props.URLParams,
				});
			}
		});
		if (
			this.props.defaultQuery
			&& !isEqual(
				this.props.defaultQuery(this.props.selectedValue, this.props),
				this.defaultQuery,
			)
		) {
			this.defaultQuery = this.props.defaultQuery(this.props.selectedValue, this.props);
			const { query, ...queryOptions } = this.defaultQuery || {};

			if (queryOptions) {
				this.props.setQueryOptions(
					this.internalComponent,
					{ ...queryOptions, ...this.getAggsQuery() },
					false,
				);
			} else this.props.setQueryOptions(this.internalComponent, this.getAggsQuery(), false);
			updateDefaultQuery(this.props.componentId, this.props, this.props.selectedValue);
			let queryToSet = query || null;
			if (!queryToSet && this.defaultQuery && this.defaultQuery.id) {
				queryToSet = this.defaultQuery;
			}
			this.props.updateQuery({
				componentId: this.internalComponent,
				query: queryToSet,
			});
		}

		if (
			this.props.customQuery
			&& !isEqual(
				this.props.customQuery(this.props.selectedValue, this.props),
				prevProps.customQuery(this.props.selectedValue, this.props),
			)
		) {
			const { query, ...queryOptions }
				= this.props.customQuery(this.props.selectedValue, this.props) || {};
			if (queryOptions) {
				this.props.setQueryOptions(
					this.props.componentId,
					{ ...queryOptions, ...this.getAggsQuery() },
					false,
				);
			} else this.props.setQueryOptions(this.props.componentId, this.getAggsQuery(), false);
			updateCustomQuery(this.props.componentId, this.props, this.props.selectedValue);
			let queryToSet = query || null;
			if (!queryToSet && queryOptions && queryOptions.id) {
				queryToSet = queryOptions;
			}
			this.props.updateQuery({
				componentId: this.props.componentId,
				query: queryToSet,
				URLParams: this.props.URLParams,
			});
		}
	}

	getAggsQuery = () => {
		if (this.props.aggregationField) {
			return getCompositeAggsQuery({
				props: this.props,
				showTopHits: true,
				value: this.props.value,
			});
		}
		return {};
	};

	get stats() {
		return getResultStats(this.props);
	}

	getData() {
		const {
			hits, aggregations, aggregationData, promotedResults, rawData,
		} = this.props;
		let filteredResults = parseHits(hits);
		if (promotedResults.length) {
			const ids = promotedResults.map(item => item._id).filter(Boolean);
			if (ids) {
				filteredResults = filteredResults.filter(item => !ids.includes(item._id));
			}
			filteredResults = [...promotedResults, ...filteredResults];
		}
		return {
			data: filteredResults,
			settings: this.props.settings,
			promotedData: promotedResults,
			aggregationData: aggregationData || [],
			rawData,
			aggregations,
			resultStats: this.stats,
		};
	}

	getComponent() {
		const { error, isLoading, selectedValue } = this.props;
		const data = {
			error,
			loading: isLoading,
			...this.getData(),
			value: selectedValue,
			setQuery: this.setQuery,
		};
		return getComponent(data, this.props);
	}

	render() {
		if (hasCustomRenderer(this.props)) {
			return this.getComponent();
		}
		return null;
	}
}

ReactiveComponent.defaultProps = {
	showFilter: true,
	URLParams: false,
	size: 20,
};

ReactiveComponent.propTypes = {
	error: types.title,
	setQueryOptions: types.funcRequired,
	updateQuery: types.funcRequired,
	aggregationField: types.string,
	aggregationSize: types.number,
	size: types.number,
	aggregations: types.selectedValues,
	aggregationData: types.aggregationData,
	hits: types.data,
	rawData: types.rawData,
	promotedResults: types.hits,
	settings: types.props,
	isLoading: types.bool,
	selectedValue: types.selectedValue,
	setCustomQuery: types.funcRequired,
	// component props
	children: types.func,
	componentId: types.stringRequired,
	defaultQuery: types.func,
	customQuery: types.func,
	defaultValue: types.any, // eslint-disable-line
	value: types.any, // eslint-disable-line
	filterLabel: types.string,
	onQueryChange: types.func,
	onError: types.func,
	react: types.react,
	render: types.func,
	showFilter: types.bool,
	URLParams: types.bool,
	onData: types.func,
	distinctField: types.string,
	distinctFieldConfig: types.componentObject,
	config: types.props,
	index: types.string,
	endpoint: types.endpoint,
};

// Add componentType for SSR
ReactiveComponent.componentType = componentTypes.reactiveComponent;

const mapStateToProps = (state, props) => ({
	aggregations:
		(state.aggregations[props.componentId] && state.aggregations[props.componentId]) || null,
	aggregationData: state.compositeAggregations[props.componentId] || [],
	hits: (state.hits[props.componentId] && state.hits[props.componentId].hits) || [],
	rawData: state.rawData[props.componentId],
	selectedValue:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value)
		|| null,
	isLoading: state.isLoading[props.componentId],
	error: state.error[props.componentId],
	promotedResults: state.promotedResults[props.componentId] || [],
	time: (state.hits[props.componentId] && state.hits[props.componentId].time) || 0,
	total: state.hits[props.componentId] && state.hits[props.componentId].total,
	hidden: state.hits[props.componentId] && state.hits[props.componentId].hidden,
	config: state.config,
	settings: state.settings[props.componentId],
});

const mapDispatchtoProps = dispatch => ({
	setCustomQuery: (component, query) => dispatch(setCustomQuery(component, query)),
	setDefaultQuery: (component, query) => dispatch(setDefaultQuery(component, query)),
	setQueryOptions: (component, props, execute) =>
		dispatch(setQueryOptions(component, props, execute)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
});

const ConnectedComponent = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(props => <ReactiveComponent ref={props.myForwardedRef} {...props} />);

const ForwardRefComponent = React.forwardRef((props, ref) => (
	<PreferencesConsumer userProps={props}>
		{(preferenceProps) => {
			switch (preferenceProps.componentType) {
				case componentTypes.treeList:
					return <TreeList {...preferenceProps} />;
				case componentTypes.reactiveList:
					return <ReactiveList {...preferenceProps} />;
				case componentTypes.searchBox:
					return <SearchBox {...preferenceProps} />;
				// list components
				case componentTypes.singleList:
					return <SingleList {...preferenceProps} />;
				case componentTypes.multiList:
					return <MultiList {...preferenceProps} />;
				case componentTypes.singleDataList:
					return <SingleDataList {...preferenceProps} />;
				case componentTypes.tabDataList:
					return <TabDataList {...preferenceProps} />;
				case componentTypes.multiDataList:
					return <MultiDataList {...preferenceProps} />;
				case componentTypes.singleDropdownList:
					return <SingleDropdownList {...preferenceProps} />;
				case componentTypes.multiDropdownList:
					return <MultiDropdownList {...preferenceProps} />;
				case componentTypes.singleDropdownRange:
					return <SingleDropdownRange {...preferenceProps} />;
				case componentTypes.multiDropdownRange:
					return <MultiDropdownRange {...preferenceProps} />;
				// basic components
				case componentTypes.numberBox:
					return <NumberBox {...preferenceProps} />;
				case componentTypes.tagCloud:
					return <TagCloud {...preferenceProps} />;
				case componentTypes.toggleButton:
					return <ToggleButton {...preferenceProps} />;
				// range components
				case componentTypes.datePicker:
					return <DatePicker {...preferenceProps} />;
				case componentTypes.dateRange:
					return <DateRange {...preferenceProps} />;
				case componentTypes.dynamicRangeSlider:
					return <DynamicRangeSlider {...preferenceProps} />;
				case componentTypes.singleRange:
					return <SingleRange {...preferenceProps} />;
				case componentTypes.multiRange:
					return <MultiRange {...preferenceProps} />;
				case componentTypes.rangeSlider:
					return <RangeSlider {...preferenceProps} />;
				case componentTypes.ratingsFilter:
					return <RatingsFilter {...preferenceProps} />;
				case componentTypes.rangeInput:
					return <RangeInput {...preferenceProps} />;
				case componentTypes.reactiveChart:
					return <ReactiveChart {...preferenceProps} />;
				case componentTypes.reactiveComponent:
				default:
					return (
						<ComponentWrapper
							{...preferenceProps}
							// eslint-disable-next-line
							internalComponent={!!props.defaultQuery}
							componentType={componentTypes.reactiveComponent}
						>
							{
								componentProps =>
									(<ConnectedComponent
										{...preferenceProps}
										{...componentProps}
										myForwardedRef={ref}
									/>)
							}
						</ComponentWrapper>
					);
			}
		}}
	</PreferencesConsumer>
));

ForwardRefComponent.displayName = 'ReactiveComponent';
export default ForwardRefComponent;
