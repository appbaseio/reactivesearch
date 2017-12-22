import React, { Component } from 'react';
import { connect } from 'react-redux';

import Base from '../../styles/Base';
import types from '@appbaseio/reactivecore/lib/utils/types';
import { isEqual } from '@appbaseio/reactivecore/lib/utils/helper';

class URLParamsProvider extends Component {
	componentWillReceiveProps(nextProps) {
		if (!isEqual(this.props.selectedValues, nextProps.selectedValues)) {
			Object.keys(nextProps.selectedValues)
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
	}

	getValue(value) {
		if (Array.isArray(value) && value.length) {
			return value.map(item => this.getValue(item));
		} else if (value && typeof value === 'object') {
			// TODO: support for NestedList
			if (value.label || value.key) {
				return value.label || value.key;
			}
			return null;
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
		if (history.pushState) {
			const paramsSting = this.props.params.toString() ? `?${this.props.params.toString()}` : '';
			const newurl = `${window.location.protocol}//${window.location.host}${window.location.pathname}${paramsSting}`;
			window.history.pushState({ path: newurl }, '', newurl);
		}
	}

	render() {
		return (<Base>
			{this.props.children}
		</Base>);
	}
}

URLParamsProvider.propTypes = {
	selectedValues: types.selectedValues,
	params: types.params,
	children: types.children,
};


const mapStateToProps = state => ({
	selectedValues: state.selectedValues,
});

export default connect(mapStateToProps, null)(URLParamsProvider);
