import { Component } from 'react';
import { oneOfType, arrayOf, string, bool } from 'prop-types';

import { connect, getComponent } from '../../utils';


const calculateSearchState = (props) => {
	const {
		selectedValues, queryLogs, dependencyTree, componentProps,
	} = props;
	const searchState = {};
	Object.keys(componentProps).forEach((componentId) => {
		searchState[componentId] = {
			...searchState[componentId],
			...componentProps[componentId],
		};
	});
	Object.keys(selectedValues).forEach((componentId) => {
		const componentState = searchState[componentId];
		const selectedValue = selectedValues[componentId];
		if (selectedValue) {
			searchState[componentId] = {
				...componentState,
				...{
					title: selectedValue.label,
					componentType: selectedValue.componentType,
					value: selectedValue.value,
					...(selectedValue.category && {
						category: selectedValue.category,
					}),
					URLParams: selectedValue.URLParams,
				},
			};
		}
	});
	Object.keys(queryLogs).forEach((componentId) => {
		searchState[componentId] = {
			...searchState[componentId],
			...queryLogs[componentId],
		};
	});
	Object.keys(dependencyTree).forEach((componentId) => {
		searchState[componentId] = {
			...searchState[componentId],
			...{
				react: dependencyTree[componentId],
			},
		};
	});
	return searchState;
};

class StateProvider extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchState: calculateSearchState(props),
		};
	}
	static getDerivedStateFromProps(props) {
		return {
			searchState: calculateSearchState(props),
		};
	}
	shouldComponentUpdate(nextProps, nextState) {
		// Only apply when componentIds is defined
		if (!nextProps.strict || JSON.stringify(nextState) !== JSON.stringify(this.state)) {
			return true;
		}
		return false;
	}
	render() {
		const { searchState } = this.state;
		return getComponent({ searchState }, this.props);
	}
}
StateProvider.defaultProps = {
	strict: true,
};
StateProvider.propTypes = {
	componentIds: oneOfType([string, arrayOf(string)]),
	strict: bool,
};

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
const mapStateToProps = (state, props) => ({
	selectedValues: filterByComponentIds(state.selectedValues, props),
	queryLogs: filterByComponentIds(state.queryLog, props),
	dependencyTree: filterByComponentIds(state.dependencyTree, props),
	componentProps: filterByComponentIds(state.props, props),
});

export default connect(
	mapStateToProps,
	null,
)(StateProvider);
