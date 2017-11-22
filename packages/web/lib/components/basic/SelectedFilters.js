function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import { connect } from "react-redux";

import { setValue as _setValue, clearValues as _clearValues } from "@appbaseio/reactivecore/lib/actions";
import types from "@appbaseio/reactivecore/lib/utils/types";
import Button, { filters } from "../../styles/Button";

var SelectedFilters = function (_Component) {
	_inherits(SelectedFilters, _Component);

	function SelectedFilters() {
		var _temp, _this, _ret;

		_classCallCheck(this, SelectedFilters);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.remove = function (component) {
			_this.props.setValue(component, null);
		}, _temp), _possibleConstructorReturn(_this, _ret);
	}

	SelectedFilters.prototype.render = function render() {
		var _this2 = this;

		var selectedValues = this.props.selectedValues;


		return React.createElement(
			"div",
			{ className: filters },
			Object.keys(selectedValues).filter(function (id) {
				return _this2.props.components.includes(id);
			}).map(function (component, index) {
				if (selectedValues[component].value) {
					return React.createElement(
						Button,
						{ key: component + "-" + index, onClick: function onClick() {
								return _this2.remove(component);
							} },
						React.createElement(
							"span",
							null,
							selectedValues[component].label,
							": ",
							selectedValues[component].value
						),
						React.createElement(
							"span",
							null,
							"\u2715"
						)
					);
				}
				return null;
			}),
			React.createElement(
				Button,
				{ onClick: this.props.clearValues },
				"Clear all filters"
			)
		);
	};

	return SelectedFilters;
}(Component);

SelectedFilters.propTypes = {
	selectedValues: types.selectedValues,
	setValue: types.setValue,
	clearValues: types.clearValues,
	components: types.components
};

var mapStateToProps = function mapStateToProps(state) {
	return {
		selectedValues: state.selectedValues,
		components: state.components
	};
};

var mapDispatchtoProps = function mapDispatchtoProps(dispatch) {
	return {
		setValue: function setValue(component, value) {
			return dispatch(_setValue(component, value));
		},
		clearValues: function clearValues() {
			return dispatch(_clearValues());
		}
	};
};

export default connect(mapStateToProps, mapDispatchtoProps)(SelectedFilters);