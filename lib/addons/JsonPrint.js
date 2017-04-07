'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var JsonPrint = function (_Component) {
	_inherits(JsonPrint, _Component);

	function JsonPrint(props) {
		_classCallCheck(this, JsonPrint);

		var _this = _possibleConstructorReturn(this, (JsonPrint.__proto__ || Object.getPrototypeOf(JsonPrint)).call(this, props));

		_this.state = {
			open: false
		};
		return _this;
	}

	_createClass(JsonPrint, [{
		key: 'render',
		value: function render() {
			var _this2 = this;

			var tree = null;
			if (this.state.open) {
				tree = JSON.stringify(this.props.data, null, 2);
			} else {
				tree = JSON.stringify(this.props.data);
			}
			return _react2.default.createElement(
				'div',
				{ className: 'row rbc-json-print' },
				_react2.default.createElement(
					'span',
					{
						className: 'head ' + (this.state.open ? null : 'collapsed'),
						onClick: function onClick() {
							return _this2.setState({ open: !_this2.state.open });
						}
					},
					'Object'
				),
				_react2.default.createElement(
					'pre',
					null,
					tree
				)
			);
		}
	}]);

	return JsonPrint;
}(_react.Component);

exports.default = JsonPrint;