import React, { Component, useMemo, useEffect, useRef } from 'react';
import { oneOfType, arrayOf, string, bool, func } from 'prop-types';
import { getSearchState } from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';

import { createSelectorHook } from 'react-redux';
import { connect, getComponent, ReactReduxContext } from '../../utils';

// Create useSelector custom hook which is binded to Provider's context(ReactReduxContext)
const useSelector = createSelectorHook(ReactReduxContext);

const defaultKeys = ['hits', 'value', 'aggregations', 'error'];

const filterProps = props => ({
	...props,
	props: props.componentProps,
});

const filterByComponentIds = (state, props = {}) => {
	const { componentIds } = props;
	if (typeof componentIds === 'string') {
		return {
			[componentIds]: state[componentIds],
		};
	}
	if (componentIds instanceof Array) {
		const filteredState = {};
		componentIds.forEach(componentId => {
			filteredState[componentId] = state[componentId];
		});
		return filteredState;
	}
	return state;
};

const filterByKeys = (state, allowedKeys) =>
	Object.keys(state).reduce(
		(components, componentId) => ({
			...components,
			[componentId]: Object.keys(state[componentId])
				.filter(key => allowedKeys.includes(key))
				.reduce((obj, key) => {
					// eslint-disable-next-line
					obj[key] = state[componentId][key];
					return obj;
				}, {}),
		}),
		{},
	);

function usePrevious(value) {
	const ref = useRef();
	useEffect(() => {
		ref.current = value;
	});
	return ref.current;
}

function StateProvider(props) {
	const populateReduxState = useSelector(state => ({
		selectedValues: filterByComponentIds(state.selectedValues, props),
		queryLog: filterByComponentIds(state.queryLog, props),
		dependencyTree: filterByComponentIds(state.dependencyTree, props),
		componentProps: filterByComponentIds(state.props, props),
		hits: filterByComponentIds(state.hits, props),
		aggregations: filterByComponentIds(state.aggregations, props),
		isLoading: filterByComponentIds(state.isLoading, props),
		error: filterByComponentIds(state.error, props),
		promotedResults: filterByComponentIds(state.promotedResults, props),
	}));

	const mergeProps = { ...props, ...populateReduxState };

	const searchState = filterByKeys(
		getSearchState(filterProps(mergeProps)),
		mergeProps.includeKeys,
	);

	// preserve searchState's previous state and call it in comparision check
	const prevState = usePrevious(searchState);

	const stateChangeComparision = JSON.stringify(prevState) !== JSON.stringify(searchState);
	const shouldUpdate = useMemo(() => !props.strict || stateChangeComparision, [
		stateChangeComparision,
	]);

	// prevent extra re-render on change of every respective prop if value remains same towards comparision
	const view = useMemo(
		() => <React.Fragment>{getComponent({ searchState }, mergeProps)}</React.Fragment>,
		[shouldUpdate],
	);

	// // Listen for state change and trigger the callback for useEffect
	React.useEffect(() => {
		// console.log('Redux state change', prevState);

		const { onChange } = props;
		// call onChange() if it has been defined in parent
		onChange && onChange(prevState.searchState, this.state.searchState);
	}, [prevState]);
	return <React.Fragment>{view}</React.Fragment>;
}

StateProvider.defaultProps = {
	strict: true,
	includeKeys: defaultKeys,
};
StateProvider.propTypes = {
	onChange: func,
	render: func,
	componentIds: oneOfType([string, arrayOf(string)]),
	includeKeys: arrayOf(string),
	strict: bool,
	selectedValues: types.componentObject,
	queryLog: types.componentObject,
	componentProps: types.componentObject,
	hits: types.componentObject,
	aggregations: types.componentObject,
	isLoading: types.componentObject,
	error: types.componentObject,
	promotedResults: types.componentObject,
};
export default StateProvider;

/* Old State Provider component */

// class StateProviders extends Component {
// 	constructor(props) {
// 		super(props);
// 		this.state = {
// 			searchState: filterByKeys(getSearchState(filterProps(props)), props.includeKeys),
// 		};
// 	}
// 	static getDerivedStateFromProps(props) {
// 		return {
// 			searchState: filterByKeys(getSearchState(filterProps(props)), props.includeKeys),
// 		};
// 	}
// 	isStateChanged(prevState, nextState) {
// 		return JSON.stringify(nextState) !== JSON.stringify(prevState);
// 	}
// 	shouldComponentUpdate(nextProps, nextState) {
// 		// Only apply when componentIds is defined
// 		if (!nextProps.strict || this.isStateChanged(this.state, nextState)) {
// 			return true;
// 		}
// 		return false;
// 	}
// 	componentDidUpdate(prevProps, prevState) {
// 		const { onChange } = this.props;
// 		if (onChange && this.isStateChanged(prevState, this.state)) {
// 			onChange(prevState.searchState, this.state.searchState);
// 		}
// 	}
// 	render() {
// 		const { searchState } = this.state;
// 		return getComponent({ searchState }, this.props);
// 	}
// }
// const mapStateToProps = (state, props) => ({
// 	selectedValues: filterByComponentIds(state.selectedValues, props),
// 	queryLog: filterByComponentIds(state.queryLog, props),
// 	dependencyTree: filterByComponentIds(state.dependencyTree, props),
// 	componentProps: filterByComponentIds(state.props, props),
// 	hits: filterByComponentIds(state.hits, props),
// 	aggregations: filterByComponentIds(state.aggregations, props),
// 	isLoading: filterByComponentIds(state.isLoading, props),
// 	error: filterByComponentIds(state.error, props),
// 	promotedResults: filterByComponentIds(state.promotedResults, props),
// });

// export default connect(mapStateToProps, null)(StateProvider);
