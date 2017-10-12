"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = Bar;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Bar(props) {
	var style = {
		display: "block",
		width: "100%",
		height: "100%"
	};

	var wrapperStyle = {
		height: props.element.height + "%",
		width: props.element.width + "%",
		display: "inline-block",
		background: "#efefef",
		position: "relative"
	};

	return _react2.default.createElement(
		"span",
		{ className: "rbc-bar-item", style: wrapperStyle },
		_react2.default.createElement("span", {
			className: "bar", style: style,
			title: props.element.count
		})
	);
}

Bar.propTypes = {
	element: _propTypes2.default.shape({
		width: _propTypes2.default.number,
		height: _propTypes2.default.number,
		count: _propTypes2.default.number
	})
};