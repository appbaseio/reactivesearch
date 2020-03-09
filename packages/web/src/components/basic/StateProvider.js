import React, { useMemo, useEffect, useRef } from 'react';
import { oneOfType, arrayOf, string, bool, func } from 'prop-types';
import { getSearchState } from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';

import { createSelectorHook } from 'react-redux';
import { getComponent, ReactReduxContext } from '../../utils';

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
		/* eslint-disable-next-line */
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

	// prevent extra re-render on change of every respective
	// prop if value remains same towards comparision
	const view = useMemo(
		() => <React.Fragment>{getComponent({ searchState }, mergeProps)}</React.Fragment>,
		[shouldUpdate],
	);

	const triggerOnChange = (prev, next) => {
		const { onChange } = props;
		// call onChange() if it has been defined in parent
		if (onChange) onChange(prev, next);
	};

	// Listen for state change and trigger the callback for useEffect
	useEffect(() => {
		triggerOnChange(prevState, searchState);
	}, [prevState]);

	// Clean up code for unmounting
	useEffect(() => {
		let isMounted = true;

		if (isMounted) {
			triggerOnChange(prevState, searchState);
		}

		return () => {
			isMounted = false;
		};
	}, []);

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
