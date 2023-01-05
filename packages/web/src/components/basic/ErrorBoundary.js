import types from '@appbaseio/reactivecore/lib/utils/types';
import { arrayOf, object } from 'prop-types';
import React, { Component } from 'react';
import { connect } from '../../utils';

class ErrorBoundary extends Component {
	state = {
		error: null,
	};

	invokeErrorCallback() {
		const error = this.state.error;
		if (this.props.onError) {
			this.props.onError(error, this.props.componentId);
		}
	}
	static getDerivedStateFromError(error) {
		return { error };
	}
	componentDidCatch() {
		this.invokeErrorCallback();
	}
	componentDidUpdate() {
		// Store error in state, since the component would be
		// destroyed, and this.props.error would be empty
		if (this.props.error && !this.state.error) {
			// Below wouldn't result in an infinite loop.
			// eslint-disable-next-line react/no-did-update-set-state
			this.setState({ error: this.props.error });
		}
		this.invokeErrorCallback();
	}

	render() {
		const error = this.state.error;
		if (error) {
			if (this.props.renderError) {
				const { componentId } = this.props;
				return this.props.renderError(error, componentId);
			}
			// You can render any custom fallback UI
			return (
				<div>
					<h2>Error occured!</h2>
					<p>{error.message}</p>
				</div>
			);
		}
		return this.props.children;
	}
}
ErrorBoundary.propTypes = {
	children: types.children,
	// eslint-disable-next-line react/forbid-prop-types
	error: object,
	componentId: types.string,
	componentIds: arrayOf(types.string),
	renderError: types.func,
	onError: types.func,
};
const mapStateToProps = (state, ownProps) => {
	let listOfComponentsToSearch = Object.keys(state.error);
	if (ownProps.componentIds && ownProps.componentIds.length) {
		listOfComponentsToSearch = Object.keys(state.error)
			.filter(componentId => ownProps.componentIds.includes(componentId));
	}
	const error = listOfComponentsToSearch
		.map(componentId => state.error[componentId])
		// Find the first non-null error
		.find(e => e);
	const componentId = listOfComponentsToSearch.find(id => state.error[id]);
	return { error, componentId };
};

export default connect(mapStateToProps, null)(ErrorBoundary);
