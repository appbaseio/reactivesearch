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

var _StaticSearch = require("../addons/StaticSearch");

var _StaticSearch2 = _interopRequireDefault(_StaticSearch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-lines: 0 */


var _ = require("lodash");

var NestedMultiList = function (_Component) {
	_inherits(NestedMultiList, _Component);

	function NestedMultiList(props) {
		_classCallCheck(this, NestedMultiList);

		var _this = _possibleConstructorReturn(this, (NestedMultiList.__proto__ || Object.getPrototypeOf(NestedMultiList)).call(this, props));

		_this.state = {
			items: [],
			storedItems: [],
			rawData: {
				hits: {
					hits: []
				}
			},
			subItems: [],
			selectedValues: {}
		};
		_this.nested = ["nestedParentaggs"];
		_this.sortObj = {
			aggSort: _this.props.sortBy
		};
		_this.channelId = null;
		_this.channelListener = null;
		_this.urlParams = _reactivemaps.AppbaseSensorHelper.URLParams.get(_this.props.componentId);
		_this.urlParams = _this.urlParams ? _this.urlParams.split("/") : null;
		_this.filterBySearch = _this.filterBySearch.bind(_this);
		_this.onItemClick = _this.onItemClick.bind(_this);
		_this.customQuery = _this.customQuery.bind(_this);
		_this.handleSelect = _this.handleSelect.bind(_this);
		_this.nestedAggQuery = _this.nestedAggQuery.bind(_this);
		_this.type = "term";
		return _this;
	}

	// Get the items from Appbase when component is mounted


	_createClass(NestedMultiList, [{
		key: "componentWillMount",
		value: function componentWillMount() {
			this.setReact(this.props);
			this.setQueryInfo();
			this.createChannel();
		}
	}, {
		key: "componentDidMount",
		value: function componentDidMount() {
			setTimeout(this.checkDefault.bind(this, this.props), 100);
			this.listenFilter();
		}
	}, {
		key: "componentWillReceiveProps",
		value: function componentWillReceiveProps(nextProps) {
			if (!_.isEqual(this.props.defaultSelected, nextProps.defaultSelected)) {
				this.changeValue(nextProps.defaultSelected);
			}
			if (!_.isEqual(this.props.react, nextProps.react)) {
				this.setReact(nextProps);
				_reactivemaps.AppbaseChannelManager.update(this.channelId, this.react, nextProps.size, 0, false);
			}
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
			if (this.loadListenerParent) {
				this.loadListenerParent.remove();
			}
			if (this.loadListenerChild) {
				this.loadListenerChild.remove();
			}
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
					_this2.onItemClick(null, 0);
				}
			});
		}
	}, {
		key: "checkDefault",
		value: function checkDefault(props) {
			this.urlParams = _reactivemaps.AppbaseSensorHelper.URLParams.get(props.componentId);
			this.urlParams = this.urlParams ? this.urlParams.split("/") : null;
			if (this.urlParams) {
				this.urlParams = this.urlParams.map(function (item) {
					var value = item.split("\\");
					if (value.length > 1) {
						return value;
					}
					return value[0];
				});
			}
			var defaultValue = this.urlParams !== null ? this.urlParams : props.defaultSelected;
			this.changeValue(defaultValue);
		}
	}, {
		key: "changeValue",
		value: function changeValue(defaultValue) {
			if (!_.isEqual(this.defaultSelected, defaultValue)) {
				this.defaultSelected = defaultValue;
				this.handleSelect(this.defaultSelected);
			}
			if (this.sortBy !== this.props.sortBy) {
				this.sortBy = this.props.sortBy;
				this.handleSortSelect();
			}
		}
	}, {
		key: "handleSelect",
		value: function handleSelect(defaultSelected) {
			var _this3 = this;

			if (defaultSelected) {
				this.defaultSelected.forEach(function (value, index) {
					if (Array.isArray(value)) {
						if (index !== defaultSelected.length - 1) {
							console.error(_this3.props.componentId + " - Please check the defaultSelected prop format. Only the last element in the defaultSelected array can be an array");
						}
						value.map(function (item) {
							setTimeout(function () {
								_this3.onItemClick(item, index);
							}, 100);
						});
					} else {
						setTimeout(function () {
							_this3.onItemClick(value, index);
						}, 100);
					}
				});
			} else if (this.defaultSelected === null) {
				this.onItemClick(null, 0);
			}
		}

		// build query for this sensor only

	}, {
		key: "customQuery",
		value: function customQuery(record) {
			var query = null;
			function generateTermsQuery(dataField) {
				return Object.keys(record).map(function (key, index) {
					return {
						terms: _defineProperty({}, dataField[index], Array.isArray(record[key]) ? record[key] : [record[key]])
					};
				});
			}
			if (record && record[0] !== null) {
				query = {
					bool: {
						must: generateTermsQuery(this.props.dataField)
					}
				};
			}
			return query;
		}

		// set the query type and input data

	}, {
		key: "setQueryInfo",
		value: function setQueryInfo() {
			var obj = {
				key: this.props.componentId,
				value: {
					queryType: this.type,
					inputData: this.props.dataField[0],
					customQuery: this.props.customQuery ? this.props.customQuery : this.customQuery,
					reactiveId: this.context.reactiveId,
					showFilter: this.props.showFilter,
					filterLabel: this.props.filterLabel ? this.props.filterLabel : this.props.componentId,
					component: "NestedMultiList",
					defaultSelected: this.urlParams !== null ? this.urlParams : this.props.defaultSelected
				}
			};
			_reactivemaps.AppbaseSensorHelper.selectedSensor.setSensorInfo(obj);
			var nestedObj = {
				key: "nestedSelectedValues-" + this.props.componentId,
				value: {
					queryType: this.type,
					inputData: this.props.dataField[0],
					customQuery: function customQuery() {}
				}
			};
			_reactivemaps.AppbaseSensorHelper.selectedSensor.setSensorInfo(nestedObj);
		}
	}, {
		key: "includeAggQuery",
		value: function includeAggQuery() {
			var _this4 = this;

			this.nested.forEach(function (name) {
				var obj = {
					key: name,
					value: _this4.sortObj
				};
				_reactivemaps.AppbaseSensorHelper.selectedSensor.setSortInfo(obj);
			});
		}
	}, {
		key: "handleSortSelect",
		value: function handleSortSelect() {
			var _this5 = this;

			this.sortObj = {
				aggSort: this.props.sortBy
			};
			this.nested.forEach(function (name) {
				var obj = {
					key: name,
					value: _this5.sortObj
				};
				_reactivemaps.AppbaseSensorHelper.selectedSensor.set(obj, true, "sortChange");
			});
		}
	}, {
		key: "nestedAggQuery",
		value: function nestedAggQuery() {
			var _this6 = this;

			var query = null;
			var level = Object.keys(this.state.selectedValues).length || 0;
			var field = this.props.dataField[level];
			var orderType = this.props.sortBy === "count" ? "_count" : "_term";
			var sortBy = this.props.sortBy === "count" ? "desc" : this.props.sortBy;

			var createTermQuery = function createTermQuery(index) {
				var value = _this6.state.selectedValues[index];
				if (value.length === 1) {
					return {
						term: _defineProperty({}, _this6.props.dataField[index], value[0])
					};
				}
				return null;
			};

			var createFilterQuery = function createFilterQuery(level) {
				var filterMust = [];
				if (level > 0) {
					for (var i = 0; i <= level - 1; i++) {
						var termQuery = createTermQuery(i);
						if (termQuery) {
							filterMust.push(termQuery);
						}
					}
				}
				if (Array.isArray(filterMust) && filterMust.length) {
					return {
						bool: {
							must: filterMust
						}
					};
				}
				return null;
			};

			var init = function init(field, level) {
				return _defineProperty({}, field + "-" + level, {
					filter: createFilterQuery(level) || {},
					aggs: _defineProperty({}, field, {
						terms: {
							field: field,
							size: _this6.props.size,
							order: _defineProperty({}, orderType, sortBy)
						}
					})
				});
			};

			if (level >= 0 && level < this.props.dataField.length) {
				query = init(field, level);
			}

			return query;
		}
	}, {
		key: "setReact",
		value: function setReact(props) {
			var react = Object.assign({}, props.react);
			react.aggs = {
				key: props.dataField[0],
				sort: props.sortBy,
				size: props.size,
				customQuery: this.nestedAggQuery
			};
			var reactAnd = [this.nested[0], "nestedSelectedValues-" + props.componentId];
			this.react = _reactivemaps.AppbaseSensorHelper.setupReact(react, reactAnd);
		}

		// Create a channel which passes the react and receive results whenever react changes

	}, {
		key: "createChannel",
		value: function createChannel() {
			var _this7 = this;

			this.includeAggQuery();
			// create a channel and listen the changes
			var channelObj = _reactivemaps.AppbaseChannelManager.create(this.context.appbaseRef, this.context.type, this.react, 100, 0, false, this.props.componentId);
			this.channelId = channelObj.channelId;
			this.channelListener = channelObj.emitter.addListener(this.channelId, function (res) {
				if (res.error) {
					_this7.setState({
						queryStart: false
					});
				}
				if (res.appliedQuery && Object.keys(res.appliedQuery).length) {
					_this7.queryLevel = _this7.getQueryLevel(res.appliedQuery);
					_this7.setState({
						queryStart: false,
						rawData: res.data
					});
					_this7.setData(res.data, _this7.queryLevel);
				}
			});
			this.listenLoadingChannel(channelObj, "loadListenerParent");
		}
	}, {
		key: "getQueryLevel",
		value: function getQueryLevel(appliedQuery) {
			var level = 0;
			try {
				var field = Object.keys(appliedQuery.body.aggs)[0];
				if (field) {
					var appliedField = field.split("-")[0];
					level = this.props.dataField.indexOf(appliedField);
					level = level > -1 ? level : 0;
				}
			} catch (e) {
				console.log(e);
			}
			return level;
		}
	}, {
		key: "listenLoadingChannel",
		value: function listenLoadingChannel(channelObj, listener) {
			var _this8 = this;

			this[listener] = channelObj.emitter.addListener(channelObj.channelId + "-query", function (res) {
				if (res.appliedQuery) {
					_this8.setState({
						queryStart: res.queryState
					});
				}
			});
		}
	}, {
		key: "setData",
		value: function setData(data, level) {
			var fieldLevel = this.props.dataField[level] + "-" + level;
			if (data && data.aggregations && data.aggregations[fieldLevel] && data.aggregations[fieldLevel][this.props.dataField[level]] && data.aggregations[fieldLevel][this.props.dataField[level]].buckets) {
				this.addItemsToList(data.aggregations[fieldLevel][this.props.dataField[level]].buckets, level);
			}
		}
	}, {
		key: "addItemsToList",
		value: function addItemsToList(newItems, level) {
			var selectedValues = this.state.selectedValues;


			newItems = newItems.map(function (item) {
				item.key = item.key.toString();
				return item;
			});
			var items = this.state.items;

			if (newItems) {
				items[level] = newItems;
			} else {
				delete items[level];
			}

			if (selectedValues[level]) {
				var values = [].concat(_toConsumableArray(selectedValues[level]));
				values.forEach(function (val) {
					if (items[level].filter(function (item) {
						return item.key === val;
					}).length !== 1) {
						selectedValues[level] = selectedValues[level].filter(function (i) {
							return i !== val;
						});
					}
				});

				if (selectedValues[level] && !selectedValues[level].length) {
					for (var row in selectedValues) {
						if (row >= level) {
							delete selectedValues[row];
						}
					}
				}
			}

			this.setState({
				selectedValues: selectedValues,
				items: items,
				storedItems: items
			});
			this.setValue(selectedValues, true, false);
		}

		// set value

	}, {
		key: "setValue",
		value: function setValue(value) {
			var _this9 = this;

			var isExecuteQuery = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
			var changeNestedValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

			value = Object.keys(value).length ? value : null;
			if (value) {
				value = this.flattenObj(value);
			}
			var obj = {
				key: this.props.componentId,
				value: value
			};
			var nestedObj = {
				key: "nestedSelectedValues-" + this.props.componentId,
				value: value
			};
			_reactivemaps.AppbaseSensorHelper.selectedSensor.set(nestedObj, changeNestedValue);

			var execQuery = function execQuery() {
				if (_this9.props.onValueChange) {
					_this9.props.onValueChange(obj.value);
				}
				var paramValue = [];
				if (value && value.length) {
					paramValue = value.map(function (item) {
						if (Array.isArray(item)) {
							return item.join("\\");
						}
						return item;
					});
				}
				paramValue = paramValue.length ? paramValue.join("/") : null;
				_reactivemaps.AppbaseSensorHelper.URLParams.update(_this9.props.componentId, paramValue, _this9.props.URLParams);
				_reactivemaps.AppbaseSensorHelper.selectedSensor.set(obj, isExecuteQuery);
			};

			if (this.props.beforeValueChange) {
				this.props.beforeValueChange(obj.value).then(function () {
					execQuery();
				}).catch(function (e) {
					console.warn(_this9.props.componentId + " - beforeValueChange rejected the promise with", e);
				});
			} else {
				execQuery();
			}
		}
	}, {
		key: "flattenObj",
		value: function flattenObj(obj) {
			return Object.keys(obj).map(function (key) {
				return Array.isArray(obj[key]) && obj[key].length === 1 ? obj[key][0] : obj[key];
			});
		}

		// filter

	}, {
		key: "filterBySearch",
		value: function filterBySearch(value) {
			if (value) {
				var items = this.state.storedItems[0].filter(function (item) {
					return item.key && item.key.toLowerCase().indexOf(value.toLowerCase()) > -1;
				});
				this.setState({
					items: [items]
				});
			} else {
				this.setState({
					items: this.state.storedItems
				});
			}
		}
	}, {
		key: "onItemClick",
		value: function onItemClick(selected, level) {
			var _this10 = this;

			var _state = this.state,
			    selectedValues = _state.selectedValues,
			    items = _state.items;


			if (selected === null) {
				selectedValues = {};
			} else if (selectedValues[level] && selectedValues[level].includes(selected)) {
				selectedValues[level] = selectedValues[level].filter(function (item) {
					return item !== selected;
				});
			} else {
				var temp = selectedValues[level] || [];
				selectedValues[level] = [].concat(_toConsumableArray(temp), [selected]);
			}

			if (selectedValues[level] && !selectedValues[level].length) {
				for (var row in selectedValues) {
					if (row >= level) {
						delete selectedValues[row];
					}
				}
			}

			if (selectedValues[level] && selectedValues[level].length > 1) {
				for (var _row in selectedValues) {
					if (_row > level) {
						delete selectedValues[_row];
					}
				}
			}

			delete items[level + 1];

			this.setState({
				items: items,
				selectedValues: selectedValues
			}, function () {
				_this10.setValue(selectedValues, true, false);
			});
		}
	}, {
		key: "renderChevron",
		value: function renderChevron(level) {
			return level < this.props.dataField.length - 1 ? _react2.default.createElement("i", { className: "fa fa-chevron-right" }) : "";
		}
	}, {
		key: "countRender",
		value: function countRender(docCount) {
			var count = void 0;
			if (this.props.showCount) {
				count = _react2.default.createElement(
					"span",
					{ className: "rbc-count" },
					" ",
					docCount
				);
			}
			return count;
		}
	}, {
		key: "renderItems",
		value: function renderItems(items) {
			var _this11 = this;

			var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

			var level = prefix.length;
			items = items.filter(function (item) {
				return item.key;
			});
			return items.map(function (item, index) {
				item.value = prefix.concat([item.key]);
				var active = Array.isArray(_this11.state.selectedValues[level]) && _this11.state.selectedValues[level].includes(item.key);
				var cx = (0, _classnames2.default)({
					"rbc-item-active": active,
					"rbc-item-inactive": !active,
					"rbc-checkbox-active": _this11.props.showCheckbox,
					"rbc-checkbox-inactive": !_this11.props.showCheckbox
				});
				return _react2.default.createElement(
					"li",
					{
						key: index,
						className: "rbc-list-container col s12 col-xs-12"
					},
					_react2.default.createElement(
						"div",
						{ className: "rbc-list-item " + cx, onClick: function onClick() {
								return _this11.onItemClick(item.key, level);
							} },
						_react2.default.createElement("input", { type: "checkbox", className: "rbc-checkbox-item", checked: active, onChange: function onChange() {} }),
						_react2.default.createElement(
							"label",
							{ className: "rbc-label" },
							item.key,
							" ",
							_this11.countRender(item.doc_count)
						),
						_this11.renderChevron(level)
					),
					active && _this11.state.selectedValues[level].length === 1 && _this11.state.items[level + 1] ? _react2.default.createElement(
						"ul",
						{ className: "rbc-sublist-container rbc-indent col s12 col-xs-12" },
						_this11.renderItems(_this11.state.items[level + 1], item.value)
					) : null
				);
			});
		}
	}, {
		key: "renderList",
		value: function renderList(key, level) {
			var list = void 0;
			if (this.state.selectedValues[level].includes(key) && level === 0) {
				list = _react2.default.createElement(
					"ul",
					{ className: "rbc-sublist-container rbc-indent col s12 col-xs-12" },
					this.renderItems(this.state.subItems, 1)
				);
			}
			return list;
		}
	}, {
		key: "render",
		value: function render() {
			var searchComponent = null,
			    title = null;

			if (this.state.storedItems.length === 0 || this.state.storedItems.length && Array.isArray(this.state.storedItems[0]) && this.state.storedItems[0].length === 0) {
				return null;
			}

			var listComponent = this.state.items[0] ? _react2.default.createElement(
				"ul",
				{ className: "row rbc-list-container" },
				this.renderItems(this.state.items[0], [])
			) : null;

			// set static search
			if (this.props.showSearch) {
				searchComponent = _react2.default.createElement(_StaticSearch2.default, {
					placeholder: this.props.placeholder,
					changeCallback: this.filterBySearch
				});
			}

			if (this.props.title) {
				title = _react2.default.createElement(
					"h4",
					{ className: "rbc-title col s12 col-xs-12" },
					this.props.title
				);
			}

			var cx = (0, _classnames2.default)({
				"rbc-search-active": this.props.showSearch,
				"rbc-search-inactive": !this.props.showSearch,
				"rbc-title-active": this.props.title,
				"rbc-title-inactive": !this.props.title,
				"rbc-placeholder-active": this.props.placeholder,
				"rbc-placeholder-inactive": !this.props.placeholder,
				"rbc-count-active": this.props.showCount,
				"rbc-count-inactive": !this.props.showCount,
				"rbc-initialloader-active": this.props.initialLoader,
				"rbc-initialloader-inactive": !this.props.initialLoader
			});

			return _react2.default.createElement(
				"div",
				{ className: "rbc rbc-nestedmultilist-container card thumbnail col s12 col-xs-12", style: this.props.componentStyle },
				_react2.default.createElement(
					"div",
					{ className: "rbc rbc-nestedmultilist col s12 col-xs-12 " + cx },
					title,
					searchComponent,
					listComponent
				),
				this.props.initialLoader && this.state.queryStart ? _react2.default.createElement(_reactivemaps.InitialLoader, { defaultText: this.props.initialLoader }) : null
			);
		}
	}]);

	return NestedMultiList;
}(_react.Component);

exports.default = NestedMultiList;


var NestedingValidation = function NestedingValidation(props, propName) {
	var err = null;
	if (!props[propName]) {
		err = new Error("dataField is required prop!");
	} else if (!Array.isArray(props[propName])) {
		err = new Error("dataField should be an array!");
	} else if (props[propName].length === 0) {
		err = new Error("dataField should not have an empty array.");
	} else if (props[propName].length > 9) {
		err = new Error("dataField can have maximum 10 fields.");
	}
	return err;
};

NestedMultiList.propTypes = {
	componentId: _react2.default.PropTypes.string.isRequired,
	dataField: NestedingValidation,
	title: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.element]),
	showCount: _react2.default.PropTypes.bool,
	showSearch: _react2.default.PropTypes.bool,
	sortBy: _react2.default.PropTypes.oneOf(["count", "asc", "desc"]),
	size: _reactivemaps.AppbaseSensorHelper.sizeValidation,
	defaultSelected: _react2.default.PropTypes.array,
	customQuery: _react2.default.PropTypes.func,
	placeholder: _react2.default.PropTypes.string,
	initialLoader: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.element]),
	react: _react2.default.PropTypes.object,
	beforeValueChange: _react2.default.PropTypes.func,
	onValueChange: _react2.default.PropTypes.func,
	componentStyle: _react2.default.PropTypes.object,
	URLParams: _react2.default.PropTypes.bool,
	showFilter: _react2.default.PropTypes.bool,
	filterLabel: _react2.default.PropTypes.string,
	showCheckbox: _react2.default.PropTypes.bool
};

// Default props value
NestedMultiList.defaultProps = {
	showCount: true,
	sortBy: "count",
	size: 100,
	showSearch: true,
	title: null,
	placeholder: "Search",
	componentStyle: {},
	URLParams: false,
	showFilter: true,
	showCheckbox: true
};

// context type
NestedMultiList.contextTypes = {
	appbaseRef: _react2.default.PropTypes.any.isRequired,
	type: _react2.default.PropTypes.any.isRequired,
	reactiveId: _react2.default.PropTypes.number
};

NestedMultiList.types = {
	componentId: _reactivemaps.TYPES.STRING,
	dataField: _reactivemaps.TYPES.ARRAY,
	dataFieldType: _reactivemaps.TYPES.STRING,
	title: _reactivemaps.TYPES.STRING,
	placeholder: _reactivemaps.TYPES.STRING,
	react: _reactivemaps.TYPES.OBJECT,
	size: _reactivemaps.TYPES.NUMBER,
	sortBy: _reactivemaps.TYPES.STRING,
	showCount: _reactivemaps.TYPES.BOOLEAN,
	showSearch: _reactivemaps.TYPES.BOOLEAN,
	defaultSelected: _reactivemaps.TYPES.ARRAY,
	customQuery: _reactivemaps.TYPES.FUNCTION,
	initialLoader: _reactivemaps.TYPES.OBJECT,
	URLParams: _reactivemaps.TYPES.BOOLEAN,
	showFilter: _reactivemaps.TYPES.BOOLEAN,
	filterLabel: _reactivemaps.TYPES.STRING,
	showCheckbox: _reactivemaps.TYPES.BOOLEAN
};