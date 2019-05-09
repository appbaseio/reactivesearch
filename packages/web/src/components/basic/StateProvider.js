import { Component } from 'react';
import { oneOfType, arrayOf, string, bool } from 'prop-types';
import { getSearchState } from '@appbaseio/reactivecore/lib/utils/helper';
import { connect, getComponent } from '../../utils';

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

class StateProvider extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchState: getSearchState(filterProps(props)),
		};
	}
	static getDerivedStateFromProps(props) {
		return {
			searchState: getSearchState(filterProps(props)),
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

const mapStateToProps = (state, props) => ({
	selectedValues: filterByComponentIds(state.selectedValues, props),
	queryLog: filterByComponentIds(state.queryLog, props),
	dependencyTree: filterByComponentIds(state.dependencyTree, props),
	componentProps: filterByComponentIds(state.props, props),
});

export default connect(
	mapStateToProps,
	null,
)(StateProvider);
