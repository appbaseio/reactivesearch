function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import { connect } from "react-redux";

import { addComponent as _addComponent, removeComponent as _removeComponent, watchComponent as _watchComponent, updateQuery as _updateQuery, setQueryOptions as _setQueryOptions } from "@appbaseio/reactivecore/lib/actions";
import { isEqual, getQueryOptions, pushToAndClause, checkValueChange, getAggsOrder } from "@appbaseio/reactivecore/lib/utils/helper";

import types from "@appbaseio/reactivecore/lib/utils/types";

import Title from "../../styles/Title";
import { UL, Checkbox } from "../../styles/FormControlList";

var MultiList = function (_Component) {
	_inherits(MultiList, _Component);

	function MultiList(props) {
		_classCallCheck(this, MultiList);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_initialiseProps.call(_this);

		_this.state = {
			currentValue: {},
			options: []
		};
		_this.type = props.queryFormat === "or" ? "terms" : "term";
		_this.internalComponent = props.componentId + "__internal";
		return _this;
	}

	MultiList.prototype.componentDidMount = function componentDidMount() {
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

	MultiList.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
		var _this2 = this;

		if (!isEqual(nextProps.react, this.props.react)) {
			this.setReact(nextProps);
		}
		if (!isEqual(nextProps.options, this.props.options)) {
			this.setState({
				options: nextProps.options[nextProps.dataField].buckets || []
			});
		}

		var selectedValue = Object.keys(this.state.currentValue).filter(function (item) {
			return _this2.state.currentValue[item];
		});

		if (this.props.defaultSelected !== nextProps.defaultSelected) {
			this.setValue(nextProps.defaultSelected, true);
		} else if (!isEqual(selectedValue, nextProps.selectedValue)) {
			this.setValue(nextProps.selectedValue, true);
		}
	};

	MultiList.prototype.componentWillUnmount = function componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
		this.props.removeComponent(this.internalComponent);
	};

	MultiList.prototype.render = function render() {
		var _this3 = this;

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
						React.createElement(Checkbox, {
							id: item.key,
							name: _this3.props.componentId,
							value: item.key,
							onClick: function onClick(e) {
								return _this3.setValue(e.target.value);
							},
							checked: !!_this3.state.currentValue[item.key],
							onChange: function onChange() {},
							show: _this3.props.showCheckbox
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

	return MultiList;
}(Component);

var _initialiseProps = function _initialiseProps() {
	var _this4 = this;

	this.setReact = function (props) {
		var react = props.react;

		if (react) {
			var newReact = pushToAndClause(react, _this4.internalComponent);
			props.watchComponent(props.componentId, newReact);
		} else {
			props.watchComponent(props.componentId, { and: _this4.internalComponent });
		}
	};

	this.defaultQuery = function (value) {
		var query = null;
		if (_this4.selectAll) {
			query = {
				exists: {
					field: [_this4.props.dataField]
				}
			};
		} else if (value) {
			var listQuery = void 0;
			if (_this4.props.queryFormat === "or") {
				var _this4$type, _listQuery;

				listQuery = (_listQuery = {}, _listQuery[_this4.type] = (_this4$type = {}, _this4$type[_this4.props.dataField] = value, _this4$type), _listQuery);
			} else {
				// adds a sub-query with must as an array of objects for each term/value
				var queryArray = value.map(function (item) {
					var _this4$type2, _ref;

					return _ref = {}, _ref[_this4.type] = (_this4$type2 = {}, _this4$type2[_this4.props.dataField] = item, _this4$type2), _ref;
				});
				listQuery = {
					bool: {
						must: queryArray
					}
				};
			}

			query = value.length ? listQuery : null;
		}
		return query;
	};

	this.setValue = function (value) {
		var isDefaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
		var currentValue = _this4.state.currentValue;

		var finalValues = null;

		if (isDefaultValue) {
			finalValues = value;
			currentValue = {};
			value && value.forEach(function (item) {
				currentValue[item] = true;
			});
		} else {
			currentValue[value] = currentValue[value] ? false : true;
			finalValues = Object.keys(currentValue).filter(function (item) {
				return currentValue[item];
			});
		}

		var performUpdate = function performUpdate() {
			_this4.setState({
				currentValue: currentValue
			});
			_this4.updateQuery(finalValues);
		};

		checkValueChange(_this4.props.componentId, finalValues, _this4.props.beforeValueChange, _this4.props.onValueChange, performUpdate);
	};

	this.updateQuery = function (value) {
		var query = _this4.props.customQuery || _this4.defaultQuery;
		var callback = null;
		if (_this4.props.onQueryChange) {
			callback = _this4.props.onQueryChange;
		}
		_this4.props.updateQuery(_this4.props.componentId, query(value), value, _this4.props.filterLabel, callback, _this4.props.URLParams);
	};
};

MultiList.propTypes = {
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
	showCheckbox: types.showInputControl,
	filterLabel: types.string,
	selectedValue: types.selectedValue,
	queryFormat: types.queryFormatSearch,
	URLParams: types.URLParams
};

MultiList.defaultProps = {
	size: 100,
	sortBy: "count",
	showCheckbox: true,
	queryFormat: "or"
};

var mapStateToProps = function mapStateToProps(state, props) {
	return {
		options: state.aggregations[props.componentId],
		selectedValue: state.selectedValues[props.componentId] && state.selectedValues[props.componentId].value || []
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

export default connect(mapStateToProps, mapDispatchtoProps)(MultiList);