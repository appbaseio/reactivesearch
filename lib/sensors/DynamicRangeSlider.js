"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

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
		_this.handleValuesChange = _this.handleValuesChange.bind(_this);
		_this.handleResults = _this.handleResults.bind(_this);
		_this.customQuery = _this.customQuery.bind(_this);
		_this.histogramQuery = _this.histogramQuery.bind(_this);
		return _this;
	}

	// Get the items from Appbase when component is mounted


	_createClass(DynamicRangeSlider, [{
		key: "componentWillMount",
		value: function componentWillMount() {
			this.previousQuery = null; // initial value for onQueryChange
			this.setReact(this.props);
			this.setQueryInfo();
			this.createChannel();
		}
	}, {
		key: "componentWillReceiveProps",
		value: function componentWillReceiveProps(nextProps) {
			if (!_.isEqual(this.props.react, nextProps.react)) {
				this.setReact(nextProps);
				_reactivemaps.AppbaseChannelManager.update(this.channelId, this.react, nextProps.size, 0, false);
			}
			this.updateValues(nextProps.defaultSelected);
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
			var _this2 = this;

			var obj = {
				key: this.props.componentId,
				value: {
					queryType: this.type,
					inputData: this.props.dataField
				}
			};
			var getQuery = function getQuery(value) {
				var currentQuery = _this2.props.customQuery ? _this2.props.customQuery(value) : _this2.customQuery(value);
				if (_this2.props.onQueryChange && JSON.stringify(_this2.previousQuery) !== JSON.stringify(currentQuery)) {
					_this2.props.onQueryChange(_this2.previousQuery, currentQuery);
				}
				_this2.previousQuery = currentQuery;
				return currentQuery;
			};
			var obj1 = {
				key: this.props.componentId + "-internal",
				value: {
					queryType: "range",
					inputData: this.props.dataField,
					customQuery: getQuery
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
			this.updateValues(this.props.defaultSelected);
		}
	}, {
		key: "histogramQuery",
		value: function histogramQuery() {
			var query = void 0;
			var isHistogramQuery = _reactivemaps.AppbaseSensorHelper.selectedSensor.get(this.props.componentId + "-internal");
			if (isHistogramQuery === "histogram") {
				if (this.props.showHistogram) {
					query = _defineProperty({}, this.props.dataField, {
						histogram: {
							field: this.props.dataField,
							interval: this.props.interval ? this.props.interval : Math.ceil((this.state.range.max - this.state.range.min) / 10)
						}
					});
				} else {
					return null;
				}
			} else {
				query = {
					max: {
						max: {
							field: this.props.dataField
						}
					},
					min: {
						min: {
							field: this.props.dataField
						}
					}
				};
			}
			return query;
		}
	}, {
		key: "setReact",
		value: function setReact(props) {
			// Set the react - add self aggs query as well with react
			var react = Object.assign({}, props.react);

			if (this.histogram !== null) {
				react.aggs = {
					key: props.dataField,
					sort: "asc",
					size: 1000,
					customQuery: this.histogramQuery
				};
			}

			var reactAnd = [props.componentId + "-internal"];
			this.react = _reactivemaps.AppbaseSensorHelper.setupReact(react, reactAnd);
		}

		// Create a channel which passes the react and receive results whenever react changes

	}, {
		key: "createChannel",
		value: function createChannel() {
			var _this3 = this;

			// create a channel and listen the changes
			var channelObj = _reactivemaps.AppbaseChannelManager.create(this.context.appbaseRef, this.context.type, this.react, 100, 0, false, this.props.componentId);
			this.channelId = channelObj.channelId;
			this.channelListener = channelObj.emitter.addListener(channelObj.channelId, function (res) {
				if (res.error) {
					_this3.setState({
						queryStart: false
					});
				}
				if (res.appliedQuery) {
					var data = res.data;
					if (data && data.aggregations) {
						if (data.aggregations.max && data.aggregations.min) {
							_this3.setState({
								range: {
									min: data.aggregations.min.value,
									max: data.aggregations.max.value
								}
							}, _this3.setRangeValue.bind(_this3, "histogram"));
						} else {
							var rawData = void 0;
							if (res.mode === "streaming") {
								rawData = _this3.state.rawData;
								rawData.hits.hits.push(res.data);
							} else if (res.mode === "historic") {
								rawData = data;
							}
							_this3.setState({
								queryStart: false,
								rawData: rawData
							});
							_this3.setData(data);
						}
					}
				}
			});
			this.listenLoadingChannel(channelObj);
		}
	}, {
		key: "listenLoadingChannel",
		value: function listenLoadingChannel(channelObj) {
			var _this4 = this;

			this.loadListener = channelObj.emitter.addListener(channelObj.channelId + "-query", function (res) {
				if (res.appliedQuery) {
					_this4.setState({
						queryStart: res.queryState
					});
				}
			});
		}
	}, {
		key: "setData",
		value: function setData(data) {
			try {
				this.addItemsToList(data.aggregations[this.props.dataField].buckets);
			} catch (e) {
				console.log(e);
			}
		}
	}, {
		key: "customQuery",
		value: function customQuery(record) {
			if (record) {
				return {
					range: _defineProperty({}, this.props.dataField, {
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
			var _this5 = this;

			newItems = _.orderBy(newItems, ["key"], ["asc"]);
			var itemLength = newItems.length;
			var min = newItems[0].key;
			var max = newItems[itemLength - 1].key;
			if (itemLength > 1) {
				this.setState({
					counts: this.countCalc(min, max, newItems),
					values: { min: min, max: max }
				}, function () {
					_this5.updateValues(_this5.props.defaultSelected);
				});
			}
		}
	}, {
		key: "updateValues",
		value: function updateValues(defaultSelected) {
			var _state$range = this.state.range,
			    min = _state$range.min,
			    max = _state$range.max;

			if (defaultSelected && min !== null && max !== null) {
				var _defaultSelected = defaultSelected(min, max),
				    start = _defaultSelected.start,
				    end = _defaultSelected.end;

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
			var _this6 = this;

			var values = void 0;
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

			var execQuery = function execQuery() {
				if (_this6.props.onValueChange) {
					_this6.props.onValueChange(obj.value);
				}
				_reactivemaps.AppbaseSensorHelper.selectedSensor.set(obj, true);
			};

			if (this.props.beforeValueChange) {
				this.props.beforeValueChange(obj.value).then(function () {
					execQuery();
				}).catch(function (e) {
					console.warn(_this6.props.componentId + " - beforeValueChange rejected the promise with", e);
				});
			} else {
				execQuery();
			}

			this.setState({
				values: values
			});
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
			}, this.props.className);

			var keyAttributes = {
				start: "start",
				end: "end"
			};

			// this will cause Slider to re-render when defaultSelected is used
			if (this.props.defaultSelected) {
				keyAttributes.start = this.state.values.min;
				keyAttributes.end = this.state.values.max;
			}

			return _react2.default.createElement(
				"div",
				{
					className: "rbc rbc-dynamicrangeslider card thumbnail col s12 col-xs-12 " + cx,
					style: this.props.style,
					key: "rbc-dynamicrangeslider-" + keyAttributes.start + "-" + keyAttributes.end
				},
				title,
				histogram,
				_react2.default.createElement(
					"div",
					{ className: "rbc-rangeslider-container col s12 col-xs-12" },
					_react2.default.createElement(_rcSlider2.default, {
						range: true,
						defaultValue: [this.state.values.min, this.state.values.max],
						min: min,
						max: max,
						onAfterChange: this.handleResults,
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
	componentId: _propTypes2.default.string.isRequired,
	dataField: _propTypes2.default.string.isRequired,
	title: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.element]),
	stepValue: _propTypes2.default.number,
	showHistogram: _propTypes2.default.bool,
	rangeLabels: _propTypes2.default.func,
	defaultSelected: _propTypes2.default.func,
	customQuery: _propTypes2.default.func,
	initialLoader: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.element]),
	react: _propTypes2.default.object,
	beforeValueChange: _propTypes2.default.func,
	onValueChange: _propTypes2.default.func,
	interval: _propTypes2.default.number,
	componentStyle: _propTypes2.default.object,
	className: _propTypes2.default.string,
	style: _propTypes2.default.object,
	onQueryChange: _propTypes2.default.func
};

DynamicRangeSlider.defaultProps = {
	title: null,
	stepValue: 1,
	showHistogram: true,
	style: {}
};

// context type
DynamicRangeSlider.contextTypes = {
	appbaseRef: _propTypes2.default.any.isRequired,
	type: _propTypes2.default.any.isRequired
};

DynamicRangeSlider.types = {
	componentId: _reactivemaps.TYPES.STRING,
	dataField: _reactivemaps.TYPES.STRING,
	dataFieldType: _reactivemaps.TYPES.NUMBER,
	title: _reactivemaps.TYPES.STRING,
	rangeLabels: _reactivemaps.TYPES.FUNCTION,
	defaultSelected: _reactivemaps.TYPES.FUNCTION,
	react: _reactivemaps.TYPES.OBJECT,
	stepValue: _reactivemaps.TYPES.NUMBER,
	showHistogram: _reactivemaps.TYPES.BOOLEAN,
	customQuery: _reactivemaps.TYPES.FUNCTION,
	initialLoader: _reactivemaps.TYPES.OBJECT,
	className: _reactivemaps.TYPES.STRING,
	onQueryChange: _reactivemaps.TYPES.FUNCTION
};