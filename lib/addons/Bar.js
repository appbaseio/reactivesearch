"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = Bar;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

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
	element: _react2.default.PropTypes.shape({
		width: _react2.default.PropTypes.number,
		height: _react2.default.PropTypes.number,
		count: _react2.default.PropTypes.number
	})
};