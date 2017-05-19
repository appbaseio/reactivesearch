"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _rcSlider = require("rc-slider");

var _rcSlider2 = _interopRequireDefault(_rcSlider);

var _reactivemaps = require("@appbaseio/reactivemaps");

var _HistoGram = require("../addons/HistoGram");

var _HistoGram2 = _interopRequireDefault(_HistoGram);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-lines: 0 */


var _ = require("lodash");

var DynamicRangeSlider = function (_Component) {
	_inherits(DynamicRangeSlider, _Component);

	function DynamicRangeSlider(props) {
		_classCallCheck(this, DynamicRangeSlider);

		var _this = _possibleConstructorReturn(this, (DynamicRangeSlider.__proto__ || Object.getPrototypeOf(DynamicRangeSlider)).call(this, props));

		_this.state = {
			range: {
				min: null,
				max: null
			},
			values: {
				min: null,
				max: null
			},
			counts: [],
			rawData: {
				hits: {
					hits: []
				}
			}
		};
		_this.type = "range";
		_this.channelId = null;
		_this.channelListener = null;
		_this.urlParams = _reactivemaps.AppbaseSensorHelper.URLParams.get(_this.props.componentId, false, true);
		_this.handleValuesChange = _this.handleValuesChange.bind(_this);
		_this.handleResults = _this.handleResults.bind(_this);
		_this.customQuery = _this.customQuery.bind(_this);
		_this.histogramQuery = _this.histogramQuery.bind(_this);
		return _this;
	}

	// Get the items from Appbase when component is mounted


	_createClass(DynamicRangeSlider, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			this.setQueryInfo();
			this.createChannel();
		}
	}, {
		key: "componentWillReceiveProps",
		value: function componentWillReceiveProps(nextProps) {
			var defaultValue = this.urlParams !== null ? this.urlParams : nextProps.defaultSelected;
			this.updateValues(defaultValue);
		}

		// stop streaming request and remove listener when component will unmount

	}, {
		key: "componentWillUnmount",
		value: function componentWillUnmount() {
			if (this.channelId) {
				_reactivemaps.AppbaseChannelManager.stopStream(this.channelId);
			}
			if (this.channelListener) {
				this.channelListener.remove();
			}
			if (this.loadListener) {
				this.loadListener.remove();
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
					inputData: this.props.appbaseField
				}
			};
			var obj1 = {
				key: this.props.componentId + "-internal",
				value: {
					queryType: "range",
					inputData: this.props.appbaseField,
					customQuery: this.props.customQuery ? this.props.customQuery : this.customQuery
				}
			};
			_reactivemaps.AppbaseSensorHelper.selectedSensor.setSensorInfo(obj);
			_reactivemaps.AppbaseSensorHelper.selectedSensor.setSensorInfo(obj1);
			this.setRangeValue();
		}
	}, {
		key: "setRangeValue",
		value: function setRangeValue() {
			var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "range";

			var objValue = {
				key: this.props.componentId + "-internal",
				value: value
			};
			_reactivemaps.AppbaseSensorHelper.selectedSensor.set(objValue, true);
		}
	}, {
		key: "histogramQuery",
		value: function histogramQuery() {
			var query = void 0;
			var isHistogramQuery = _reactivemaps.AppbaseSensorHelper.selectedSensor.get(this.props.componentId + "-internal");
			if (isHistogramQuery === "histogram") {
				query = _defineProperty({}, this.props.appbaseField, {
					"histogram": {
						"field": this.props.appbaseField,
						"interval": this.props.interval ? this.props.interval : Math.ceil((this.state.range.max - this.state.range.min) / 10)
					}
				});
			} else {
				query = {
					"max": {
						"max": {
							"field": this.props.appbaseField
						}
					}, "min": {
						"min": {
							"field": this.props.appbaseField
						}
					}
				};
			}
			return query;
		}

		// Create a channel which passes the react and receive results whenever react changes

	}, {
		key: "createChannel",
		value: function createChannel() {
			var _this2 = this;

			// Set the react - add self aggs query as well with react
			var react = this.props.react ? this.props.react : {};
			react.aggs = {
				key: this.props.appbaseField,
				sort: "asc",
				size: 1000,
				customQuery: this.histogramQuery
			};
			if (react && react.and && typeof react.and === "string") {
				react.and = [react.and];
			} else {
				react.and = react.and ? react.and : [];
			}
			react.and.push(this.props.componentId + "-internal");
			// create a channel and listen the changes
			var channelObj = _reactivemaps.AppbaseChannelManager.create(this.context.appbaseRef, this.context.type, react);
			this.channelId = channelObj.channelId;
			this.channelListener = channelObj.emitter.addListener(channelObj.channelId, function (res) {
				if (res.error) {
					_this2.setState({
						queryStart: false
					});
				}
				if (res.appliedQuery) {
					var data = res.data;
					if (data.aggregations.max && data.aggregations.min) {
						_this2.setState({
							range: {
								min: data.aggregations.min.value,
								max: data.aggregations.max.value
							}
						}, _this2.setRangeValue.bind(_this2, "histogram"));
					} else {
						var rawData = void 0;
						if (res.mode === "streaming") {
							rawData = _this2.state.rawData;
							rawData.hits.hits.push(res.data);
						} else if (res.mode === "historic") {
							rawData = data;
						}
						_this2.setState({
							queryStart: false,
							rawData: rawData
						});
						_this2.setData(data);
					}
				}
			});
			this.listenLoadingChannel(channelObj);
		}
	}, {
		key: "listenLoadingChannel",
		value: function listenLoadingChannel(channelObj) {
			var _this3 = this;

			this.loadListener = channelObj.emitter.addListener(channelObj.channelId + "-query", function (res) {
				if (res.appliedQuery) {
					_this3.setState({
						queryStart: res.queryState
					});
				}
			});
		}
	}, {
		key: "setData",
		value: function setData(data) {
			try {
				this.addItemsToList(data.aggregations[this.props.appbaseField].buckets);
			} catch (e) {
				console.log(e);
			}
		}
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

		// Generating count for histogram

	}, {
		key: "countCalc",
		value: function countCalc(min, max, newItems) {
			// const counts = [];
			// const storeItems = {};
			// newItems.forEach((item) => {
			// 	item.key = Math.floor(item.key);
			// 	if (!(item.key in storeItems)) {
			// 		storeItems[item.key] = item.doc_count;
			// 	} else {
			// 		storeItems[item.key] += item.doc_count;
			// 	}
			// });
			// for (let i = min; i <= max; i += 1) {
			// 	const val = storeItems[i] ? storeItems[i] : 0;
			// 	counts.push(val);
			// }
			// return counts;
			return newItems.map(function (item) {
				return item.doc_count;
			});
		}

		// Handle function when value slider option is changing

	}, {
		key: "handleValuesChange",
		value: function handleValuesChange(component, values) {
			this.setState({
				values: values
			});
		}
	}, {
		key: "addItemsToList",
		value: function addItemsToList(newItems) {
			var _this4 = this;

			newItems = _.orderBy(newItems, ["key"], ["asc"]);
			var itemLength = newItems.length;
			var min = newItems[0].key;
			var max = newItems[itemLength - 1].key;
			if (itemLength > 1) {
				this.setState({
					counts: this.countCalc(min, max, newItems),
					values: { min: min, max: max }
				}, function () {
					if (!_.isEqual(_this4.state.values, _this4.state.currentValues)) {
						_this4.handleResults(null, { min: min, max: max });
					}
				});
			}
			var defaultValue = this.urlParams !== null ? this.urlParams : this.props.defaultSelected;
			this.updateValues(defaultValue);
		}
	}, {
		key: "updateValues",
		value: function updateValues(defaultSelected) {
			if (defaultSelected) {
				var _state$range = this.state.range,
				    min = _state$range.min,
				    max = _state$range.max;

				var _ref = this.urlParams !== null ? this.urlParams : defaultSelected(min, max),
				    start = _ref.start,
				    end = _ref.end;

				if (start >= min && end <= max) {
					var values = {
						min: start,
						max: end
					};
					this.setState({
						values: values
					}, this.handleResults.bind(this, null, values));
				} else {
					console.error("defaultSelected values must lie between " + min + " and " + max);
				}
			}
		}

		// Handle function when slider option change is completed

	}, {
		key: "handleResults",
		value: function handleResults(textVal, value) {
			var values = void 0;

			if (this.props.onValueChange) {
				this.props.onValueChange(obj.value);
			}

			if (textVal) {
				values = {
					min: textVal[0],
					max: textVal[1]
				};
			} else {
				values = value;
			}

			var realValues = {
				from: values.min,
				to: values.max
			};
			var obj = {
				key: this.props.componentId,
				value: realValues
			};

			if (this.props.onValueChange) {
				this.props.onValueChange(obj.value);
			}
			_reactivemaps.AppbaseSensorHelper.URLParams.update(this.props.componentId, this.setURLParam(obj.value), this.props.URLParams);
			_reactivemaps.AppbaseSensorHelper.selectedSensor.set(obj, true);

			this.setState({
				values: values
			});
		}
	}, {
		key: "setURLParam",
		value: function setURLParam(value) {
			if ("from" in value && "to" in value) {
				value = {
					start: value.from,
					end: value.to
				};
			}
			return JSON.stringify(value);
		}
	}, {
		key: "render",
		value: function render() {
			var title = null,
			    histogram = null,
			    marks = {};

			var _state$range2 = this.state.range,
			    min = _state$range2.min,
			    max = _state$range2.max;


			if (this.props.title) {
				title = _react2.default.createElement(
					"h4",
					{ className: "rbc-title col s12 col-xs-12" },
					this.props.title
				);
			}

			if (this.state.counts && this.state.counts.length && this.props.showHistogram) {
				histogram = _react2.default.createElement(_HistoGram2.default, { data: this.state.counts });
			}

			if (this.props.rangeLabels && min !== null && max !== null) {
				var _marks;

				var labels = this.props.rangeLabels(min, max);
				marks = (_marks = {}, _defineProperty(_marks, min, labels.start), _defineProperty(_marks, max, labels.end), _marks);
			}

			var cx = (0, _classnames2.default)({
				"rbc-title-active": this.props.title,
				"rbc-title-inactive": !this.props.title,
				"rbc-rangelabels-active": this.props.rangeLabels,
				"rbc-rangelabels-inactive": !this.props.rangeLabels,
				"rbc-histogram-active": this.props.showHistogram,
				"rbc-histogram-inactive": !this.props.showHistogram,
				"rbc-initialloader-active": this.props.initialLoader,
				"rbc-initialloader-inactive": !this.props.initialLoader
			});

			return _react2.default.createElement(
				"div",
				{ className: "rbc rbc-dynamicrangeslider card thumbnail col s12 col-xs-12 " + cx, style: this.props.componentStyle },
				title,
				histogram,
				_react2.default.createElement(
					"div",
					{ className: "rbc-rangeslider-container col s12 col-xs-12" },
					_react2.default.createElement(_rcSlider2.default, {
						range: true,
						value: [this.state.values.min, this.state.values.max],
						min: min,
						max: max,
						onChange: this.handleResults,
						step: this.props.stepValue,
						marks: marks
					})
				),
				this.props.initialLoader && this.state.queryStart ? _react2.default.createElement(_reactivemaps.InitialLoader, { defaultText: this.props.initialLoader }) : null
			);
		}
	}]);

	return DynamicRangeSlider;
}(_react.Component);

exports.default = DynamicRangeSlider;


DynamicRangeSlider.propTypes = {
	componentId: _react2.default.PropTypes.string.isRequired,
	appbaseField: _react2.default.PropTypes.string.isRequired,
	title: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.element]),
	stepValue: _react2.default.PropTypes.number,
	showHistogram: _react2.default.PropTypes.bool,
	rangeLabels: _react2.default.PropTypes.func,
	defaultSelected: _react2.default.PropTypes.func,
	customQuery: _react2.default.PropTypes.func,
	initialLoader: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.element]),
	react: _react2.default.PropTypes.object,
	onValueChange: _react2.default.PropTypes.func,
	interval: _react2.default.PropTypes.number,
	componentStyle: _react2.default.PropTypes.object,
	URLParams: _react2.default.PropTypes.bool
};

DynamicRangeSlider.defaultProps = {
	title: null,
	stepValue: 1,
	showHistogram: true,
	componentStyle: {},
	URLParams: false
};

// context type
DynamicRangeSlider.contextTypes = {
	appbaseRef: _react2.default.PropTypes.any.isRequired,
	type: _react2.default.PropTypes.any.isRequired
};

DynamicRangeSlider.types = {
	componentId: _reactivemaps.TYPES.STRING,
	appbaseField: _reactivemaps.TYPES.STRING,
	appbaseFieldType: _reactivemaps.TYPES.NUMBER,
	title: _reactivemaps.TYPES.STRING,
	rangeLabels: _reactivemaps.TYPES.FUNCTION,
	defaultSelected: _reactivemaps.TYPES.FUNCTION,
	react: _reactivemaps.TYPES.OBJECT,
	stepValue: _reactivemaps.TYPES.NUMBER,
	showHistogram: _reactivemaps.TYPES.BOOLEAN,
	customQuery: _reactivemaps.TYPES.FUNCTION,
	initialLoader: _reactivemaps.TYPES.OBJECT,
	URLParams: _reactivemaps.TYPES.BOOLEAN
};