import React, { Component } from 'react';
import { setHeaders } from '@appbaseio/reactivecore/lib/actions';
import types from '@appbaseio/reactivecore/lib/utils/types';
import { isEqual } from '@appbaseio/reactivecore/lib/utils/helper';

import Base from '../../styles/Base';
import { connect } from '../../utils';

class URLParamsProvider extends Component {
	componentWillReceiveProps(nextProps) {
		if (!isEqual(this.props.selectedValues, nextProps.selectedValues)) {
			Object.keys(nextProps.selectedValues)
				.filter(item => nextProps.selectedValues[item].URLParams)
				.forEach((component) => {
					if (nextProps.selectedValues[component].URLParams) {
						this.setURL(component, this.getValue(nextProps.selectedValues[component].value));
					} else {
						this.props.params.delete(component);
						this.pushToHistory();
					}
				});

			if (!Object.keys(nextProps.selectedValues).length) {
				Array.from(this.props.params.keys()).forEach((item) => {
					this.props.params.delete(item);
				});
				this.pushToHistory();
			}
		}

		if (!isEqual(this.props.headers, nextProps.headers)) {
			nextProps.setHeaders(nextProps.headers);
		}
	}

	getValue(value) {
		if (Array.isArray(value) && value.length) {
			return value.map(item => this.getValue(item));
		} else if (value && typeof value === 'object') {
			// TODO: support for NestedList
			return value.label || value.key || null;
		}
		return value;
	}

	setURL(component, value) {
		if (!value || (typeof value === 'string' && value.trim() === '')
			|| (Array.isArray(value) && value.length === 0)) {
			this.props.params.delete(component);
			this.pushToHistory();
		} else {
			const data = JSON.stringify(this.getValue(value));
			if (data !== this.props.params.get(component)) {
				this.props.params.set(component, data);
				this.pushToHistory();
			}
		}
	}

	pushToHistory() {
		if (window.history.pushState) {
			const paramsSting = this.props.params.toString() ? `?${this.props.params.toString()}` : '';
			const base = window.location.href.split('?')[0];
			const newurl = `${base}${paramsSting}`;
			window.history.pushState({ path: newurl }, '', newurl);
		}
	}

	render() {
		return (
			<Base>
				{this.props.children}
			</Base>
		);
	}
}

URLParamsProvider.propTypes = {
	selectedValues: types.selectedValues,
	params: types.params,
	children: types.children,
	headers: types.headers,
	setHeaders: types.func,
};

const mapStateToProps = state => ({
	selectedValues: state.selectedValues,
});

const mapDispatchtoProps = dispatch => ({
	setHeaders: headers => dispatch(setHeaders(headers)),
});

export default connect(mapStateToProps, mapDispatchtoProps)(URLParamsProvider);
