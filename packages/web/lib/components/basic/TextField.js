function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import { connect } from "react-redux";

import { addComponent as _addComponent, removeComponent as _removeComponent, watchComponent as _watchComponent, updateQuery as _updateQuery, setValue as _setValue } from "@appbaseio/reactivecore/lib/actions";
import { isEqual, debounce, checkValueChange } from "@appbaseio/reactivecore/lib/utils/helper";
import types from "@appbaseio/reactivecore/lib/utils/types";

import Input from "../../styles/Input";
import Title from "../../styles/Title";

var TextField = function (_Component) {
	_inherits(TextField, _Component);

	function TextField(props) {
		_classCallCheck(this, TextField);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_this.defaultQuery = function (value) {
			if (value && value.trim() !== "") {
				var _this$type, _ref;

				return _ref = {}, _ref[_this.type] = (_this$type = {}, _this$type[_this.props.dataField] = value, _this$type), _ref;
			}
			return null;
		};

		_this.handleTextChange = debounce(function (value) {
			_this.updateQuery(value);
		}, 300);

		_this.setValue = function (value) {
			var isDefaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			var performUpdate = function performUpdate() {
				_this.setState({
					currentValue: value
				});
				if (isDefaultValue) {
					_this.updateQuery(value);
				} else {
					// debounce for handling text while typing
					_this.handleTextChange(value);
				}
			};
			checkValueChange(_this.props.componentId, value, _this.props.beforeValueChange, _this.props.onValueChange, performUpdate);
		};

		_this.updateQuery = function (value) {
			var query = _this.props.customQuery || _this.defaultQuery;
			var callback = null;
			if (_this.props.onQueryChange) {
				callback = _this.props.onQueryChange;
			}
			_this.props.updateQuery(_this.props.componentId, query(value), callback);
			_this.props.setValue(_this.props.componentId, value);
		};

		_this.type = "match";
		_this.state = {
			currentValue: ""
		};
		return _this;
	}

	TextField.prototype.componentDidMount = function componentDidMount() {
		this.props.addComponent(this.props.componentId);
		this.setReact(this.props);

		if (this.props.selectedValue) {
			this.setValue(this.props.selectedValue, true);
		} else if (this.props.defaultSelected) {
			this.setValue(this.props.defaultSelected, true);
		}
	};

	TextField.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
		if (!isEqual(nextProps.react, this.props.react)) {
			this.setReact(nextProps);
		}
		if (this.props.defaultSelected !== nextProps.defaultSelected) {
			this.setValue(nextProps.defaultSelected, true);
		} else if (this.state.currentValue !== nextProps.selectedValue) {
			this.setValue(nextProps.selectedValue || "", true);
		}
	};

	TextField.prototype.componentWillUnmount = function componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
	};

	TextField.prototype.setReact = function setReact(props) {
		if (props.react) {
			props.watchComponent(props.componentId, props.react);
		}
	};

	TextField.prototype.render = function render() {
		var _this2 = this;

		return React.createElement(
			"div",
			null,
			this.props.title ? React.createElement(
				Title,
				null,
				this.props.title
			) : null,
			React.createElement(Input, {
				type: "text",
				placeholder: this.props.placeholder,
				onChange: function onChange(e) {
					return _this2.setValue(e.target.value);
				},
				value: this.state.currentValue
			})
		);
	};

	return TextField;
}(Component);

TextField.propTypes = {
	addComponent: types.addComponent,
	componentId: types.componentId,
	defaultSelected: types.string,
	react: types.react,
	removeComponent: types.removeComponent,
	dataField: types.dataField,
	title: types.title,
	beforeValueChange: types.beforeValueChange,
	onValueChange: types.onValueChange,
	customQuery: types.customQuery,
	onQueryChange: types.onQueryChange,
	updateQuery: types.updateQuery,
	placeholder: types.placeholder,
	selectedValue: types.selectedValue,
	setValue: types.setValue,
	filterLabel: types.string
};

TextField.defaultProps = {
	placeholder: "Search"
};

var mapStateToProps = function mapStateToProps(state, props) {
	return {
		selectedValue: state.selectedValues[props.componentId] && state.selectedValues[props.componentId].value || null
	};
};

var mapDispatchtoProps = function mapDispatchtoProps(dispatch, props) {
	return {
		addComponent: function addComponent(component) {
			return dispatch(_addComponent(component));
		},
		removeComponent: function removeComponent(component) {
			return dispatch(_removeComponent(component));
		},
		watchComponent: function watchComponent(component, react) {
			return dispatch(_watchComponent(component, react));
		},
		updateQuery: function updateQuery(component, query, onQueryChange) {
			return dispatch(_updateQuery(component, query, onQueryChange));
		},
		setValue: function setValue(component, value) {
			return dispatch(_setValue(component, value, props.filterLabel, true));
		}
	};
};

export default connect(mapStateToProps, mapDispatchtoProps)(TextField);