import React, { Component } from 'react';
import { setHeaders, setValue } from '@appbaseio/reactivecore/lib/actions';
import types from '@appbaseio/reactivecore/lib/utils/types';
import { isEqual } from '@appbaseio/reactivecore/lib/utils/helper';

import Base from '../../styles/Base';
import { connect } from '../../utils';

const URLSearchParams = require('url-search-params');

class URLParamsProvider extends Component {
	componentDidMount() {
		this.params = new URLSearchParams(window.location.search);
		this.currentSelectedState = this.props.selectedValues || {};
		window.onpopstate = () => {
			const activeComponents = Array.from(this.params.keys());

			// remove inactive components from selectedValues
			Object.keys(this.currentSelectedState)
				.filter(item => !activeComponents.includes(item))
				.forEach((component) => {
					this.props.setValue(component, null);
				});

			// update active components in selectedValues
			Array.from(this.params.entries()).forEach((item) => {
				this.props.setValue(item[0], JSON.parse(item[1]));
			});
		};
	}

	componentWillReceiveProps(nextProps) {
		this.currentSelectedState = nextProps.selectedValues;
		if (!isEqual(this.props.selectedValues, nextProps.selectedValues)) {
			this.params = new URLSearchParams(window.location.search);
			const currentComponents = Object.keys(nextProps.selectedValues);
			const urlComponents = Array.from(this.params.keys());

			currentComponents
				.filter(component => nextProps.selectedValues[component].URLParams)
				.forEach((component) => {
					// prevents empty history pollution on initial load
					if (
						this.hasValidValue(this.props.selectedValues[component])
						|| this.hasValidValue(nextProps.selectedValues[component])
					) {
						const selectedValues = nextProps.selectedValues[component];
						if (selectedValues.URLParams) {
							if (selectedValues.category) {
								this.setURL(
									component,
									this.getValue({
										category: selectedValues.category,
										value: selectedValues.value,
									}),
								);
							} else {
								this.setURL(component, this.getValue(selectedValues.value));
							}
						} else {
							this.params.delete(component);
							this.pushToHistory();
						}
					} else if (
						!this.hasValidValue(nextProps.selectedValues[component])
						&& urlComponents.includes(component)
					) {
						// doesn't have a valid value, but the url has a (stale) valid value set
						this.params.delete(component);
						this.pushToHistory();
					}
				});

			// remove unmounted components
			Object.keys(this.props.selectedValues)
				.filter(component => !currentComponents.includes(component))
				.forEach((component) => {
					this.params.delete(component);
					this.pushToHistory();
				});

			if (!currentComponents.length) {
				Array.from(this.params.keys()).forEach((item) => {
					this.params.delete(item);
				});
				this.pushToHistory();
			}
		}

		if (!isEqual(this.props.headers, nextProps.headers)) {
			nextProps.setHeaders(nextProps.headers);
		}
	}

	hasValidValue(component) {
		if (!component) return false;
		if (Array.isArray(component.value)) return !!component.value.length;
		return !!component.value;
	}

	getValue(value) {
		if (Array.isArray(value) && value.length) {
			return value.map(item => this.getValue(item));
		} else if (value && typeof value === 'object') {
			// TODO: support for NestedList
			if (value.location) return value;
			if (value.category) return value;
			return value.label || value.key || null;
		}
		return value;
	}

	setURL(component, value) {
		this.params = new URLSearchParams(window.location.search);
		if (
			!value
			|| (typeof value === 'string' && value.trim() === '')
			|| (Array.isArray(value) && value.length === 0)
		) {
			this.params.delete(component);
			this.pushToHistory();
		} else {
			const data = JSON.stringify(this.getValue(value));
			if (data !== this.params.get(component)) {
				this.params.set(component, data);
				this.pushToHistory();
			}
		}
	}

	pushToHistory() {
		if (window.history.pushState) {
			const paramsSting = this.params.toString() ? `?${this.params.toString()}` : '';
			const base = window.location.href.split('?')[0];
			const newurl = `${base}${paramsSting}`;
			window.history.pushState({ path: newurl }, '', newurl);
		}
	}

	render() {
		return (
			<Base style={this.props.style} className={this.props.className}>
				{this.props.children}
			</Base>
		);
	}
}

URLParamsProvider.propTypes = {
	setHeaders: types.func,
	setValue: types.func,
	selectedValues: types.selectedValues,
	// component props
	children: types.children,
	headers: types.headers,
	style: types.style,
	className: types.string,
};

URLParamsProvider.defaultProps = {
	style: {},
	className: null,
};

const mapStateToProps = state => ({
	selectedValues: state.selectedValues,
});

const mapDispatchtoProps = dispatch => ({
	setHeaders: headers => dispatch(setHeaders(headers)),
	setValue: (component, value, label, showFilter, URLParams) =>
		dispatch(setValue(component, value, label, showFilter, URLParams)),
});

export default connect(
	mapStateToProps,
	mapDispatchtoProps,
)(URLParamsProvider);
