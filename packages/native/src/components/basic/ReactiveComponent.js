import React, { Component } from 'react';
import { View } from 'react-native';

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryOptions,
	setQueryListener,
} from '@appbaseio/reactivecore/lib/actions';
import { pushToAndClause, isEqual } from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';

import { connect } from '../../utils';

class ReactiveComponent extends Component {
	constructor(props) {
		super(props);
		this.internalComponent = null;
		this.defaultQuery = null;

		this.setQuery = (obj) => {
			this.props.updateQuery({
				...obj,
				componentId: props.componentId,
				label: props.filterLabel,
				showFilter: props.showFilter,
				URLParams: false,
			});
		};

		if (props.defaultQuery) {
			this.internalComponent = `${props.componentId}__internal`;
		}
		props.setQueryListener(props.componentId, props.onQueryChange, null);
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
		if (nextProps.defaultQuery && !isEqual(nextProps.defaultQuery(), this.defaultQuery)) {
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
				React.cloneElement(child, { ...rest, setQuery: this.setQuery }),
			);
			return <View>{childrenWithProps}</View>;
		} catch (e) {
			return null;
		}
	}
}

ReactiveComponent.defaultProps = {
	showFilter: true,
};

ReactiveComponent.propTypes = {
	addComponent: types.funcRequired,
	removeComponent: types.funcRequired,
	watchComponent: types.funcRequired,
	updateQuery: types.funcRequired,
	setQueryOptions: types.funcRequired,
	setQueryListener: types.funcRequired,
	// component props
	aggregations: types.selectedValues,
	children: types.children,
	componentId: types.stringRequired,
	defaultQuery: types.func,
	filterLabel: types.string,
	hits: types.data,
	onQueryChange: types.func,
	react: types.react,
	selectedValue: types.selectedValue,
	showFilter: types.bool,
};

const mapStateToProps = (state, props) => ({
	hits: (state.hits[props.componentId] && state.hits[props.componentId].hits) || [],
	aggregations:
		(state.aggregations[props.componentId] && state.aggregations[props.componentId]) || null,
	selectedValue:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value)
		|| null,
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	setQueryOptions: (component, props, execute) =>
		dispatch(setQueryOptions(component, props, execute)),
	setQueryListener: (component, onQueryChange, beforeQueryChange) =>
		dispatch(setQueryListener(component, onQueryChange, beforeQueryChange)),
});

export default connect(
	mapStateToProps,
	mapDispatchtoProps,
)(ReactiveComponent);
