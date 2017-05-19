"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _reactSelect = require("react-select");

var _reactSelect2 = _interopRequireDefault(_reactSelect);

var _reactivemaps = require("@appbaseio/reactivemaps");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-lines: 0 */


var CategorySearch = function (_Component) {
	_inherits(CategorySearch, _Component);

	function CategorySearch(props) {
		_classCallCheck(this, CategorySearch);

		var _this = _possibleConstructorReturn(this, (CategorySearch.__proto__ || Object.getPrototypeOf(CategorySearch)).call(this, props));

		_this.state = {
			items: [],
			currentValue: null,
			isLoading: false,
			options: [],
			rawData: {
				hits: {
					hits: []
				}
			}
		};
		_this.selectedCategory = null;
		_this.searchInputId = "internal-" + props.componentId;
		_this.type = "match_phrase";
		_this.channelId = null;
		_this.channelListener = null;
		_this.urlParams = _reactivemaps.AppbaseSensorHelper.URLParams.get(_this.props.componentId);
		_this.fieldType = _typeof(props.appbaseField);
		_this.handleSearch = _this.handleSearch.bind(_this);
		_this.optionRenderer = _this.optionRenderer.bind(_this);
		_this.setValue = _this.setValue.bind(_this);
		_this.defaultSearchQuery = _this.defaultSearchQuery.bind(_this);
		_this.previousSelectedSensor = {};
		return _this;
	}

	// Get the items from Appbase when component is mounted


	_createClass(CategorySearch, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			this.setQueryInfo();
			this.createChannel();
			this.checkDefault();
		}
	}, {
		key: "componentWillUpdate",
		value: function componentWillUpdate() {
			this.checkDefault();
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
		}
	}, {
		key: "highlightQuery",
		value: function highlightQuery() {
			var fields = {};
			var highlightFields = this.props.highlightFields ? this.props.highlightFields : this.props.appbaseField;
			if (typeof highlightFields === "string") {
				fields[highlightFields] = {};
			} else if (_.isArray(highlightFields)) {
				highlightFields.forEach(function (item) {
					fields[item] = {};
				});
			}
			return {
				highlight: {
					pre_tags: ["<span class=\"rbc-highlight\">"],
					post_tags: ["</span>"],
					fields: fields
				}
			};
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
					customQuery: this.props.customQuery ? this.props.customQuery : this.defaultSearchQuery
				}
			};
			if (this.props.highlight) {
				obj.value.externalQuery = this.highlightQuery();
			}
			_reactivemaps.AppbaseSensorHelper.selectedSensor.setSensorInfo(obj);
			var searchObj = {
				key: this.searchInputId,
				value: {
					queryType: "multi_match",
					inputData: this.props.appbaseField,
					customQuery: this.defaultSearchQuery
				}
			};
			_reactivemaps.AppbaseSensorHelper.selectedSensor.setSensorInfo(searchObj);
		}

		// set value to search

	}, {
		key: "setValue",
		value: function setValue(value) {
			var obj = {
				key: this.searchInputId,
				value: { value: value }
			};
			_reactivemaps.AppbaseSensorHelper.selectedSensor.set(obj, true);

			if (value && value.trim() !== "") {
				this.setState({
					options: [{
						label: value,
						value: value
					}],
					isLoadingOptions: true,
					currentValue: value
				});
			} else {
				this.setState({
					options: [],
					isLoadingOptions: false,
					currentValue: value
				});
			}
		}
	}, {
		key: "removeDuplicates",
		value: function removeDuplicates(myArr, prop) {
			return myArr.filter(function (obj, pos, arr) {
				return arr.map(function (mapObj) {
					return mapObj[prop];
				}).indexOf(obj[prop]) === pos;
			});
		}

		// default query

	}, {
		key: "defaultSearchQuery",
		value: function defaultSearchQuery(input) {
			if (input && input.value) {
				var query = [];
				if (this.fieldType === "string") {
					query.push({
						match_phrase_prefix: _defineProperty({}, this.props.appbaseField, input.value)
					});
				} else {
					this.props.appbaseField.forEach(function (field) {
						query.push({
							match_phrase_prefix: _defineProperty({}, field, input.value)
						});
					});

					query = {
						bool: {
							should: query,
							minimum_should_match: 1
						}
					};
				}

				if (input.category && input.category !== null) {
					return {
						bool: {
							must: [query, {
								term: _defineProperty({}, this.props.categoryField, input.category)
							}]
						}
					};
				}

				return {
					bool: {
						should: query,
						minimum_should_match: 1
					}
				};
			}
			return null;
		}

		// Create a channel which passes the react and receive results whenever react changes

	}, {
		key: "createChannel",
		value: function createChannel() {
			var _this2 = this;

			var react = this.props.react ? this.props.react : {};
			react.aggs = {
				key: this.props.categoryField
			};
			if (react && react.and && typeof react.and === "string") {
				react.and = [react.and];
			} else {
				react.and = react.and ? react.and : [];
			}
			react.and.push(this.searchInputId);
			var channelObj = _reactivemaps.AppbaseChannelManager.create(this.context.appbaseRef, this.context.type, react);
			this.channelId = channelObj.channelId;
			this.channelListener = channelObj.emitter.addListener(channelObj.channelId, function (res) {
				var data = res.data;
				var rawData = void 0;
				if (res.mode === "streaming") {
					rawData = _this2.state.rawData;
					rawData.hits.hits.push(res.data);
				} else if (res.mode === "historic") {
					rawData = data;
				}
				_this2.setState({
					rawData: rawData
				});
				_this2.setData(rawData, res.appliedQuery.body.query);
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
		value: function setData(data, loadSuggestions) {
			var _this4 = this;

			var aggs = [];
			var options = [];
			var searchField = null;
			if (data.aggregations && data.aggregations[this.props.categoryField] && data.aggregations[this.props.categoryField].buckets) {
				aggs = data.aggregations[this.props.categoryField].buckets.slice(0, 2);
			}

			if (loadSuggestions) {
				if (this.fieldType === "string") {
					searchField = "hit._source." + this.props.appbaseField + ".trim()";
				}
				data.hits.hits.forEach(function (hit) {
					if (searchField) {
						options.push({ value: eval(searchField), label: eval(searchField) });
					} else if (_this4.fieldType === "object") {
						_this4.props.appbaseField.forEach(function (field) {
							var tempField = "hit._source." + field;
							if (eval(tempField)) {
								options.push({ value: eval(tempField), label: eval(tempField) });
							}
						});
					}
				});
				if (this.state.currentValue && this.state.currentValue.trim() !== "" && aggs.length) {
					var _options;

					var suggestions = [{
						label: this.state.currentValue,
						markup: this.state.currentValue + " &nbsp;<span class=\"rbc-strong\">in All Categories</span>",
						value: this.state.currentValue
					}, {
						label: this.state.currentValue,
						markup: this.state.currentValue + " &nbsp;<span class=\"rbc-strong\">in " + aggs[0].key + "</span>",
						value: this.state.currentValue + "--rbc1",
						category: aggs[0].key
					}];

					if (aggs.length > 1) {
						suggestions.push({
							label: this.state.currentValue,
							markup: this.state.currentValue + " &nbsp;<span class=\"rbc-strong\">in " + aggs[1].key + "</span>",
							value: this.state.currentValue + "--rbc2",
							category: aggs[1].key
						});
					}
					(_options = options).unshift.apply(_options, suggestions);
				}
				options = this.removeDuplicates(options, "value");
				this.setState({
					options: options,
					isLoadingOptions: false
				});
			}
		}
	}, {
		key: "checkDefault",
		value: function checkDefault() {
			var defaultValue = this.urlParams !== null ? this.urlParams : this.props.defaultSelected;
			if (defaultValue && this.defaultSelected !== defaultValue) {
				this.defaultSelected = defaultValue;
				this.setValue(this.defaultSelected);
				this.handleSearch({
					value: this.defaultSelected
				});
			}
		}

		// When user has selected a search value

	}, {
		key: "handleSearch",
		value: function handleSearch(currentValue) {
			var value = currentValue ? currentValue.value : null;
			var finalVal = { value: value };

			if (currentValue && currentValue.category) {
				finalVal.category = currentValue.category;
				finalVal.value = finalVal.value.slice(0, -6);
			} else {
				finalVal.category = null;
			}

			var obj = {
				key: this.props.componentId,
				value: finalVal
			};

			if (this.props.onValueChange) {
				this.props.onValueChange(obj.value);
			}
			_reactivemaps.AppbaseSensorHelper.URLParams.update(this.props.componentId, finalVal.value, this.props.URLParams);
			_reactivemaps.AppbaseSensorHelper.selectedSensor.set(obj, true);
			this.setState({
				currentValue: value
			});
		}
	}, {
		key: "optionRenderer",
		value: function optionRenderer(option) {
			if (option.markup) {
				return _react2.default.createElement("div", { key: option.value, dangerouslySetInnerHTML: { __html: option.markup } });
			}

			return _react2.default.createElement(
				"div",
				{ key: option.value },
				option.label
			);
		}
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
				"rbc-placeholder-active": this.props.placeholder,
				"rbc-placeholder-inactive": !this.props.placeholder
			});

			return _react2.default.createElement(
				"div",
				{ className: "rbc rbc-categorysearch col s12 col-xs-12 card thumbnail " + cx, style: this.props.componentStyle },
				title,
				_react2.default.createElement(_reactSelect2.default, _extends({
					isLoading: this.state.isLoadingOptions,
					value: this.state.currentValue,
					options: this.state.options,
					onInputChange: this.setValue,
					optionRenderer: this.optionRenderer,
					onChange: this.handleSearch,
					onBlurResetsInput: false
				}, this.props))
			);
		}
	}]);

	return CategorySearch;
}(_react.Component);

exports.default = CategorySearch;


CategorySearch.propTypes = {
	componentId: _react2.default.PropTypes.string.isRequired,
	appbaseField: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.string)]),
	title: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.element]),
	categoryField: _react2.default.PropTypes.string,
	placeholder: _react2.default.PropTypes.string,
	defaultSelected: _react2.default.PropTypes.string,
	customQuery: _react2.default.PropTypes.func,
	react: _react2.default.PropTypes.object,
	onValueChange: _react2.default.PropTypes.func,
	highlight: _react2.default.PropTypes.bool,
	highlightFields: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.string)]),
	componentStyle: _react2.default.PropTypes.object,
	URLParams: _react2.default.PropTypes.bool
};

// Default props value
CategorySearch.defaultProps = {
	placeholder: "Search",
	highlight: false,
	componentStyle: {},
	URLParams: false
};

// context type
CategorySearch.contextTypes = {
	appbaseRef: _react2.default.PropTypes.any.isRequired,
	type: _react2.default.PropTypes.any.isRequired
};

CategorySearch.types = {
	componentId: _reactivemaps.TYPES.STRING,
	appbaseField: _reactivemaps.TYPES.STRING,
	appbaseFieldType: _reactivemaps.TYPES.KEYWORD,
	react: _reactivemaps.TYPES.OBJECT,
	title: _reactivemaps.TYPES.STRING,
	categoryField: _reactivemaps.TYPES.STRING,
	placeholder: _reactivemaps.TYPES.STRING,
	defaultSelected: _reactivemaps.TYPES.STRING,
	customQuery: _reactivemaps.TYPES.FUNCTION,
	highlight: _reactivemaps.TYPES.BOOLEAN,
	URLParams: _reactivemaps.TYPES.BOOLEAN
};