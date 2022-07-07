import { any, object } from 'prop-types';
import React, { Component } from 'react';
import { connect } from '../../utils';

class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	render() {
		const error = this.props.error;
		if (this.state.hasError || error) {
			// You can render any custom fallback UI
			return <h1>Something went wrong.</h1>;
		}

		return this.props.children;
	}
}

ErrorBoundary.propTypes = {
	children: any,
	error: object,
};
const mapStateToProps = (state) => {
	const errors = Object.keys(state.error)
		.map(componentId => state.error[componentId])
		.filter(error => error);
	if (errors.length) { return { error: errors[0] }; }
	return { error: null };
};

export default connect(mapStateToProps, null)(ErrorBoundary);
