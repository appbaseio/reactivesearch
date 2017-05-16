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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-lines: 0 */


var _ = require("lodash");
var $ = require("jquery");

var NestedList = function (_Component) {
	_inherits(NestedList, _Component);

	function NestedList(props) {
		_classCallCheck(this, NestedList);

		var _this = _possibleConstructorReturn(this, (NestedList.__proto__ || Object.getPrototypeOf(NestedList)).call(this, props));

		_this.state = {
			items: [],
			storedItems: [],
			rawData: {
				hits: {
					hits: []
				}
			},
			subItems: [],
			selectedValues: []
		};
		_this.nested = ["nestedParentaggs"];
		_this.sortObj = {
			aggSort: _this.props.sortBy
		};
		_this.channelId = null;
		_this.channelListener = null;
		_this.urlParams = _reactivemaps.AppbaseSensorHelper.URLParams.get(_this.props.componentId, true);
		_this.defaultSelected = _this.urlParams !== null ? _this.urlParams : _this.props.defaultSelected;
		_this.filterBySearch = _this.filterBySearch.bind(_this);
		_this.onItemSelect = _this.onItemSelect.bind(_this);
		_this.onItemClick = _this.onItemClick.bind(_this);
		_this.customQuery = _this.customQuery.bind(_this);
		_this.handleSelect = _this.handleSelect.bind(_this);
		_this.nestedAggQuery = _this.nestedAggQuery.bind(_this);
		_this.type = "term";
		return _this;
	}

	// Get the items from Appbase when component is mounted


	_createClass(NestedList, [{
		key: "componentWillMount",
		value: function componentWillMount() {
			this.setQueryInfo();
			this.createChannel();
		}
	}, {
		key: "componentDidMount",
		value: function componentDidMount() {
			if (this.defaultSelected) {
				setTimeout(this.handleSelect.bind(this), 100);
			}
		}
	}, {
		key: "handleSelect",
		value: function handleSelect() {
			var _this2 = this;

			if (this.defaultSelected) {
				this.defaultSelected.forEach(function (value, index) {
					var customValue = _this2.defaultSelected.filter(function (item, subindex) {
						return subindex <= index;
					});
					_this2.onItemSelect(customValue);
				});
			}
		}
	}, {
		key: "componentWillUpdate",
		value: function componentWillUpdate() {
			var _this3 = this;

			setTimeout(function () {
				var defaultValue = _this3.urlParams !== null ? _this3.urlParams : _this3.props.defaultSelected;
				if (!_.isEqual(_this3.defaultSelected, defaultValue)) {
					_this3.defaultSelected = defaultValue;
					var items = _this3.state.items;
					items = items.map(function (item) {
						item.key = item.key.toString();
						item.status = !!(_this3.defaultSelected.length && _this3.defaultSelected.indexOf(item.key) > -1);
						return item;
					});
					_this3.setState({
						items: items,
						storedItems: items
					});
					_this3.handleSelect(_this3.defaultSelected);
				}
				if (_this3.sortBy !== _this3.props.sortBy) {
					_this3.sortBy = _this3.props.sortBy;
					_this3.handleSortSelect();
				}
			}, 300);
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
		}

		// build query for this sensor only

	}, {
		key: "customQuery",
		value: function customQuery(record) {
			var query = null;
			function generateRangeQuery(appbaseField) {
				return record.map(function (singleRecord, index) {
					return {
						term: _defineProperty({}, appbaseField[index], singleRecord)
					};
				});
			}
			if (record && record[0] !== null) {
				query = {
					bool: {
						must: generateRangeQuery(this.props.appbaseField)
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
					inputData: this.props.appbaseField[0],
					customQuery: this.props.customQuery ? this.props.customQuery : this.customQuery
				}
			};
			_reactivemaps.AppbaseSensorHelper.selectedSensor.setSensorInfo(obj);
			var nestedObj = {
				key: "nestedSelectedValues",
				value: {
					queryType: this.type,
					inputData: this.props.appbaseField[0],
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
			var level = this.state.selectedValues.length;
			var field = this.props.appbaseField[level];
			var orderType = this.props.sortBy === "count" ? "_count" : "_term";
			var sortBy = this.props.sortBy === "count" ? "desc" : this.props.sortBy;
			var createTermQuery = function createTermQuery(index) {
				return {
					term: _defineProperty({}, _this6.props.appbaseField[index], _this6.state.selectedValues[index])
				};
			};
			var createFilterQuery = function createFilterQuery(level) {
				var filterMust = [];
				if (level > 0) {
					for (var i = 0; i <= level - 1; i++) {
						filterMust.push(createTermQuery(i));
					}
				}
				return {
					bool: {
						must: filterMust
					}
				};
			};
			var init = function init(field, level) {
				return _defineProperty({}, field + "-" + level, {
					filter: createFilterQuery(level),
					aggs: _defineProperty({}, field, {
						terms: {
							field: field,

							size: _this6.props.size,
							order: _defineProperty({}, orderType, sortBy)
						}
					})
				});
			};
			if (this.state.selectedValues.length < this.props.appbaseField.length) {
				query = init(field, level);
			}
			return query;
		}

		// Create a channel which passes the react and receive results whenever react changes

	}, {
		key: "createChannel",
		value: function createChannel() {
			var _this7 = this;

			// Set the react - add self aggs query as well with react
			var react = this.props.react ? JSON.parse(JSON.stringify(this.props.react)) : {};
			react.aggs = {
				key: this.props.appbaseField[0],
				sort: this.props.sortBy,
				size: this.props.size,
				customQuery: this.nestedAggQuery
			};
			if (react && react.and && typeof react.and === "string") {
				react.and = [react.and];
			} else {
				react.and = react.and ? react.and : [];
			}
			react.and.push(this.nested[0], "nestedSelectedValues");
			this.includeAggQuery();

			// create a channel and listen the changes
			var channelObj = _reactivemaps.AppbaseChannelManager.create(this.context.appbaseRef, this.context.type, react);
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
				var appliedField = Object.keys(appliedQuery.body.aggs)[0].split("-")[0];
				level = this.props.appbaseField.indexOf(appliedField);
				level = level > -1 ? level : 0;
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
			var fieldLevel = this.props.appbaseField[level] + "-" + level;
			if (data && data.aggregations && data.aggregations[fieldLevel] && data.aggregations[fieldLevel][this.props.appbaseField[level]] && data.aggregations[fieldLevel][this.props.appbaseField[level]].buckets) {
				this.addItemsToList(data.aggregations[fieldLevel][this.props.appbaseField[level]].buckets, level);
			}
		}
	}, {
		key: "addItemsToList",
		value: function addItemsToList(newItems, level) {
			var _this9 = this;

			newItems = newItems.map(function (item) {
				item.key = item.key.toString();
				item.status = !!(_this9.defaultSelected && _this9.defaultSelected.indexOf(item.key) > -1);
				return item;
			});
			// const itemVar = level === 0 ? "items" : "subItems";
			// this.setState({
			// 	[itemVar]: newItems,
			// 	storedItems: newItems
			// });
			var items = this.state.items;
			items[level] = newItems;
			this.setState({
				items: items
			});
		}

		// set value

	}, {
		key: "setValue",
		value: function setValue(value) {
			var isExecuteQuery = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
			var changeNestedValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

			var obj = {
				key: this.props.componentId,
				value: value
			};
			// if(changeNestedValue) {
			var nestedObj = {
				key: "nestedSelectedValues",
				value: value
			};
			_reactivemaps.AppbaseSensorHelper.selectedSensor.set(nestedObj, changeNestedValue);
			// }
			if (this.props.onValueChange) {
				this.props.onValueChange(obj.value);
			}
			_reactivemaps.AppbaseSensorHelper.URLParams.update(this.props.componentId, value, this.props.URLParams);
			_reactivemaps.AppbaseSensorHelper.selectedSensor.set(obj, isExecuteQuery);
		}

		// filter

	}, {
		key: "filterBySearch",
		value: function filterBySearch(value) {
			if (value) {
				var items = this.state.storedItems.filter(function (item) {
					return item.key && item.key.toLowerCase().indexOf(value.toLowerCase()) > -1;
				});
				this.setState({
					items: items
				});
			} else {
				this.setState({
					items: this.state.storedItems
				});
			}
		}
	}, {
		key: "onItemClick",
		value: function onItemClick(event) {
			var selectedValues = $(event.currentTarget).data("value").split(",");
			var level = Number($(event.currentTarget).data("level"));
			event.stopPropagation();
			if (selectedValues[level] === this.state.selectedValues[level]) {
				selectedValues = this.state.selectedValues.filter(function (item, index) {
					return index < level;
				});
				var items = this.state.items;
				items[level + 1] = null;
				this.setState({
					items: items,
					selectedValues: selectedValues
				}, this.setValue(selectedValues, true, false));
			} else {
				this.onItemSelect(selectedValues);
			}
		}
	}, {
		key: "onItemSelect",
		value: function onItemSelect(selectedValues) {
			var items = this.state.items;
			items[selectedValues.length] = null;
			this.setState({
				selectedValues: selectedValues,
				items: items
			}, this.setValue.bind(this, selectedValues, true));
		}
	}, {
		key: "renderChevron",
		value: function renderChevron(level) {
			return level < this.props.appbaseField.length - 1 ? _react2.default.createElement("i", { className: "fa fa-chevron-right" }) : "";
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
			var _this10 = this;

			var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

			var level = prefix.length;
			return items.map(function (item, index) {
				item.value = prefix.concat([item.key]);
				var cx = (0, _classnames2.default)({
					"rbc-item-active": item.key === _this10.state.selectedValues[level],
					"rbc-item-inactive": !(item.key === _this10.state.selectedValues[level])
				});
				return _react2.default.createElement(
					"li",
					{
						key: index,
						className: "rbc-list-container col s12 col-xs-12"
					},
					_react2.default.createElement(
						"button",
						{ className: "rbc-list-item " + cx, "data-value": item.value, "data-level": level, onClick: _this10.onItemClick },
						_react2.default.createElement(
							"span",
							{ className: "rbc-label" },
							item.key,
							" ",
							_this10.countRender(item.doc_count)
						),
						_this10.renderChevron(level)
					),
					_this10.state.selectedValues[level] === item.key && _this10.state.items[level + 1] ? _react2.default.createElement(
						"ul",
						{ className: "rbc-sublist-container rbc-indent col s12 col-xs-12" },
						_this10.renderItems(_this10.state.items[level + 1], item.value)
					) : null
				);
			});
		}
	}, {
		key: "renderList",
		value: function renderList(key, level) {
			var list = void 0;
			if (key === this.state.selectedValues[level] && level === 0) {
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
				{ className: "rbc rbc-nestedlist-container card thumbnail col s12 col-xs-12", style: this.props.componentStyle },
				_react2.default.createElement(
					"div",
					{ className: "rbc rbc-nestedlist col s12 col-xs-12 " + cx },
					title,
					searchComponent,
					listComponent
				),
				this.props.initialLoader && this.state.queryStart ? _react2.default.createElement(_reactivemaps.InitialLoader, { defaultText: this.props.initialLoader }) : null
			);
		}
	}]);

	return NestedList;
}(_react.Component);

exports.default = NestedList;


var NestedingValidation = function NestedingValidation(props, propName) {
	var err = null;
	if (!props[propName]) {
		err = new Error("appbaseField is required prop!");
	} else if (!_.isArray(props[propName])) {
		err = new Error("appbaseField should be an array!");
	} else if (props[propName].length === 0) {
		err = new Error("appbaseField should not have an empty array.");
	} else if (props[propName].length > 9) {
		err = new Error("appbaseField can have maximum 10 fields.");
	}
	return err;
};

NestedList.propTypes = {
	componentId: _react2.default.PropTypes.string.isRequired,
	appbaseField: NestedingValidation,
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
	onValueChange: _react2.default.PropTypes.func,
	componentStyle: _react2.default.PropTypes.object,
	URLParams: _react2.default.PropTypes.bool
};

// Default props value
NestedList.defaultProps = {
	showCount: true,
	sortBy: "count",
	size: 100,
	showSearch: false,
	title: null,
	placeholder: "Search",
	componentStyle: {},
	URLParams: false
};

// context type
NestedList.contextTypes = {
	appbaseRef: _react2.default.PropTypes.any.isRequired,
	type: _react2.default.PropTypes.any.isRequired
};

NestedList.types = {
	componentId: _reactivemaps.TYPES.STRING,
	appbaseField: _reactivemaps.TYPES.ARRAY,
	appbaseFieldType: _reactivemaps.TYPES.STRING,
	title: _reactivemaps.TYPES.STRING,
	react: _reactivemaps.TYPES.OBJECT,
	size: _reactivemaps.TYPES.NUMBER,
	sortBy: _reactivemaps.TYPES.STRING,
	showCount: _reactivemaps.TYPES.BOOLEAN,
	showSearch: _reactivemaps.TYPES.BOOLEAN,
	defaultSelected: _reactivemaps.TYPES.ARRAY,
	customQuery: _reactivemaps.TYPES.FUNCTION,
	initialLoader: _reactivemaps.TYPES.OBJECT,
	URLParams: _reactivemaps.TYPES.BOOLEAN
};