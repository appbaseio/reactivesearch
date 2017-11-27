import React, { Component } from "react";
import { connect } from "react-redux";
import Autosuggest from "react-autosuggest";

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryOptions
} from "@appbaseio/reactivecore/lib/actions";
import {
	isEqual,
	debounce,
	pushToAndClause,
	checkValueChange
} from "@appbaseio/reactivecore/lib/utils/helper";

import types from "@appbaseio/reactivecore/lib/utils/types";
import Title from "../../styles/Title";
import Input, { input, suggestions } from "../../styles/Input";

class DataSearch extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentValue: "",
			suggestions: []
		};
		this.internalComponent = props.componentId + "__internal";
	}

	componentDidMount() {
		this.props.addComponent(this.props.componentId);
		this.props.addComponent(this.internalComponent);

		if (this.props.highlight) {
			const queryOptions = this.highlightQuery(this.props);
			this.props.setQueryOptions(this.props.componentId, queryOptions);
		}
		this.setReact(this.props);

		if (this.props.defaultSelected) {
			this.setValue(this.props.defaultSelected, true);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.highlight &&
			!isEqual(this.props.dataField, nextProps.dataField) ||
			!isEqual(this.props.highlightField, nextProps.highlightField)) {
			const queryOptions = this.highlightQuery(nextProps);
			this.props.setQueryOptions(this.props.componentId, queryOptions);
		}

		if (!isEqual(nextProps.react, this.props.react)) {
			this.setReact(nextProps);
		}

		if (Array.isArray(nextProps.suggestions)
			&& !isEqual(this.props.suggestions, nextProps.suggestions)
			&& this.state.currentValue.trim() !== "") {
			this.setState({
				suggestions: this.onSuggestions(nextProps.suggestions)
			});
		}

		if (this.props.defaultSelected !== nextProps.defaultSelected) {
			this.setValue(nextProps.defaultSelected, true);
		}
	}

	componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
		this.props.removeComponent(this.internalComponent);
	}

	setReact = (props) => {
		const { react } = props;
		if (react) {
			const newReact = pushToAndClause(react, this.internalComponent);
			props.watchComponent(props.componentId, newReact);
		} else {
			props.watchComponent(props.componentId, { and: this.internalComponent });
		}
	}

	highlightQuery = (props) => {
		const fields = {};
		const highlightField = props.highlightField ? props.highlightField : props.dataField;

		if (typeof highlightField === "string") {
			fields[highlightField] = {};
		} else if (Array.isArray(highlightField)) {
			highlightField.forEach((item) => {
				fields[item] = {};
			});
		}

		return {
			highlight: {
				pre_tags: ["<em>"],
				post_tags: ["</em>"],
				fields
			}
		};
	}

	defaultQuery = (value) => {
		let finalQuery = null,
			fields;
		if (value) {
			if (Array.isArray(this.props.dataField)) {
				fields = this.props.dataField;
			} else {
				fields = [this.props.dataField];
			}
			finalQuery = {
				bool: {
					should: this.shouldQuery(value, fields),
					minimum_should_match: "1"
				}
			};
		}

		if (value === "") {
			finalQuery = {
				"match_all": {}
			}
		}

		return finalQuery;
	};

	shouldQuery = (value, dataFields) => {
		const fields = dataFields.map(
			(field, index) => `${field}${(Array.isArray(this.props.fieldWeights) && this.props.fieldWeights[index]) ? ("^" + this.props.fieldWeights[index]) : ""}`
		);

		if (this.props.queryFormat === "and") {
			return [
				{
					multi_match: {
						query: value,
						fields,
						type: "cross_fields",
						operator: "and",
						fuzziness: this.props.fuzziness ? this.props.fuzziness : 0
					}
				},
				{
					multi_match: {
						query: value,
						fields,
						type: "phrase_prefix",
						operator: "and"
					}
				}
			];
		}

		return [
			{
				multi_match: {
					query: value,
					fields,
					type: "best_fields",
					operator: "or",
					fuzziness: this.props.fuzziness ? this.props.fuzziness : 0
				}
			},
			{
				multi_match: {
					query: value,
					fields,
					type: "phrase_prefix",
					operator: "or"
				}
			}
		];
	};

	onSuggestions = (suggestions) => {
		if (this.props.onSuggestions) {
			return this.props.onSuggestions(suggestions);
		}

		const fields = Array.isArray(this.props.dataField) ? this.props.dataField : [this.props.dataField];
		let suggestionsList = [];
		let labelsList = [];
		const currentValue = this.state.currentValue.toLowerCase();

		suggestions.forEach(item => {
			fields.forEach(field => {
				const label = item._source[field];
				const val = label.toLowerCase();

				if (val.includes(currentValue) && !labelsList.includes(val)) {
					const option = {
						label,
						value: label
					};
					labelsList = [...labelsList, val];
					suggestionsList = [...suggestionsList, option];
				}
			});
		});

		return suggestionsList;
	};

	setValue = (value, isDefaultValue = false) => {
		const performUpdate = () => {
			this.setState({
				currentValue: value
			});
			if (isDefaultValue) {
				if (this.props.autoSuggest) {
					this.updateQuery(this.internalComponent, value);
				}
				this.updateQuery(this.props.componentId, value);
			} else {
				// debounce for handling text while typing
				this.handleTextChange(value);
			}
		}
		checkValueChange(
			this.props.componentId,
			value,
			this.props.beforeValueChange,
			this.props.onValueChange,
			performUpdate
		);
	};

	handleTextChange = debounce((value) => {
		if (this.props.autoSuggest) {
			this.updateQuery(this.internalComponent, value);
		} else {
			this.updateQuery(this.props.componentId, value);
		}
	}, 300);

	updateQuery = (component, value) => {
		const query = this.props.customQuery || this.defaultQuery;
		let callback = null;
		if (component === this.props.componentId && this.props.onQueryChange) {
			callback = this.props.onQueryChange;
		}
		this.props.updateQuery(component, query(value), callback);
	};

	handleBlur = (event, { highlightedSuggestion }) => {
		if (!highlightedSuggestion || !highlightedSuggestion.label) {
			this.setValue(this.state.currentValue, true);
		}
		if (this.props.onBlur) {
			this.props.onBlur(event);
		}
	};

	handleKeyPress = (event) => {
		if (event.key === "Enter") {
			event.target.blur();
		}
		if (this.props.onKeyPress) {
			this.props.onKeyPress(event);
		}
	};

	onInputChange = (event, { method, newValue }) => {
		if (method === "type") {
			this.setValue(newValue);
		}
	};

	onSuggestionSelected = (event, { suggestion }) => {
		this.setValue(suggestion.value, true);
	};

	getSuggestionValue(suggestion) {
		return suggestion.label.innerText || suggestion.label;
	}

	renderSuggestion(suggestion) {
		return <span>{suggestion.label}</span>;
	}

	render() {
		const suggestionsList = this.state.currentValue === "" || this.state.currentValue === null
			? this.props.defaultSuggestions && this.props.defaultSuggestions.length
				? this.props.defaultSuggestions
				: []
			: this.state.suggestions;

		return (
			<div>
				{
					this.props.title
						? (<Title>{this.props.title}</Title>)
						: null
				}
				{
					this.props.autoSuggest
						? (<Autosuggest
							theme={{
								input,
								suggestionsContainerOpen : suggestions
							}}
							suggestions={suggestionsList}
							onSuggestionsFetchRequested={() => {}}
							onSuggestionsClearRequested={() => {}}
							onSuggestionSelected={this.onSuggestionSelected}
							getSuggestionValue={this.getSuggestionValue}
							renderSuggestion={this.renderSuggestion}
							shouldRenderSuggestions={() => true}
							focusInputOnSuggestionClick={false}
							inputProps={{
								placeholder: this.props.placeholder,
								value: this.state.currentValue === null ? "" : this.state.currentValue,
								onChange: this.onInputChange,
								onBlur: this.handleBlur,
								onKeyPress: this.handleKeyPress,
								onFocus: this.props.onFocus,
								onKeyDown: this.props.onKeyDown,
								onKeyUp: this.props.onKeyUp
							}}
						/>)
						: (<Input
							placeholder={this.props.placeholder}
							value={this.state.currentValue ? this.state.currentValue : ""}
							onChange={(e) => this.setValue(e.target.value)}
							onBlur={this.props.onBlur}
							onFocus={this.props.onFocus}
							onKeyPress={this.props.onKeyPress}
							onKeyDown={this.props.onKeyDown}
							onKeyUp={this.props.onKeyUp}
							autoFocus={this.props.autoFocus}
						/>)
				}
			</div>
		);
	}
}

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
}

DataSearch.defaultProps = {
	placeholder: "Search",
	autoSuggest: true,
	queryFormat: "or"
}

const mapStateToProps = (state, props) => ({
	suggestions: state.hits[props.componentId] && state.hits[props.componentId].hits
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	updateQuery: (component, query, onQueryChange) => dispatch(updateQuery(component, query, onQueryChange)),
	setQueryOptions: (component, props) => dispatch(setQueryOptions(component, props))
});

export default connect(mapStateToProps, mapDispatchtoProps)(DataSearch);
