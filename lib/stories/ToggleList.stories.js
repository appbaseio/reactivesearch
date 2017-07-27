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

var ToggleListDefault = function (_Component) {
	_inherits(ToggleListDefault, _Component);

	function ToggleListDefault(props) {
		_classCallCheck(this, ToggleListDefault);

		var _this = _possibleConstructorReturn(this, (ToggleListDefault.__proto__ || Object.getPrototypeOf(ToggleListDefault)).call(this, props));

		_this.toggleData = [{
			label: "Social",
			value: "Social"
		}, {
			label: "Travel",
			value: "Travel"
		}, {
			label: "Outdoors",
			value: "Outdoors"
		}];
		return _this;
	}

	_createClass(ToggleListDefault, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			_app.AppbaseSensorHelper.ResponsiveStory();
		}
	}, {
		key: "onData",
		value: function onData(res) {
			return {
				image: res.member.photo,
				image_size: "small",
				title: res.member.member_name,
				desc: _react2.default.createElement(
					"div",
					null,
					_react2.default.createElement(
						"p",
						null,
						"is going to ",
						res.event.event_name,
						" at ",
						res.venue_name_ngrams
					),
					_react2.default.createElement(
						"p",
						null,
						res.group_city_ngram
					)
				),
				url: res.event.event_url
			};
		}
	}, {
		key: "render",
		value: function render() {
			return _react2.default.createElement(
				_app.ReactiveBase,
				{
					app: "meetup_demo",
					credentials: "LPpISlEBe:2a8935f5-0f63-4084-bc3e-2b2b4d1a8e02"
				},
				_react2.default.createElement(
					"div",
					{ className: "row" },
					_react2.default.createElement(
						"div",
						{ className: "col s6 col-xs-6" },
						_react2.default.createElement(_app.ToggleList, _extends({
							appbaseField: this.props.mapping.topic,
							componentId: "MeetupTops",
							title: "ToggleList",
							data: this.toggleData
						}, this.props))
					),
					_react2.default.createElement(
						"div",
						{ className: "col s6 col-xs-6" },
						_react2.default.createElement(_app.ResultList, {
							componentId: "SearchResult",
							appbaseField: "name",
							from: 0,
							size: 40,
							onData: this.onData,
							pagination: true,
							react: {
								and: "MeetupTops"
							}
						})
					)
				)
			);
		}
	}]);

	return ToggleListDefault;
}(_react.Component);

exports.default = ToggleListDefault;


ToggleListDefault.defaultProps = {
	mapping: {
		topic: "group.group_topics.topic_name_raw.raw"
	}
};

ToggleListDefault.propTypes = {
	mapping: _react2.default.PropTypes.shape({
		topic: _react2.default.PropTypes.string
	})
};