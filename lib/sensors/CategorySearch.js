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

var _reactAutosuggest = require("react-autosuggest");

var _reactAutosuggest2 = _interopRequireDefault(_reactAutosuggest);

var _reactivemaps = require("@appbaseio/reactivemaps");

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

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
			currentValue: {
				label: null,
				value: null
			},
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
		_this.fieldType = _typeof(props.dataField);
		_this.handleSearch = _this.handleSearch.bind(_this);
		_this.optionRenderer = _this.optionRenderer.bind(_this);
		_this.setValue = _this.setValue.bind(_this);
		_this.defaultSearchQuery = _this.defaultSearchQuery.bind(_this);
		_this.previousSelectedSensor = {};
		_this.clearSuggestions = _this.clearSuggestions.bind(_this);
		_this.onSuggestionSelected = _this.onSuggestionSelected.bind(_this);
		_this.getSuggestionValue = _this.getSuggestionValue.bind(_this);
		_this.onInputChange = _this.onInputChange.bind(_this);
		_this.handleBlur = _this.handleBlur.bind(_this);
		_this.handleKeyPress = _this.handleKeyPress.bind(_this);
		_this.handleInputChange = _this.handleInputChange.bind(_this);
		_this.renderSuggestion = _this.renderSuggestion.bind(_this);
		return _this;
	}

	// Get the items from Appbase when component is mounted


	_createClass(CategorySearch, [{
		key: "componentWillMount",
		value: function componentWillMount() {
			this.setReact(this.props);
			this.setQueryInfo(this.props);
			this.createChannel();
			this.checkDefault();
			this.listenFilter();
		}
	}, {
		key: "componentWillReceiveProps",
		value: function componentWillReceiveProps(nextProps) {
			if (!_lodash2.default.isEqual(this.props.react, nextProps.react)) {
				this.setReact(nextProps);
				_reactivemaps.AppbaseChannelManager.update(this.channelId, this.react, nextProps.size, 0, false);
			}

			if (this.props.highlight !== nextProps.highlight) {
				this.setQueryInfo(nextProps);
				this.handleSearch({
					value: this.state.currentValue.label
				});
			}
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
					_this2.defaultValue = "";
					_this2.changeValue(_this2.defaultValue);
				}
			});
		}
	}, {
		key: "highlightQuery",
		value: function highlightQuery(props) {
			var fields = {};
			var highlightFields = props.highlightFields ? props.highlightFields : props.dataField;
			if (typeof highlightFields === "string") {
				fields[highlightFields] = {};
			} else if (Array.isArray(highlightFields)) {
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
		value: function setQueryInfo(props) {
			var obj = {
				key: props.componentId,
				value: {
					queryType: this.type,
					inputData: props.dataField,
					customQuery: props.customQuery ? props.customQuery : this.defaultSearchQuery,
					reactiveId: this.context.reactiveId,
					showFilter: props.showFilter,
					filterLabel: props.filterLabel ? props.filterLabel : props.componentId,
					component: "CategorySearch",
					defaultSelected: this.urlParams !== null ? this.urlParams : props.defaultSelected
				}
			};
			if (props.highlight) {
				obj.value.externalQuery = this.highlightQuery(props);
			}
			_reactivemaps.AppbaseSensorHelper.selectedSensor.setSensorInfo(obj);
			var searchObj = {
				key: this.searchInputId,
				value: {
					queryType: "multi_match",
					inputData: props.dataField,
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
				value: value === null ? null : { value: value }
			};
			_reactivemaps.AppbaseSensorHelper.selectedSensor.set(obj, true);

			if (value && value.trim() !== "") {
				this.setState({
					options: [{
						label: value,
						value: value
					}],
					isLoadingOptions: true,
					currentValue: {
						label: value,
						value: value
					}
				});
			} else {
				this.setState({
					options: [],
					isLoadingOptions: false,
					currentValue: {
						label: value,
						value: value
					}
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
			var _this3 = this;

			if (input && input.value) {
				var query = [];
				var dataFields = this.fieldType === "string" ? [this.props.dataField] : this.props.dataField;
				var fields = dataFields.map(function (field, index) {
					return "" + field + (Array.isArray(_this3.props.weights) && _this3.props.weights[index] ? "^" + _this3.props.weights[index] : "");
				});

				if (this.props.queryFormat === "and") {
					query = [{
						multi_match: {
							query: input.value,
							fields: fields,
							type: "cross_fields",
							operator: "and",
							fuzziness: this.props.fuzziness ? this.props.fuzziness : 0
						}
					}, {
						multi_match: {
							query: input.value,
							fields: fields,
							type: "phrase_prefix",
							operator: "and"
						}
					}];
				} else {
					query = [{
						multi_match: {
							query: input.value,
							fields: fields,
							type: "best_fields",
							operator: "or",
							fuzziness: this.props.fuzziness ? this.props.fuzziness : 0
						}
					}, {
						multi_match: {
							query: input.value,
							fields: fields,
							type: "phrase_prefix",
							operator: "or"
						}
					}];
				}

				if (input.category && input.category !== null) {
					query = {
						bool: {
							should: query,
							minimum_should_match: 1
						}
					};
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
	}, {
		key: "setReact",
		value: function setReact(props) {
			var react = Object.assign({}, props.react);
			react.aggs = {
				key: props.categoryField
			};
			var reactAnd = [this.searchInputId];
			this.react = _reactivemaps.AppbaseSensorHelper.setupReact(react, reactAnd);
		}

		// Create a channel which passes the react and receive results whenever react changes

	}, {
		key: "createChannel",
		value: function createChannel() {
			var _this4 = this;

			var channelObj = _reactivemaps.AppbaseChannelManager.create(this.context.appbaseRef, this.context.type, this.react, 100, 0, false, this.props.componentId);
			this.channelId = channelObj.channelId;
			this.channelListener = channelObj.emitter.addListener(channelObj.channelId, function (res) {
				var data = res.data;
				var rawData = void 0;
				if (res.mode === "streaming") {
					rawData = _this4.state.rawData;
					rawData.hits.hits.push(res.data);
				} else if (res.mode === "historic") {
					rawData = data;
				}
				_this4.setState({
					rawData: rawData
				});
				_this4.setData(rawData, res.appliedQuery.body.query);
			});
			this.listenLoadingChannel(channelObj);
		}
	}, {
		key: "listenLoadingChannel",
		value: function listenLoadingChannel(channelObj) {
			var _this5 = this;

			this.loadListener = channelObj.emitter.addListener(channelObj.channelId + "-query", function (res) {
				if (res.appliedQuery) {
					_this5.setState({
						queryStart: res.queryState
					});
				}
			});
		}
	}, {
		key: "onInputChange",
		value: function onInputChange(event, _ref) {
			var method = _ref.method,
			    newValue = _ref.newValue;

			if (method === "type") {
				this.setValue(newValue);
			}
		}
	}, {
		key: "setData",
		value: function setData(data, loadSuggestions) {
			var _this6 = this;

			var aggs = [];
			var options = [];
			var searchField = null;
			if (data && data.aggregations && data.aggregations[this.props.categoryField] && data.aggregations[this.props.categoryField].buckets) {
				aggs = data.aggregations[this.props.categoryField].buckets.slice(0, 2);
			}

			if (loadSuggestions) {
				data.hits.hits.forEach(function (hit) {
					if (_this6.fieldType === "string") {
						var _searchField = hit._source[_this6.props.dataField].trim();
						options.push({ value: _searchField, label: _searchField });
					} else if (_this6.fieldType === "object") {
						_this6.props.dataField.forEach(function (field) {
							var tempField = hit._source[field];
							if (tempField) {
								options.push({ value: tempField, label: tempField });
							}
						});
					}
				});
				if (this.state.currentValue.value && this.state.currentValue.value.trim() !== "" && aggs.length) {
					var _options;

					var suggestions = [{
						label: this.state.currentValue.label,
						markup: this.state.currentValue.label + " &nbsp;<span class=\"rbc-strong\">in All Categories</span>",
						value: this.state.currentValue.value
					}, {
						label: this.state.currentValue.label,
						markup: this.state.currentValue.label + " &nbsp;<span class=\"rbc-strong\">in " + aggs[0].key + "</span>",
						value: this.state.currentValue.value + "--rbc1",
						category: aggs[0].key
					}];

					if (aggs.length > 1) {
						suggestions.push({
							label: this.state.currentValue.label,
							markup: this.state.currentValue.label + " &nbsp;<span class=\"rbc-strong\">in " + aggs[1].key + "</span>",
							value: this.state.currentValue.value + "--rbc2",
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
		key: "clearSuggestions",
		value: function clearSuggestions() {
			this.setState({
				options: []
			});
		}
	}, {
		key: "onSuggestionSelected",
		value: function onSuggestionSelected(event, _ref2) {
			var suggestion = _ref2.suggestion;

			this.handleSearch(suggestion);
		}
	}, {
		key: "getSuggestionValue",
		value: function getSuggestionValue(suggestion) {
			return suggestion.label;
		}
	}, {
		key: "checkDefault",
		value: function checkDefault() {
			var defaultValue = this.urlParams !== null ? this.urlParams : this.props.defaultSelected;
			this.changeValue(defaultValue);
		}
	}, {
		key: "changeValue",
		value: function changeValue(defaultValue) {
			if (this.defaultSelected !== defaultValue) {
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
			var _this7 = this;

			var value = currentValue ? currentValue.value : null;
			var finalVal = value ? { value: value } : null;

			if (currentValue && currentValue.category) {
				finalVal.category = currentValue.category;
				finalVal.value = finalVal.value.slice(0, -6);
			} else {
				if (finalVal) {
					finalVal.category = null;
				}
			}

			var obj = {
				key: this.props.componentId,
				value: finalVal
			};

			var execQuery = function execQuery() {
				if (_this7.props.onValueChange) {
					_this7.props.onValueChange(obj.value);
				}
				_reactivemaps.AppbaseSensorHelper.URLParams.update(_this7.props.componentId, finalVal ? finalVal.value : null, _this7.props.URLParams);
				_reactivemaps.AppbaseSensorHelper.selectedSensor.set(obj, true);
			};

			if (this.props.beforeValueChange) {
				this.props.beforeValueChange(obj.value).then(function () {
					execQuery();
				}).catch(function (e) {
					console.warn(_this7.props.componentId + " - beforeValueChange rejected the promise with", e);
				});
			} else {
				execQuery();
			}

			this.setState({
				currentValue: {
					label: finalVal ? finalVal.value : null,
					value: value
				}
			});
		}
	}, {
		key: "handleBlur",
		value: function handleBlur(event, _ref3) {
			var highlightedSuggestion = _ref3.highlightedSuggestion;

			if (!highlightedSuggestion || !highlightedSuggestion.label) {
				this.handleSearch({
					value: this.state.currentValue.label
				});
			}
			if (this.props.onBlur) this.props.onBlur(event);
		}
	}, {
		key: "handleKeyPress",
		value: function handleKeyPress(event) {
			if (event.key === "Enter") {
				event.target.blur();
			}
			if (this.props.onKeyPress) {
				this.props.onKeyPress(event);
			}
		}
	}, {
		key: "handleInputChange",
		value: function handleInputChange(event) {
			var inputVal = event.target.value;
			this.setState({
				currentValue: {
					label: inputVal,
					value: inputVal
				}
			});
			if (inputVal) {
				this.handleSearch({
					value: inputVal
				});
			}
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
		key: "renderSuggestion",
		value: function renderSuggestion(suggestion) {
			return this.optionRenderer(suggestion);
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
				"rbc-placeholder-inactive": !this.props.placeholder,
				"rbc-autoSuggest-active": this.props.autoSuggest,
				"rbc-autoSuggest-inactive": !this.props.autoSuggest
			}, this.props.className);

			var options = this.state.currentValue.label === "" || this.state.currentValue.label === null ? this.props.initialSuggestions && this.props.initialSuggestions.length ? this.props.initialSuggestions : [] : this.state.options;

			return _react2.default.createElement(
				"div",
				{ className: "rbc rbc-categorysearch col s12 col-xs-12 card thumbnail " + cx + " " + (this.state.isLoadingOptions ? "is-loading" : ""), style: this.props.style },
				title,
				this.props.autoSuggest ? _react2.default.createElement(_reactAutosuggest2.default, {
					suggestions: options,
					onSuggestionsFetchRequested: function onSuggestionsFetchRequested() {},
					onSuggestionsClearRequested: function onSuggestionsClearRequested() {},
					onSuggestionSelected: this.onSuggestionSelected,
					getSuggestionValue: this.getSuggestionValue,
					renderSuggestion: this.renderSuggestion,
					shouldRenderSuggestions: function shouldRenderSuggestions() {
						return true;
					},
					focusInputOnSuggestionClick: false,
					inputProps: {
						placeholder: this.props.placeholder,
						value: this.state.currentValue.label ? this.state.currentValue.label : "",
						onChange: this.onInputChange,
						onBlur: this.handleBlur,
						onKeyPress: this.handleKeyPress,
						onFocus: this.props.onFocus,
						onKeyDown: this.props.onKeyDown,
						onKeyUp: this.props.onKeyUp
					}
				}) : _react2.default.createElement(
					"div",
					{ className: "rbc-search-container col s12 col-xs-12" },
					_react2.default.createElement("input", {
						type: "text",
						className: "rbc-input",
						placeholder: this.props.placeholder,
						value: this.state.currentValue.label ? this.state.currentValue.label : "",
						onChange: this.handleInputChange,
						onBlur: this.props.onBlur,
						onFocus: this.props.onFocus,
						onKeyPress: this.props.onKeyPress,
						onKeyDown: this.props.onKeyDown,
						onKeyUp: this.props.onKeyUp
					}),
					_react2.default.createElement("span", { className: "rbc-search-icon" })
				)
			);
		}
	}]);

	return CategorySearch;
}(_react.Component);

exports.default = CategorySearch;


CategorySearch.propTypes = {
	componentId: _react2.default.PropTypes.string.isRequired,
	dataField: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.string)]),
	weights: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.number),
	title: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.element]),
	categoryField: _react2.default.PropTypes.string,
	placeholder: _react2.default.PropTypes.string,
	autoSuggest: _react2.default.PropTypes.bool,
	defaultSelected: _react2.default.PropTypes.string,
	customQuery: _react2.default.PropTypes.func,
	react: _react2.default.PropTypes.object,
	beforeValueChange: _react2.default.PropTypes.func,
	onValueChange: _react2.default.PropTypes.func,
	highlight: _react2.default.PropTypes.bool,
	initialSuggestions: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.shape({
		label: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.element]),
		value: _react2.default.PropTypes.string
	})),
	highlightFields: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.string)]),
	style: _react2.default.PropTypes.object,
	URLParams: _react2.default.PropTypes.bool,
	showFilter: _react2.default.PropTypes.bool,
	filterLabel: _react2.default.PropTypes.string,
	queryFormat: _react2.default.PropTypes.oneOf(["and", "or"]),
	fuzziness: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number]),
	className: _react2.default.PropTypes.string,
	onBlur: _react2.default.PropTypes.func,
	onFocus: _react2.default.PropTypes.func,
	onKeyPress: _react2.default.PropTypes.func,
	onKeyDown: _react2.default.PropTypes.func,
	onKeyUp: _react2.default.PropTypes.func
};

// Default props value
CategorySearch.defaultProps = {
	placeholder: "Search",
	autoSuggest: true,
	highlight: false,
	style: {},
	URLParams: false,
	showFilter: true,
	queryFormat: "or"
};

// context type
CategorySearch.contextTypes = {
	appbaseRef: _react2.default.PropTypes.any.isRequired,
	type: _react2.default.PropTypes.any.isRequired,
	reactiveId: _react2.default.PropTypes.number
};

CategorySearch.types = {
	componentId: _reactivemaps.TYPES.STRING,
	dataField: _reactivemaps.TYPES.STRING,
	dataFieldType: _reactivemaps.TYPES.KEYWORD,
	react: _reactivemaps.TYPES.OBJECT,
	title: _reactivemaps.TYPES.STRING,
	categoryField: _reactivemaps.TYPES.STRING,
	placeholder: _reactivemaps.TYPES.STRING,
	autoSuggest: _reactivemaps.TYPES.BOOLEAN,
	defaultSelected: _reactivemaps.TYPES.STRING,
	customQuery: _reactivemaps.TYPES.FUNCTION,
	highlight: _reactivemaps.TYPES.BOOLEAN,
	URLParams: _reactivemaps.TYPES.BOOLEAN,
	showFilter: _reactivemaps.TYPES.BOOLEAN,
	filterLabel: _reactivemaps.TYPES.STRING,
	weights: _reactivemaps.TYPES.ARRAY,
	queryFormat: _reactivemaps.TYPES.STRING,
	fuzziness: _reactivemaps.TYPES.NUMBER,
	className: _reactivemaps.TYPES.STRING,
	onBlur: _reactivemaps.TYPES.FUNCTION,
	onFocus: _reactivemaps.TYPES.FUNCTION,
	onKeyPress: _reactivemaps.TYPES.FUNCTION,
	onKeyDown: _reactivemaps.TYPES.FUNCTION,
	onKeyUp: _reactivemaps.TYPES.FUNCTION
};