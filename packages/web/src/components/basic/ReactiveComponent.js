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
} from '@appbaseio/reactivecore/lib/actions';
import {
	pushToAndClause,
	parseHits,
	isEqual,
	checkPropChange,
	checkSomePropChange,
	getOptionsFromQuery,
} from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';

import { connect, getComponent, hasCustomRenderer, getValidPropsKeys } from '../../utils';

class ReactiveComponent extends Component {
	constructor(props) {
		super(props);
		this.internalComponent = null;
		this.defaultQuery = null;
		props.setQueryListener(props.componentId, props.onQueryChange, props.onError);

		this.setQuery = ({ options, ...obj }) => {
			if (options) {
				props.setQueryOptions(props.componentId, options, false);
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
		props.setComponentProps(props.componentId, props);
		if (this.internalComponent) {
			props.addComponent(this.internalComponent);
		}

		this.setReact(props);

		if (this.internalComponent && props.defaultQuery) {
			this.defaultQuery = props.defaultQuery();
			const { query } = this.defaultQuery || {};
			const defaultQueryOptions = this.defaultQuery
				? getOptionsFromQuery(this.defaultQuery)
				: null;

			if (defaultQueryOptions) {
				props.setQueryOptions(this.internalComponent, defaultQueryOptions, false);
			}

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
				this.props.setQueryOptions(componentId, customQueryOptions, false);
			}
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
			this.props.updateComponentProps(this.props.componentId, this.props);
		});
		// only consider hits and defaultQuery when customQuery is absent
		if (
			this.props.onData
			&& (!isEqual(prevProps.hits, this.props.hits)
				|| !isEqual(prevProps.aggregations, this.props.aggregations))
		) {
			this.props.onData(this.getData());
		}

		if (this.props.defaultQuery && !isEqual(this.props.defaultQuery(), this.defaultQuery)) {
			this.defaultQuery = this.props.defaultQuery();
			const { query, ...queryOptions } = this.defaultQuery || {};

			if (queryOptions) {
				this.props.setQueryOptions(this.internalComponent, queryOptions, false);
			}

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
				this.props.setQueryOptions(this.props.componentId, queryOptions, false);
			}

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

	getData() {
		const { hits, aggregations } = this.props;
		return {
			data: parseHits(hits),
			rawData: hits,
			aggregations,
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
};

ReactiveComponent.propTypes = {
	addComponent: types.funcRequired,
	error: types.title,
	removeComponent: types.funcRequired,
	setQueryListener: types.funcRequired,
	setQueryOptions: types.funcRequired,
	updateQuery: types.funcRequired,
	watchComponent: types.funcRequired,
	aggregations: types.selectedValues,
	hits: types.data,
	isLoading: types.bool,
	selectedValue: types.selectedValue,
	setComponentProps: types.funcRequired,
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
	hits: (state.hits[props.componentId] && state.hits[props.componentId].hits) || [],
	selectedValue:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value)
		|| null,
	isLoading: state.isLoading[props.componentId],
	error: state.error[props.componentId],
});

const mapDispatchtoProps = dispatch => ({
	setComponentProps: (component, options) => dispatch(setComponentProps(component, options)),
	updateComponentProps: (component, options) =>
		dispatch(updateComponentProps(component, options)),
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
