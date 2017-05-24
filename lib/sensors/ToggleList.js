"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _reactivemaps = require("@appbaseio/reactivemaps");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require("lodash");

var ToggleList = function (_Component) {
	_inherits(ToggleList, _Component);

	function ToggleList(props) {
		_classCallCheck(this, ToggleList);

		var _this = _possibleConstructorReturn(this, (ToggleList.__proto__ || Object.getPrototypeOf(ToggleList)).call(this, props));

		_this.state = {
			selected: []
		};
		_this.type = "term";
		_this.urlParams = _reactivemaps.AppbaseSensorHelper.URLParams.get(_this.props.componentId, true);
		_this.defaultSelected = null;
		_this.handleChange = _this.handleChange.bind(_this);
		_this.customQuery = _this.customQuery.bind(_this);
		return _this;
	}

	// Set query information


	_createClass(ToggleList, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			this.setQueryInfo();
			this.initialize(this.props);
		}
	}, {
		key: "componentWillReceiveProps",
		value: function componentWillReceiveProps(nextProps) {
			this.initialize(nextProps);
		}
	}, {
		key: "initialize",
		value: function initialize(props) {
			var _this2 = this;

			setTimeout(function () {
				var defaultValue = _this2.urlParams !== null ? _this2.urlParams : props.defaultSelected;
				if (defaultValue) {
					if (!props.multiSelect) {
						if (typeof defaultValue === "string") {
							if (_this2.defaultSelected !== defaultValue) {
								_this2.defaultSelected = defaultValue;
								var records = props.data.filter(function (record) {
									return _this2.defaultSelected.indexOf(record.label) > -1;
								});

								_this2.setState({
									selected: records
								});
								if (_this2.props.onValueChange) {
									_this2.props.onValueChange(_obj.value);
								}
								var _obj = {
									key: props.componentId,
									value: records
								};
								_reactivemaps.AppbaseSensorHelper.URLParams.update(_this2.props.componentId, _this2.setURLParam(_obj.value), _this2.props.URLParams);
								_reactivemaps.AppbaseSensorHelper.selectedSensor.set(_obj, true);
							}
						} else {
							console.error(props.componentId + " - defaultSelected prop should be of type \"string\"");
						}
					} else if ((typeof defaultValue === "undefined" ? "undefined" : _typeof(defaultValue)) === "object") {
						if (!_.isEqual(_this2.defaultSelected, defaultValue)) {
							_this2.defaultSelected = defaultValue;
							var _records = [];
							_this2.defaultSelected.forEach(function (item) {
								_records = _records.concat(props.data.filter(function (record) {
									return item.indexOf(record.label) > -1;
								}));
							});
							_this2.setState({
								selected: _records
							});
							if (_this2.props.onValueChange) {
								_this2.props.onValueChange(_obj2.value);
							}
							var _obj2 = {
								key: props.componentId,
								value: _records
							};
							_reactivemaps.AppbaseSensorHelper.URLParams.update(_this2.props.componentId, _this2.setURLParam(_obj2.value), _this2.props.URLParams);
							_reactivemaps.AppbaseSensorHelper.selectedSensor.set(_obj2, true);
						}
					} else {
						console.error(props.componentId + " - defaultSelected prop should be an \"array\"");
					}
				}
			}, 100);
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
			var query = null;

			function generateRangeQuery(appbaseField) {
				return record.map(function (singleRecord) {
					return {
						term: _defineProperty({}, appbaseField, singleRecord.value)
					};
				});
			}

			if (record && record.length) {
				query = {
					bool: {
						should: generateRangeQuery(this.props.appbaseField),
						minimum_should_match: 1,
						boost: 1.0
					}
				};
				return query;
			}
			return query;
		}

		// handle the input change and pass the value inside sensor info

	}, {
		key: "handleChange",
		value: function handleChange(record) {
			var selected = this.state.selected;
			var newSelection = [];
			var selectedIndex = null;
			selected.forEach(function (selectedRecord, index) {
				if (record.label === selectedRecord.label) {
					selectedIndex = index;
					selected.splice(index, 1);
				}
			});
			if (selectedIndex === null) {
				if (this.props.multiSelect) {
					selected.push(record);
					newSelection = selected;
				} else {
					newSelection.push(record);
				}
			} else {
				newSelection = selected;
			}
			this.setState({
				selected: newSelection
			});
			var obj = {
				key: this.props.componentId,
				value: newSelection
			};
			if (this.props.onValueChange) {
				this.props.onValueChange(obj.value);
			}
			// pass the selected sensor value with componentId as key,
			var isExecuteQuery = true;
			_reactivemaps.AppbaseSensorHelper.URLParams.update(this.props.componentId, this.setURLParam(obj.value), this.props.URLParams);
			_reactivemaps.AppbaseSensorHelper.selectedSensor.set(obj, isExecuteQuery);
		}
	}, {
		key: "setURLParam",
		value: function setURLParam(value) {
			return value.map(function (item) {
				return item.label;
			});
		}
	}, {
		key: "renderList",
		value: function renderList() {
			var _this3 = this;

			var list = void 0;
			var selectedText = this.state.selected.map(function (record) {
				return record.label;
			});
			if (this.props.data) {
				list = this.props.data.map(function (record) {
					return _react2.default.createElement(
						"div",
						{ key: record.label, className: "rbc-list-item" },
						_react2.default.createElement("input", {
							type: "checkbox",
							id: record.label,
							className: "rbc-checkbox-item",
							checked: selectedText.indexOf(record.label) > -1,
							onChange: function onChange() {
								return _this3.handleChange(record);
							}
						}),
						_react2.default.createElement(
							"label",
							{ htmlFor: record.label, className: "rbc-label" },
							record.label
						)
					);
				});
			}
			return list;
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
				"rbc-title-inactive": !this.props.title,
				"rbc-multiselect-active": this.props.multiSelect,
				"rbc-multiselect-inactive": !this.props.multiSelect
			});

			return _react2.default.createElement(
				"div",
				{ className: "rbc rbc-togglelist col s12 col-xs-12 card thumbnail " + cx, style: this.props.componentStyle },
				_react2.default.createElement(
					"div",
					{ className: "row" },
					title,
					_react2.default.createElement(
						"div",
						{ className: "col s12 col-xs-12" },
						this.renderList()
					)
				)
			);
		}
	}]);

	return ToggleList;
}(_react.Component);

exports.default = ToggleList;


ToggleList.propTypes = {
	componentId: _react2.default.PropTypes.string.isRequired,
	appbaseField: _react2.default.PropTypes.string.isRequired,
	title: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.element]),
	data: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.shape({
		label: _react2.default.PropTypes.string.isRequired,
		value: _react2.default.PropTypes.string.isRequired
	})),
	defaultSelected: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.string)]),
	multiSelect: _react2.default.PropTypes.bool,
	customQuery: _react2.default.PropTypes.func,
	onValueChange: _react2.default.PropTypes.func,
	componentStyle: _react2.default.PropTypes.object,
	URLParams: _react2.default.PropTypes.bool
};

// Default props value
ToggleList.defaultProps = {
	multiSelect: true,
	componentStyle: {},
	URLParams: false
};

// context type
ToggleList.contextTypes = {
	appbaseRef: _react2.default.PropTypes.any.isRequired,
	type: _react2.default.PropTypes.any.isRequired
};

ToggleList.types = {
	componentId: _reactivemaps.TYPES.STRING,
	appbaseField: _reactivemaps.TYPES.STRING,
	appbaseFieldType: _reactivemaps.TYPES.KEYWORD,
	title: _reactivemaps.TYPES.STRING,
	data: _reactivemaps.TYPES.OBJECT,
	defaultSelected: _reactivemaps.TYPES.ARRAY,
	multiSelect: _reactivemaps.TYPES.BOOLEAN,
	customQuery: _reactivemaps.TYPES.FUNCTION,
	URLParams: _reactivemaps.TYPES.BOOLEAN
};