function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import { connect } from "react-redux";

import { addComponent as _addComponent, removeComponent as _removeComponent, watchComponent as _watchComponent, updateQuery as _updateQuery, setQueryOptions as _setQueryOptions } from "@appbaseio/reactivecore/lib/actions";
import { isEqual, getQueryOptions, pushToAndClause, checkValueChange, getAggsOrder } from "@appbaseio/reactivecore/lib/utils/helper";

import types from "@appbaseio/reactivecore/lib/utils/types";

import Title from "../../styles/Title";
import { UL, Radio } from "../../styles/FormControlList";

var SingleList = function (_Component) {
	_inherits(SingleList, _Component);

	function SingleList(props) {
		_classCallCheck(this, SingleList);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_initialiseProps.call(_this);

		_this.state = {
			currentValue: "",
			options: []
		};
		_this.type = "term";
		_this.internalComponent = props.componentId + "__internal";
		return _this;
	}

	SingleList.prototype.componentDidMount = function componentDidMount() {
		var _queryOptions$aggs;

		this.props.addComponent(this.internalComponent);
		this.props.addComponent(this.props.componentId);
		this.setReact(this.props);

		var queryOptions = getQueryOptions(this.props);
		queryOptions.aggs = (_queryOptions$aggs = {}, _queryOptions$aggs[this.props.dataField] = {
			terms: {
				field: this.props.dataField,
				size: 100,
				order: getAggsOrder(this.props.sortBy)
			}
		}, _queryOptions$aggs);
		this.props.setQueryOptions(this.internalComponent, queryOptions);
		// Since the queryOptions are attached to the internal component,
		// we need to notify the subscriber (parent component)
		// that the query has changed because no new query will be
		// auto-generated for the internal component as its
		// dependency tree is empty
		this.props.updateQuery(this.internalComponent, null);

		if (this.props.defaultSelected) {
			this.setValue(this.props.defaultSelected);
		}
	};

	SingleList.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
		if (!isEqual(nextProps.react, this.props.react)) {
			this.setReact(nextProps);
		}
		if (!isEqual(nextProps.options, this.props.options)) {
			this.setState({
				options: nextProps.options[nextProps.dataField].buckets || []
			});
		}
		if (this.props.defaultSelected !== nextProps.defaultSelected) {
			this.setValue(nextProps.defaultSelected);
		} else if (this.state.currentValue !== nextProps.selectedValue) {
			this.setValue(nextProps.selectedValue || "");
		}
	};

	SingleList.prototype.componentWillUnmount = function componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
		this.props.removeComponent(this.internalComponent);
	};

	SingleList.prototype.render = function render() {
		var _this2 = this;

		return React.createElement(
			"div",
			null,
			this.props.title ? React.createElement(
				Title,
				null,
				this.props.title
			) : null,
			React.createElement(
				UL,
				null,
				this.state.options.map(function (item) {
					return React.createElement(
						"li",
						{ key: item.key },
						React.createElement(Radio, {
							id: item.key,
							name: _this2.props.componentId,
							value: item.key,
							onClick: function onClick(e) {
								return _this2.setValue(e.target.value);
							},
							checked: _this2.state.currentValue === item.key,
							show: _this2.props.showRadio
						}),
						React.createElement(
							"label",
							{ htmlFor: item.key },
							item.key
						)
					);
				})
			)
		);
	};

	return SingleList;
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

	this.defaultQuery = function (value) {
		if (_this3.selectAll) {
			return {
				exists: {
					field: [_this3.props.dataField]
				}
			};
		} else if (value) {
			var _this3$type, _ref;

			return _ref = {}, _ref[_this3.type] = (_this3$type = {}, _this3$type[_this3.props.dataField] = value, _this3$type), _ref;
		}
		return null;
	};

	this.setValue = function (value) {
		if (value == _this3.state.currentValue) {
			value = "";
		}

		var performUpdate = function performUpdate() {
			_this3.setState({
				currentValue: value
			});
			_this3.updateQuery(value);
		};

		checkValueChange(_this3.props.componentId, value, _this3.props.beforeValueChange, _this3.props.onValueChange, performUpdate);
	};

	this.updateQuery = function (value) {
		var query = _this3.props.customQuery || _this3.defaultQuery;
		var callback = null;
		if (_this3.props.onQueryChange) {
			callback = _this3.props.onQueryChange;
		}
		_this3.props.updateQuery(_this3.props.componentId, query(value), value, _this3.props.filterLabel, callback, _this3.props.URLParams);
	};
};

SingleList.propTypes = {
	componentId: types.componentId,
	addComponent: types.addComponent,
	dataField: types.dataField,
	sortBy: types.sortByWithCount,
	setQueryOptions: types.setQueryOptions,
	updateQuery: types.updateQuery,
	defaultSelected: types.string,
	react: types.react,
	options: types.options,
	removeComponent: types.removeComponent,
	beforeValueChange: types.beforeValueChange,
	onValueChange: types.onValueChange,
	customQuery: types.customQuery,
	onQueryChange: types.onQueryChange,
	placeholder: types.placeholder,
	title: types.title,
	showRadio: types.showInputControl,
	filterLabel: types.string,
	selectedValue: types.selectedValue,
	URLParams: types.URLParams
};

SingleList.defaultProps = {
	size: 100,
	sortBy: "count",
	showRadio: true
};

var mapStateToProps = function mapStateToProps(state, props) {
	return {
		options: state.aggregations[props.componentId],
		selectedValue: state.selectedValues[props.componentId] && state.selectedValues[props.componentId].value || null
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
		updateQuery: function updateQuery(component, query, value, label, onQueryChange, URLParams) {
			return dispatch(_updateQuery(component, query, value, label, onQueryChange, URLParams));
		},
		setQueryOptions: function setQueryOptions(component, props) {
			return dispatch(_setQueryOptions(component, props));
		}
	};
};

export default connect(mapStateToProps, mapDispatchtoProps)(SingleList);