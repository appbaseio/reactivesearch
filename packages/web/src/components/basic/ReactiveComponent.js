import React, { Component } from 'react';

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryOptions,
	setQueryListener,
} from '@appbaseio/reactivecore/lib/actions';
import {
	pushToAndClause,
	parseHits,
	isEqual,
	checkPropChange,
} from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';

import { connect } from '../../utils';

class ReactiveComponent extends Component {
	constructor(props) {
		super(props);
		this.internalComponent = null;
		this.defaultQuery = null;
		props.setQueryListener(props.componentId, props.onQueryChange, null);

		this.setQuery = (obj) => {
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
	}

	componentWillMount() {
		this.props.addComponent(this.props.componentId);
		if (this.internalComponent) {
			this.props.addComponent(this.internalComponent);
		}

		this.setReact(this.props);

		// set query for internal component
		if (this.internalComponent && this.props.defaultQuery) {
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
	}

	componentWillReceiveProps(nextProps) {
		if (
			nextProps.onAllData
			&& (
				!isEqual(nextProps.hits, this.props.hits)
				|| !isEqual(nextProps.aggregations, this.props.aggregations)
			)
		) {
			nextProps.onAllData(parseHits(nextProps.hits), nextProps.aggregations);
		}

		if (
			nextProps.defaultQuery
			&& !isEqual(
				nextProps.defaultQuery(),
				this.defaultQuery,
			)
		) {
			this.defaultQuery = nextProps.defaultQuery();
			const { query, ...queryOptions } = this.defaultQuery || {};

			if (queryOptions) {
				nextProps.setQueryOptions(this.internalComponent, queryOptions, false);
			}

			nextProps.updateQuery({
				componentId: this.internalComponent,
				query: query || null,
			});
		}

		checkPropChange(this.props.react, nextProps.react, () => {
			this.setReact(nextProps);
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
			props.watchComponent(props.componentId, { and: this.internalComponent });
		}
	};

	render() {
		const {
			children,
			addComponent: addFn,
			watchComponent: watchFn,
			removeComponent: removeFn,
			setQueryOptions: queryOptionsFn,
			updateQuery: updateFn,
			...rest
		} = this.props;

		try {
			const childrenWithProps = React.Children.map(children, child =>
				React.cloneElement(child, { ...rest, setQuery: this.setQuery }));
			return <div>{childrenWithProps}</div>;
		} catch (e) {
			return null;
		}
	}
}

ReactiveComponent.defaultProps = {
	showFilter: true,
	URLParams: false,
};

ReactiveComponent.propTypes = {
	addComponent: types.funcRequired,
	removeComponent: types.funcRequired,
	setQueryListener: types.funcRequired,
	setQueryOptions: types.funcRequired,
	updateQuery: types.funcRequired,
	watchComponent: types.funcRequired,
	aggregations: types.selectedValues,
	hits: types.data,
	selectedValue: types.selectedValue,
	// component props
	children: types.children,
	componentId: types.stringRequired,
	defaultQuery: types.func,
	filterLabel: types.string,
	onQueryChange: types.func,
	react: types.react,
	showFilter: types.bool,
	URLParams: types.bool,
	onAllData: types.func,
};

const mapStateToProps = (state, props) => ({
	aggregations: (state.aggregations[props.componentId]
		&& state.aggregations[props.componentId]) || null,
	hits: (state.hits[props.componentId]
		&& state.hits[props.componentId].hits) || [],
	selectedValue: (state.selectedValues[props.componentId]
		&& state.selectedValues[props.componentId].value) || null,
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	setQueryOptions: (component, props, execute) => dispatch(setQueryOptions(
		component,
		props,
		execute,
	)),
	setQueryListener: (component, onQueryChange, beforeQueryChange) =>
		dispatch(setQueryListener(component, onQueryChange, beforeQueryChange)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
});

export default connect(mapStateToProps, mapDispatchtoProps)(ReactiveComponent);
