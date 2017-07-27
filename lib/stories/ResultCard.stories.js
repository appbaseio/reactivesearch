"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _app = require("../app");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

require("./list.css");

var ResultCardDefault = function (_Component) {
	_inherits(ResultCardDefault, _Component);

	function ResultCardDefault(props) {
		_classCallCheck(this, ResultCardDefault);

		var _this = _possibleConstructorReturn(this, (ResultCardDefault.__proto__ || Object.getPrototypeOf(ResultCardDefault)).call(this, props));

		_this.onData = _this.onData.bind(_this);
		return _this;
	}

	_createClass(ResultCardDefault, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			_app.AppbaseSensorHelper.ResponsiveStory();
		}
	}, {
		key: "onData",
		value: function onData(res) {
			var result = {
				image: "https://www.enterprise.com/content/dam/global-vehicle-images/cars/FORD_FOCU_2012-1.png",
				title: res.name,
				rating: res.rating,
				desc: res.brand,
				url: "#"
			};
			return result;
		}
	}, {
		key: "render",
		value: function render() {
			return _react2.default.createElement(
				_app.ReactiveBase,
				{
					app: "car-store",
					credentials: "cf7QByt5e:d2d60548-82a9-43cc-8b40-93cbbe75c34c"
				},
				_react2.default.createElement(
					"div",
					{ className: "row reverse-labels" },
					_react2.default.createElement(
						"div",
						{ className: "col s6 col-xs-6" },
						_react2.default.createElement(_app.ResultCard, _extends({
							componentId: "SearchResult",
							appbaseField: this.props.mapping.name,
							title: "Results",
							from: 0,
							size: 20,
							onData: this.onData,
							sortOptions: [{
								label: "Lowest Price First",
								appbaseField: "price",
								sortBy: "asc"
							}, {
								label: "Highest Price First",
								appbaseField: "price",
								sortBy: "desc"
							}, {
								label: "Most rated",
								appbaseField: "rating",
								sortBy: "desc"
							}],
							react: {
								and: "RatingsSensor"
							}
						}, this.props))
					),
					_react2.default.createElement(
						"div",
						{ className: "col s6 col-xs-6" },
						_react2.default.createElement(_app.RatingsFilter, {
							componentId: "RatingsSensor",
							appbaseField: this.props.mapping.rating,
							title: "RatingsFilter",
							data: [{ start: 4, end: 5, label: "4 stars and up" }, { start: 3, end: 5, label: "3 stars and up" }, { start: 2, end: 5, label: "2 stars and up" }, { start: 1, end: 5, label: "> 1 stars" }]
						})
					)
				)
			);
		}
	}]);

	return ResultCardDefault;
}(_react.Component);

exports.default = ResultCardDefault;


ResultCardDefault.defaultProps = {
	mapping: {
		rating: "rating",
		name: "name"
	}
};

ResultCardDefault.propTypes = {
	mapping: _react2.default.PropTypes.shape({
		rating: _react2.default.PropTypes.string,
		name: _react2.default.PropTypes.string
	})
};