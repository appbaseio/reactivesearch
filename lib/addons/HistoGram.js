"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _Bar = require("./Bar");

var _Bar2 = _interopRequireDefault(_Bar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require("lodash");

var HistoGramComponent = function (_Component) {
	_inherits(HistoGramComponent, _Component);

	function HistoGramComponent(props) {
		_classCallCheck(this, HistoGramComponent);

		var _this = _possibleConstructorReturn(this, (HistoGramComponent.__proto__ || Object.getPrototypeOf(HistoGramComponent)).call(this, props));

		_this.style = {
			barContainer: {
				position: "relative",
				height: "50px",
				width: "100%"
			}
		};
		return _this;
	}

	_createClass(HistoGramComponent, [{
		key: "createBars",
		value: function createBars() {
			var max = _.max(this.props.data);
			var dataLength = this.props.data.length;
			var bars = null;
			var data = this.props.data.map(function (val) {
				var res = {
					height: 0,
					count: 0,
					width: 100 / dataLength
				};
				try {
					res.height = 100 * val / max;
					res.count = val;
					res.width = 100 / dataLength;
				} catch (e) {
					console.log(e);
				}
				return res;
			});
			if (dataLength) {
				bars = data.map(function (val, index) {
					return _react2.default.createElement(_Bar2.default, { key: index, element: val });
				});
			}
			return bars;
		}
	}, {
		key: "render",
		value: function render() {
			var bars = this.createBars();
			return _react2.default.createElement(
				"div",
				{ className: "rbc-bar-container col s12 col-xs-12", style: this.style.barContainer },
				bars
			);
		}
	}]);

	return HistoGramComponent;
}(_react.Component);

exports.default = HistoGramComponent;


HistoGramComponent.propTypes = {
	data: _react2.default.PropTypes.array
};