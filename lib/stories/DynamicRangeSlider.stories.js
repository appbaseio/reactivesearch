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

var DynamicRangeSliderDefault = function (_Component) {
	_inherits(DynamicRangeSliderDefault, _Component);

	function DynamicRangeSliderDefault(props) {
		_classCallCheck(this, DynamicRangeSliderDefault);

		var _this = _possibleConstructorReturn(this, (DynamicRangeSliderDefault.__proto__ || Object.getPrototypeOf(DynamicRangeSliderDefault)).call(this, props));

		_this.onData = _this.onData.bind(_this);
		return _this;
	}

	_createClass(DynamicRangeSliderDefault, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			_app.AppbaseSensorHelper.ResponsiveStory();
		}
	}, {
		key: "onData",
		value: function onData(res) {
			var _this2 = this;

			var result = null;
			if (res) {
				var combineData = res.currentData;
				if (res.mode === "historic") {
					combineData = res.currentData.concat(res.newData);
				} else if (res.mode === "streaming") {
					combineData = _app.AppbaseSensorHelper.combineStreamData(res.currentData, res.newData);
				}
				if (combineData) {
					result = combineData.map(function (markerData) {
						var marker = markerData._source;
						return _this2.itemMarkup(marker, markerData);
					});
				}
			}
			return result;
		}
	}, {
		key: "itemMarkup",
		value: function itemMarkup(marker, markerData) {
			return _react2.default.createElement(
				"a",
				{
					className: "full_row single-record single_record_for_clone",
					href: marker.event ? marker.event.event_url : "",
					target: "_blank",
					rel: "noopener noreferrer",
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
							marker.member ? marker.member.member_name : "",
							" is going to ",
							marker.event ? marker.event.event_name : ""
						),
						_react2.default.createElement(
							"span",
							{ className: "text-head-city" },
							marker.group ? marker.group.group_city : ""
						)
					),
					_react2.default.createElement(
						"div",
						{ className: "text-description text-overflow full_row" },
						_react2.default.createElement(
							"ul",
							{ className: "highlight_tags" },
							marker.group.group_topics.map(function (tag) {
								return _react2.default.createElement(
									"li",
									{ key: tag.topic_name },
									tag.topic_name
								);
							})
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
					app: "reactivemap_demo",
					credentials: "y4pVxY2Ok:c92481e2-c07f-4473-8326-082919282c18"
				},
				_react2.default.createElement(
					"div",
					{ className: "row" },
					_react2.default.createElement(
						"div",
						{ className: "col s6 col-xs-6" },
						_react2.default.createElement(_app.DynamicRangeSlider, _extends({
							componentId: "RangeSensor",
							appbaseField: this.props.mapping.guests,
							stepValue: 2,
							title: "DynamicRangeSlider"
						}, this.props))
					),
					_react2.default.createElement(
						"div",
						{ className: "col s6 col-xs-6" },
						_react2.default.createElement(_app.ReactiveList, {
							componentId: "SearchResult",
							appbaseField: this.props.mapping.topic,
							title: "Results",
							sortBy: "asc",
							from: 0,
							size: 20,
							onData: this.onData,
							react: {
								and: "RangeSensor"
							}
						})
					)
				)
			);
		}
	}]);

	return DynamicRangeSliderDefault;
}(_react.Component);

exports.default = DynamicRangeSliderDefault;


DynamicRangeSliderDefault.defaultProps = {
	mapping: {
		guests: "guests",
		topic: "group.group_topics.topic_name_raw"
	}
};

DynamicRangeSliderDefault.propTypes = {
	mapping: _react2.default.PropTypes.shape({
		guests: _react2.default.PropTypes.string,
		topic: _react2.default.PropTypes.string
	})
};