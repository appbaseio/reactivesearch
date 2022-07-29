/** @jsx jsx */
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import { jsx } from '@emotion/core';
import { withTheme } from 'emotion-theming';
import PropTypes from 'prop-types';
import hoistNonReactStatics from 'hoist-non-react-statics';
import React, { useState, useEffect, useRef } from 'react';
import types from '@appbaseio/reactivecore/lib/utils/types';
import {
	updateQuery,
	recordSuggestionClick,
	setCustomQuery,
	setDefaultQuery,
} from '@appbaseio/reactivecore/lib/actions';

import PreferencesConsumer from '../basic/PreferencesConsumer';
import ComponentWrapper from '../basic/ComponentWrapper';

import Container from '../../styles/Container';
import { connect } from '../../utils';

const useConstructor = (callBack = () => {}) => {
	const [hasBeenCalled, setHasBeenCalled] = useState(false);
	if (hasBeenCalled) return;
	callBack();
	setHasBeenCalled(true);
};

const TreeList = (props) => {
	const {} = props;

	const hasMounted = useRef();
	useConstructor(() => {
		hasMounted.current = false;
	});

	useEffect(() => {
		hasMounted.current = true;
	}, []);

	return (
		<Container style={props.style} className={props.className}>
			hey
		</Container>
	);
};
TreeList.propTypes = {
	className: types.string,
	style: types.style,
	showRadio: types.bool,
	showCheckbox: types.bool,
	mode: PropTypes.oneOf(['single', 'multiple']),
	showCount: types.bool,
	showSearch: types.bool,
	showIcon: types.bool,
	icon: types.children,
	showLeafIcon: types.bool,
	leafIcon: types.children,
	showLine: types.bool,
	switcherIcon: types.func,
	render: types.func,
	renderItem: types.func,
};

TreeList.defaultProps = {
	className: null,
	style: null,
	showRadio: false,
	showCheckbox: false,
	mode: 'multiple',
	showCount: false,
	showSearch: false,
	showIcon: false,
	showLeafIcon: false,
	showLine: false,
};

const mapStateToProps = (state, props) => ({
	selectedValue:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value)
		|| null,
	selectedCategory:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].category)
		|| null,
	suggestions: state.hits[props.componentId] && state.hits[props.componentId].hits,
	rawData: state.rawData[props.componentId],
	aggregationData: state.compositeAggregations[props.componentId],
	themePreset: state.config.themePreset,
	isLoading: !!state.isLoading[`${props.componentId}_active`],
	error: state.error[props.componentId],
	enableAppbase: state.config.enableAppbase,
	time: state.hits[props.componentId] && state.hits[props.componentId].time,
	total: state.hits[props.componentId] && state.hits[props.componentId].total,
	hidden: state.hits[props.componentId] && state.hits[props.componentId].hidden,
});

const mapDispatchtoProps = dispatch => ({
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	triggerAnalytics: (searchPosition, documentId) =>
		dispatch(recordSuggestionClick(searchPosition, documentId)),
	setCustomQuery: (component, query) => dispatch(setCustomQuery(component, query)),
	setDefaultQuery: (component, query) => dispatch(setDefaultQuery(component, query)),
});

const ConnectedComponent = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(withTheme(props => <TreeList ref={props.myForwardedRef} {...props} />));

// eslint-disable-next-line
const ForwardRefComponent = React.forwardRef((props, ref) => (
	<PreferencesConsumer userProps={props}>
		{preferenceProps => (
			<ComponentWrapper
				{...preferenceProps}
				internalComponent
				componentType={componentTypes.treeList}
			>
				{() => <ConnectedComponent {...preferenceProps} myForwardedRef={ref} />}
			</ComponentWrapper>
		)}
	</PreferencesConsumer>
));
hoistNonReactStatics(ForwardRefComponent, TreeList);

ForwardRefComponent.displayName = 'TreeList';
export default ForwardRefComponent;
