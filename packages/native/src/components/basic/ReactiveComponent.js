import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryOptions,
} from '@appbaseio/reactivecore/lib/actions';
import { pushToAndClause } from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';

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
				URLParams: false,
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
	componentId: types.stringRequired,
	hits: types.data,
	aggregations: types.selectedValues,
	selectedValue: types.selectedValue,
	addComponent: types.funcRequired,
	removeComponent: types.funcRequired,
	watchComponent: types.funcRequired,
	updateQuery: types.funcRequired,
	setQueryOptions: types.funcRequired,
	onQueryChange: types.func,
	showFilter: types.bool,
	filterLabel: types.string,
	defaultQuery: types.func,
	react: types.react,
	children: types.children,
};

const mapStateToProps = (state, props) => ({
	hits: (state.hits[props.componentId]
		&& state.hits[props.componentId].hits) || [],
	aggregations: (state.aggregations[props.componentId]
		&& state.aggregations[props.componentId]) || null,
	selectedValue: (state.selectedValues[props.componentId]
		&& state.selectedValues[props.componentId].value) || null,
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	setQueryOptions: (component, props, execute) => dispatch(setQueryOptions(
		component,
		props,
		execute,
	)),
});

export default connect(mapStateToProps, mapDispatchtoProps)(ReactiveComponent);
