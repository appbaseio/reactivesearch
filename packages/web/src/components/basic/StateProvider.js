import { Component } from 'react';
import { oneOfType, arrayOf, string, bool, func } from 'prop-types';
import { getSearchState } from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';

import { connect, getComponent } from '../../utils';

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
		componentIds.forEach((componentId) => {
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
class StateProvider extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchState: filterByKeys(getSearchState(filterProps(props)), props.includeKeys),
		};
	}
	static getDerivedStateFromProps(props) {
		return {
			searchState: filterByKeys(getSearchState(filterProps(props)), props.includeKeys),
		};
	}
	isStateChanged(prevState, nextState) {
		return JSON.stringify(nextState) !== JSON.stringify(prevState);
	}
	shouldComponentUpdate(nextProps, nextState) {
		// Only apply when componentIds is defined
		if (!nextProps.strict || this.isStateChanged(this.state, nextState)) {
			return true;
		}
		return false;
	}
	componentDidUpdate(prevProps, prevState) {
		const { onChange } = this.props;
		if (onChange && this.isStateChanged(prevState, this.state)) {
			onChange(prevState.searchState, this.state.searchState);
		}
	}
	render() {
		const { searchState } = this.state;
		return getComponent({ searchState }, this.props);
	}
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
	customData: types.componentObject,
	queryLog: types.componentObject,
	componentProps: types.componentObject,
	hits: types.componentObject,
	aggregations: types.componentObject,
	isLoading: types.componentObject,
	error: types.componentObject,
	promotedResults: types.componentObject,
};

const mapStateToProps = (state, props) => ({
	selectedValues: filterByComponentIds(state.selectedValues, props),
	queryLog: filterByComponentIds(state.queryLog, props),
	dependencyTree: filterByComponentIds(state.dependencyTree, props),
	componentProps: filterByComponentIds(state.props, props),
	hits: filterByComponentIds(state.hits, props),
	aggregations: filterByComponentIds(state.aggregations, props),
	isLoading: filterByComponentIds(state.isLoading, props),
	error: filterByComponentIds(state.error, props),
	promotedResults: filterByComponentIds(state.promotedResults, props),
	customData: filterByComponentIds(state.customData, props),
	settings: filterByComponentIds(state.settings, props),
});

export default connect(mapStateToProps, null)(StateProvider);
