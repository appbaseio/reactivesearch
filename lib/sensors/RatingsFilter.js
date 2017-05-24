"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _reactivemaps = require("@appbaseio/reactivemaps");

var _reactStars = require("react-stars");

var _reactStars2 = _interopRequireDefault(_reactStars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require("lodash");

var RatingsFilter = function (_Component) {
	_inherits(RatingsFilter, _Component);

	function RatingsFilter(props) {
		_classCallCheck(this, RatingsFilter);

		var _this = _possibleConstructorReturn(this, (RatingsFilter.__proto__ || Object.getPrototypeOf(RatingsFilter)).call(this, props));

		_this.state = {
			selected: null
		};
		_this.type = "range";
		_this.urlParams = _reactivemaps.AppbaseSensorHelper.URLParams.get(_this.props.componentId, false, true);
		_this.handleChange = _this.handleChange.bind(_this);
		_this.customQuery = _this.customQuery.bind(_this);
		return _this;
	}

	// Set query information


	_createClass(RatingsFilter, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			this.setQueryInfo();
			this.checkDefault(this.props);
			this.listenFilter();
		}
	}, {
		key: "componentWillReceiveProps",
		value: function componentWillReceiveProps(nextProps) {
			this.checkDefault(nextProps);
		}

		// stop streaming request and remove listener when component will unmount

	}, {
		key: "componentWillUnmount",
		value: function componentWillUnmount() {
			if (this.filterListener) {
				this.filterListener.remove();
			}
		}
	}, {
		key: "listenFilter",
		value: function listenFilter() {
			var _this2 = this;

			this.filterListener = _reactivemaps.AppbaseSensorHelper.sensorEmitter.addListener("clearFilter", function (data) {
				if (data === _this2.props.componentId) {
					_this2.changeValue(null);
				}
			});
		}
	}, {
		key: "checkDefault",
		value: function checkDefault(props) {
			var defaultValue = this.urlParams !== null ? this.urlParams : props.defaultSelected;
			this.changeValue(defaultValue);
		}
	}, {
		key: "changeValue",
		value: function changeValue(defaultValue) {
			var _this3 = this;

			if (!_.isEqual(this.defaultSelected, defaultValue)) {
				this.defaultSelected = defaultValue;
				if (this.defaultSelected) {
					this.defaultSelected = defaultValue;
					var records = this.props.data.filter(function (record) {
						return record.start === _this3.defaultSelected.start && record.end === _this3.defaultSelected.end;
					});
					if (records && records.length) {
						setTimeout(this.handleChange.bind(this, records[0]), 300);
					}
				} else if (this.defaultSelected === null) {
					this.handleChange(null);
				}
			}
		}

		// set the query type and input data

	}, {
		key: "setQueryInfo",
		value: function setQueryInfo() {
			var obj = {
				key: this.props.componentId,
				value: {
					queryType: this.type,
					inputData: this.props.appbaseField,
					customQuery: this.props.customQuery ? this.props.customQuery : this.customQuery
				}
			};
			_reactivemaps.AppbaseSensorHelper.selectedSensor.setSensorInfo(obj);
		}

		// build query for this sensor only

	}, {
		key: "customQuery",
		value: function customQuery(record) {
			if (record) {
				return {
					range: _defineProperty({}, this.props.appbaseField, {
						gte: record.start,
						lte: record.end,
						boost: 2.0
					})
				};
			}
			return null;
		}

		// handle the input change and pass the value inside sensor info

	}, {
		key: "handleChange",
		value: function handleChange(record) {
			this.setState({
				selected: record
			});
			var obj = {
				key: this.props.componentId,
				value: record
			};
			if (this.props.onValueChange) {
				this.props.onValueChange(obj.value);
			}
			// pass the selected sensor value with componentId as key,
			var isExecuteQuery = true;
			_reactivemaps.AppbaseSensorHelper.URLParams.update(this.props.componentId, record ? JSON.stringify(record) : null, this.props.URLParams);
			_reactivemaps.AppbaseSensorHelper.selectedSensor.set(obj, isExecuteQuery);
		}
	}, {
		key: "renderButtons",
		value: function renderButtons() {
			var _this4 = this;

			var buttons = void 0;
			var selectedItem = this.state.selected && this.state.selected.start ? this.state.selected.start : this.props.data.start;
			if (this.props.data) {
				(function () {
					var maxEnd = 5;
					_this4.props.data.forEach(function (item) {
						maxEnd = item.end > maxEnd ? item.end : maxEnd;
					});

					buttons = _this4.props.data.map(function (record) {
						var cx = selectedItem === record.start ? "rbc-active" : "";
						return _react2.default.createElement(
							"div",
							{ className: "rbc-list-item row", key: record.label, onClick: function onClick() {
									return _this4.handleChange(record);
								} },
							_react2.default.createElement(
								"label",
								{ className: "rbc-label " + cx },
								_react2.default.createElement(_reactStars2.default, {
									count: maxEnd,
									value: record.start,
									size: 20,
									color1: "#bbb",
									edit: false,
									color2: "#ffd700"
								}),
								_react2.default.createElement(
									"span",
									null,
									record.label
								)
							)
						);
					});
				})();
			}
			return buttons;
		}

		// render

	}, {
		key: "render",
		value: function render() {
			var title = null;
			if (this.props.title) {
				title = _react2.default.createElement(
					"h4",
					{ className: "rbc-title col s12 col-xs-12" },
					this.props.title
				);
			}

			var cx = (0, _classnames2.default)({
				"rbc-title-active": this.props.title,
				"rbc-title-inactive": !this.props.title
			});

			return _react2.default.createElement(
				"div",
				{ className: "rbc rbc-ratingsfilter col s12 col-xs-12 card thumbnail " + cx, style: this.props.componentStyle },
				_react2.default.createElement(
					"div",
					{ className: "row" },
					title,
					_react2.default.createElement(
						"div",
						{ className: "col s12 col-xs-12 rbc-list-container" },
						this.renderButtons()
					)
				)
			);
		}
	}]);

	return RatingsFilter;
}(_react.Component);

exports.default = RatingsFilter;


RatingsFilter.propTypes = {
	componentId: _react2.default.PropTypes.string.isRequired,
	appbaseField: _react2.default.PropTypes.string.isRequired,
	title: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.element]),
	data: _react2.default.PropTypes.any.isRequired,
	defaultSelected: _react2.default.PropTypes.object,
	customQuery: _react2.default.PropTypes.func,
	onValueChange: _react2.default.PropTypes.func,
	componentStyle: _react2.default.PropTypes.object,
	URLParams: _react2.default.PropTypes.bool,
	allowFilter: _react2.default.PropTypes.bool
};

// Default props value
RatingsFilter.defaultProps = {
	title: null,
	componentStyle: {},
	URLParams: false,
	allowFilter: true
};

// context type
RatingsFilter.contextTypes = {
	appbaseRef: _react2.default.PropTypes.any.isRequired,
	type: _react2.default.PropTypes.any.isRequired
};

RatingsFilter.types = {
	componentId: _reactivemaps.TYPES.STRING,
	appbaseField: _reactivemaps.TYPES.STRING,
	appbaseFieldType: _reactivemaps.TYPES.NUMBER,
	title: _reactivemaps.TYPES.STRING,
	data: _reactivemaps.TYPES.OBJECT,
	defaultSelected: _reactivemaps.TYPES.OBJECT,
	customQuery: _reactivemaps.TYPES.FUNCTION,
	URLParams: _reactivemaps.TYPES.BOOLEAN,
	allowFilter: _reactivemaps.TYPES.BOOLEAN
};