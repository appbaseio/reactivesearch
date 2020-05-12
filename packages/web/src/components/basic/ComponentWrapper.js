import React from 'react';
import types from '@appbaseio/reactivecore/lib/utils/types';
import { getInternalComponentID } from '@appbaseio/reactivecore/lib/utils/transform';

import {
	pushToAndClause,
	checkPropChange,
	checkSomePropChange,
} from '@appbaseio/reactivecore/lib/utils/helper';

import {
	addComponent,
	removeComponent,
	watchComponent,
	setQueryListener,
	setComponentProps,
	updateComponentProps,
} from '@appbaseio/reactivecore/lib/actions';

import { connect, getValidPropsKeys, hasCustomRenderer, getComponent } from '../../utils';

/**
 * ComponentWrapper component is a wrapper component for each ReactiveSearch component
 * which is responsible for following tasks:
 * 1. Register a component on mount
 * 2. Set query listener
 * 3. Set react prop
 * 4. Follow the [1-3] for the internal component if needed
 * 5. Update component props in redux store
 * 6. Unregister the component on un-mount
 */
class ComponentWrapper extends React.Component {
	constructor(props) {
		super(props);
		// Register  component
		props.addComponent(props.componentId);
		props.setQueryListener(props.componentId, props.onQueryChange, props.onError);
		// Update props in store
		props.setComponentProps(props.componentId, props);

		if (props.internalComponent) {
			this.internalComponent = getInternalComponentID(props.componentId);
		}

		// Register internal component
		if (this.internalComponent) {
			props.addComponent(this.internalComponent);
			props.setComponentProps(this.internalComponent, props);
		}
	}

	get hasCustomRenderer() {
		return hasCustomRenderer(this.props);
	}

	setReact = (props) => {
		const { react } = props;
		if (this.internalComponent) {
			if (react) {
				const newReact = pushToAndClause(react, this.internalComponent);
				props.watchComponent(props.componentId, newReact);
			} else {
				props.watchComponent(props.componentId, {
					and: this.internalComponent,
				});
			}
		} else {
			props.watchComponent(props.componentId, react);
		}
	};

	componentDidUpdate(prevProps) {
		checkSomePropChange(this.props, prevProps, getValidPropsKeys(this.props), () => {
			this.props.updateComponentProps(
				this.props.componentId,
				this.props,
			);
			if (this.internalComponent) {
				this.props.updateComponentProps(
					this.internalComponent,
					this.props,
				);
			}
		});
		checkPropChange(this.props.react, prevProps.react, () => this.setReact(this.props));
	}

	componentWillUnmount() {
		// Unregister components
		const { componentId } = this.props;
		this.props.removeComponent(componentId);
		if (this.internalComponent) {
			this.props.removeComponent(this.internalComponent);
		}
	}

	componentDidMount() {
		// Register internal component
		if (this.internalComponent) {
			// Watch component after rendering the component to avoid the un-necessary calls
			this.setReact(this.props);
		}
	}

	render() {
		if (this.hasCustomRenderer) {
			return getComponent({}, this.props);
		}
		return null;
	}
}

ComponentWrapper.propTypes = {
	addComponent: types.funcRequired,
	removeComponent: types.funcRequired,
	setComponentProps: types.funcRequired,
	setQueryListener: types.funcRequired,
	updateComponentProps: types.funcRequired,
	watchComponent: types.funcRequired,
	// component props
	children: types.func,
	componentId: types.string.isRequired,
	componentType: types.componentType,
	internalComponent: types.bool,
	onError: types.func,
	onQueryChange: types.func,
	react: types.react,
	render: types.func,
};


const mapDispatchToProps = (dispatch, ownProps) => ({
	setComponentProps: (component, options) =>
		dispatch(setComponentProps(component, options, ownProps.componentType)),
	updateComponentProps: (component, options) =>
		dispatch(updateComponentProps(component, options, ownProps.componentType)),
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	setQueryListener: (component, onQueryChange, beforeQueryChange) =>
		dispatch(setQueryListener(component, onQueryChange, beforeQueryChange)),
});

export default connect(null, mapDispatchToProps)(ComponentWrapper);
