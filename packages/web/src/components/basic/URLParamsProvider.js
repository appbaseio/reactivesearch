import React, { Component } from "react";
import { connect } from "react-redux";

import { base } from "../../styles/base";
import types from "@appbaseio/reactivecore/lib/utils/types";
import { isEqual } from "@appbaseio/reactivecore/lib/utils/helper";

class URLParamsProvider extends Component {
	componentWillReceiveProps(nextProps) {
		if (!isEqual(this.props.selectedValues, nextProps.selectedValues)) {
			Object.keys(nextProps.selectedValues)
				.forEach(component => {
					if (nextProps.selectedValues[component].URLParams) {
						this.setURL(component, nextProps.selectedValues[component].value);
					} else {
						this.props.params.delete(component);
					}
				});
			this.pushToHistory();
		}
	}

	setURL(component, value) {
		if (!value || (typeof value === "string" && value.trim() === "") ||
			(Array.isArray(value) && value.length === 0)) {
			this.props.params.delete(component);
		} else {
			this.props.params.set(component, JSON.stringify(value));
			this.pushToHistory();
		}
	}

	pushToHistory() {
		if (history.pushState) {
			const paramsSting = this.props.params.toString() ? `?${this.props.params.toString()}` : "";
			const newurl = `${window.location.protocol}//${window.location.host}${window.location.pathname}${paramsSting}`;
			window.history.pushState({ path: newurl }, "", newurl);
		}
	}

	render() {
		return (<div className={base}>
			{this.props.children}
		</div>)
	}
}

URLParamsProvider.propTypes = {
	selectedValues: types.selectedValues,
	params: types.params,
	children: types.children
};


const mapStateToProps = state => ({
	selectedValues: state.selectedValues
});

export default connect(mapStateToProps, null)(URLParamsProvider);
