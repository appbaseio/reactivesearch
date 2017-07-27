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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Pagination = function (_Component) {
	_inherits(Pagination, _Component);

	function Pagination(props, context) {
		_classCallCheck(this, Pagination);

		var _this = _possibleConstructorReturn(this, (Pagination.__proto__ || Object.getPrototypeOf(Pagination)).call(this, props));

		_this.state = {
			currentValue: 1,
			maxPageNumber: 1
		};
		_this.handleChange = _this.handleChange.bind(_this);
		_this.prePage = _this.prePage.bind(_this);
		_this.nextPage = _this.nextPage.bind(_this);
		_this.firstPage = _this.firstPage.bind(_this);
		_this.lastPage = _this.lastPage.bind(_this);
		return _this;
	}

	// Set query information


	_createClass(Pagination, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			this.setQueryInfo();
			this.listenGlobal();
		}

		// stop streaming request and remove listener when component will unmount

	}, {
		key: "componentWillUnmount",
		value: function componentWillUnmount() {
			if (this.globalListener) {
				this.globalListener.remove();
			}
		}

		// set the query type and input data

	}, {
		key: "setQueryInfo",
		value: function setQueryInfo() {
			var obj = {
				key: this.props.componentId,
				value: this.state.currentValue
			};
			_reactivemaps.AppbaseSensorHelper.selectedSensor.setPaginationInfo(obj);
		}

		// listen all results

	}, {
		key: "listenGlobal",
		value: function listenGlobal() {
			var _this2 = this;

			this.globalListener = _reactivemaps.AppbaseChannelManager.emitter.addListener("global", function (res) {
				if (res.react && Object.keys(res.react).indexOf(_this2.props.componentId) > -1) {
					var totalHits = res.channelResponse && res.channelResponse.data && res.channelResponse.data.hits ? res.channelResponse.data.hits.total : 0;
					var maxPageNumber = Math.ceil(totalHits / res.queryOptions.size) < 1 ? 1 : Math.ceil(totalHits / res.queryOptions.size);
					var size = res.queryOptions.size ? res.queryOptions.size : 20;
					var currentPage = Math.floor(res.queryOptions.from / size) + 1;
					if (currentPage > maxPageNumber) {
						_this2.handleChange(1);
					} else {
						_this2.setState({
							totalHits: totalHits,
							size: size,
							maxPageNumber: maxPageNumber,
							currentValue: currentPage
						});
					}
				}
			});
		}

		// handle the input change and pass the value inside sensor info

	}, {
		key: "handleChange",
		value: function handleChange(inputVal) {
			this.setState({
				currentValue: inputVal
			});
			var obj = {
				key: this.props.componentId,
				value: inputVal
			};

			// pass the selected sensor value with componentId as key,
			var isExecuteQuery = true;
			_reactivemaps.AppbaseSensorHelper.selectedSensor.set(obj, isExecuteQuery, "paginationChange");
			if (this.props.onPageChange) {
				this.props.onPageChange(inputVal);
			}
		}

		// first page

	}, {
		key: "firstPage",
		value: function firstPage() {
			if (this.state.currentValue !== 1) {
				this.handleChange.call(this, 1);
			}
		}

		// last page

	}, {
		key: "lastPage",
		value: function lastPage() {
			if (this.state.currentValue !== this.state.maxPageNumber) {
				this.handleChange.call(this, this.state.maxPageNumber);
			}
		}

		// pre page

	}, {
		key: "prePage",
		value: function prePage() {
			var currentValue = this.state.currentValue > 1 ? this.state.currentValue - 1 : 1;
			if (this.state.currentValue !== currentValue) {
				this.handleChange.call(this, currentValue);
			}
		}

		// next page

	}, {
		key: "nextPage",
		value: function nextPage() {
			var currentValue = this.state.currentValue < this.state.maxPageNumber ? this.state.currentValue + 1 : this.state.maxPageNumber;
			if (this.state.currentValue !== currentValue) {
				this.handleChange.call(this, currentValue);
			}
		}
	}, {
		key: "getStart",
		value: function getStart() {
			var midValue = parseInt(this.props.pages / 2, 10);
			var start = this.state.currentValue - midValue;
			return start > 1 ? start : 1;
		}
	}, {
		key: "renderPageNumber",
		value: function renderPageNumber() {
			var _this3 = this;

			var start = this.getStart(),
			    numbers = [];

			var _loop = function _loop(i) {
				var singleItem = _react2.default.createElement(
					"li",
					{ key: i, className: "rbc-page-number " + (_this3.state.currentValue === i ? "active rbc-pagination-active" : "waves-effect") },
					_react2.default.createElement(
						"a",
						{ onClick: function onClick() {
								return _this3.handleChange(i);
							} },
						i
					)
				);
				if (i <= _this3.state.maxPageNumber) {
					numbers.push(singleItem);
				}
			};

			for (var i = start; i < start + this.props.pages; i++) {
				_loop(i);
			}
			return _react2.default.createElement(
				"ul",
				{ className: "pagination" },
				_react2.default.createElement(
					"li",
					{ className: this.state.currentValue === 1 ? "disabled" : "waves-effect" },
					_react2.default.createElement(
						"a",
						{ className: "rbc-page-previous", onClick: this.prePage },
						_react2.default.createElement("i", { className: "fa fa-angle-left" })
					)
				),
				start !== 1 ? _react2.default.createElement(
					"li",
					{ className: "rbc-page-one " + (this.state.currentValue === 1 ? "disabled" : "waves-effect") },
					_react2.default.createElement(
						"a",
						{ className: "rbc-page-previous", onClick: this.firstPage },
						"1"
					)
				) : null,
				numbers,
				_react2.default.createElement(
					"li",
					{ className: this.state.currentValue === this.state.maxPageNumber ? "disabled" : "waves-effect" },
					_react2.default.createElement(
						"a",
						{ className: "rbc-page-next", onClick: this.nextPage },
						_react2.default.createElement("i", { className: "fa fa-angle-right" })
					)
				)
			);
		}

		// render

	}, {
		key: "render",
		value: function render() {
			var title = null;
			var titleExists = false;
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
				{ className: "rbc rbc-pagination col s12 col-xs-12 " + cx + " " + this.props.className },
				title,
				_react2.default.createElement(
					"div",
					{ className: "col s12 col-xs-12" },
					this.renderPageNumber()
				)
			);
		}
	}]);

	return Pagination;
}(_react.Component);

exports.default = Pagination;


Pagination.propTypes = {
	componentId: _react2.default.PropTypes.string.isRequired,
	title: _react2.default.PropTypes.string,
	onPageChange: _react2.default.PropTypes.func,
	pages: _reactivemaps.AppbaseSensorHelper.pagesValidation
};

// Default props value
Pagination.defaultProps = {
	pages: 10
};

// context type
Pagination.contextTypes = {
	appbaseRef: _react2.default.PropTypes.any.isRequired,
	type: _react2.default.PropTypes.any.isRequired
};