import React, { Component } from 'react';

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryOptions,
	setQueryListener,
	setComponentProps,
	updateComponentProps,
	setCustomQuery,
	setDefaultQuery,
} from '@appbaseio/reactivecore/lib/actions';
import {
	pushToAndClause,
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
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';

import { connect, getComponent, hasCustomRenderer, getValidPropsKeys } from '../../utils';

class ReactiveComponent extends Component {
	constructor(props) {
		super(props);
		this.internalComponent = null;
		this.defaultQuery = null;
		props.setQueryListener(props.componentId, props.onQueryChange, props.onError);

		this.setQuery = ({ options, ...obj }) => {
			if (options) {
				props.setQueryOptions(
					props.componentId,
					{ ...options, ...this.getAggsQuery() },
					false,
				);
			}
			// Update customQuery field for RS API
			if ((obj && obj.query) || options) {
				const customQuery = { ...options };
				if (obj && obj.query) {
					customQuery.query = obj.query;
				}
				props.setCustomQuery(props.componentId, customQuery);
			}
			this.props.updateQuery({
				...obj,
				componentId: props.componentId,
				label: props.filterLabel,
				showFilter: props.showFilter,
				URLParams: props.URLParams,
			});
		};

		if (props.defaultQuery) {
			this.internalComponent = `${props.componentId}__internal`;
		}

		props.addComponent(props.componentId);
		// Update props in store
		props.setComponentProps(props.componentId, props, componentTypes.reactiveComponent);
		props.setComponentProps(this.internalComponent, props, componentTypes.reactiveComponent);
		// Set custom and default queries in store
		updateCustomQuery(props.componentId, props, undefined);
		updateDefaultQuery(props.componentId, props, undefined);

		this.setReact(props);

		if (this.internalComponent && props.defaultQuery) {
			this.defaultQuery = props.defaultQuery();
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

			props.updateQuery({
				componentId: this.internalComponent,
				query: query || null,
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
			const calcCustomQuery = customQuery(this.props);
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
		checkSomePropChange(this.props, prevProps, getValidPropsKeys(this.props), () => {
			this.props.updateComponentProps(
				this.props.componentId,
				this.props,
				componentTypes.reactiveComponent,
			);
			this.props.updateComponentProps(
				this.internalComponent,
				this.props,
				componentTypes.reactiveComponent,
			);
		});
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

		if (this.props.defaultQuery && !isEqual(this.props.defaultQuery(), this.defaultQuery)) {
			this.defaultQuery = this.props.defaultQuery();
			const { query, ...queryOptions } = this.defaultQuery || {};

			if (queryOptions) {
				this.props.setQueryOptions(
					this.internalComponent,
					{ ...queryOptions, ...this.getAggsQuery() },
					false,
				);
			} else this.props.setQueryOptions(this.internalComponent, this.getAggsQuery(), false);
			updateDefaultQuery(this.props.componentId, this.props, undefined);
			this.props.updateQuery({
				componentId: this.internalComponent,
				query: query || null,
			});
		}

		if (
			this.props.customQuery
			&& !isEqual(this.props.customQuery(this.props), prevProps.customQuery(this.props))
		) {
			const { query, ...queryOptions } = this.props.customQuery(this.props) || {};

			if (queryOptions) {
				this.props.setQueryOptions(
					this.props.componentId,
					{ ...queryOptions, ...this.getAggsQuery() },
					false,
				);
			} else this.props.setQueryOptions(this.props.componentId, this.getAggsQuery(), false);
			updateCustomQuery(this.props.componentId, this.props, undefined);
			this.props.updateQuery({
				componentId: this.props.componentId,
				query: query || null,
			});
		}

		checkPropChange(this.props.react, prevProps.react, () => {
			this.setReact(this.props);
		});
	}

	componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);

		if (this.internalComponent) {
			this.props.removeComponent(this.internalComponent);
		}
	}

	getAggsQuery = () => {
		if (this.props.aggregationField) {
			return getCompositeAggsQuery({}, this.props, null, true);
		}
		return {};
	};

	setReact = (props) => {
		const { react } = props;

		if (react) {
			if (this.internalComponent) {
				const newReact = pushToAndClause(react, this.internalComponent);
				props.watchComponent(props.componentId, newReact);
			} else {
				props.watchComponent(props.componentId, react);
			}
		} else if (this.internalComponent) {
			props.watchComponent(props.componentId, {
				and: this.internalComponent,
			});
		}
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
	addComponent: types.funcRequired,
	error: types.title,
	removeComponent: types.funcRequired,
	setQueryListener: types.funcRequired,
	setQueryOptions: types.funcRequired,
	updateQuery: types.funcRequired,
	watchComponent: types.funcRequired,
	aggregationField: types.string,
	size: types.number,
	aggregations: types.selectedValues,
	aggregationData: types.aggregationData,
	hits: types.data,
	rawData: types.rawData,
	promotedResults: types.hits,
	isLoading: types.bool,
	selectedValue: types.selectedValue,
	setComponentProps: types.funcRequired,
	setCustomQuery: types.funcRequired,
	updateComponentProps: types.funcRequired,
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
};

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
});

const mapDispatchtoProps = dispatch => ({
	setComponentProps: (component, options, componentType) =>
		dispatch(setComponentProps(component, options, componentType)),
	setCustomQuery: (component, query) => dispatch(setCustomQuery(component, query)),
	setDefaultQuery: (component, query) => dispatch(setDefaultQuery(component, query)),
	updateComponentProps: (component, options, componentType) =>
		dispatch(updateComponentProps(component, options, componentType)),
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	setQueryOptions: (component, props, execute) =>
		dispatch(setQueryOptions(component, props, execute)),
	setQueryListener: (component, onQueryChange, beforeQueryChange) =>
		dispatch(setQueryListener(component, onQueryChange, beforeQueryChange)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
});

const ConnectedComponent = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(props => <ReactiveComponent ref={props.myForwardedRef} {...props} />);

// eslint-disable-next-line
const ForwardRefComponent = React.forwardRef((props, ref) => (
	<ConnectedComponent {...props} myForwardedRef={ref} />
));

ForwardRefComponent.name = 'ReactiveComponent';
export default ForwardRefComponent;
