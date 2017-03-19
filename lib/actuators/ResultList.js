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

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-lines: 0 */


var $ = require("jquery");
var _ = require("lodash");

var ResultList = function (_Component) {
	_inherits(ResultList, _Component);

	function ResultList(props) {
		_classCallCheck(this, ResultList);

		var _this = _possibleConstructorReturn(this, (ResultList.__proto__ || Object.getPrototypeOf(ResultList)).call(this, props));

		_this.state = {
			markers: [],
			query: {},
			currentData: [],
			resultMarkup: [],
			isLoading: false,
			queryStart: false,
			resultStats: {
				resultFound: false,
				total: 0,
				took: 0
			},
			showPlaceholder: true,
			showInitialLoader: false
		};
		if (_this.props.sortOptions) {
			var obj = _this.props.sortOptions[0];
			_this.sortObj = _defineProperty({}, obj.appbaseField, {
				order: obj.sortBy
			});
		} else if (_this.props.sortBy) {
			_this.sortObj = _defineProperty({}, _this.props.appbaseField, {
				order: _this.props.sortBy
			});
		}
		_this.resultSortKey = "ResultSort";
		_this.channelId = null;
		_this.channelListener = null;
		_this.queryStartTime = 0;
		_this.handleSortSelect = _this.handleSortSelect.bind(_this);
		_this.nextPage = _this.nextPage.bind(_this);
		_this.appliedQuery = {};
		return _this;
	}

	_createClass(ResultList, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			this.streamProp = this.props.stream;
			this.requestOnScroll = this.props.requestOnScroll;
			this.size = this.props.size;
			this.initialize();
		}
	}, {
		key: "componentWillUpdate",
		value: function componentWillUpdate() {
			var _this2 = this;

			setTimeout(function () {
				if (_this2.streamProp !== _this2.props.stream) {
					_this2.streamProp = _this2.props.stream;
					_this2.removeChannel();
					_this2.initialize(true);
				}
				if (_this2.requestOnScroll !== _this2.props.requestOnScroll) {
					_this2.requestOnScroll = _this2.props.requestOnScroll;
					_this2.listComponent();
				}
				if (_this2.size !== _this2.props.size) {
					_this2.size = _this2.props.size;
					_this2.setState({
						currentData: []
					});
					_this2.removeChannel();
					_this2.initialize(true);
				}
			}, 300);
		}

		// check the height and set scroll if scroll not exists

	}, {
		key: "componentDidUpdate",
		value: function componentDidUpdate() {
			if (!this.state.showPlaceholder) {
				this.applyScroll();
			}
		}

		// stop streaming request and remove listener when component will unmount

	}, {
		key: "componentWillUnmount",
		value: function componentWillUnmount() {
			this.removeChannel();
		}
	}, {
		key: "applyScroll",
		value: function applyScroll() {
			var resultElement = $(".rbc-resultlist-container");
			var scrollElement = $(".rbc-resultlist-scroll-container");
			var padding = 45;

			function checkHeight() {
				var flag = resultElement.get(0).scrollHeight - padding > resultElement.height();
				var scrollFlag = scrollElement.get(0).scrollHeight > scrollElement.height();
				if (!flag && !scrollFlag && scrollElement.length) {
					scrollElement.css("height", resultElement.height() - 100);
				}
			}

			if (resultElement && resultElement.length && scrollElement && scrollElement.length) {
				scrollElement.css("height", "auto");
				setTimeout(checkHeight, 1000);
			}
		}
	}, {
		key: "removeChannel",
		value: function removeChannel() {
			if (this.channelId) {
				_reactivemaps.AppbaseChannelManager.stopStream(this.channelId);
				this.channelId = null;
			}
			if (this.channelListener) {
				this.channelListener.remove();
			}
			if (this.loadListener) {
				this.loadListener.remove();
			}
		}

		// Create a channel which passes the react and receive results whenever react changes

	}, {
		key: "createChannel",
		value: function createChannel() {
			var _this3 = this;

			var executeChannel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

			// Set the react - add self aggs query as well with react
			var react = this.props.react ? this.props.react : {};
			if (react && react.and) {
				if (typeof react.and === "string") {
					react.and = [react.and];
				}
			} else {
				react.and = [];
			}
			react.and.push("streamChanges");
			if (this.sortObj) {
				this.enableSort(react);
			}
			// create a channel and listen the changes
			var channelObj = _reactivemaps.AppbaseChannelManager.create(this.context.appbaseRef, this.context.type, react, this.props.size, this.props.from, this.props.stream);
			this.channelId = channelObj.channelId;

			this.channelListener = channelObj.emitter.addListener(channelObj.channelId, function (res) {
				// implementation to prevent initialize query issue if old query response is late then the newer query
				// then we will consider the response of new query and prevent to apply changes for old query response.
				// if queryStartTime of channel response is greater than the previous one only then apply changes
				if (res.error && res.startTime > _this3.queryStartTime) {
					_this3.setState({
						queryStart: false,
						showPlaceholder: false
					});
					// if (this.props.onData) {
					// 	const modifiedData = helper.prepareResultData(res);
					// 	this.props.onData(modifiedData.res, modifiedData.err);
					// }
				}
				if (res.appliedQuery) {
					if (res.mode === "historic" && res.startTime > _this3.queryStartTime) {
						var visibleNoResults = res.appliedQuery && res.data && !res.data.error ? !(res.data.hits && res.data.hits.total) : false;
						var resultStats = {
							resultFound: !!(res.appliedQuery && res.data && !res.data.error && res.data.hits && res.data.hits.total)
						};
						if (res.appliedQuery && res.data && !res.data.error) {
							resultStats.total = res.data.hits.total;
							resultStats.took = res.data.took;
						}
						_this3.setState({
							queryStart: false,
							visibleNoResults: visibleNoResults,
							resultStats: resultStats,
							showPlaceholder: false
						});
						_this3.afterChannelResponse(res);
					} else if (res.mode === "streaming") {
						_this3.afterChannelResponse(res);
						_this3.updateResultStats(res.data);
					}
				} else {
					_this3.setState({
						showPlaceholder: true
					});
				}
			});
			this.listenLoadingChannel(channelObj);
			if (executeChannel) {
				setTimeout(function () {
					var obj = {
						key: "streamChanges",
						value: ""
					};
					_reactivemaps.AppbaseSensorHelper.selectedSensor.set(obj, true);
				}, 100);
			}
		}
	}, {
		key: "updateResultStats",
		value: function updateResultStats(newData) {
			var resultStats = this.state.resultStats;
			resultStats.total = _reactivemaps.AppbaseSensorHelper.updateStats(resultStats.total, newData);
			this.setState({
				resultStats: resultStats
			});
		}
	}, {
		key: "listenLoadingChannel",
		value: function listenLoadingChannel(channelObj) {
			var _this4 = this;

			this.loadListener = channelObj.emitter.addListener(channelObj.channelId + "-query", function (res) {
				if (res.appliedQuery) {
					var showInitialLoader = !(_this4.props.requestOnScroll && res.appliedQuery.body && res.appliedQuery.body.from);
					_this4.setState({
						queryStart: res.queryState,
						showInitialLoader: showInitialLoader
					});
				}
			});
		}
	}, {
		key: "afterChannelResponse",
		value: function afterChannelResponse(res) {
			var _this5 = this;

			var data = res.data;
			var rawData = void 0,
			    markersData = void 0,
			    newData = [],
			    currentData = [];
			this.streamFlag = false;
			if (res.mode === "streaming") {
				this.channelMethod = "streaming";
				newData = data;
				newData.stream = true;
				currentData = this.state.currentData;
				this.streamFlag = true;
				markersData = this.setMarkersData(rawData);
			} else if (res.mode === "historic") {
				this.queryStartTime = res.startTime;
				this.channelMethod = "historic";
				newData = data.hits && data.hits.hits ? data.hits.hits : [];
				var normalizeCurrentData = this.normalizeCurrentData(res, this.state.currentData, newData);
				newData = normalizeCurrentData.newData;
				currentData = normalizeCurrentData.currentData;
			}
			this.setState({
				rawData: rawData,
				newData: newData,
				currentData: currentData,
				markersData: markersData,
				isLoading: false
			}, function () {
				// Pass the historic or streaming data in index method
				res.allMarkers = rawData;
				var modifiedData = JSON.parse(JSON.stringify(res));
				modifiedData.newData = _this5.state.newData;
				modifiedData.currentData = _this5.state.currentData;
				delete modifiedData.data;
				modifiedData = _reactivemaps.AppbaseSensorHelper.prepareResultData(modifiedData, data);
				_this5.setState({
					resultMarkup: _this5.cardMarkup(modifiedData.res),
					currentData: _this5.combineCurrentData(newData)
				});
			});
		}
	}, {
		key: "cardMarkup",
		value: function cardMarkup(res) {
			var _this6 = this;

			var markup = null;
			var data = res.currentData.concat(res.newData);
			markup = data.map(function (item) {
				var result = _this6.props.onData(item._source);
				return _react2.default.createElement(
					"a",
					{
						key: item._id,
						className: "rbc-resultlist clearfix",
						href: result.url,
						rel: "noopener noreferrer"
					},
					_react2.default.createElement("div", { className: "rbc-resultlist__image", style: { backgroundImage: "url(" + result.image + ")" } }),
					_react2.default.createElement(
						"div",
						{ className: "rbc-resultlist__title" },
						result.title
					),
					_react2.default.createElement(
						"div",
						{ className: "rbc-resultlist__desc" },
						result.desc
					),
					result.rating ? _react2.default.createElement(
						"div",
						{ className: "rbc-resultlist__rating" },
						_react2.default.createElement(_reactStars2.default, {
							count: 5,
							value: result.rating,
							size: 15,
							color1: "#bbb",
							edit: false,
							color2: "#ffd700"
						})
					) : ""
				);
			});
			return markup;
		}

		// normalize current data

	}, {
		key: "normalizeCurrentData",
		value: function normalizeCurrentData(res, rawData, newData) {
			var appliedQuery = JSON.parse(JSON.stringify(res.appliedQuery));
			if (this.props.requestOnScroll && appliedQuery && appliedQuery.body) {
				delete appliedQuery.body.from;
				delete appliedQuery.body.size;
			}
			var isSameQuery = JSON.stringify(appliedQuery) === JSON.stringify(this.appliedQuery);
			var currentData = isSameQuery ? rawData || [] : [];
			if (!currentData.length) {
				this.appliedQuery = appliedQuery;
			} else {
				newData = newData.filter(function (newRecord) {
					var notExits = true;
					currentData.forEach(function (oldRecord) {
						if (newRecord._id + "-" + newRecord._type === oldRecord._id + "-" + oldRecord._type) {
							notExits = false;
						}
					});
					return notExits;
				});
			}
			if (!isSameQuery) {
				$(".rbc-resultlist-container").animate({
					scrollTop: 0
				}, 100);
			}
			return {
				currentData: currentData,
				newData: newData
			};
		}
	}, {
		key: "combineCurrentData",
		value: function combineCurrentData(newData) {
			if (_.isArray(newData)) {
				newData = newData.map(function (item) {
					item.stream = false;
					return item;
				});
				return this.state.currentData.concat(newData);
			}
			return this.streamDataModify(this.state.currentData, newData, false);
		}

		// enable sort

	}, {
		key: "enableSort",
		value: function enableSort(react) {
			react.and.push(this.resultSortKey);
			var sortObj = {
				key: this.resultSortKey,
				value: this.sortObj
			};
			_reactivemaps.AppbaseSensorHelper.selectedSensor.setSortInfo(sortObj);
		}

		// append data if pagination is applied

	}, {
		key: "appendData",
		value: function appendData(data) {
			var rawData = this.state.rawData;
			var hits = rawData.hits.hits.concat(data.hits.hits);
			rawData.hits.hits = _.uniqBy(hits, "_id");
			return rawData;
		}

		// append stream boolean flag and also start time of stream

	}, {
		key: "streamDataModify",
		value: function streamDataModify(rawData, data) {
			var streamFlag = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

			if (data) {
				data.stream = streamFlag;
				data.streamStart = new Date();
				if (data._deleted) {
					var hits = rawData.filter(function (hit) {
						return hit._id !== data._id;
					});
					rawData = hits;
				} else {
					var _hits = rawData.filter(function (hit) {
						return hit._id !== data._id;
					});
					rawData = _hits;
					rawData.unshift(data);
				}
			}
			return rawData;
		}

		// tranform the raw data to marker data

	}, {
		key: "setMarkersData",
		value: function setMarkersData(hits) {
			if (hits) {
				return hits;
			}
			return [];
		}
	}, {
		key: "initialize",
		value: function initialize() {
			var executeChannel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

			this.createChannel(executeChannel);
			if (this.props.requestOnScroll) {
				this.listComponent();
			}
		}
	}, {
		key: "nextPage",
		value: function nextPage() {
			function start() {
				this.setState({
					isLoading: true
				});
				_reactivemaps.AppbaseChannelManager.nextPage(this.channelId);
			}

			if (this.state.resultStats.total > this.state.currentData.length && !this.state.queryStart) {
				start.call(this);
			}
		}
	}, {
		key: "listComponent",
		value: function listComponent() {
			function setScroll(node) {
				var _this7 = this;

				if (node) {
					node.addEventListener("scroll", function () {
						if (_this7.props.requestOnScroll && $(node).scrollTop() + $(node).innerHeight() >= node.scrollHeight && _this7.state.resultStats.total > _this7.state.currentData.length && !_this7.state.queryStart) {
							_this7.nextPage();
						}
					});
				}
			}

			setScroll.call(this, this.listParentElement);
			setScroll.call(this, this.listChildElement);
		}
	}, {
		key: "handleSortSelect",
		value: function handleSortSelect(event) {
			var index = event.target.value;
			this.sortObj = _defineProperty({}, this.props.sortOptions[index].appbaseField, {
				order: this.props.sortOptions[index].sortBy
			});
			var obj = {
				key: this.resultSortKey,
				value: this.sortObj
			};
			_reactivemaps.AppbaseSensorHelper.selectedSensor.set(obj, true, "sortChange");
		}
	}, {
		key: "render",
		value: function render() {
			var _this8 = this;

			var title = null,
			    placeholder = null,
			    sortOptions = null;
			var cx = (0, _classnames2.default)({
				"rbc-title-active": this.props.title,
				"rbc-title-inactive": !this.props.title,
				"rbc-sort-active": this.props.sortOptions,
				"rbc-sort-inactive": !this.props.sortOptions,
				"rbc-stream-active": this.props.stream,
				"rbc-stream-inactive": !this.props.stream,
				"rbc-placeholder-active": this.props.placeholder,
				"rbc-placeholder-inactive": !this.props.placeholder,
				"rbc-initialloader-active": this.props.initialLoader,
				"rbc-initialloader-inactive": !this.props.initialLoader,
				"rbc-resultstats-active": this.props.showResultStats,
				"rbc-resultstats-inactive": !this.props.showResultStats,
				"rbc-noresults-active": this.props.noResults,
				"rbc-noresults-inactive": !this.props.noResults
			});

			if (this.props.title) {
				title = _react2.default.createElement(
					"h4",
					{ className: "rbc-title col s12 col-xs-12" },
					this.props.title
				);
			}
			if (this.props.placeholder) {
				placeholder = _react2.default.createElement(
					"div",
					{ className: "rbc-placeholder col s12 col-xs-12" },
					this.props.placeholder
				);
			}

			if (this.props.sortOptions) {
				var options = this.props.sortOptions.map(function (item, index) {
					return _react2.default.createElement(
						"option",
						{ value: index, key: item.label },
						item.label
					);
				});

				sortOptions = _react2.default.createElement(
					"div",
					{ className: "rbc-sortoptions input-field col" },
					_react2.default.createElement(
						"select",
						{ className: "browser-default form-control", onChange: this.handleSortSelect },
						options
					)
				);
			}

			return _react2.default.createElement(
				"div",
				{ className: "rbc rbc-resultlist-wrapper" },
				_react2.default.createElement(
					"div",
					{ ref: function ref(div) {
							_this8.listParentElement = div;
						}, className: "rbc-resultlist-container card thumbnail " + cx, style: this.props.componentStyle },
					title,
					sortOptions,
					this.props.showResultStats && this.state.resultStats.resultFound ? _react2.default.createElement(_reactivemaps.ResultStats, { onResultStats: this.props.onResultStats, took: this.state.resultStats.took, total: this.state.resultStats.total }) : null,
					_react2.default.createElement(
						"div",
						{ ref: function ref(div) {
								_this8.listChildElement = div;
							}, className: "rbc-resultlist-scroll-container col s12 col-xs-12" },
						this.state.resultMarkup
					),
					this.state.isLoading ? _react2.default.createElement("div", { className: "rbc-loader" }) : null,
					this.state.showPlaceholder ? placeholder : null
				),
				this.props.noResults && this.state.visibleNoResults ? _react2.default.createElement(_reactivemaps.NoResults, { defaultText: this.props.noResults }) : null,
				this.props.initialLoader && this.state.queryStart && this.state.showInitialLoader ? _react2.default.createElement(_reactivemaps.InitialLoader, { defaultText: this.props.initialLoader }) : null,
				_react2.default.createElement(_reactivemaps.PoweredBy, null)
			);
		}
	}]);

	return ResultList;
}(_react.Component);

exports.default = ResultList;


ResultList.propTypes = {
	componentId: _react2.default.PropTypes.string,
	appbaseField: _react2.default.PropTypes.string,
	title: _react2.default.PropTypes.string,
	sortBy: _react2.default.PropTypes.oneOf(["asc", "desc", "default"]),
	sortOptions: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.shape({
		label: _react2.default.PropTypes.string,
		appbaseField: _react2.default.PropTypes.string,
		sortBy: _react2.default.PropTypes.string
	})),
	from: _reactivemaps.AppbaseSensorHelper.validation.resultListFrom,
	onData: _react2.default.PropTypes.func,
	size: _reactivemaps.AppbaseSensorHelper.sizeValidation,
	requestOnScroll: _react2.default.PropTypes.bool,
	stream: _react2.default.PropTypes.bool,
	componentStyle: _react2.default.PropTypes.object,
	initialLoader: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.element]),
	noResults: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.element]),
	showResultStats: _react2.default.PropTypes.bool,
	onResultStats: _react2.default.PropTypes.func,
	placeholder: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.element]),
	react: _react2.default.PropTypes.object
};

ResultList.defaultProps = {
	from: 0,
	size: 20,
	requestOnScroll: true,
	stream: false,
	componentStyle: {},
	showResultStats: true
};

ResultList.contextTypes = {
	appbaseRef: _react2.default.PropTypes.any.isRequired,
	type: _react2.default.PropTypes.any.isRequired
};

ResultList.types = {
	componentId: _reactivemaps.TYPES.STRING,
	appbaseField: _reactivemaps.TYPES.STRING,
	title: _reactivemaps.TYPES.STRING,
	react: _reactivemaps.TYPES.OBJECT,
	sortBy: _reactivemaps.TYPES.STRING,
	sortOptions: _reactivemaps.TYPES.OBJECT,
	from: _reactivemaps.TYPES.NUMBER,
	onData: _reactivemaps.TYPES.FUNCTION,
	size: _reactivemaps.TYPES.NUMBER,
	requestOnScroll: _reactivemaps.TYPES.BOOLEAN,
	stream: _reactivemaps.TYPES.BOOLEAN,
	componentStyle: _reactivemaps.TYPES.OBJECT,
	initialLoader: _reactivemaps.TYPES.STRING,
	noResults: _reactivemaps.TYPES.FUNC,
	showResultStats: _reactivemaps.TYPES.BOOLEAN,
	onResultStats: _reactivemaps.TYPES.FUNCTION,
	placeholder: _reactivemaps.TYPES.STRING
};