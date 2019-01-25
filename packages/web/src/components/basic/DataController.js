import React, { Component } from 'react';

import {
	addComponent,
	removeComponent,
	updateQuery,
	setQueryListener,
	setQueryOptions,
} from '@appbaseio/reactivecore/lib/actions';
import hoistNonReactStatics from 'hoist-non-react-statics';
import {
	isEqual,
	checkValueChange,
	getOptionsFromQuery,
} from '@appbaseio/reactivecore/lib/utils/helper';

import types from '@appbaseio/reactivecore/lib/utils/types';

import Container from '../../styles/Container';
import { connect } from '../../utils';

class DataController extends Component {
	componentDidMount() {
		this.locked = false;
		this.props.addComponent(this.props.componentId);
		this.props.setQueryListener(this.props.componentId, this.props.onQueryChange, null);

		const { value, defaultValue, selectedValue } = this.props;
		const initialValue = selectedValue || value || defaultValue || null;
		this.updateQuery(initialValue, this.props);
	}

	componentDidUpdate(prevProps) {
		if (!this.locked) {
			if (!isEqual(this.props.value, prevProps.value)) {
				this.updateQuery(this.props.value, this.props);
			} else if (!isEqual(this.props.selectedValue, prevProps.selectedValue)) {
				this.updateQuery(this.props.selectedValue, this.props);
			}
		}
	}

	componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
	}

	static defaultQuery() {
		return {
			match_all: {},
		};
	}

	updateQuery = (defaultSelected = null, props) => {
		this.locked = true;
		const { customQuery } = props;
		let query = DataController.defaultQuery(defaultSelected, props);
		let customQueryOptions;
		if (customQuery) {
			({ query } = customQuery(defaultSelected, props) || {});
			customQueryOptions = getOptionsFromQuery(customQuery(defaultSelected, props));
		}
		props.setQueryOptions(props.componentId, customQueryOptions);

		const performUpdate = () => {
			props.updateQuery({
				componentId: props.componentId,
				query,
				value: defaultSelected,
				label: props.filterLabel,
				showFilter: props.showFilter,
				URLParams: props.URLParams,
			});
			this.locked = false;
			if (props.onValueChange) props.onValueChange(defaultSelected);
		};

		checkValueChange(
			props.componentId,
			defaultSelected,
			props.beforeValueChange,
			performUpdate,
		);
	};

	render() {
		return (
			<Container style={this.props.style} className={this.props.className}>
				{this.props.children}
			</Container>
		);
	}
}

DataController.defaultProps = {
	className: null,
	showFilter: true,
	style: {},
	URLParams: false,
};

DataController.propTypes = {
	addComponent: types.funcRequired,
	removeComponent: types.funcRequired,
	setQueryListener: types.funcRequired,
	updateQuery: types.funcRequired,
	setQueryOptions: types.funcRequired,
	selectedValue: types.selectedValue,
	// component props
	componentId: types.stringRequired,
	beforeValueChange: types.func,
	children: types.children,
	className: types.string,
	customQuery: types.func,
	// DataController can accept any defaultSelected depending on the query used
	defaultValue: types.any, // eslint-disable-line
	value: types.any, // eslint-disable-line
	filterLabel: types.string,
	onQueryChange: types.func,
	onValueChange: types.func,
	showFilter: types.bool,
	style: types.style,
	URLParams: types.bool,
};

const mapStateToProps = (state, props) => ({
	selectedValue:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value)
		|| null,
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	setQueryListener: (component, onQueryChange, beforeQueryChange) =>
		dispatch(setQueryListener(component, onQueryChange, beforeQueryChange)),
	setQueryOptions: (component, props) => dispatch(setQueryOptions(component, props)),
});

const ConnectedComponent = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(props => <DataController ref={props.myForwardedRef} {...props} />);

// eslint-disable-next-line
const ForwardRefComponent = React.forwardRef((props, ref) => (
	<ConnectedComponent {...props} myForwardedRef={ref} />
));

hoistNonReactStatics(ForwardRefComponent, DataController);

ForwardRefComponent.name = 'DataController';
export default ForwardRefComponent;
