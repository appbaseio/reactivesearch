import React, { Component } from 'react';
import { setHeaders, setValue } from '@appbaseio/reactivecore/lib/actions';
import types from '@appbaseio/reactivecore/lib/utils/types';
import { isEqual } from '@appbaseio/reactivecore/lib/utils/helper';

import Base from '../../styles/Base';
import { connect } from '../../utils';

class URLParamsProvider extends Component {
	componentDidMount() {
		this.init();

		window.onpopstate = () => {
			this.init();
			const activeComponents = Array.from(this.params.keys());

			// remove inactive components from selectedValues
			Object.keys(this.currentSelectedState)
				.filter(item => !activeComponents.includes(item))
				.forEach((component) => {
					this.props.setValue(component, null);
				});

			// update active components in selectedValues
			Array.from(this.params.entries()).forEach((item) => {
				try {
					const [component, value] = item;
					const { label, showFilter, URLParams } = this.props.selectedValues[component];
					this.props.setValue(component, JSON.parse(value), label, showFilter, URLParams);
				} catch (e) {
					// Do not set value if JSON parsing fails.
				}
			});
		};
	}

	componentDidUpdate(prevProps) {
		// this ensures the url params change are handled
		// when the url changes, which enables us to
		// make `onpopstate` event handler work with history.pushState updates
		this.checkForURLParamsChange();

		this.currentSelectedState = this.props.selectedValues;
		if (!isEqual(this.props.selectedValues, prevProps.selectedValues)) {
			this.searchString = this.props.getSearchParams
				? this.props.getSearchParams()
				: window.location.search;
			this.params = new URLSearchParams(this.searchString);
			const currentComponents = Object.keys(this.props.selectedValues);
			const urlComponents = Array.from(this.params.keys());

			currentComponents
				.filter(component => this.props.selectedValues[component].URLParams)
				.forEach((component) => {
					// prevents empty history pollution on initial load
					if (
						this.hasValidValue(this.props.selectedValues[component])
						|| this.hasValidValue(prevProps.selectedValues[component])
					) {
						const selectedValues = this.props.selectedValues[component];
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
						!this.hasValidValue(this.props.selectedValues[component])
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

		if (!isEqual(this.props.headers, prevProps.headers)) {
			this.props.setHeaders(this.props.headers);
		}
	}

	init = () => {
		this.searchString = this.props.getSearchParams
			? this.props.getSearchParams()
			: window.location.search;
		this.params = new URLSearchParams(this.searchString);
		this.currentSelectedState = this.props.selectedValues || {};
	};

	checkForURLParamsChange = () => {
		// we only compare the search string (window.location.search by default)
		// to see if the route has changed (or) not. This handles the following usecase:
		// search on homepage -> route changes -> search results page with same search query
		if (window) {
			const searchString = this.props.getSearchParams
				? this.props.getSearchParams()
				: window.location.search;

			if (searchString !== this.searchString) {
				window.dispatchEvent(new Event('popstate'));
			}
		}
	};

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
		this.searchString = this.props.getSearchParams
			? this.props.getSearchParams()
			: window.location.search;
		this.params = new URLSearchParams(this.searchString);
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
		const paramsSting = this.params.toString() ? `?${this.params.toString()}` : '';
		const base = window.location.href.split('?')[0];
		const newURL = `${base}${paramsSting}`;

		if (this.props.setSearchParams) {
			this.props.setSearchParams(newURL);
		} else if (window.history.pushState) {
			window.history.pushState({ path: newURL }, '', newURL);
		}
		this.init();
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
	getSearchParams: types.func,
	setSearchParams: types.func,
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

const ConnectedComponent = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(props => <URLParamsProvider ref={props.myForwardedRef} {...props} />);

// eslint-disable-next-line
export default React.forwardRef((props, ref) => (
	<ConnectedComponent {...props} myForwardedRef={ref} />
));
