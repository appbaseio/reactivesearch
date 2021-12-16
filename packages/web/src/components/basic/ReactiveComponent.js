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
} from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';
import { getInternalComponentID } from '@appbaseio/reactivecore/lib/utils/transform';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import { connect, getComponent, hasCustomRenderer } from '../../utils';
import ComponentWrapper from '../basic/ComponentWrapper';

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

			// when enableAppbase is true, Backend throws error because of repeated query in request body
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
			aggregationField,
			config,
			distinctField,
			distinctFieldConfig,
			index,
		} = this.props;
		const initialValue = selectedValue || value || defaultValue || null;
		const { enableAppbase } = config;

		if (enableAppbase && aggregationField) {
			console.warn(
				'Warning(ReactiveSearch): The `aggregationField` prop has been marked as deprecated, please use the `distinctField` prop instead.',
			);
		}
		if (!enableAppbase && (distinctField || distinctFieldConfig)) {
			console.warn(
				'Warning(ReactiveSearch): In order to use the `distinctField` and `distinctFieldConfig` props, the `enableAppbase` prop must be set to true in `ReactiveBase`.',
			);
		}
		if (!enableAppbase && index) {
			console.warn(
				'Warning(ReactiveSearch): In order to use the `index` prop, the `enableAppbase` prop must be set to true in `ReactiveBase`.',
			);
		}

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
		if (this.props.defaultQuery
			&& !isEqual(this.props.defaultQuery(this.props.selectedValue, this.props),
				this.defaultQuery)) {
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
			&& !isEqual(this.props.customQuery(this.props.selectedValue, this.props),
				prevProps.customQuery(this.props.selectedValue, this.props))
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
)(props => (
	<ComponentWrapper
		{...props}
		internalComponent={!!props.defaultQuery}
		componentType={componentTypes.reactiveComponent}
	>
		{() => <ReactiveComponent ref={props.myForwardedRef} {...props} />}
	</ComponentWrapper>
));

// eslint-disable-next-line
const ForwardRefComponent = React.forwardRef((props, ref) => (
	<ConnectedComponent {...props} myForwardedRef={ref} />
));

ForwardRefComponent.displayName = 'ReactiveComponent';
export default ForwardRefComponent;
