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
	getOptionsFromQuery,
} from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';

import { connect } from '../../utils';

class ReactiveComponent extends Component {
	constructor(props) {
		super(props);
		this.internalComponent = null;
		this.defaultQuery = null;
		props.setQueryListener(props.componentId, props.onQueryChange, props.onError);

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

		props.addComponent(props.componentId);
		if (this.internalComponent) {
			props.addComponent(this.internalComponent);
		}

		this.setReact(props);

		// set query for internal component
		if (this.internalComponent && props.defaultQuery) {
			this.defaultQuery = props.defaultQuery();
			const { query } = this.defaultQuery || {};
			const customQueryOptions = this.defaultQuery
				? getOptionsFromQuery(this.defaultQuery)
				: null;
			this.queryOptions = {
				...this.queryOptions,
				...customQueryOptions,
			};

			if (this.queryOptions) {
				props.setQueryOptions(this.internalComponent, this.queryOptions, false);
			}

			props.updateQuery({
				componentId: this.internalComponent,
				query: query || null,
			});
		}
	}

	componentDidUpdate(prevProps) {
		if (
			this.props.onAllData
			&& (!isEqual(prevProps.hits, this.props.hits)
				|| !isEqual(prevProps.aggregations, this.props.aggregations))
		) {
			this.props.onAllData(parseHits(this.props.hits), this.props.aggregations);
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
	// component props
	children: types.children,
	componentId: types.stringRequired,
	defaultQuery: types.func,
	filterLabel: types.string,
	onQueryChange: types.func,
	onError: types.func,
	react: types.react,
	showFilter: types.bool,
	URLParams: types.bool,
	onAllData: types.func,
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
