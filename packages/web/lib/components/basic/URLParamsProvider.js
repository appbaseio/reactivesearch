function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import { connect } from "react-redux";

import { base } from "../../styles/base";
import types from "@appbaseio/reactivecore/lib/utils/types";
import { isEqual } from "@appbaseio/reactivecore/lib/utils/helper";

var URLParamsProvider = function (_Component) {
	_inherits(URLParamsProvider, _Component);

	function URLParamsProvider() {
		_classCallCheck(this, URLParamsProvider);

		return _possibleConstructorReturn(this, _Component.apply(this, arguments));
	}

	URLParamsProvider.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
		var _this2 = this;

		if (!isEqual(this.props.selectedValues, nextProps.selectedValues)) {
			Object.keys(nextProps.selectedValues).forEach(function (component) {
				_this2.setURL(component, nextProps.selectedValues[component].value);
			});
			this.pushToHistory();
		}
	};

	URLParamsProvider.prototype.setURL = function setURL(component, value) {
		if (!value || typeof value === "string" && value.trim() === "" || Array.isArray(value) && value.length === 0) {
			this.props.params.delete(component);
		} else {
			this.props.params.set(component, JSON.stringify(value));
			this.pushToHistory();
		}
	};

	URLParamsProvider.prototype.pushToHistory = function pushToHistory() {
		if (history.pushState) {
			var paramsSting = this.props.params.toString() ? "?" + this.props.params.toString() : "";
			var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + paramsSting;
			window.history.pushState({ path: newurl }, "", newurl);
		}
	};

	URLParamsProvider.prototype.render = function render() {
		return React.createElement(
			"div",
			{ className: base },
			this.props.children
		);
	};

	return URLParamsProvider;
}(Component);

URLParamsProvider.propTypes = {
	selectedValues: types.selectedValues,
	params: types.params,
	children: types.children
};

var mapStateToProps = function mapStateToProps(state) {
	return {
		selectedValues: state.selectedValues
	};
};

export default connect(mapStateToProps, null)(URLParamsProvider);