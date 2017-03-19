"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ViewSwitcher = function (_Component) {
	_inherits(ViewSwitcher, _Component);

	function ViewSwitcher() {
		_classCallCheck(this, ViewSwitcher);

		return _possibleConstructorReturn(this, (ViewSwitcher.__proto__ || Object.getPrototypeOf(ViewSwitcher)).apply(this, arguments));
	}

	_createClass(ViewSwitcher, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			this.switchView(this.props.defaultSelected);
		}
	}, {
		key: "componentWillReceiveProps",
		value: function componentWillReceiveProps(nextProps) {
			this.switchView(nextProps.defaultSelected);
		}
	}, {
		key: "switchView",
		value: function switchView(element) {
			this.props.data.forEach(function (item) {
				var el = document.querySelector("." + item.value);
				if (el) {
					if (element === item.value) {
						document.querySelector("." + item.value).style.display = "block";
					} else {
						document.querySelector("." + item.value).style.display = "none";
					}
				}
			});
		}
	}, {
		key: "renderItems",
		value: function renderItems() {
			var _this2 = this;

			return this.props.data.map(function (item) {
				return _react2.default.createElement(
					"div",
					{ key: item.value, className: "rbc-list-item", onClick: function onClick() {
							return _this2.switchView(item.value);
						} },
					item.label
				);
			});
		}
	}, {
		key: "render",
		value: function render() {
			return _react2.default.createElement(
				"div",
				{ className: "rbc rbc-viewswitcher" },
				_react2.default.createElement(
					"div",
					{ className: "rbc-list-container" },
					this.renderItems()
				)
			);
		}
	}]);

	return ViewSwitcher;
}(_react.Component);

exports.default = ViewSwitcher;