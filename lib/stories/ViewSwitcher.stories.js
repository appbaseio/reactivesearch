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

var ViewSwitcherDefault = function (_Component) {
	_inherits(ViewSwitcherDefault, _Component);

	function ViewSwitcherDefault(props) {
		_classCallCheck(this, ViewSwitcherDefault);

		var _this = _possibleConstructorReturn(this, (ViewSwitcherDefault.__proto__ || Object.getPrototypeOf(ViewSwitcherDefault)).call(this, props));

		_this.onData = _this.onData.bind(_this);
		return _this;
	}

	_createClass(ViewSwitcherDefault, [{
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
		key: "itemMarkup",
		value: function itemMarkup(marker, markerData) {
			return _react2.default.createElement(
				"a",
				{
					className: "full_row single-record single_record_for_clone",
					key: markerData._id
				},
				_react2.default.createElement(
					"div",
					{ className: "text-container full_row", style: { paddingLeft: "10px" } },
					_react2.default.createElement(
						"div",
						{ className: "text-head text-overflow full_row" },
						_react2.default.createElement(
							"span",
							{ className: "text-head-info text-overflow" },
							marker.name ? marker.name : "",
							" - ",
							marker.brand ? marker.brand : ""
						),
						_react2.default.createElement(
							"span",
							{ className: "text-head-city" },
							marker.brand ? marker.brand : ""
						)
					),
					_react2.default.createElement(
						"div",
						{ className: "text-description text-overflow full_row" },
						_react2.default.createElement(
							"ul",
							{ className: "highlight_tags" },
							marker.price ? "Priced at $" + marker.price : "Free Test Drive",
							"Rated " + marker.rating
						)
					)
				)
			);
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
					{ className: "row" },
					_react2.default.createElement(
						"div",
						{ className: "col s6 col-xs-6" },
						_react2.default.createElement(_app.RatingsFilter, _extends({
							componentId: "RatingsSensor",
							appbaseField: this.props.mapping.rating,
							title: "RatingsFilter",
							data: [{ start: 4, end: 5, label: "4 stars and up" }, { start: 3, end: 5, label: "3 stars and up" }, { start: 2, end: 5, label: "2 stars and up" }, { start: 1, end: 5, label: "> 1 stars" }]
						}, this.props))
					),
					_react2.default.createElement(
						"div",
						{ className: "col s6 col-xs-6" },
						_react2.default.createElement(_app.ViewSwitcher, {
							data: [{
								label: "Grid",
								value: "rbc-resultcard-wrapper"
							}, {
								label: "List",
								value: "rbc-resultlist-wrapper"
							}],
							defaultSelected: "rbc-resultcard-wrapper"
						}),
						_react2.default.createElement(_app.ResultCard, {
							componentId: "SearchResult",
							appbaseField: this.props.mapping.name,
							title: "Results",
							from: 0,
							size: 20,
							onData: this.onData,
							react: {
								and: "RatingsSensor"
							}
						}),
						_react2.default.createElement(_app.ResultList, {
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
						})
					)
				)
			);
		}
	}]);

	return ViewSwitcherDefault;
}(_react.Component);

exports.default = ViewSwitcherDefault;


ViewSwitcherDefault.defaultProps = {
	mapping: {
		rating: "rating",
		name: "name"
	}
};

ViewSwitcherDefault.propTypes = {
	mapping: _react2.default.PropTypes.shape({
		rating: _react2.default.PropTypes.string,
		name: _react2.default.PropTypes.string
	})
};