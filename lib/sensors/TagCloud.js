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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-lines: 0 */


var _ = require("lodash");

var TagCloud = function (_Component) {
	_inherits(TagCloud, _Component);

	function TagCloud(props) {
		_classCallCheck(this, TagCloud);

		var _this = _possibleConstructorReturn(this, (TagCloud.__proto__ || Object.getPrototypeOf(TagCloud)).call(this, props));

		_this.state = {
			items: [],
			storedItems: [],
			rawData: {
				hits: {
					hits: []
				}
			},
			queryStart: false
		};
		_this.sortObj = {
			aggSort: "asc"
		};
		_this.highestCount = 0;
		_this.previousSelectedSensor = {};
		_this.channelId = null;
		_this.channelListener = null;
		_this.urlParams = _reactivemaps.AppbaseSensorHelper.URLParams.get(_this.props.componentId, _this.props.multiSelect);
		_this.type = _this.props.multiSelect ? "Terms" : "Term";
		_this.customQuery = _this.customQuery.bind(_this);
		_this.defaultCustomQuery = _this.defaultCustomQuery.bind(_this);
		return _this;
	}

	// Get the items from Appbase when component is mounted


	_createClass(TagCloud, [{
		key: "componentWillMount",
		value: function componentWillMount() {
			this.previousQuery = null; // initial value for onQueryChange
			this.size = this.props.size;
			this.setReact(this.props);
			this.setQueryInfo(this.props);
			this.createChannel();
			setTimeout(this.checkDefault.bind(this, this.props), 300);
			this.listenFilter();
		}
	}, {
		key: "componentWillReceiveProps",
		value: function componentWillReceiveProps(nextProps) {
			if (!_.isEqual(this.props.react, nextProps.react) || this.props.size !== nextProps.size) {
				this.setReact(nextProps);
				_reactivemaps.AppbaseChannelManager.update(this.channelId, this.react, nextProps.size, 0, false);
			}
			if (this.props.multiSelect !== nextProps.multiSelect) {
				this.type = nextProps.multiSelect ? "Terms" : "Term";
			}
			if (this.props.showFilter !== nextProps.showFilter || this.props.filterLabel !== nextProps.filterLabel) {
				this.setQueryInfo(nextProps);
				this.changeValue(this.defaultSelected, true);
			}
			if (this.props.defaultSelected !== nextProps.defaultSelected) {
				this.checkDefault(nextProps);
			}
		}
	}, {
		key: "componentWillUnmount",
		value: function componentWillUnmount() {
			this.removeChannel();
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
			if (this.state.items.length) {
				var defaultValue = this.urlParams !== null ? this.urlParams : props.defaultSelected;
				this.changeValue(defaultValue);
			}
		}
	}, {
		key: "changeValue",
		value: function changeValue(defaultValue) {
			var _this3 = this;

			var executeQuery = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			if (this.props.multiSelect && (!_.isEqual(this.defaultSelected, defaultValue) || executeQuery)) {
				this.defaultSelected = defaultValue;
				var items = this.state.items.map(function (item) {
					item.status = _this3.defaultSelected && _this3.defaultSelected.indexOf(item.key) > -1;
					item.status = _this3.defaultSelected === null ? false : item.status;
					return item;
				});

				this.selectedValue = this.defaultSelected === null ? null : items.filter(function (item) {
					return item.status;
				}).map(function (item) {
					return item.key;
				});

				this.setState({ items: items });
				var obj = {
					key: this.props.componentId,
					value: this.selectedValue
				};

				var execQuery = function execQuery() {
					if (_this3.props.onValueChange) {
						_this3.props.onValueChange(obj.value);
					}
					_reactivemaps.AppbaseSensorHelper.URLParams.update(_this3.props.componentId, obj.value, _this3.props.URLParams);
					_reactivemaps.AppbaseSensorHelper.selectedSensor.set(obj, true);
				};

				if (this.props.beforeValueChange) {
					this.props.beforeValueChange(obj.value).then(function () {
						execQuery();
					}).catch(function (e) {
						console.warn(_this3.props.componentId + " - beforeValueChange rejected the promise with", e);
					});
				} else {
					execQuery();
				}
			} else if (!this.props.multiSelect && (this.defaultSelected !== defaultValue || executeQuery)) {
				this.defaultSelected = defaultValue;
				var _items = this.state.items.map(function (item) {
					if (_this3.defaultSelected && _this3.defaultSelected === item.key) {
						item.status = !item.status;
					} else {
						item.status = false;
					}
					return item;
				});

				this.selectedValue = this.selectedValue === this.defaultSelected ? "" : this.defaultSelected;

				this.setState({ items: _items });
				var _obj = {
					key: this.props.componentId,
					value: this.selectedValue
				};

				var _execQuery = function _execQuery() {
					if (_this3.props.onValueChange) {
						_this3.props.onValueChange(_obj.value);
					}
					_reactivemaps.AppbaseSensorHelper.URLParams.update(_this3.props.componentId, _obj.value, _this3.props.URLParams);
					_reactivemaps.AppbaseSensorHelper.selectedSensor.set(_obj, true);
				};

				if (this.props.beforeValueChange) {
					this.props.beforeValueChange(_obj.value).then(function () {
						_execQuery();
					}).catch(function (e) {
						console.warn(_this3.props.componentId + " - beforeValueChange rejected the promise with", e);
					});
				} else {
					_execQuery();
				}
			}
		}
	}, {
		key: "customQuery",
		value: function customQuery(value) {
			var defaultQuery = this.props.customQuery ? this.props.customQuery : this.defaultCustomQuery;
			return defaultQuery(value);
		}
	}, {
		key: "defaultCustomQuery",
		value: function defaultCustomQuery(value) {
			var query = null;
			if (value) {
				query = _defineProperty({}, this.type, _defineProperty({}, this.props.dataField, value));
			}
			return query;
		}
	}, {
		key: "removeChannel",
		value: function removeChannel() {
			if (this.channelId) {
				_reactivemaps.AppbaseChannelManager.stopStream(this.channelId);
			}
			if (this.channelListener) {
				this.channelListener.remove();
			}
			if (this.loadListener) {
				this.loadListener.remove();
			}
			if (this.filterListener) {
				this.filterListener.remove();
			}
		}
	}, {
		key: "setQueryInfo",
		value: function setQueryInfo(props) {
			var _this4 = this;

			var getQuery = function getQuery(value) {
				var currentQuery = _this4.props.customQuery ? _this4.props.customQuery(value) : _this4.customQuery(value);
				if (_this4.props.onQueryChange && JSON.stringify(_this4.previousQuery) !== JSON.stringify(currentQuery)) {
					_this4.props.onQueryChange(_this4.previousQuery, currentQuery);
				}
				_this4.previousQuery = currentQuery;
				return currentQuery;
			};
			var obj = {
				key: props.componentId,
				value: {
					queryType: this.type,
					inputData: props.dataField,
					customQuery: getQuery,
					reactiveId: this.context.reactiveId,
					showFilter: props.showFilter,
					filterLabel: props.filterLabel ? props.filterLabel : props.componentId,
					component: "TagCloud",
					defaultSelected: this.urlParams !== null ? this.urlParams : props.defaultSelected
				}
			};
			_reactivemaps.AppbaseSensorHelper.selectedSensor.setSensorInfo(obj);
		}
	}, {
		key: "includeAggQuery",
		value: function includeAggQuery() {
			var obj = {
				key: this.props.componentId + "-sort",
				value: this.sortObj
			};
			_reactivemaps.AppbaseSensorHelper.selectedSensor.setSortInfo(obj);
		}
	}, {
		key: "setReact",
		value: function setReact(props) {
			var react = Object.assign({}, props.react);
			react.aggs = {
				key: props.dataField,
				sort: "asc",
				size: props.size,
				sortRef: props.componentId + "-sort"
			};
			var reactAnd = [props.componentId + "-sort", "tagCloudChanges"];
			this.react = _reactivemaps.AppbaseSensorHelper.setupReact(react, reactAnd);
		}
	}, {
		key: "createChannel",
		value: function createChannel() {
			var _this5 = this;

			this.includeAggQuery();
			// create a channel and listen the changes
			var channelObj = _reactivemaps.AppbaseChannelManager.create(this.context.appbaseRef, this.context.type, this.react);
			this.channelId = channelObj.channelId;
			this.channelListener = channelObj.emitter.addListener(this.channelId, function (res) {
				if (res.error) {
					_this5.setState({
						queryStart: false
					});
				}
				if (res.appliedQuery) {
					var data = res.data;
					var rawData = void 0;
					if (res.mode === "streaming") {
						rawData = _this5.state.rawData;
						rawData.hits.hits.push(res.data);
					} else if (res.mode === "historic") {
						rawData = data;
					}
					_this5.setState({
						queryStart: false,
						rawData: rawData
					});
					_this5.setData(rawData);
				}
			});
			this.listenLoadingChannel(channelObj);
		}
	}, {
		key: "listenLoadingChannel",
		value: function listenLoadingChannel(channelObj) {
			var _this6 = this;

			this.loadListener = channelObj.emitter.addListener(channelObj.channelId + "-query", function (res) {
				if (res.appliedQuery) {
					_this6.setState({
						queryStart: res.queryState
					});
				}
			});
		}
	}, {
		key: "setData",
		value: function setData(data) {
			if (data.aggregations && data.aggregations[this.props.dataField] && data.aggregations[this.props.dataField].buckets) {
				this.addItemsToList(data.aggregations[this.props.dataField].buckets);
			}
		}
	}, {
		key: "addItemsToList",
		value: function addItemsToList(newItems) {
			var _this7 = this;

			newItems = newItems.map(function (item) {
				_this7.highestCount = item.doc_count > _this7.highestCount ? item.doc_count : _this7.highestCount;
				item.key = item.key.toString();
				if (_this7.props.multiSelect) {
					item.status = !!(_this7.selectedValue && _this7.selectedValue.indexOf(item.key) > -1);
				} else {
					item.status = _this7.selectedValue === item.key;
				}
				return item;
			});
			this.setState({
				items: newItems,
				storedItems: newItems
			}, function () {
				_this7.checkDefault(_this7.props);
				// if (this.props.multiSelect && this.defaultSelected) {
				// 	this.defaultSelected.forEach((item) => {
				// 		this.setValue(item);
				// 	});
				// } else if (!this.props.multiSelect && this.defaultSelected) {
				// 	this.setValue(this.defaultSelected);
				// }
			});
		}
	}, {
		key: "setValue",
		value: function setValue(value) {
			var _this8 = this;

			var items = void 0;
			if (this.props.multiSelect) {
				items = this.state.items.map(function (item) {
					if (value && value === item.key) {
						item.status = !item.status;
					}
					return item;
				});

				this.selectedValue = items.filter(function (item) {
					return item.status;
				}).map(function (item) {
					return item.key;
				});
			} else {
				items = this.state.items.map(function (item) {
					if (value && value === item.key) {
						item.status = !item.status;
					} else {
						item.status = false;
					}
					return item;
				});

				this.selectedValue = this.selectedValue === value ? "" : value;
			}

			this.setState({ items: items });
			var obj = {
				key: this.props.componentId,
				value: this.selectedValue
			};

			var execQuery = function execQuery() {
				if (_this8.props.onValueChange) {
					_this8.props.onValueChange(obj.value);
				}
				_this8.defaultSelected = _this8.selectedValue;
				_reactivemaps.AppbaseSensorHelper.URLParams.update(_this8.props.componentId, obj.value, _this8.props.URLParams);
				_reactivemaps.AppbaseSensorHelper.selectedSensor.set(obj, true);
			};

			if (this.props.beforeValueChange) {
				this.props.beforeValueChange(obj.value).then(function () {
					execQuery();
				}).catch(function (e) {
					console.warn(_this8.props.componentId + " - beforeValueChange rejected the promise with", e);
				});
			} else {
				execQuery();
			}
		}
	}, {
		key: "renderTags",
		value: function renderTags() {
			var _this9 = this;

			var min = 0.8,
			    max = 3;

			return this.state.items.map(function (item) {
				var size = item.doc_count / _this9.highestCount * (max - min) + min;
				var cx = item.status ? "active" : "";

				return _react2.default.createElement(
					"a",
					{
						className: "rbc-list-item " + cx,
						onClick: function onClick() {
							return _this9.setValue(item.key);
						},
						key: item.key,
						style: { fontSize: size + "em" }
					},
					item.key,
					" ",
					_this9.props.showCount ? _react2.default.createElement(
						"span",
						{ className: "rbc-count" },
						item.doc_count
					) : ""
				);
			});
		}
	}, {
		key: "render",
		value: function render() {
			var title = null;

			if (this.state.items.length === 0) {
				return null;
			}

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
				"rbc-count-active": this.props.showCount,
				"rbc-count-inactive": !this.props.showCount,
				"rbc-multiSelect-active": this.props.multiSelect,
				"rbc-multiSelect-inactive": !this.props.multiSelect,
				"rbc-initialloader-active": this.props.initialLoader,
				"rbc-initialloader-inactive": !this.props.initialLoader
			}, this.props.className);

			return _react2.default.createElement(
				"div",
				{ className: "rbc rbc-tagcloud col s12 col-xs-12 card thumbnail " + cx, style: this.props.style },
				title,
				_react2.default.createElement(
					"div",
					{ className: "rbc-list-container" },
					this.renderTags()
				),
				this.props.initialLoader && this.state.queryStart ? _react2.default.createElement(_reactivemaps.InitialLoader, { defaultText: this.props.initialLoader }) : null
			);
		}
	}]);

	return TagCloud;
}(_react.Component);

exports.default = TagCloud;


TagCloud.propTypes = {
	dataField: _react2.default.PropTypes.string.isRequired,
	componentId: _react2.default.PropTypes.string.isRequired,
	title: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.element]),
	size: _react2.default.PropTypes.number,
	showCount: _react2.default.PropTypes.bool,
	multiSelect: _react2.default.PropTypes.bool,
	customQuery: _react2.default.PropTypes.func,
	initialLoader: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.element]),
	defaultSelected: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number, _react2.default.PropTypes.array]),
	react: _react2.default.PropTypes.object,
	beforeValueChange: _react2.default.PropTypes.func,
	onValueChange: _react2.default.PropTypes.func,
	style: _react2.default.PropTypes.object,
	URLParams: _react2.default.PropTypes.bool,
	showFilter: _react2.default.PropTypes.bool,
	filterLabel: _react2.default.PropTypes.string,
	className: _react2.default.PropTypes.string,
	onQueryChange: _react2.default.PropTypes.func
};

TagCloud.defaultProps = {
	showCount: true,
	multiSelect: false,
	size: 100,
	title: null,
	style: {},
	URLParams: false,
	showFilter: true
};

TagCloud.contextTypes = {
	appbaseRef: _react2.default.PropTypes.any.isRequired,
	type: _react2.default.PropTypes.any.isRequired,
	reactiveId: _react2.default.PropTypes.number
};

TagCloud.types = {
	componentId: _reactivemaps.TYPES.STRING,
	dataField: _reactivemaps.TYPES.STRING,
	dataFieldType: _reactivemaps.TYPES.KEYWORD,
	title: _reactivemaps.TYPES.STRING,
	size: _reactivemaps.TYPES.NUMBER,
	showCount: _reactivemaps.TYPES.BOOLEAN,
	multiSelect: _reactivemaps.TYPES.BOOLEAN,
	customQuery: _reactivemaps.TYPES.FUNCTION,
	initialLoader: _reactivemaps.TYPES.STRING,
	defaultSelected: _reactivemaps.TYPES.STRING,
	react: _reactivemaps.TYPES.OBJECT,
	URLParams: _reactivemaps.TYPES.BOOLEAN,
	showFilter: _reactivemaps.TYPES.BOOLEAN,
	filterLabel: _reactivemaps.TYPES.STRING,
	className: _reactivemaps.TYPES.STRING,
	onQueryChange: _reactivemaps.TYPES.FUNCTION
};