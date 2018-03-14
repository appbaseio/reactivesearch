import React, { Component } from 'react';

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryOptions,
} from '@appbaseio/reactivecore/lib/actions';
import {
	pushToAndClause,
	parseHits,
	isEqual,
} from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';

import { connect } from '../../utils';

class ReactiveComponent extends Component {
	constructor(props) {
		super(props);

		this.internalComponent = null;

		const { onQueryChange = null } = props;

		this.setQuery = (obj) => {
			this.props.updateQuery({
				...obj,
				componentId: props.componentId,
				label: props.filterLabel,
				showFilter: props.showFilter,
				onQueryChange,
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
			const { query, ...queryOptions } = this.props.defaultQuery();

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
	URLParams: types.boolRequired,
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
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
});

export default connect(mapStateToProps, mapDispatchtoProps)(ReactiveComponent);
