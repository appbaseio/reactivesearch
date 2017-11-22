var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import { Provider } from "react-redux";
import Appbase from "appbase-js";

import configureStore from "@appbaseio/reactivecore";
import types from "@appbaseio/reactivecore/lib/utils/types";
import URLParamsProvider from "./URLParamsProvider";

var URLSearchParams = require("url-search-params");

var ReactiveBase = function (_Component) {
	_inherits(ReactiveBase, _Component);

	function ReactiveBase(props) {
		_classCallCheck(this, ReactiveBase);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_this.type = props.type ? props.type : "*";

		var credentials = props.url && props.url.trim() !== "" && !props.credentials ? "user:pass" : props.credentials;

		var config = {
			url: props.url && props.url.trim() !== "" ? props.url : "https://scalr.api.appbase.io",
			app: props.app,
			credentials: props.credentials,
			type: _this.type
		};

		_this.params = new URLSearchParams(window.location.search);
		var selectedValues = {};

		try {
			for (var _iterator = _this.params.keys(), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
				var _extends2;

				var _ref;

				if (_isArray) {
					if (_i >= _iterator.length) break;
					_ref = _iterator[_i++];
				} else {
					_i = _iterator.next();
					if (_i.done) break;
					_ref = _i.value;
				}

				var key = _ref;

				selectedValues = _extends({}, selectedValues, (_extends2 = {}, _extends2[key] = { value: JSON.parse(_this.params.get(key)) }, _extends2));
			}
		} catch (e) {
			selectedValues = {};
		};

		var appbaseRef = new Appbase(config);
		_this.store = configureStore({ config: config, appbaseRef: appbaseRef, selectedValues: selectedValues });
		return _this;
	}

	ReactiveBase.prototype.render = function render() {
		return React.createElement(
			Provider,
			{ store: this.store },
			React.createElement(
				URLParamsProvider,
				{ params: this.params },
				this.props.children
			)
		);
	};

	return ReactiveBase;
}(Component);

ReactiveBase.propTypes = {
	type: types.type,
	url: types.url,
	credentials: types.credentials,
	app: types.app,
	children: types.children
};

export default ReactiveBase;