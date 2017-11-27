var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import { connect } from "react-redux";
import Downshift from "downshift";

import { addComponent as _addComponent, removeComponent as _removeComponent, watchComponent as _watchComponent, updateQuery as _updateQuery, setQueryOptions as _setQueryOptions } from "@appbaseio/reactivecore/lib/actions";
import { isEqual, debounce, pushToAndClause, checkValueChange } from "@appbaseio/reactivecore/lib/utils/helper";

import types from "@appbaseio/reactivecore/lib/utils/types";
import Title from "../../styles/Title";
import Input, { input, suggestions } from "../../styles/Input";

var DataSearch = function (_Component) {
	_inherits(DataSearch, _Component);

	function DataSearch(props) {
		_classCallCheck(this, DataSearch);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_initialiseProps.call(_this);

		_this.state = {
			currentValue: "",
			suggestions: [],
			isOpen: false
		};
		_this.internalComponent = props.componentId + "__internal";
		return _this;
	}

	DataSearch.prototype.componentDidMount = function componentDidMount() {
		this.props.addComponent(this.props.componentId);
		this.props.addComponent(this.internalComponent);

		if (this.props.highlight) {
			var queryOptions = this.highlightQuery(this.props);
			this.props.setQueryOptions(this.props.componentId, queryOptions);
		}
		this.setReact(this.props);

		if (this.props.defaultSelected) {
			this.setValue(this.props.defaultSelected, true);
		}
	};

	DataSearch.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
		if (nextProps.highlight && !isEqual(this.props.dataField, nextProps.dataField) || !isEqual(this.props.highlightField, nextProps.highlightField)) {
			var queryOptions = this.highlightQuery(nextProps);
			this.props.setQueryOptions(this.props.componentId, queryOptions);
		}

		if (!isEqual(nextProps.react, this.props.react)) {
			this.setReact(nextProps);
		}

		if (Array.isArray(nextProps.suggestions) && !isEqual(this.props.suggestions, nextProps.suggestions) && this.state.currentValue.trim() !== "") {
			this.setState({
				suggestions: this.onSuggestions(nextProps.suggestions)
			});
		}

		if (this.props.defaultSelected !== nextProps.defaultSelected) {
			this.setValue(nextProps.defaultSelected, true);
		}
	};

	DataSearch.prototype.componentWillUnmount = function componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
		this.props.removeComponent(this.internalComponent);
	};

	DataSearch.prototype.render = function render() {
		var _this2 = this;

		var suggestionsList = this.state.currentValue === "" || this.state.currentValue === null ? this.props.defaultSuggestions && this.props.defaultSuggestions.length ? this.props.defaultSuggestions : [] : this.state.suggestions;

		return React.createElement(
			"div",
			null,
			this.props.title ? React.createElement(
				Title,
				null,
				this.props.title
			) : null,
			this.props.autoSuggest ? React.createElement(Downshift, {
				onChange: this.onSuggestionSelected,
				onOuterClick: this.handleOuterClick,
				render: function render(_ref) {
					var getInputProps = _ref.getInputProps,
					    getItemProps = _ref.getItemProps;
					return React.createElement(
						"div",
						null,
						React.createElement(Input, getInputProps({
							placeholder: _this2.props.placeholder,
							value: _this2.state.currentValue === null ? "" : _this2.state.currentValue,
							onChange: _this2.onInputChange,
							onBlur: _this2.handleBlur,
							onFocus: _this2.handleFocus,
							onKeyPress: _this2.props.onKeyPress,
							onKeyDown: _this2.handleKeyDown,
							onKeyUp: _this2.props.onKeyUp
						})),
						_this2.state.isOpen && suggestionsList.length ? React.createElement(
							"div",
							{ className: suggestions },
							React.createElement(
								"ul",
								null,
								suggestionsList.map(function (item, index) {
									return React.createElement(
										"li",
										_extends({}, getItemProps({ item: item }), {
											key: item.label
										}),
										item.label
									);
								})
							)
						) : null
					);
				}
			}) : React.createElement(Input, {
				placeholder: this.props.placeholder,
				value: this.state.currentValue ? this.state.currentValue : "",
				onChange: function onChange(e) {
					return _this2.setValue(e.target.value);
				},
				onBlur: this.props.onBlur,
				onFocus: this.props.onFocus,
				onKeyPress: this.props.onKeyPress,
				onKeyDown: this.props.onKeyDown,
				onKeyUp: this.props.onKeyUp,
				autoFocus: this.props.autoFocus
			})
		);
	};

	return DataSearch;
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

	this.highlightQuery = function (props) {
		var fields = {};
		var highlightField = props.highlightField ? props.highlightField : props.dataField;

		if (typeof highlightField === "string") {
			fields[highlightField] = {};
		} else if (Array.isArray(highlightField)) {
			highlightField.forEach(function (item) {
				fields[item] = {};
			});
		}

		return {
			highlight: {
				pre_tags: ["<em>"],
				post_tags: ["</em>"],
				fields: fields
			}
		};
	};

	this.defaultQuery = function (value) {
		var finalQuery = null,
		    fields = void 0;
		if (value) {
			if (Array.isArray(_this3.props.dataField)) {
				fields = _this3.props.dataField;
			} else {
				fields = [_this3.props.dataField];
			}
			finalQuery = {
				bool: {
					should: _this3.shouldQuery(value, fields),
					minimum_should_match: "1"
				}
			};
		}

		if (value === "") {
			finalQuery = {
				"match_all": {}
			};
		}

		return finalQuery;
	};

	this.shouldQuery = function (value, dataFields) {
		var fields = dataFields.map(function (field, index) {
			return "" + field + (Array.isArray(_this3.props.fieldWeights) && _this3.props.fieldWeights[index] ? "^" + _this3.props.fieldWeights[index] : "");
		});

		if (_this3.props.queryFormat === "and") {
			return [{
				multi_match: {
					query: value,
					fields: fields,
					type: "cross_fields",
					operator: "and",
					fuzziness: _this3.props.fuzziness ? _this3.props.fuzziness : 0
				}
			}, {
				multi_match: {
					query: value,
					fields: fields,
					type: "phrase_prefix",
					operator: "and"
				}
			}];
		}

		return [{
			multi_match: {
				query: value,
				fields: fields,
				type: "best_fields",
				operator: "or",
				fuzziness: _this3.props.fuzziness ? _this3.props.fuzziness : 0
			}
		}, {
			multi_match: {
				query: value,
				fields: fields,
				type: "phrase_prefix",
				operator: "or"
			}
		}];
	};

	this.onSuggestions = function (suggestions) {
		if (_this3.props.onSuggestions) {
			return _this3.props.onSuggestions(suggestions);
		}

		var fields = Array.isArray(_this3.props.dataField) ? _this3.props.dataField : [_this3.props.dataField];
		var suggestionsList = [];
		var labelsList = [];
		var currentValue = _this3.state.currentValue.toLowerCase();

		suggestions.forEach(function (item) {
			fields.forEach(function (field) {
				var label = item._source[field];
				var val = label.toLowerCase();

				if (val.includes(currentValue) && !labelsList.includes(val)) {
					var option = {
						label: label,
						value: label
					};
					labelsList = [].concat(labelsList, [val]);
					suggestionsList = [].concat(suggestionsList, [option]);
				}
			});
		});

		return suggestionsList;
	};

	this.setValue = function (value) {
		var isDefaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

		var performUpdate = function performUpdate() {
			_this3.setState({
				currentValue: value
			});
			if (isDefaultValue) {
				if (_this3.props.autoSuggest) {
					_this3.setState({
						isOpen: false
					});
					_this3.updateQuery(_this3.internalComponent, value);
				}
				_this3.updateQuery(_this3.props.componentId, value);
			} else {
				// debounce for handling text while typing
				_this3.handleTextChange(value);
			}
		};
		checkValueChange(_this3.props.componentId, value, _this3.props.beforeValueChange, _this3.props.onValueChange, performUpdate);
	};

	this.handleTextChange = debounce(function (value) {
		if (_this3.props.autoSuggest) {
			_this3.updateQuery(_this3.internalComponent, value);
		} else {
			_this3.updateQuery(_this3.props.componentId, value);
		}
	}, 300);

	this.updateQuery = function (component, value) {
		var query = _this3.props.customQuery || _this3.defaultQuery;
		var callback = null;
		if (component === _this3.props.componentId && _this3.props.onQueryChange) {
			callback = _this3.props.onQueryChange;
		}
		_this3.props.updateQuery(component, query(value), callback);
	};

	this.handleFocus = function (event) {
		_this3.setState({
			isOpen: true
		});
		if (_this3.props.onFocus) {
			_this3.props.onFocus(event);
		}
	};

	this.handleOuterClick = function () {
		_this3.setValue(_this3.state.currentValue, true);
	};

	this.handleBlur = function (event) {
		setTimeout(function () {
			_this3.setState({
				isOpen: false
			});
		}, 10);
		if (_this3.props.onBlur) {
			_this3.props.onBlur(event);
		}
	};

	this.handleKeyDown = function (event) {
		if (event.key === "Enter") {
			event.target.blur();
			_this3.handleBlur();
			_this3.setValue(event.target.value, true);
		}
		if (_this3.props.onKeyDown) {
			_this3.props.onKeyDown(event);
		}
	};

	this.onInputChange = function (e, v) {
		_this3.setValue(e.target.value);
	};

	this.onSuggestionSelected = function (suggestion, event) {
		_this3.setValue(suggestion.value, true);
		if (_this3.props.onBlur) {
			_this3.props.onBlur(event);
		}
	};
};

DataSearch.propTypes = {
	componentId: types.componentId,
	title: types.title,
	addComponent: types.addComponent,
	highlight: types.highlight,
	setQueryOptions: types.setQueryOptions,
	defaultSelected: types.string,
	dataField: types.dataFieldArray,
	highlightField: types.highlightField,
	react: types.react,
	suggestions: types.suggestions,
	defaultSuggestions: types.suggestions,
	removeComponent: types.removeComponent,
	fieldWeights: types.fieldWeights,
	queryFormat: types.queryFormatSearch,
	fuzziness: types.fuzziness,
	autoSuggest: types.autoSuggest,
	beforeValueChange: types.beforeValueChange,
	onValueChange: types.beforeValueChange,
	customQuery: types.customQuery,
	onQueryChange: types.onQueryChange,
	onSuggestions: types.onSuggestions,
	updateQuery: types.updateQuery,
	placeholder: types.placeholder,
	onBlur: types.onBlur,
	onFocus: types.onFocus,
	onKeyPress: types.onKeyPress,
	onKeyDown: types.onKeyDown,
	onKeyUp: types.onKeyUp,
	autoFocus: types.autoFocus
};

DataSearch.defaultProps = {
	placeholder: "Search",
	autoSuggest: true,
	queryFormat: "or"
};

var mapStateToProps = function mapStateToProps(state, props) {
	return {
		suggestions: state.hits[props.componentId] && state.hits[props.componentId].hits
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
		updateQuery: function updateQuery(component, query, onQueryChange) {
			return dispatch(_updateQuery(component, query, onQueryChange));
		},
		setQueryOptions: function setQueryOptions(component, props) {
			return dispatch(_setQueryOptions(component, props));
		}
	};
};

export default connect(mapStateToProps, mapDispatchtoProps)(DataSearch);