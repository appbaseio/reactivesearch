var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import { connect } from "react-redux";

import { addComponent as _addComponent, removeComponent as _removeComponent, watchComponent as _watchComponent, setQueryOptions as _setQueryOptions, updateQuery as _updateQuery, loadMore as _loadMore } from "@appbaseio/reactivecore/lib/actions";
import { isEqual, getQueryOptions, pushToAndClause } from "@appbaseio/reactivecore/lib/utils/helper";
import types from "@appbaseio/reactivecore/lib/utils/types";

import Button, { pagination } from "../../styles/Button";

var ReactiveList = function (_Component) {
	_inherits(ReactiveList, _Component);

	function ReactiveList(props) {
		_classCallCheck(this, ReactiveList);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_initialiseProps.call(_this);

		_this.state = {
			from: 0,
			isLoading: false,
			totalPages: 0,
			currentPage: 0
		};
		_this.internalComponent = _this.props.componentId + "__internal";
		return _this;
	}

	ReactiveList.prototype.componentDidMount = function componentDidMount() {
		this.props.addComponent(this.internalComponent);
		this.props.addComponent(this.props.componentId);

		var options = getQueryOptions(this.props);
		if (this.props.sortBy) {
			var _ref;

			options.sort = [(_ref = {}, _ref[this.props.dataField] = {
				order: this.props.sortBy
			}, _ref)];
		}

		// Override sort query with defaultQuery's sort if defined
		var defaultQuery = null;
		if (this.props.defaultQuery) {
			defaultQuery = this.props.defaultQuery();
			if (defaultQuery.sort) {
				options.sort = defaultQuery.sort;
			}
		}

		this.props.setQueryOptions(this.props.componentId, options);
		this.setReact(this.props);

		if (defaultQuery) {
			var _defaultQuery = defaultQuery,
			    sort = _defaultQuery.sort,
			    query = _objectWithoutProperties(_defaultQuery, ["sort"]);

			this.props.updateQuery(this.internalComponent, query);
		} else {
			this.props.updateQuery(this.internalComponent, null);
		}

		if (!this.props.pagination) {
			window.addEventListener("scroll", this.scrollHandler);
		}
	};

	ReactiveList.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
		if (this.props.sortBy !== nextProps.sortBy || this.props.size !== nextProps.size) {
			var options = getQueryOptions(nextProps);
			if (this.props.sortBy) {
				var _ref2;

				options.sort = [(_ref2 = {}, _ref2[this.props.dataField] = {
					order: this.props.sortBy
				}, _ref2)];
			}
			this.props.setQueryOptions(this.props.componentId, options);
		}

		if (!isEqual(nextProps.react, this.props.react)) {
			this.setReact(nextProps);
		}

		if (!nextProps.pagination && this.props.hits && nextProps.hits && (this.props.hits.length < nextProps.hits.length || nextProps.hits.length === nextProps.total)) {
			this.setState({
				isLoading: false
			});
		}

		if (!nextProps.pagination && nextProps.hits && this.props.hits && nextProps.hits.length < this.props.hits.length) {
			window.scrollTo(0, 0);
			this.setState({
				from: 0,
				isLoading: false
			});
		}

		if (nextProps.pagination && nextProps.total !== this.props.total) {
			this.setState({
				totalPages: nextProps.total / nextProps.size,
				currentPage: 0
			});
		}

		if (nextProps.pagination !== this.props.pagination) {
			if (nextProps.pagination) {
				window.addEventListener("scroll", this.scrollHandler);
			} else {
				window.removeEventListener("scroll", this.scrollHandler);
			}
		}
	};

	ReactiveList.prototype.componentWillUnmount = function componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
	};

	ReactiveList.prototype.render = function render() {
		var _this2 = this;

		var results = this.parseHits(this.props.hits) || [];
		return React.createElement(
			"div",
			null,
			this.props.pagination && this.props.paginationAt !== "bottom" ? this.renderPagination() : null,
			this.props.onAllData ? this.props.onAllData(this.parseHits(this.props.hits), this.loadMore) : React.createElement(
				"div",
				null,
				results.map(function (item) {
					return _this2.props.onData(item);
				})
			),
			this.state.isLoading && !this.props.pagination ? React.createElement(
				"div",
				null,
				"Loading..."
			) : null,
			this.props.pagination && this.props.paginationAt !== "top" ? this.renderPagination() : null
		);
	};

	return ReactiveList;
}(Component);

var _initialiseProps = function _initialiseProps() {
	var _this3 = this;

	this.setReact = function (props) {
		var react = props.react;

		if (react) {
			var newReact = pushToAndClause(react, _this3.internalComponent);
			props.watchComponent(props.componentId, newReact);
		} else {
			props.watchComponent(props.componentId, { and: _this3.internalComponent });
		}
	};

	this.scrollHandler = function () {
		if (!_this3.state.isLoading && window.innerHeight + window.scrollY + 300 >= document.body.offsetHeight) {
			_this3.loadMore();
		}
	};

	this.loadMore = function () {
		if (_this3.props.hits && !_this3.props.pagination && _this3.props.total !== _this3.props.hits.length) {
			var value = _this3.state.from + _this3.props.size;
			var options = getQueryOptions(_this3.props);
			_this3.setState({
				from: value,
				isLoading: true
			});
			_this3.props.loadMore(_this3.props.componentId, _extends({}, options, {
				from: value
			}), true);
		} else if (_this3.state.isLoading) {
			_this3.setState({
				isLoading: false
			});
		}
	};

	this.setPage = function (page) {
		var value = _this3.props.size * page;
		var options = getQueryOptions(_this3.props);
		_this3.setState({
			from: value,
			isLoading: true,
			currentPage: page
		});
		_this3.props.loadMore(_this3.props.componentId, _extends({}, options, {
			from: value
		}), false);
	};

	this.prevPage = function () {
		if (_this3.state.currentPage) {
			_this3.setPage(_this3.state.currentPage - 1);
		}
	};

	this.nextPage = function () {
		if (_this3.state.currentPage < _this3.state.totalPages) {
			_this3.setPage(_this3.state.currentPage + 1);
		}
	};

	this.getStart = function () {
		var midValue = parseInt(_this3.props.pages / 2, 10);
		var start = _this3.state.currentPage - midValue;
		return start > 1 ? start : 2;
	};

	this.renderPagination = function () {
		var start = _this3.getStart(),
		    pages = [];

		var _loop = function _loop(i) {
			var pageBtn = React.createElement(
				Button,
				{ primary: _this3.state.currentPage === i - 1, key: i - 1, onClick: function onClick() {
						return _this3.setPage(i - 1);
					} },
				i
			);
			if (i <= _this3.state.totalPages + 1) {
				pages.push(pageBtn);
			}
		};

		for (var i = start; i < start + _this3.props.pages - 1; i++) {
			_loop(i);
		}

		if (!_this3.state.totalPages) {
			return null;
		}

		return React.createElement(
			"div",
			{ className: pagination },
			React.createElement(
				Button,
				{ disabled: _this3.state.currentPage === 0, onClick: _this3.prevPage },
				"Prev"
			),
			React.createElement(
				Button,
				{ primary: _this3.state.currentPage === 0, onClick: function onClick() {
						return _this3.setPage(0);
					} },
				"1"
			),
			pages,
			React.createElement(
				Button,
				{ disabled: _this3.state.currentPage >= _this3.state.totalPages - 1, onClick: _this3.nextPage },
				"Next"
			)
		);
	};

	this.highlightResults = function (result) {
		var data = _extends({}, result);
		if (data.highlight) {
			Object.keys(data.highlight).forEach(function (highlightItem) {
				var _Object$assign;

				var highlightValue = data.highlight[highlightItem][0];
				data._source = Object.assign({}, data._source, (_Object$assign = {}, _Object$assign[highlightItem] = highlightValue, _Object$assign));
			});
		}
		return data;
	};

	this.parseHits = function (hits) {
		var results = null;
		if (hits) {
			results = [].concat(hits).map(_this3.highlightResults);
		}
		return results;
	};
};

ReactiveList.propTypes = {
	addComponent: types.addComponent,
	componentId: types.componentId,
	sortBy: types.sortBy,
	dataField: types.dataField,
	setQueryOptions: types.setQueryOptions,
	defaultQuery: types.defaultQuery,
	updateQuery: types.updateQuery,
	size: types.size,
	react: types.react,
	pagination: types.pagination,
	paginationAt: types.paginationAt,
	hits: types.hits,
	total: types.total,
	removeComponent: types.removeComponent,
	loadMore: types.loadMore,
	pages: types.pages,
	onAllData: types.onAllData,
	onData: types.onData
};

ReactiveList.defaultProps = {
	pagination: false,
	paginationAt: "bottom",
	pages: 5,
	size: 10,
	from: 0
};

var mapStateToProps = function mapStateToProps(state, props) {
	return {
		hits: state.hits[props.componentId] && state.hits[props.componentId].hits,
		total: state.hits[props.componentId] && state.hits[props.componentId].total
	};
};

var mapDispatchtoProps = function mapDispatchtoProps(dispatch) {
	return {
		addComponent: function addComponent(component) {
			return dispatch(_addComponent(component));
		},
		removeComponent: function removeComponent(component) {
			return dispatch(_removeComponent(component));
		},
		watchComponent: function watchComponent(component, react) {
			return dispatch(_watchComponent(component, react));
		},
		setQueryOptions: function setQueryOptions(component, props) {
			return dispatch(_setQueryOptions(component, props));
		},
		updateQuery: function updateQuery(component, query) {
			return dispatch(_updateQuery(component, query));
		},
		loadMore: function loadMore(component, options, append) {
			return dispatch(_loadMore(component, options, append));
		}
	};
};

export default connect(mapStateToProps, mapDispatchtoProps)(ReactiveList);